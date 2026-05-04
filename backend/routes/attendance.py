from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Attendance, AttendanceSession, User, FraudLog
from utils.geo_validator import is_within_radius
from datetime import datetime
import json

attendance_bp = Blueprint('attendance', __name__)


@attendance_bp.route('/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'student':
        return jsonify({'error': 'Only students can mark attendance'}), 403

    data = request.get_json()

    required = ['session_id', 'qr_token', 'latitude', 'longitude']
    for field in required:
        if data.get(field) is None:
            return jsonify({'error': f'{field} is required'}), 400

    student = User.query.get(identity['id'])

    # Device/session binding check
    if student.active_session_token != identity.get('session_token'):
        log_fraud(
            session_id=data['session_id'],
            student_id=identity['id'],
            reason='Session token mismatch - possible multiple device login',
            details=f"Expected: {student.active_session_token}"
        )
        return jsonify({'error': 'Unauthorized device. Please login again.'}), 401

    # Get attendance session
    session = AttendanceSession.query.get(data['session_id'])
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    if not session.is_active:
        return jsonify({'error': 'Session is no longer active'}), 400

    # QR token validation
    if session.qr_token != data['qr_token']:
        log_fraud(
            session_id=session.id,
            student_id=identity['id'],
            reason='Invalid or expired QR token',
            details=f"Provided token: {data['qr_token'][:20]}..."
        )
        return jsonify({'error': 'QR code is invalid or expired. Please scan again.'}), 400

    # QR expiry check
    if datetime.utcnow() > session.qr_expires_at:
        log_fraud(
            session_id=session.id,
            student_id=identity['id'],
            reason='Expired QR token used',
            details=f"Expired at: {session.qr_expires_at}"
        )
        return jsonify({'error': 'QR code has expired. Please scan the latest QR.'}), 400

    # Geolocation validation
    within_radius, distance = is_within_radius(
        data['latitude'], data['longitude'],
        session.latitude, session.longitude,
        session.radius_meters
    )

    if not within_radius:
        log_fraud(
            session_id=session.id,
            student_id=identity['id'],
            reason='Location out of allowed radius',
            details=f"Distance: {distance}m, Allowed: {session.radius_meters}m"
        )
        return jsonify({
            'error': f'You are {distance}m away. Must be within {session.radius_meters}m.'
        }), 400

    # Check duplicate attendance
    existing = Attendance.query.filter_by(
        session_id=session.id,
        student_id=identity['id']
    ).first()

    if existing:
        return jsonify({'error': 'Attendance already marked for this session'}), 409

    # Mark attendance
    attendance = Attendance(
        session_id=session.id,
        student_id=identity['id'],
        status='present',
        student_latitude=data['latitude'],
        student_longitude=data['longitude'],
        distance_meters=distance
    )

    db.session.add(attendance)
    db.session.commit()

    return jsonify({
        'message': 'Attendance marked successfully!',
        'attendance': {
            'id': attendance.id,
            'status': attendance.status,
            'distance_meters': distance,
            'marked_at': attendance.marked_at.isoformat()
        }
    }), 200


@attendance_bp.route('/session/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session_attendance(session_id):
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    session = AttendanceSession.query.get(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    attendances = Attendance.query.filter_by(session_id=session_id).all()

    result = []
    for a in attendances:
        student = User.query.get(a.student_id)
        result.append({
            'student_name': student.name if student else 'Unknown',
            'roll_number': student.roll_number if student else '-',
            'status': a.status,
            'distance_meters': a.distance_meters,
            'marked_at': a.marked_at.isoformat()
        })

    return jsonify({
        'session_id': session_id,
        'subject': session.subject,
        'total_present': len(result),
        'attendance': result
    }), 200


@attendance_bp.route('/my-history', methods=['GET'])
@jwt_required()
def my_attendance_history():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'student':
        return jsonify({'error': 'Students only'}), 403

    records = Attendance.query.filter_by(student_id=identity['id']).all()

    result = []
    for a in records:
        session = AttendanceSession.query.get(a.session_id)
        result.append({
            'subject': session.subject if session else 'Unknown',
            'status': a.status,
            'distance_meters': a.distance_meters,
            'marked_at': a.marked_at.isoformat()
        })

    return jsonify({'history': result}), 200


@attendance_bp.route('/fraud-logs', methods=['GET'])
@jwt_required()
def get_fraud_logs():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    logs = FraudLog.query.order_by(FraudLog.flagged_at.desc()).limit(50).all()

    result = []
    for log in logs:
        student = User.query.get(log.student_id) if log.student_id else None
        result.append({
            'id': log.id,
            'student_name': student.name if student else 'Unknown',
            'roll_number': student.roll_number if student else '-',
            'session_id': log.session_id,
            'reason': log.reason,
            'details': log.details,
            'flagged_at': log.flagged_at.isoformat()
        })

    return jsonify({'fraud_logs': result}), 200


def log_fraud(session_id, student_id, reason, details=None):
    fraud = FraudLog(
        session_id=session_id,
        student_id=student_id,
        reason=reason,
        details=details
    )
    db.session.add(fraud)
    db.session.commit()
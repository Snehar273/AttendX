from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit
from models import db, AttendanceSession, User, FraudLog
from utils.qr_generator import generate_qr_token, generate_qr_image, get_qr_expiry
from datetime import datetime
import json

sessions_bp = Blueprint('sessions', __name__)
socketio_ref = None  # Will be set from app.py


def init_socketio(socketio):
    global socketio_ref
    socketio_ref = socketio


@sessions_bp.route('/create', methods=['POST'])
@jwt_required()
def create_session():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Only faculty can create sessions'}), 403

    data = request.get_json()

    required = ['subject', 'latitude', 'longitude']
    for field in required:
        if data.get(field) is None:
            return jsonify({'error': f'{field} is required'}), 400

    # Generate initial QR token
    qr_token = generate_qr_token()
    qr_expires_at = get_qr_expiry(15)

    session = AttendanceSession(
        faculty_id=identity['id'],
        subject=data['subject'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        radius_meters=data.get('radius_meters', 100),
        qr_token=qr_token,
        qr_expires_at=qr_expires_at
    )

    db.session.add(session)
    db.session.commit()

    qr_image = generate_qr_image(qr_token)

    return jsonify({
        'message': 'Session created',
        'session': {
            'id': session.id,
            'subject': session.subject,
            'qr_token': qr_token,
            'qr_image': qr_image,
            'qr_expires_at': qr_expires_at.isoformat(),
            'radius_meters': session.radius_meters,
            'is_active': session.is_active
        }
    }), 201


@sessions_bp.route('/<int:session_id>/refresh-qr', methods=['POST'])
@jwt_required()
def refresh_qr(session_id):
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Only faculty can refresh QR'}), 403

    session = AttendanceSession.query.get(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    if not session.is_active:
        return jsonify({'error': 'Session is not active'}), 400

    # Generate new QR token
    new_token = generate_qr_token()
    session.qr_token = new_token
    session.qr_expires_at = get_qr_expiry(15)
    db.session.commit()

    qr_image = generate_qr_image(new_token)

    # Emit new QR to all connected clients via WebSocket
    if socketio_ref:
        socketio_ref.emit('qr_updated', {
            'session_id': session_id,
            'qr_token': new_token,
            'qr_image': qr_image,
            'expires_at': session.qr_expires_at.isoformat()
        }, room=f'session_{session_id}')

    return jsonify({
        'qr_token': new_token,
        'qr_image': qr_image,
        'expires_at': session.qr_expires_at.isoformat()
    }), 200


@sessions_bp.route('/<int:session_id>/end', methods=['POST'])
@jwt_required()
def end_session(session_id):
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Only faculty can end sessions'}), 403

    session = AttendanceSession.query.get(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    session.is_active = False
    session.ended_at = datetime.utcnow()
    db.session.commit()

    if socketio_ref:
        socketio_ref.emit('session_ended', {
            'session_id': session_id
        }, room=f'session_{session_id}')

    return jsonify({'message': 'Session ended successfully'}), 200


@sessions_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_sessions():
    identity = json.loads(get_jwt_identity())

    if identity['role'] == 'faculty':
        sessions = AttendanceSession.query.filter_by(
            faculty_id=identity['id'],
            is_active=True
        ).all()
    else:
        sessions = AttendanceSession.query.filter_by(is_active=True).all()

    result = []
    for s in sessions:
        faculty = User.query.get(s.faculty_id)
        result.append({
            'id': s.id,
            'subject': s.subject,
            'faculty_name': faculty.name if faculty else 'Unknown',
            'radius_meters': s.radius_meters,
            'is_active': s.is_active,
            'created_at': s.created_at.isoformat()
        })

    return jsonify({'sessions': result}), 200


@sessions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_session_history():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    sessions = AttendanceSession.query.filter_by(
        faculty_id=identity['id']
    ).order_by(AttendanceSession.created_at.desc()).all()

    result = []
    for s in sessions:
        count = len(s.attendances)
        result.append({
            'id': s.id,
            'subject': s.subject,
            'is_active': s.is_active,
            'total_attendance': count,
            'created_at': s.created_at.isoformat(),
            'ended_at': s.ended_at.isoformat() if s.ended_at else None
        })

    return jsonify({'sessions': result}), 200
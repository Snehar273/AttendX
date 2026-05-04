from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Attendance, AttendanceSession, User, FraudLog
from sqlalchemy import func
import json

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/overview', methods=['GET'])
@jwt_required()
def overview():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    total_sessions = AttendanceSession.query.filter_by(
        faculty_id=identity['id']
    ).count()

    total_students = User.query.filter_by(role='student').count()

    total_attendance = db.session.query(func.count(Attendance.id)).join(
        AttendanceSession
    ).filter(
        AttendanceSession.faculty_id == identity['id']
    ).scalar()

    total_fraud = FraudLog.query.count()

    return jsonify({
        'total_sessions': total_sessions,
        'total_students': total_students,
        'total_attendance_records': total_attendance,
        'total_fraud_flags': total_fraud
    }), 200


@analytics_bp.route('/subject-wise', methods=['GET'])
@jwt_required()
def subject_wise():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    sessions = AttendanceSession.query.filter_by(
        faculty_id=identity['id']
    ).all()

    result = {}
    for s in sessions:
        count = Attendance.query.filter_by(session_id=s.id).count()
        if s.subject in result:
            result[s.subject] += count
        else:
            result[s.subject] = count

    chart_data = [{'subject': k, 'count': v} for k, v in result.items()]
    return jsonify({'subject_wise': chart_data}), 200


@analytics_bp.route('/student-attendance', methods=['GET'])
@jwt_required()
def student_attendance():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    students = User.query.filter_by(role='student').all()

    result = []
    for student in students:
        total = Attendance.query.filter_by(student_id=student.id).count()
        result.append({
            'name': student.name,
            'roll_number': student.roll_number or '-',
            'total_present': total
        })

    result.sort(key=lambda x: x['total_present'], reverse=True)
    return jsonify({'student_attendance': result}), 200


@analytics_bp.route('/fraud-summary', methods=['GET'])
@jwt_required()
def fraud_summary():
    identity = json.loads(get_jwt_identity())

    if identity['role'] != 'faculty':
        return jsonify({'error': 'Faculty only'}), 403

    logs = FraudLog.query.all()

    reason_counts = {}
    for log in logs:
        reason_counts[log.reason] = reason_counts.get(log.reason, 0) + 1

    chart_data = [{'reason': k, 'count': v} for k, v in reason_counts.items()]
    return jsonify({'fraud_summary': chart_data}), 200
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import uuid
import json

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required = ['name', 'email', 'password', 'role']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    if data['role'] not in ['student', 'faculty']:
        return jsonify({'error': 'Role must be student or faculty'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(data['password'])

    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data['role'],
        roll_number=data.get('roll_number')
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Registration successful'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate session token for device binding
    session_token = str(uuid.uuid4())
    user.active_session_token = session_token
    db.session.commit()

    
    access_token = create_access_token(identity=json.dumps({
        'id': user.id,
        'role': user.role,
        'session_token': session_token
    }))

    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'roll_number': user.roll_number
        }
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    identity = json.loads(get_jwt_identity())
    user = User.query.get(identity['id'])
    if user:
        user.active_session_token = None
        db.session.commit()
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    identity = json.loads(get_jwt_identity())
    user = User.query.get(identity['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'roll_number': user.roll_number
    }), 200
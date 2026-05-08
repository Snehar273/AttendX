from flask import Flask
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from dotenv import load_dotenv
import os
import threading
import time

from models import db
from routes.auth import auth_bp
from routes.sessions import sessions_bp, init_socketio
from routes.attendance import attendance_bp
from routes.analytics import analytics_bp

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'attendx-secret')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'attendx-jwt-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///attendx.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # No expiry for simplicity
app.config['JWT_JSON_KEY'] = 'access_token'

# Extensions
CORS(app, supports_credentials=True)
db.init_app(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Init socketio reference in sessions
init_socketio(socketio)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')


# WebSocket events
@socketio.on('join_session')
def on_join(data):
    session_id = data.get('session_id')
    if session_id:
        join_room(f'session_{session_id}')
        print(f"Client joined session room: session_{session_id}")


@socketio.on('leave_session')
def on_leave(data):
    session_id = data.get('session_id')
    if session_id:
        leave_room(f'session_{session_id}')


# Auto QR refresh every 15 seconds
def auto_refresh_qr():
    from utils.qr_generator import generate_qr_token, generate_qr_image, get_qr_expiry
    while True:
        time.sleep(15)
        with app.app_context():
            from models import AttendanceSession
            active_sessions = AttendanceSession.query.filter_by(is_active=True).all()
            for session in active_sessions:
                new_token = generate_qr_token()
                session.qr_token = new_token
                session.qr_expires_at = get_qr_expiry(15)
                db.session.commit()

                qr_image = generate_qr_image(new_token)
                socketio.emit('qr_updated', {
                    'session_id': session.id,
                    'qr_token': new_token,
                    'qr_image': qr_image,
                    'expires_at': session.qr_expires_at.isoformat()
                }, room=f'session_{session.id}')


# Create tables and start auto QR thread
with app.app_context():
    db.create_all()
    print("✅ Database tables created")

qr_thread = threading.Thread(target=auto_refresh_qr, daemon=True)
qr_thread.start()
print("✅ Auto QR refresh thread started")


@app.route('/')
def index():
    return {'message': 'AttendX Backend Running ✅', 'version': '1.0.0'}


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
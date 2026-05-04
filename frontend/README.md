<div align="center">

<br/>

```
   █████╗ ████████╗████████╗███████╗███╗   ██╗██████╗ ██╗  ██╗
  ██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝████╗  ██║██╔══██╗╚██╗██╔╝
  ███████║   ██║      ██║   █████╗  ██╔██╗ ██║██║  ██║ ╚███╔╝ 
  ██╔══██║   ██║      ██║   ██╔══╝  ██║╚██╗██║██║  ██║ ██╔██╗ 
  ██║  ██║   ██║      ██║   ███████╗██║ ╚████║██████╔╝██╔╝ ██╗
  ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝
```

### 🛡️ Secure Presence Verification System

**Stop proxy attendance. Verify real physical presence.**

[![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003b57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Deployed-46e3b7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **AttendX** is a full-stack attendance verification platform that uses **dynamic QR authentication**, **GPS geolocation**, and **real-time fraud detection** to guarantee authentic physical attendance — making proxy marking technically impossible.

<br/>

[🚀 Live Demo](#) · [📖 API Docs](#api-reference) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---


## ✨ Key Features

### 🔐 Security Core
| Feature | Description |
|---------|-------------|
| **Dynamic QR Codes** | QR tokens auto-rotate every 15 seconds — screenshots and screenshots become useless instantly |
| **GPS Geolocation** | Haversine formula validates students are physically within the classroom radius |
| **Device Binding** | Each login creates a unique session token — multiple device logins are detected and blocked |
| **Fraud Detection** | Every suspicious attempt (wrong QR, wrong location, token mismatch) is logged with full details |
| **Replay Attack Prevention** | Expired tokens are rejected server-side, regardless of when they were captured |

### 👨‍🏫 Faculty Features
- Create attendance sessions with one click + auto-capture classroom GPS coordinates
- Watch live QR code that auto-refreshes every 15 seconds via WebSocket
- Monitor attendance list populating in real time as students scan
- Analytics dashboard with bar charts (subject-wise) and pie charts (fraud breakdown)
- Complete session history with attendance counts
- Full fraud log with student names, reasons, and timestamps

### 👨‍🎓 Student Features
- See all active sessions on the dashboard
- Camera-based QR scanner with GPS verification
- Real-time verification feedback (success / failure with reason)
- Personal attendance history grouped by subject

### 📊 Analytics
- Attendance counts per subject (bar chart)
- Fraud attempt type breakdown (pie chart)
- Student-wise attendance leaderboard
- Overview stats: sessions, students, records, fraud flags

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          AttendX System                              │
│                                                                      │
│   ┌──────────────┐    HTTPS/WSS    ┌───────────────────────────────┐│
│   │   React SPA   │◄──────────────►│       Flask Backend            ││
│   │  (Vercel CDN) │                │       (Render.com)             ││
│   │               │                │                                ││
│   │  ┌──────────┐ │                │  ┌────────┐  ┌─────────────┐  ││
│   │  │ QR Scanner│ │   REST API     │  │  Auth  │  │  Sessions   │  ││
│   │  │(html5-qr) │ │◄─────────────►│  │  JWT   │  │  + QR Gen   │  ││
│   │  └──────────┘ │                │  └────────┘  └─────────────┘  ││
│   │               │                │                                ││
│   │  ┌──────────┐ │   WebSocket    │  ┌────────┐  ┌─────────────┐  ││
│   │  │ Geo API  │ │◄──────────────►│  │  Geo   │  │  Analytics  │  ││
│   │  │(Browser) │ │   (Socket.IO)  │  │Validate│  │  + Fraud    │  ││
│   │  └──────────┘ │                │  └────────┘  └─────────────┘  ││
│   └──────────────┘                │                                ││
│                                   │         ┌────────────────┐     ││
│                                   │         │   SQLite DB    │     ││
│                                   │         │  (attendx.db)  │     ││
│                                   │         └────────────────┘     ││
│                                   └───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 5.0 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 6.x | Client-side routing |
| Axios | 1.6 | HTTP client |
| Socket.IO Client | 4.7 | Real-time QR updates |
| html5-qrcode | 2.3 | Camera QR scanner |
| Recharts | 2.10 | Analytics charts |
| React Hot Toast | 2.4 | Notifications |
| Lucide React | 0.383 | Icon system |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11 | Runtime |
| Flask | 3.x | Web framework |
| Flask-SQLAlchemy | 3.x | ORM |
| Flask-JWT-Extended | 4.x | JWT authentication |
| Flask-SocketIO | 5.x | WebSocket server |
| Flask-CORS | 4.x | Cross-origin requests |
| qrcode | 7.x | QR code generation |
| Pillow | 10.x | Image processing |
| Werkzeug | 3.x | Password hashing |
| python-dotenv | 1.x | Environment config |

---

## 📁 Project Structure

```
attendence_system/
│
├── 📁 backend/
│   ├── 📁 routes/
│   │   ├── auth.py          # Register, login, logout, profile
│   │   ├── sessions.py      # Create/end sessions, QR refresh
│   │   ├── attendance.py    # Mark attendance, fraud logs
│   │   └── analytics.py     # Dashboard stats, charts data
│   ├── 📁 utils/
│   │   ├── qr_generator.py  # Token generation + QR image
│   │   └── geo_validator.py # Haversine distance calculation
│   ├── models.py            # SQLAlchemy models
│   ├── app.py               # Flask app, WebSocket, auto-QR refresh
│   ├── requirements.txt     # Python dependencies
│   └── attendx.db           # SQLite database (auto-created)
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── axios.js          # Axios instance + auth interceptor
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   ├── StatCard.jsx      # Animated metric cards
│   │   │   ├── Logo.jsx          # SVG logo component
│   │   │   ├── Loader.jsx        # Loading spinner
│   │   │   └── ProtectedRoute.jsx# Auth guard wrapper
│   │   ├── 📁 pages/
│   │   │   ├── Login.jsx         # Split-panel login
│   │   │   ├── Register.jsx      # Registration with role select
│   │   │   ├── 📁 faculty/
│   │   │   │   ├── FacultyDashboard.jsx  # Stats + sessions overview
│   │   │   │   ├── CreateSession.jsx     # New session form + GPS
│   │   │   │   ├── SessionView.jsx       # Live QR + attendance list
│   │   │   │   ├── Analytics.jsx         # Charts dashboard
│   │   │   │   ├── FraudLogs.jsx         # Suspicious activity log
│   │   │   │   └── SessionHistory.jsx    # Past sessions
│   │   │   └── 📁 student/
│   │   │       ├── StudentDashboard.jsx  # Active sessions + history
│   │   │       ├── ScanQR.jsx            # Camera scanner + GPS verify
│   │   │       └── MyAttendance.jsx      # Full attendance history
│   │   ├── App.jsx          # Routes + AuthProvider wrapper
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles + animations
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites

Make sure you have these installed:
- [Python 3.11+](https://python.org/downloads)
- [Node.js 18+ and npm 10+](https://nodejs.org)
- [Git](https://git-scm.com)
- VS Code (recommended)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Snehar273/attendence_system.git
cd attendence_system
```

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-sqlalchemy flask-jwt-extended flask-socketio flask-cors qrcode pillow pyotp python-dotenv

# Create .env file
echo "SECRET_KEY=attendx-super-secret-key-2024-production-ready-minimum" > .env
echo "JWT_SECRET_KEY=attendx-jwt-secret-key-2024-minimum-32-bytes-long-secure" >> .env

# Run backend
python app.py
```

Backend runs at: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
# Open a NEW terminal (keep backend running)
cd frontend

# Install dependencies
npm install

# Fix Tailwind v3 (IMPORTANT)
npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4️⃣ First Run — Create Accounts

1. Go to `http://localhost:5173/register`
2. Create a **Faculty** account first
3. Create one or more **Student** accounts
4. Login with faculty → Create a session → Share the QR
5. Login with student → Scan QR → Attendance marked! ✅

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `POST` | `/api/auth/logout` | Invalidate session | ✅ |
| `GET`  | `/api/auth/me` | Get current user profile | ✅ |

### Sessions (Faculty only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sessions/create` | Create attendance session |
| `POST` | `/api/sessions/:id/refresh-qr` | Force-refresh QR code |
| `POST` | `/api/sessions/:id/end` | End active session |
| `GET`  | `/api/sessions/active` | Get all active sessions |
| `GET`  | `/api/sessions/history` | Get session history |

### Attendance

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/attendance/mark` | Mark attendance (QR + GPS) | Student |
| `GET`  | `/api/attendance/session/:id` | Get session attendance | Faculty |
| `GET`  | `/api/attendance/my-history` | Personal history | Student |
| `GET`  | `/api/attendance/fraud-logs` | All fraud attempts | Faculty |

### Analytics (Faculty only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/analytics/overview` | Summary stats |
| `GET`  | `/api/analytics/subject-wise` | Per-subject counts |
| `GET`  | `/api/analytics/student-attendance` | Per-student summary |
| `GET`  | `/api/analytics/fraud-summary` | Fraud type breakdown |

### WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join_session` | Client → Server | `{ session_id }` |
| `leave_session` | Client → Server | `{ session_id }` |
| `qr_updated` | Server → Client | `{ session_id, qr_token, qr_image, expires_at }` |
| `session_ended` | Server → Client | `{ session_id }` |

---

## 🔒 Security Design

```
Student scans QR
       │
       ▼
┌─────────────────┐
│ 1. QR Token     │ ← Does token match server's current token?
│    Validation   │   Tokens rotate every 15s — old ones rejected
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ 2. QR Expiry    │ ← Is token still within 15-second window?
│    Check        │   Server-side expiry, not client-side
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ 3. GPS Location │ ← Is student within allowed radius?
│    Validation   │   Haversine formula, faculty sets radius
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ 4. Device/Session│ ← Is this the same device that logged in?
│    Binding      │   JWT session token matched to DB record
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ 5. Duplicate    │ ← Already marked for this session?
│    Check        │   One attendance record per session
└────────┬────────┘
         │ ✅ Pass
         ▼
    ✅ Attendance Marked
```

Any layer failure → **Fraud log entry created** + descriptive error returned

---

## 🚀 Deployment Guide

### Backend → Render.com

#### Step 1 — Add required files to backend folder

Create `backend/requirements.txt`:
```
flask
flask-sqlalchemy
flask-jwt-extended
flask-socketio
flask-cors
qrcode[pil]
pillow
pyotp
python-dotenv
gunicorn
eventlet
```

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: attendx-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn --worker-class eventlet -w 1 app:app
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### Step 2 — Push to GitHub (see GitHub section below)

#### Step 3 — Deploy on Render
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `gunicorn --worker-class eventlet -w 1 app:app`
6. Add Environment Variables:
   - `SECRET_KEY` = `attendx-super-secret-production-key-minimum-32-chars`
   - `JWT_SECRET_KEY` = `attendx-jwt-production-key-minimum-32-characters-long`
7. Click **Create Web Service**
8. Wait ~3 minutes → copy your URL: `https://attendx-backend.onrender.com`

---

### Frontend → Vercel

#### Step 1 — Update API URL for production

Edit `frontend/src/api/axios.js`:
```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
})
```

Create `frontend/.env.production`:
```
VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com/api
```

Also update the Socket.IO URL in `SessionView.jsx`:
```js
// Change this line:
socketRef.current = io('http://127.0.0.1:5000')
// To:
socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:5000')
```

Add to `.env.production`:
```
VITE_SOCKET_URL=https://YOUR-BACKEND-NAME.onrender.com
```

#### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. **Framework Preset:** Vite
5. Add Environment Variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`
6. Click **Deploy**
7. Your app is live at `https://attendx.vercel.app` 🎉

---

## 📤 GitHub Setup

### First Time — Initialize & Push

```bash
# 1. Go to the ROOT folder of your project
cd C:\projects\attendence_system

# 2. Initialize git
git init

# 3. Create .gitignore
cat > .gitignore << 'EOF'
# Python
backend/venv/
backend/__pycache__/
backend/**/__pycache__/
backend/*.pyc
backend/attendx.db
backend/.env

# Node
frontend/node_modules/
frontend/dist/
frontend/.env.local
frontend/.env.production

# OS
.DS_Store
Thumbs.db
*.log
EOF

# 4. Add all files
git add .

# 5. First commit
git commit -m "🚀 Initial commit — AttendX Secure Presence Verification System"

# 6. Create repo on GitHub (go to github.com → New Repository)
#    Name it: attendence_system
#    Set to Public or Private
#    Do NOT initialize with README (you already have one)

# 7. Connect and push
git remote add origin https://github.com/YOUR_USERNAME/attendence_system.git
git branch -M main
git push -u origin main
```

### Ongoing — Save Changes

```bash
git add .
git commit -m "✨ feat: describe your change here"
git push
```

### Useful Git Commands

```bash
git status                  # See what changed
git log --oneline           # See commit history
git diff                    # See exact changes
git checkout -b feature/xyz # Create new branch
git pull origin main        # Get latest from GitHub
```

---

## 🖥️ How to Use the Application

### For Faculty

```
1. Register → Select role: Faculty
2. Login with your credentials
3. Dashboard → Click "New Session"
4. Enter subject name + click "Capture My Location" (allow GPS)
5. Set radius (100m recommended for classroom)
6. Click "Create Session & Generate QR"
7. The QR code is now LIVE — show it on projector/screen
8. Watch students appear in the Live Attendance list in real time
9. Click "End Session" when class is over
10. Visit Analytics for charts and insights
11. Visit Fraud Logs to see any suspicious attempts
```

### For Students

```
1. Register → Select role: Student → Enter Roll Number
2. Login with your credentials
3. Dashboard shows all active sessions
4. Click "Scan QR" next to your subject
5. Allow camera access when prompted
6. Allow location access when prompted
7. Point camera at the QR code on the projector
8. ✅ "Attendance Marked!" confirmation appears
9. You are automatically redirected to dashboard
```

### ⚠️ Important Notes for Students
- **You must be physically present** — GPS must be within the classroom radius
- **Scan the LIVE QR** — the code refreshes every 15 seconds, so scan quickly
- **One device only** — logging in from another device will invalidate your session
- **Camera + GPS required** — both must be allowed in browser settings

---

## 🧪 Testing the APIs (Thunder Client / Postman)

### Register
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Dr. Kumar",
  "email": "faculty@test.com",
  "password": "test1234",
  "role": "faculty"
}
```

### Login
```json
POST http://localhost:5000/api/auth/login
{
  "email": "faculty@test.com",
  "password": "test1234"
}
```
→ Copy `access_token` from response

### Create Session (add Bearer token in Auth tab)
```json
POST http://localhost:5000/api/sessions/create
Authorization: Bearer <your_token>
{
  "subject": "Mathematics",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "radius_meters": 100
}
```

### Mark Attendance (use student token)
```json
POST http://localhost:5000/api/attendance/mark
Authorization: Bearer <student_token>
{
  "session_id": 1,
  "qr_token": "paste_token_from_create_session_response",
  "latitude": 13.0827,
  "longitude": 80.2707
}
```

---

## 🗂️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id                  INTEGER PRIMARY KEY,
  name                TEXT NOT NULL,
  email               TEXT UNIQUE NOT NULL,
  password            TEXT NOT NULL,         -- bcrypt hashed
  role                TEXT NOT NULL,         -- 'faculty' | 'student'
  roll_number         TEXT,                  -- students only
  active_session_token TEXT,                 -- device binding
  created_at          DATETIME DEFAULT NOW
);

-- Sessions
CREATE TABLE attendance_sessions (
  id              INTEGER PRIMARY KEY,
  faculty_id      INTEGER REFERENCES users(id),
  subject         TEXT NOT NULL,
  latitude        REAL NOT NULL,             -- classroom GPS
  longitude       REAL NOT NULL,
  radius_meters   REAL DEFAULT 100,
  qr_token        TEXT,                      -- current valid token
  qr_expires_at   DATETIME,                  -- 15s window
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      DATETIME,
  ended_at        DATETIME
);

-- Attendance Records
CREATE TABLE attendance (
  id               INTEGER PRIMARY KEY,
  session_id       INTEGER REFERENCES attendance_sessions(id),
  student_id       INTEGER REFERENCES users(id),
  status           TEXT DEFAULT 'present',   -- 'present' | 'suspicious'
  student_latitude REAL,
  student_longitude REAL,
  distance_meters  REAL,                     -- how far from classroom
  marked_at        DATETIME DEFAULT NOW
);

-- Fraud Logs
CREATE TABLE fraud_logs (
  id          INTEGER PRIMARY KEY,
  session_id  INTEGER,
  student_id  INTEGER,
  reason      TEXT NOT NULL,               -- human-readable reason
  details     TEXT,                        -- technical details
  flagged_at  DATETIME DEFAULT NOW
);
```

---

## 🤔 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `422 Unprocessable Entity` | Missing Bearer token in header | Add `Authorization: Bearer <token>` header |
| `InsecureKeyLengthWarning` | JWT secret too short | Use 32+ character secret in `.env` |
| QR camera not working | Browser blocked camera | Click lock icon in browser bar → Allow camera |
| GPS not working | Location blocked | Allow location in browser settings → HTTPS required in production |
| `npm run dev` fails | Tailwind v4 conflict | Run `npm uninstall tailwindcss && npm install -D tailwindcss@3` |
| `npx tailwindcss init` fails | Same v4 issue | Use `npm install -D tailwindcss@3` first |
| Backend 404 on Render | Wrong start command | Use `gunicorn --worker-class eventlet -w 1 app:app` |
| CORS error in production | Missing origin | Add your Vercel URL to Flask CORS config |
| Socket not connecting | Wrong Socket URL | Update `VITE_SOCKET_URL` env variable |

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Email/OTP verification on registration
- [ ] Bulk student import via CSV
- [ ] Attendance export to Excel/PDF
- [ ] Department-wise analytics
- [ ] Face recognition layer (optional)
- [ ] Timetable integration
- [ ] Push notifications for students

---

## 🙏 Acknowledgements

- [Flask](https://flask.palletsprojects.com/) — The lightweight Python web framework
- [React](https://reactjs.org/) — UI library
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) — Camera QR scanning
- [Socket.IO](https://socket.io/) — Real-time WebSocket communication
- [Recharts](https://recharts.org/) — React chart components
- [Lucide](https://lucide.dev/) — Clean icon set

---

## 📄 License

```
MIT License — Copyright (c) 2024 AttendX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, and/or
sell copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

**Built with ❤️ to make attendance honest**

⭐ **Star this repo** if AttendX helped you — it means a lot!

[🔝 Back to Top](#)

</div>
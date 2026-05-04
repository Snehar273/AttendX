import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import CreateSession from './pages/faculty/CreateSession'
import SessionView from './pages/faculty/SessionView'
import Analytics from './pages/faculty/Analytics'
import FraudLogs from './pages/faculty/FraudLogs'
import SessionHistory from './pages/faculty/SessionHistory'
import StudentDashboard from './pages/student/StudentDashboard'
import ScanQR from './pages/student/ScanQR'
import MyAttendance from './pages/student/MyAttendance'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/faculty/create-session" element={<ProtectedRoute role="faculty"><CreateSession /></ProtectedRoute>} />
          <Route path="/faculty/session/:id" element={<ProtectedRoute role="faculty"><SessionView /></ProtectedRoute>} />
          <Route path="/faculty/analytics" element={<ProtectedRoute role="faculty"><Analytics /></ProtectedRoute>} />
          <Route path="/faculty/fraud-logs" element={<ProtectedRoute role="faculty"><FraudLogs /></ProtectedRoute>} />
          <Route path="/faculty/history" element={<ProtectedRoute role="faculty"><SessionHistory /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/scan/:sessionId" element={<ProtectedRoute role="student"><ScanQR /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute role="student"><MyAttendance /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
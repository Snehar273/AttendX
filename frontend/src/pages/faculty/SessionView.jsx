import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import { io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast'
import { RefreshCw, Users, MapPin, Clock } from 'lucide-react'

export default function SessionView() {
  const { id } = useParams()
  const [qrImage, setQrImage] = useState('')
  const [attendance, setAttendance] = useState([])
  const [subject, setSubject] = useState('')
  const [timeLeft, setTimeLeft] = useState(15)
  const socketRef = useRef(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    initSession(); fetchAttendance()
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'https://attendx-wfzr.onrender.com')
    socketRef.current.emit('join_session', { session_id: parseInt(id) })
    socketRef.current.on('qr_updated', data => {
      if (data.session_id === parseInt(id)) { setQrImage(data.qr_image); setTimeLeft(15); fetchAttendance() }
    })
    socketRef.current.on('session_ended', () => toast.error('Session ended'))
    timerRef.current = setInterval(() => setTimeLeft(p => p <= 1 ? 15 : p - 1), 1000)
    return () => { socketRef.current?.disconnect(); clearInterval(timerRef.current) }
  }, [id])

  const initSession = async () => {
    try {
      const res = await API.post(`/sessions/${id}/refresh-qr`)
      setQrImage(res.data.qr_image)
      const sr = await API.get('/sessions/active')
      const found = sr.data.sessions.find(s => s.id === parseInt(id))
      if (found) setSubject(found.subject)
    } catch { toast.error('Failed to load session') }
  }

  const fetchAttendance = async () => {
    try {
      const r = await API.get(`/attendance/session/${id}`)
      setAttendance(r.data.attendance)
      if (r.data.subject) setSubject(r.data.subject)
    } catch {}
  }

  const manualRefresh = async () => {
    try { const r = await API.post(`/sessions/${id}/refresh-qr`); setQrImage(r.data.qr_image); setTimeLeft(15); toast.success('QR refreshed') }
    catch { toast.error('Failed') }
  }

  const timerColor = timeLeft <= 5 ? 'var(--rose)' : timeLeft <= 10 ? 'var(--amber)' : 'var(--green2)'
  const timerPct = (timeLeft / 15) * 100

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="app-bg" />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />
      <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <button className="back-btn" onClick={() => navigate('/faculty')} style={{ margin: 0 }}>← Back</button>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <span className="badge b-live"><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green2)', marginRight: 2 }} />Live Session</span>
          <h1 className="fd" style={{ fontWeight: 800, fontSize: 24, color: 'white' }}>{subject || 'Session'}</h1>
        </div>

        <div className="session-layout">
          {/* QR Panel */}
          <div className="qr-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <h2 className="fd" style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>Dynamic QR Code</h2>
              <button className="btn btn-ghost" onClick={manualRefresh} style={{ padding: '7px 14px', fontSize: 12 }}>
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* QR Image */}
            <div className="qr-wrapper">
              <div className="qr-frame" />
              {qrImage
                ? <img src={`data:image/png;base64,${qrImage}`} alt="QR" style={{ width: 260, height: 260, display: 'block' }} />
                : <div style={{ width: 260, height: 260, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, borderRadius: 8 }}>Generating...</div>
              }
            </div>

            {/* Timer */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} style={{ color: timerColor }} />
                  <span style={{ fontSize: 13, color: timerColor, fontFamily: 'var(--font-m)', fontWeight: 600 }}>
                    {timeLeft}s
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>until refresh</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-m)' }}>
                  {Math.round(timerPct)}%
                </span>
              </div>
              <div className="timer-bar">
                <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
              </div>
            </div>

            <div style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)', width: '100%' }}>
              <p style={{ fontSize: 12.5, color: 'var(--muted2)', textAlign: 'center', lineHeight: 1.6 }}>
                📱 Students open AttendX, tap <strong style={{ color: 'var(--indigo2)' }}>"Scan QR"</strong> on their dashboard, then point their camera at this code.
              </p>
            </div>
          </div>

          {/* Attendance panel */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="fd" style={{ fontWeight: 700, fontSize: 17, color: 'white' }}>Live Attendance</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={16} style={{ color: 'var(--muted)' }} />
                <span className="fd" style={{ fontSize: 28, fontWeight: 800, color: 'var(--indigo2)' }}>{attendance.length}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>present</span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attendance.length === 0 ? (
                <div className="empty-state" style={{ padding: '48px 20px' }}>
                  <div className="empty-icon" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <Users size={30} style={{ color: 'var(--indigo2)', opacity: 0.6 }} />
                  </div>
                  <p style={{ color: 'var(--muted2)', fontSize: 14, fontWeight: 500 }}>Waiting for students...</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12, maxWidth: 240 }}>Students will appear here once they scan the QR code</p>
                </div>
              ) : attendance.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', animation: `stIn 0.4s ease-out both`, animationDelay: `${i * 40}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: `hsl(${(i * 67) % 360},55%,45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                      {a.student_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{a.student_name}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-m)' }}>{a.roll_number}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge b-${a.status}`}>{a.status}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3, justifyContent: 'flex-end' }}>
                      <MapPin size={9} style={{ color: 'var(--muted)' }} />
                      <span style={{ fontSize: 10.5, color: 'var(--muted)', fontFamily: 'var(--font-m)' }}>{a.distance_meters}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

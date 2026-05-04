import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import StatCard from '../../components/StatCard'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { QrCode, History, BookOpen, CheckCircle, ChevronRight, Zap } from 'lucide-react'

export default function StudentDashboard() {
  const [sessions, setSessions] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([API.get('/sessions/active'), API.get('/attendance/my-history')])
      .then(([s, h]) => { setSessions(s.data.sessions); setHistory(h.data.history) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="app-bg" />
      <Navbar />
      <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 4 }}>{greeting} 👋</p>
          <h1 className="fd" style={{ fontWeight: 900, fontSize: 34, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>
            {user?.name}
          </h1>
          {user?.roll_number && (
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-m)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 7, border: '1px solid var(--border2)', display: 'inline-block' }}>
              {user.roll_number}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid-2 stagger">
          <StatCard label="Active Sessions"  value={sessions.length} icon={BookOpen}     color="indigo" delay={0}   />
          <StatCard label="Classes Attended" value={history.length}  icon={CheckCircle}  color="green"  delay={100} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Available sessions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="live-dot" />
              <h2 className="fd" style={{ fontWeight: 700, fontSize: 18, color: 'white' }}>Available Sessions</h2>
              <span className="badge b-indigo">{sessions.length}</span>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1,2].map(i => <div key={i} className="shimmer-bg" style={{ height: 88 }} />)}
              </div>
            ) : sessions.length === 0 ? (
              <div className="card">
                <div className="empty-state" style={{ padding: '40px 24px' }}>
                  <div className="empty-icon" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', width: 56, height: 56 }}>
                    <Zap size={24} style={{ color: 'var(--indigo2)', opacity: 0.7 }} />
                  </div>
                  <p style={{ color: 'var(--muted2)', fontSize: 13.5, fontWeight: 500 }}>No active sessions</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>Check back when your teacher starts one</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sessions.map((s, i) => (
                  <div key={s.id} className="card card-hover" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${i*60}ms` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="badge b-live"><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green2)', marginRight: 2 }} />Live</span>
                        <span className="fd" style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>{s.subject}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>by {s.faculty_name} · {s.radius_meters}m radius</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate(`/student/scan/${s.id}`)}
                      style={{ padding: '10px 18px', fontSize: 13, flexShrink: 0 }}>
                      <QrCode size={15} /> Scan QR
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent attendance */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className="fd" style={{ fontWeight: 700, fontSize: 18, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={17} style={{ color: 'var(--muted)' }} /> Recent Attendance
              </h2>
              {history.length > 5 && (
                <button onClick={() => navigate('/student/attendance')} style={{ fontSize: 12.5, color: 'var(--indigo2)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-b)', fontWeight: 600 }}>
                  View all <ChevronRight size={14} />
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[1,2,3].map(i => <div key={i} className="shimmer-bg" style={{ height: 62 }} />)}
              </div>
            ) : history.length === 0 ? (
              <div className="card">
                <div className="empty-state" style={{ padding: '40px 24px' }}>
                  <div className="empty-icon" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.12)', width: 56, height: 56 }}>
                    <CheckCircle size={24} style={{ color: 'var(--green2)', opacity: 0.7 }} />
                  </div>
                  <p style={{ color: 'var(--muted2)', fontSize: 13, fontWeight: 500 }}>No records yet</p>
                </div>
              </div>
            ) : (
              <div className="card" style={{ overflow: 'hidden' }}>
                {history.slice(0, 6).map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: i < Math.min(history.length, 6) - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s', animation: `stIn 0.4s ease-out both`, animationDelay: `${i * 50}ms` }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{h.subject}</p>
                      <p style={{ fontSize: 11.5, color: 'var(--muted)' }}>{new Date(h.marked_at).toLocaleString()}</p>
                    </div>
                    <span className={`badge b-${h.status}`}>{h.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
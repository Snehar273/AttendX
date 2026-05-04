import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import StatCard from '../../components/StatCard'
import API from '../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { PlusCircle, BarChart2, AlertTriangle, Clock, Users, BookOpen, Activity, Flag, ChevronRight, StopCircle, Eye } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function FacultyDashboard() {
  const [sessions, setSessions] = useState([])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [s, o] = await Promise.all([API.get('/sessions/active'), API.get('/analytics/overview')])
      setSessions(s.data.sessions); setOverview(o.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const endSession = async (id, e) => {
    e.stopPropagation()
    if (!confirm('End this session? Students will no longer be able to mark attendance.')) return
    try { await API.post(`/sessions/${id}/end`); toast.success('Session ended'); fetchData() }
    catch { toast.error('Failed') }
  }

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="app-bg" />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 4 }}>{greeting}, 👋</p>
            <h1 className="fd" style={{ fontWeight: 900, fontSize: 34, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>
              {user?.name}
            </h1>
            <p style={{ color: 'var(--muted2)', fontSize: 14 }}>Manage sessions and monitor attendance in real time</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/faculty/create-session')}
            style={{ padding: '13px 24px', fontSize: 15 }}>
            <PlusCircle size={17} /> New Session
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid stagger">
          {loading ? (
            [1,2,3,4].map(i => <div key={i} className="shimmer-bg" style={{ height: 120 }} />)
          ) : overview ? (
            <>
              <StatCard label="Total Sessions"      value={overview.total_sessions}          icon={BookOpen}  color="indigo" delay={0}   />
              <StatCard label="Total Students"      value={overview.total_students}          icon={Users}     color="violet" delay={80}  />
              <StatCard label="Attendance Records"  value={overview.total_attendance_records} icon={Activity}  color="teal"   delay={160} />
              <StatCard label="Fraud Flags"         value={overview.total_fraud_flags}       icon={Flag}      color="rose"   delay={240} />
            </>
          ) : null}
        </div>

        {/* Quick actions */}
        <div className="action-grid stagger">
          {[
            { icon: BarChart2,    label: 'Analytics Dashboard', desc: 'Charts, trends & insights',  to: '/faculty/analytics',  color: '#8b5cf6' },
            { icon: AlertTriangle,label: 'Fraud Logs',          desc: 'All suspicious attempts',    to: '/faculty/fraud-logs', color: '#f43f5e' },
            { icon: Clock,        label: 'Session History',     desc: 'Past and active sessions',   to: '/faculty/history',    color: '#14b8a6' },
          ].map(({ icon: Icon, label, desc, to, color }) => (
            <button key={to} onClick={() => navigate(to)} className="card card-hover"
              style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: 'var(--card)', border: `1px solid ${color}18`, width: '100%', textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="fd" style={{ fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>{desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Active Sessions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div className="live-dot" />
            <h2 className="fd" style={{ fontWeight: 700, fontSize: 20, color: 'white' }}>Active Sessions</h2>
            <span className="badge b-indigo">{sessions.length} live</span>
          </div>

          {loading ? (
            <div className="session-grid">
              {[1,2].map(i => <div key={i} className="shimmer-bg" style={{ height: 160 }} />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="card" style={{ padding: '0' }}>
              <div className="empty-state">
                <div className="empty-icon" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <BookOpen size={32} style={{ color: 'var(--indigo2)', opacity: 0.7 }} />
                </div>
                <p className="fd" style={{ fontSize: 17, fontWeight: 700, color: 'var(--muted2)' }}>No active sessions</p>
                <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 300 }}>Create a new session to start taking attendance</p>
                <button className="btn btn-primary" onClick={() => navigate('/faculty/create-session')} style={{ marginTop: 8 }}>
                  <PlusCircle size={15} /> Create Session
                </button>
              </div>
            </div>
          ) : (
            <div className="session-grid stagger">
              {sessions.map((s, i) => (
                <div key={s.id} className="card card-hover" style={{ padding: 24, animationDelay: `${i*80}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <span className="badge b-live" style={{ marginBottom: 10, display: 'inline-flex' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green2)', marginRight: 3 }} />
                        Live
                      </span>
                      <h3 className="fd" style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>{s.subject}</h3>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 7, fontFamily: 'var(--font-m)', flexShrink: 0 }}>
                      r: {s.radius_meters}m
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                    Started at {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>by {s.faculty_name}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                      onClick={() => navigate(`/faculty/session/${s.id}`)}>
                      <Eye size={15} /> View & QR
                    </button>
                    <button onClick={e => endSession(s.id, e)} className="btn btn-danger"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px' }}>
                      <StopCircle size={15} /> End
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

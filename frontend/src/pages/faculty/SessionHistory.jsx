import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { ChevronLeft, Clock, Users, ChevronRight, BookOpen } from 'lucide-react'

export default function SessionHistory() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/sessions/history')
      .then(r => setSessions(r.data.sessions))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }} className="page">
        <button onClick={() => navigate('/faculty')} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted2)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
          <ChevronLeft size={16} /> Back
        </button>

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'white', marginBottom: 6 }}>Session History</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 28 }}>All your past and active sessions</p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="card shimmer-bg" style={{ height: 80 }} />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="card empty-state">
            <Clock size={48} style={{ color: 'var(--muted)', opacity: 0.4 }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--muted2)' }}>No sessions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sessions.map((s, i) => (
              <div key={s.id} className="card card-hover"
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', animationDelay: `${i * 50}ms` }}
                onClick={() => navigate(`/faculty/session/${s.id}`)}>

                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={18} style={{ color: s.is_active ? '#10b981' : '#6366f1' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{s.subject}</span>
                    <span className={`badge ${s.is_active ? 'badge-live' : 'badge-ended'}`}>
                      {s.is_active ? <><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', marginRight: 3, display: 'inline-block' }} />LIVE</> : 'Ended'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {new Date(s.created_at).toLocaleString()}
                    {s.ended_at && ` → ${new Date(s.ended_at).toLocaleTimeString()}`}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.1)' }}>
                  <Users size={13} style={{ color: '#818cf8' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{s.total_attendance}</span>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
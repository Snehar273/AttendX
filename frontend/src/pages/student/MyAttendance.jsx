import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { CheckCircle, ChevronLeft, MapPin } from 'lucide-react'

export default function MyAttendance() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/attendance/my-history')
      .then(r => setHistory(r.data.history))
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoading(false))
  }, [])

  // Group by subject
  const bySubject = history.reduce((acc, h) => {
    acc[h.subject] = (acc[h.subject] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }} className="page">
        <button onClick={() => navigate('/student')} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted2)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
          <ChevronLeft size={16} /> Back
        </button>

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'white', marginBottom: 6 }}>My Attendance</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 24 }}>Your complete attendance history</p>

        {/* Subject summary */}
        {Object.keys(bySubject).length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
            {Object.entries(bySubject).map(([subject, count], i) => (
              <div key={subject} className="card" style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{subject}</p>
                <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Syne,sans-serif', color: '#10b981' }}>{count}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>classes</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(i => <div key={i} className="card shimmer-bg" style={{ height: 64 }} />)}
          </div>
        ) : history.length === 0 ? (
          <div className="card empty-state">
            <CheckCircle size={40} style={{ color: 'var(--muted)', opacity: 0.4 }} />
            <p style={{ color: 'var(--muted2)', fontSize: 15 }}>No attendance records yet</p>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            {history.map((h, i) => (
              <div key={i} className="table-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{h.subject}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(h.marked_at).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {h.distance_meters && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={11} style={{ color: 'var(--muted)' }} />
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace' }}>{h.distance_meters}m</span>
                    </div>
                  )}
                  <span className={`badge badge-${h.status}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { AlertTriangle, ChevronLeft, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FraudLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/attendance/fraud-logs')
      .then(r => setLogs(r.data.fraud_logs))
      .catch(() => toast.error('Failed to load fraud logs'))
      .finally(() => setLoading(false))
  }, [])

  const reasonIcon = (reason) => {
    if (reason.toLowerCase().includes('location')) return '📍'
    if (reason.toLowerCase().includes('qr') || reason.toLowerCase().includes('token')) return '🔑'
    if (reason.toLowerCase().includes('device') || reason.toLowerCase().includes('session')) return '📱'
    return '⚠️'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }} className="page">
        <button onClick={() => navigate('/faculty')} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted2)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
          <ChevronLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} style={{ color: '#f43f5e' }} />
          </div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'white' }}>Fraud Detection Logs</h1>
        </div>
        <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 28 }}>All suspicious activity attempts are logged here</p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="card shimmer-bg" style={{ height: 80 }} />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="card empty-state">
            <Shield size={48} style={{ color: '#10b981', opacity: 0.7 }} />
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--muted2)', fontFamily: 'Syne,sans-serif' }}>All Clear!</p>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>No fraud attempts have been detected</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {logs.map(log => (
              <div key={log.id} className="card"
                style={{ padding: 18, borderColor: 'rgba(244,63,94,0.2)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{reasonIcon(log.reason)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>{log.student_name}</span>
                    {log.roll_number !== '-' && <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace' }}>{log.roll_number}</span>}
                    <span className="badge badge-fraud">{log.reason}</span>
                  </div>
                  {log.details && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontFamily: 'JetBrains Mono,monospace' }}>{log.details}</p>}
                </div>
                <div style={{ flexShrink: 0, fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
                  {new Date(log.flagged_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

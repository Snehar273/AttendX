import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { MapPin, Zap, ChevronLeft, Navigation } from 'lucide-react'

export default function CreateSession() {
  const [form, setForm] = useState({ subject: '', latitude: '', longitude: '', radius_meters: 100 })
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const navigate = useNavigate()

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }))
        setLocating(false)
        toast.success('Location captured!')
      },
      () => { toast.error('Location access denied. Please enable GPS.'); setLocating(false) },
      { enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.latitude || !form.longitude) { toast.error('Please capture your location first'); return }
    setLoading(true)
    try {
      const res = await API.post('/sessions/create', { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), radius_meters: parseInt(form.radius_meters) })
      toast.success('Session created!')
      navigate(`/faculty/session/${res.data.session.id}`)
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }} className="page">
        <button onClick={() => navigate('/faculty')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted2)', fontSize: 13, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'white', marginBottom: 6 }}>Create Session</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 28 }}>Set up a new attendance session for your class</p>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>Subject Name *</label>
              <input className="input" placeholder="e.g. Mathematics, Physics, CS101"
                value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>
                Allowed Radius
                <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 4 }}>(students must be within this distance)</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input className="input" type="number" min={10} max={500}
                  value={form.radius_meters} onChange={e => setForm({ ...form, radius_meters: e.target.value })} style={{ flex: 1 }} />
                <span style={{ color: 'var(--muted2)', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>meters</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                {[30, 50, 100, 200].map(r => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, radius_meters: r })}
                    style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: form.radius_meters == r ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.radius_meters == r ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                      color: form.radius_meters == r ? '#818cf8' : 'var(--muted2)' }}>
                    {r}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>Classroom Location *</label>
              <button type="button" onClick={getLocation} disabled={locating}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 10, cursor: locating ? 'wait' : 'pointer',
                  background: form.latitude ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.latitude ? 'rgba(20,184,166,0.35)' : 'var(--border)'}`,
                  color: form.latitude ? '#2dd4bf' : 'var(--muted2)',
                  transition: 'all 0.2s', fontWeight: 600, fontSize: 14 }}>
                {locating
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(99,102,241,0.3)', borderTop: '2px solid #6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Detecting location...</>
                  : form.latitude
                  ? <><MapPin size={16} /> {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}</>
                  : <><Navigation size={16} /> Capture My Location</>
                }
              </button>
              {form.latitude && (
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, textAlign: 'center' }}>📍 Location captured successfully</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: 14, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading
                ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating...</>
                : <><Zap size={16} /> Create Session & Generate QR</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
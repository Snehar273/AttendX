import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Mail, Lock, ArrowRight, ShieldCheck, MapPin, RefreshCw, Zap } from 'lucide-react'
import { LogoMark } from '../components/Logo'

const features = [
  { icon: RefreshCw, label: 'Dynamic QR', desc: 'Auto-refreshes every 15 seconds — screenshots are useless' },
  { icon: MapPin,    label: 'GPS Verified', desc: 'Students must be physically present within your classroom' },
  { icon: ShieldCheck, label: 'Fraud Detection', desc: 'Every suspicious attempt is logged in real time' },
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await API.post('/auth/login', form)
      login(res.data.user, res.data.access_token)
      toast.success('Welcome back!')
      navigate(res.data.user.role === 'faculty' ? '/faculty' : '/student')
    } catch (err) { toast.error(err.response?.data?.error || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <>
      <div className="app-bg" />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <div className="auth-layout">

        {/* Hero panel */}
        <div className="auth-hero">
          <div className="auth-hero-grid" />
          {/* Orbs */}
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)', top: '-10%', left: '-10%', animation: 'meshAnim 10s ease-in-out infinite alternate' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(13,148,136,0.1),transparent 70%)', bottom: '10%', right: '-5%', animation: 'meshAnim 14s ease-in-out infinite alternate-reverse' }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
            <LogoMark size={42} />
            <span className="fd" style={{ fontWeight: 800, fontSize: 24, color: 'white' }}>Attend<span className="gradient-text">X</span></span>
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 20 }}>
              <Zap size={12} style={{ color: 'var(--indigo2)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Secure Presence Verification</span>
            </div>
            <h2 className="fd" style={{ fontWeight: 900, fontSize: 42, color: 'white', lineHeight: 1.1, marginBottom: 18 }}>
              Stop Proxy<br />
              <span className="gradient-text">Attendance</span><br />
              Forever.
            </h2>
            <p style={{ color: 'var(--muted2)', fontSize: 15, lineHeight: 1.75, marginBottom: 36, maxWidth: 360 }}>
              Multi-layer verification using dynamic QR codes, GPS geolocation, and real-time fraud detection.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {features.map(({ icon: Icon, label, desc }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }} className="animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: 'var(--indigo2)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ position: 'relative', zIndex: 2, color: 'var(--muted)', fontSize: 12 }}>© 2024 AttendX — Built for academic integrity</p>
        </div>

        {/* Form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-box animate-in">
            <h1 className="fd" style={{ fontWeight: 800, fontSize: 32, color: 'white', marginBottom: 6 }}>Sign in</h1>
            <p style={{ color: 'var(--muted2)', marginBottom: 32, fontSize: 14.5 }}>Enter your credentials to access AttendX</p>

            <div className="card" style={{ padding: 32 }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>Email address</label>
                  <div className="input-group">
                    <Mail size={15} className="input-icon-el" style={{ color: 'var(--muted)' }} />
                    <input className="input input-icon" type="email" placeholder="you@university.edu"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>Password</label>
                  <div className="input-group">
                    <Lock size={15} className="input-icon-el" style={{ color: 'var(--muted)' }} />
                    <input className="input input-icon" type="password" placeholder="••••••••"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 4 }}>
                  {loading ? <span className="spinner" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13.5, marginTop: 24 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--indigo2)', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
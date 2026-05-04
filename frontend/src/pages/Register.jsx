import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Zap, Mail, Lock, User, Hash, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', roll_number: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/auth/register', form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />

      <div style={{ width: '100%', maxWidth: 420 }} className="animate-slide-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: 'white' }}>Attend<span className="gradient-text">X</span></span>
        </div>

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 6 }}>Create account</h1>
        <p style={{ color: 'var(--muted2)', marginBottom: 24, fontSize: 14 }}>Join AttendX to get started</p>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[{ value: 'student', label: 'Student', icon: GraduationCap }, { value: 'faculty', label: 'Faculty', icon: BookOpen }].map(({ value, label, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: form.role === value ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${form.role === value ? 'rgba(99,102,241,0.45)' : 'var(--border)'}`,
                color: form.role === value ? '#a78bfa' : 'var(--muted2)',
                transition: 'all 0.2s',
              }}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Full Name', field: 'name', type: 'text', icon: User, placeholder: 'Your full name' },
              { label: 'Email', field: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
              { label: 'Password', field: 'password', type: 'password', icon: Lock, placeholder: '••••••••' },
            ].map(({ label, field, type, icon: Icon, placeholder }) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input className="input input-icon" type={type} placeholder={placeholder}
                    value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
                </div>
              </div>
            ))}

            {form.role === 'student' && (
              <div className="animate-slide-up">
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted2)', marginBottom: 8 }}>Roll Number</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input className="input input-icon" placeholder="e.g. CS2021001"
                    value={form.roll_number} onChange={e => setForm({ ...form, roll_number: e.target.value })} />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading
                ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><span>Create Account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

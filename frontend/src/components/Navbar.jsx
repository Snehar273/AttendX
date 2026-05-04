import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { LogOut, LayoutDashboard, BarChart2, AlertTriangle, Clock, History } from 'lucide-react'
import { LogoMark } from './Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try { await API.post('/auth/logout') } catch {}
    logout(); navigate('/login'); toast.success('Logged out!')
  }

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))

  const links = user?.role === 'faculty' ? [
    { to: '/faculty',          icon: LayoutDashboard, label: 'Dashboard'  },
    { to: '/faculty/analytics',icon: BarChart2,       label: 'Analytics'  },
    { to: '/faculty/fraud-logs',icon: AlertTriangle,  label: 'Fraud Logs' },
    { to: '/faculty/history',  icon: Clock,           label: 'History'    },
  ] : [
    { to: '/student',           icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/student/attendance',icon: History,         label: 'My Attendance'},
  ]

  return (
    <nav className="navbar">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>

        {/* Logo */}
        <Link to={user?.role === 'faculty' ? '/faculty' : '/student'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <LogoMark size={36} />
          <span className="fd" style={{ fontWeight: 800, fontSize: 20, color: 'white', letterSpacing: '-0.02em' }}>
            Attend<span className="gradient-text">X</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* User chip + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 14px 6px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--indigo3)' }}>{user?.name?.split(' ')[0]}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(99,102,241,0.2)', color: 'var(--indigo2)', textTransform: 'capitalize', letterSpacing: '0.03em' }}>
              {user?.role}
            </span>
          </div>
          <button className="btn btn-danger" onClick={handleLogout} style={{ padding: '7px 14px', fontSize: 13 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

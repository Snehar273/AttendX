import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import { Html5QrcodeScanner } from 'html5-qrcode'
import toast, { Toaster } from 'react-hot-toast'
import { CheckCircle, XCircle, Loader, QrCode, MapPin, ChevronLeft } from 'lucide-react'

export default function ScanQR() {
  const { sessionId } = useParams()
  const [status, setStatus] = useState('idle') // idle | scanning | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [scannerMounted, setScannerMounted] = useState(false)
  const scannerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    setScannerMounted(true)
    return () => { if (scannerRef.current) { scannerRef.current.clear().catch(() => {}) } }
  }, [])

  useEffect(() => {
    if (!scannerMounted) return
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 260, height: 260 }, aspectRatio: 1 }, false)
    scanner.render(
      async (text) => {
        scanner.clear().catch(() => {})
        setStatus('loading')
        await markAttendance(text)
      },
      () => {}
    )
    scannerRef.current = scanner
    setStatus('scanning')
  }, [scannerMounted])

  const markAttendance = async (qrToken) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await API.post('/attendance/mark', {
            session_id: parseInt(sessionId),
            qr_token: qrToken,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
          setStatus('success')
          toast.success('Attendance marked! ✓')
          setTimeout(() => navigate('/student'), 2500)
        } catch (err) {
          const msg = err.response?.data?.error || 'Verification failed'
          setErrorMsg(msg)
          setStatus('error')
          toast.error(msg)
        }
      },
      () => {
        setErrorMsg('Location access denied. Please enable GPS and try again.')
        setStatus('error')
        toast.error('GPS access required')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const retry = () => {
    setStatus('idle')
    setErrorMsg('')
    setScannerMounted(false)
    setTimeout(() => setScannerMounted(true), 100)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px' }} className="page">
        <button onClick={() => navigate('/student')} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted2)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
          <ChevronLeft size={16} /> Back
        </button>

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'white', marginBottom: 6 }}>Mark Attendance</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 24 }}>Scan the QR code displayed by your teacher</p>

        {/* Success state */}
        {status === 'success' && (
          <div className="card" style={{ padding: 48, textAlign: 'center', borderColor: 'rgba(16,185,129,0.3)' }} className="animate-scale-in">
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={36} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#10b981', marginBottom: 8 }}>Attendance Marked!</h2>
            <p style={{ color: 'var(--muted2)', fontSize: 14 }}>Your presence has been verified successfully</p>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>Redirecting to dashboard...</p>
          </div>
        )}

        {/* Loading state */}
        {status === 'loading' && (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 8 }}>Verifying...</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <MapPin size={14} style={{ color: 'var(--muted)' }} />
              <p style={{ color: 'var(--muted2)', fontSize: 13 }}>Checking your GPS location</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="card" style={{ padding: 32, textAlign: 'center', borderColor: 'rgba(244,63,94,0.3)', marginBottom: 16 }}>
            <XCircle size={40} style={{ color: '#f43f5e', margin: '0 auto 12px' }} />
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#f43f5e', marginBottom: 8 }}>Verification Failed</h2>
            <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 20 }}>{errorMsg}</p>
            <button onClick={retry} className="btn-primary" style={{ padding: '10px 24px' }}>Try Again</button>
          </div>
        )}

        {/* Scanner */}
        {(status === 'idle' || status === 'scanning') && (
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <QrCode size={16} style={{ color: '#818cf8' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Camera Scanner</span>
              {status === 'scanning' && (
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'livePulse 2s infinite' }} />
                  Active
                </span>
              )}
            </div>

            {/* Scanner area with scan line */}
            <div style={{ position: 'relative', padding: 16 }}>
              <div id="qr-reader" style={{ width: '100%' }} />
              {status === 'scanning' && <div className="scan-line" />}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} style={{ color: 'var(--muted)' }} />
                GPS verification enabled
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
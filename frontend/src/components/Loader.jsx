export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>{text}</p>
    </div>
  )
}
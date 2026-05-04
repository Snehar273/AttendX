const colorMap = {
  indigo: { cls: 'si', c: '#6366f1' },
  violet: { cls: 'sv', c: '#7c3aed' },
  teal:   { cls: 'st', c: '#14b8a6' },
  rose:   { cls: 'sr', c: '#f43f5e' },
  green:  { cls: 'sg', c: '#10b981' },
}

export default function StatCard({ label, value, icon: Icon, color = 'indigo', delay = 0, suffix = '' }) {
  const { cls, c } = colorMap[color] || colorMap.indigo
  return (
    <div className={`stat-card ${cls}`} style={{ animationDelay: `${delay}ms` }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c}1a`, border: `1px solid ${c}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        {Icon && <Icon size={19} style={{ color: c }} />}
      </div>
      <p className="num-reveal fd" style={{ fontSize: 32, fontWeight: 800, color: c, lineHeight: 1, animationDelay: `${delay + 150}ms` }}>
        {value}{suffix}
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 6, fontWeight: 500 }}>{label}</p>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 64, height: 64, borderRadius: '16px 0 16px 0', background: `${c}08` }} />
    </div>
  )
}
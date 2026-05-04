/* AttendX Logo — shield with checkmark + scan lines */
export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#14b8a6"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      {/* BG */}
      <rect width="36" height="36" rx="10" fill="url(#lg1)"/>
      {/* Shine */}
      <rect width="36" height="36" rx="10" fill="url(#lg2)"/>
      {/* Shield body */}
      <path d="M18 6L8 10v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12v-7L18 6z" fill="rgba(255,255,255,0.95)" opacity="0.9"/>
      {/* Checkmark */}
      <path d="M13 18l3.5 3.5L23 15" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Scan lines */}
      <line x1="11" y1="28" x2="16" y2="28" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="28" x2="25" y2="28" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
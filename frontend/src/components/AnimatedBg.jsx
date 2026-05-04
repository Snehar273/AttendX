/* AnimatedBackground.jsx — drop this component into any page */
/* 
  USAGE: import AnimatedBg from '../components/AnimatedBg'
  Then place <AnimatedBg /> as the first child of your page div
*/

export default function AnimatedBg({ variant = 'default' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>

      {/* Base gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 60% at 15% 5%, rgba(16,185,129,0.07) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 92%, rgba(245,158,11,0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 50%)',
        animation: 'bgMesh 16s ease-in-out infinite alternate',
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        animation: 'gridDrift 28s linear infinite',
      }} />

      {/* Floating orb 1 — emerald */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        top: '-10%', left: '-5%',
        filter: 'blur(60px)',
        animation: 'orbFloat1 18s ease-in-out infinite',
      }} />

      {/* Floating orb 2 — amber gold */}
      <div style={{
        position: 'absolute', width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.055) 0%, transparent 70%)',
        bottom: '5%', right: '-5%',
        filter: 'blur(60px)',
        animation: 'orbFloat2 22s ease-in-out infinite',
      }} />

      {/* Floating orb 3 — violet */}
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
        top: '40%', right: '20%',
        filter: 'blur(50px)',
        animation: 'orbFloat3 14s ease-in-out infinite',
      }} />

      {/* Subtle scan lines overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.008) 2px, rgba(16,185,129,0.008) 4px)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes bgMesh {
          0%   { transform: scale(1) translate(0, 0); }
          33%  { transform: scale(1.03) translate(8px, -6px); }
          66%  { transform: scale(1.01) translate(-5px, 4px); }
          100% { transform: scale(1) translate(3px, -2px); }
        }
        @keyframes gridDrift {
          to { background-position: 60px 60px; }
        }
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0, 0) scale(1); }
          25%     { transform: translate(30px, 20px) scale(1.05); }
          50%     { transform: translate(15px, 40px) scale(0.97); }
          75%     { transform: translate(-10px, 15px) scale(1.02); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0, 0) scale(1); }
          30%     { transform: translate(-25px, -30px) scale(1.08); }
          60%     { transform: translate(-10px, -15px) scale(0.95); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0, 0); }
          50%     { transform: translate(20px, -25px); }
        }
      `}</style>
    </div>
  )
}

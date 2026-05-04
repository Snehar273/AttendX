// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         display: ['"Syne"', 'sans-serif'],
//         body: ['"DM Sans"', 'sans-serif'],
//         mono: ['"JetBrains Mono"', 'monospace'],
//       },
//       colors: {
//         ink: '#0a0a0f',
//         surface: '#111118',
//         card: '#16161f',
//         border: '#1e1e2e',
//         accent: '#7c6af7',
//         'accent-light': '#a78bfa',
//         teal: '#2dd4bf',
//         rose: '#f43f5e',
//         amber: '#f59e0b',
//         emerald: '#10b981',
//       },
//       animation: {
//         'pulse-slow': 'pulse 3s ease-in-out infinite',
//         'spin-slow': 'spin 8s linear infinite',
//         'float': 'float 6s ease-in-out infinite',
//         'slide-up': 'slideUp 0.5s ease-out',
//         'slide-in': 'slideIn 0.4s ease-out',
//         'fade-in': 'fadeIn 0.6s ease-out',
//         'glow': 'glow 2s ease-in-out infinite',
//         'scan': 'scan 2s ease-in-out infinite',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0px)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideIn: {
//           '0%': { transform: 'translateX(-20px)', opacity: '0' },
//           '100%': { transform: 'translateX(0)', opacity: '1' },
//         },
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         glow: {
//           '0%, 100%': { boxShadow: '0 0 20px rgba(124, 106, 247, 0.3)' },
//           '50%': { boxShadow: '0 0 40px rgba(124, 106, 247, 0.6)' },
//         },
//         scan: {
//           '0%': { transform: 'translateY(0%)', opacity: '1' },
//           '50%': { opacity: '0.5' },
//           '100%': { transform: 'translateY(250px)', opacity: '1' },
//         },
//       },
//       backgroundImage: {
//         'grid-pattern': 'linear-gradient(rgba(124,106,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,106,247,0.05) 1px, transparent 1px)',
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//       },
//       backgroundSize: {
//         'grid': '40px 40px',
//       },
//     },
//   },
//   plugins: [],
// }


export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e1a',
          900: '#0d1224',
          800: '#111827',
          700: '#1a2235',
        },
        gold: {
          400: '#ffd700',
          500: '#f5c400',
          600: '#e6b800',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flip-in': 'flipIn 0.4s ease-out',
        'shake': 'shake 0.4s ease-out',
        'glow': 'glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(255,215,0,0.3)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(255,215,0,0.7)' },
        },
      },
    },
  },
  plugins: [],
}

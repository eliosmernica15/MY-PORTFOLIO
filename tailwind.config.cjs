/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#6d28d9',
          muted: '#c4b5fd',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-40px, 30px) scale(0.95)' },
          '66%': { transform: 'translate(25px, -40px) scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(15px, -30px) scale(1.02)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% / 3))' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(calc(-100% / 3))' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 20s ease-in-out infinite',
        'float-reverse': 'floatReverse 25s ease-in-out infinite',
        'float-slow': 'floatSlow 30s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'marquee-left': 'marquee-left 40s linear infinite',
        'marquee-right': 'marquee-right 45s linear infinite',
      },
    },
  },
  plugins: [],
};

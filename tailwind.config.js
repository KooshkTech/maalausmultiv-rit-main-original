/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy brand accent
        navy: {
          50: '#f0f5fb',
          100: '#dae7f5',
          200: '#b6cfeb',
          300: '#84acd9',
          400: '#4f82c0',
          500: '#2f63a3',
          600: '#1f4a86',
          700: '#163a6c',
          800: '#0f2e5c',
          900: '#0a2347',
          950: '#06182e',
        },
        // Orange CTA color
        orange: {
          50: '#fff6ed',
          100: '#ffe9d5',
          200: '#ffcfa8',
          300: '#ffac70',
          400: '#ff7f37',
          500: '#fb5e11',
          600: '#ec4605',
          700: '#c43306',
          800: '#9c2a0d',
          900: '#7d260f',
          950: '#440f02',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 46, 92, 0.08), 0 4px 16px -4px rgba(15, 46, 92, 0.06)',
        card: '0 4px 24px -8px rgba(15, 46, 92, 0.12), 0 2px 8px -2px rgba(15, 46, 92, 0.08)',
        lift: '0 12px 40px -12px rgba(15, 46, 92, 0.22), 0 4px 12px -4px rgba(15, 46, 92, 0.10)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.7s ease forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

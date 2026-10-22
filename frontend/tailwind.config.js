/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Accent de marque (white-label par école, via CSS vars)
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        // Système chaleureux "Teranga" (fixe)
        cream: '#FBF7F0',
        sand: '#F3ECE0',
        ink: '#2A2620',
        'ink-soft': '#6B6358',
        line: '#E7DECF',
        gold: '#E8A33D',
        terracotta: '#C45A3B',
        leaf: '#1B7F5C',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(120, 90, 40, 0.06)',
        card: '0 2px 12px rgba(120, 90, 40, 0.05)',
        lift: '0 16px 40px rgba(120, 90, 40, 0.10)',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
};

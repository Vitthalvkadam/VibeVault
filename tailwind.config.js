/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          black: '#0a0a0a',
          panel: '#121212',
          card: '#181818',
          cardHover: '#232323',
          border: '#2a2a2a',
        },
        accent: {
          DEFAULT: '#1ed760',
          dim: '#169c46',
          bright: '#3be477',
        },
        muted: '#a7a7a7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        player: '0 -8px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseBar: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out',
        pulseBar: 'pulseBar 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

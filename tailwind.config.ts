import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'off-white': '#FAFAF8',
        'light-gray': '#F2F2F0',
        'mid-gray': '#E0DED8',
        brand: '#1A1A1A',
        muted: '#8A8A8A',
        subtle: '#B8B6B0',
        lift: '#D4A853',
        social: '#C4788A',
        ease: '#8A9BB5',
        focus: '#7BAF8E',
        drive: '#C47A5A',
      },
      maxWidth: {
        content: '680px',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        slideDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease forwards',
        'slide-up': 'slideUp 300ms ease-out forwards',
        'slide-down': 'slideDown 250ms ease-in forwards',
      },
    },
  },
  plugins: [],
}

export default config

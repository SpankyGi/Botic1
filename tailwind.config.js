/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'botic-black':   '#0C0B09',
        'botic-dark':    '#161511',
        'botic-surface': '#211F1C',
        'botic-border':  '#2E2B27',
        'botic-cream':   '#EDE8DC',
        'botic-muted':   '#8A8278',
        'botic-gold':    '#9a2a2a',
        'botic-ivory':   '#F7F3EE',
        'botic-stone':   '#DDD8CF',
        'botic-text':    '#1A1814',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

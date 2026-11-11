/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        wargames: ['VT323', 'monospace'],
      },
      colors: {
        'wargames-amber': {
          DEFAULT: '#f59e0b',
          glow: '#fbbf24',
          dim: '#78350f',
        },
        'wargames-green': {
          DEFAULT: '#22c55e',
          glow: '#4ade80',
          dim: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
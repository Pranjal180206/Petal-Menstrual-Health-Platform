/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF6B9A',
          peach: '#FF8A8A',
          light: '#FDF7F8',
          dark: '#1D1D2C',
          gray: '#6B6B78',
          card: '#FFFFFF',
          purple: '#E9E5FF',
          blue: '#E5F3FF',
        },
        "bubblegum": "#ff85c1",
        "soft-pink": "#fff0f6",
        "deep-pink": "#d946ef",
        "primary": "#d946ef",
        "background-light": "#fff9fb",
      },
      fontFamily: {
        heading: ['Fredoka', 'Noto Sans Devanagari', 'sans-serif'],
        sans: ['Nunito', 'Noto Sans Devanagari', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(255,107,154,0.15)',
        'card': '0 8px 30px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}

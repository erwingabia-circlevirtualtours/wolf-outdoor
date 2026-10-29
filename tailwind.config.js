/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0c0e12',
          900: '#12151c',
          850: '#161a23',
          800: '#1c222e',
          700: '#273040',
          600: '#384357',
        },
        emerald: {
          DEFAULT: '#047857',
          950: '#022c22',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
        },
        signal: {
          DEFAULT: '#ea580c',
          600: '#ea580c',
          500: '#f97316',
          400: '#fb923c',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uta-green': {
          400: '#9ACD32',
          500: '#7CB342',
          600: '#689F38',
        },
        gray: {
          800: '#1f2937',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}
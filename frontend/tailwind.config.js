/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wealthsimple: {
          black: '#191919',
          gold: '#FFD700',
        },
        zones: {
          spend: '#EF4444',
          save: '#3B82F6',
          invest: '#EAB308',
        }
      }
    },
  },
  plugins: [],
}

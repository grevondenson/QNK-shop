/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F6',
        stone: '#CDC9C1',
        sand: '#D1BAA6',
        saddle: '#8B6D53',
        olive: '#929471',
        charcoal: '#4D4D4D',
      },
      fontFamily: {
        display: ['"The Seasons"', '"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Glacial Indifference"', '"DM Sans"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
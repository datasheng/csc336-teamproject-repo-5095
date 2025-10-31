/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: 'var(--primary-orange)',
          coral: 'var(--primary-coral)',
          green: 'var(--primary-green)',  
        },
      },
    },
  },
  plugins: [],
}
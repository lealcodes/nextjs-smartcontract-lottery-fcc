/** @type {import('tailwindcss').Config} */
module.exports = {
  // in content it just means anything in those folders with those files are tailwindable
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lacigale: {
          gold: "#C5A065",
          green: "#1E4D2B",
          bg: "#F5F7FA",
        },
      },
    },
  },
  plugins: [],
}

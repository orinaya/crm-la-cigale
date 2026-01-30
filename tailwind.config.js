/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lacigale: {
          gold: "#C5A065",
          green: "#1E4D2B",
          bg: "#FAFBFC",
          accent: "#FF6B6B",
          "accent-light": "#FFE5E5",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

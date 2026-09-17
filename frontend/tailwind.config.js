/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171f",
        paper: "#f6f1e8",
        mist: "#ece6db",
        amber: "#d97706",
        forest: "#0f766e",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(20, 23, 31, 0.08)",
      },
    },
  },
  plugins: [],
};

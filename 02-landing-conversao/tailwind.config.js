/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sand: "#f9f6f1",
        coral: "#ef8354",
        ocean: "#3d5a80",
        mint: "#98c1d9"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.1)", opacity: "1" }
        }
      },
      animation: {
        rise: "rise 700ms ease-out both",
        pulseSoft: "pulseSoft 1200ms ease-in-out infinite alternate"
      }
    }
  },
  plugins: []
};

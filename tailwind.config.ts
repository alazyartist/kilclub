import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { // Grayscale
          light: "#40c4ff",
          DEFAULT: "#00b0ff",
          dark: "#0091ea",
        },
        accent: {
          light: "#ff4081",
          DEFAULT: "#f50057",
          dark: "#c51162",
        },
        base: {
          light: "f4f4f5",
          DEFAULT: "#bbc",
          dark: "#99a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

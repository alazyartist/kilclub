import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          // Grayscale
          // light: "#40c4ff",
          // DEFAULT: "#00b0ff",
          // dark: "#0091ea",
          light: "#b1e9f9",
          DEFAULT: "#62d4fc",
          dark: "#43a7d9",
        },
        accent: {
          //pinks
          // light: "#ff4081",
          // DEFAULT: "#f50057",
          // dark: "#c51162",
          //oranges
          light: "#FD974E",
          // DEFAULT: "#FD6A02",
          // dark: "#c95502",
          DEFAULT: "#faa865",
          dark: "#e4854e",
        },
        base: {
          light: "#f4f4f5",
          DEFAULT: "#bbc",
          dark: "#99a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

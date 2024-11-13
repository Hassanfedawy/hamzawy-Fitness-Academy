import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B00", // Basketball orange
          dark: "#CC5500",
          light: "#FF8533",
        },
        secondary: {
          DEFAULT: "#2C2C2C", // Dark gray
          dark: "#1A1A1A",
          light: "#3D3D3D",
        },
        accent: {
          DEFAULT: "#FFD700", // Gold
          dark: "#CCB000",
          light: "#FFDF33",
        },
        background: {
          DEFAULT: "#121212", // Near black
          dark: "#000000",
          light: "#1E1E1E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
}

export default config
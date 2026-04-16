import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lat Shop Brand Colors
        brand: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f4dbb0",
          300: "#ecc07f",
          400: "#e29e4c",
          500: "#d4832a", // primary - warm amber/gold (African warmth)
          600: "#b86820",
          700: "#964f1c",
          800: "#7a3f1d",
          900: "#65351b",
        },
        accent: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e", // success green
          600: "#16a34a",
        },
        dark: {
          900: "#1a1209", // deep warm dark
          800: "#2d1f0e",
          700: "#3d2b14",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"], // elegant display font
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #d4832a 0%, #b86820 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

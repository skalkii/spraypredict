import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF9F5",
          100: "#F4F0E6",
          200: "#EAE3D2",
          300: "#DDD3BC",
        },
        ink: {
          50: "#F2F0EA",
          200: "#D6D2C5",
          300: "#B8B4A8",
          400: "#86847F",
          500: "#5C5B58",
          600: "#403F3C",
          700: "#2D2D2A",
          800: "#232321",
          900: "#1F1F1E",
        },
        clay: {
          50: "#FAEFE7",
          100: "#F3DDCB",
          200: "#E8BC9B",
          400: "#D9876B",
          500: "#C96442",
          600: "#B05435",
          700: "#8E4128",
        },
      },
      fontFamily: {
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
      },
      gridTemplateColumns: {
        "24": "repeat(24, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
export default config;

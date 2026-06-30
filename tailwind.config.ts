import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f211d",
        olive: "#50614a",
        moss: "#7b8b5b",
        linen: "#f7f1e7",
        porcelain: "#fffaf2",
        tomato: "#c95e49"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(31, 33, 29, 0.10)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;

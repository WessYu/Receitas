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
        ink: "#F8F8F5",
        olive: "#7BAE7F",
        moss: "#96C59A",
        linen: "#0F0F12",
        porcelain: "#141417",
        tomato: "#D96C6C"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(0, 0, 0, 0.28)"
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

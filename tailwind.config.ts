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
        background: "#09090B",
        surface: "#151517",
        elevated: "#1D1D22",
        border: "#2A2A30",
        ink: "#F8F8F5",
        muted: "#9A9AA0",
        disabled: "#66666D",
        olive: "#7BAE7F",
        sage: "#7BAE7F",
        moss: "#C89B5B",
        gold: "#C89B5B",
        link: "#9AD0FF",
        warning: "#D8B15A",
        tomato: "#D96C6C",
        linen: "#1D1D22",
        porcelain: "#141417"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.32)"
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Cormorant Garamond", "Georgia", "serif"]
      },
      borderRadius: {
        md: "20px",
        lg: "24px",
        xl: "28px",
        "2xl": "28px"
      }
    }
  },
  plugins: []
};

export default config;

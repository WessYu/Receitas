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
        surface: "#141417",
        elevated: "#1D1D22",
        border: "rgba(255,255,255,0.08)",
        ink: "#F5F5F3",
        muted: "#B8B8BE",
        disabled: "#66666D",
        olive: "#7BAE7F",
        sage: "#7BAE7F",
        gold: "#C89B5B",
        tomato: "#D96C6C",
        link: "#9AD0FF",
        warning: "#D8B15A",
        linen: "#1D1D22",
        porcelain: "#141417"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(0, 0, 0, 0.34)"
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

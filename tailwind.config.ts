import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0D10",
          950: "#08090C",
          900: "#0B0D10",
          800: "#101318",
          700: "#161A20",
          600: "#1D222A",
          500: "#272D37",
        },
        lime: {
          DEFAULT: "#B8FF3D",
          soft: "#D4FF85",
          dim: "#8FCB2E",
        },
        teal: {
          DEFAULT: "#5EEAD4",
          dim: "#2DD4BF",
        },
        ship: "#34D399",
        kill: "#FB7185",
        signal: "#FBBF24",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(184,255,61,0.25), 0 0 24px -4px rgba(184,255,61,0.35)",
        "glow-teal": "0 0 0 1px rgba(94,234,212,0.25), 0 0 24px -6px rgba(94,234,212,0.35)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "pulse-node": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(184,255,61,0.45)" },
          "50%": { boxShadow: "0 0 0 8px rgba(184,255,61,0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-node": "pulse-node 1.6s ease-out infinite",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

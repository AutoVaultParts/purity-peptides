import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        sky: {
          DEFAULT: "#4A90D9",
          light: "#72B7F2",
          bg: "#F6FAFD",
        },
        success: "#2EAF5D",
        warn: "#F5A623",
        error: "#D64545",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 1.6s linear infinite",
        "sway-a": "sway 4.8s ease-in-out infinite",
        "sway-b": "sway 6.2s ease-in-out infinite 0.8s",
      },
    },
  },
  plugins: [],
};

export default config;
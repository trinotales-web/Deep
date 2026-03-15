import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#f6f3ee",
        "bg-secondary": "#faf8f5",
        "bg-card": "#ffffff",
        "bg-dark": "#3d3a35",
        "bg-void": "#0a0a0a",
        "text-primary": "#3d3a35",
        "text-secondary": "#5a5549",
        "text-muted": "#8a8578",
        "text-light": "#b5ad9e",
        "text-placeholder": "#c5bfb4",
        "accent-green": "#7c9a6e",
        "accent-gold": "#d4a954",
        "accent-blue": "#6b9bc3",
        "accent-purple": "#8b7bb5",
        "accent-rust": "#9e6b5e",
        "accent-sage": "#a4be7b",
        "border-light": "#ede9e2",
        "border-medium": "#e0dbd3",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 1px 8px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.08)",
        modal: "0 20px 60px rgba(0,0,0,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        float: "float 12s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        "fill-up": "fillUp 0.5s ease-out forwards",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(10px, -30px)" },
          "66%": { transform: "translate(-15px, -10px)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.25)" },
        },
        fillUp: {
          "0%": { height: "0%" },
          "100%": { height: "100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      maxWidth: {
        mobile: "480px",
      },
    },
  },
  plugins: [],
};

export default config;

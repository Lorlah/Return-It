import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
        },
        surface: {
          base: "var(--surface-base)",
          elevated: "var(--surface-elevated)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        success: "var(--color-success)",
        error: "var(--color-error)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.5rem, 5vw + 1rem, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 4vw + 0.5rem, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw + 0.25rem, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(60, 50, 45, 0.04)",
        md: "0 4px 12px rgba(60, 50, 45, 0.06)",
        lg: "0 8px 24px rgba(60, 50, 45, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in": "slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

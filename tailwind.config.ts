import type { Config } from "tailwindcss";

// VYR Labs Design System - Conforme spec do prompt

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // VYR Labs tokens
        vyr: {
          bg: {
            primary: "hsl(var(--vyr-bg-primary))",
            surface: "hsl(var(--vyr-bg-surface))",
            elevated: "hsl(var(--vyr-bg-elevated))",
          },
          text: {
            primary: "hsl(var(--vyr-text-primary))",
            secondary: "hsl(var(--vyr-text-secondary))",
            muted: "hsl(var(--vyr-text-muted))",
          },
          stroke: {
            divider: "hsl(var(--vyr-stroke-divider))",
          },
          accent: {
            action: "hsl(var(--vyr-accent-action))",
            transition: "hsl(var(--vyr-accent-transition))",
            glow: "hsl(var(--vyr-accent-glow))",
          },
          pillar: {
            energia: "hsl(var(--vyr-energia))",
            clareza: "hsl(var(--vyr-clareza))",
            estabilidade: "hsl(var(--vyr-estabilidade))",
          },
          ring: {
            track: "hsl(var(--vyr-ring-track))",
            glow: "hsl(var(--vyr-ring-glow))",
          },
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontSize: {
        // Tipografia conforme spec
        "vyr-score": ["64px", { lineHeight: "1", fontWeight: "500" }],
        "vyr-title": ["18px", { lineHeight: "1.4", fontWeight: "500" }],
        "vyr-body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "vyr-caption": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 150ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
      },
      spacing: {
        // Espaçamentos conforme spec
        "vyr-margin": "20px",
        "vyr-padding": "16px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

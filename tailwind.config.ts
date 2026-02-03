import type { Config } from "tailwindcss";

/* ═══════════════════════════════════════════════════════════════════════════
   VYR LABS DESIGN SYSTEM — TAILWIND CONFIG
   
   PROIBIÇÕES:
   ❌ Vermelho puro | ❌ Verde neon | ❌ Azul ciano
   ❌ Gradiente chamativo | ❌ Glow | ❌ Shadow forte
   ❌ Skeleton branco | ❌ Cards coloridos por estado
   
   Se parecer "bonito demais", está errado.
   Se parecer calmo e inteligente, está certo.
   ═══════════════════════════════════════════════════════════════════════════ */

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
        /* Shadcn semantic tokens */
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
        
        /* ─────────────────────────────────────────────────────────────────────
           VYR LABS TOKENS
           ───────────────────────────────────────────────────────────────────── */
        vyr: {
          /* Fundos */
          bg: {
            primary: "hsl(var(--vyr-bg-primary))",     /* #0E0F12 VYR Black */
            surface: "hsl(var(--vyr-bg-surface))",    /* #14161B VYR Graphite */
            elevated: "hsl(var(--vyr-bg-elevated))",  /* #1C1F26 VYR Ash */
          },
          /* Tipografia */
          text: {
            primary: "hsl(var(--vyr-text-primary))",     /* #ECEEF2 VYR Ice */
            secondary: "hsl(var(--vyr-text-secondary))", /* #A7ADB8 VYR Fog */
            muted: "hsl(var(--vyr-text-muted))",         /* #6F7683 VYR Dust */
          },
          /* Divisores */
          stroke: {
            divider: "hsl(var(--vyr-stroke-divider))", /* #232733 VYR Line */
          },
          /* Acentos funcionais */
          accent: {
            action: "hsl(var(--vyr-accent-action))",       /* #3A5EFF Focus Blue */
            stable: "hsl(var(--vyr-accent-stable))",       /* #4F6F64 Moss Green */
            transition: "hsl(var(--vyr-accent-transition))", /* #8F7A4A Amber Clay */
          },
          /* Pilares cognitivos (micro-sinais) */
          pillar: {
            energia: "hsl(var(--vyr-energia))",           /* #5F6C7A Energy Slate */
            clareza: "hsl(var(--vyr-clareza))",           /* #6B7F9C Clarity IceBlue */
            estabilidade: "hsl(var(--vyr-estabilidade))", /* #4A5E57 Stability Pine */
          },
          /* Status semântico */
          status: {
            positive: "hsl(var(--vyr-positive))",  /* Moss Green */
            caution: "hsl(var(--vyr-caution))",    /* Amber Clay */
            neutral: "hsl(var(--vyr-negative))",   /* Dust (nunca vermelho) */
          },
          /* Ring gauge */
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
        "vyr-margin": "20px",
        "vyr-padding": "16px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

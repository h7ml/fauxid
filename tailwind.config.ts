import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        exo: ["var(--font-exo)"],
        poppins: ["var(--font-poppins)"],
      },
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
        cyber: {
          blue: "#0ff7ff",
          pink: "#ff34b3",
          purple: "#9a30fe",
          yellow: "#fffc36",
          dark: "#0d1117",
          darker: "#080a0f",
          light: "#222831",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        neon: "0 0 5px theme('colors.cyber.blue'), 0 0 20px theme('colors.cyber.blue')",
        "neon-pink": "0 0 5px theme('colors.cyber.pink'), 0 0 20px theme('colors.cyber.pink')",
        "neon-purple": "0 0 5px theme('colors.cyber.purple'), 0 0 20px theme('colors.cyber.purple')",
        "neon-yellow": "0 0 5px theme('colors.cyber.yellow'), 0 0 20px theme('colors.cyber.yellow')",
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
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
        "pulse-neon": {
          "0%, 100%": { 
            boxShadow: "0 0 5px theme('colors.cyber.blue'), 0 0 20px theme('colors.cyber.blue')",
            opacity: "1"
          },
          "50%": { 
            boxShadow: "0 0 15px theme('colors.cyber.blue'), 0 0 30px theme('colors.cyber.blue')",
            opacity: "0.8"
          },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "circuit-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 0%" },
        },
        "cyber-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "10%, 30%, 50%, 70%, 90%": { opacity: "0.6" },
          "20%, 40%, 60%, 80%": { opacity: "0.8" },
        },
        "particle-explosion": {
          "0%": { 
            transform: "translate(-50%, -50%) scale(0)",
            opacity: "1"
          },
          "100%": { 
            transform: "translate(-50%, -50%) scale(1.5)",
            opacity: "0"
          },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translate(-2px, 2px)" },
          "20%, 40%, 60%, 80%": { transform: "translate(2px, -2px)" },
        },
        "tunnel": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neon": "pulse-neon 2s infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "circuit-flow": "circuit-flow 3s linear infinite",
        "cyber-spin": "cyber-spin 8s linear infinite",
        "flicker": "flicker 2s linear infinite",
        "glitch": "glitch 0.5s ease-in-out",
        "tunnel": "tunnel 0.5s ease-in-out",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(15, 247, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 247, 255, 0.1) 1px, transparent 1px)",
        "cyber-circuit": "url('/images/circuit-pattern.svg')",
        "low-poly-dark": "url('/images/low-poly-dark.svg')",
        "particles": "url('/images/particles.svg')",
      },
      backgroundSize: {
        'circuit': '300% 100%',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

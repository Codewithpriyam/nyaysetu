/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // NyayaSetu Typography Design System: Calluna (Headings) + Inter (Interface/Body)
        calluna: ["Calluna", "Georgia", "Times New Roman", "serif"],
        heading: ["Calluna", "Georgia", "Times New Roman", "serif"],
        cormorant: ["Calluna", "Georgia", "Times New Roman", "serif"],
        playfair: ["Calluna", "Georgia", "Times New Roman", "serif"],
        inter: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        general: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],

        // Preserved display fonts
        zentry: ["zentry", "sans-serif"],
        "circular-web": ["circular-web", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
      },
      colors: {
        // ─── 4-COLOUR PALETTE (BLACK, DEEP BLUE, ORANGE, LIGHT GRAY) ──────
        black: "#000000",
        "deep-blue": "#233D4D",
        orange: "#FE7F2D",
        "light-gray": "#EAECF0",

        // ─── NYAYSETU CENTRALIZED THEME TOKENS (ct-*) ────────────────────
        ct: {
          void:   "#000000",  // Black (#000000): Main dark backgrounds, text and dark surfaces
          deep:   "#233D4D",  // Deep Blue (#233D4D): Secondary backgrounds, dark sections
          card:   "#233D4D",  // Deep Blue (#233D4D): Card backgrounds and panels
          wood:   "#233D4D",  // Deep Blue (#233D4D): Section backgrounds
          warm:   "#172832",  // Deep Blue darker tone
          gold:   "#FE7F2D",  // Orange (#FE7F2D): Primary accent, CTA buttons, active states, highlights, icons
          soft:   "#FF9750",  // Orange accent hover/highlight
          ivory:  "#EAECF0",  // Light Gray (#EAECF0): Main text on dark backgrounds, readable text
          muted:  "#98A2B3",  // Light Gray secondary/muted readable text
          white:  "#EAECF0",  // Light Gray (#EAECF0): Primary light readable text
        },

        // Legacy Token Scales (Mapped to 4-Colour Palette)
        navy: {
          50:  "#EAECF0",
          100: "#EAECF0",
          200: "#98A2B3",
          300: "#5A7382",
          400: "#365568",
          500: "#233D4D",
          600: "#1C313E",
          700: "#233D4D",
          800: "#172832",
          900: "#000000",
          950: "#000000",
        },
        gold: {
          50:  "#FFF3EB",
          100: "#FFE4D1",
          200: "#FFC5A3",
          300: "#FFA46E",
          400: "#FE7F2D",
          500: "#FE7F2D",
          600: "#E86B1A",
          700: "#C2530C",
          800: "#9C3F08",
          900: "#752E04",
        },
        crimson: {
          50:  "#FCE8E8",
          100: "#F5BEBE",
          200: "#EB8585",
          300: "#DC4C4C",
          400: "#C82020",
          500: "#A80E0E",
          600: "#8B1A1A",
          700: "#6B1010",
          800: "#4F0A0A",
          900: "#340505",
        },
        parchment: {
          50:  "#EAECF0",
          100: "#EAECF0",
          200: "#EAECF0",
          300: "#98A2B3",
          400: "#7D8998",
          500: "#FE7F2D",
        },
      },
      boxShadow: {
        "gold-glow":     "0 0 25px rgba(254, 127, 45, 0.25)",
        "gold-glow-lg":  "0 0 50px rgba(254, 127, 45, 0.35)",
        "court-card":    "0 12px 40px rgba(0, 0, 0, 0.7)",
        "court-hover":   "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(35, 61, 77, 0.35)",
      },
      backgroundImage: {
        "court-gold":    "linear-gradient(135deg, #FE7F2D 0%, #FF9750 50%, #FE7F2D 100%)",
        "court-dark":    "linear-gradient(180deg, #000000 0%, #233D4D 100%)",
        "court-card-bg": "linear-gradient(180deg, #233D4D 0%, #172832 100%)",
        "hero-fade":     "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 60%, #000000 100%)",
      },
    },
  },
  plugins: [],
};

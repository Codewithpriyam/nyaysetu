/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Preserved display fonts
        zentry: ["zentry", "sans-serif"],
        general: ["general", "sans-serif"],
        "circular-web": ["circular-web", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
        // NyayaSetu Editorial & Legal fonts
        cormorant: ["Cormorant Garamond", "Georgia", "serif"],
        playfair: ["Playfair Display", "Georgia", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        // ─── NYAYSETU COURTROOM PALETTE (ct-*) ──────────────────────────────
        ct: {
          void:   "#08090C",  // Primary deep courtroom near-black bg
          deep:   "#10131A",  // Secondary background layer
          card:   "#131722",  // Card surface background
          wood:   "#24170F",  // Deep mahogany courtroom wood accent
          warm:   "#4A2D18",  // Warm wood accent border/glow
          gold:   "#C89B52",  // Primary courtroom gold
          soft:   "#E0BD78",  // Soft warm gold hover accent
          ivory:  "#F4EBDD",  // Warm parchment ivory for headings
          muted:  "#9B9B9B",  // Muted legal text
          white:  "#F8F8F6",  // Pure warm white
        },
        // Existing Supreme Court Navy & Gold tokens (preserved)
        navy: {
          50:  "#E8EAF2",
          100: "#C5CAE0",
          200: "#9FA7CB",
          300: "#7884B6",
          400: "#5969A6",
          500: "#3A4F96",
          600: "#2D3E7A",
          700: "#1F2D5F",
          800: "#121D44",
          900: "#08090C",  // Updated to match ct-void
          950: "#040508",
        },
        gold: {
          50:  "#FDF8EC",
          100: "#F9EEC8",
          200: "#F3D98A",
          300: "#ECC34C",
          400: "#E0BD78",
          500: "#C89B52",   // Updated to match ct-gold
          600: "#A87A38",
          700: "#885D20",
          800: "#6B4410",
          900: "#4F2E08",
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
          50:  "#FDFBF7",
          100: "#F4EBDD",
          200: "#E6D7C3",
          300: "#D4C2AA",
          400: "#BFA98F",
          500: "#C89B52",
        },
      },
      boxShadow: {
        "gold-glow":     "0 0 30px rgba(200, 155, 82, 0.25)",
        "gold-glow-lg":  "0 0 60px rgba(200, 155, 82, 0.35)",
        "court-card":    "0 12px 40px rgba(4, 5, 8, 0.7)",
        "court-hover":   "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(200, 155, 82, 0.15)",
      },
      backgroundImage: {
        "court-gold":    "linear-gradient(135deg, #C89B52 0%, #E0BD78 50%, #C89B52 100%)",
        "court-dark":    "linear-gradient(180deg, #08090C 0%, #10131A 100%)",
        "court-card-bg": "linear-gradient(180deg, #131722 0%, #0D1018 100%)",
        "hero-fade":     "linear-gradient(180deg, rgba(8,9,12,0.3) 0%, rgba(8,9,12,0.75) 60%, #08090C 100%)",
      },
    },
  },
  plugins: [],
};

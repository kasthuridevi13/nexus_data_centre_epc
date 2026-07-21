/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg: "#050505", // Deep Obsidian Black
          panel: "#121212", // High contrast dark panel
          panel2: "#1A1A1A",
          line: "#333333", // Sharp grey borders
          grid: "#1F1F1F",
        },
        ink: {
          primary: "#FFFFFF", // Pure crisp white
          muted: "#A1A1AA", // Light grey
          faint: "#52525B",
        },
        signal: {
          cyan: "#00FFFF", // Electric Cyan
          amber: "#FF4D00", // Blazing Orange
          rose: "#FF0055", // Hot Pink
          green: "#CCFF00", // Volt Lime
          purple: "#8A2BE2", // Deep Violet
        },
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Roboto'", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "spin-slow-reverse": "spin 12s linear infinite reverse",
        "dash": "dash 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        dash: {
          "0%": { strokeDashoffset: 100 },
          "100%": { strokeDashoffset: 0 },
        }
      }
    },
  },
  plugins: [],
};

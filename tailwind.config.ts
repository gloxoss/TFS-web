import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // HeroUI
  ],
  darkMode: "class", // Important for switching modes
  theme: {
    extend: {
      // We will define our specific brand colors here later to override defaults
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-oswald)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9", // Example Primary
          900: "#0c4a6e",
        }
      },
      animation: {
        // Aceternity often relies on specific custom animations
        shimmer: "shimmer 2s linear infinite",
        "scrolling-banner": "scrolling-banner var(--duration) linear infinite",
        "scrolling-banner-vertical": "scrolling-banner-vertical var(--duration) linear infinite",
        aurora: "aurora 60s linear infinite",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "scrolling-banner": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-50% - var(--gap)/2))" },
        },
        "scrolling-banner-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-50% - var(--gap)/2))" },
        },
        aurora: {
          from: {
            transform: "translate(-10px, -10px)",
          },
          to: {
            transform: "translate(10px, 10px)",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
  },
  plugins: [
    heroui(), // HeroUI Plugin
    require('@tailwindcss/typography'),
    addVariablesForColors, // Aceternity Helper
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// Aceternity UI components specifically need this to function.
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;

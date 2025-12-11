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
      },
    },
  },
  plugins: [
    heroui(), // HeroUI Plugin
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

import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ds: {
          bg: "var(--ds-bg)",
          "bg-elevated": "var(--ds-bg-elevated)",
          surface: "var(--ds-surface)",
          "surface-hover": "var(--ds-surface-hover)",
          border: "var(--ds-border)",
          "border-strong": "var(--ds-border-strong)",
          text: "var(--ds-text)",
          "text-muted": "var(--ds-text-muted)",
          "text-subtle": "var(--ds-text-subtle)",
          "text-inverse": "var(--ds-text-inverse)",
          accent: "var(--ds-accent)",
          "accent-hover": "var(--ds-accent-hover)",
          "accent-muted": "var(--ds-accent-muted)",
          success: "var(--ds-success)",
          "success-muted": "var(--ds-success-muted)",
          error: "var(--ds-error)",
          "error-muted": "var(--ds-error-muted)",
          "focus-ring": "var(--ds-focus-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--ds-font-sans)"],
        mono: ["var(--ds-font-mono)"],
      },
      borderRadius: {
        ds: "var(--ds-radius)",
        "ds-sm": "var(--ds-radius-sm)",
        "ds-lg": "var(--ds-radius-lg)",
      },
      boxShadow: {
        ds: "var(--ds-shadow)",
        "ds-sm": "var(--ds-shadow-sm)",
        "ds-md": "var(--ds-shadow-md)",
      },
      maxWidth: {
        "container-sm": "28rem",
        "container-md": "42rem",
        "container-lg": "56rem",
      },
      transitionDuration: {
        ds: "var(--ds-duration)",
        "ds-fast": "var(--ds-duration-fast)",
        "ds-slow": "var(--ds-duration-slow)",
      },
      transitionTimingFunction: {
        ds: "var(--ds-ease)",
        "ds-out": "var(--ds-ease-out)",
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors")) as Record<string, string>;
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;

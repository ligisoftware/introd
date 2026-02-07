/**
 * Design system tokens — single source of truth for layout and semantic naming.
 * Actual color/type values are in CSS variables (globals.css) for light/dark theming.
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const spacing = {
  pageY: "clamp(1.5rem, 4vw, 2.5rem)",
  pageX: "clamp(1rem, 4vw, 2rem)",
  section: "clamp(2rem, 6vw, 3.5rem)",
  card: "clamp(1.25rem, 3vw, 1.75rem)",
} as const;

export const containerMaxWidth = {
  sm: "28rem",
  md: "42rem",
  lg: "56rem",
} as const;

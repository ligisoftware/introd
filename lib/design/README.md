# Design System

Design tokens and theming for Intro'd. Supports **light and dark mode** via `prefers-color-scheme` (and optional `.dark` class on `html`).

## Usage

- **Colors**: Use Tailwind classes like `bg-ds-surface`, `text-ds-text`, `text-ds-text-muted`, `border-ds-border`, `bg-ds-accent`, `text-ds-text-inverse`.
- **Typography**: `font-sans` uses the design system font (Plus Jakarta Sans). Body inherits from `layout.tsx`.
- **Radius**: `rounded-ds`, `rounded-ds-sm`, `rounded-ds-lg`.
- **Shadow**: `shadow-ds-sm`, `shadow-ds`, `shadow-ds-md`.
- **Containers**: `max-w-container-sm` (28rem), `max-w-container-md` (42rem), `max-w-container-lg` (56rem).
- **Motion**: Use `duration-ds`, `duration-ds-fast`, `duration-ds-slow` and `ease-ds`, `ease-ds-out` for transitions. Use `.ds-feedback-in` for success/error message entrance and `.ds-pop` for confirmation (e.g. "Copied!"). All motion respects `prefers-reduced-motion`.

## CSS variables

Defined in `app/globals.css`. Use `var(--ds-*)` in custom CSS when needed. Theme values switch automatically in dark mode.

## Tokens (JS)

`lib/design/tokens.ts` exports `breakpoints`, `spacing`, and `containerMaxWidth` for use in JS/TS (e.g. media queries or layout logic).

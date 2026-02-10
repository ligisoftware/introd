# CLAUDE.md

## Project

Intro'd — a founder profile-sharing app built with Next.js (App Router), Supabase, and Tailwind CSS.

## Tech stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Database / Auth**: Supabase (SSR client via `@supabase/ssr`)
- **Styling**: Tailwind CSS 3 with custom design system tokens (see below)
- **Email**: Resend
- **Validation**: Zod 4
- **Formatter**: Prettier (`npm run format`)
- **Linter**: ESLint (`npm run lint`)

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run format` — format with Prettier
- `npm run format:check` — check formatting

## Design system

Custom design tokens defined in `app/globals.css` and extended in `tailwind.config.ts`. Always use design system classes instead of raw Tailwind values:

- **Colors**: `bg-ds-surface`, `text-ds-text`, `text-ds-text-muted`, `text-ds-text-subtle`, `border-ds-border`, `bg-ds-accent`, `text-ds-text-inverse`
- **Typography**: `font-sans` (Plus Jakarta Sans)
- **Radius**: `rounded-ds`, `rounded-ds-sm`, `rounded-ds-lg`
- **Shadow**: `shadow-ds-sm`, `shadow-ds`, `shadow-ds-md`
- **Containers**: `max-w-container-sm` (28rem), `max-w-container-md` (42rem), `max-w-container-lg` (56rem)
- **Motion**: `duration-ds`, `duration-ds-fast`, `duration-ds-slow`, `ease-ds`, `ease-ds-out`. Entrance animations: `.ds-hero-in`, `.ds-feedback-in`, `.ds-pop`. All motion respects `prefers-reduced-motion`.
- **CSS variables**: Use `var(--ds-*)` in custom CSS. Theme values switch automatically in dark mode.
- **JS tokens**: `lib/design/tokens.ts` exports `breakpoints`, `spacing`, `containerMaxWidth`.

## Git workflow

- Always create a PR when pushing changes — never push directly to main.
- Branch names: kebab-case describing the change (e.g. `revamp-shared-profile-linktree`).
- Commit messages: imperative mood, concise, focused on "why" not "what".

## PR guidelines

### Title

- Imperative mood (e.g. "Add feature X" not "Added feature X")
- Concise and descriptive
- Include the area/component if relevant

### Description

#### Summary

- High-level overview of what and why (2-3 sentences max)

#### Changes

- List main changes at a high level
- Group related changes together
- Focus on user-visible or architectural changes

#### Testing

- Note manual testing performed
- Mention if automated tests were added/updated

### Include

- High-level feature description
- Breaking changes or migration notes
- Dependencies added/removed
- Configuration changes
- User-facing changes

### Exclude

- Don't list every file changed
- Don't include implementation details obvious from code review
- Don't document minor refactorings or code style changes

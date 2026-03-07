# Landing Page — Implementation Plan

**Purpose:** Actionable, step-by-step plan to implement the Introd landing page per `docs/landing-page-design-spec.md`. No full code—file list, component breakdown, and implementation order only.

---

## 1. Summary

- **Scope:** Hero (per-letter headline animation, subhead, CTAs), optional value bullets and “How it works” sections.
- **Constraints:** `app/page.tsx` remains a **server component** that fetches user and passes state into presentational pieces. Use only design system tokens (`ds-*`), `form-classes.ts` for buttons, and existing layout (header/footer unchanged).
- **CTAs:** Anonymous → primary “Get started” → `/login?next=/intro`, secondary “Log in” → `/login`. Logged-in → keep “Edit your intro” / “Edit your profile” as in current `app/page.tsx`.
- **First iteration (recommended):** Implement hero (headline animation, subhead, CTAs) and reduced-motion fallback only. **Omit** value bullets and How it works in the first iteration; add them in a follow-up if desired. This keeps the first PR focused and shippable.

---

## 2. Files to Create

| File                             | Purpose                                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/components/HeroHeading.tsx` | Client component that renders the hero headline as one `<span>` per character (including spaces), each with the per-letter animation and staggered delay. Must support reduced-motion fallback (whole-headline fade or no animation). |

---

## 3. Files to Modify

| File              | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css` | Add `@keyframes ds-hero-letter-in` (from: opacity 0, translateY(12px), blur(4px); to: opacity 1, translateY(0), blur(0)). Add a utility class for per-letter animation (e.g. applied via inline style or class + CSS custom property for delay). Add reduced-motion overrides inside the existing `@media (prefers-reduced-motion: reduce)` block: disable per-letter animation and optionally apply single fade-in to the whole headline (alongside existing `.ds-hero-in` / `.ds-stagger-*` overrides).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `app/page.tsx`    | Keep as server component. Replace current hero content with: (1) Hero block container (existing padding + `max-w-container-md`, hero content `max-w-xl` or `max-w-2xl`). (2) Hero headline via `<HeroHeading>` client component with chosen headline copy. (3) Single subhead paragraph with design-spec typography and spacing. (4) CTA row: if anonymous → “Get started” (Link + `btnPrimary`, href `/login?next=/intro`) and “Log in” (Link + `btnSecondary` or text link, href `/login`); if logged-in → keep current “Edit your intro” / “Edit your profile” links and reuse `btnPrimary` / existing text link styles from current page. Use `form-classes.ts` `btnPrimary` and `btnSecondary` for all CTAs. **Link + button classes:** Apply `className={btnPrimary}` or `className={btnSecondary}` directly on `<Link>`; no wrapper needed—Next.js Link forwards `className` to the anchor, and both classes already include focus ring styles. (5) Optional: value bullets and/or How it works sections below hero (recommend omitting in first iteration). |

---

## 4. Component Breakdown

### 4.1 `HeroHeading` (client component)

- **Location:** `app/components/HeroHeading.tsx`.
- **Props:** `text: string` (headline copy, e.g. “One link. Your story. Every intro.”).
- **Behavior:**
  - Split `text` into characters (e.g. `text.split('')`); render each character in a `<span>` with the same typography classes as the spec (e.g. `font-sans font-bold tracking-tight text-ds-text text-3xl sm:text-4xl lg:text-5xl leading-tight`).
  - Each span gets the per-letter animation: `ds-hero-letter-in` (or equivalent class) with duration `0.5s`, easing `var(--ds-ease-out)`, `fill-mode: both`, and `animation-delay` from stagger: `min(index * 45ms, 600ms)` where **index** is the 0-based character index. Stagger via inline style `animationDelay` (e.g. `style={{ animationDelay: \`${Math.min(i \* 45, 600)}ms\` }}`) or a class plus CSS variable for delay.
  - **Reduced-motion:** Use a wrapper element (e.g. `<span className="hero-headline-wrapper">`) that receives a class which, under `@media (prefers-reduced-motion: reduce)`, gets a single fade-in (e.g. same as `ds-hero-in`: opacity 0→1, ~0.4s, `var(--ds-ease-out)`). Under that media query, the per-letter spans must have `animation: none` (and no delay) so the whole headline either fades in as one or is visible immediately (spec prefers Option A: whole-headline fade).
- **Accessibility:** Implement as a **single logical heading** for screen readers. Have `HeroHeading` render the `<h1>` itself (the wrapper that contains the letter spans is the `<h1>`). Put all letter spans inside that `<h1>` with **no** `aria-hidden` on the headline text so assistive tech announces the full headline as one coherent phrase and the text remains copy-pasteable. Do not use `aria-hidden` on the h1 or the wrapper.

### 4.2 Page (`app/page.tsx`)

- **Remains a server component.** Imports `getCurrentUser`, `createClient`, and Link; optionally imports `HeroHeading` (client) and `btnPrimary` / `btnSecondary` from `form-classes`.
- **Structure:**
  - Outer: `<main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">` (unchanged).
  - Inner: `<div className="mx-auto max-w-container-md">` (unchanged).
  - Hero block: `<div className="max-w-xl">` (or `max-w-2xl` if headline is long) containing:
    - `<HeroHeading text="…" />` — **HeroHeading must render the `<h1>` internally** (wrapper element is the `<h1>`, letter spans inside it) so the page has exactly one `<h1>` and AT gets one coherent headline.
    - Subhead: one `<p>` with spacing `mt-4 sm:mt-5`, classes per spec (`font-sans font-normal text-ds-text-muted text-base sm:text-lg`, optional `max-w-xl`). Optionally add a single entrance class (e.g. `ds-stagger-1` or a dedicated subhead delay class ~0.35s) so it animates after the headline starts.
    - CTA row: `<p className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 gap-4">` (or `gap-3`). If `!user`: primary Link “Get started” `href="/login?next=/intro"` with `className={btnPrimary}`; secondary Link “Log in” `href="/login"` with `className={btnSecondary}` (or text link style per spec). If `user`: existing “Edit your intro” (Link to `/intro`, `btnPrimary`) and “Edit your profile” (Link to `/profile`, text link style).
  - Optional sections below (if implemented): value bullets, then How it works.

### 4.3 Optional: Value bullets

- **Placement:** Below hero CTA row, above “How it works” if both present.
- **Implementation:** Section with 2–3 bullets (e.g. “One link, always up to date”; “Professional first impression”; “Less back-and-forth with investors”). List with `text-ds-text-muted`, `text-base` or `text-sm`, `space-y-2`; optional icons. Use existing stagger classes `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3` on list items so reduced-motion is respected.
- **Component:** Can be inline in `page.tsx` or a small presentational component (server or client as needed).

### 4.4 Optional: How it works (3 steps)

- **Placement:** Below value bullets (or below hero if value bullets omitted).
- **Content:** Three steps, e.g. “Create your intro” → “Add your startup & team” → “Share one link.” Short labels only.
- **Layout:** Horizontal on `sm:` (three columns or flex), stacked on small screens. Step labels: `text-ds-text` or `text-ds-text-muted`; optional step number or connector. Cards: `rounded-ds`, `bg-ds-surface` or subtle borders if desired.
- **Entrance:** `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3` (and optionally `ds-stagger-4` for a wrapper or CTA below).

---

## 5. CSS Additions (`app/globals.css`)

- **Keyframes:** Add `@keyframes ds-hero-letter-in` with `from`: `opacity: 0`, `transform: translateY(12px)`, `filter: blur(4px)`; `to`: `opacity: 1`, `transform: translateY(0)`, `filter: blur(0)`.
- **Per-letter class:** A class (e.g. `.ds-hero-letter-in`) that applies `animation: ds-hero-letter-in 0.5s var(--ds-ease-out) both`. Delay is applied per element (inline style or data attribute + CSS) as `min(index * 45ms, 600ms)`.
- **Reduced-motion (required):** In the existing `@media (prefers-reduced-motion: reduce)` block in `globals.css`, add:
  - Override so that per-letter animation is disabled (e.g. `.ds-hero-letter-in { animation: none; }` and ensure letter spans are visible).
  - A class for the whole-headline wrapper (e.g. `.ds-hero-headline-in`) that applies a single fade-in: `animation: ds-fade-in 0.4s var(--ds-ease-out) both`, so under reduce the wrapper fades in once. (If the wrapper is the only animated element under reduce, letter spans need no animation so they don’t flash.)

---

## 6. Copy Choices (from design spec)

- **Headline (pick one):** e.g. “One link. Your story. Every intro.” / “Your fundraising intro, in one link.” / “One link for every intro.”
- **Subhead (one sentence):** e.g. Option A: “A single shareable page with your background, startup, and team—for investors and warm intros.”
- **Primary CTA (anonymous):** “Get started” (recommended) or “Create your intro.”
- **Secondary CTA (anonymous):** “Log in.”

---

## 7. Step-by-Step Implementation Order

1. **globals.css**
   - Add `@keyframes ds-hero-letter-in`.
   - Add utility class for per-letter animation (e.g. `.ds-hero-letter-in`).
   - Add reduced-motion overrides: disable per-letter animation; add whole-headline fade class (e.g. `.ds-hero-headline-in`) and include it in the reduce block so it’s the only headline motion when reduced.

2. **HeroHeading client component**
   - Create `app/components/HeroHeading.tsx` with `"use client"`.
   - Accept `text` prop; split into characters; render `<h1>` with one `<span>` per character inside it (HeroHeading renders the `<h1>`), each with typography classes and per-letter animation + staggered delay (inline style for `animationDelay` or equivalent).
   - Add wrapper with class that gets whole-headline fade under reduced-motion (e.g. `ds-hero-headline-in` on wrapper; under reduce, letter spans get no animation).

3. **page.tsx**
   - Import `HeroHeading` and `btnPrimary` / `btnSecondary` from `form-classes`.
   - Replace hero content: container (max-w-xl or max-w-2xl), `<HeroHeading text="…" />`, subhead `<p>` with spec spacing and typography, CTA row with conditional anonymous vs logged-in links using `btnPrimary` / `btnSecondary` on `<Link>` (no wrapper).
   - Remove duplicate or obsolete copy so there is one headline and one subhead.

4. **Optional — Value bullets**
   - Add section below hero with 2–3 bullets; use `ds-stagger-1`–`ds-stagger-3`; design tokens only.

5. **Optional — How it works**
   - Add 3-step section; responsive layout; stagger classes; design tokens only.

6. **Manual checks**
   - Anonymous: “Get started” → `/login?next=/intro`, “Log in” → `/login`.
   - Logged-in: “Edit your intro” / “Edit your profile” unchanged.
   - Enable `prefers-reduced-motion: reduce` and confirm no per-letter animation and whole-headline fade (or no animation) only.
   - Run `npm run lint` and `npm run format`.

---

## 8. Design System Checklist (reference)

- **Colors:** `text-ds-text`, `text-ds-text-muted`, `bg-ds-accent`, `bg-ds-surface`, `border-ds-border`, `ring-ds-focus-ring`.
- **Typography:** `font-sans`, weights/sizes per spec (§1.2–1.3 in design spec).
- **Motion:** `var(--ds-duration)`, `var(--ds-duration-slow)`, `var(--ds-ease-out)`; `ds-hero-in`, `ds-stagger-1`–`ds-stagger-4` where applicable.
- **Reduced motion:** All motion respects `prefers-reduced-motion: reduce`; per-letter animation disabled; whole-headline fade or no animation only.

---

## 9. Review feedback applied

- **Link + button classes:** Clarified that `btnPrimary` and `btnSecondary` are applied directly on `<Link>` with no wrapper; both include focus ring and are safe for CTAs.
- **Optional sections:** Recommended first iteration = hero + CTAs + reduced-motion only; omit value bullets and How it works until a follow-up.
- **HeroHeading accessibility:** Specified that HeroHeading renders the `<h1>` internally with letter spans inside it; no `aria-hidden` on headline text so screen readers get one coherent headline.
- **Stagger:** Clarified that stagger index is 0-based and gave an inline-style example for `animationDelay`.
- **Reduced-motion / globals.css:** Replaced brittle line-number reference with “existing `@media (prefers-reduced-motion: reduce)` block” and alignment with `.ds-hero-in` / `.ds-stagger-*` overrides.
- **Step order:** Step 2 now explicitly says “render `<h1>`” (HeroHeading renders the h1).

---

_End of implementation plan._

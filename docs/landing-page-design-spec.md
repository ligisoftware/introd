# Landing Page — Design Spec

**Product:** Introd  
**Audience:** Front-end engineer  
**Purpose:** Implementation-ready spec for the landing page hero, CTAs, and optional value/how-it-works sections. No code in this doc—spec only.

---

## 1. Hero Section

### 1.1 Layout and spacing

- **Container:** Reuse existing page shell: `px-4 py-10 sm:px-6 sm:py-14 lg:px-8`, content constrained by `max-w-container-md` (42rem) centered.
- **Hero block:** Max width for headline + subhead + CTAs: `max-w-xl` (or `max-w-2xl` if the chosen headline is longer). Vertically: comfortable spacing between headline, subhead, and CTA row—no cramped stacking.
- **Spacing between elements:**
  - Headline → subhead: `mt-4` (1rem) on mobile, `mt-5` (1.25rem) from `sm:` up.
  - Subhead → CTA row: `mt-6` (1.5rem) on mobile, `mt-8` (2rem) from `sm:` up.
  - Between primary and secondary CTA: `gap-3` or `gap-4`.

### 1.2 Headline typography

- **Font:** `font-sans` (Plus Jakarta Sans via `--ds-font-sans`).
- **Weight:** `font-bold`.
- **Color:** `text-ds-text`.
- **Letter-spacing:** Tight; use `tracking-tight` (Tailwind) or equivalent (e.g. `-0.025em`).
- **Responsive font size:**
  - Mobile: `text-3xl` (1.875rem).
  - `sm:` and up: `text-4xl` (2.25rem).
  - `lg:` and up (optional): `text-5xl` (3rem) if the layout has room and the headline is short.
- **Line height:** Default or `leading-tight` so multi-word headlines don’t feel loose.

### 1.3 Subhead typography

- **Font:** `font-sans`.
- **Weight:** `font-normal`.
- **Color:** `text-ds-text-muted`.
- **Responsive font size:** `text-base` on mobile, `sm:text-lg` up.
- **Line height:** Default body (e.g. `leading-relaxed` or unset).
- **Max width:** Optional `max-w-xl` or similar so the subhead doesn’t span full container on large screens.

---

## 2. Hero Heading Animation (per letter)

The hero **headline** (not the subhead) uses a per-character animation: **fade in + slide up + blur reduce**. The subhead uses a single entrance (e.g. fade or fade + slide) after the headline, not per letter.

### 2.1 Implementation approach

- **Recommended:** Render the headline as a sequence of `<span>` elements (one per character, including spaces). Each span gets the same base typography classes and an animation that is **staggered by index**.
- **Alternative:** CSS-only with a single element and `animation-delay` on pseudo-elements or duplicated content is possible but harder to maintain; the spec assumes a React “span per letter” approach unless the engineer prefers pure CSS.

### 2.2 Animation parameters (default motion)

- **Initial state (each letter):**
  - `opacity`: `0`
  - `transform`: `translateY(12px)` (slide up; match order of magnitude to existing `ds-slide-up` in `globals.css`)
  - `filter`: `blur(4px)` (or `blur(6px)` for a stronger effect; keep &lt; 8px for performance)
- **End state (each letter):**
  - `opacity`: `1`
  - `transform`: `translateY(0)`
  - `filter`: `blur(0)`
- **Duration:** `0.5s` per letter (use `var(--ds-duration-slow)` = 300ms if you prefer snappier; 500ms is a safe default).
- **Easing:** `var(--ds-ease-out)` (cubic-bezier(0.16, 1, 0.3, 1)).
- **Stagger:** Delay per character: **40–50ms** (e.g. `animation-delay: calc(0.04s * index)` or `0.05s * index`). Cap total delay (e.g. after 15–20 characters) so the tail doesn’t animate too late: e.g. `min(index * 45ms, 600ms)`.
- **Fill mode:** `both` so letters stay at end state and don’t flash invisible before start.

### 2.3 Keyframes (reference)

Engineer can define a single keyframe set, e.g. `ds-hero-letter-in`:

- **from:** `opacity: 0`, `transform: translateY(12px)`, `filter: blur(4px)`
- **to:** `opacity: 1`, `transform: translateY(0)`, `filter: blur(0)`

Apply to each letter span with `animation: ds-hero-letter-in 0.5s var(--ds-ease-out) both` and `animation-delay` from stagger.

### 2.4 Reduced-motion fallback (required)

- **When `prefers-reduced-motion: reduce`:**
  - **Do not** use per-letter stagger, blur, or slide.
  - **Use one of:**
    - **Option A (preferred):** Single fade-in for the **entire headline** (e.g. same as existing `ds-hero-in`: opacity 0 → 1, ~0.4s, `var(--ds-ease-out)`).
    - **Option B:** No headline animation (headline visible immediately).
- **Implementation:** Use `@media (prefers-reduced-motion: reduce)` to override: either a wrapper class that applies a single fade-in to the whole headline and disables per-letter animation, or conditional logic so letter spans get no animation / no delay when reduced motion is preferred. Align with existing pattern in `app/globals.css` (lines 268–279) where `.ds-hero-in` and `.ds-stagger-*` are set to `animation: none` under that media query.

---

## 3. CTAs

### 3.1 Primary CTA (anonymous users)

- **Label:** “Get started” or “Create your intro” (see copy section below).
- **Destination:** `/login?next=/intro` (or equivalent sign-up flow with next to `/intro`).
- **Styling:** Use existing **primary button** from the codebase: import `btnPrimary` from `@/app/components/form-classes`. This gives: `rounded-ds`, `bg-ds-accent`, `text-ds-text-inverse`, `shadow-ds-sm`, hover/focus/active states per design system.
- **Semantic:** `<Link>` with `className={btnPrimary}` (or equivalent if a design-system button component exists).
- **Placement:** First in the CTA row, visually dominant.

### 3.2 Secondary CTA (anonymous users)

- **Label:** “Log in”
- **Destination:** `/login` (no `next` required, or same as primary if product prefers).
- **Styling:** Use **secondary button**: `btnSecondary` from `form-classes` (bordered, `bg-ds-surface`, `text-ds-text`). Alternatively, for a text-only link, match the header “Log in” style: `text-sm font-medium text-ds-text-muted` with hover `text-ds-text` and focus ring (see `app/layout.tsx` nav link).
- **Placement:** Next to primary with `gap-3` or `gap-4`; visually secondary (outline or text link).

### 3.3 Logged-in users

- Keep existing behavior: **primary:** “Edit your intro” → `/intro`; **secondary:** “Edit your profile” → `/profile`. Reuse the same `btnPrimary` / text link styles as in current `app/page.tsx` so the hero doesn’t regress for authenticated users.

---

## 4. Optional: Value Bullets

- **Placement:** Below the hero CTA row, above or below “How it works” if both are present.
- **Content:** 2–3 short bullets, one line each, e.g. “One link, always up to date”; “Professional first impression”; “Less back-and-forth with investors.”
- **Styling:** List with `text-ds-text-muted`, `text-base` or `text-sm`; icons optional (simple dot or check). Use `space-y-2` or similar.
- **Entrance:** If the section is present, use staggered entrance: assign `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3` to the first three bullets (or to the section + first two bullets) so they respect `prefers-reduced-motion` via existing globals.

---

## 5. Optional: How It Works (3 steps)

- **Placement:** Below value bullets (or below hero if value bullets omitted).
- **Content:** Three steps, e.g. “Create your intro” → “Add your startup & team” → “Share one link.” Short labels only.
- **Layout:** Horizontal on `sm:` and up (three columns or flex); stacked on small screens.
- **Styling:** Step labels use `text-ds-text` or `text-ds-text-muted`; optional step number or connector (e.g. arrow). Use `rounded-ds`, `bg-ds-surface` or subtle borders if cards are used.
- **Entrance:** Stagger: `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3` (and optionally `ds-stagger-4` for a wrapper or CTA below). Ensures reduced-motion behavior is consistent with design system.

---

## 6. Copy: Headline and Subhead

Align with PM brief: benefit-led, outcome-focused, one link, founders/investors. Tone: confident, clear, minimal.

### 6.1 Headline options (pick one)

1. **One link. Your story. Every intro.**
2. **Your fundraising intro, in one link.**
3. **One link for every intro.**

### 6.2 Subhead (one sentence)

- **Option A:** “A single shareable page with your background, startup, and team—for investors and warm intros.”
- **Option B:** “Create one page. Share with investors. Fewer docs, less back-and-forth.”

Use one headline + one subhead; Option A for subhead is the closest to current PM wording and clarifies “who it’s for.”

### 6.3 Primary CTA label

- “Get started” (generic, low friction) or “Create your intro” (action-specific). Recommend “Get started” for hero; “Create your intro” is a strong alternative if the headline is already very short.

---

## 7. Design System Checklist

- **Colors:** `text-ds-text`, `text-ds-text-muted`, `bg-ds-accent`, `bg-ds-surface`, borders `border-ds-border`, focus `ring-ds-focus-ring`.
- **Typography:** `font-sans` (Plus Jakarta Sans); weights and sizes as in §1.2–1.3.
- **Radius / shadow:** `rounded-ds`, `shadow-ds-sm` for buttons; `rounded-ds-lg` if needed for cards.
- **Motion:** `var(--ds-duration)`, `var(--ds-duration-slow)`, `var(--ds-ease-out)`; use existing utilities `ds-hero-in`, `ds-stagger-1`–`ds-stagger-4` where applicable.
- **Reduced motion:** All motion (including per-letter hero animation) must respect `prefers-reduced-motion: reduce` as in §2.4 and `globals.css`.

---

## 8. Footer and Existing Layout

- **Footer:** No change. Keep existing footer (e.g. Feedback link) and layout structure.
- **Header / auth:** No regression; existing “Log in” in header for anonymous users and AuthBar for logged-in users remain. Landing hero lives in `<main>` as today.

---

_End of design spec. Implement in `app/page.tsx` (and any shared components) following this spec and the project’s design tokens._

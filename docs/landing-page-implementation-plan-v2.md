# Landing Page v2 — Implementation Plan

**Purpose:** Actionable plan for implementing the full landing page v2 from `landing-page-design-spec-v2.md`. All seven sections, design tokens only, server component page with optional client components where needed.

**References:** Design spec v2 (§1–§10), current `app/page.tsx`, `app/globals.css`, `app/components/HeroHeading.tsx`, `app/components/form-classes.ts`, footer in `app/layout.tsx`.

**Note:** `form-classes.ts` exports only `btnPrimary` and `btnSecondary`; there is no inverse variant. The Final CTA block uses custom Tailwind classes for the inverse-on-accent button (see §4.6 and §6).

---

## 1. Summary

- **Scope:** All 7 sections: Hero, Problem/Solution, Features (4 cards), How it works (3 steps), Social proof, Final CTA block, Footer. Design tokens only; no new dependencies unless necessary.
- **Architecture:** Page remains a **server component**; `getCurrentUser(supabase)` for conditional CTAs. `HeroHeading` stays a **client component** (per-letter animation). No new client components required unless implementer prefers extracting a small presentational component (e.g. `FeatureCard`).
- **Animation:** New utility `ds-section-in` (fade + slide-up); reuse `ds-stagger-1`–`ds-stagger-4`; all animations respect `prefers-reduced-motion` (add `ds-section-in` to reduce block).
- **Copy:** All exact copy from spec §10 (Copy Quick Reference).

---

## 2. Files to Create

| File              | Purpose | Client/Server |
| ----------------- | ------- | ------------- |
| _(none required)_ | —       | —             |

**Recommendation:** Keep all sections inline in `page.tsx` for simplicity. If desired for clarity:

- **Optional:** `app/components/landing/FeatureCard.tsx` — presentational only: `icon`, `title`, `description`, `className` (for stagger). **Server component.** Use only if the main page feels too long.
- **Optional:** `app/components/landing/ProblemSolutionSection.tsx` — two-column block with "The problem" / "The solution" copy. **Server component.** Inline is preferred.

Do **not** create separate components for Hero (HeroHeading already exists), How it works, Social proof, or Final CTA unless the implementer explicitly wants to split for maintainability.

---

## 3. Files to Modify

### 3.1 `app/globals.css`

- **Add** utility `.ds-section-in`: `animation: ds-slide-up var(--ds-duration-slow) var(--ds-ease-out) both;` (reuse existing `ds-slide-up` keyframes).
- **Add** `.ds-section-in` to the existing `@media (prefers-reduced-motion: reduce)` block: `animation: none;` so section entrances do not run (content appears immediately). Optionally use a fade-only keyframe for reduced motion; spec allows either.

### 3.2 `app/page.tsx`

- **Restructure:** Replace current single-column hero + value bullets with full page: Hero → Problem/Solution → Features → How it works → Social proof → Final CTA. Footer stays in `app/layout.tsx` (no change).
- **Shell and section layout:** Use **full-width sections** with section-level background and inner content width—do not rely on a single padded main for horizontal spacing. **Recommended:** `main` with `flex-1 py-10 sm:py-14` only (no horizontal padding on main). Each `<section>` is full-width and owns its own: (1) background (e.g. `bg-ds-surface`, `bg-ds-bg`), (2) vertical padding `py-16 sm:py-20`, (3) inner wrapper with `max-w-container-md` or `max-w-container-lg`, `mx-auto`, and horizontal padding `px-4 sm:px-6 lg:px-8`. Hero can keep a centered inner block (e.g. `max-w-container-md mx-auto px-4 sm:px-6 lg:px-8`). This matches the design spec: section padding and content width are per section; backgrounds can span full width.
- **Hero:** Add trust line "Free to start." between subhead and CTAs; change primary CTA label to "Create your intro — free" (anon) and ensure secondary "Log in"; logged-in: "Edit your intro" / "Edit your profile". Adjust spacing: subhead → trust line `mt-4`/`sm:mt-5`, trust line → CTA row `mt-6`/`sm:mt-8`; CTA gap `gap-3` or `gap-4`.
- **Remove:** The existing `<ul>` of value bullets (three list items).
- **Add:** Problem/Solution section (two columns on sm+, stacked on mobile), Features (2×2 grid, four cards), How it works (three steps), Social proof (testimonial + trust line), Final CTA block (accent background, inverse text, conditional CTAs).
- **Data:** Continue passing `user` from `getCurrentUser(supabase)`; use for all CTA blocks (Hero and Final CTA).

### 3.3 `app/layout.tsx`

- **No changes** for v2. Footer remains as-is (Feedback link). Optional placeholder areas (Product / Company) per spec §7 are out of scope for this plan—do not add links that go nowhere.

### 3.4 `app/components/HeroHeading.tsx`

- **No changes.** Headline copy remains "One link. Your story. Every intro." (passed from page).

---

## 4. Section-by-Section Implementation

### 4.1 Hero

- **Structure:** `<section aria-labelledby="hero-heading">` (or no aria if id not set). Single `<h1 id="hero-heading">` via HeroHeading. One `<p>` subhead, one `<p>` trust line, one `<div>` or `<p>` for CTA row (flex, gap-3 or gap-4).
- **Layout:** Outer container `max-w-container-md` centered; inner hero block `max-w-xl` or `max-w-2xl`. Spacing: headline → subhead `mt-4 sm:mt-5`, subhead → trust line `mt-4 sm:mt-5`, trust line → CTAs `mt-6 sm:mt-8`.
- **Copy:** Headline: "One link. Your story. Every intro." Subhead: "A single shareable page with your background, startup, and team—for investors and warm intros." Trust line: "Free to start."
- **Animation:** HeroHeading already has per-letter + reduced-motion. Subhead/trust/CTAs: use `ds-hero-in` or stagger-style delay (e.g. subhead `ds-hero-in`, trust and CTAs with same or no class) per existing spec.
- **CTAs:** Anonymous: Primary "Create your intro — free" → `/login?next=/intro` (btnPrimary). Secondary "Log in" → `/login` (btnSecondary or text link `text-sm font-medium text-ds-text-muted` hover `text-ds-text` + focus ring). Logged-in: Primary "Edit your intro" → `/intro`, Secondary "Edit your profile" → `/profile` (same secondary/link style).

### 4.2 Problem / Solution

- **Structure:** One `<section>` containing two logical sub-blocks. **Heading semantics (explicit):** Use **two `<h2>` elements** as the block labels so the outline has clear landmarks: first `<h2 id="problem-heading">` "The problem", second `<h2 id="solution-heading">` "The solution". Section can use `aria-labelledby="problem-heading"` or omit aria if the two h2s are sufficient. Each block: `<h2>` (label), then body `<p>`. Do not use a single "optional" section heading—the labels "The problem" and "The solution" are the section headings.
- **Layout:** Section padding `py-16 sm:py-20`, horizontal `px-4 sm:px-6 lg:px-8` (or inherit from main). Content `max-w-container-lg` mx-auto. Desktop: grid or flex two columns `gap-8` or `gap-10`. Mobile: stack `space-y-8` or `space-y-10`. Background `bg-ds-surface` or `bg-ds-bg-elevated` for distinction from hero.
- **Copy:** Label "The problem" / body "Founders send the same context over and over—decks, bios, one-liners—across email and Slack. Investors get fragments, not a story." Label "The solution" / body "Introd is one link that stays up to date. Your background, your startup, your team. One page. Every intro."
- **Typography:** Labels `text-sm font-semibold uppercase tracking-wide text-ds-text-muted` or `text-base font-semibold text-ds-text`. Body `text-ds-text-muted text-base sm:text-lg leading-relaxed`, optional `max-w-prose` per column.
- **Animation:** Apply `ds-section-in` to the section wrapper or to each column.

### 4.3 Features

- **Structure:** `<section aria-labelledby="features-heading">`. `<h2 id="features-heading">` "Why Introd". Grid of four cards.
- **Layout:** Section padding `py-16 sm:py-20`; content `max-w-container-lg` mx-auto. Grid `grid sm:grid-cols-2 gap-6` or `gap-8`. Background default `bg-ds-bg` or alternate with previous section (e.g. `bg-ds-bg` if Problem/Solution used `bg-ds-surface`).
- **Section heading:** "Why Introd" — `text-2xl` or `text-3xl font-bold text-ds-text`, `mb-10` or `mb-12`. Entrance `ds-section-in` or first stagger.
- **Cards:** Each card: `rounded-ds-lg border border-ds-border shadow-ds-sm p-5 sm:p-6 bg-ds-surface`. Hover: `transition duration-ds ease-ds` and `hover:-translate-y-0.5` (or -2px) and/or `hover:shadow-ds` (or `hover:shadow-ds-md`). Icon → title `mb-2` or `mb-3`, title → description `mb-2` or `mb-3`. Title `text-lg font-semibold text-ds-text`. Description `text-ds-text-muted text-base leading-relaxed`.
- **Copy (exact):**
  - Card 1: Title "One link for every intro". Description "Share a single URL instead of resending decks and bios. Your intro stays in one place so investors and warm intros get the full picture every time."
  - Card 2: Title "Professional first impression". Description "Your background, startup, and team in a clean, standardized format. Look prepared and credible from the first click."
  - Card 3: Title "Always up to date". Description "Update your page once and every shared link reflects the latest. No more "here's the new deck" threads."
  - Card 4: Title "Built for warm intros and investors". Description "Designed for the way founders actually raise: one link in an email, in a Slack intro, or after a meeting. Less back-and-forth, more clarity."
- **Icons:** Emoji or simple inline SVG/Tailwind. Suggestion: Card 1 🔗 or link icon; Card 2 📄 or document/card shape; Card 3 ✓ or circular arrow; Card 4 🤝 or node graphic. Small rounded container, `text-ds-accent` or `text-ds-text-muted`.
- **Animation:** Assign `ds-stagger-1` … `ds-stagger-4` to the four cards in order.

### 4.4 How it works

- **Structure:** `<section aria-labelledby="how-it-works-heading">`. **Heading (explicit):** Use a visible `<h2 id="how-it-works-heading">` "How it works" so the section has a proper landmark. Three step blocks; include the subline at bottom (see copy below).
- **Layout:** Section padding `py-16 sm:py-20`; content `max-w-container-md` or `max-w-container-lg` mx-auto. Desktop: flex or grid three columns `gap-6` or `gap-8`. Mobile: stack `space-y-6` or `space-y-8`. Background e.g. `bg-ds-surface` if Features used `bg-ds-bg`.
- **Steps (exact copy):**
  - Step 1: Label "Create your intro". Copy "Add your name, photo, and a short bio."
  - Step 2: Label "Add your startup & team". Copy "Link your company, role, and key teammates."
  - Step 3: Label "Share one link". Copy "Send your Introd link anywhere—email, Slack, or after a meeting."
  - **Subline (include):** "Takes minutes, not hours." — `text-sm text-ds-text-muted`, centered or left. This is in spec §10; do not omit.
- **Typography:** Step label `text-base` or `text-lg font-semibold text-ds-text`. One-line copy `text-sm` or `text-base text-ds-text-muted leading-relaxed`. Optional step numbers (1, 2, 3) in circle/pill or arrow/line between steps—minimal.
- **Animation:** `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3` on the three steps; optional `ds-stagger-4` on subline.

### 4.5 Social proof

- **Structure:** `<section aria-labelledby="social-proof-heading">`. **Heading (explicit):** Use one `<h2 id="social-proof-heading">` for the section—e.g. "What founders say" or "Social proof" (can be visually subtle or `sr-only` if the design emphasizes the quote). One block for quote + attribution, one for trust line.
- **Layout:** Single block centered or left in `max-w-container-md`. Section padding `py-16 sm:py-20`.
- **Copy:** Quote "Introd made our intro process 10x simpler." Attribution "— Founder, YC-backed". Trust line (spec §10): use one of "Trusted by founders building the future." or "Trusted by founders at YC-backed startups and top accelerators."
- **Typography:** Quote `text-lg` or `text-xl text-ds-text` or `text-ds-text-muted leading-relaxed`; optional italic/quotes. Attribution `text-sm text-ds-text-muted` or `text-ds-text-subtle` `mt-3` or `mt-4`. Trust line `text-sm text-ds-text-subtle`, below or above testimonial.
- **Animation:** `ds-section-in` on testimonial block; trust line same or `ds-stagger-2`.

### 4.6 Final CTA block

- **Structure:** `<section aria-labelledby="final-cta-heading">`. `<h2 id="final-cta-heading">` "Ready to make every intro count?", reinforcement sentence, primary CTA, optional secondary.
- **Layout:** Section padding `py-16 sm:py-20`. Inner wrapper: `max-w-container-md mx-auto px-4 sm:px-6 lg:px-8`, centered text. **Background:** `bg-ds-accent` with `text-ds-text-inverse` for headline and reinforcement.
- **Primary button (inverse on accent — exact classes):** Do **not** use `btnPrimary` from form-classes (no inverse export; default btnPrimary is accent-on-light). Use these Tailwind classes so the button stands out on accent with guaranteed contrast and focus:
  - **Option A (outline):** `inline-flex items-center justify-center rounded-ds border-2 border-[var(--ds-text-inverse)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--ds-text-inverse)] transition-[color,background-color,box-shadow] duration-ds ease-ds hover:bg-[var(--ds-text-inverse)] hover:text-[var(--ds-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)] active:scale-[0.98]`
  - **Option B (light fill):** `inline-flex items-center justify-center rounded-ds bg-[var(--ds-text-inverse)] px-6 py-3 text-sm font-medium text-[var(--ds-accent)] shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:opacity-90 hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)] active:scale-[0.98]`
  - Pick one; ensure focus ring is visible (ring-offset against accent so the ring contrasts). Same padding as hero primary (`px-6 py-3`).
- **Secondary (optional) link:** Inverse-muted link so it doesn’t compete with primary. Exact classes: `text-sm font-medium text-[var(--ds-text-inverse)]/90 underline-offset-2 hover:text-[var(--ds-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-text-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-accent)] rounded-ds`.
- **Copy:** Headline "Ready to make every intro count?" Reinforcement "One link. Your story. Share it everywhere." Anonymous: Primary "Create your intro — free" → `/login?next=/intro`; optional secondary "Log in" → `/login`. Logged-in: Primary "Edit your intro" → `/intro`; optional secondary "Edit your profile" → `/profile`.
- **Animation:** `ds-section-in` on the whole block.

### 4.7 Footer

- **No implementation in page.** Footer lives in `app/layout.tsx`. Keep existing: Feedback link, same layout. No placeholder Product/Company links for v2.

---

## 5. Hero Updates (Summary)

- Add trust line: "Free to start." between subhead and CTA row. Typography: `text-sm` or `text-base`, `text-ds-text-subtle` or `text-ds-text-muted`.
- Primary CTA label (anonymous): change from "Get started" to **"Create your intro — free"**. Destination unchanged: `/login?next=/intro`.
- Secondary (anon): "Log in" → `/login` (already correct). Logged-in: "Edit your intro" / "Edit your profile" (already correct).
- Headline and subhead copy unchanged. HeroHeading component unchanged.

---

## 6. Final CTA Block — Styling Detail

- **Background:** `bg-ds-accent`; text color `text-ds-text-inverse` for headline and reinforcement.
- **Primary button:** See §4.6 for **exact** Tailwind classes (Option A outline or Option B light fill). `form-classes.ts` has no inverse variant—use the custom classes from §4.6. Require visible focus ring (ring-offset against accent).
- **Secondary (optional):** Use the inverse link classes from §4.6 (`text-[var(--ds-text-inverse)]/90` with hover and focus-visible ring).
- **Logged-in:** Same inverse primary + optional secondary link; copy as in §4.6.

---

## 7. CSS Additions (globals.css)

- **New utility:**  
  `.ds-section-in { animation: ds-slide-up var(--ds-duration-slow) var(--ds-ease-out) both; }`  
  (Reuse existing `@keyframes ds-slide-up`.)

- **Reduced-motion:** In the existing `@media (prefers-reduced-motion: reduce)` block, add:  
  `.ds-section-in { animation: none; }`  
  so section entrances are disabled (content appears without motion). Optionally use a fade-only keyframe for reduced motion; spec allows either.

---

## 8. Step-by-Step Implementation Order

1. **globals.css** — Add `.ds-section-in` and add it to the `prefers-reduced-motion` block.
2. **page.tsx — Hero** — Add trust line "Free to start."; change primary CTA label to "Create your intro — free"; adjust spacing (subhead → trust → CTAs); remove value bullets `<ul>`.
3. **page.tsx — Problem/Solution** — Add section with two columns (sm+), labels and body copy per §10; background; `ds-section-in`.
4. **page.tsx — Features** — Add section "Why Introd", 2×2 grid, four feature cards with titles/descriptions/icons; hover lift/shadow; `ds-stagger-1`–`ds-stagger-4`.
5. **page.tsx — How it works** — Add section with three steps (labels + one-line copy), optional subline "Takes minutes, not hours."; stagger 1–3 (and optionally 4 for subline).
6. **page.tsx — Social proof** — Add section: quote, attribution, trust line; `ds-section-in` (and optional stagger for trust line).
7. **page.tsx — Final CTA** — Add section: accent background, inverse text, headline, reinforcement, primary (inverse-style) and optional secondary; conditional on `user`; `ds-section-in`.
8. **Footer** — No changes (remains in layout).
9. **Lint and format** — Run `npm run lint` and `npm run format`.

---

## 9. Accessibility

- **Landmarks:** Each major block is a `<section>`. Use `aria-labelledby` pointing to that section’s heading `id` (e.g. `id="features-heading"` on "Why Introd").
- **Heading hierarchy (explicit):** One `<h1>` on the page (Hero, via HeroHeading). **Every section must have exactly one visible or sr-only `<h2>`** so the document outline is clear and no landmarks are headless:
  - **Hero:** h1 only (no h2 required).
  - **Problem/Solution:** Two `<h2>`s: "The problem" (`id="problem-heading"`) and "The solution" (`id="solution-heading"`) as the block labels—they are the section headings; no extra wrapper heading.
  - **Features:** One `<h2 id="features-heading">` "Why Introd".
  - **How it works:** One `<h2 id="how-it-works-heading">` "How it works".
  - **Social proof:** One `<h2 id="social-proof-heading">` e.g. "What founders say" or "Social proof" (can be `sr-only` if design omits it visually).
  - **Final CTA:** One `<h2 id="final-cta-heading">` "Ready to make every intro count?" (headline is the heading).
  - No skipped levels (h1 → h2 only).
- **Focus order:** Sections and CTAs follow DOM order; no tabindex. Buttons and links are focusable with visible focus ring (design system `focus-visible:ring-2 focus-visible:ring-ds-focus-ring` etc.; Final CTA uses ring/ring-offset per §4.6).
- **Semantics:** Primary/secondary actions use `<Link>` for navigation; Hero uses `btnPrimary`/`btnSecondary` from form-classes; Final CTA uses custom inverse classes from §4.6. No `<button>` for page navigation. Ensure link text matches spec (§10).
- **Reduced motion:** All entrance animations (ds-section-in, ds-stagger-\*) disabled in `prefers-reduced-motion: reduce`; hero per-letter already uses `ds-hero-headline-in` in reduce case.

---

## 10. Review feedback applied

The following clarifications were added so the implementing engineer has an unambiguous plan:

1. **Final CTA inverse button:** `form-classes.ts` does not export an inverse variant. §4.6 and §6 now specify **exact** Tailwind classes for the primary inverse button (Option A: outline, Option B: light fill) and for the optional secondary link, including contrast and focus states (`focus-visible:ring-2` with ring-offset against accent). Implementer should pick one primary style and apply the classes as given.

2. **Main shell vs section padding:** Sections are **full-width** with section-level background (e.g. Problem/Solution `bg-ds-surface`). Each section owns its own vertical padding (`py-16 sm:py-20`) and an **inner** wrapper with `max-w-container-*`, `mx-auto`, and horizontal padding (`px-4 sm:px-6 lg:px-8`). The `main` element uses only vertical padding (`py-10 sm:py-14`); it does not need horizontal padding because each section handles its own. Hero can use a centered inner block with the same horizontal padding for consistency.

3. **Accessibility — section headings:** Every section has exactly one `<h2>` (or two for Problem/Solution) for landmarks. Problem/Solution uses the two block labels as h2s: "The problem" and "The solution". How it works has a visible `<h2>` "How it works". Social proof has an `<h2>` (e.g. "What founders say" or "Social proof"; may be `sr-only`). No "optional heading (visually hidden or omit)" without a concrete choice—headings are specified per section in §9.

4. **Copy and animation:** "Takes minutes, not hours." is explicitly in scope as the How it works subline (spec §10); include it. Trust line for Social proof: use one of the two variants from spec §10 ("Trusted by founders building the future." or "Trusted by founders at YC-backed startups and top accelerators."). All other copy is from §10 Copy Quick Reference.

---

_End of implementation plan. Implement the full page in this order; no optional "if time" sections—all sections are in scope._

# Landing Page v2 — Code Review #1

**Reviewed:** `app/page.tsx`, `app/components/HeroHeading.tsx`, `app/globals.css` (ds-section-in and reduced-motion).  
**References:** `landing-page-design-spec-v2.md`, `landing-page-implementation-plan-v2.md`.

---

## Summary

- **Correctness:** Section structure and copy match spec §10 and the implementation plan. Final CTA uses the inverse button/link classes from plan §4.6 (Option B light fill + inverse link with ring-offset).
- **Accessibility:** Landmarks and heading hierarchy are correct; `aria-labelledby` IDs match; one a11y improvement applied (underline on Final CTA secondary links).
- **Design system:** Only `ds-*` / `var(--ds-*)` used; no raw hex in reviewed files.
- **Bugs:** No runtime or a11y failures found. One critical-style fix applied: Final CTA secondary links now use `underline` so they are identifiable as links (plan §4.6 specifies `underline-offset-2`, which implies an underline).

---

## Correctness vs spec and plan

| Check | Status |
|-------|--------|
| §10 Copy Quick Reference — all sections | ✓ Matches |
| Section order: Hero → Problem/Solution → Features → How it works → Social proof → Final CTA | ✓ |
| Final CTA primary: inverse Option B (light fill) classes from plan §4.6 | ✓ |
| Final CTA secondary: inverse link classes with ring/ring-offset | ✓ (underline added in fix) |
| Problem/Solution: two h2s, correct copy | ✓ |
| Features: "Why Introd", 4 cards, exact titles/descriptions | ✓ |
| How it works: 3 steps + "Takes minutes, not hours." | ✓ |
| Social proof: quote, attribution, trust line | ✓ |
| `ds-section-in` and reduced-motion in `globals.css` | ✓ |

---

## Accessibility

- **Landmarks:** Each major block is a `<section>` with `aria-labelledby` pointing to the section heading id. ✓
- **aria-labelledby:** `problem-heading solution-heading` (multiple ids) is valid and used correctly for Problem/Solution. ✓
- **Heading hierarchy:** Single `<h1>` (Hero); every section has the required `<h2>` (Problem/Solution has two h2s as block labels; Social proof uses `sr-only` h2 "Social proof"; Final CTA uses the headline as h2). No skipped levels. ✓
- **Focus:** Links use `focus-visible:ring-2` and appropriate ring-offset; Final CTA uses ring-offset against accent per §4.6. ✓
- **Semantics:** Hero and Final CTA use `<Link>` for CTAs; blockquote used for social proof quote. ✓
- **Fix applied:** Final CTA secondary links now include `underline` so they are clearly links (plan §4.6’s `underline-offset-2` implies an underline).

---

## Design system compliance

- **Colors / typography / radius / shadow:** Only `ds-*` classes and `var(--ds-*)` in `page.tsx` and `HeroHeading.tsx`. No raw hex. ✓
- **Final CTA:** Uses `bg-ds-accent`, `text-ds-text-inverse`, and `var(--ds-text-inverse)` / `var(--ds-accent)` for inverse button and muted text; no form-classes inverse (as planned). ✓
- **Motion:** `ds-hero-in`, `ds-section-in`, `ds-stagger-1`–`ds-stagger-4`; all from design tokens. ✓

---

## Reduced motion

- **globals.css:** `@media (prefers-reduced-motion: reduce)` disables `.ds-section-in` and all stagger/hero animation classes (`animation: none`). ✓
- **Hero:** Per-letter animation is disabled in that block via `.ds-hero-letter-in`; wrapper keeps `.ds-hero-headline-in` so the whole headline still fades in. ✓

---

## Non-critical suggestions

1. **Hero double animation:** The hero wrapper always has `ds-hero-headline-in` (whole-headline fade) while letter spans use `ds-hero-letter-in`. With reduced-motion off, both run (wrapper fades in and letters stagger). Spec §1.2 describes reduced-motion as “whole-headline fade only” and default as per-letter; consider applying the wrapper fade only inside `prefers-reduced-motion: reduce` (e.g. default: wrapper has no animation; reduced: wrapper gets `ds-hero-headline-in`, letters get `animation: none`) so default experience is per-letter only.
2. **Reinforcement sentence color:** Final CTA reinforcement uses `[color:var(--ds-text-inverse)]/90`. For consistency, consider a design token such as `--ds-text-inverse-muted` and a matching utility if this pattern is reused.
3. **Features / How it works responsive gap:** Features use `gap-6 sm:gap-8` and How it works use `gap-8 sm:gap-6` (mobile first). Consider aligning with spec (“gap-6 or gap-8”) so both sections use the same convention (e.g. both `gap-6 sm:gap-8` or both `gap-8`) for visual consistency.
4. **Social proof h2:** The section uses an `sr-only` h2 “Social proof”. Plan §4.5 allows “What founders say” or “Social proof”; current choice is fine; if the page later adds a visible heading, “What founders say” may read better above the quote.

---

## Files touched in this review

- **Critical fix:** `app/page.tsx` — added `underline` to both Final CTA secondary links (Edit your profile, Log in).
- **Documentation:** `docs/landing-page-v2-code-review-1.md` (this file).

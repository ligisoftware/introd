# Landing Page v2 — Second Code Review

**Scope:** Responsive behavior, performance, consistency, and edge cases for the full landing page v2 (all seven sections in `app/page.tsx`).

**Files reviewed:** `app/page.tsx`, `app/components/HeroHeading.tsx`, `app/globals.css` (motion utilities), `app/layout.tsx` (footer).

---

## 1. Responsive Behavior

### 1.1 Section layout and grids

| Section           | Mobile (< sm)     | sm+                         | Verdict |
| ----------------- | ----------------- | --------------------------- | ------- |
| Hero              | Single column, `max-w-xl` | Same, padded               | OK      |
| Problem/Solution  | Stacked, `gap-10` | 2 columns, `gap-8`           | OK      |
| Features          | Single column, `gap-6`    | 2×2 grid, `gap-8`           | OK      |
| How it works      | Stacked, `gap-8`  | 3 columns, `gap-6`           | OK      |
| Social proof      | Single block      | Same                        | OK      |
| Final CTA         | Centered, wrap    | Same, `flex-wrap` + `gap-4` | OK      |

- **Breakpoints:** All sections use `sm:` for the first step up (2 or 3 columns). No layout breaks observed; grids collapse to a single column below `sm` (640px) as intended.
- **Horizontal padding:** Consistent `px-4 sm:px-6 lg:px-8` on inner wrappers; sections are full-width with contained content. No horizontal overflow on narrow viewports.

### 1.2 Minor responsive notes

- **Problem/Solution:** Mobile uses `gap-10` (2.5rem), desktop `sm:gap-8` (2rem). Intentional—stacked blocks get slightly more vertical breathing room on small screens. No issue.
- **How it works subline:** `text-center sm:text-left` correctly centers on mobile and aligns left on larger screens.
- **Feature cards:** Padding `p-5 sm:p-6`; no min-height, so card height can vary. Acceptable; no broken layout.

### 1.3 Suggestions (non-critical)

- Consider testing at 320px width to confirm hero CTAs and Final CTA button row wrap cleanly (current `flex-wrap` and `gap-3`/`gap-4` should handle it).
- If "How it works" is ever localized to longer labels, consider `min-w-0` on step columns to avoid flex/grid overflow on small viewports.

---

## 2. Performance

### 2.1 Re-renders and client boundaries

- **Page:** Server component; no client state. No unnecessary re-renders.
- **HeroHeading:** Client component; renders once from `text` prop (server-supplied). No `useState`/`useEffect`; no post-mount updates. Animation is CSS-only (class + inline `animationDelay`). **No performance concern.**

### 2.2 Animations

- **Section entrances:** `ds-section-in` and `ds-stagger-1`–`ds-stagger-4` use CSS `animation` with `ds-slide-up` (opacity + translateY). Stagger delays are fixed (0.06s–0.3s). No JS-driven animation; no layout thrash.
- **Hero per-letter:** ~35 spans with opacity/transform/blur. Capped delay `Math.min(index * 45, 600)` keeps total sequence bounded. For current copy length, cost is acceptable. (Very long headlines would increase DOM and compositor work—already documented in `landing-page-code-review-2.md`; consider cap if headline becomes dynamic.)

### 2.3 Heavy assets

- No images or heavy assets in landing sections. Icons are emoji (🔗, 📄, ✓, 🤝). No lazy-loading needed for this page.

**Verdict:** No unnecessary re-renders or heavy animations. Performance is in good shape.

---

## 3. Consistency

### 3.1 Spacing

- **Section vertical padding:** `py-16 sm:py-20` used in every section (Problem/Solution, Features, How it works, Social proof, Final CTA). Hero uses `main`’s `py-10 sm:py-14` only; no extra section wrapper. **Consistent.**
- **Inner horizontal padding:** `px-4 sm:px-6 lg:px-8` on all section content wrappers. **Consistent.**
- **Content width:** Hero and Social proof / Final CTA use `max-w-container-md`; Problem/Solution and Features / How it works use `max-w-container-lg`. Intentional (narrower for hero and closing blocks). **Consistent.**

### 3.2 Typography

- **Section headings (h2):** "Why Introd", "How it works" use `text-2xl font-bold sm:text-3xl` and `mb-12`. **Consistent.**
- **Problem/Solution labels:** `text-base font-semibold text-ds-text`; body `text-base leading-relaxed text-ds-text-muted sm:text-lg` with `max-w-prose`. **Consistent.**
- **Feature card titles:** `text-lg font-semibold text-ds-text`, `mb-2`. **Consistent** across all four cards.
- **How it works step labels:** `text-base font-semibold sm:text-lg`; copy `text-base leading-relaxed text-ds-text-muted`. Slight difference from Feature titles (steps use responsive `sm:text-lg`); acceptable for hierarchy.

### 3.3 Patterns

- **CTAs:** Hero uses `btnPrimary` / `btnSecondary` from form-classes; Final CTA uses custom inverse classes (no inverse in form-classes). Matches implementation plan. Secondary "Edit your profile" / "Log in" use muted link style with focus rings. **Consistent.**
- **Animation:** Sections use either `ds-section-in` on wrapper or `ds-stagger-*` on children. No mix of custom delays or ad-hoc keyframes. **Consistent.**

### 3.4 Suggestion (non-critical)

- **Feature card icon spacing:** All use `mb-3` for icon → title. One card uses `mb-2` for title → description (others also `mb-2`). Already consistent; no change.

---

## 4. Edge Cases

### 4.1 Empty state

- **Landing content:** All sections have static copy; no data-dependent empty state. CTAs are either anonymous ("Create your intro — free", "Log in") or logged-in ("Edit your intro", "Edit your profile"). **No empty-state bug.**
- **Hero headline:** If `HeroHeading` receives empty or whitespace-only `text`, it renders an empty `<h1>`, which is poor for semantics and accessibility. **Fix applied:** guard in `HeroHeading` so the heading is never empty (see §6).

### 4.2 Long copy

- **Body text:** Problem/Solution and Feature descriptions use `max-w-prose` (Problem/Solution) or are constrained by grid; text wraps. No truncation or line-clamp. If copy were much longer, cards could become uneven in height; acceptable for current copy.
- **Headline:** Fixed "One link. Your story. Every intro." No overflow or line-clamp. If headline were ever dynamic and very long, consider max length or line-clamp (see `landing-page-code-review-2.md`).

### 4.3 Link destinations

- **Hero:** Anonymous → `/login?next=/intro`, `/login`; Logged-in → `/intro`, `/profile`. **Correct.**
- **Final CTA:** Same destinations. **Correct.**
- **Footer (layout):** `/feedback`. **Correct.** No placeholder or broken links.

### 4.4 Other edge cases

- **Social proof:** Single static quote and trust line; no empty or conditional block. **OK.**
- **Final CTA secondary:** No `underline` class; link is visually subtle. Intentional; focus ring and hover state present. **OK.**
- **aria-labelledby (Problem/Solution):** `aria-labelledby="problem-heading solution-heading"` is valid (space-separated IDs); screen readers concatenate. **OK.**

---

## 5. Summary Table

| Area            | Status | Action |
| --------------- | ------ | ------ |
| Responsive      | OK     | Optional: test at 320px; consider `min-w-0` on How it works columns if copy grows. |
| Performance     | OK     | None. |
| Spacing         | OK     | None. |
| Typography      | OK     | None. |
| CTA/link pattern| OK     | None. |
| Empty headline  | Fixed  | Guard in `HeroHeading` (see §6). |
| Long copy       | OK     | Document if headline becomes dynamic. |
| Link destinations | OK   | None. |
| Critical bugs   | 1 fixed| Empty h1 when `text` is empty. |

---

## 6. Critical Fix Applied

**HeroHeading empty headline:** When `text` is empty or whitespace-only, the component rendered an empty `<h1>`, which is bad for accessibility and document outline. A guard was added so that in that case the heading still contains a single non-breaking space, ensuring the element is never empty while avoiding visible content change for normal use.

**File:** `app/components/HeroHeading.tsx`  
**Change:** If `!text.trim()`, render a single span with `\u00A0` (non-breaking space) inside the existing `ds-hero-headline-in` wrapper so the h1 is never empty and animation behavior is unchanged for valid text.

---

## 7. Suggestions (Documented, Not Implemented)

1. **Responsive:** Manually test at 320px viewport for hero and Final CTA button wrap.
2. **How it works:** If step labels are ever localized or lengthened, add `min-w-0` to step columns to prevent grid overflow.
3. **Hero long headline:** If headline becomes dynamic, consider capping animated letters (e.g. first 50–60) and/or line-clamp; see `landing-page-code-review-2.md`.
4. **HeroHeading graphemes:** If headline might contain emoji or multi-codepoint characters, consider grapheme-aware splitting (e.g. `Intl.Segmenter`) instead of `split("")`.
5. **Tests:** Add unit tests for `HeroHeading` (renders text, empty/whitespace fallback) and optional E2E for landing CTAs (anon vs logged-in).

---

_End of landing page v2 code review 2._

# Landing Page — Second-Pass Code Review

**Scope:** Performance (per-letter animation, layout/reflow), edge cases (empty/long headline, SSR/hydration), consistency with app patterns (Link, form-classes), and missing tests/types. This pass does not duplicate a first reviewer’s scope.

**Files in scope:** `app/page.tsx`, `app/components/HeroHeading.tsx`, and related CSS in `app/globals.css` (`.ds-hero-*`).

---

## 1. Performance

### Per-letter spans and animation

- **Current behavior:** `HeroHeading` splits `text` with `text.split("")` and renders one `<span>` per character (e.g. 35 spans for the current headline). Each span has:
  - Inline `style={{ animationDelay: `${Math.min(index * 45, 600)}ms` }}`
  - Class `ds-hero-letter-in` (0.5s animation with opacity, translateY, blur)
- **Capped delay:** `Math.min(index * 45, 600)` correctly caps total animation time (~1.1s) regardless of length, so long text doesn’t stretch the sequence indefinitely.
- **Cost for very long headline:** No limit on number of spans. A headline with hundreds of characters would create hundreds of animated spans, increasing DOM size, style recalc, and compositor work (blur + transform). Consider **capping animated letters** (e.g. first 50–80) and rendering the rest in a single span with no per-letter animation, or skipping per-letter animation when `text.length` exceeds a threshold.
- **Layout thrash / reflow:** Letters are inline spans; no fixed dimensions. The animation uses opacity and transform (and blur), which are typically composited. No obvious layout thrash; reflow risk is low. No change suggested for current copy length.

### Recommendations

- Add a constant (e.g. `MAX_ANIMATED_LETTERS = 60`) and only apply per-letter animation to the first N characters; render the remainder in one span with `ds-hero-headline-in` only, or as plain text inside the same wrapper.
- Optionally move the delay calculation into a small helper or constant derived from `Math.min(index * 45, 600)` to keep the JSX lean.

---

## 2. Edge Cases

### Empty headline

- **Current behavior:** `text.split("")` → `[]`; the map renders nothing. Result: `<h1><span class="ds-hero-headline-in"></span></h1>`. No crash, but an empty `<h1>` is poor semantics and can confuse assistive tech.
- **Recommendation:** Guard: if `!text.trim()`, render a single fallback (e.g. non-breaking space or a single span with the whole “empty” state) so the heading is never completely empty, or render a single span with `text || "\u00A0"` so there is always one node.

### Very long headline

- **Current behavior:** No length limit. Hundreds of characters → hundreds of spans (see Performance above). Also increases risk of overflow on small viewports (no truncation or line-clamp).
- **Recommendation:** Cap animated letters as above. Optionally add `line-clamp` or `max-width` plus truncation for extremely long content if the headline ever becomes dynamic.

### SSR / hydration

- **Current behavior:** `HeroHeading` is a client component (`"use client"`). The server receives the same `text` prop from the server-rendered `app/page.tsx` and renders the same structure. No client-only state; output is deterministic from `text`.
- **Verdict:** No hydration mismatch for the current setup. If in the future `text` came from client-only data (e.g. locale or CMS on client), ensure the same value is used on server and client or avoid rendering the animated headline until after mount.
- **Recommendation:** Leave as-is; document that `text` should be supplied by the server or a stable source so server and client markup match.

### Graphemes / emoji

- **Current behavior:** `text.split("")` splits by UTF-16 code units. Emoji and other multi-codepoint graphemes (e.g. 👋, "é" as e + combining acute) become multiple “letters,” which can look wrong or animate in parts.
- **Recommendation:** For future-proofing if headlines might contain emoji or extended graphemes, consider splitting with a grapheme-aware method (e.g. `Intl.Segmenter` with `granularity: "grapheme"` where supported, with a fallback to `split("")`). Current copy has no emoji; optional improvement.

---

## 3. Consistency With App Patterns

### Link and button classes

- **Landing page:** Uses `Link` with `btnPrimary` and `btnSecondary` from `@/app/components/form-classes`, and a tertiary “Edit your profile” link with the same pattern as login’s “Back to home” (muted text, rounded-ds-sm, focus-visible ring). **Consistent** with `IntroEditor`, `ProfileEditor`, and `app/page.tsx`.
- **Main layout:** Uses `next/link` and design-system classes for logo and “Log in” link. **Consistent.**
- **Not-found:** Uses inline button-style classes for the primary CTA instead of `btnPrimary` from form-classes. This is a pre-existing inconsistency elsewhere in the app, not introduced by the landing page; no change required in this review.

### Main and container structure

- **Landing:** `main` with `flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8`, inner `max-w-container-md`. Matches the pattern used on feedback and similar pages. **Consistent.**

---

## 4. Tests and Types

### Types

- **HeroHeading:** `HeroHeadingProps` with `text: string` is correctly typed. No missing types in scope.

### Tests

- **Current state:** No tests found for `HeroHeading` or for the home/landing page.
- **Recommendations:**
  - **Unit tests for `HeroHeading`:**
    - Renders the full headline text (e.g. via `container.textContent` or `screen.getByRole('heading').textContent`).
    - Empty or whitespace-only `text`: assert fallback or single node so the heading is not empty (once the empty-headline guard is added).
    - Optional: very long `text` (e.g. 100+ chars) to assert behavior when a cap is introduced.
  - **E2E (optional):** Smoke test that the home page loads and shows the hero heading and the correct CTAs for anonymous vs logged-in users (if not already covered elsewhere).

---

## 5. Minor Improvements (Non-Critical)

- **List key:** `key={\`${index}-${char}\`}` is unique (index ensures uniqueness). Using `key={index}` is sufficient for this static, position-based list and avoids any edge case with special characters in the key; consider simplifying to `key={index}`.
- **prefers-reduced-motion:** Already respected in `globals.css` (`.ds-hero-letter-in` and `.ds-hero-headline-in` are disabled under `prefers-reduced-motion: reduce`). No change needed.

---

## 6. Critical Bugs and Fixes

- **No critical bugs identified.** No in-repo fix was required for this pass. If the empty-headline guard or the animated-letter cap is implemented, those can be done in a follow-up PR.

---

## Summary

| Area           | Status | Action |
|----------------|--------|--------|
| Performance    | OK for current copy; risk for very long text | Optional: cap animated letters |
| Empty headline | Edge case | Guard with fallback or `text \|\| "\u00A0"` |
| Long headline  | Edge case | Cap spans and/or add line-clamp |
| SSR/hydration  | OK     | Document that `text` should be server/stable |
| Graphemes      | Edge case if copy gains emoji | Optional: grapheme-aware split |
| Link/form-classes | Consistent | None |
| Types          | OK     | None |
| Tests          | Missing | Add unit tests for `HeroHeading` (and optional E2E) |
| Critical bugs  | None   | None |

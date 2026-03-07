# Landing page code review #1

Code review of the Introd landing page implementation: `app/page.tsx`, `app/components/HeroHeading.tsx`, and the hero/reduced-motion parts of `app/globals.css`.

## Summary

No critical bugs or runtime/a11y failures found. The implementation is correct; below are verification notes and non-critical suggestions.

---

## 1. HeroHeading key prop

**Check:** Key using index can cause issues if the same character appears twice; consider a more stable key.

**Result:** The current key `${index}-${char}` is **sufficient and stable**. Each list item has a unique `index`, so keys are unique even when the same character repeats (e.g. two `"e"`s get `"1-e"` and `"24-e"`). No change required.

---

## 2. Accessibility

- **Single h1:** The page has a single `<h1>` (from `HeroHeading`). The root layout does not add another h1. ✓
- **No aria-hidden on headline:** The headline text is not hidden from assistive tech; there is no `aria-hidden` on the h1 or its content. ✓
- **Focus order:** Content order is logical (heading → description → primary/secondary links). No `tabindex` overrides. Links use design-system focus styles (`focus-visible:ring-2 focus-visible:ring-ds-focus-ring`). ✓

No changes required.

---

## 3. Design system compliance

- **page.tsx:** Uses `max-w-container-md`, `text-ds-text-muted`, `rounded-ds-sm`, `duration-ds`, `ease-ds`, `ring-ds-focus-ring`, `ring-offset-ds-bg`, and `btnPrimary`/`btnSecondary` from form-classes (which use ds-* tokens). No raw hex or arbitrary values. ✓
- **HeroHeading.tsx:** Uses `font-sans`, `font-bold`, `text-ds-text`, and standard Tailwind scale (`text-3xl`, `sm:text-4xl`, `lg:text-5xl`). No raw hex. ✓
- **globals.css (hero + reduced-motion):** Uses `var(--ds-ease-out)`, `var(--ds-duration-slow)`, etc. Keyframes use only `opacity`, `transform`, and `filter` (no raw colors). ✓

**Non-critical:** In `globals.css`, `.ds-hero-headline-in` and `.ds-hero-letter-in` use hardcoded durations (`0.4s`, `0.5s`) instead of design tokens. For consistency with the rest of the motion system, consider `var(--ds-duration-slow)` (300ms) or a dedicated token if you want to keep 400/500ms.

---

## 4. Reduced motion

**Check:** Per-letter animation disabled and whole-headline fade still runs when `prefers-reduced-motion: reduce`.

**Result:** Correct. In the `@media (prefers-reduced-motion: reduce)` block, `.ds-hero-letter-in` is set to `animation: none`, so the per-letter animation is disabled. `.ds-hero-headline-in` is **not** in that block, so the whole-headline fade-in still runs. Users who prefer reduced motion get a single, short fade instead of staggered letter animation. ✓

---

## 5. Next.js server / client boundary

- **page.tsx:** Server component (async `Home`, no `"use client"`). Uses `createClient()` from `@/lib/supabase/server` and `getCurrentUser(supabase)`. Renders `<HeroHeading>` and links. No client-only code on the server. ✓
- **HeroHeading:** Marked `"use client"`. Only splits `text` and maps to spans with inline `animationDelay`; no hooks or browser APIs. Client boundary is appropriate if you rely on client hydration for the animation. ✓

No changes required.

---

## Non-critical suggestions

1. **Animation durations in CSS:** Prefer design tokens for hero animation durations (e.g. `var(--ds-duration-slow)`) instead of `0.4s` / `0.5s` for consistency with the design system.
2. **HeroHeading:** The component could be pure server (no state/effects); `"use client"` is still valid for animating on the client and is a reasonable choice.

No critical fixes were applied; the implementation is in good shape.

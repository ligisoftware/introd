# Landing Page v2 — Design Spec (Implementation-Ready)

**Product:** Introd  
**Audience:** Front-end engineer  
**Purpose:** Full implementation-ready spec for the landing page v2: all sections, exact copy, layout, typography, animation, and CTA behavior. No code in this doc—spec only. Extends the existing hero and animation spec.

**References:** PM brief v2 (`landing-page-pm-brief-v2.md`), existing design spec (`landing-page-design-spec.md`), design tokens and keyframes in `app/globals.css` (lines 268–279 and hero/stagger utilities).

---

## 1. Hero Section

### 1.1 Layout and spacing

- **Container:** Reuse existing page shell: `px-4 py-10 sm:px-6 sm:py-14 lg:px-8`, content constrained by `max-w-container-md` (42rem) centered.
- **Hero block:** Max width for headline + subhead + trust line + CTAs: `max-w-xl` or `max-w-2xl`. Vertically: comfortable spacing between headline, subhead, trust line, and CTA row.
- **Spacing between elements:**
  - Headline → subhead: `mt-4` on mobile, `mt-5` from `sm:` up.
  - Subhead → trust line: `mt-4` on mobile, `mt-5` from `sm:` up.
  - Trust line → CTA row: `mt-6` on mobile, `mt-8` from `sm:` up.
  - Between primary and secondary CTA: `gap-3` or `gap-4`.

### 1.2 Headline typography and per-letter animation

- **Font:** `font-sans` (Plus Jakarta Sans). **Weight:** `font-bold`. **Color:** `text-ds-text`. **Letter-spacing:** `tracking-tight`.
- **Responsive font size:** Mobile `text-3xl`, `sm:text-4xl`, `lg:text-5xl` (optional). **Line height:** `leading-tight`.
- **Per-letter animation:** Use existing spec from `landing-page-design-spec.md` §2: render headline as sequence of `<span>` per character; each span: `ds-hero-letter-in` with stagger (40–50ms per character, cap total delay e.g. `min(index * 45ms, 600ms)`). Keyframes: `ds-hero-letter-in` (from: opacity 0, translateY(12px), blur(4px); to: opacity 1, translateY(0), blur(0)); duration 0.5s, `var(--ds-ease-out)`, `both`.
- **Reduced-motion:** When `prefers-reduced-motion: reduce`, use whole-headline fade only: wrapper with `ds-hero-headline-in` (single fade-in ~0.4s); disable per-letter animation on letter spans (see `globals.css` lines 268–279).

### 1.3 Subhead typography

- **Font:** `font-sans`. **Weight:** `font-normal`. **Color:** `text-ds-text-muted`.
- **Size:** `text-base` mobile, `sm:text-lg`. **Line height:** default or `leading-relaxed`. **Max width:** optional `max-w-xl`.
- **Entrance:** Single fade or fade + slide after headline (e.g. `ds-hero-in` or `ds-stagger-1`-style delay); not per letter.

### 1.4 Trust line

- **Copy (exact):** “Free to start.”
- **Typography:** `text-sm` or `text-base`, `text-ds-text-subtle` or `text-ds-text-muted`. **Placement:** Between subhead and CTA row.

### 1.5 CTAs — exact copy and behavior

**Anonymous users:**

- **Primary CTA**
  - **Label (exact):** “Create your intro — free”
  - **Destination:** `/login?next=/intro`
  - **Styling:** `btnPrimary` from `@/app/components/form-classes` (`rounded-ds`, `bg-ds-accent`, `text-ds-text-inverse`, `shadow-ds-sm`, hover/focus/active). `<Link>` with `className={btnPrimary}`. First in row, visually dominant.
- **Secondary CTA**
  - **Label (exact):** “Log in”
  - **Destination:** `/login`
  - **Styling:** `btnSecondary` from form-classes, or text link: `text-sm font-medium text-ds-text-muted` hover `text-ds-text`, focus ring. Next to primary, `gap-3` or `gap-4`.

**Logged-in users:**

- **Primary:** “Edit your intro” → `/intro` (same `btnPrimary`).
- **Secondary:** “Edit your profile” → `/profile` (same secondary/link style as above).

### 1.6 Hero copy (exact)

- **Headline:** “One link. Your story. Every intro.”
- **Subhead:** “A single shareable page with your background, startup, and team—for investors and warm intros.”
- **Trust line:** “Free to start.”

---

## 2. Problem / Solution Section

### 2.1 Layout

- **Desktop (sm+):** Two columns side by side: “The problem” (left), “The solution” (right). Equal or near-equal width; gap e.g. `gap-8` or `gap-10` with `max-w-container-lg` for the section content.
- **Mobile:** Stacked: problem first, then solution. Vertical spacing between blocks: `space-y-8` or `space-y-10`.
- **Section padding:** `py-16 sm:py-20`. Horizontal padding consistent with page shell (`px-4 sm:px-6 lg:px-8`).
- **Background:** Subtle distinction from hero—e.g. `bg-ds-surface` or `bg-ds-bg-elevated` so the section is visually distinct.

### 2.2 Typography and spacing

- **Section headings (optional):** If a single section title is used above both columns, use `text-xl` or `text-2xl` `font-semibold` `text-ds-text`, centered or left-aligned.
- **Block labels:** “The problem” and “The solution” as small headings: `text-sm font-semibold uppercase tracking-wide text-ds-text-muted` or `text-base font-semibold text-ds-text`. Spacing below label: `mb-2` or `mb-3`.
- **Body:** `text-ds-text-muted`, `text-base` mobile, `sm:text-lg`; `leading-relaxed`. Max width per column optional (e.g. `max-w-prose`) for readability.

### 2.3 Copy (exact)

**The problem**

Founders send the same context over and over—decks, bios, one-liners—across email and Slack. Investors get fragments, not a story.

**The solution**

Introd is one link that stays up to date. Your background, your startup, your team. One page. Every intro.

### 2.4 Entrance animation

- **Section:** Use a single entrance for the whole section (or for each column). Define or use a utility: **`ds-section-in`** — fade + slide-up (opacity 0 → 1, translateY(12px) → 0), duration `var(--ds-duration-slow)` (300ms), easing `var(--ds-ease-out)`, delay 0 or small (e.g. 0.05s) so it runs after hero.
- **Reduced-motion:** Under `@media (prefers-reduced-motion: reduce)`, `ds-section-in` → no animation or single fade only (opacity 0 → 1, no transform). Add `.ds-section-in` to the reduce block in `globals.css` (with `animation: none` or override to fade-only).

---

## 3. Features Section

### 3.1 Layout

- **Grid:** 2×2 on desktop (e.g. `sm:grid-cols-2`), or 3 cards in a row with fourth wrapping; prefer 2×2 for four blocks. Gap: `gap-6` or `gap-8`.
- **Section padding:** `py-16 sm:py-20`. Content width: `max-w-container-lg`.
- **Background:** Default page background (`bg-ds-bg`) or alternate with `bg-ds-surface` for contrast with Problem/Solution.

### 3.2 Section heading (optional)

- **Title:** e.g. “Built for founders” or “Why Introd” — exact: **“Why Introd”**. `text-2xl` or `text-3xl` `font-bold` `text-ds-text`, centered or left. Margin bottom: `mb-10` or `mb-12`.
- **Entrance:** Section title can use `ds-section-in` or first stagger.

### 3.3 Feature cards

- **Card styling:** `rounded-ds-lg`, `border border-ds-border`, `shadow-ds-sm`, padding `p-5 sm:p-6`. Background `bg-ds-surface`. **Hover:** Slight lift (`translateY(-2px)` or similar) and/or `shadow-ds` (or `shadow-ds-md`), transition `duration-ds ease-ds`.
- **Per card:** Icon/visual (see below), title, 2–3 sentence description. Spacing: icon → title `mb-2` or `mb-3`, title → description `mb-2` or `mb-3`.
- **Title:** `text-lg font-semibold text-ds-text`. **Description:** `text-ds-text-muted` `text-base` `leading-relaxed`.

### 3.4 Feature blocks — exact copy and visuals

**Feature 1**

- **Title:** One link for every intro
- **Description:** Share a single URL instead of resending decks and bios. Your intro stays in one place so investors and warm intros get the full picture every time.
- **Icon/visual:** Simple link or chain icon (Tailwind/emoji 🔗 or minimal SVG). Suggest a small rounded container with icon, `text-ds-accent` or `text-ds-text-muted`.

**Feature 2**

- **Title:** Professional first impression
- **Description:** Your background, startup, and team in a clean, standardized format. Look prepared and credible from the first click.
- **Icon/visual:** Document or profile silhouette (e.g. 📄 or simple card shape). Same styling as Feature 1.

**Feature 3**

- **Title:** Always up to date
- **Description:** Update your page once and every shared link reflects the latest. No more “here’s the new deck” threads.
- **Icon/visual:** Refresh or checkmark (e.g. ✓ or circular arrow). Same styling.

**Feature 4**

- **Title:** Built for warm intros and investors
- **Description:** Designed for the way founders actually raise: one link in an email, in a Slack intro, or after a meeting. Less back-and-forth, more clarity.
- **Icon/visual:** Handshake or network (e.g. 🤝 or simple node graphic). Same styling.

### 3.5 Entrance animation

- **Stagger:** Assign `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3`, `ds-stagger-4` to the four feature cards so they animate in sequence (existing stagger delays: 0.06s, 0.14s, 0.22s, 0.3s). Each card uses slide-up + fade per existing `ds-slide-up` keyframes.
- **Reduced-motion:** Already handled in `globals.css` for `ds-stagger-*` (animation: none).

---

## 4. How It Works Section

### 4.1 Layout

- **Desktop (sm+):** Horizontal: three steps in a row (flex or grid), with step numbers or connectors (e.g. arrow or line) between. Gap between steps: `gap-6` or `gap-8`.
- **Mobile:** Stacked vertically; steps in order. Spacing: `space-y-6` or `space-y-8`.
- **Section padding:** `py-16 sm:py-20`. Content width: `max-w-container-md` or `max-w-container-lg`.
- **Background:** Same as Features or subtle alternate (e.g. `bg-ds-surface` if Features used `bg-ds-bg`).

### 4.2 Step content and copy (exact)

**Step 1**

- **Label:** Create your intro
- **One-line copy:** Add your name, photo, and a short bio.

**Step 2**

- **Label:** Add your startup & team
- **One-line copy:** Link your company, role, and key teammates.

**Step 3**

- **Label:** Share one link
- **One-line copy:** Send your Introd link anywhere—email, Slack, or after a meeting.

Optional subline below the three steps: “Takes minutes, not hours.” — `text-sm text-ds-text-muted`, centered or left.

### 4.3 Typography and styling

- **Step label:** `text-base` or `text-lg` `font-semibold` `text-ds-text`.
- **One-line copy:** `text-sm` or `text-base` `text-ds-text-muted` `leading-relaxed`.
- **Step number or connector:** Optional visible step numbers (1, 2, 3) in a circle or pill (`rounded-ds` or `rounded-full`), `bg-ds-accent` or `border-ds-border`; or a simple arrow/line between steps. Keep minimal.

### 4.4 Entrance animation

- **Stagger:** `ds-stagger-1`, `ds-stagger-2`, `ds-stagger-3` for the three steps. Optional: `ds-stagger-4` for the “Takes minutes, not hours” line or a small CTA below.
- **Reduced-motion:** Handled via existing `ds-stagger-*` in `globals.css`.

---

## 5. Social Proof / Trust Section

### 5.1 Layout

- **Single testimonial block:** Centered or left-aligned within `max-w-container-md`. Section padding: `py-16 sm:py-20`.
- **Optional second line:** “Trusted by founders at …” with 2–3 placeholder names or “YC-backed startups” / “Top accelerators” as text (no real logos required; design can use subtle text or simple shapes).

### 5.2 Typography

- **Quote:** `text-lg` or `text-xl` `text-ds-text` or `text-ds-text-muted`, `leading-relaxed`. Optional italic or quotation marks for the quote.
- **Attribution:** “— Founder, YC-backed” — `text-sm text-ds-text-muted` or `text-ds-text-subtle`, after the quote (e.g. `mt-3` or `mt-4`).
- **Trust line:** “Trusted by founders building the future” or “Trusted by founders at YC-backed startups and top accelerators” — `text-sm text-ds-text-subtle`, below or above the testimonial; optional separator.

### 5.3 Copy (exact)

**Testimonial quote**

“Introd made our intro process 10x simpler.”

**Attribution**

— Founder, YC-backed

**Trust line (pick one or combine)**

- “Trusted by founders building the future.”
- Or: “Trusted by founders at YC-backed startups and top accelerators.”

Use one testimonial + one trust line as minimum.

### 5.4 Entrance animation

- **Section:** `ds-section-in` for the testimonial block (fade + slide-up). If trust line is separate, it can use same or `ds-stagger-2` after the quote.
- **Reduced-motion:** `ds-section-in` and stagger overrides as specified in §2.4 and globals.

---

## 6. Final CTA Block

### 6.1 Layout and background

- **Section padding:** `py-16 sm:py-20` (generous so it feels like a closing section).
- **Content width:** `max-w-container-md` centered. Content: headline, one reinforcement sentence, primary CTA, optional secondary CTA.
- **Background:** Distinct from rest of page—e.g. `bg-ds-accent` with `text-ds-text-inverse` for headline and reinforcement, and inverse-style button (e.g. outline or lighter accent variant), **or** `bg-ds-surface` with `border border-ds-border` and a subtle container so the block is clearly a “strip” or card. Choose one; PM suggests “closing pitch” feel—accent background is strong, surface + border is softer but still distinct.

### 6.2 Typography

- **Headline:** `text-2xl` or `text-3xl` `font-bold`, color `text-ds-text` (if on surface) or `text-ds-text-inverse` (if on accent). Centered.
- **Reinforcement:** One sentence, `text-base` or `text-lg`, `text-ds-text-muted` or (on accent) a muted inverse shade. Centered. Margin below: `mt-2` or `mt-3`, then `mt-6` or `mt-8` to CTAs.
- **Primary CTA:** Large and prominent—same or larger padding than hero primary (e.g. `px-6 py-3`), `btnPrimary` or equivalent. Centered in block.
- **Secondary CTA:** If present, `text-sm font-medium` link or `btnSecondary`; e.g. “Log in” or “See an example” (if demo link exists). Place below or next to primary with `gap-3` or `gap-4`.

### 6.3 Copy (exact) and CTA behavior

**Headline**

Ready to make every intro count?

**Reinforcement sentence**

One link. Your story. Share it everywhere.

**Anonymous users**

- **Primary CTA label:** “Create your intro — free”
- **Destination:** `/login?next=/intro`
- **Secondary (optional):** “Log in” → `/login`, or “See an example” → link to a demo intro if available.

**Logged-in users**

- **Primary CTA label:** “Edit your intro”
- **Destination:** `/intro`
- **Secondary (optional):** “Edit your profile” → `/profile` or omit.

### 6.4 Entrance animation

- **Block:** `ds-section-in` for the whole final CTA block (fade + slide-up).
- **Reduced-motion:** As in §2.4.

---

## 7. Footer

- **Keep existing:** Feedback link and current footer layout. No major layout change.
- **Optional:** Placeholder areas for future links under “Product”, “Company”, or “Legal” — minimal (e.g. section labels with no links or “Coming soon”). Do not add links that go nowhere; placeholders can be commented in code or simple text like “Product” / “Company” with no href.
- **Entrance:** No specific animation required; footer can sit static below final CTA.

---

## 8. Animation Summary and New Utilities

### 8.1 Existing utilities (reuse)

- **Hero:** `ds-hero-letter-in`, `ds-hero-headline-in` (reduced-motion), `ds-hero-in` (fade for subhead/elements).
- **Stagger:** `ds-stagger-1` through `ds-stagger-4` (slide-up + fade, delays 0.06s, 0.14s, 0.22s, 0.3s).
- **Keyframes:** `ds-fade-in`, `ds-slide-up`, `ds-hero-letter-in` (see `globals.css`).

### 8.2 New utility: section entrance

- **Name:** `ds-section-in`
- **Behavior:** Fade + slide-up (opacity 0 → 1, translateY(12px) → 0). Duration: `var(--ds-duration-slow)` (300ms). Easing: `var(--ds-ease-out)`. Fill: `both`.
- **Keyframes:** Reuse `ds-slide-up` (already has opacity + translateY) or create `ds-section-in` as an alias. In `globals.css` add:
  - `.ds-section-in { animation: ds-slide-up var(--ds-duration-slow) var(--ds-ease-out) both; }`
  - In `@media (prefers-reduced-motion: reduce)`: add `.ds-section-in { animation: none; }` (or a fade-only keyframe and use that so content still appears without motion).

### 8.3 Reduced-motion checklist

- **Hero per-letter:** Use `ds-hero-headline-in` for whole headline when `prefers-reduced-motion: reduce`; disable per-letter animation (see existing spec and `globals.css` 268–279).
- **All stagger classes:** Already disabled in `globals.css` under `prefers-reduced-motion: reduce`.
- **`ds-section-in`:** Add to same reduce block so section entrances become instant or fade-only.

---

## 9. Design System Checklist

- **Colors:** `text-ds-text`, `text-ds-text-muted`, `text-ds-text-subtle`, `bg-ds-bg`, `bg-ds-surface`, `bg-ds-bg-elevated`, `bg-ds-accent`, `border-ds-border`, `shadow-ds-sm`, `shadow-ds`, `shadow-ds-md`, focus `ring-ds-focus-ring`, `text-ds-text-inverse`.
- **Typography:** `font-sans` (Plus Jakarta Sans); weights and sizes as per section specs.
- **Radius / shadow:** `rounded-ds`, `rounded-ds-sm`, `rounded-ds-lg`; shadows as above.
- **Motion:** `var(--ds-duration)`, `var(--ds-duration-slow)`, `var(--ds-ease-out)`; utilities `ds-hero-in`, `ds-hero-letter-in`, `ds-hero-headline-in`, `ds-stagger-1`–`ds-stagger-4`, and new `ds-section-in`.
- **Containers:** `max-w-container-md` (42rem), `max-w-container-lg` (56rem); section padding `py-16 sm:py-20`.
- **Responsive:** Mobile-first; sections stack; CTAs and copy readable on small screens; no code—implement per Tailwind breakpoints and design tokens.

---

## 10. Copy Quick Reference (All Exact Copy)

| Section      | Element               | Copy                                                                                                                                                |
| ------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero         | Headline              | One link. Your story. Every intro.                                                                                                                  |
| Hero         | Subhead               | A single shareable page with your background, startup, and team—for investors and warm intros.                                                      |
| Hero         | Trust line            | Free to start.                                                                                                                                      |
| Hero         | Primary (anon)        | Create your intro — free                                                                                                                            |
| Hero         | Secondary (anon)      | Log in                                                                                                                                              |
| Hero         | Primary (logged-in)   | Edit your intro                                                                                                                                     |
| Hero         | Secondary (logged-in) | Edit your profile                                                                                                                                   |
| Problem      | Label                 | The problem                                                                                                                                         |
| Problem      | Body                  | Founders send the same context over and over—decks, bios, one-liners—across email and Slack. Investors get fragments, not a story.                  |
| Solution     | Label                 | The solution                                                                                                                                        |
| Solution     | Body                  | Introd is one link that stays up to date. Your background, your startup, your team. One page. Every intro.                                          |
| Features     | Section title         | Why Introd                                                                                                                                          |
| Feature 1    | Title                 | One link for every intro                                                                                                                            |
| Feature 1    | Description           | Share a single URL instead of resending decks and bios. Your intro stays in one place so investors and warm intros get the full picture every time. |
| Feature 2    | Title                 | Professional first impression                                                                                                                       |
| Feature 2    | Description           | Your background, startup, and team in a clean, standardized format. Look prepared and credible from the first click.                                |
| Feature 3    | Title                 | Always up to date                                                                                                                                   |
| Feature 3    | Description           | Update your page once and every shared link reflects the latest. No more “here’s the new deck” threads.                                             |
| Feature 4    | Title                 | Built for warm intros and investors                                                                                                                 |
| Feature 4    | Description           | Designed for the way founders actually raise: one link in an email, in a Slack intro, or after a meeting. Less back-and-forth, more clarity.        |
| How it works | Step 1 label          | Create your intro                                                                                                                                   |
| How it works | Step 1 copy           | Add your name, photo, and a short bio.                                                                                                              |
| How it works | Step 2 label          | Add your startup & team                                                                                                                             |
| How it works | Step 2 copy           | Link your company, role, and key teammates.                                                                                                         |
| How it works | Step 3 label          | Share one link                                                                                                                                      |
| How it works | Step 3 copy           | Send your Introd link anywhere—email, Slack, or after a meeting.                                                                                    |
| How it works | Optional              | Takes minutes, not hours.                                                                                                                           |
| Social proof | Quote                 | “Introd made our intro process 10x simpler.”                                                                                                        |
| Social proof | Attribution           | — Founder, YC-backed                                                                                                                                |
| Social proof | Trust line            | Trusted by founders building the future. (Or: Trusted by founders at YC-backed startups and top accelerators.)                                      |
| Final CTA    | Headline              | Ready to make every intro count?                                                                                                                    |
| Final CTA    | Reinforcement         | One link. Your story. Share it everywhere.                                                                                                          |
| Final CTA    | Primary (anon)        | Create your intro — free                                                                                                                            |
| Final CTA    | Primary (logged-in)   | Edit your intro                                                                                                                                     |
| Final CTA    | Secondary             | Log in / See an example (optional); Edit your profile (logged-in, optional)                                                                         |

---

_End of design spec v2. Implement in `app/page.tsx` and any shared components (e.g. HeroHeading) following this spec, the existing design spec for hero animation details, and the project’s design tokens in `app/globals.css` and Tailwind config._

# Landing Page v2: PM Brief — Professional, Conversion-Focused

**Product:** Introd — founder profile-sharing app for startup fundraising  
**Goal:** A **fully fleshed-out** home screen that meets a **professional, money-making business standard**: rich content, beautiful animations, repeated founder CTAs, trust signals, and clear value at every scroll. This is a full landing page, not a minimal hero.

---

## 1. Product Summary (unchanged)

- **What it is:** A single shareable page (e.g. `introd.com/i/your-slug`) with a founder’s background, startup, team, and optional AI intro scores—for investors and warm intros.
- **Core value:** Standardized first-impression layer for fundraising: one link instead of scattered docs and back-and-forth.
- **Users:** Founders (create/share intros), VCs/angels/operators (view), collaborators (co-edit).

---

## 2. Why “Fleshed Out” and “Money-Making Standard”

- **Current state:** One hero block + three value bullets. Not enough to build trust, demonstrate value, or convert cold traffic.
- **Target state:** A long-form landing page that (1) **captures attention** with a striking hero and animation, (2) **explains the problem and solution** in plain language, (3) **shows what the product does** (features / benefits with concrete copy), (4) **reduces friction** with “How it works” and social proof, (5) **drives sign-ups** with multiple, prominent CTAs for founders, and (6) **feels premium** via polish, motion, and hierarchy.

---

## 3. Full Page Structure (Sections in Order)

1. **Hero** — Headline (per-letter animation), subhead, primary + secondary CTA. One clear value line or trust hint (e.g. “Free to start” or “Used by founders raising seed to Series A”).
2. **Problem / Solution** — Short “The problem” (scattered decks, messy intros, back-and-forth) and “The solution” (one link, one page, always current). 2–4 sentences each. Establishes why Introd exists.
3. **Features / Benefits** — 3–4 feature blocks. Each: icon or visual, title, 2–3 sentence description. Examples: “One link for every intro,” “Professional first impression,” “Always up to date,” “Built for warm intros and investors.” Use cards or a grid; stagger entrance animations.
4. **How it works** — 3 steps with clear labels and short copy. E.g. “Create your intro” → “Add your startup & team” → “Share one link.” Optional: “Takes minutes, not hours.”
5. **Social proof / Trust** — At least one of: (a) short testimonial or quote from a founder/VC (can be placeholder: “Introd made our intro process 10x simpler.” — Founder, YC-backed), (b) “Trusted by founders at …” with 2–3 placeholder logos or company names (e.g. “YC-backed startups”, “Top accelerators”), (c) a stat (“Join X founders” if we have a number, or “Free to start”). Goal: reduce perceived risk.
6. **Final CTA block** — Strong headline (“Ready to make every intro count?” or “Your one link. Your story.”), 1–2 sentence reinforcement, and a large primary CTA (“Create your intro — free”) plus optional secondary (“See an example” if we have a demo link). This section should feel like the closing pitch.
7. **Footer** — Keep existing (Feedback link). Optionally add: “Product”, “Company”, or “Legal” placeholders for future links; keep minimal for now.

---

## 4. Content Requirements (Copy Direction)

- **Hero headline:** Keep or refine “One link. Your story. Every intro.” Subhead: who it’s for + what they get (founders, one shareable page, investors and warm intros).
- **Problem:** “Founders send the same context over and over—decks, bios, one-liners—across email and Slack. Investors get fragments, not a story.”
- **Solution:** “Introd is one link that stays up to date. Your background, your startup, your team. One page. Every intro.”
- **Features:** Write 3–4 benefit-led blocks (see §3). Each 2–3 sentences. Use “you” and “your.”
- **How it works:** 3 steps; action-oriented. “Create your intro” / “Add your startup & team” / “Share one link.”
- **Trust:** Placeholder quote + “Trusted by founders building the future” or similar. Placeholder logos/names OK (design can use subtle text or simple shapes).
- **Final CTA:** Headline + one line + big button “Create your intro — free” or “Get started free.”

All copy must be **founder-focused**, benefit-led, and professional. Avoid jargon.

---

## 5. Animation & Polish Requirements

- **Hero:** Per-letter headline animation (fade in, slide up, blur reduce) with stagger; reduced-motion fallback (whole-headline fade). Already specified in design spec.
- **Section entrances:** Every major section (Problem/Solution, Features, How it works, Social proof, Final CTA) should have an **entrance animation** when it comes into view (or on load with stagger). Use design tokens: e.g. fade-in + slide-up, with staggered children where appropriate (`ds-stagger-1`, `ds-stagger-2`, … or new utilities). Respect `prefers-reduced-motion`.
- **Feature cards / blocks:** Stagger so cards or items animate in sequence (e.g. 100–150ms delay between each). Subtle hover states (e.g. slight lift, shadow) for interactivity.
- **Scroll or load:** Prefer “on load” stagger for a single-page flow (simpler and works for above-the-fold + scroll). If we add scroll-triggered animations later, keep them subtle.
- **Consistency:** All motion uses `var(--ds-duration)`, `var(--ds-ease-out)`, and existing or new `ds-*` utilities. No one-off keyframes unless necessary.

---

## 6. CTA Strategy (Founder Sign-Up)

- **Primary CTA:** “Get started” or “Create your intro” or “Create your intro — free”. Destination: `/login?next=/intro`. Must appear: (1) Hero, (2) Final CTA block. Optionally (3) after How it works or after Features.
- **Secondary CTA:** “Log in” in hero; can repeat in footer or final block.
- **Visibility:** Primary CTA should be above the fold in the hero and again in the final block. Use `btnPrimary` (or a larger variant for the final block if design spec allows).
- **Logged-in users:** Hero (and optionally final block) shows “Edit your intro” / “Edit your profile” instead of “Get started” / “Log in”, as today.

---

## 7. Design System & Constraints (unchanged)

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind, design tokens.
- **Tokens:** Use only `ds-*` (colors, radius, shadow, typography, motion). Plus Jakarta Sans.
- **Layout:** Full-width sections where it helps (e.g. alternating background for Problem/Solution or Features); content width `max-w-container-md` or `max-w-container-lg` as appropriate. Generous vertical spacing between sections (e.g. `py-16` or `py-20` for section padding).
- **Responsive:** Mobile-first; sections stack; CTAs and copy remain readable on small screens.

---

## 8. What the Product Designer Must Deliver

- A **full landing page design spec** (not just hero): every section in §3 with layout, typography, spacing, and animation behavior.
- **Copy** for each section (or explicit placeholders) so implementation has exact text.
- **Animation spec** for section entrances and staggered content; reduced-motion behavior for each.
- **CTA placement and styling** for hero, mid-page (if any), and final CTA block; logged-in vs anonymous.
- Design should feel **premium** and **conversion-focused**: clear hierarchy, enough whitespace, and repeated opportunity to sign up.

---

## 9. What Implementation Must Achieve

- **All sections** in §3 implemented with the content and structure from the design spec.
- **Animations** as specified: hero per-letter; section entrances and stagger; reduced-motion respected.
- **Multiple CTAs** for founders (hero + final block minimum); conditional rendering for logged-in users in hero (and final block if specified).
- **No regression:** Header, footer, auth, and routes unchanged. Page remains a server component where possible; client components only where needed (e.g. HeroHeading, or scroll/intersection if we add it).
- **Professional quality:** Lint, format, accessibility (headings, landmarks, focus order). Ready to ship as a money-making landing page.

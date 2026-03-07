# Landing Page: PM Analysis & Design Brief

**Product:** Introd — founder profile-sharing app for startup fundraising  
**Doc purpose:** Inform landing page content, hierarchy, and design so the page makes the product shine and drives sign-ups.

---

## 1. Product Summary

- **What it is:** A single shareable page (e.g. `introd.com/i/your-slug`) with a founder’s background, startup, team, and optional AI intro scores—for investors and warm intros.
- **Core value:** Standardized first-impression layer for fundraising: one link instead of scattered docs and back-and-forth.
- **Users:** Founders (create/share intros), VCs/angels/operators (view), collaborators (co-edit).

---

## 2. Current Homepage Gaps

- **No primary CTA for anonymous visitors** — only “Log in”; no “Get started” or “Create your intro.”
- **Copy is product-y, not benefit-led** — “Standardized first-impression layer” is accurate but doesn’t lead with outcomes.
- **Flat hierarchy** — one headline, two paragraphs, no clear “why → what → how → act” flow.
- **No social proof or trust** — no testimonials, logos, or “how it works.”
- **Logged-in users** see “Edit your intro” / “Edit your profile” (good); logged-out users have no reason to sign up on the page itself.

---

## 3. Informational Hierarchy (Recommended)

1. **Hero**
   - **Headline:** Benefit-led, outcome-focused (e.g. “One link. Your story. Every intro.” or “Your fundraising intro, in one link.”). Short, scannable.
   - **Subhead:** One sentence that clarifies who it’s for and what they get (e.g. “A single shareable page with your background, startup, and team—for investors and warm intros.”).
   - **Primary CTA:** “Get started” or “Create your intro” → `/login?next=/intro` (or sign-up flow). Visible for anonymous users.
   - **Secondary:** “Log in” for returning users.

2. **Value / “Why” (optional short section)**
   - 2–3 bullets or one short paragraph: one link always up to date, professional first impression, less back-and-forth with investors. Keep to one line each.

3. **How it works (optional, 3 steps)**
   - e.g. “Create your intro → Add your startup & team → Share one link.” Builds confidence and reduces perceived effort.

4. **Footer**
   - Keep existing footer (e.g. Feedback link). No need to overload.

**Priority:** Hero + primary CTA are must-haves. Value bullets and “how it works” are nice-to-have if space and design allow.

---

## 4. Language & Tone

- **Lead with outcomes:** “One link,” “your story,” “every intro,” “professional first impression,” “less back-and-forth.”
- **Audience:** Say “founders” and “investors” (and “warm intros”) so it’s clear who it’s for.
- **Avoid:** Jargon like “first-impression layer” in the hero; keep that for meta description or lower on the page if at all.
- **Tone:** Confident, clear, minimal. Match the rest of the app (Plus Jakarta Sans, design tokens, calm palette).

---

## 5. Design Constraints (from codebase)

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind, design tokens in `app/globals.css` and `tailwind.config.ts`.
- **Design system:** Use `ds-*` tokens: `text-ds-text`, `text-ds-text-muted`, `bg-ds-surface`, `bg-ds-accent`, `rounded-ds`, `shadow-ds-sm`, etc. Typography: `font-sans` (Plus Jakarta Sans).
- **Motion:** Use existing motion tokens and utilities (`ds-hero-in`, `ds-stagger-*`, `duration-ds`, `ease-ds`). **Respect `prefers-reduced-motion`** — disable or simplify animations when reduced motion is requested.
- **Layout:** Current home uses `max-w-container-md`, `px-4 py-10 sm:px-6 sm:py-14 lg:px-8`. Landing can use similar or slightly wider for hero impact.

---

## 6. Raw Design Prompt (from stakeholder)

> Heading component styled with Tailwind CSS. Includes responsive font sizing, tight letter tracking, and smooth color transitions—ideal for hero banners, section headers.  
> Create a **complex animation that fades in, slides up, and reduces blur for each letter**.

---

## 7. What the Product Designer Should Do

- Refine the above prompt into a **concrete, implementation-ready design spec** for the landing page hero (and any sections below).
- Ensure the **per-letter animation** (fade in, slide up, blur reduce) is specified clearly (timing, stagger, easing) and that it **respects `prefers-reduced-motion`** (e.g. fallback to simple fade or no animation).
- Align the hero with the **content hierarchy** in §3 and **tone** in §4 so the visual design supports the message and CTA.

---

## 8. What Implementation Should Achieve

- **Anonymous users:** See a compelling hero + primary CTA (“Get started” / “Create your intro”) and optional value/how-it-works; CTA leads to login/sign-up with next to `/intro`.
- **Logged-in users:** See the same hero (or a shortened version) and clear secondary CTAs (e.g. “Edit your intro”, “Edit your profile”) as today.
- **Design system:** All styles and motion use project tokens and respect reduced motion.
- **No regression:** Existing layout (header, footer, auth) and routes remain intact.

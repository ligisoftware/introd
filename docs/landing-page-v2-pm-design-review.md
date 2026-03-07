# Landing Page v2 — PM / Design Review

**Reviewed:** Full landing page (Hero → Problem/Solution → Features → How it works → Social proof → Final CTA)  
**References:** PM brief v2, design spec v2 §10 (copy table)

---

## 1. Informational hierarchy

**Verdict: Clear and correct.**

- Flow is logical: attention (Hero) → why it exists (Problem/Solution) → what it does (Why Introd) → how to do it (How it works) → trust (What founders say) → close (Final CTA).
- No section feels redundant. Copy matches the design spec §10 table (headlines, body copy, CTAs).
- **Change applied:** Social proof had only an `sr-only` heading (“Social proof”). A visible heading **“What founders say”** was added (same style as “Why Introd” / “How it works”) so the section is scannable and the hierarchy is obvious for sighted users.

---

## 2. Compelling and professional

**Verdict: Meets a money-making standard.**

- Alternating section backgrounds (`bg-ds-surface` / `bg-ds-bg`), consistent spacing (`py-16 sm:py-20`), and design tokens give a premium, conversion-focused feel.
- Benefit-led copy is founder-focused and matches the spec; feature cards use clear titles and 2–3 sentence descriptions.
- The visible “What founders say” heading strengthens the page structure and makes the testimonial block feel intentional rather than floating.

---

## 3. Driving founders to sign up

**Verdict: Strong; one addition applied.**

- **CTAs:** Hero and Final CTA both use “Create your intro — free” (anon) and are prominent. Logged-in users see “Edit your intro” / “Edit your profile” in both places.
- **Trust:** One testimonial (“Introd made our intro process 10x simpler.” — Founder, YC-backed) plus “Trusted by founders building the future.” Hero trust line “Free to start.” is present.
- **Change applied:** A **mid-page CTA** was added after “How it works” (after “Takes minutes, not hours.”): centered “Create your intro — free” for anonymous users and “Edit your intro” for logged-in users. This matches the PM brief’s optional “(3) after How it works” and adds a conversion point without changing section count or layout.

---

## Summary of code changes

| File       | Change |
| ---------- | ------ |
| `app/page.tsx` | 1) Social proof: visible **h2 “What founders say”** (replacing sr-only “Social proof”); blockquote and trust line given `ds-section-in` where appropriate. 2) How it works: **mid-page CTA** row below “Takes minutes, not hours.” — primary button “Create your intro — free” (anon) or “Edit your intro” (logged-in), centered, `btnPrimary`. |

No sections removed; no changes to animation implementation or CTA behavior beyond the above. Copy and structure remain aligned with the design spec §10 table.

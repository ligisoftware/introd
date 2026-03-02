# Introd — Usability Analysis & Improvement Plan

## Summary

Analysis was performed via code review and (where possible) E2E automation. This document lists **UX gaps**, **confusing flows**, and **concrete improvements** to make the app more understandable and usable for a common user.

---

## 1. Home & First-Time Understanding

| Issue                        | Severity | Detail                                                                                                                                                            |
| ---------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unclear value prop**       | High     | Home hero only says "Standardized first-impression layer for startup fundraising." New visitors may not understand what an "intro" is or why they should sign up. |
| **No way to see an example** | Medium   | There is no link to a sample shared intro. Users can't preview the product before signing up.                                                                     |
| **Logged-in CTA is narrow**  | Medium   | Home only shows "Edit your intro"; there is no link to Profile. Users may not realize they need to fill their profile first.                                      |

**Planned fixes:**

- Add a short subheading or bullet under the hero explaining what an intro is (e.g. "One shareable page with your background, startup, and team—for investors and warm intros.").
- Add an optional "See an example" link that points to a known demo slug (configurable or documented) or remove if no public example exists.
- For logged-in users, add a secondary link "Edit your profile" next to "Edit your intro" so profile is discoverable from home.

---

## 2. Navigation & Discoverability

| Issue                       | Severity | Detail                                                                                                                  |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Profile is hidden**       | High     | "Edit your profile" is only in the avatar dropdown. Many users expect "Profile" or "Account" in the main nav.           |
| **Feedback is footer-only** | Low      | Feedback link is only in the footer; adding it to the main nav (or a compact footer nav) could improve discoverability. |

**Planned fixes:**

- Add "Profile" to the main nav (NavLinks) when the user is logged in, so it sits next to "Intro".
- Optionally add "Feedback" to the header or keep in footer (lower priority).

---

## 3. Login Flow

| Issue                        | Severity | Detail                                                                                                                                                           |
| ---------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Technical error messages** | High     | Auth callback redirects with `?error=missing_code` or raw Supabase error messages. Login page displays these verbatim (e.g. "missing_code"), which is confusing. |
| **Empty email submit**       | Medium   | Submitting with an empty email does nothing (early return); there is no inline validation message.                                                               |
| **Copy says "Log in" only**  | Low      | Page is used for both sign-up and sign-in (magic link). Adding "Sign in or sign up" or "Continue with email" could reduce ambiguity.                             |

**Planned fixes:**

- Map known `error` query values to user-friendly messages (e.g. `missing_code` → "That link wasn't valid or has expired. Request a new sign-in link below.").
- Show inline validation when the user submits with an empty email (e.g. "Please enter your email address.").
- Optionally add a small line under the heading: "Sign in or create an account — we'll send you a link."

---

## 4. In-App Errors: alert() and confirm()

| Issue                   | Severity | Detail                                                                                                                                                                |
| ----------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Browser dialogs**     | High     | IntroCard delete and NewIntroCard create use `alert()` and `confirm()`. This is inconsistent with the rest of the app (which uses inline messages) and feels jarring. |
| **Collaborator remove** | Medium   | IntroEditor uses `confirm("Remove this collaborator?")` — same issue.                                                                                                 |

**Planned fixes:**

- Replace delete flow in IntroCard with an inline confirmation (e.g. "Delete?" + Confirm/Cancel buttons) or a small modal using existing design tokens.
- Replace create-failure in NewIntroCard with an inline error message below the button instead of `alert()`.
- Replace collaborator-remove confirm with an inline or modal confirmation in IntroEditor.

---

## 5. Shared Intro Page (/i/[slug])

| Issue                             | Severity | Detail                                                                                                                                                                |
| --------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contradictory copy**            | High     | Blurred state says "Log in to see AI summary and scores" but also "Premium feature — pay to unlock soon." Users may think logging in unlocks it, then find it's paid. |
| **No way for owner to copy link** | Medium   | When viewing your own shared intro, there is no "Copy link" or "Share" control on the page (owner must go to the editor).                                             |

**Planned fixes:**

- Clarify copy: e.g. "Log in to see the AI summary and scores (free for viewers)." Remove or reword "Premium feature — pay to unlock soon" so it doesn't contradict the CTA, or move it to a separate "Pricing" context.
- For the owner viewing their own shared page: add a small "Copy share link" or "Share" button in the header/sidebar (only when viewer is owner).

---

## 6. Intro List & Cards

| Issue                                 | Severity | Detail                                                                                                                                 |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Delete button discoverability**     | Medium   | Delete is icon-only and only visible on card hover. On touch or for low-vision users it can be missed; accidental clicks are possible. |
| **No quick link to view shared page** | Medium   | Users must open the intro editor to get the share link. A "View" or "Open link" on the card (when slug exists) would shorten the flow. |

**Planned fixes:**

- Make delete more discoverable: e.g. show a "Delete" text label on hover in addition to the icon, or add an aria-label and ensure focus order. Consider a "More" menu on the card with "Delete" to reduce accidental clicks.
- On IntroCard, when `intro.shareSlug` exists, add a "View page" link that opens `/i/{slug}` in a new tab so users can quickly preview or copy the URL from the browser.

---

## 7. AuthBar (Avatar Menu)

| Issue                   | Severity | Detail                                                                                                                                                                             |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hover-only dropdown** | Medium   | The account menu opens on mouse enter. On touch devices there is no tap-to-open; the avatar is a Link to profile, so tap navigates away. Keyboard users may not discover the menu. |
| **Click vs hover**      | Medium   | Clicking the avatar goes to Profile; hovering opens the menu. This is non-standard and can confuse users who expect "click avatar = open menu."                                    |

**Planned fixes:**

- Make the avatar open the dropdown on click (or tap) as well as hover. Use a button for "open menu" and keep "Edit profile" and "Log out" inside the menu. Ensure keyboard users can focus the button and open the menu with Enter/Space.
- Ensure the dropdown closes on outside click and Escape (already present); ensure it works with touch (click = toggle).

---

## 8. 404 Page

| Issue              | Severity | Detail                                                                                                    |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------- |
| **No nav context** | Low      | The 404 page is a full-page message with no header/nav. Users might feel "lost" from the rest of the app. |

**Planned fixes:**

- Use the same layout (header with logo + nav if logged in) on the not-found page so users can navigate back to Home or Intro without using only the "Back to home" button. (If the root layout already wraps not-found, only ensure the 404 content is consistent.)

---

## 9. Feedback Form

| Issue                       | Severity | Detail                                                                                                                                                 |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Exposes internal emails** | Low      | The form says "Feedback is sent to nic@ligi.app, jeff@ligi.app." This is internal detail; "Feedback is sent to the team" is friendlier and sufficient. |

**Planned fixes:**

- Replace the literal email list with copy like "Your feedback goes to the Introd team" or "We'll read every message."

---

## 10. Invite Flow

| Issue     | Severity | Detail                                                                                                                                             |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clear** | —        | Invalid invite message and redirect to login with `next` and `invited=true` are clear. Editor shows "You've been added as a collaborator." — good. |

No changes required for this section; optional: ensure login error mapping doesn't break the invite flow (e.g. preserve `next` and `invited` when showing friendly error).

---

## Implementation Order (for sub-agents)

1. **Login UX** — Friendly error messages + empty-email validation + optional "Sign in or sign up" copy.
2. **Navigation** — Add Profile to NavLinks; optionally Feedback in header.
3. **Home** — Value prop line, "Edit your profile" CTA when logged in; optional "See an example" if we have a demo slug.
4. **Replace alert/confirm** — IntroCard delete (inline or modal), NewIntroCard inline error, IntroEditor collaborator remove confirmation.
5. **IntroSignalBlock** — Clarify "Log in to see" vs "Premium" copy on shared intro page.
6. **AuthBar** — Click/tap to open dropdown; ensure button + keyboard/touch accessible.
7. **IntroCard** — "View page" link when shareSlug exists; improve delete affordance (label or menu).
8. **Shared intro owner** — Optional "Copy share link" when viewer is owner.
9. **404** — Ensure layout/nav is present (if not already).
10. **Feedback form** — Replace literal emails with "the team" copy.

---

## Out of Scope (for this pass)

- E2E test automation (already documented in e2e-ai-agent-guide.md).
- Full accessibility audit (WCAG).
- Performance or SEO.

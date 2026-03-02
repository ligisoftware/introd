# PR #55 — Review notes (improve-usability-flows-and-copy)

Notes from code review. Items that were **auto-fixed** are not listed here.

---

## Subjective / optional improvements

- **IntroCard delete affordance** (`app/intro/IntroCard.tsx`): The plan suggested showing a "Delete" text label on hover in addition to the icon. Currently the button is icon-only with `aria-label="Delete intro"`. Consider adding a small visible "Delete" label on hover/focus for better discoverability on touch and for low-vision users.

- **AuthBar menu — arrow-key navigation**: Optional enhancement: add roving tabindex or arrow-key handling so keyboard users can move between "Edit profile" and "Log out" without tabbing (matches common menu patterns).

- **IntroEditor collaborator remove** (`app/intro/[id]/IntroEditor.tsx`, inline confirmation): When the "Remove {name}?" confirmation appears, consider moving focus to the "Cancel" button so keyboard users can dismiss or confirm without an extra tab.

- **Login page** (`app/login/page.tsx`): The submit button is disabled when `!email.trim()`; the field also has inline validation on submit. Consider announcing the error to screen readers when it appears (e.g. ensure the `role="alert"` region is focused or that the live region is polite/assertive). Current implementation is acceptable; optional polish.

---

## Verification only (no change)

- **not-found**: Confirmed the 404 content is rendered inside the root layout (layout wraps `{children}`), so header and footer with nav and Feedback link are present as intended.
- **IntroSignalBlock**: Copy correctly clarifies "Log in to see AI summary and scores" and "Free for viewers once you're signed in." — no contradictory "Premium" message.
- **FeedbackForm**: Copy updated to "Your feedback goes to the Introd team." — no literal emails.

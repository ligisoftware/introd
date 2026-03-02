# E2E Testing Guide for AI Agents

This document enables AI agents (e.g. Cursor with MCP browser) to run full end-to-end tests of the Introd app, make judgements as a user, engineer, or product manager, and verify all flows without human intervention.

---

## 1. Limitations and Solutions

| Limitation                                                | Solution                                                                                                                                                                                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------- |
| **Magic-link-only auth** — agent cannot click email links | Use **E2E session API** when `E2E_TEST_MODE=true`: `POST /api/e2e/session` with `{ "email", "password" }` to get a session cookie. Requires a test user with password (see §2). For **score visibility** without login, use `?ai_debug=full | blurred | owner`on`/i/[slug]` in development. |
| **No stable selectors**                                   | Key UI elements have `data-testid` (see §5). Prefer `[data-testid="..."]` in snapshots when asserting or interacting.                                                                                                                       |
| **Unknown base URL**                                      | Default: `http://localhost:3000`. Ensure `npm run dev` is running.                                                                                                                                                                          |
| **No catalog of flows**                                   | This doc lists every route and flow with expected outcomes (§3, §4).                                                                                                                                                                        |
| **Data dependency**                                       | Shared intro page needs an existing slug. Use any intro’s share slug from the app, or create one via UI; no seed required.                                                                                                                  |

---

## 2. Prerequisites

- **App running:** `npm run dev` (base URL `http://localhost:3000`).
- **Env:** `.env.local` with Supabase keys (see `.env.example`). For AI scores: `OPENAI_API_KEY`. For E2E login: optional `E2E_TEST_MODE`, `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD` (see below).
- **E2E session (optional):** To test authenticated flows without email, set in `.env.local`:
  - `E2E_TEST_MODE=true`
  - `E2E_TEST_EMAIL` = email of a real user in your Supabase project.
  - `E2E_TEST_PASSWORD` = that user’s password (user must have been created/signed in with password, e.g. via Supabase Dashboard or a one-off sign-up with password).
    Then `POST /api/e2e/session` with JSON `{ "email": "<E2E_TEST_EMAIL>", "password": "<E2E_TEST_PASSWORD>" }` and reuse the session cookies for subsequent requests.
- **Debug menu:** In development, `/i/[slug]` shows an “AI scores debug” sidebar; use **Real**, **full**, **blurred**, **owner** to force score block state without switching accounts.

---

## 3. Routes and Expected Outcomes

Use these as a checklist. Base URL: `http://localhost:3000`.

| Route                      | Auth                    | Expected outcome                                                                                                                     |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /`                    | Any                     | Home; links to Log in, Feedback; if logged in, profile/avatar in nav.                                                                |
| `GET /login`               | Any                     | “Log in” heading, email input, “Send magic link” button, “Back to home”.                                                             |
| `GET /auth/callback`       | —                       | Redirect only (magic link). Without `?code=...` → redirect to `/login?error=missing_code`.                                           |
| `GET /profile`             | Required                | Redirect to `/login?next=/profile` if not logged in; else profile form.                                                              |
| `GET /intro`               | Required                | Redirect to `/login?next=/intro` if not logged in; else “Your intros”, intro cards, “New intro” card.                                |
| `GET /intro/[id]`          | Required (owner/collab) | Redirect if not logged in or no access; else intro editor.                                                                           |
| `GET /i/[slug]`            | Any                     | Shared intro view. Score block: anon → blurred + login CTA; owner → hidden; non-owner → full (or use `?ai_debug=` in dev).           |
| `GET /invite/[token]`      | Required to accept      | Invalid token → “Invalid invite”. Valid: redirect to login if not logged in; else accept and redirect to `/intro/[id]?invited=true`. |
| `GET /feedback`            | Any                     | “Send feedback” heading, message textarea, optional email, “Send feedback” button.                                                   |
| `GET /api/health`          | Any                     | 200 JSON with app health (e.g. `{ "status": "ok" }` or similar).                                                                     |
| `GET /api/me`              | Any                     | 200 with user JSON if logged in; 401 if not.                                                                                         |
| `GET /api/i/[slug]/scores` | Logged-in non-owner     | 200 + scores JSON or 503; anonymous/owner → 403.                                                                                     |

---

## 4. Flows to Test (Step-by-Step)

### 4.1 Anonymous user

1. Navigate to `/` → home, no profile avatar (or “Log in”).
2. Navigate to `/login` → form visible; submit with invalid email or empty → appropriate error or validation.
3. Navigate to `/i/[slug]` (use a known slug) → intro content; score block **blurred** and “Log in to see AI summary and scores”.
4. Navigate to `/feedback` → form; submit message → “Thanks — your feedback was sent” or error.
5. Navigate to `/api/health` → 200 JSON.

### 4.2 Authenticated user (use E2E session or real magic link)

1. Obtain session: either `POST /api/e2e/session` (when E2E_TEST_MODE) or complete magic link in email.
2. Navigate to `/` → profile/avatar in nav.
3. Navigate to `/profile` → profile form (no redirect).
4. Navigate to `/intro` → “Your intros”, “New intro” card.
5. Create intro: click “New intro” → redirect to `/intro/[id]`, editor loads.
6. Navigate to `/i/[own-slug]` (as owner) → **no** score block (or debug “owner”).
7. Navigate to `/i/[other-slug]` (as non-owner) or `/i/[slug]?ai_debug=full` → **full** score block (summary + Founder & team + Startup).
8. Call `GET /api/i/[slug]/scores` with session → 200 (or 503 if compute fails); without session or as owner → 403.

### 4.3 AI score block visibility (dev only)

With `npm run dev`, open `/i/[slug]`:

- `?ai_debug=off` or no param → **real** mode (anon=blurred, owner=hidden, non-owner=full).
- `?ai_debug=full` → full block regardless of viewer.
- `?ai_debug=blurred` → blurred block.
- `?ai_debug=owner` → no block (owner view).

Use these to verify UI and copy without multiple accounts.

### 4.4 Invite flow

1. As owner, create intro and generate invite link (or use API).
2. As another user (or new session), open `/invite/[token]`. If not logged in → redirect to login with `?next=/invite/[token]&invited=true`.
3. After login, land on same invite URL → accept → redirect to `/intro/[id]?invited=true`.

---

## 5. Stable Selectors (data-testid)

Use these in snapshots or assertions so the agent can reliably find elements.

| testid                  | Location                | Purpose                                                                 |
| ----------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `login-email`           | Login page              | Email input                                                             |
| `login-submit`          | Login page              | Send magic link button                                                  |
| `auth-bar-menu`         | Layout (when logged in) | Avatar / profile menu trigger                                           |
| `auth-bar-logout`       | AuthBar dropdown        | Log out                                                                 |
| `intro-list-create`     | Intro list              | New intro card button                                                   |
| `intro-card`            | Intro list              | Each intro card (wrapper); use with intro id or text for disambiguation |
| `intro-card-delete`     | IntroCard               | Delete intro button                                                     |
| `shared-intro-main`     | `/i/[slug]`             | Main intro content region                                               |
| `intro-signal-block`    | `/i/[slug]`             | AI summary/scores sidebar section                                       |
| `ai-debug-menu`         | `/i/[slug]` (dev)       | AI scores debug sidebar                                                 |
| `feedback-form-message` | Feedback page           | Message textarea                                                        |
| `feedback-form-submit`  | Feedback page           | Send feedback button                                                    |

---

## 6. Judgement Criteria (User / Engineer / PM)

When testing as an **AI agent**, conclude with:

- **User:** Can I sign in (or use E2E session), create an intro, share it, and see the right score block when viewing as anon/owner/non-owner? Is the feedback form usable? Are errors and success states clear?
- **Engineer:** Do all routes return expected status codes and content? Does the health endpoint respond? Do API rules (e.g. 403 for scores when anon/owner) hold? Are there console errors or failed network requests?
- **Product:** Does “who sees what” for scores match the PRD (anon=blurred, owner=hidden, non-owner=full)? Is the CTA “Log in to see AI summary and scores” present when blurred? Is the debug menu (dev only) sufficient to test without multiple accounts?

---

## 7. Quick Reference: E2E Session API

- **Endpoint:** `POST /api/e2e/session`
- **Body:** `{ "email": "string", "password": "string" }`
- **When:** Only when `E2E_TEST_MODE=true` and `NODE_ENV=development`; otherwise 404.
- **Success:** 200 JSON `{ "ok": true }` and session cookies set on the response. Use the same cookies for subsequent browser requests (e.g. MCP browser preserves cookies by default when navigating).
- **Failure:** 400 (missing email/password), 401 (invalid credentials), or 404 (E2E not enabled or not in development).

# Tech Spec: AI Intro Scores

**Status:** Draft  
**Last updated:** Feb 2025  
**Depends on:** [PRD: AI Intro Scores](./prd-ai-intro-scores.md)

---

## 1. Overview

- **Compute** intro scores (founder, startup, optional VC fit) via a single cheap LLM call per intro; return structured summary + scores + bullets.
- **Persist** results in the DB; **never compute on every page visit**. Recompute only when intro (or, for fit, intro or viewer) changes.
- **Serve** from cache on the shared intro page; respect visibility rules (anonymous = blurred, owner = hide, logged-in non-owner = full).

---

## 2. How We Compute Scores

### 2.1 Model and provider

- **Use a small, cheap model** to keep cost “basically free / extremely cheap”:
  - **Preferred:** **OpenAI `gpt-4o-mini`** — very low cost (~$0.15/1M input, ~$0.60/1M output), good at following a structured prompt.
  - **Alternative:** **Anthropic `claude-3-haiku`** or similar — comparable cost and quality.
- **Single request per “job”:** One API call returns everything for that job (see below). No separate calls per dimension.
- **Structured output:** Use the provider’s JSON mode (e.g. `response_format: { type: "json_object" }`) and a single schema so we get one parseable object: `summary`, `founderScore`, `founderBullets[]`, `startupScore`, `startupBullets[]` (and for VC fit: `fitScore`, `fitBullets[]` in a separate call).

**Dependencies:** Add an AI provider SDK (e.g. `openai` or `@ai-sdk/openai`). No need for a separate queue/job system at first: we can trigger computation in an API route or server action and persist.

### 2.2 Cost control

- **Input:** Only send what’s needed: system prompt (~300 tokens) + serialized intro (one-liner, intro text, founder/team names and bios, funding, etc.). Omit large or redundant fields. **Target: &lt; 1.5k input tokens per intro.**
- **Output:** Cap bullets (e.g. max 4 per dimension). **Target: ~300–500 output tokens per intro.**
- **Rough cost (gpt-4o-mini):** ~$0.0005–0.001 per intro (founder + startup). VC fit adds one call per (intro, VC) pair when first viewed; same order of magnitude. At hundreds of intros and thousands of views, cost stays in the low single-digit dollars per month.
- **Guardrails:** (1) Rate limit: at most one recompute per intro per N minutes (e.g. 5). (2) On failure: log, do not retry in a tight loop; show “Score unavailable” and optionally retry later (e.g. on next view).

### 2.3 Prompts (high level)

- **Founder + startup:** One system prompt that (a) defines the two dimensions (founder/team: role clarity, team completeness; startup: real problem, market, differentiation — with “Twitter clone / me-too” as low signal), (b) instructs to output a short summary and two score blocks (numeric 1–10 and 2–4 bullets each), (c) allows “insufficient information” for a dimension. User message = serialized intro + team (names, titles, bios, one-liner, intro text, funding).
- **VC fit (later):** Separate prompt that takes intro summary + VC/fund profile (sector, stage, portfolio) and returns fit score + bullets. Requires a “VC profile” concept (out of scope for initial implementation; can stub as “no fit data” until then).

---

## 3. When We Compute and When We Invalidate

### 3.1 Founder + startup scores (intro-level)

- **Compute:** When we need to show full scores and they are missing or stale (see below). Prefer **lazy:** first time a logged-in non-owner views the intro, or when intro is saved and we have a background path (see 3.3).
- **Cache key:** One row per intro. Stored in `intro_scores` (see §4). No per-viewer variation.
- **Invalidate (delete or mark stale) when:**
  - The **intro** row is updated (any field that affects the public profile). Hook: after `repositories/intros.update()` or after `services/intro.updateIntro()` returns, call `invalidateIntroScores(introId)`.
  - **Collaborators** for that intro change (add/remove collaborator, or collaborator fields like title/bio updated). Hook: after collaborator accept or `updateCollaboratorFields` for a collaborator belonging to that intro, call `invalidateIntroScores(introId)`.
- **Optional:** Store `intro_updated_at` (or content hash) in `intro_scores` and skip recompute if intro (and collaborators) haven’t changed since `computed_at`. Simplest for V1: no hash; just delete cache row on any invalidation and recompute on next need.

### 3.2 VC fit score (viewer-specific)

- **Compute:** When a **VC** (identified viewer) views an intro and we don’t have a cached fit for that (intro_id, viewer_id) pair, or after we invalidate (e.g. intro changed).
- **Cache key:** Per (intro_id, viewer_id). Stored in `intro_vc_fit_scores` (see §4). Only applicable once we have “VC” identity and optional fund profile; can defer implementation and table until that exists.
- **Invalidate:** When the intro (or its founder/startup scores) is recomputed, delete all `intro_vc_fit_scores` rows for that intro_id so the next VC view recomputes fit.

### 3.3 Where to trigger computation

- **Option A (recommended for V1):** **Lazy on view.** When a logged-in non-owner loads `/i/[slug]`, we fetch cached scores. If missing (or invalidated), we trigger computation in the same request (or via a small server-side flow), then save to DB. To avoid long waits: return the page with “Computing…” in the score block and fetch scores client-side from an API route that computes-and-caches then returns, or compute in a Server Action and revalidate. Simpler variant: compute synchronously in the server-render path; protect with a short server-side lock or “compute in progress” flag so concurrent requests for the same intro don’t all call the LLM.
- **Option B:** **Eager on save.** After intro update (and collaborator updates), enqueue a background job that computes and persists. Page views always read from cache. Requires a job runner (e.g. Vercel background, Inngest, or DB-trigger + Edge Function). Better UX (scores ready when someone visits) but more infra.
- **Recommendation:** Start with **Option A** (lazy, compute on first view after invalidation). Add Option B later if we want scores to be ready immediately after save.

---

## 4. Data Model (persisted cache)

### 4.1 `intro_scores` (founder + startup)

- **Purpose:** One row per intro; cache of summary + founder/startup scores.
- **Columns (suggested):**
  - `intro_id` (uuid, PK, FK → intros.id, ON DELETE CASCADE)
  - `summary` (text)
  - `founder_score` (smallint, 1–10 or null)
  - `founder_bullets` (jsonb, string[])
  - `startup_score` (smallint, 1–10 or null)
  - `startup_bullets` (jsonb, string[])
  - `computed_at` (timestz)
- **Invariant:** When we invalidate, we delete the row (or set computed_at = null and treat null as “no cache”). No need to store “content version” in V1 if we invalidate on every intro/collab update.

### 4.2 `intro_vc_fit_scores` (VC fit; later)

- **Purpose:** One row per (intro, viewer) for VC fit.
- **Columns (suggested):** `intro_id`, `viewer_id` (user id of the VC), `fit_score`, `fit_bullets` (jsonb), `computed_at`. Composite PK (intro_id, viewer_id). FK intro_id → intros.id ON DELETE CASCADE; viewer_id → users.id.
- **When:** Implement when we have VC identity and (optionally) fund profile. Out of scope for initial launch.

### 4.3 RLS and access

- **intro_scores:** Read: service role or anon/authenticated when loading the viewer page (we only expose via server logic that already checks ownership/visibility). Write: server-only (API or action). No direct client access.
- **intro_vc_fit_scores:** Same idea; only backend writes and reads.

---

## 5. API and Data Flow

### 5.1 Loading the shared page `/i/[slug]`

- **Server:** Resolve slug → intro, build `PublicIntroProfile`, load team. Determine viewer: **anonymous** vs **logged-in** (and if logged-in, **owner** vs **non-owner**; optional: **VC**).
- **Scores:** Query `intro_scores` by intro_id. If row exists and is fresh, use it. If not:
  - **Anonymous:** Don’t compute; show blurred block (no DB write).
  - **Owner:** Don’t fetch or show scores.
  - **Logged-in non-owner:** If no row (or invalidated), call `computeAndPersistIntroScores(introId, profile)` then read again (or return “Computing…” and have client poll an API that does compute + persist and returns scores).
- **Blurred block:** Show whenever we want to tease scores (e.g. for anonymous). No need to have computed scores to show the blurred block; we can always show “Log in to see AI summary and scores” in the right sidebar.

### 5.2 Endpoints / server-only functions

- **`getIntroScores(introId)`** — returns cached row or null. Used by viewer page and by any API that serves scores to the client.
- **`computeAndPersistIntroScores(introId, profile)`** — builds prompt from profile, calls LLM, parses response with Zod, writes to `intro_scores`, returns result. Idempotent for same input; use a “compute in progress” lock or debounce so we don’t double-call for the same intro in parallel.
- **`invalidateIntroScores(introId)`** — deletes row in `intro_scores` (and in future, rows in `intro_vc_fit_scores` for that intro_id). Called from intro update and collaborator update flows.
- Optional: **GET `/api/intros/[introId]/scores`** or **GET `/api/i/by-slug/[slug]/scores`** for client-side fetch (e.g. after “Computing…”). Returns 403 if viewer is owner or anonymous; returns cached or triggers compute-and-persist for logged-in non-owner then returns.

### 5.3 Auth for the viewer page

- Today `/i/[slug]` is unauthenticated. We need **session** on the server to know: logged in?, user id (for owner check and for future VC fit). Use existing Supabase auth (e.g. `createClient()` from `@supabase/ssr` in the page/layout) and pass “viewer” into the component or data-fetch layer so we can decide: show full scores, blurred, or none.

---

## 6. Implementation Notes

### 6.1 Serialization for the LLM

- From `PublicIntroProfile` (and team members), build a short, deterministic text blob: e.g. “Company: {name}, One-liner: {oneLiner}, Intro: {introText}, Founder: {name}, Title: {title}, Bio: {ownerBio}, … Team: …”. Omit empty fields. Keep under ~1.5k tokens so cost stays low.

### 6.2 Validation and failure

- Parse LLM response with **Zod** (schema: summary string, founderScore number 1–10, founderBullets array of strings, etc.). On parse failure or API error: log, do not persist; next view will retry. Optionally show “Summary temporarily unavailable” in the score block.

### 6.3 Concurrency

- If two requests for the same intro hit “no cache” at once, both might call the LLM. Mitigations: (1) “Compute in progress” flag in DB or in-memory (e.g. Redis) with short TTL; (2) or accept double compute occasionally. For V1, accepting rare double compute is acceptable.

### 6.4 Observability

- Log: intro_id, model, token counts (if available), latency, success/failure. Use for cost and reliability; no PII in logs.

### 6.5 Collaborator invalidation

- When we add/remove collaborators or update collaborator fields, we need the intro_id. `updateCollaboratorFields` and invite-accept flows have it. Add a call to `invalidateIntroScores(introId)` in those code paths (after successful update).

---

## 7. Out of Scope for V1

- VC identity and fund profile; VC fit score and `intro_vc_fit_scores` table.
- Background job queue for eager computation after save.
- Content fingerprint / hash to avoid recompute when nothing changed (we invalidate on any intro or collaborator change).
- Rate limiting per user (only per-intro recompute throttle suggested above).
- A/B tests or multiple model versions.

---

## 8. Checklist (implementation order)

1. **DB:** Migration for `intro_scores` table.
2. **Env:** Add `OPENAI_API_KEY` (or chosen provider); document in `.env.example`.
3. **Service:** Prompt + LLM call + Zod parse → `computeAndPersistIntroScores`; `getIntroScores`; `invalidateIntroScores`.
4. **Hooks:** Call `invalidateIntroScores` after intro update and after collaborator update/accept.
5. **Viewer page:** Add auth/session; resolve viewer (anon / owner / logged-in non-owner). Add right-hand sidebar layout (desktop); in sidebar, render full scores, blurred block, or nothing per PRD.
6. **Optional:** API route for client to request scores (compute if missing) for “Computing…” UX.
7. **Later:** VC profile + fit score + `intro_vc_fit_scores`.

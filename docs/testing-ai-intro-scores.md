# Manual testing: AI Intro Scores

Quick guide to manually verify the AI intro scores feature on the shared intro page (`/i/[slug]`).

---

## Prerequisites

1. **Environment**  
   Copy `.env.example` to `.env.local` and fill in the values. For AI scores you need:
   - **OPENAI_API_KEY** — get from [OpenAI project members / API keys](https://platform.openai.com/settings/proj_oBRbkcv5FQMODWmrkQgguvD4/people/members). Add to `.env.local` as in the example file. Without it, the score block shows “Summary temporarily unavailable” for full-view mode.

2. **Run the app**  
   `npm run dev` (needed for the debug menu).

Migrations are already applied; no DB steps required.

---

## Who sees what

| Viewer | Score block |
|--------|-------------|
| **Anonymous** | Blurred teaser + “Log in to see AI summary and scores.” |
| **Owner** | No score block. |
| **Logged-in non-owner** | Full block: summary + Founder & team + Startup. Computed on first view if missing. |

---

## 1. Test visibility

**Option A – Debug menu (easiest)**  
With `npm run dev`, open `/i/[your-slug]`. Use the “AI scores debug” sidebar: **Real**, **full**, **blurred**, **owner**. Each button forces that state without switching accounts.

**Option B – Two browsers / accounts**  
- Anonymous: incognito → `/i/[slug]` → blurred block + login CTA.  
- Owner: log in as owner → `/i/[slug]` → no score block.  
- Non-owner: log in as different user → `/i/[slug]` → full score block.

---

## 2. Test score computation

As a logged-in non-owner (or `?ai_debug=full`), open `/i/[slug]`. First load may take a few seconds; reload is fast (cached). If the API key is missing, you’ll see “Summary temporarily unavailable.”

---

## 3. Test invalidation

Scores recompute when the intro or collaborators change. Edit the intro, change a collaborator, remove one, or accept an invite — then open `/i/[slug]` as a non-owner again; scores should refresh.

---

## 4. Optional: Scores API

**GET** `/api/i/[slug]/scores`  
- Anonymous or owner → 403.  
- Logged-in non-owner → 200 with scores JSON, or 503 if compute fails.

---

## Checklist

- [ ] Blurred: teaser + login CTA (anonymous or debug=blurred).
- [ ] Owner: no block (or debug=owner).
- [ ] Non-owner: full block (or debug=full); first view may compute, then cached.
- [ ] After intro/collaborator change: scores recompute on next non-owner view.
- [ ] No API key: “Summary temporarily unavailable” in full-view mode.

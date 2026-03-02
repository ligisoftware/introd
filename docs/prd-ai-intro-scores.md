# PRD: AI Intro Scores (One-Pager)

**Status:** Draft  
**Last updated:** Feb 2025

---

## 1. Vision

Give logged-in viewers (e.g. VCs) a fast, consistent snapshot of every intro (founder strength, startup viability, optional fund fit). Founders never see their own scores to avoid gamification. The feature is free initially; eventually the whole feature will be paid.

---

## 2. Score Dimensions

| Dimension          | What it measures                                                                                                                                                                                                                                                                                 | Example low signal                                                            | Example high signal                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Founder & team** | Experience relevance, role clarity, team completeness. **Note:** Bio on the intro is a brief description of the person’s role at the company—don’t treat “short bio” as low signal by default. A future **profile screen** (separate from intro) will provide richer data to improve this score. | No team, no role clarity                                                      | Clear role, 2+ co-founders with roles; profile (when built) adds domain/experience signal |
| **Startup**        | **Is there a real problem? Is there a market?** Clarity and plausibility of problem/solution; differentiation vs. “me too” ideas                                                                                                                                                                 | “We’re building a Twitter clone” / “Social network for X” with no clear wedge | Clear problem, specific solution, defined wedge or traction                               |
| **Fit (VC)**       | How well this intro matches the viewer’s fund (sector, stage, geography, portfolio)                                                                                                                                                                                                              | —                                                                             | Shown when viewer is identified as a VC (paywall TBD later)                               |

**Startup** is the most important filter: ideas that don’t solve a real problem or address a real market (e.g. another Twitter clone, generic “AI for X”) should score low and be called out in the summary. The model should favor specificity, differentiation, and evidence of a real problem.

---

## 3. Who Sees What, When

| Audience                               | What they see                                                                                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Anonymous visitor**                  | **Blurred** score block (teaser): same layout as the real block but content blurred so they see that scores exist and are encouraged to log in. Profile content unchanged. |
| **Logged-in, not the intro owner**     | **Full** scores: summary + Founder & team + Startup (+ Fit when viewer is identified as VC).                                                                               |
| **Logged-in, viewing their own intro** | **No score block at all.** Don’t show scores to the owner—avoids gamification (users would otherwise game until they get high scores).                                     |

**Pricing (for now):** The feature is **fully free** to simplify development. **Eventually the whole AI scores feature will be paid** (exact paywall TBD; VC fit may be a premium tier).

**Rules:**

- **Scores are never visible to the intro owner.** Founders do not see their own scores anywhere (no dashboard pill, no “View feedback,” no score block when they open their own share link). This prevents gaming.
- **Anonymous visitors** see a blurred teaser only; no actual scores.
- **Logged-in viewers (who are not the owner)** see full scores.

---

## 4. Language & Format (for the score block)

- **We provide numbers and a brief textual summary.**
  - **Summary:** 2–4 sentences at the top (e.g. “Strong founder signal with clear domain experience. Startup narrative is specific but could sharpen the problem statement. Traction is mentioned but not quantified.”).
  - **Per dimension:** Short label (e.g. “Founder & team”), numeric score (e.g. 7/10 or “Strong / Medium / Needs work”), and 2–4 bullet reasons.
- **Tone:** Neutral, descriptive, focused on clarity and completeness. Avoid judgment words (“bad idea”); use “low differentiation” or “problem not yet clearly stated” instead.
- **Low confidence:** If there’s not enough data (e.g. empty one-liner + bio), show “Not enough information to assess” for that dimension instead of a number.

---

## 5. UI Placement (Where Scores Appear)

Scores appear **only on the shared intro page** (`/i/[slug]`), in a **right-hand sidebar** similar to the current **edit profile** page: main content (intro profile) on the left, sticky right column (~`lg:w-80`) containing the “Intro signal” block. No scores on the founder dashboard or intro editor.

- **Shared intro page (`/i/[slug]`):**
  - **Layout:** Two-column on large screens: **left** = intro profile (company, team, etc.); **right** = sticky sidebar with the score block (same pattern as edit intro: Share your page + Access on the right).
  - **If viewer is anonymous:** Right sidebar shows a **blurred** “Intro signal” block (same structure, content blurred; e.g. “Log in to see AI summary and scores”).
  - **If viewer is logged in and not the owner:** Right sidebar shows **full** “Intro signal”: summary paragraph, Founder & team (score + bullets), Startup (score + bullets), Fit (score + bullets when viewer is a VC).
  - **If viewer is the owner:** **Do not render the score block at all** (no sidebar score section, or show nothing in it). Owner never sees scores.

**Sketch:** Right-side layout (logged-in viewer, not owner).

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  introd.com/i/acme                                                                     │
├─────────────────────────────────────────────────────────────┬────────────────────────┤
│                                                              │  Intro signal          │
│  Company                                                     │  ┌────────────────────┐ │
│  ┌─────────────────────────────────────────────────────────┐ │  │ Summary text...    │ │
│  │  [logo]  Acme Inc.                                      │ │  │                    │ │
│  │          One-liner here...                              │ │  │ Founder & team 7/10│ │
│  └─────────────────────────────────────────────────────────┘ │  │ • Clear role       │ │
│                                                              │  │ • ...              │ │
│  Team                                                        │  │                    │ │
│  ┌─────────────────────────────────────────────────────────┐ │  │ Startup 5/10       │ │
│  │  [avatar]  Jane Doe, CEO · Joined Jan 2024  ·  Bio...   │ │  │ • Problem stated   │ │
│  └─────────────────────────────────────────────────────────┘ │  │                    │ │
│                                                              │  │ Fit 8/10           │ │
│  ...                                                         │  └────────────────────┘ │
│                                                              │  (sticky, ~w-80)        │
└─────────────────────────────────────────────────────────────┴────────────────────────┘
```

---

## 6. Out of Scope for V1

- Showing actual scores to anonymous users (blurred teaser only)
- Founders seeing their own scores (omit entirely to avoid gaming)
- “Top intros” or any public ranking
- Scoring of intros the viewer doesn’t have link to (no global browse-by-score in V1)
- Paid tier at launch (feature is free initially; whole feature will become paid later)

---

## 7. Success

- Logged-in viewers (e.g. VCs): “I can triage intros in under a minute” and “Startup score filters out me-too ideas.”
- Anonymous visitors see a blurred teaser and are prompted to log in to see scores.
- Owners never see their own scores; no gaming loop.
- Introd: Higher perceived value of shared links; path to paid feature later.

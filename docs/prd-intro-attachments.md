# PRD: Intro Attachments (Pitch Decks)

**Status:** Draft  
**Last updated:** Mar 2026

---

## 1. Vision & Value

### 1.1 Vision

Make every intro link a complete fundraising package: a concise overview plus rich context (pitch deck and key docs) in one place. Viewers (VCs, angels, operators) can understand a startup deeply in a single session, and founders don’t have to manually send or re-send decks in every thread.

### 1.2 Why This Matters (Value Analysis)

- **For founders**
  - **Reduce friction in fundraising:** Instead of “Here’s my intro link, and separately here’s the deck,” founders share a single URL that always points to the latest deck.
  - **Tell a fuller story:** The intro page is optimized for skimmability; the deck carries narrative depth, product shots, traction charts, and roadmap that don’t fit on the page.
  - **Control and consistency:** Founders ensure everyone sees the **same deck**, not outdated attachments from previous threads.
  - **Professionalism:** A share page with an embedded or clearly linked deck feels like a polished data room “lite,” which improves perceived quality of the founder.
- **For viewers (VCs / angels / operators)**
  - **One-stop evaluation:** From the intro link alone, they can:
    - Skim the high-level profile and AI scores.
    - Open the deck (and optionally key docs) without searching through email or Slack.
  - **Faster triage:** If the intro and a quick glance at the deck don’t pass the bar, they can pass quickly; if they do, they have enough info to prepare thoughtful questions.
  - **Lower back-and-forth:** No “Can you send the deck?” follow-up; they have what they need immediately.
- **For Introd (the product)**
  - **Higher perceived value of intros:** Links become the canonical source of truth for a round, not just a nice profile.
  - **Increased engagement:** Viewers spend more time on the shared page (deck opens from there) and are more likely to share the link onward.
  - **Future monetization:** Attachments unlock:
    - View analytics (who opened the deck, how often, from which intros).
    - Per-attachment access controls.
    - AI summarization / scoring of decks and docs.

**Non-goal:** Replace full data rooms. This is a lightweight, first-impression-level attachment feature focused on pitch decks and a small number of supporting docs.

---

## 2. Users & Primary Use Cases

### 2.1 Users

- **Founders / intro owners**
  - Create and maintain intros.
  - Upload / manage their pitch deck and (optionally) a small set of supporting attachments.
  - Care about professionalism, easy sharing, and keeping a single canonical deck link.
- **Collaborators**
  - Co-founders or teammates editing the intro.
  - Should be able to see and (optionally) update attachments if they have edit access to the intro.
- **Viewers**
  - **VCs / angels / operators:** Receive intro links and need to quickly gauge fit and depth.
  - **Warm-intro intermediaries:** Share intros onward and want to be confident the link includes “everything needed.”
  - Anonymous visitors who receive the link and may or may not be logged in.

### 2.2 Primary Use Cases

1. **Founder adds a pitch deck to an existing intro**
  - They have already created an intro and share slug.
  - They open the intro editor, scroll to an “Attachments / Deck” section, and upload a PDF of their deck.
  - The shared intro page now shows a clear “Pitch deck” card with a “View deck” action.
2. **Founder updates the deck before/after a round**
  - They revise their deck and want all existing intro links to point to the new version.
  - They return to the same “Attachments / Deck” section and upload a new file, replacing the old one.
  - All existing `/i/[slug]` links now use the latest deck, with no need to re-share links.
3. **Founder prefers sharing a hosted deck URL**
  - They already host their deck on Notion/Read-only Google Slides/PDF viewer.
  - They paste a URL instead of uploading a file.
  - The shared page shows a consistent card UI (“View deck”) that opens the external URL in a new tab.
4. **Viewer evaluates an intro and opens the deck**
  - From the shared intro page, they:
    - Skim the hero and team sections.
    - Optionally glance at AI intro scores.
    - See a “Pitch deck” card near the top of the page.
  - They click “View deck” and open the deck in a new tab (or embedded viewer on desktop).
5. **Viewer is on mobile**
  - They tap the intro link from email or WhatsApp.
  - The intro is readable on small screens, and the “Pitch deck” card is visible without awkward zooming.
  - Tapping “View deck” opens a mobile-friendly viewer app (e.g. built-in PDF viewer).

---

## 3. Scope & Constraints (V1)

### 3.1 In Scope (V1)

- **Single primary “Pitch deck” attachment per intro**
  - One primary deck attachment per intro (either a file upload OR external URL).
  - Founders can replace or remove it at any time.
- **Supported deck types**
  - **File upload:** PDF only (V1).
  - **External URL:** Publicly accessible links (e.g. hosted PDF, Notion page, Google Slides “view only”).
- **Attachment management**
  - Create/update/delete the pitch deck attachment from the intro editor.
  - Simple status/error messages (uploading, success, error).
  - Basic constraints: max file size (e.g. 20MB), PDF only; basic validation for URLs.
- **Viewer experience**
  - A clearly visible “Pitch deck” card on the shared intro page:
    - Shows deck name/label and file size or “External link”.
    - Primary action: “View deck” (opens in new tab).
  - Design follows Introd’s existing design system (tokens, typography, radius, shadows).
- **Permissions and visibility**
  - Anyone who can view the shared intro page (`/i/[slug]`) can see and click the deck link.
  - Owners/collaborators manage attachments; viewers can only view.
  - No separate “login gate” or paywall for attachments in V1, beyond whatever visibility the intro already has.

### 3.2 Out of Scope (V1)

- Multiple attachments per intro (e.g. separate pitch, one-pager, metrics doc).
- Per-viewer access control (e.g. watermarking or per-investor gated links).
- Download tracking or analytics (who opened the deck, when).
- AI analysis or scoring of the deck itself.
- Full data-room functionality (multiple folders, permissions, etc.).
- Granular permissions where collaborators have restricted attachment rights.

### 3.3 Constraints

- **Storage & cost**
  - Use existing Supabase infrastructure; no third-party file storage for V1.
  - Keep file size limits modest (e.g. 20MB) to avoid abuse.
- **Performance**
  - Loading the shared intro page should not block on downloading the deck itself.
  - Deck is loaded only on user action (click), not pre-fetched.
- **Security & privacy**
  - Deck URLs should **not** be guessable; follow bucket policies consistent with existing avatar/logo uploads.
  - Search engines should not index raw attachment URLs beyond what they can reach from `/i/[slug]` (we inherit current behavior; no extra SEO surfacing).

---

## 4. UX Requirements & Flows

### 4.1 Intro Editor: Attachments Section

**Placement**

- On `/intro/[id]`, add a new section in the main column (same column as company and funding):
  - Suggested placement: **below “Funding” and above “Collaborators”**.
  - Section title: **“Attachments”** with a short helper line like: “Add your pitch deck so viewers can go deeper from your intro link.”

**States**

1. **Empty state (no attachment)**
  - Title: “Attachments”
  - Subcopy: “Add your pitch deck so viewers can go deeper from your intro link.”
  - UI:
    - A card with:
      - Radio or segmented control to choose:
        - “Upload PDF”
        - “Link to a deck”
      - For “Upload PDF”:
        - Drag-and-drop zone OR “Choose file” button.
        - Copy: “PDF, up to 20MB.”
      - For “Link to a deck”:
        - URL input with placeholder: “https://…”
        - Helper text: “Use a public, view-only link (e.g. Google Slides, Notion, PDF).”
    - **Save** is integrated into the existing “Save changes” flow for the intro (no separate submit button).
2. **Deck attached (upload)**
  - The card shows:
    - “Pitch deck” label.
    - File name (e.g. `acme-seed-deck.pdf`).
    - Approximate file size (if easily available).
    - Timestamp: “Last updated {relative time}” using existing date formatting patterns.
  - Actions:
    - **“Replace deck”** (opens file picker).
    - **“Remove”** (clears attachment after confirmation).
3. **Deck attached (external URL)**
  - The card shows:
    - “Pitch deck” label.
    - Link label (derived from URL hostname or explicit title field, if provided).
    - “External link” badge.
  - Actions:
    - **“Edit link”** (edit input in place).
    - **“Remove”** (clears attachment).
4. **Error & progress states**
  - While uploading:
    - Show inline spinner and text: “Uploading deck…”; disable other actions.
  - On validation errors:
    - Show inline, friendly messages (under the control):
      - “Please upload a PDF file up to 20MB.”
      - “Please enter a valid URL.”
  - On failure to save:
    - Show an error banner in this section (reusing existing error styles from IntroEditor) and leave the previous state intact.

### 4.2 Shared Intro Page: Viewer Experience

**Placement**

- On `/i/[slug]`, the main content is `IntroProfileView` and the right-hand sidebar is AI scores (`IntroSignalBlock`).
- Add a **“Pitch deck” section in the main content column**, near the top:
  - Recommended order:
    1. Hero / company header
    2. **Pitch deck (if present)**
    3. About / intro text
    4. Funding
    5. Team

**Pitch deck card (desktop & mobile)**

- Visual:
  - Card uses `bg-ds-surface`, `rounded-ds`, `shadow-ds-sm`, and fits the existing design system.
  - Contains:
    - Label: “Pitch deck”
    - Subcopy (when present): “Open the founder’s deck in a new tab.”
    - Metadata:
      - For uploaded PDF: filename + size (optional).
      - For external URL: hostname + “External link”.
    - Primary button:
      - Label: “View deck”
      - On hover (desktop): subtle elevation/scale per design system motion tokens.
  - On small screens, card is full-width and appears directly under the hero section.

**Behavior**

- Clicking “View deck”:
  - Opens the deck in a new tab or browser viewer (standard `target="_blank"`).
  - We do not attempt to inline-render the PDF for V1; we rely on the browser’s native viewer or external app.

**Empty / absent state**

- If no attachment is configured:
  - No “Pitch deck” card is rendered at all (we don’t show an empty placeholder to viewers).

### 4.3 Owner View on Shared Page

- When the owner visits `/i/[slug]`:
  - They still **do not** see AI scores (per AI Intro Scores PRD).
  - They **do** see the “Pitch deck” card if one is attached, exactly as a viewer would (so they can sanity-check the link).
  - For convenience, keep or add the existing “Copy share link” affordance in the page header or near the deck card (from the usability plan).

### 4.4 Collaborators

- Collaborators share the same editor experience as owners:
  - If they can edit the intro’s text and funding, they can also add/replace/remove attachments.
  - On the shared page, their viewer experience is identical to any other logged-in non-owner (AI scores full view if allowed; attachments visible).

---

## 5. Product Rules & Edge Cases

### 5.1 File Upload Rules

- **Allowed types:** PDF (`application/pdf`) only.
- **Max size:** 20MB (configurable via environment or constant).
- **One active deck per intro:**
  - Uploading a new deck replaces the previous file and updates the link.
  - We do not keep historical versions in the UI (versioning is a future enhancement).
- **Invalid files:**
  - If the file is not a PDF or exceeds the size limit, show a clear, inline error and do not upload.

### 5.2 External URL Rules

- **Validation:**
  - Require a valid URL with `https://` scheme.
  - Show friendly error for invalid URLs: “Please enter a valid https:// URL.”
- **Assumptions:**
  - We assume the URL is publicly viewable; we do not verify authentication or access rights.
  - If the URL 404s or requires login, that is effectively the same as sharing a broken link today.

### 5.3 Visibility & Access

- If you can access `/i/[slug]`, you can see and click the deck link.
- Attachments follow the same visibility model as the intro:
  - Anonymous viewers: can see and click the “Pitch deck” card (no extra gate).
  - Owners: see the deck card but not AI scores.
  - Logged-in non-owners: see both full AI scores (per existing rules) and deck card.

### 5.4 Deletion & Replacement

- When a founder removes the deck:
  - The shared page stops rendering the deck card immediately after a successful save.
  - Optionally, we may leave the underlying file in storage for simplicity (implementation detail; product-wise it is “gone”).

### 5.5 Interaction with AI Intro Scores

- V1: AI intro scores **do not** consider deck content.
- Future: We may:
  - Add an indicator like “Deck present” into the AI summary.
  - Add a new dimension scored from the deck itself.
- For now, the presence/absence of a deck is purely a UX element and has no impact on the score logic.

---

## 6. Copy Guidelines

**Editor – attachments section**

- Title: “Attachments”
- Helper line (empty state): “Add your pitch deck so viewers can go deeper from your intro link.”
- Upload option:
  - Label: “Upload PDF”
  - Helper: “PDF, up to 20MB.”
- Link option:
  - Label: “Link to a deck”
  - Helper: “Use a public, view-only link (e.g. Google Slides, Notion, PDF).”
- Error messages:
  - “Please upload a PDF file up to 20MB.”
  - “Please enter a valid https:// URL.”
  - “Something went wrong while saving your deck. Please try again.”

**Shared intro page**

- Section title: “Pitch deck”
- Subcopy: “Open the founder’s deck in a new tab.”
- Button label: “View deck”
- Metadata:
  - For uploads: “{filename} · PDF”
  - For links: “External link · {hostname}”

---

## 7. Success Metrics

### 7.1 Quantitative

- **Adoption**
  - ≥ 30–50% of intros with a share slug have at least one deck attached within 1–2 months of launch.
- **Engagement**
  - For intros with a deck:
    - ≥ 50% of unique viewers click “View deck” at least once.
  - Time on page or scroll depth increases relative to intros without decks (proxy).
- **Friction**
  - < 5% of upload attempts fail due to validation errors (after the first week).

### 7.2 Qualitative

- Founder feedback (via `/feedback` or interviews) indicates:
  - “The intro link is now all I need to share for a first meeting.”
  - “Not having to separately send the deck every time is great.”
- VC feedback indicates:
  - “I can make a first-pass decision from just the intro link and deck.”

---

## 8. Open Questions & Future Extensions

### 8.1 Open Questions (for implementation/discovery)

- Do we want a **separate section** for additional attachments (e.g. “One-pager”, “Metrics snapshot”), or keep only “Pitch deck” until we see usage?
- Do we expose a **display name** separate from the filename/hostname (e.g. “Seed round deck – March 2026”)?
- Should we show a small icon or badge on the intro list card when an intro has a deck attached (“Deck attached”)?

### 8.2 Future Extensions

- **Multiple attachments**
  - Support a small list (e.g. up to 3) of attachments with typed labels: “Pitch deck”, “One-pager”, “Metrics”, “Product demo”.
- **Analytics**
  - Track opens per attachment and surface simple stats to founders (e.g. “12 deck opens in the last 7 days”).
- **AI-enhanced summaries**
  - Summarize the deck into bullets or highlight key risks/strengths.
- **Watermarking / controlled access**
  - Generate viewer-specific links or overlays for more sensitive decks.

---

## 9. Dependencies & Coordination

- **Design**
  - Finalize visual design for:
    - Editor attachments section (empty + non-empty states).
    - Shared-page pitch deck card (desktop + mobile).
  - Ensure components align with existing design tokens and card patterns in Introd.
- **Engineering**
  - Extend intro domain model to support a single `pitchDeck` attachment (file or URL).
  - Implement upload + external link flows in the editor.
  - Render the pitch deck card in `IntroProfileView` on `/i/[slug]`.
  - Add tests (unit/integration/E2E) to cover the main flows.
- **Product**
  - Validate copy and defaults.
  - Decide on initial limits (file size, whether to expose any badges on intro list cards).
  - Post-launch: monitor usage and feedback; consider multiple attachments and analytics as a follow-up effort.


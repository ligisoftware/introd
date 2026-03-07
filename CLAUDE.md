# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev` (Next.js app at `http://localhost:3000`)
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Take screenshots with Puppeteer via `node screenshot.mjs <url> [label]`
- Screenshots are saved to `./temporary screenshots/screenshot-N[-label].png` (auto-incremented, never overwritten).
- After screenshotting, read the PNG with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use design system tokens.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Git workflow

- Always create a PR when pushing changes — never push directly to main.
- Branch names: kebab-case describing the change (e.g. `revamp-shared-profile-linktree`).
- Commit messages: imperative mood, concise, focused on "why" not "what".

## PR guidelines

### Title

- Imperative mood (e.g. "Add feature X" not "Added feature X")
- Concise and descriptive
- Include the area/component if relevant

### Description

#### Summary

- High-level overview of what and why (2-3 sentences max)

#### Changes

- List main changes at a high level
- Group related changes together
- Focus on user-visible or architectural changes

#### Testing

- Note manual testing performed
- Mention if automated tests were added/updated

### Include

- High-level feature description
- Breaking changes or migration notes
- Dependencies added/removed
- Configuration changes
- User-facing changes

### Exclude

- Don't list every file changed
- Don't include implementation details obvious from code review
- Don't document minor refactorings or code style changes

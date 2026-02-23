# introd

Introd MVP: structured intro pages for founders, read-only for investors.

## Getting started

```bash
npm install
cp .env.example .env.local   # add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY from Supabase → Project Settings → API
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Prod locally: `npm run build` && `npm start`.

**Lint & format:** `npm run lint`, `npm run format` (or `npm run format:check`). See [CONTRIBUTING.md](CONTRIBUTING.md) for where to add routes/services and conventions for AI-generated code.

## MCP (agents)

**Next.js DevTools** + **Supabase** are in `.cursor/mcp.json`. Run `npm run dev` so Next DevTools can connect. Supabase MCP will prompt sign-in on first use.

**If an agent says MCP isn’t connected:** Cursor **Settings → Tools & MCP** → turn on next-devtools (and supabase). Restart Cursor, run `npm run dev`, then start a new chat.

## Stack

- **Next.js** (App Router, TypeScript, Tailwind) — routes in `app/`, API in `app/api/`
- **Supabase** — Postgres + Magic Link; logic in `services/` and `repositories/` (Route Handler → service → repository only)
- **Vercel** — deploy. Future: Go + AWS RDS path via same repo structure.

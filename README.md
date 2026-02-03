# introd

The introd application.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Supabase (required for auth and data)**  
   Copy `.env.example` to `.env.local`. Get the **Project URL** and **anon** (publishable) key from your team—we use one shared Supabase project for this repo. If you have access, they’re in [supabase.com](https://supabase.com) → project → **Project Settings** → **API**. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. **Open the site**  
   In your browser go to [http://localhost:3000](http://localhost:3000). You’ll see the Intro’d home page. Edit `app/page.tsx` or `app/layout.tsx` and save; the page will hot-reload.

To run a production build locally: `npm run build` then `npm start`.

## Tech Stack

MVP stack for Intro'd (consistent across development and deployment).

### Frontend / Website
- **Framework**: Next.js (App Router)
  - TypeScript, ESLint, Tailwind CSS
  - Server and client components, API Route Handlers under `app/api/`

### Backend / Data
- **Supabase**: Postgres database and Magic Link auth
  - Business logic lives in-repo under `services/` and `repositories/`
  - Route Handlers call services; services call repositories (no business logic in route files)

### Hosting
- **Vercel**: Production and preview deployments

### Future
- Migration path to **Go** services and **AWS RDS** when needed; in-repo structure (services/repositories) is designed to support that move.

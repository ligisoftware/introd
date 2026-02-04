# Contributing

Conventions for contributions and for AI-assisted code generation.

## Where to add things

| Layer                | Path            | Use for                                                                               |
| -------------------- | --------------- | ------------------------------------------------------------------------------------- |
| **API routes**       | `app/api/`      | Route Handlers only; keep them thin (parse request → call service → return response). |
| **Services**         | `services/`     | Business logic. Called by Route Handlers and Server Components only.                  |
| **Repositories**     | `repositories/` | Data access (e.g. Supabase queries). Called by services only.                         |
| **Types**            | `types/`        | Shared domain and API types (e.g. `Founder`, `IntroPage`).                            |
| **Shared utilities** | `lib/`          | Supabase client, helpers, shared code.                                                |

## Naming

- **Route segments:** `kebab-case` (e.g. `app/api/health/route.ts`, `app/api/founder-profiles/route.ts`).
- **Types and services:** `PascalCase` (e.g. `Founder`, `IntroPage`, `getHealth` in `services/health.ts`).
- **Files:** Match the export (e.g. `services/health.ts`, `types/index.ts`).

## Pattern: Route → service → repository

- **Route Handler** (`app/api/.../route.ts`): Parse request, call one or more **services**, return `NextResponse.json(...)`. No business logic in route files.
- **Service** (`services/`): Implements use cases; calls **repositories** for data.
- **Repository** (`repositories/`): Talks to Supabase (or other data sources); returns raw or typed data.

Do not put business logic in route handlers; keep it in services so it can be reused and tested.

## Linting and formatting

- **ESLint:** Default Next.js config. Run `npm run lint`.
- **Prettier:** Run `npm run format` to format, or `npm run format:check` to check. Use these to keep AI-generated code consistent.

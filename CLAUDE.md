# Blueprint Boilerplate — Claude Code Instructions

## Repo layout

This is a monorepo of **independent, standalone** apps — no npm/pnpm workspaces,
no shared root `node_modules`. Each app has its own `package.json`,
`node_modules`, and lockfile. Only work inside one app's folder at a time.

- `backend`  — Express + Prisma API (see Stack below)
- `admin`    — Next.js admin dashboard, consumes the backend API
- `frontend` — Next.js public-facing app, consumes the backend API
- `docker-compose.yml` (repo root) — orchestrates `backend` + Postgres

## Backend stack (backend)
- Runtime: Node.js 20.19+ / 22.12+ / 24+ (Prisma 7 requirement — do NOT downgrade to Node 18)
- Framework: Express 4 + TypeScript (CommonJS)
- ORM: Prisma 7 + PostgreSQL (Driver Adapter mode via prisma.config.ts)
Connection config: prisma.config.ts at backend root (NOT schema.prisma)
NEVER add url to schema.prisma — Prisma 7 removed this
- Auth: JWT short-lived access token (15m default) + opaque refresh token,
  rotated on every /api/auth/refresh call and stored in the `RefreshToken`
  table (row deleted = revoked). See backend/src/controllers/auth.controller.ts.
- Validation: Zod, applied via `validateBody` middleware on every route that
  accepts a body (backend/src/middleware/validate.middleware.ts)
- Env validation: backend/src/config/env.ts (Zod-parsed, fails fast on boot)
- Error handling: every controller uses `asyncHandler` + throws `AppError`;
  a single global handler in backend/src/middleware/error.middleware.ts
  formats the response — do NOT add per-route try/catch + res.status(500)
- Security: helmet + express-rate-limit (auth routes limited to 10 req/15min)
- Password hashing: bcrypt (NEVER bcryptjs)
- Connection: PrismaPg driver adapter with pg Pool

## Backend project structure (backend)
- Entry point:  src/server.ts
- Controllers:  src/controllers/
- Routes:       src/routes/
- Middleware:   src/middleware/
- Validations:  src/validations/ (Zod schemas)
- Utils:        src/utils/ (jwt, password, mailer, AppError, asyncHandler)
- Config:       src/config/prisma.ts, src/config/env.ts
- Schema:       prisma/schema.prisma

## Critical Rules (backend)
- NEVER add url = env("DATABASE_URL") to schema.prisma
  in Prisma 7 — connection lives in prisma.config.ts only
- ALWAYS import prisma from "../config/prisma"
- ALWAYS import env from "../config/env" instead of reading process.env directly
- ALWAYS use bcrypt, NEVER bcryptjs
- ALWAYS use Zod for request validation, via validateBody() in the route file
- ALWAYS wrap async controllers in asyncHandler and throw AppError instead of
  manually catching and formatting error responses
- NEVER use raw SQL — always use Prisma client
- NEVER create a new PrismaClient() anywhere except src/config/prisma.ts
- Module system is CommonJS — use import/export syntax
  (TypeScript compiles to CJS)
- Prisma migrations must be generated with a real (or temporary Dockerized)
  Postgres and committed under prisma/migrations — never hand-write migration SQL

## Frontend apps (admin, frontend)
- Next.js App Router + TypeScript + Tailwind, scaffolded via create-next-app
- Each has `src/lib/auth.ts` (token storage) and `src/lib/api.ts` (fetch
  wrapper that attaches the access token and auto-rotates on a 401 via
  /api/auth/refresh) — reuse this pattern instead of inventing a new one
- Backend URL is read from `NEXT_PUBLIC_API_URL` (see `.env.local.example`
  in each app) — copy to `.env.local` and point it at the running backend
- `next.config.ts` pins `turbopack.root` to the app's own directory — keep
  this if you ever nest these apps deeper, otherwise Next may misdetect the
  project root from an unrelated lockfile elsewhere on disk

## Docker
- `backend/Dockerfile` — multi-stage (deps → build → slim runtime).
  `prisma generate` at build time needs a resolvable `DATABASE_URL`, so the
  build stage sets a placeholder value via `ENV` — this is NOT the runtime
  connection string, which comes from the container's real env at runtime.
- `docker-compose.yml` (repo root) — three services: `postgres`, `migrate`
  (one-shot `prisma migrate deploy`, runs the Dockerfile's `build` target
  since the production image strips the Prisma CLI), and `backend`, which
  has `depends_on: migrate: condition: service_completed_successfully` —
  it will not start against an unmigrated database. Admin and frontend are
  not containerized (Next dev/`next start` is normally run directly, not
  through Docker, for these boilerplate apps).
- First-time setup: `cp backend/.env.example backend/.env` and fill in a
  real `JWT_ACCESS_SECRET` (`DATABASE_URL` in that file is irrelevant for
  Docker — compose overrides it to point at the `postgres` service). Then
  `docker compose up --build` from the repo root does everything: builds
  images, starts Postgres, applies migrations, starts the API. Re-running
  it is idempotent — `migrate` just reports no pending migrations.
- If you're running more than one project reused from this boilerplate (or
  a local Postgres) at once, host ports collide since every copy defaults
  to 5432/3000. Copy the root `.env.example` to `.env` and set
  `POSTGRES_PORT` / `BACKEND_PORT` to free ports for that project — this
  `.env` is separate from `backend/.env` and only affects host port mapping.

## Blueprint Architect MCP Tool Order
When building a new feature in backend, use tools in this order:
1. inject_prisma_model       → add schema models first
2. inject_crud_controller    → generate CRUD from schema
3. inject_express_route      → wire up routes
4. inject_rbac_middleware    → protect routes by role
5. inject_auth_system        → already present (JWT + refresh rotation) — do not re-run
6. inject_env_validation     → already present (src/config/env.ts) — do not re-run
7. inject_global_error_handler → already present (src/middleware/error.middleware.ts) — do not re-run
8. inject_socket_service     → add real-time if needed
9. inject_redis_service      → add caching if needed
10. inject_payment_webhook   → add payments if needed

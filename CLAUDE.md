# Blueprint Boilerplate — Claude Code Instructions

## Stack
- Runtime: Node.js 18+
- Framework: Express 4 + TypeScript (CommonJS)
- ORM: Prisma 7 + PostgreSQL (Driver Adapter mode via prisma.config.ts)
Connection config: prisma.config.ts at project root (NOT schema.prisma)
NEVER add url to schema.prisma — Prisma 7 removed this
- Auth: JWT access + refresh token rotation
- Validation: Zod
- Password hashing: bcrypt (NEVER bcryptjs)
- Connection: PrismaPg driver adapter with pg Pool

## Project Structure
- Entry point:  src/server.ts
- Controllers:  src/controllers/
- Routes:       src/routes/
- Middleware:   src/middleware/
- Services:     src/services/
- Config:       src/config/prisma.ts
- Schema:       prisma/schema.prisma

## Critical Rules
- NEVER add url = env("DATABASE_URL") to schema.prisma
  in Prisma 7 — connection lives in prisma.config.ts only
- ALWAYS import prisma from "../config/prisma"
- ALWAYS use bcrypt, NEVER bcryptjs
- ALWAYS use Zod for request validation
- NEVER use raw SQL — always use Prisma client
- NEVER create a new PrismaClient() anywhere 
  except src/config/prisma.ts
- Module system is CommonJS — use import/export syntax
  (TypeScript compiles to CJS)

## Blueprint Architect MCP Tool Order
When building a new feature, use tools in this order:
1. inject_prisma_model       → add schema models first
2. inject_crud_controller    → generate CRUD from schema
3. inject_express_route      → wire up routes
4. inject_rbac_middleware    → protect routes by role
5. inject_auth_system        → only once per project
6. inject_env_validation     → only once per project
7. inject_global_error_handler → only once per project
8. inject_socket_service     → add real-time if needed
9. inject_redis_service      → add caching if needed
10. inject_payment_webhook   → add payments if needed
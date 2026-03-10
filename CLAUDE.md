# Blueprint Boilerplate — Claude Code Instructions

## Project Structure
- Entry point: src/server.ts
- Controllers: src/controllers/
- Routes: src/routes/
- Middleware: src/middleware/
- Services: src/services/
- Config: src/config/prisma.ts
- Schema: prisma/schema.prisma

## Package Conventions
- ORM: Prisma (never raw SQL)
- Password hashing: bcrypt (not bcryptjs)
- Validation: Zod
- Auth: JWT (access + refresh token rotation)

## Blueprint MCP
This project is optimized for Blueprint Architect MCP.
Available tools: scaffold_project, inject_prisma_model, 
inject_auth_system, inject_socket_service, inject_rbac_middleware,
inject_crud_controller, inject_transaction, inject_payment_webhook...
```

Every developer who clones your boilerplate and uses Claude Code will immediately have full context. This makes Blueprint + Boilerplate feel like a **complete, polished platform**.

---

## What NOT to Change

Don't over-engineer the boilerplate trying to pre-include everything the MCP injects. The whole value of Blueprint is **injecting on demand**. The boilerplate should be the minimal clean foundation — Socket.io, Redis, Stripe should NOT be in it by default. They get added when needed via MCP tools. Keep it lean.

---

## Priority Order
```
Today:    Fix bcrypt → bcryptjs conflict        (30 mins)
Today:    Pin v1.0.0 tag + --depth 1 clone      (10 mins)
Today:    Add RefreshToken models to schema      (20 mins)
This week: Add CLAUDE.md to boilerplate         (30 mins)
Later:    Plan v2 universal structure detection
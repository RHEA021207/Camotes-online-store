# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed-cos` — seed Camotes Online Store demo data

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Camotes Online Store (COS)

Small business management app at artifact `cos` (preview path `/`).

- **Public surfaces**: `/` (home), `/services` (catalog), `/lookup` (find account), `/timeline/:customerId` (customer ledger).
- **Admin surfaces** (cookie session, name `cos.sid`): `/admin/login`, `/admin` (dashboard), `/admin/customers`, `/admin/customers/:id`, `/admin/services`, `/admin/settings`.
- **Default admin**: username `admin`, password `admin123` (seeded). Change after first login.
- **Auth**: `express-session` + `bcryptjs`. `requireAdmin` middleware in `artifacts/api-server/src/lib/auth.ts`. `SESSION_SECRET` env var required.
- **Domain helpers**: `artifacts/api-server/src/lib/orderHelpers.ts` computes `paidAmount` / `balance` per order from the payments table; the dashboard, customer timeline, and overdue list all flow through it.
- **Seed script**: `scripts/src/seed-cos.ts` (idempotent — only seeds when tables are empty).
- **Currency**: PHP (₱) via `formatCurrency` in `artifacts/cos/src/lib/utils.ts`.

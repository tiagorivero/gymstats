# GymStats - 🚧 Work in Progress

Management software for small gyms: member tracking, QR check-in, and a public landing page, sharing one backend.

## Tech stack

**Backend:** Express + TypeScript, Prisma + PostgreSQL (Supabase), Zod, JWT + bcrypt
**Frontend:** React + Vite + TypeScript, TanStack Query, React Hook Form + Zod, Tailwind (token-based theming)
**Deploy:** Vercel

## Progress (v0, currently on step 6/10)

### Pendiente

- Step 7 — Members screens
- Step 8 — Check-in (kiosk) screen
- Step 9 — Dashboard
- Step 10 — Deploy & final polish

## Key decisions

- **PostgreSQL over MongoDB:** the domain is relational, and the key queries are aggregations.
- **Membership status is derived, not stored** — calculated on the fly from the due date, in one place.
- **QR tokens are opaque and rotatable**, so a lost card doesn't leak a member's ID.
- **One check-in per member per day**, enforced by a DB constraint.

## Note

This project is being built with **Claude Code** as a pair-programming tool, one step at a time, reviewing every diff before committing.
# GymStats — Project rules

## Architecture
- Simple monorepo: backend/ and frontend/ are independent projects.
- Backend: strict layers. routes → middleware → controllers → services → prisma.
  Controllers do NOT touch Prisma directly; they call services.
  Services do NOT know about req/res.
- Frontend: api/ does not import React. Components do not import axios.
- One file, one responsibility. If it goes over ~150 lines, split it by responsibility.

## Conventions
- Strict TypeScript. No `any` without a comment justifying it.
- Input validation with Zod, always at the edge (middleware), never inside the service.
- Spanish for UI text and error messages (the app is for Spanish-speaking gym owners
  and members in Uruguay). English for variable and function names.
- Table and column names in the DB: snake_case. In TS code: camelCase (Prisma maps it).
- Dates: stored in UTC. Displayed in America/Montevideo. Never a bare `new Date()`
  in business logic: use the helpers in utils/dates.ts.
- Money: stored as integers (cents). Never float.

## What NOT to do
- Do not install new dependencies without asking me first.
- Do not create summary files, notes, or documentation I didn't ask for.
- Do not refactor code that works and isn't part of the current step.
- Do not invent data in the UI: if an endpoint doesn't exist yet, tell me.
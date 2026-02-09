# Claude Code Instructions

Do not add Co-Authored-By lines to git commits.

## Project

Fara-Scope is a simulated finance insights interface — an interactive dashboard for visualizing financial data, tracking KPIs, and surfacing actionable insights.

## Tech Stack

- **Next.js 16** — App Router, Server Components, Turbopack
- **React 19** — Functional components with hooks
- **TypeScript 5** — Strict mode enabled
- **shadcn/ui** — Component library (Radix UI + Tailwind)
- **Tailwind CSS v4** — Utility-first styling via PostCSS
- **Vitest** — Testing framework
- **ESLint 9** — Linting

## Project Structure

```
src/
├── app/           # Next.js pages and layouts (App Router)
├── components/    # Reusable React components
├── lib/           # Utilities and helpers (e.g. utils.ts)
├── hooks/         # Custom React hooks
└── types/         # TypeScript type definitions
docs/
└── adr/           # Architecture Decision Records
e2e/               # Playwright E2E tests (when added)
```

## Commands

```bash
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run start            # Run production server
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Coding Conventions

- Functional components only, no class components
- PascalCase for component files (e.g. `KpiCard.tsx`)
- camelCase for utilities and hooks (e.g. `formatCurrency.ts`, `useKpiData.ts`)
- Use `@/*` import alias (maps to `src/*`)
- Server Components by default; only add `"use client"` when necessary
- Prefer shadcn/ui components over custom ones — add new components with `npx shadcn add [component]`
- Tailwind classes for styling; avoid custom CSS unless Tailwind is insufficient
- Only add comments where the logic isn't self-evident

## Git Workflow

- Create feature branches for new work
- Push to remote and create a PR — never merge directly into main locally
- Keep commits focused and descriptive
- Always rebase onto main, squash commits, and fast-forward merge — no merge commits

## Testing

- Write tests first when possible (TDD)
- Use Vitest for unit and component tests
- Colocate test files with source (e.g. `KpiCard.test.tsx` next to `KpiCard.tsx`)

## Roles

This project uses role files in `.claude/roles/` to define different personas and constraints.

| Role | Purpose | Writes code? |
|------|---------|-------------|
| **fullstack-developer** | End-to-end feature implementation | Yes |
| **architect** | System design and trade-off analysis | No |
| **reviewer** | Code review for correctness and security | No |
| **designer** | UI/UX flows and interaction design | No |

Usage: say "be the \<role\>" or "use \<role\>" to activate. Default role is **fullstack-developer** when none is specified. Stay in character until the user switches or drops the role.

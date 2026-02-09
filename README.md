# Fara-Scope

A simulated finance insights interface built with Next.js. Fara-Scope provides an interactive dashboard for visualizing financial data, tracking key metrics, and surfacing actionable insights.

## Features

- **KPI Cards** — 3–5 cards displaying key financial metrics at a glance (e.g. revenue, expenses, profit margin, cash flow)
- **Trends / Time Series View** — Interactive chart showing KPI trends over time, with filters for time range and KPI selection
- **KPI Detail View** — Click any KPI card to open a dedicated detail page with an expanded chart and a data table

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone <repository-url>
cd northscope
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
northscope/
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable UI components
│   └── lib/          # Utilities and helpers
├── public/           # Static assets
└── package.json
```

## License

This project is for simulation and demonstration purposes.

## Task 5: AI-Assisted Development Pipeline

This section describes the AI-assisted development pipeline used to build Fara-Scope. Every feature flows through a structured sequence of roles, automated gates, and review checkpoints before it reaches `main`.

### Roles

Five AI agents and one external tool collaborate across the pipeline:

| Role | Responsibility | Writes code? | Output |
|------|---------------|-------------|--------|
| **UI/UX Designer** | Design feature flows, interaction specs, component layout | No | UX spec (user flows, wireframes, states) |
| **Software Architect** | Evaluate trade-offs, define component boundaries, plan approach | No | ADR / implementation plan |
| **Fullstack Developer** | Implement features end-to-end following TDD | Yes | Production code + unit/component tests |
| **Code Reviewer** | Review PRs for correctness, security, and conventions | No | Review feedback (approve / request changes) |
| **QA Engineer** | Write and run Playwright E2E tests | Yes (test code only) | E2E test suite + test results |
| **Greptile** (external) | Automated code review on every PR | No | Inline review comments |

Role definitions live in `.claude/roles/` and are activated per task.

### Pipeline Stages

Each feature progresses through seven stages. Nothing merges to `main` without passing every gate.

```
Feature Request → Design → Architecture → Implementation → Automated Gates → Code Review → E2E Testing → Merge
```

| # | Stage | Agent | Input | Output |
|---|-------|-------|-------|--------|
| 1 | **Feature Request** | UI/UX Designer | User story / product requirement | UX spec with user flows, component layout, interaction states |
| 2 | **Architecture Review** | Software Architect | UX spec | Implementation plan or ADR covering trade-offs, data model, component boundaries |
| 3 | **Implementation** | Fullstack Developer | UX spec + implementation plan | Feature branch with production code and colocated tests (TDD) |
| 4 | **Automated Gates** | CI pipeline + Git hooks | Pushed commits | Pass/fail on lint, typecheck, tests, build |
| 5 | **Code Review** | Greptile + Code Reviewer | Pull request diff | Automated inline comments (Greptile) + structured review (approve / request changes) |
| 6 | **E2E Testing** | QA Engineer | Deployed preview or local build | Playwright E2E tests covering the new feature |
| 7 | **Merge** | Fullstack Developer | Approved PR with all gates green | Squash merge to `main` (fast-forward, no merge commits) |

### Guardrails & Review Gates

Multiple automated and manual checkpoints ensure quality at every stage:

**Git Hooks** (`.husky/`)
- **Pre-commit:** `lint-staged` runs ESLint on staged files + full TypeScript typecheck
- **Pre-push:** Runs the complete test suite (`npm run test`)

**CI Pipeline** (`.github/workflows/ci.yml`)
- Lint → Typecheck → Test with coverage → Build → Dependency audit
- Runs on every push and PR targeting `main`

**Branch Protection**
- Direct pushes to `main` are blocked — all changes go through PRs
- CI checks must pass before merge is allowed
- At least one review approval is required

**Code Review**
- Greptile provides automated review comments on every PR
- The AI Code Reviewer performs a structured review checking for correctness, security, adherence to project conventions, and test coverage
- Blockers must be resolved before approval

### Quality Assurance Summary

```
Developer commits
  → pre-commit hook (lint-staged + typecheck)
    → pre-push hook (full test suite)
      → CI pipeline (lint, typecheck, test:coverage, build, audit)
        → Greptile automated review
          → AI Code Reviewer (approve / request changes)
            → QA Engineer E2E tests (Playwright)
              → Squash merge to main
```

No feature reaches `main` without passing every layer of this pipeline.

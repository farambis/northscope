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

## Task 3: Context Engineering / Knowledge Graph

> **Disclaimer:** This section was created with the help of Gemini and Claude Code under time constraints. It represents an initial sketch and would need deeper analysis and validation before being used as an actual architecture blueprint.

How we would move from "show the number" to "explain the number" — enabling the dashboard to answer questions like *"Why was this discount granted?"* or *"Why is this KPI calculated this way?"*

- **Context sources to ingest:** Data Dictionary (KPI definitions, formulas, thresholds), SOPs and approval policies (discount rules, signing authority), CRM notes and ticket history (deal-specific context), email threads linked to transactions, and ERP transformation logic (SQL/dbt models that produce each metric). Each source type gets a dedicated loader that normalizes content into chunked documents with structured metadata (source system, last-updated timestamp, owner).

- **Knowledge graph schema:** The core model links `KPI` → `Definition` (formula, thresholds) → `Owner` (responsible team/person) → `Query/Transformation` (the dbt model or SQL that computes it) → `Approval` (who signed off on the logic or a specific override) → `Document` (the SOP, email, or CRM note backing the decision). Each entity carries provenance metadata (source system, version, last-modified). Relations are typed and directional — e.g. a KPI `computed_by` a transformation, a discount `approved_by` an approval referencing a policy document.

- **Ingestion pipeline:** Documents are chunked (overlapping windows, ~512 tokens), embedded via an embedding model (e.g. `text-embedding-3-large`), and stored in a vector store (e.g. Pinecone or pgvector). In parallel, an LLM-based extraction step identifies entities and relations from each chunk and writes them as nodes/edges into a graph database (e.g. Neo4j). A nightly sync job re-processes changed documents; unchanged documents are skipped via content hashing.

- **Hybrid retrieval — Vector + Graph:** User questions first hit a vector search to find the most semantically relevant chunks. The top-k results are then expanded via graph traversal — e.g. if a chunk mentions a KPI, we traverse `KPI → Definition → Transformation → Approval` to pull in the full lineage. This two-phase approach (semantic recall → structured expansion) ensures answers are both relevant and complete.

- **Evidence-first response pattern:** Every LLM answer must cite specific source documents. The system prompt enforces a `claim → evidence` format: each statement links back to a retrieved chunk with source name, date, and section. If the retrieved context is insufficient, the model responds with "insufficient context" rather than speculating. This makes answers auditable and builds trust with finance users who need traceability.

- **UX integration:** On the KPI detail page, a "Why?" button or chat panel lets users ask natural-language questions scoped to that KPI. The system pre-loads the KPI's graph neighborhood as context, so common questions ("How is this calculated?", "Who approved this formula?") resolve from the graph without needing vector search. Answers render inline with collapsible source citations.

- **Risk 1 — Stale context:** SOPs and policies change, but the knowledge graph may lag behind. *Mitigation:* Every document node carries a `lastSynced` timestamp. At query time, cited sources older than a configurable threshold (e.g. 30 days) are flagged with a staleness warning. The ingestion pipeline runs nightly and alerts document owners when content hashing detects upstream changes that haven't been re-reviewed.

- **Risk 2 — Hallucination / incorrect attribution:** The LLM may fabricate connections between real documents or misattribute a policy to the wrong KPI. *Mitigation:* Constrained generation — the model may only cite chunk IDs that were actually retrieved (enforced by post-processing validation). Graph-based answers are preferred over pure vector answers for lineage questions, since relations are explicit rather than inferred. Confidence scoring on retrieval results lets the UI distinguish high-confidence answers from best-effort ones.

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

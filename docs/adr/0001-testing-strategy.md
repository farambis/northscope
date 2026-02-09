# ADR-0001: Testing Strategy

## Status

Accepted

## Context

Fara-Scope needs a testing strategy before feature development begins. The application is a Next.js 16 project using React 19, TypeScript, and shadcn/ui. We need to decide on tools and approaches for unit, component, and end-to-end testing.

## Decision

We adopt a three-layer testing strategy:

### Unit & Component Tests: Vitest + React Testing Library

- **Vitest** for the test runner — already in the project, native TypeScript and ESM support, fast watch mode, Jest-compatible API.
- **React Testing Library** for rendering and querying components — tests behavior over implementation details, resilient to refactors, de facto React standard.

### End-to-End Tests: Playwright (when ready)

- **Playwright** for browser-based E2E tests — multi-browser support, fast execution, first-class Next.js App Router compatibility.
- E2E tests will be added once the core user flows (dashboard, KPI detail view) are implemented.

### Test organization

- Test files are colocated with source files (e.g. `KpiCard.test.tsx` next to `KpiCard.tsx`).
- E2E tests live in a top-level `e2e/` directory.
- No snapshot tests — they are too brittle during early, fast-moving UI development.

### What to test at each layer

| Layer | Scope | Example |
|-------|-------|---------|
| Unit | Utilities, formatters, data transforms | `formatCurrency(1234)` returns `"$1,234"` |
| Component | Rendering, user interaction, state | KPI card displays correct value and trend |
| E2E | Full user flows across pages | Click KPI card, navigate to detail, verify chart and table |

## Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| **Jest** instead of Vitest | Slower, requires more config for ESM/TypeScript; Vitest already in project |
| **Cypress** instead of Playwright | Slower execution, single-browser focus, dashboard lock-in |
| **Enzyme / shallow rendering** | Deprecated, tests implementation details rather than behavior |
| **Storybook interaction tests** | Good for visual QA but not a replacement for behavioral tests; can be added later |
| **Snapshot tests** | Brittle during early development with frequent UI changes |

## Consequences

- Vitest + React Testing Library cover the immediate need for unit and component testing
- Playwright will be introduced later, avoiding setup overhead before there are flows to test
- Colocated test files keep tests close to the code they verify
- No snapshot tests means we rely on explicit assertions — more effort per test but more stable

# ADR-0003: Continuous Deployment from Main

## Status

Proposed

## Context

With Vercel selected as the deployment platform (see ADR-0002), we need to decide on a deployment strategy. The options range from a multi-environment promotion pipeline (dev → staging → production) to deploying every merge to main directly to production.

Fara-Scope is a small application with a small team. We already have automated quality gates in CI (lint, typecheck, tests, build) and preview deployments on every PR via Vercel. Adding a staging environment would introduce operational overhead without proportional benefit at this stage.

## Decision

We adopt **continuous deployment**: every merge to main is automatically deployed to production by Vercel.

### How it works

1. Developer opens a PR from a feature branch
2. GitHub Actions CI runs lint, typecheck, tests, and build validation — PR cannot merge if CI fails
3. Vercel deploys a preview URL for the PR — reviewers can verify the change visually
4. After code review and CI pass, the PR is merged to main (rebase + fast-forward)
5. Vercel automatically builds and deploys main to production

### Safeguards

- **CI quality gate** — broken code cannot reach main if tests, types, or lint fail
- **Preview deploys** — every PR is visually verifiable before merge
- **Code review** — PRs require review before merge
- **Instant rollback** — Vercel supports one-click rollback to any previous deployment

No staging environment. No manual deploy step. No release branches.

## Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| **Staging environment before production** | Adds infrastructure, cost, and process overhead. At our current scale, preview deploys on PRs serve the same validation purpose without a persistent environment to maintain. Can be introduced later if needed. |
| **Manual promotion / release branches** | Slows down delivery without adding safety beyond what CI + preview deploys already provide. Appropriate for larger teams or regulated environments, not for a small app iterating quickly. |
| **Feature flags with gradual rollout** | Useful for large-scale user-facing products. Premature for Fara-Scope's current stage. Can be layered on later without changing the deployment pipeline. |

## Consequences

- Changes reach production within minutes of merging — fast feedback loop
- No staging environment to maintain, monitor, or pay for
- The team must maintain high CI coverage and review discipline — these are the only gates before production
- If the application grows to serve external users with high availability requirements, a staging environment or feature flags should be reconsidered (a new ADR would supersede this one)

# ADR-0002: Deploy on Vercel

## Status

Proposed

## Context

Fara-Scope needs a deployment target. The application is a Next.js 16 project using the App Router, Server Components, and Turbopack. It currently has no API routes, no database, and no custom server configuration. GitHub Actions CI is already in place for lint, typecheck, tests, and build validation.

We need a deployment platform that:

- Supports Next.js 16 features (Server Components, streaming, ISR, middleware) without adapters or workarounds
- Provides preview deployments for the PR-based Git workflow
- Minimizes operational overhead — the team should spend time on the product, not on infrastructure
- Allows migration away without rewriting application code

## Decision

We deploy Fara-Scope on **Vercel**.

### CI/CD separation of concerns

GitHub Actions remains the quality gate (lint, typecheck, test, build validation). Vercel handles build and deployment. Both pipelines run in parallel on each push:

```
Developer pushes branch
        │
        ├──→ GitHub Actions CI
        │        ├─ lint
        │        ├─ typecheck
        │        ├─ test:coverage
        │        └─ build (validation only)
        │
        └──→ Vercel
             ├─ builds + deploys preview URL (PRs)
             └─ builds + deploys production (main merges)
```

### Why Vercel

- **First-party Next.js support** — Vercel maintains Next.js. Every feature (Server Components, streaming, ISR, middleware, image optimization) works without adapters or compatibility layers.
- **Zero-config deployment** — connect the GitHub repo, and builds run automatically. No Dockerfile, no build scripts, no infra to provision.
- **Preview deployments** — every PR gets a unique URL, enabling visual review before merge. This maps directly to our branch + PR workflow.
- **Edge network** — static assets and edge-rendered pages are served from a global CDN with no additional setup.

## Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| **Cloudflare Pages + Workers** | Next.js support is via `@opennextjs/cloudflare`, not first-party. Next.js 16 is new and adapter compatibility may lag. Extra build tooling required. Good option to revisit if cost becomes a concern at scale. |
| **Self-hosted (Docker on AWS/GCP/Fly.io)** | Full control but significant ops overhead: container orchestration, TLS, CDN, scaling, monitoring. No automatic preview deploys. Only justified if compliance or network isolation is required. |
| **AWS Amplify** | Supports Next.js but historically trails behind on new features. Less mature DX compared to Vercel for Next.js specifically. |
| **Netlify** | Next.js support is via a runtime adapter. Feature parity gaps with Server Components and middleware in past versions. Viable but adds a compatibility risk with Next.js 16. |

## Consequences

- Deployments are fully automated — no manual intervention after merging to main
- Every PR gets a preview URL, improving the review process
- The team takes on no infrastructure maintenance
- Vercel's free tier is sufficient for early development; Pro plan ($20/user/mo) needed for team features or higher limits
- Operational lock-in to Vercel's platform, but no code lock-in — the app runs anywhere via `next build && next start`, so migration is straightforward if needed
- GitHub Actions CI and Vercel builds are independent; if one pipeline changes, the other is unaffected

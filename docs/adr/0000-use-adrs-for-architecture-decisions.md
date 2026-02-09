# ADR-0000: Use ADRs for Architecture Decisions

## Status

Accepted

## Context

As Fara-Scope grows, architectural decisions need to be documented so that current and future contributors understand why the system is built the way it is. Decisions made in conversations or meetings are easily lost.

## Decision

We will document significant architecture decisions as Architecture Decision Records (ADRs), stored in `docs/adr/` and versioned alongside the code.

Each ADR follows this format:

- **Title** — Short description of the decision
- **Status** — Proposed, Accepted, Deprecated, or Superseded
- **Context** — What prompted the decision
- **Decision** — What we decided and why
- **Consequences** — Trade-offs, what changes, what to watch for

ADRs are numbered sequentially (`0000`, `0001`, ...) and are immutable once accepted. If a decision changes, a new ADR supersedes the old one.

## Consequences

- All significant technical decisions are traceable and reviewable in PRs
- New contributors can understand the reasoning behind the architecture
- Adds a small overhead per decision, but pays off as the project grows

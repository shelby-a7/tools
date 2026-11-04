# 0001. Use ADRs for architecture decisions

**Date:** 2026-11-04

**Status:** Accepted

## Context

As this repository grows, decisions about tooling, structure, and conventions will accumulate. Without a record, future contributors (or our future selves) won't know why things were set up a particular way, leading to repeated discussions or accidental reversals of intentional choices.

## Decision

We will record significant architecture and process decisions as Architecture Decision Records (ADRs) in `docs/adr/`. Each ADR follows a numbered template and is submitted alongside the PR that implements the decision.

"Significant" means decisions that affect repository structure, tooling choices, conventions, or workflows — not every code-level choice.

## Consequences

- Decisions are discoverable and searchable in the repo.
- New contributors can understand the reasoning behind existing patterns.
- ADRs add a small overhead to the PR process for decisions that warrant one.
- Superseded decisions remain in the record, preserving the evolution of thinking.

## Alternatives Considered

- **Wiki pages:** Harder to keep in sync with code, no PR review process, easy to lose.
- **Comments in code:** Scattered, no single place to find decisions, lost when code is refactored.
- **No formal record:** Status quo — works until it doesn't, usually when onboarding someone new.

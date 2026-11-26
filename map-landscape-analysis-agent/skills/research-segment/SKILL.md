---
name: "research-segment"
description: "Conduct web research on agentic MAP platforms for a specific market segment. Called by run-segment-report. Produces structured per-platform findings with sources — raw data, not analysis or prose."
---

# Research Market Segment

Gather raw platform data for one market segment. This skill produces structured findings only — it does not analyze, rank, group, or draft prose. That work belongs to `build-segment-report`.

## Prerequisites

This skill depends on Advanced Research (`launch_extended_search_task`). Before starting:

1. Check whether Advanced Research is available. If not, stop and tell the user to toggle the Research feature on, then re-invoke.
2. If the user explicitly opts to proceed without it, fall back to iterative `web_search` and `web_fetch`. Flag for the report's Caveats section: "This run used iterative web search rather than Advanced Research; coverage may be narrower than a full research run."

## Research directives

- Apply the strict true-agent definition from `instructions.md` as the inclusion filter.
- Apply the locked exclusion list from `instructions.md`, with a light re-check of each excluded vendor for genuine new agent products.
- Enforce the sourcing discipline from `instructions.md`.
- Cover the market segment-specific scope from `instructions.md`.
- Hunt for vendors launched, repositioned, or acquired since the prior report date.
- Flag corporate events (funding, M&A, leadership changes, shutdowns) affecting roadmaps.
- Collect ratings from G2, Capterra, TrustRadius, and Gartner with actual scores and review counts.
- Collect pricing information where publicly available.

Do NOT seed the research with a vendor list. Fresh discovery each run reduces anchoring bias — the diff step catches vendors that fall out of scope due to search variance.

## Output format

For each platform that clears the inclusion filter, return:

- Platform name and company legal name
- Year founded, latest funding, ownership, key leadership
- Evidence for or against the strict true-agent definition (autonomous goal-pursuit, multi-step reasoning, tool use, continuous decisioning)
- Channels supported (email, SMS, mobile push, web push, in-app) — clarify natively-sent vs. orchestrated downstream
- Data integrations (CDP, CRM, warehouse — name specific integrations)
- AI copy / model details (model used if known, brand-voice control, personalization mechanics)
- Decisioning architecture (how it consumes events, how it decides next action, in-flight intervention or batch)
- Confirmed customers (flag unconfirmed)
- Ratings with scores and review counts (flag < 30 reviews as low-confidence)
- Pricing (publicly known or "opaque")
- Strengths and weaknesses from user reviews
- Corporate events since prior report date
- All sources cited inline

Also return a list of excluded vendors re-checked and whether the exclusion still holds.

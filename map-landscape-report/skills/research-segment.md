---
name: research-segment
description: Conduct web research on agentic MAP platforms for a specific market segment.
inputs:
  segment: The market segment to research (b2b-saas, b2c-dtc, or b2b-plg)
  prior_report_date: Date of the most recent prior report, if any (YYYY-MM-DD or null)
outputs:
  research_findings: Raw research organized by platform, with sources
---

# Research Segment

Gather raw platform data for one market segment. This skill produces research findings only — it does not analyze, rank, or draft prose.

## Prerequisites

This skill depends on Advanced Research (`launch_extended_search_task`). Before starting:

1. Check whether Advanced Research is available. If not, stop and tell the user to toggle the Research feature on, then re-invoke.
2. If the user explicitly opts to proceed without it, fall back to iterative `web_search` and `web_fetch`. Note for the report's Caveats section: "This run used iterative web search rather than Advanced Research; coverage may be narrower than a full research run."

## Research directives

Direct the research to:

- Apply the strict true-agent definition from `instructions.md` as the inclusion filter
- Apply the locked exclusion list from `instructions.md`, with a light re-check of each excluded vendor for genuine new agent products
- Enforce the sourcing discipline from `instructions.md`
- Cover the segment-specific scope from `instructions.md`
- Hunt for vendors launched, repositioned, or acquired since the prior report date
- Flag corporate events (funding, M&A, leadership changes, shutdowns) affecting roadmaps
- Collect ratings from G2, Capterra, TrustRadius, and Gartner with actual scores and review counts
- Collect pricing information where publicly available

Do NOT seed the research with a vendor list. Fresh discovery each run reduces anchoring bias.

## Output format

For each platform that clears the inclusion filter, return:

- Platform name and company legal name
- Year founded, latest funding, ownership, key leadership
- Evidence for or against the strict true-agent definition (autonomous goal-pursuit, multi-step reasoning, tool use, continuous decisioning)
- Channels supported (email, SMS, mobile push, web push, in-app)
- Data integrations (CDP, CRM, warehouse — name specific integrations)
- AI copy / model details
- Decisioning architecture
- Confirmed customers
- Ratings with scores and review counts (flag < 30 reviews)
- Pricing (publicly known or "opaque")
- Strengths and weaknesses from user reviews
- Corporate events since prior report date
- All sources cited inline

Also return a list of excluded vendors re-checked and whether the exclusion still holds.

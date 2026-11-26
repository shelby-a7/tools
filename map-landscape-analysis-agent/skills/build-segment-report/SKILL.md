---
name: "build-segment-report"
description: "Analyze research findings and draft the structured market segment report. Invoked after the research-market-segment subagent returns. Takes structured JSON findings from context and produces the final report following a locked template."
---

# Build Market Segment Report

The `research-market-segment` subagent has returned structured JSON findings. They are already in context. This skill transforms those findings into the final report — analysis and writing, not research.

## Input (already in context)

The subagent's output is a JSON object with:

- **`platforms`** — array of objects, one per qualifying platform. Each contains: `platform_name`, `company_legal_name`, `year_founded`, `latest_funding`, `ownership`, `key_leadership`, `agent_evidence`, `channels`, `data_integrations`, `ai_copy_model`, `decisioning_architecture`, `market_segment_fit`, `confirmed_customers`, `ratings` (with `g2`, `capterra`, `trustradius`, `gartner` sub-fields), `pricing`, `strengths`, `weaknesses`, `corporate_events`, `sources`.
- **`exclusion_recheck`** — array of objects, one per excluded vendor. Each contains: `vendor`, `still_excluded`, `reason`.
- **`market_segment`**, **`research_date`**, **`prior_report_date`**, **`research_method`** — metadata.

## Instructions

1. Group platforms by meaningful clusters that emerged from the research (by approach, by maturity, by target size — whatever the data shows). Do not force a predetermined grouping.
2. For each platform, fill every field in the template. If a field has no data, say so explicitly rather than omitting it.
3. Write the Key Findings and Recommendations sections last — they synthesize the per-platform details.
4. Target 4,000–7,000 words for 8–15 platforms.
5. Apply the tone rules from `instructions.md`: calm, buyer-focused, evidence-grounded. Prose in analytical sections, bullets for per-platform fields.

## Report template

Follow this structure exactly. The standardized per-platform fields make reports diff-able across runs. The full template is in `references/report-template.md`.

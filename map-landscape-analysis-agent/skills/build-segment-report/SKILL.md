---
name: "build-segment-report"
description: "Analyze research findings and draft the structured market segment report. Called by run-segment-report after research-segment completes. Takes raw per-platform data and produces the final report following a locked template."
---

# Build Market Segment Report

Take the raw research findings from `research-segment` and produce the final report. This skill is analysis and writing — the research is already done.

## Instructions

1. Group platforms by meaningful clusters that emerged from the research (by approach, by maturity, by target size — whatever the data shows). Do not force a predetermined grouping.
2. For each platform, fill every field in the template. If a field has no data, say so explicitly rather than omitting it.
3. Write the Key Findings and Recommendations sections last — they synthesize the per-platform details.
4. Target 4,000–7,000 words for 8–15 platforms.
5. Apply the tone rules from `instructions.md`: calm, buyer-focused, evidence-grounded. Prose in analytical sections, bullets for per-platform fields.

## Report template

Follow this structure exactly. The standardized per-platform fields make reports diff-able across runs. The full template is in `references/report-template.md`.

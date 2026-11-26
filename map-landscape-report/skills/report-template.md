# Report Template

Locked template for the segment report. Follow this structure exactly — the standardized per-platform fields make reports diff-able across runs.

```markdown
# Agentic Lifecycle Marketing Platforms — [Segment Name]
## Report date: YYYY-MM-DD

## TL;DR
Three bullet points. The single most important conclusion first.

## Key Findings
One paragraph on category maturity for this segment. State structural reasons for the maturity level. Compare to the other two segments briefly if relevant. Name the platform groupings that follow.

## Details

### Group 1 — [name the grouping based on what research surfaced]

#### [Platform name] ([Company legal name])
- **Company / founding:** [year founded, latest funding, ownership, key leadership]
- **Why it's agentic (by the strict definition):** [precise description of autonomous goal-pursuit, multi-step reasoning, tool use, continuous decisioning. If agent-*assisted* rather than autonomous, state the autonomy boundary.]
- **Channels:** [email/SMS/mobile push/web push/in-app — clarify natively-sent vs. orchestrated downstream]
- **Data integration:** [CDP support, CRM support, warehouse support — name specific integrations]
- **AI copy / model:** [model used if known, brand-voice control, personalization mechanics]
- **Decisioning architecture:** [how it consumes events, how it decides next action, in-flight intervention or batch]
- **[Segment] fit:** [labeled per segment: "B2B SaaS Fit" / "B2C/DTC Fit" / "PLG Fit". If the platform isn't a natural fit for this segment, say so.]
- **Customers:** [confirmed only; flag unconfirmed]
- **Ratings:** [G2/Capterra/TrustRadius/Gartner — with actual scores and review counts. Flag ratings below 30 reviews as low-confidence.]
- **Pricing:** [publicly known or "opaque" — do not fabricate]
- **Strengths:** [from user reviews]
- **Weaknesses:** [from user reviews and structural gaps]

[Repeat for each platform in the group. 2–6 platforms per group typical.]

### Group 2 — [name]
[Same structure.]

### Group 3 — [name]
[Same structure.]

## Excluded platforms — segment-specific notes
For each vendor on the exclusion list, one line: whether the exclusion still applies, and why. If a vendor was promoted into the report this run, note that here too and cross-reference.

## Recommendations
Organize by stage/size within the segment. For B2B SaaS lead-gen and B2C/DTC use revenue tiers; for B2B PLG use ARR stages (<$5M, $5–50M, $50M+). Give concrete stack recommendations, not just platform lists. Include threshold-to-upgrade guidance. End with "How this differs from the other two segments" — one paragraph.

## POC Scorecard
5–8 test items specific to this segment. Each item is a concrete test the buyer can run in a 30–60 day POC to validate an "agentic" claim. Include the autonomy-boundary test, the in-flight intervention test, the data-source truth test, and the channel-truth-test at minimum. Add segment-specific tests (e.g., for PLG: activation-milestone reading test, expansion-signal test).

## Caveats
Definitional drift in the category. Ratings reliability. Vendor-reported outcomes labeled as such. Recent M&A / leadership changes that affect roadmaps. Any claims flagged as unverified in the source material.

## Sources
Inline citations preferred throughout the body. This section is a consolidated list of the primary sources cited above, grouped by platform.
```

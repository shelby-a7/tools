# Diff Template

Locked template for the change-log diff between consecutive runs. Only produce this when a prior report exists for the segment.

```markdown
# Change log — [Segment Name]
## Current report date: YYYY-MM-DD
## Previous report date: YYYY-MM-DD
## Days elapsed: [N]

## New platforms added this run
Platforms present in the current report, absent from the previous. One line per platform stating why it now qualifies (newly launched agent product, repositioned, cleared strict bar).

## Platforms removed this run
Platforms present in the previous report, absent from the current. One line per platform stating why (acquired, shut down, product sunsetted, no longer qualifies under strict definition, dropped from search results without clear cause).

## Rating movement
Only include platforms whose G2/Capterra/TrustRadius score changed by ±0.2 or more, OR whose review count changed by ±10% or more. State prior value → current value.

## Pricing changes
Any change in publicly disclosed pricing, tier structure, or opacity status.

## Positioning / capability changes
Vendor pivoted, launched a new agent product, added a channel, changed autonomy boundary, changed target segment.

## Corporate events
Funding rounds, acquisitions, IPO, leadership changes, shutdowns. Cite primary sources.

## Recommendations delta
What changed in the by-stage recommendations. If the top pick for a stage changed, name the old top pick, the new top pick, and the reason.

## Category-level shifts
Any change in the framing paragraph's conclusions about category maturity or structural gaps. This is the section most likely to be valuable across multiple runs.
```

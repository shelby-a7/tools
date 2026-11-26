# Subagents

Subagents are separate Claude API calls spawned by the parent agent during a run. Each subagent has its own context window, system prompt, and tool access. It receives structured input, does its work, and returns structured output — the parent agent never sees the subagent's raw intermediate context.

## research-market-segment

Conducts deep web research on agentic MAP platforms for one market segment. Returns structured per-platform findings (JSON) that the parent agent passes to the `build-segment-report` skill for analysis and drafting.

**Why a subagent instead of a skill:** Research generates massive intermediate context (dozens of web searches, full page reads, dead-end investigations) that the parent agent doesn't need once findings are structured. Running research in a separate context window keeps the parent agent's workspace clean for analysis and report writing.

**Model:** `claude-sonnet-5-5` — research is breadth-heavy (many searches) rather than depth-heavy (complex reasoning). Sonnet is a better cost/speed fit than Opus for this phase.

**Input:** Market segment name + prior report date (or null for first run).

**Output:** JSON with `platforms` array (per-platform structured fields), `exclusion_recheck` array, and metadata.

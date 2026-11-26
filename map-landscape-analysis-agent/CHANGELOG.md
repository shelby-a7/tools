# Changelog

All notable changes to the MAP Landscape Analysis Agent will be documented in this file.

## [Unreleased]

### 2026-11-26

#### Changed
- Renamed agent from `map-landscape-report` to `map-landscape-analysis-agent`.
- Restructured `instructions.md` into a concise system message declaring identity, constraints, segments, tone, skills, and tools.
- Extracted web research into the `research-market-segment` subagent (`subagents/research-market-segment/`). Research runs in a separate context window and returns structured JSON findings, keeping the parent agent's context clean for analysis and writing.
- Split remaining procedures into skills following the standardized Claude skill convention (directory + `SKILL.md` with `name`/`description` YAML frontmatter):
  - `run-segment-report/` — orchestrator
  - `build-segment-report/` — analysis and drafting, with report template in `references/`
  - `diff-reports/` — change-log comparison with embedded diff template (separated from analysis)
- Removed standalone template files — report template moved to `build-segment-report/references/report-template.md`, diff template embedded in `diff-reports/SKILL.md`.

### 2026-11-25

#### Added
- Initial agent definition following Eve directory conventions.
- Agent instructions adapted from the `agentic-lifecycle-platforms-research` skill.
- Google Drive tool stubs for read/write operations.
- n8n quarterly schedule configuration.
- README with setup instructions and environment variable reference.

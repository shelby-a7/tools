# Changelog

All notable changes to the MAP Landscape Analysis Agent will be documented in this file.

## [Unreleased]

### 2026-11-26

#### Changed
- Renamed agent from `map-landscape-report` to `map-landscape-analysis-agent`.
- Restructured `instructions.md` into a concise system message declaring identity, constraints, segments, tone, skills, and tools.
- Extracted web research into the `research-market-segment` subagent (`subagents/research-market-segment/`). Research runs in a separate context window and returns structured JSON findings, keeping the parent agent's context clean for analysis and writing.
- Moved orchestration workflow into `instructions.md` — the agent knows its own step sequence directly instead of loading a skill to discover it. Deleted `run-segment-report/` skill.
- Created `report-storage/` skill for Drive I/O (file naming convention, write procedure, graceful degradation, user-facing summary). Prior report retrieval is deferred to right before the diff step — only the date (from the filename) is needed earlier.
- Remaining skills follow the standardized Claude skill convention (directory + `SKILL.md` with `name`/`description` YAML frontmatter):
  - `build-segment-report/` — analysis and drafting, with report template in `references/`
  - `diff-reports/` — change-log comparison with embedded diff template
- Removed standalone template files — report template moved to `build-segment-report/references/report-template.md`, diff template embedded in `diff-reports/SKILL.md`.
- Fixed handoff language in `instructions.md` steps 4–6: replaced "Pass …" phrasing (which implied a function-call interface) with language that reflects how skills work (data is already in the conversation context).
- Added "Input (already in context)" section to `build-segment-report/SKILL.md` documenting the expected JSON schema from the `research-market-segment` subagent.
- Removed stale references to deleted skills (`run-segment-report`, `research-segment`) from `build-segment-report/SKILL.md` and `diff-reports/SKILL.md` descriptions.
- Added "Input (already in context)" section to `diff-reports/SKILL.md` documenting the two markdown reports the skill expects to find in context.
- Clarified `instructions.md` step 5 sequencing: read the prior report first, then invoke the diff skill once both reports are in context. Removed "(conditional)" from the step header.
- Added "Input (already in context)" section to `report-storage/SKILL.md` documenting the market segment, completed report, and optional change-log diff.
- Replaced Eve-style tool stubs (`tools/google-drive.ts`) with an MCP server (`tools/google-drive/`). The server exposes `read_drive_folder`, `read_drive_file`, and `write_drive_file` over the MCP protocol using Python + FastMCP. Works with both Claude Code (conversational runs) and n8n (scheduled batch runs).
- Updated all tool name references from camelCase to snake_case across `instructions.md`, `diff-reports/SKILL.md`, and `report-storage/SKILL.md`.

### 2026-11-25

#### Added
- Initial agent definition following Eve directory conventions.
- Agent instructions adapted from the `agentic-lifecycle-platforms-research` skill.
- Google Drive tool stubs for read/write operations.
- n8n quarterly schedule configuration.
- README with setup instructions and environment variable reference.

# Changelog

All notable changes to the MAP Landscape Report agent will be documented in this file.

## [Unreleased]

### 2026-11-26

#### Changed
- Restructured `instructions.md` into a concise system message declaring identity, constraints, segments, tone, skills, and tools.
- Split monolithic procedure into four properly-formatted skills with YAML frontmatter:
  - `run-segment-report` — orchestrator
  - `research-segment` — web research (separated from analysis)
  - `build-segment-report` — analysis and drafting with embedded report template
  - `diff-reports` — change-log comparison with embedded diff template (separated from analysis)
- Removed standalone `report-template.md` and `diff-template.md` — templates are now embedded in the skills that produce their output.

### 2026-11-25

#### Added
- Initial agent definition following Eve directory conventions.
- Agent instructions adapted from the `agentic-lifecycle-platforms-research` skill.
- Google Drive tool stubs for read/write operations.
- n8n quarterly schedule configuration.
- README with setup instructions and environment variable reference.

# MAP Landscape Analysis Agent

Quarterly research agent that produces evidence-grounded reports on commercially available agentic lifecycle marketing automation platforms (MAPs).

## What it does

For a single market segment, the agent:

1. Checks Google Drive for the most recent prior report
2. Conducts deep web research using a strict "true-agent" definition as the inclusion filter
3. Drafts a structured report (4,000–7,000 words) following a locked template
4. Generates a change-log diff against the prior report (if one exists)
5. Writes both files to Google Drive

## Segments

Each run covers exactly one segment:

| Segment | Focus |
|---|---|
| **B2B SaaS lead-gen** | Email/SMS/push lifecycle + AI copy + behavioral decisioning |
| **B2C/DTC** | Same channel mix, denser field, ranked by autonomy + ratings |
| **B2B PLG** | Free-to-paid activation + self-serve expansion, CDP-first |

## Directory structure

```
map-landscape-analysis-agent/
├── agent.ts              # Agent config (model, reasoning effort)
├── instructions.md       # System message (identity, constraints, tone, skill/tool declarations)
├── tools/
│   └── google-drive.ts   # Google Drive read/write tool definitions
├── skills/
│   ├── run-segment-report/
│   │   └── SKILL.md      # Orchestrator: retrieves prior report, runs skills, writes output
│   ├── research-segment/
│   │   └── SKILL.md      # Web research: gathers raw platform data
│   ├── build-segment-report/
│   │   ├── SKILL.md      # Analysis + drafting
│   │   └── references/
│   │       └── report-template.md  # Locked report template
│   └── diff-reports/
│       └── SKILL.md      # Change-log diff with embedded diff template
├── schedules/
│   └── quarterly.ts      # n8n schedule config and setup notes
├── sandbox/              # Reserved for sandboxed execution
├── README.md
└── CHANGELOG.md
```

## Scheduling

Runs quarterly via [n8n](https://n8n.io/), not Eve's built-in scheduler. See `schedules/quarterly.ts` for the cron expression, required environment variables, and n8n workflow steps.

**Recommended schedule:** `0 9 1 1,4,7,10 *` (9:00 AM ET on Jan 1, Apr 1, Jul 1, Oct 1)

## Setup

### Prerequisites

- An Anthropic API key with access to `claude-opus-5-5`
- A Google Drive folder for report storage
- An n8n instance with the Cron and Google Drive nodes

### Environment variables

| Variable | Description |
|---|---|
| `[ANTHROPIC_API_KEY]` | Claude API key |
| `[GOOGLE_DRIVE_FOLDER_ID]` | Root "Platform Reports" folder ID in Google Drive |
| `[GOOGLE_SERVICE_ACCOUNT]` | Google service account credentials (JSON) |

### Google Drive folder structure

The agent expects (and will create if missing):

```
Platform Reports/           ← [GOOGLE_DRIVE_FOLDER_ID]
  ├── b2b-saas/
  ├── b2c-dtc/
  └── b2b-plg/
```

Files follow the naming convention `YYYY-MM-DD_<segment>_report.md` and `YYYY-MM-DD_<segment>_diff-vs-previous.md`.

## Report quality controls

- **Strict true-agent definition** filters out AI-augmented automation dressed up as agents
- **Locked exclusion list** of legacy MAPs, re-checked each run for genuine agent products
- **Sourcing discipline** — every claim traces to a named, verified source; no fabricated URLs
- **No seed vendor list** — fresh discovery each run to reduce anchoring bias
- **Standardized per-platform template** makes reports diff-able across runs

## License

See the repository root [LICENSE](../LICENSE).

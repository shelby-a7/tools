---
name: "run-segment-report"
description: "Orchestrate a full quarterly MAP landscape report for one market segment. Invoke this skill when the user asks to refresh, rerun, or update the agentic lifecycle platforms report, or asks for a new market segment report. This skill coordinates the three sub-skills (research, build, diff) and handles Drive I/O."
---

# Run Market Segment Report

Orchestrate the production of one market segment's quarterly report. This skill handles Drive I/O and delegates research, analysis, and diffing to their respective skills.

## Step 1: Confirm market segment and retrieve prior report

If the market segment is ambiguous, ask which one (single question, three options). Otherwise proceed.

Check the durable-storage location — a Google Drive folder named **Platform Reports** (folder ID `[YOUR_GOOGLE_DRIVE_FOLDER_ID]`, URL `[YOUR_GOOGLE_DRIVE_FOLDER_URL]`). Use the folder ID, not the name — IDs are stable across renames.

Expected folder structure:

```
Platform Reports/
  ├── b2b-saas/
  ├── b2c-dtc/
  └── b2b-plg/
```

1. Call `readDriveFolder([YOUR_GOOGLE_DRIVE_FOLDER_ID])` to find the market segment subfolder.
2. If the subfolder exists, list its files and call `readDriveFile` on the most recent `YYYY-MM-DD_<market-segment>_report.md`. This is the diff baseline.
3. If the subfolder does not exist, treat this as a first run (no baseline).

If Drive is unavailable, degrade gracefully: write output to a local directory and tell the user to save manually.

## Step 2: Research

Invoke the `research-segment` skill. Pass the market segment and the prior report date (if any). The research skill produces structured findings — raw data, not prose.

## Step 3: Analysis and drafting

Invoke the `build-segment-report` skill. Pass the market segment and the research findings. The build skill produces the final report following its locked template.

## Step 4: Diffing

If no prior report exists, skip this step. Note in the report that this is the baseline run.

If a prior report exists, invoke the `diff-reports` skill. Pass the current report and the prior report. The diff skill produces a structured change log following its locked template.

## Step 5: Write to storage and report to user

Call `writeDriveFile` for each output file in the market segment subfolder:
- `YYYY-MM-DD_<market-segment>_report.md`
- `YYYY-MM-DD_<market-segment>_diff-vs-previous.md` (if a prior report existed)

Use the current date in America/New_York timezone.

Report to the user: (a) files written to `Platform Reports/<market-segment>/`, (b) filenames, (c) if a prior report existed, its date and a bullet-count summary of what changed.

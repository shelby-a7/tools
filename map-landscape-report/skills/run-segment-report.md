---
name: run-segment-report
description: Orchestrate a full quarterly MAP landscape report for one market segment.
inputs:
  segment: The market segment to report on (b2b-saas, b2c-dtc, or b2b-plg)
outputs:
  report_file: The segment report written to Google Drive
  diff_file: The change-log diff written to Google Drive (omitted on first run)
---

# Run Segment Report

Orchestrates the three skills that produce a quarterly report. Execute them in order.

## Step 1: Confirm segment and retrieve prior report

If the segment is ambiguous, ask which one (single question, three options). Otherwise proceed.

Check the durable-storage location — a Google Drive folder named **Platform Reports** (folder ID `[YOUR_GOOGLE_DRIVE_FOLDER_ID]`, URL `[YOUR_GOOGLE_DRIVE_FOLDER_URL]`). Use the folder ID, not the name.

Expected folder structure:

```
Platform Reports/
  ├── b2b-saas/
  ├── b2c-dtc/
  └── b2b-plg/
```

1. Call `readDriveFolder([YOUR_GOOGLE_DRIVE_FOLDER_ID])` to find the segment subfolder.
2. If the subfolder exists, list its files and call `readDriveFile` on the most recent `YYYY-MM-DD_<segment>_report.md`. This is the diff baseline.
3. If the subfolder does not exist, treat this as a first run (no baseline).

If Drive is unavailable, degrade gracefully: write output to a local directory and tell the user to save manually.

## Step 2: Execute `research-segment`

Pass the segment and the prior report date (if any) to the `research-segment` skill.

## Step 3: Execute `build-segment-report`

Pass the segment and the research output to the `build-segment-report` skill.

## Step 4: Execute `diff-reports`

If no prior report exists, skip this step and note in the report that this is the baseline run.

If a prior report exists, pass the current report and the prior report to the `diff-reports` skill.

## Step 5: Write to storage and report to user

Call `writeDriveFile` for each output file in the segment subfolder:
- `YYYY-MM-DD_<segment>_report.md`
- `YYYY-MM-DD_<segment>_diff-vs-previous.md` (if a prior report existed)

Use the current date in America/New_York timezone.

Report to the user: (a) files written to `Platform Reports/<segment>/`, (b) filenames, (c) if a prior report existed, its date and a bullet-count summary of what changed.

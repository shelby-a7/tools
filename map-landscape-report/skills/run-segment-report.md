# Run Segment Report

End-to-end procedure for producing one segment's quarterly MAP landscape report. Load the `report-template` and `diff-template` skills when you reach the drafting and diffing steps.

## Prerequisites

This procedure depends on Advanced Research (`launch_extended_search_task`). Before starting:

1. Check whether Advanced Research is available. If not, stop and tell the user to toggle the Research feature on, then re-invoke.
2. If the user explicitly opts to proceed without it, fall back to iterative `web_search` and `web_fetch`. Note in the report's Caveats section: "This run used iterative web search rather than Advanced Research; coverage may be narrower than a full research run."

## Step 1: Confirm segment and check for prior reports

If the segment is ambiguous, ask which one (single question, three options). Otherwise proceed.

Check the durable-storage location — a Google Drive folder named **Platform Reports** (folder ID `[YOUR_GOOGLE_DRIVE_FOLDER_ID]`, URL `[YOUR_GOOGLE_DRIVE_FOLDER_URL]`). Use the folder ID, not the name.

Expected folder structure:

```
Platform Reports/
  ├── b2b-saas/
  ├── b2c-dtc/
  └── b2b-plg/
```

1. Query Google Drive for children of `[YOUR_GOOGLE_DRIVE_FOLDER_ID]` matching the segment subfolder name.
2. If the subfolder exists, list its files and read the most recent `YYYY-MM-DD_<segment>_report.md` as the diff baseline.
3. If the subfolder does not exist, create it and treat this as a first run.

If Drive is unavailable, degrade gracefully: write output to a local directory and tell the user to save manually.

## Step 2: Conduct fresh research

Use `launch_extended_search_task` (or iterative web search if opted in). Direct the research to:

- Apply the strict true-agent definition as the inclusion filter
- Apply the locked exclusion list, with a light re-check of each excluded vendor
- Enforce sourcing discipline
- Cover the segment-specific scope from `instructions.md`
- Hunt for vendors launched, repositioned, or acquired since the prior report date
- Flag corporate events affecting roadmaps

Do NOT seed the research with a vendor list. Fresh discovery each run reduces anchoring bias.

## Step 3: Draft the report

Load the `report-template` and follow its structure exactly. Target 4,000–7,000 words for 8–15 platforms.

## Step 4: Generate the diff

If no prior report exists, skip this step and note in the report that this is the baseline.

If a prior report exists, load the `diff-template` and produce a separate diff file. Target 500–1,500 words. If nothing material changed, say so plainly.

## Step 5: Write to storage and report to user

Write both files (or just the report on first run) to the Drive segment subfolder using:
- `YYYY-MM-DD_<segment>_report.md`
- `YYYY-MM-DD_<segment>_diff-vs-previous.md`

Use the current date in America/New_York timezone.

Report to the user: (a) files written to `Platform Reports/<segment>/`, (b) filenames, (c) if a prior report existed, its date and a bullet-count summary of what changed.

---
name: "report-storage"
description: "Write report and diff output files to Google Drive following the locked naming convention. Invoked at the end of a run after the report (and optionally the diff) have been produced."
---

# Report Storage

Write the completed report and diff files to Google Drive and report results to the user.

## Storage location

Google Drive folder named **Platform Reports**, folder ID `[YOUR_GOOGLE_DRIVE_FOLDER_ID]`, URL `[YOUR_GOOGLE_DRIVE_FOLDER_URL]`. Use the folder ID, not the name — IDs are stable across renames.

Expected subfolder structure:

```
Platform Reports/
  ├── b2b-saas/
  ├── b2c-dtc/
  └── b2b-plg/
```

## File naming convention

Use the current date in **America/New_York** timezone.

- Report: `YYYY-MM-DD_<market-segment>_report.md`
- Diff: `YYYY-MM-DD_<market-segment>_diff-vs-previous.md`

Where `<market-segment>` is one of `b2b-saas`, `b2c-dtc`, `b2b-plg`.

## Write procedure

1. Call `writeDriveFile` for the report file in the market segment subfolder.
2. If a diff was produced, call `writeDriveFile` for the diff file in the same subfolder.

## Graceful degradation

If Drive is unavailable (tool errors, authentication failures), write output to a local directory and tell the user to save manually. Do not fail the run over a storage issue — the report content is the deliverable.

## Report to user

After writing, tell the user:

1. Where the files were written: `Platform Reports/<market-segment>/`
2. The filenames written
3. If a prior report existed: its date and a bullet-count summary of what changed (from the diff)

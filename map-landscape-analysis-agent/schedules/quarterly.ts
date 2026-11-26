// Schedule configuration for n8n.
//
// This agent runs quarterly via an n8n workflow, not via Eve's built-in
// scheduler. The cron expression below is for reference — configure the
// actual trigger in your n8n instance.
//
// Recommended cron: 0 9 1 1,4,7,10 *
//   → 9:00 AM on the 1st of January, April, July, October
//
// n8n workflow steps:
//   1. Cron trigger (quarterly schedule above)
//   2. Set segment parameter (one of: b2b-saas, b2c-dtc, b2b-plg)
//   3. Call Claude API with:
//      - model: claude-opus-5-5
//      - system prompt: contents of ../instructions.md
//      - tools: web_search_20260209 (server-side)
//      - message: "Run the MAP landscape report for {segment}"
//   4. Google Drive node: write report output to Platform Reports/{segment}/
//   5. (Optional) Notification node: email/Slack summary on completion
//
// Environment variables required in n8n:
//   [ANTHROPIC_API_KEY]       — Claude API key
//   [GOOGLE_DRIVE_FOLDER_ID]  — Root "Platform Reports" folder ID
//   [GOOGLE_SERVICE_ACCOUNT]  — Google service account credentials (JSON)
//
// To run all three segments in a single quarter, trigger the workflow
// three times with different segment values, or use an n8n loop node.

export const schedule = {
  cron: "0 9 1 1,4,7,10 *",
  timezone: "America/New_York",
  description: "Quarterly MAP landscape research — runs once per quarter per segment",
  managedBy: "n8n",
};

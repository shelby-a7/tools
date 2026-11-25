import { defineTool } from "eve";
import { z } from "zod";

export const readDriveFolder = defineTool({
  description:
    "List files in a Google Drive folder by folder ID. Returns file names, IDs, and modified dates.",
  inputSchema: z.object({
    folderId: z
      .string()
      .describe("Google Drive folder ID to list contents of"),
  }),
  async execute({ folderId }) {
    // Requires GOOGLE_SERVICE_ACCOUNT_KEY or OAuth credentials.
    // See schedules/quarterly.ts for credential configuration.
    //
    // Implementation: use googleapis npm package
    //   const drive = google.drive({ version: "v3", auth });
    //   const res = await drive.files.list({
    //     q: `'${folderId}' in parents and trashed = false`,
    //     fields: "files(id, name, modifiedTime)",
    //     orderBy: "name desc",
    //   });
    throw new Error(
      "Not implemented — connect Google Drive credentials via n8n or implement with googleapis SDK",
    );
  },
});

export const readDriveFile = defineTool({
  description:
    "Read the text content of a file in Google Drive by file ID.",
  inputSchema: z.object({
    fileId: z.string().describe("Google Drive file ID to read"),
  }),
  async execute({ fileId }) {
    throw new Error(
      "Not implemented — connect Google Drive credentials via n8n or implement with googleapis SDK",
    );
  },
});

export const writeDriveFile = defineTool({
  description:
    "Create or overwrite a markdown file in a Google Drive folder.",
  inputSchema: z.object({
    folderId: z
      .string()
      .describe("Google Drive folder ID to write into"),
    fileName: z.string().describe("File name (e.g. 2026-11-25_b2b-saas_report.md)"),
    content: z.string().describe("Markdown content to write"),
  }),
  async execute({ folderId, fileName, content }) {
    throw new Error(
      "Not implemented — connect Google Drive credentials via n8n or implement with googleapis SDK",
    );
  },
});

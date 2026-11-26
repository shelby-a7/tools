# Google Drive MCP Server

MCP server that exposes Google Drive read/write tools for the MAP Landscape Analysis Agent.

## Tools

| Tool | Description |
|---|---|
| `read_drive_folder` | List files in a Google Drive folder by folder ID |
| `read_drive_file` | Read the text content of a Drive file by file ID |
| `write_drive_file` | Create or overwrite a markdown file in a Drive folder |

## Setup

### 1. Install dependencies

```bash
pip install -r tools/google-drive/requirements.txt
```

### 2. Configure credentials

Set the `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable to the JSON content of a Google service account key file. The service account needs read/write access to the Drive folder used for report storage.

```bash
export GOOGLE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
```

### 3. Run standalone

```bash
python tools/google-drive/server.py
```

The server communicates over stdio using the MCP protocol.

### 4. Connect to Claude Code

Add to `.claude/settings.local.json` (not committed — credentials stay local):

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "python",
      "args": ["tools/google-drive/server.py"]
    }
  }
}
```

Set `GOOGLE_SERVICE_ACCOUNT_KEY` in your shell environment before launching Claude Code.

### 5. Connect to n8n (batch runs)

For scheduled batch runs, n8n can either:

- Call this MCP server as a subprocess
- Use n8n's built-in Google Drive nodes directly (the `.md` files are runtime-agnostic — only the tool wiring differs)

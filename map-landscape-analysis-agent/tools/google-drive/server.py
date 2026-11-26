"""Google Drive MCP server for the MAP Landscape Analysis Agent."""

import json
import os

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("google-drive")

SCOPES = ["https://www.googleapis.com/auth/drive"]


def _get_drive_service():
    creds_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    if not creds_json:
        raise RuntimeError(
            "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set. "
            "Set it to the JSON content of a Google service account key file."
        )
    creds_info = json.loads(creds_json)
    creds = service_account.Credentials.from_service_account_info(
        creds_info, scopes=SCOPES
    )
    return build("drive", "v3", credentials=creds)


@mcp.tool()
async def read_drive_folder(folder_id: str) -> str:
    """List files in a Google Drive folder. Returns file names, IDs, and modified dates."""
    service = _get_drive_service()
    results = (
        service.files()
        .list(
            q=f"'{folder_id}' in parents and trashed = false",
            fields="files(id, name, modifiedTime)",
            orderBy="name desc",
        )
        .execute()
    )
    files = results.get("files", [])
    if not files:
        return "No files found in folder."
    return json.dumps(files, indent=2)


@mcp.tool()
async def read_drive_file(file_id: str) -> str:
    """Read the text content of a file in Google Drive."""
    service = _get_drive_service()
    content = service.files().get_media(fileId=file_id).execute()
    return content.decode("utf-8")


@mcp.tool()
async def write_drive_file(folder_id: str, file_name: str, content: str) -> str:
    """Create or overwrite a markdown file in a Google Drive folder."""
    service = _get_drive_service()

    existing = (
        service.files()
        .list(
            q=f"'{folder_id}' in parents and name = '{file_name}' and trashed = false",
            fields="files(id)",
        )
        .execute()
        .get("files", [])
    )

    media = MediaInMemoryUpload(content.encode("utf-8"), mimetype="text/markdown")

    if existing:
        file = (
            service.files()
            .update(fileId=existing[0]["id"], media_body=media)
            .execute()
        )
    else:
        file = (
            service.files()
            .create(
                body={
                    "name": file_name,
                    "parents": [folder_id],
                    "mimeType": "text/markdown",
                },
                media_body=media,
                fields="id, name",
            )
            .execute()
        )

    return json.dumps({"id": file["id"], "name": file.get("name", file_name)})


if __name__ == "__main__":
    mcp.run()

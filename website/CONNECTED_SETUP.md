# BharatLipi — Connected Website Setup

The original React/Vite design is retained. The repository-facing pages now use the Module 3 FastAPI backend:
- Dashboard
- Manuscript Library
- Search
- Digital Archive
- Manuscript Viewer
- Verification Center

## Run locally (Windows / PowerShell)

1. Keep the Google Colab runtime running, including the FastAPI server and ngrok tunnel.
2. Open this project folder in VS Code.
3. Open a terminal in the project folder and run:

   ```powershell
   npm ci
   npm run dev
   ```

4. Open the local URL printed by Vite (the supplied Vite config uses port 8443).

The `.env.local` file is already set to the ngrok URL supplied in this conversation:
`https://shingle-alto-gigantic.ngrok-free.dev`

## When the Colab/ngrok URL changes

Edit `.env.local` and update `VITE_API_BASE_URL` to the new HTTPS URL. Restart Vite after changing it. Do not add a trailing slash.

## Important behavior

- The Library and Archive fetch all database records using the backend's 100-record pagination.
- Search queries the backend (ID, title, filename, and saved OCR/translation fields).
- Viewer images are the actual enhanced-grayscale and binary files in Drive. The binary image is not presented as an original scan.
- OCR and translation edits are written to SQLite through the API.
- Verification only lists records with OCR text that are pending review. Preprocessed image-only records do not enter the review queue until text is stored.
- Period, region, author, folio count and confidence values are not invented when the current database has no such metadata.

## Session notes

The ngrok URL is temporary. Keep Colab running during the demo. If the Colab session or tunnel restarts, copy the new HTTPS URL into `.env.local` and restart Vite.

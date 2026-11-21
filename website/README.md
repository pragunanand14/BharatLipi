# BharatLipi — Translation + Profile release

This project keeps the existing React/Vite manuscript workspace and connects it to the Colab FastAPI backend. The Module 1 preprocessing and Module 2 Sanskrit/Devanagari OCR workflow are retained. The repository's existing 1,199 manuscript records are not re-imported by this release.

## Start the Colab backend first

1. Open `BharatLipi_Module3_Translation_Integrated.ipynb` in Google Colab.
2. Select **Runtime → Change runtime type → T4 GPU** (or another available GPU).
3. Run the notebook cells in order. It mounts the same Google Drive, verifies the existing database and image dataset, and creates a separate translation table without deleting manuscript records.
4. Open the three IndicTrans2 checkpoint pages linked in the notebook, sign in to Hugging Face, and accept the repository access conditions.
5. Create a Hugging Face **read** token. Paste it only into the notebook's hidden prompt. The token is kept in the active Colab runtime and is not written into the notebook or Drive.
6. Run the tunnel cell and copy the new HTTPS ngrok URL. Translation weights are downloaded on first use and cached in Drive.

## Configure the website

Open `.env.local` in the website root and set:

```env
VITE_API_BASE_URL=https://YOUR-CURRENT-NGROK-URL
```

Use the fresh URL printed by the current Colab session, without a trailing slash. Restart Vite after changing this file.

## Run on Windows / PowerShell

```powershell
npm install
npm run dev
```

Open the exact Local URL printed by Vite. Keep Colab and the ngrok tunnel running while using the website.

## Translation behavior

- Hindi and English are selected by default for new uploads. The user can add other supported language/script options or choose OCR only.
- The current IndicTrans2 language registry contains 26 language/script codes. These represent 22 scheduled Indic languages plus English, with multiple-script options for some languages. The list follows AI4Bharat's published language codes. See the model and toolkit documentation for the current supported inventory.
- Translations are stored in the additive `manuscript_translations` table, one row per manuscript and target-language code. OCR columns are not overwritten.
- For existing OCR manuscripts, the Translation workspace lets the user select a source language and one or more targets, generate translations, switch between saved languages, copy/download a translation, and save a reviewed edit.
- Each saved translation is associated with a hash of the source OCR text. If the source is changed later, the website flags the previous translation as out of date.
- Translation model weights load lazily on the first request. A Colab GPU is strongly recommended; the first model download can take time.

## OCR and upload behavior

The upload page accepts multiple image files, a multi-page PDF, or a ZIP bundle containing images/PDFs. Limits are 50 MB per file, 100 MB per job, and 100 pages per job. Uploads are processed sequentially; each successful page receives a new `UPL-...` record with enhanced/binary images and OCR text. The existing `BL-...` records remain intact.

The OCR profile remains the one in the supplied Module 1+2 notebook: Tesseract with Sanskrit + Devanagari language/script data, `--psm 6`, grayscale/denoising, and the notebook's Sanskrit text-cleaning function. It is targeted to Sanskrit/Devanagari, not arbitrary-script automatic recognition.

## Profile and settings

Profile information and workspace settings (default translation targets, default source language for existing OCR, compact view, and completion notifications) persist in `localStorage` for the same browser on the same device. This release does not implement sign-in, server-side accounts, or cross-device synchronization.

## Translation accuracy

IndicTrans2 is neural machine translation. It cannot promise perfect word-for-word or scholarly equivalence, especially for historical Sanskrit, damaged pages, uncertain OCR, rare terms, and context-specific passages. The original OCR is retained unchanged. Machine translations are labelled and should be reviewed by a qualified reader before citation or publication.

## When Colab restarts

A Colab runtime or ngrok URL is temporary. Rerun the notebook, copy the newly generated HTTPS URL into `.env.local`, and restart Vite. The SQLite database, upload records, and model cache remain on Google Drive.

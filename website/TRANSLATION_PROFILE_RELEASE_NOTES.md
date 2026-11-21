# BharatLipi Translation + Profile Update

## Included

- Translation into the 26 language/script codes listed by AI4Bharat IndicTrans2 (22 scheduled Indic languages, with multiple script variants, plus English).
- Hindi and English are the default output languages. Upload target selections persist in browser settings.
- Translations are stored in a separate `manuscript_translations` table, one translation per manuscript and target language. Existing OCR columns are not overwritten.
- Existing-manuscript translation workspace supports language selection, generation progress, switching between saved outputs, copying/downloading, and saving a reviewed edit. A translation becomes stale if the underlying OCR text changes.
- Profile editor at the bottom of the sidebar; profile and settings persist in `localStorage` for that browser/device.
- Settings remains a separate sidebar page. Retired presentation-only controls and informational navigation pages are absent from the app and source bundle.
- Browser Back follows in-app history and returns to Dashboard at the beginning of the app rather than navigating away.

## Translation model setup

The backend uses the distilled AI4Bharat IndicTrans2 checkpoints:

- `ai4bharat/indictrans2-indic-en-dist-200M`
- `ai4bharat/indictrans2-en-indic-dist-200M`
- `ai4bharat/indictrans2-indic-indic-dist-320M`

Open the three model pages from the notebook instructions, sign in to Hugging Face, and accept each repository's access conditions. Create a Hugging Face read token. The notebook prompts for it using hidden input and keeps it in the current Colab runtime environment; it is not written into the notebook or Google Drive.

A Colab GPU runtime is strongly recommended. The first request for each model direction downloads the model weights into the persistent Drive cache.

## Run the updated backend

1. Open `BharatLipi_Module3_Translation_Integrated.ipynb` in Google Colab.
2. Select Runtime → Change runtime type → T4 GPU (or another available GPU).
3. Run all cells in order. Mount the same Google Drive containing `BharatLipi/Module3/database/bharatlipi.db` and the preprocessed dataset.
4. Accept the Hugging Face model terms and paste the read token when prompted.
5. Confirm the `/api/translation/status` smoke-test response shows dependencies ready. The model weights load lazily on the first translation request.
6. Create a fresh ngrok tunnel and copy the new HTTPS URL.

## Run the website

1. Extract this ZIP into a new folder (keep your existing working folder as a backup).
2. Edit `.env.local` and set `VITE_API_BASE_URL` to the fresh ngrok URL.
3. In the extracted project root, run `npm install` and `npm run dev`.
4. Open the exact local URL printed by Vite. Restart Vite after changing `.env.local`.
5. Keep the Colab runtime and ngrok tunnel running while using the website.

## Translation accuracy and review

IndicTrans2 is a multilingual neural machine-translation system. It is not a guarantee of perfect word-for-word or scholarly translation, particularly for historical Sanskrit, rare terminology, damaged manuscripts, or OCR mistakes. The original OCR text is retained unchanged. Machine-generated translations are labelled, can be reviewed and edited, and are marked out of date when their source OCR changes. A subject expert should verify translations before publication or citation.

## Profile/settings persistence

Profile and settings persist across refreshes in the same browser on the same device. This version does not implement server-side user accounts or cross-device synchronization.

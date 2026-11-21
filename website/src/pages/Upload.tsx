import { useRef, useState } from 'react';
import { useNav } from '../App';
import { startProcessingJob } from '../api';
import { getSettings, saveSettings, SUPPORTED_TRANSLATION_LANGUAGES } from '../preferences';

const ACCEPTED = new Set(['jpg', 'jpeg', 'png', 'webp', 'tif', 'tiff', 'bmp', 'pdf', 'zip']);
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

function extension(name: string) {
  return name.split('.').pop()?.toLowerCase() || '';
}
function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Upload() {
  const { navigate, setActiveJobId } = useNav();
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [translationLanguages, setTranslationLanguages] = useState<string[]>(getSettings().defaultTranslationLanguages);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | File[]) => {
    const picked = Array.from(incoming);
    if (!picked.length) return;
    const invalid = picked.find((file) => !ACCEPTED.has(extension(file.name)));
    if (invalid) {
      setError(`Unsupported file type: ${invalid.name}. Use images, PDF, or ZIP.`);
      return;
    }
    const tooLarge = picked.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLarge) {
      setError(`${tooLarge.name} exceeds the 50 MB per-file limit.`);
      return;
    }
    const merged = [...files, ...picked];
    if (merged.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
      setError('The combined upload exceeds the 100 MB limit. Remove some files and try again.');
      return;
    }
    setFiles(merged);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setError('');
  };

  const updateTranslationLanguages = (next: string[]) => {
    setTranslationLanguages(next);
    saveSettings({ ...getSettings(), defaultTranslationLanguages: next });
  };

  const handleBegin = async () => {
    if (!files.length || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      // This upload's OCR profile is fixed to Sanskrit + Devanagari.
      const job = await startProcessingJob(files, translationLanguages, 'san_Deva');
      setActiveJobId(job.jobId);
      navigate('processing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setSubmitting(false);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Digitization</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Upload Manuscript</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>
          Upload one page, multiple images, a multi-page PDF, or a ZIP bundle. Each page will be processed by the Sanskrit / Devanagari OCR pipeline.
        </p>
      </div>

      <div className="px-10 py-8 max-w-4xl">
        <div
          className="relative mb-6 transition-all"
          style={{ border: `2px dashed ${dragOver ? '#B08A45' : 'rgba(176,138,69,0.4)'}`, background: dragOver ? 'rgba(176,138,69,0.06)' : '#FDF6E7', padding: '56px 40px', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => { event.preventDefault(); setDragOver(false); addFiles(event.dataTransfer.files); }}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,.bmp,.pdf,.zip"
            className="hidden"
            onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ''; }}
          />
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5" style={{ border: '1.5px solid rgba(176,138,69,0.4)', background: 'rgba(176,138,69,0.08)' }}>
            <span className="text-2xl" style={{ color: '#B08A45' }}>↑</span>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2" style={{ color: '#17233C' }}>Drag & Drop Manuscript Pages Here</h3>
          <p className="text-sm mb-4" style={{ color: '#5A4A3A' }}>or</p>
          <span className="inline-block px-6 py-2.5 text-sm font-semibold" style={{ background: '#17233C', color: '#F1E4C3' }}>Browse Files</span>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {['JPG', 'PNG', 'TIFF', 'WEBP', 'PDF', 'ZIP'].map((fmt) => (
              <span key={fmt} className="font-mono text-xs px-2 py-1" style={{ border: '1px solid rgba(176,138,69,0.3)', color: '#8C6C33', background: 'rgba(176,138,69,0.06)' }}>{fmt}</span>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: '#5A4A3A' }}>Maximum 50 MB per file · 100 MB combined · Up to 100 pages per processing job</p>
        </div>

        {files.length > 0 && (
          <div className="p-5 mb-6" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-lg font-semibold" style={{ color: '#17233C' }}>Selected files</h3>
                <p className="text-xs mt-0.5" style={{ color: '#5A4A3A' }}>{files.length} file{files.length === 1 ? '' : 's'} · {formatSize(totalSize)}</p>
              </div>
              <button onClick={() => setFiles([])} className="text-xs px-3 py-1.5" style={{ border: '1px solid rgba(168,93,50,0.3)', color: '#A85D32' }}>Clear all</button>
            </div>
            <div className="flex flex-col gap-2">
              {files.map((file, index) => (
                <div key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="flex items-center gap-3 px-3 py-2.5" style={{ background: 'rgba(176,138,69,0.06)', border: '1px solid rgba(176,138,69,0.16)' }}>
                  <span className="font-mono text-[10px] px-2 py-1" style={{ background: '#17233C', color: '#F1E4C3' }}>{extension(file.name).toUpperCase()}</span>
                  <span className="text-sm flex-1 min-w-0 truncate" style={{ color: '#29231D' }}>{file.name}</span>
                  <span className="text-xs" style={{ color: '#5A4A3A' }}>{formatSize(file.size)}</span>
                  <button onClick={(event) => { event.stopPropagation(); removeFile(index); }} aria-label={`Remove ${file.name}`} className="text-sm px-2" style={{ color: '#A85D32' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="p-5 mb-6" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold" style={{ color: '#17233C' }}>Automatic translation after OCR</h3>
              <p className="text-xs mt-1" style={{ color: '#5A4A3A' }}>Each successfully extracted page will be translated into every selected language and saved to its manuscript record.</p>
            </div>
            <span className="text-[10px] px-2 py-1 font-semibold" style={{ color: '#3F5945', background: 'rgba(63,89,69,0.1)' }}>OPTIONAL</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold" style={{ color: '#5A4A3A' }}>OCR source language</span>
            <span className="px-3 py-2 text-xs font-semibold" style={{ border: '1px solid rgba(176,138,69,0.35)', background: '#fffaf0', color: '#29231D' }}>Sanskrit · Devanagari</span>
            <span className="text-xs" style={{ color: '#8C6C33' }}>This upload pipeline currently recognizes Sanskrit / Devanagari pages.</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(showAllLanguages ? SUPPORTED_TRANSLATION_LANGUAGES : SUPPORTED_TRANSLATION_LANGUAGES.filter((language) => ['hin_Deva', 'eng_Latn', 'ben_Beng', 'mar_Deva', 'tam_Taml', 'tel_Telu', 'guj_Gujr', 'pan_Guru'].includes(language.code))).filter((language) => language.code !== sourceLanguage).map((language) => (
              <label key={language.code} className="flex items-center gap-2 px-3 py-2 cursor-pointer" style={{ background: translationLanguages.includes(language.code) ? 'rgba(63,89,69,0.08)' : 'rgba(176,138,69,0.04)', border: `1px solid ${translationLanguages.includes(language.code) ? 'rgba(63,89,69,0.4)' : 'rgba(176,138,69,0.18)'}` }}>
                <input type="checkbox" checked={translationLanguages.includes(language.code)} onChange={() => updateTranslationLanguages(translationLanguages.includes(language.code) ? translationLanguages.filter((code) => code !== language.code) : [...translationLanguages, language.code])} />
                <span className="text-xs" style={{ color: '#29231D' }}>{language.name}</span>
                <span className="text-[10px] ml-auto" style={{ color: '#8C6C33' }}>{language.nativeName}</span>
              </label>
            ))}
          </div>
          <button type="button" onClick={() => setShowAllLanguages((value) => !value)} className="mt-3 text-xs font-semibold underline" style={{ color: '#17233C' }}>{showAllLanguages ? 'Show common languages' : `Show all ${SUPPORTED_TRANSLATION_LANGUAGES.length} languages`}</button>
          <p className="text-xs mt-2" style={{ color: '#5A4A3A' }}>{translationLanguages.length ? `Selected: ${translationLanguages.length} language(s)` : 'No target language selected. The upload will run OCR only.'} · Existing OCR text is preserved separately.</p>
          <p className="text-[11px] mt-3" style={{ color: '#8C6C33' }}>Your selected output languages are saved as the defaults for your next upload. Change them here or in Settings.</p>
        </section>

        <div className="flex items-center gap-3 px-5 py-4 mb-6" style={{ background: 'rgba(63,89,69,0.08)', border: '1px solid rgba(63,89,69,0.25)' }}>
          <span style={{ color: '#3F5945' }}>✓</span>
          <p className="text-sm" style={{ color: '#3F5945' }}>The OCR profile uses Tesseract Sanskrit + Devanagari, followed by the text-normalization function from Module 2. Uploaded pages are saved as new repository records for review.</p>
        </div>

        {error && <div className="px-4 py-3 mb-5 text-sm" role="alert" style={{ color: '#9B2C2C', background: 'rgba(168,93,50,0.08)', border: '1px solid rgba(168,93,50,0.3)' }}>{error}</div>}

        <div className="flex gap-3">
          <button onClick={handleBegin} disabled={!files.length || submitting} className="px-8 py-3.5 text-sm font-semibold transition-all hover:brightness-95 disabled:opacity-50" style={{ background: '#17233C', color: '#F1E4C3' }}>
            {submitting ? 'Uploading…' : translationLanguages.length ? `Begin OCR + ${translationLanguages.length} Translation(s) →` : 'Begin OCR Processing →'}
          </button>
          <button onClick={() => { setFiles([]); setError(''); }} disabled={submitting} className="px-6 py-3.5 text-sm font-semibold transition-all hover:bg-[#E5D4AD] disabled:opacity-50" style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Clear Selection</button>
        </div>
      </div>
    </div>
  );
}

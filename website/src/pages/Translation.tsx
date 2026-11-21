import { useEffect, useMemo, useState } from 'react';
import { useNav } from '../App';
import { getManuscript, getSavedTranslations, getTranslationJob, SavedTranslation, saveTranslationEdit, startTranslationJob, TranslationJob } from '../api';
import { getSettings, saveSettings, SUPPORTED_TRANSLATION_LANGUAGES, languageName } from '../preferences';

const buttonStyle = { background: '#17233C', color: '#F1E4C3' } as const;
const outlineStyle = { border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' } as const;
const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function Translation() {
  const { selectedManuscript, navigate } = useNav();
  const [manuscript, setManuscript] = useState<any>(null);
  const [savedTranslations, setSavedTranslations] = useState<SavedTranslation[]>([]);
  const [selectedSavedLanguage, setSelectedSavedLanguage] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(getSettings().defaultSourceLanguage);
  const [targetLanguages, setTargetLanguages] = useState<string[]>(getSettings().defaultTranslationLanguages);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [job, setJob] = useState<TranslationJob | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const sourceText = useMemo(() => {
    if (!manuscript) return '';
    return String(manuscript.verifiedText || manuscript.cleanedText || manuscript.rawOcrText || manuscript.ocrText || '');
  }, [manuscript]);

  const selectedTranslation = savedTranslations.find((item) => item.languageCode === selectedSavedLanguage) || null;

  const refreshData = async () => {
    const [record, translations] = await Promise.all([
      getManuscript(selectedManuscript),
      getSavedTranslations(selectedManuscript),
    ]);
    setManuscript(record);
    setSavedTranslations(translations);
    setSelectedSavedLanguage((current) => current && translations.some((item) => item.languageCode === current)
      ? current
      : translations.find((item) => item.isCurrent)?.languageCode || translations[0]?.languageCode || '');
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setNotice('');
    Promise.all([getManuscript(selectedManuscript), getSavedTranslations(selectedManuscript)])
      .then(([record, translations]) => {
        if (!active) return;
        setManuscript(record);
        setSavedTranslations(translations);
        setSelectedSavedLanguage(translations.find((item) => item.isCurrent)?.languageCode || translations[0]?.languageCode || '');
      })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Could not load manuscript translation data.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedManuscript]);

  const updateTranslationPreferences = (nextSource: string, nextTargets: string[]) => {
    setSourceLanguage(nextSource);
    setTargetLanguages(nextTargets);
    saveSettings({
      ...getSettings(),
      defaultSourceLanguage: nextSource,
      defaultTranslationLanguages: nextTargets,
    });
  };

  const toggleTarget = (code: string) => {
    const next = targetLanguages.includes(code)
      ? targetLanguages.filter((item) => item !== code)
      : [...targetLanguages, code];
    updateTranslationPreferences(sourceLanguage, next);
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) {
      setError('This manuscript does not have OCR text yet. Run OCR or verify its extracted text first.');
      return;
    }
    if (!targetLanguages.length) {
      setError('Select at least one target language.');
      return;
    }
    if (targetLanguages.includes(sourceLanguage)) {
      setError('Remove the source language from the target list.');
      return;
    }
    setGenerating(true);
    setError('');
    setNotice('');
    setJob(null);
    try {
      const started = await startTranslationJob(selectedManuscript, sourceLanguage, targetLanguages);
      setJob(started);
      let latest = started;
      while (!['completed', 'completed_with_errors', 'failed'].includes(latest.status)) {
        await delay(1100);
        latest = await getTranslationJob(started.jobId);
        setJob(latest);
      }
      await refreshData();
      if (latest.status === 'completed') setNotice('Translation completed and saved to this manuscript record.');
      else if (latest.status === 'completed_with_errors') setNotice('Some translations were saved. Check the warnings for targets that could not be completed.');
      else setError(latest.errors.join('\n') || 'Translation could not be completed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation request failed.');
    } finally {
      setGenerating(false);
    }
  };

  const startEditing = () => {
    if (!selectedTranslation) return;
    setEditText(selectedTranslation.translatedText);
    setEditMode(true);
    setNotice('');
  };

  const saveEdit = async () => {
    if (!selectedTranslation || !editText.trim()) return;
    setSaving(true);
    setError('');
    try {
      await saveTranslationEdit(selectedManuscript, selectedTranslation.languageCode, editText);
      await refreshData();
      setEditMode(false);
      setNotice('Your reviewed translation was saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save translation edits.');
    } finally {
      setSaving(false);
    }
  };

  const copyTranslation = async () => {
    if (!selectedTranslation) return;
    try {
      await navigator.clipboard.writeText(selectedTranslation.translatedText);
      setNotice(`${selectedTranslation.languageName} translation copied.`);
    } catch {
      setError('Clipboard access was blocked by the browser.');
    }
  };

  const downloadTranslation = () => {
    if (!selectedTranslation) return;
    const blob = new Blob([selectedTranslation.translatedText], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `${selectedManuscript}_${selectedTranslation.languageCode}.txt`;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  const languagesToShow = showAllLanguages ? SUPPORTED_TRANSLATION_LANGUAGES : SUPPORTED_TRANSLATION_LANGUAGES.filter((language) => ['hin_Deva', 'eng_Latn', 'ben_Beng', 'mar_Deva', 'tam_Taml', 'tel_Telu', 'guj_Gujr', 'pan_Guru'].includes(language.code));

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Translation & accessibility</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Manuscript Translation</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>{selectedManuscript} · {manuscript?.title || 'Loading manuscript…'} · IndicTrans2</p>
      </div>

      <div className="px-10 py-8">
        {loading && <p className="text-sm" style={{ color: '#5A4A3A' }}>Loading manuscript and saved translations…</p>}
        {error && <div className="px-4 py-3 mb-5 text-sm whitespace-pre-wrap" role="alert" style={{ color: '#9B2C2C', background: 'rgba(168,93,50,0.08)', border: '1px solid rgba(168,93,50,0.3)' }}>{error}</div>}
        {notice && <div className="px-4 py-3 mb-5 text-sm" role="status" style={{ color: '#3F5945', background: 'rgba(63,89,69,0.08)', border: '1px solid rgba(63,89,69,0.3)' }}>{notice}</div>}

        {!loading && manuscript && (
          <>
            <section className="p-5 mb-6" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }}>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold" style={{ color: '#17233C' }}>Generate translations</h2>
                  <p className="text-xs mt-1" style={{ color: '#5A4A3A' }}>Choose a source language and one or more output languages. Results are stored separately for this manuscript.</p>
                </div>
                <span className="text-[10px] px-2 py-1 font-semibold" style={{ background: 'rgba(63,89,69,0.1)', color: '#3F5945' }}>{SUPPORTED_TRANSLATION_LANGUAGES.length} supported language/script options</span>
              </div>
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <label className="text-xs font-semibold" style={{ color: '#5A4A3A' }}>Source language
                  <select value={sourceLanguage} onChange={(event) => updateTranslationPreferences(event.target.value, targetLanguages.filter((code) => code !== event.target.value))} className="ml-2 px-3 py-2 outline-none font-normal" style={{ border: '1px solid rgba(176,138,69,0.35)', background: '#fffaf0', color: '#29231D' }}>
                    {SUPPORTED_TRANSLATION_LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {languagesToShow.filter((language) => language.code !== sourceLanguage).map((language) => (
                  <label key={language.code} className="flex items-center gap-2 px-3 py-2 cursor-pointer" style={{ background: targetLanguages.includes(language.code) ? 'rgba(63,89,69,0.08)' : 'rgba(176,138,69,0.04)', border: `1px solid ${targetLanguages.includes(language.code) ? 'rgba(63,89,69,0.4)' : 'rgba(176,138,69,0.18)'}` }}>
                    <input type="checkbox" checked={targetLanguages.includes(language.code)} onChange={() => toggleTarget(language.code)} />
                    <span className="text-xs" style={{ color: '#29231D' }}>{language.name}</span>
                    <span className="text-[10px] ml-auto" style={{ color: '#8C6C33' }}>{language.nativeName}</span>
                  </label>
                ))}
              </div>
              <button type="button" onClick={() => setShowAllLanguages((value) => !value)} className="mt-3 text-xs underline font-semibold" style={{ color: '#17233C' }}>{showAllLanguages ? 'Show common languages' : `Show all ${SUPPORTED_TRANSLATION_LANGUAGES.length} languages`}</button>
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button onClick={handleGenerate} disabled={generating || !sourceText.trim() || targetLanguages.length === 0} className="px-6 py-3 text-sm font-semibold disabled:opacity-50" style={buttonStyle}>{generating ? 'Translating…' : `Translate into ${targetLanguages.length} language(s)`}</button>
                <span className="text-xs" style={{ color: '#5A4A3A' }}>{sourceText.length.toLocaleString()} OCR characters · {targetLanguages.length} selected target(s)</span>
              </div>
              {generating && job && <div className="mt-4 p-4" style={{ background: 'rgba(176,138,69,0.08)', border: '1px solid rgba(176,138,69,0.3)' }}>
                <div className="flex justify-between text-xs mb-2" style={{ color: '#4A3424' }}><strong>{job.currentStage}</strong><strong>{job.progress}%</strong></div>
                <div className="h-2" style={{ background: 'rgba(176,138,69,0.15)' }}><div className="h-2 transition-all" style={{ width: `${job.progress}%`, background: '#B08A45' }} /></div>
                <p className="text-xs mt-2" style={{ color: '#5A4A3A' }}>{job.completedLanguages} / {job.totalLanguages} languages completed</p>
              </div>}
              {job?.errors?.length ? <div className="mt-3 text-xs whitespace-pre-wrap" style={{ color: '#A85D32' }}>{job.errors.join('\n')}</div> : null}
            </section>

            <section className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-display text-xl font-semibold" style={{ color: '#17233C' }}>Saved translations</h2>
                  <p className="text-xs mt-1" style={{ color: '#5A4A3A' }}>Select a language to switch the translated text shown below.</p>
                </div>
                {savedTranslations.length > 0 && <select value={selectedSavedLanguage} onChange={(event) => { setSelectedSavedLanguage(event.target.value); setEditMode(false); }} className="px-3 py-2 text-sm outline-none" style={{ border: '1px solid rgba(176,138,69,0.35)', background: '#FDF6E7', color: '#29231D' }}>
                  {savedTranslations.map((item) => <option key={item.languageCode} value={item.languageCode}>{item.languageName}{item.isCurrent ? '' : ' · outdated source'}</option>)}
                </select>}
              </div>
              {savedTranslations.length === 0 ? <div className="p-5 text-sm" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)', color: '#5A4A3A' }}>No translations have been saved for this manuscript yet. Select Hindi, English, or another supported target above and generate one.</div> : null}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
              <div>
                <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ background: '#4A3424', color: '#F1E4C3' }}>Source OCR text · {languageName(selectedTranslation?.sourceLanguage || sourceLanguage)}</div>
                <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap overflow-auto" style={{ border: '1px solid rgba(176,138,69,0.3)', borderTop: 'none', background: '#FDF6E7', color: '#4A3424', minHeight: 300, maxHeight: 560, fontFamily: 'var(--font-mono)' }}>{sourceText || 'No OCR text is available for this manuscript.'}</div>
              </div>
              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 px-4 py-3" style={{ background: '#17233C', color: '#F1E4C3' }}>
                  <span className="text-xs font-semibold uppercase tracking-wider">{selectedTranslation ? selectedTranslation.languageName : 'Translation output'}</span>
                  {selectedTranslation && <span className="text-[10px] px-2 py-1" style={{ background: 'rgba(176,138,69,0.2)', color: '#E3C988' }}>{selectedTranslation.reviewStatus === 'human_edited' ? 'HUMAN EDITED' : 'MACHINE GENERATED'}</span>}
                </div>
                <div className="p-5" style={{ border: '1px solid rgba(176,138,69,0.3)', borderTop: 'none', background: '#FDF6E7', minHeight: 300 }}>
                  {editMode ? <textarea value={editText} onChange={(event) => setEditText(event.target.value)} className="w-full min-h-[260px] text-sm leading-relaxed outline-none resize-y" style={{ background: 'transparent', color: '#29231D' }} /> : <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#29231D' }}>{selectedTranslation?.translatedText || 'Choose a saved translation above, or generate a new language translation.'}</div>}
                </div>
                {selectedTranslation && !selectedTranslation.isCurrent && <p className="text-xs mt-2" style={{ color: '#A85D32' }}>The source OCR text has changed since this translation was created. Regenerate it to keep the translation synchronized.</p>}
                {selectedTranslation && <p className="text-xs mt-2" style={{ color: '#5A4A3A' }}>Engine: {selectedTranslation.engine} · Updated: {selectedTranslation.updatedAt || 'Not recorded'}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {selectedTranslation && !editMode && <>
                <button onClick={copyTranslation} className="px-5 py-2.5 text-sm font-semibold" style={buttonStyle}>Copy translation</button>
                <button onClick={downloadTranslation} className="px-5 py-2.5 text-sm font-semibold" style={outlineStyle}>Download .txt</button>
                <button onClick={startEditing} disabled={!selectedTranslation.isCurrent} className="px-5 py-2.5 text-sm font-semibold disabled:opacity-40" style={outlineStyle}>Edit translation</button>
              </>}
              {editMode && <>
                <button onClick={saveEdit} disabled={saving} className="px-5 py-2.5 text-sm font-semibold disabled:opacity-50" style={buttonStyle}>{saving ? 'Saving…' : 'Save reviewed translation'}</button>
                <button onClick={() => setEditMode(false)} className="px-5 py-2.5 text-sm" style={outlineStyle}>Cancel</button>
              </>}
              <button onClick={() => navigate('ocr', selectedManuscript)} className="px-5 py-2.5 text-sm ml-auto" style={outlineStyle}>Review OCR source →</button>
            </div>

            <div className="flex items-start gap-3 px-5 py-4" style={{ background: 'rgba(168,93,50,0.06)', border: '1px solid rgba(168,93,50,0.25)' }}>
              <span style={{ color: '#A85D32' }}>⚠</span>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#A85D32' }}>Machine translation requires scholarly review</p>
                <p className="text-xs leading-relaxed" style={{ color: '#5A4A3A' }}>IndicTrans2 generates meaning-oriented translations. It cannot guarantee exact word-for-word equivalence, especially for historical Sanskrit, damaged OCR, rare terminology, or culturally specific passages. The source OCR is retained unchanged; review and edit the translation before using it as an authoritative text.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

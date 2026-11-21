import { useEffect, useState } from 'react';
import { useNav } from '../App';
import { getManuscript, saveManuscriptText, setVerificationStatus, type RepositoryManuscript } from '../api';

type OcrState = 'default' | 'editing' | 'verified' | 'review' | 'copied' | 'downloaded';

export default function OCR() {
  const { navigate, selectedManuscript } = useNav();
  const [state, setState] = useState<OcrState>('default');
  const [manuscript, setManuscript] = useState<RepositoryManuscript | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getManuscript(selectedManuscript)
      .then((record) => {
        if (!active) return;
        setManuscript(record);
        setEditText(record.cleanedText || record.verifiedText || record.rawOcrText || '');
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load the OCR record.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedManuscript]);

  const refreshRecord = async () => {
    const fresh = await getManuscript(selectedManuscript);
    setManuscript(fresh);
    setEditText(fresh.cleanedText || fresh.verifiedText || fresh.rawOcrText || '');
  };

  const handleSave = async () => {
    if (!manuscript) return;
    setSaving(true); setError(''); setNotice('');
    try {
      await saveManuscriptText(manuscript.id, { cleanedText: editText });
      await refreshRecord();
      setState('default');
      setNotice('Corrected OCR text saved to the manuscript repository.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save OCR text.');
    } finally { setSaving(false); }
  };

  const handleApprove = async () => {
    if (!manuscript) return;
    setSaving(true); setError(''); setNotice('');
    try {
      await saveManuscriptText(manuscript.id, { cleanedText: editText });
      await setVerificationStatus(manuscript.id, 'Verified', editText);
      await refreshRecord();
      setState('verified');
      setNotice('OCR text saved and marked as verified.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify this OCR result.');
    } finally { setSaving(false); }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(editText);
      setState('copied');
      window.setTimeout(() => setState('default'), 1800);
    } catch {
      setError('Clipboard access was blocked by the browser. You can select and copy the text manually.');
    }
  };

  const handleDownload = () => {
    if (!manuscript) return;
    const blob = new Blob([editText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${manuscript.id}-ocr.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setState('downloaded');
    window.setTimeout(() => setState('default'), 1800);
  };

  if (loading) return <div className="p-10 text-sm" style={{ color: '#5A4A3A' }}>Loading OCR result from the repository…</div>;
  if (!manuscript) return <div className="p-10"><p className="text-sm mb-4" style={{ color: '#A85D32' }}>{error || 'Manuscript record not found.'}</p><button onClick={() => navigate('library')} className="text-sm underline" style={{ color: '#B08A45' }}>Return to Library</button></div>;

  const imageUrl = manuscript.imageUrls.enhanced;
  const hasText = !!(manuscript.rawOcrText || manuscript.cleanedText || manuscript.verifiedText);
  const currentText = editText;

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Module 2 · OCR Result</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>OCR / Text Extraction</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>{manuscript.id} · {manuscript.originalFilename} · Tesseract Sanskrit + Devanagari</p>
      </div>

      {state === 'verified' && (
        <div className="mx-10 mt-5 px-5 py-3.5 flex items-center gap-3" style={{ background: 'rgba(63,89,69,0.1)', border: '1.5px solid rgba(63,89,69,0.4)' }}>
          <span style={{ color: '#3F5945', fontSize: 18 }}>✓</span>
          <p className="text-sm font-semibold" style={{ color: '#3F5945' }}>OCR output saved and marked as Verified in the repository.</p>
        </div>
      )}

      {state === 'review' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(23,35,60,0.7)' }} onClick={() => setState('default')}>
          <div className="w-[500px] max-w-[calc(100vw-2rem)] p-8" style={{ background: '#FDF6E7', border: '2px solid rgba(176,138,69,0.5)' }} onClick={(event) => event.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold mb-4" style={{ color: '#17233C' }}>Flag for Expert Review</h3>
            <div className="mb-4 p-4" style={{ background: 'rgba(168,93,50,0.08)', border: '1px solid rgba(168,93,50,0.25)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#A85D32' }}>HUMAN VERIFICATION REQUIRED</p>
              <p className="text-sm" style={{ color: '#29231D' }}>This OCR profile does not provide a calibrated confidence score. Please send the extracted text to the Verification Center for manual review.</p>
            </div>
            <textarea placeholder="Describe the issue or area requiring expert attention…" className="w-full h-24 p-3 text-sm resize-none outline-none mb-4" style={{ border: '1px solid rgba(176,138,69,0.35)', background: '#FDF6E7', fontFamily: 'var(--font-body)', color: '#29231D' }} />
            <div className="flex gap-3">
              <button onClick={async () => { try { await saveManuscriptText(manuscript.id, { cleanedText: editText }); await setVerificationStatus(manuscript.id, 'Pending'); setState('default'); navigate('verification'); } catch (err) { setError(err instanceof Error ? err.message : 'Could not submit for review.'); setState('default'); } }} className="px-5 py-2.5 text-sm font-semibold hover:brightness-95" style={{ background: '#A85D32', color: '#FDF6E7' }}>Submit for Review →</button>
              <button onClick={() => setState('default')} className="px-5 py-2.5 text-sm" style={{ border: '1px solid rgba(176,138,69,0.35)', color: '#4A3424' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-10 py-8">
        {error && <div className="px-4 py-3 mb-5 text-sm" role="alert" style={{ color: '#9B2C2C', background: 'rgba(168,93,50,0.08)', border: '1px solid rgba(168,93,50,0.3)' }}>{error}</div>}
        {notice && <div className="px-4 py-3 mb-5 text-sm" style={{ color: '#3F5945', background: 'rgba(63,89,69,0.08)', border: '1px solid rgba(63,89,69,0.25)' }}>{notice}</div>}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{ background: '#17233C', color: '#F1E4C3' }}>Enhanced Manuscript Page</div>
            <div style={{ border: '1px solid rgba(176,138,69,0.3)' }}>
              {imageUrl ? <img src={imageUrl} alt={`Enhanced page ${manuscript.originalFilename}`} className="w-full object-contain" style={{ maxHeight: 540, minHeight: 320, background: '#EEE7D7', borderBottom: '1px solid rgba(176,138,69,0.2)' }} /> : <div className="flex items-center justify-center text-sm" style={{ height: 360, background: '#FDF6E7', color: '#5A4A3A' }}>Enhanced image unavailable.</div>}
              <div className="px-4 py-3" style={{ background: '#FDF6E7' }}>
                <div className="flex gap-3 text-xs flex-wrap" style={{ color: '#5A4A3A' }}><span>Script profile: <strong>{manuscript.script}</strong></span><span>·</span><span>Language profile: <strong>{manuscript.language}</strong></span></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between px-3 py-2" style={{ background: '#17233C' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#F1E4C3' }}>{state === 'editing' ? 'Editing OCR Output' : 'Extracted OCR Output'}</span>
              <span className="font-mono text-[10px] px-2 py-0.5" style={{ background: 'rgba(176,138,69,0.3)', color: '#F1E4C3' }}>{currentText.length.toLocaleString()} characters</span>
            </div>
            <div className="p-5" style={{ border: '1px solid rgba(176,138,69,0.3)', borderTop: 'none', background: '#FDF6E7', minHeight: 420 }}>
              {state === 'editing' ? (
                <textarea value={editText} onChange={(event) => setEditText(event.target.value)} className="w-full h-80 text-sm p-0 resize-y outline-none leading-relaxed" style={{ fontFamily: 'var(--font-mono)', background: 'transparent', color: '#29231D', border: 'none' }} />
              ) : hasText ? (
                <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ fontFamily: 'var(--font-mono)', color: '#29231D' }}>{currentText}</pre>
              ) : (
                <div className="text-sm" style={{ color: '#5A4A3A' }}>No OCR text is stored for this manuscript yet. Run OCR from the Upload page to create an extracted transcription.</div>
              )}
              <div className="mt-4 pt-4 text-[10px]" style={{ borderTop: '1px solid rgba(176,138,69,0.2)', color: '#5A4A3A' }}>
                OCR profile: <strong>Tesseract `san+Devanagari`, `--psm 6`</strong>. No calibrated confidence score is provided by this pipeline. Human verification is recommended.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 flex-wrap">
          {state !== 'verified' && <>
            <button onClick={() => setState(state === 'editing' ? 'default' : 'editing')} className="px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition-all" style={{ background: '#17233C', color: '#F1E4C3' }}>{state === 'editing' ? 'Stop Editing' : 'Edit Text'}</button>
            {state === 'editing' && <button disabled={saving} onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold disabled:opacity-50" style={{ background: '#3F5945', color: '#F1E4C3' }}>{saving ? 'Saving…' : 'Save Corrections'}</button>}
            <button onClick={handleCopy} className="px-5 py-2.5 text-sm font-semibold hover:bg-[#E5D4AD] transition-all" style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Copy</button>
            <button onClick={handleDownload} className="px-5 py-2.5 text-sm font-semibold hover:bg-[#E5D4AD] transition-all" style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Download</button>
            <button disabled={saving || !editText.trim()} onClick={handleApprove} className="px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition-all disabled:opacity-50" style={{ background: '#3F5945', color: '#F1E4C3' }}>{saving ? 'Saving…' : '✓ Approve OCR'}</button>
            <button onClick={() => setState('review')} className="px-5 py-2.5 text-sm hover:bg-red-50 transition-all" style={{ border: '1.5px solid rgba(168,93,50,0.4)', color: '#A85D32' }}>Flag for Review</button>
          </>}
          {state === 'verified' && <button onClick={() => navigate('viewer', manuscript.id)} className="px-6 py-3 text-sm font-semibold hover:brightness-95 transition-all" style={{ background: '#17233C', color: '#F1E4C3' }}>Open Manuscript Viewer →</button>}
          {state === 'copied' && <span className="text-xs font-semibold" style={{ color: '#3F5945' }}>✓ Copied to clipboard</span>}
          {state === 'downloaded' && <span className="text-xs font-semibold" style={{ color: '#8C6C33' }}>✓ OCR text downloaded</span>}
          <button onClick={() => navigate('viewer', manuscript.id)} className="px-5 py-2.5 text-sm hover:bg-[#E5D4AD] transition-all" style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Open Manuscript Viewer →</button>
          <button onClick={() => navigate('translation', manuscript.id)} className="px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition-all" style={{ background: '#3F5945', color: '#F1E4C3' }}>Translate Manuscript →</button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNav } from '../App';
import {
  getVerificationQueue,
  getVerificationSummary,
  getManuscript,
  saveManuscriptText,
  setVerificationStatus,
  type RepositoryManuscript,
} from '../api';

export default function Verification() {
  const { navigate } = useNav();
  const [queue, setQueue] = useState<RepositoryManuscript[]>([]);
  const [selected, setSelected] = useState<RepositoryManuscript | null>(null);
  const [ocr, setOcr] = useState('');
  const [summary, setSummary] = useState({ pendingReview: 0, verified: 0, pendingVerification: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = async () => {
    const [nextQueue, nextSummary] = await Promise.all([getVerificationQueue(), getVerificationSummary()]);
    setQueue(nextQueue.items);
    setSummary(nextSummary);
  };

  useEffect(() => {
    let active = true;
    Promise.all([getVerificationQueue(), getVerificationSummary()])
      .then(([nextQueue, nextSummary]) => {
        if (!active) return;
        setQueue(nextQueue.items);
        setSummary(nextSummary);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load review queue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const open = async (manuscript: RepositoryManuscript) => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const full = await getManuscript(manuscript.id);
      setSelected(full);
      setOcr(full.cleanedText || full.verifiedText || full.rawOcrText || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open manuscript.');
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    if (!selected) return;
    if (!ocr.trim()) {
      setError('Enter or correct the OCR text before saving.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await saveManuscriptText(selected.id, { cleanedText: ocr });
      setSelected(await getManuscript(selected.id));
      setNotice('OCR corrections saved. The manuscript remains pending review.');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save corrections.');
    } finally {
      setSaving(false);
    }
  };

  const openTranslation = async () => {
    if (!selected) return;
    if (!ocr.trim()) {
      setError('Save or enter the OCR text before opening translation.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Persist the reviewed OCR source first so the translation workspace uses this exact text.
      await saveManuscriptText(selected.id, { cleanedText: ocr });
      navigate('translation', selected.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save OCR text before translation.');
      setSaving(false);
    }
  };

  const verify = async () => {
    if (!selected) return;
    if (!ocr.trim()) {
      setError('Enter or correct the OCR text before marking this manuscript verified.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await saveManuscriptText(selected.id, { cleanedText: ocr });
      await setVerificationStatus(selected.id, 'Verified', ocr);
      const id = selected.id;
      setSelected(null);
      setNotice(`${id} has been marked verified.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify manuscript.');
    } finally {
      setSaving(false);
    }
  };

  const reject = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await setVerificationStatus(selected.id, 'Rejected');
      const id = selected.id;
      setSelected(null);
      setNotice(`${id} was returned for further processing.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Quality Assurance</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Verification Center</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Review and save OCR corrections before marking records as expert verified.</p>
      </div>

      <div className="px-10 py-8">
        {error && <div className="mb-5 px-4 py-3 text-sm whitespace-pre-wrap" role="alert" style={{ background: 'rgba(168,93,50,0.08)', border: '1px solid rgba(168,93,50,0.3)', color: '#8C3F20' }}>{error}</div>}
        {notice && <div className="mb-5 px-4 py-3 text-sm" role="status" style={{ background: 'rgba(63,89,69,0.08)', border: '1px solid rgba(63,89,69,0.3)', color: '#31583B' }}>{notice}</div>}

        <div className="grid grid-cols-3 gap-5 mb-8">
          {[{ label: 'Pending Review', value: summary.pendingReview, color: '#A85D32' }, { label: 'Verified', value: summary.verified, color: '#3F5945' }, { label: 'Pending Verification', value: summary.pendingVerification, color: '#B08A45' }].map((item) => (
            <div key={item.label} className="px-5 py-4 text-center" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
              <div className="font-display text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value.toLocaleString()}</div>
              <div className="text-xs" style={{ color: '#5A4A3A' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {!selected ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold" style={{ color: '#17233C' }}>Manuscripts Requiring Review</h2>
              <span className="text-xs" style={{ color: '#5A4A3A' }}>{queue.length} in queue</span>
            </div>
            {loading ? (
              <p className="py-12 text-center text-sm" style={{ color: '#5A4A3A' }}>Loading verification queue…</p>
            ) : queue.length === 0 ? (
              <div className="p-8 text-center" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
                <div className="text-3xl mb-3" style={{ color: '#B08A45' }}>✓</div>
                <h3 className="font-display text-lg font-semibold mb-2" style={{ color: '#17233C' }}>No manuscripts currently eligible for review</h3>
                <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: '#5A4A3A' }}>The review queue contains records that have OCR text and are still pending verification. Preprocessed image records do not enter this queue until extracted or corrected text is saved.</p>
                <button onClick={() => navigate('library')} className="mt-5 px-5 py-2.5 text-sm font-semibold" style={{ background: '#17233C', color: '#F1E4C3' }}>Browse Manuscripts</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {queue.map((manuscript) => (
                  <div key={manuscript.id} className="flex items-center gap-5 p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(168,93,50,0.3)' }}>
                    <img src={manuscript.thumbnail || undefined} alt={manuscript.title} className="w-20 h-20 object-cover" style={{ background: '#E5D4AD' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono text-sm font-semibold" style={{ color: '#B08A45' }}>{manuscript.id}</span>
                        <span className="text-[10px] px-2 py-0.5 font-mono" style={{ background: 'rgba(168,93,50,0.1)', color: '#A85D32' }}>PENDING REVIEW</span>
                      </div>
                      <div className="font-display text-base font-semibold mb-1" style={{ color: '#17233C' }}>{manuscript.title}</div>
                      <div className="flex gap-5 text-xs flex-wrap" style={{ color: '#5A4A3A' }}>
                        <span>Script: <strong>{manuscript.script}</strong></span>
                        <span>Language: <strong>{manuscript.language}</strong></span>
                        <span>File: <strong>{manuscript.originalFilename}</strong></span>
                      </div>
                    </div>
                    <button disabled={saving} onClick={() => open(manuscript)} className="px-5 py-2.5 text-sm font-semibold disabled:opacity-50" style={{ background: '#17233C', color: '#F1E4C3' }}>Review →</button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <button onClick={() => setSelected(null)} className="text-xs hover:underline mb-2" style={{ color: '#B08A45' }}>← Review Queue</button>
                <h2 className="font-display text-2xl font-semibold" style={{ color: '#17233C' }}>Reviewing: {selected.title}</h2>
                <p className="text-sm mt-1" style={{ color: '#5A4A3A' }}>{selected.id} · {selected.script} · {selected.language} · {selected.originalFilename}</p>
              </div>
              <span className="font-mono text-[10px] px-3 py-1.5" style={{ background: 'rgba(168,93,50,0.1)', color: '#A85D32', border: '1px solid rgba(168,93,50,0.3)' }}>PENDING REVIEW</span>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{ background: '#17233C', color: '#F1E4C3' }}>Binary Image</div>
                {selected.imageUrls.binary ? <img src={selected.imageUrls.binary} alt="Binary manuscript" className="w-full object-contain" style={{ maxHeight: 420, background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }} /> : <div className="p-10 text-xs" style={{ background: '#FDF6E7', color: '#5A4A3A' }}>Image unavailable</div>}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{ background: '#4A3424', color: '#F1E4C3' }}>Corrected OCR Text</div>
                <textarea value={ocr} onChange={(event) => setOcr(event.target.value)} rows={17} placeholder="Enter reviewed transcription here." className="w-full p-4 text-xs outline-none resize-y" style={{ minHeight: 420, border: '1px solid rgba(176,138,69,0.25)', background: '#FDF6E7', fontFamily: 'var(--font-mono)', color: '#29231D' }} />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button disabled={saving} onClick={save} className="px-5 py-2.5 text-sm font-semibold disabled:opacity-50" style={{ border: '1px solid rgba(176,138,69,0.5)', color: '#4A3424', background: '#FDF6E7' }}>{saving ? 'Saving…' : 'Save Corrections'}</button>
              <button disabled={saving || !ocr.trim()} onClick={openTranslation} className="px-5 py-2.5 text-sm font-semibold disabled:opacity-50" style={{ background: '#17233C', color: '#F1E4C3' }}>Save & Open Translation →</button>
              <button disabled={saving || !ocr.trim()} onClick={verify} className="px-6 py-2.5 text-sm font-semibold disabled:opacity-50" style={{ background: '#3F5945', color: '#F1E4C3' }}>✓ Mark as Verified</button>
              <button disabled={saving} onClick={reject} className="ml-auto px-5 py-2.5 text-sm disabled:opacity-50" style={{ border: '1.5px solid rgba(168,93,50,0.4)', color: '#A85D32' }}>Reject / Send Back ↩</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

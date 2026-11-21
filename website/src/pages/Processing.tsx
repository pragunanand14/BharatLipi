import { useEffect, useRef, useState } from 'react';
import { useNav } from '../App';
import { getProcessingJob, ProcessingJob } from '../api';
import { getSettings } from '../preferences';

const PIPELINE = [
  { label: 'Upload Validation', desc: 'Validate files and safely expand the uploaded bundle' },
  { label: 'Image Preprocessing', desc: 'Grayscale, Gaussian blur, CLAHE contrast enhancement and adaptive thresholding' },
  { label: 'OCR / Text Extraction', desc: 'Tesseract Sanskrit + Devanagari OCR using page segmentation mode 6' },
  { label: 'Text Normalization', desc: 'Apply the Module 2 Unicode, noise, replacement and whitespace corrections' },
  { label: 'Repository Registration', desc: 'Save each processed page, image variants and OCR text to SQLite' },
  { label: 'Machine Translation', desc: 'Translate the extracted text into the selected languages and store each language version' },
];

function stageIndex(stage: string) {
  const value = stage.toLowerCase();
  if (value.includes('validat') || value.includes('queued')) return 0;
  if (value.includes('extract') || value.includes('loading')) return 0;
  if (value.includes('preprocess') || value.includes('prepar')) return 1;
  if (value.includes('ocr')) return 2;
  if (value.includes('normaliz')) return 3;
  if (value.includes('saving') || value.includes('repository')) return 4;
  if (value.includes('translat')) return 5;
  return 0;
}

export default function Processing() {
  const { navigate, activeJobId } = useNav();
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [loadError, setLoadError] = useState('');
  const notifiedJob = useRef<string | null>(null);

  useEffect(() => {
    if (!activeJobId) {
      setJob(null);
      return;
    }
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const latest = await getProcessingJob(activeJobId);
        if (cancelled) return;
        setJob(latest);
        setLoadError('');
        const finished = ['completed', 'completed_with_errors', 'failed'].includes(latest.status);
        if (!finished) timer = window.setTimeout(poll, 900);
      } catch (error) {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : 'Could not retrieve processing status.');
        timer = window.setTimeout(poll, 1800);
      }
    };
    poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [activeJobId]);

  useEffect(() => {
    if (!job || !['completed', 'completed_with_errors', 'failed'].includes(job.status) || notifiedJob.current === job.jobId) return;
    notifiedJob.current = job.jobId;
    const preferences = getSettings();
    if (preferences.notifyOnCompletion && 'Notification' in window && Notification.permission === 'granted') {
      const body = `${job.completedPages} page(s) processed${job.translationLanguages?.length ? ` · ${job.translationLanguages.length} translation target(s) selected` : ''}.`;
      new Notification('BharatLipi processing finished', { body });
    }
  }, [job]);


  if (!activeJobId) {
    return (
      <div className="min-h-full px-10 py-10" style={{ fontFamily: 'var(--font-body)' }}>
        <h1 className="font-display text-3xl font-semibold mb-3" style={{ color: '#17233C' }}>Processing Center</h1>
        <p className="text-sm mb-5" style={{ color: '#5A4A3A' }}>No active upload job is selected.</p>
        <button onClick={() => navigate('upload')} className="px-6 py-3 text-sm font-semibold" style={{ background: '#17233C', color: '#F1E4C3' }}>Upload a Manuscript →</button>
      </div>
    );
  }

  const finished = !!job && ['completed', 'completed_with_errors', 'failed'].includes(job.status);
  const currentStage = job?.currentStage || 'Connecting to OCR processing service';
  const activeStage = stageIndex(currentStage);
  const progress = Math.max(0, Math.min(100, job?.progress || 0));
  const firstResult = job?.results.find((result) => result.manuscriptId);

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Live Workflow</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Digitizing Manuscript Bundle</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Job {activeJobId} · {job?.totalFiles ?? '—'} uploaded file(s) · {job?.totalPages ?? 'discovering'} page(s)</p>
      </div>

      <div className="px-10 py-8 grid grid-cols-3 gap-8">
        <div>
          <div className="p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }}>
            <div className="w-14 h-14 flex items-center justify-center mb-4" style={{ background: 'rgba(176,138,69,0.08)', border: '1px solid rgba(176,138,69,0.35)' }}>
              <span className="text-2xl" style={{ color: '#B08A45' }}>▤</span>
            </div>
            <div className="font-display text-base font-semibold mb-1" style={{ color: '#17233C' }}>Current page</div>
            <div className="font-mono text-xs break-all mb-3" style={{ color: '#8C6C33' }}>{job?.currentFile || 'Waiting for the worker…'}</div>
            <div className="flex justify-between text-xs mb-1" style={{ color: '#5A4A3A' }}><span>Page progress</span><strong>{job?.completedPages ?? 0} / {job?.totalPages || 0}</strong></div>
            <div className="h-2 w-full" style={{ background: 'rgba(176,138,69,0.15)' }}><div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: finished ? '#3F5945' : '#B08A45' }} /></div>
            <div className="flex justify-between text-xs mt-2" style={{ color: '#5A4A3A' }}><span>Overall progress</span><strong style={{ color: '#B08A45' }}>{progress}%</strong></div>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(176,138,69,0.2)' }}>
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8C6C33' }}>Current operation</div>
              <div className="text-sm font-semibold" style={{ color: '#17233C' }}>{currentStage}</div>
              <div className="text-xs mt-1" style={{ color: '#5A4A3A' }}>{job?.status === 'queued' ? 'The job is waiting to start.' : job?.status === 'processing' ? 'Status is refreshed from the backend every second.' : job?.status === 'failed' ? 'The job stopped because of an error.' : 'The backend has finished the processing job.'}</div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          {loadError && <div className="px-4 py-3 mb-4 text-sm" role="alert" style={{ color: '#9B2C2C', background: 'rgba(168,93,50,0.08)', border: '1px solid rgba(168,93,50,0.3)' }}>{loadError}</div>}
          <div className="flex flex-col gap-3">
            {PIPELINE.map((step, index) => {
              const translationSkipped = index === 5 && !(job?.translationLanguages?.length);
              const state = translationSkipped ? 'skipped' : finished ? (job?.status === 'failed' && index >= activeStage ? 'pending' : 'done') : index < activeStage ? 'done' : index === activeStage ? 'processing' : 'pending';
              return (
                <div key={step.label} className="flex items-start gap-4 px-5 py-4" style={{ background: state === 'done' ? 'rgba(63,89,69,0.06)' : state === 'processing' ? 'rgba(176,138,69,0.08)' : '#FDF6E7', border: `1px solid ${state === 'done' ? 'rgba(63,89,69,0.25)' : state === 'processing' ? 'rgba(176,138,69,0.4)' : 'rgba(176,138,69,0.2)'}` }}>
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: state === 'done' ? 'rgba(63,89,69,0.15)' : state === 'processing' ? 'rgba(176,138,69,0.15)' : 'rgba(176,138,69,0.07)', border: `1px solid ${state === 'done' ? 'rgba(63,89,69,0.3)' : state === 'processing' ? 'rgba(176,138,69,0.4)' : 'rgba(176,138,69,0.2)'}` }}>
                    {state === 'done' ? <span style={{ color: '#3F5945' }}>✓</span> : state === 'processing' ? <span className="pulse-soft" style={{ color: '#B08A45' }}>●</span> : state === 'skipped' ? <span style={{ color: '#8C6C33' }}>—</span> : <span style={{ color: 'rgba(176,138,69,0.4)' }}>○</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5"><span className="text-sm font-semibold" style={{ color: state === 'done' ? '#3F5945' : state === 'processing' ? '#4A3424' : '#5A4A3A' }}>{step.label}</span><span className="text-[10px] font-mono font-semibold px-2 py-0.5" style={{ color: state === 'done' ? '#3F5945' : state === 'processing' ? '#B08A45' : '#5A4A3A', background: state === 'done' ? 'rgba(63,89,69,0.1)' : state === 'processing' ? 'rgba(176,138,69,0.1)' : 'rgba(176,138,69,0.05)' }}>{state === 'done' ? 'COMPLETED' : state === 'processing' ? 'PROCESSING' : state === 'skipped' ? 'SKIPPED' : 'PENDING'}</span></div>
                    <p className="text-xs" style={{ color: '#5A4A3A' }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {job?.results?.length ? (
            <div className="mt-6 p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }}>
              <div className="flex items-center justify-between mb-3"><h2 className="font-display text-xl font-semibold" style={{ color: '#17233C' }}>Processed manuscript pages</h2><span className="text-xs" style={{ color: '#5A4A3A' }}>{job.results.length} result(s)</span></div>
              <div className="flex flex-col gap-3">
                {job.results.map((result) => (
                  <div key={`${result.pageNumber}-${result.filename}`} className="p-4" style={{ background: 'rgba(176,138,69,0.05)', border: '1px solid rgba(176,138,69,0.18)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><div className="text-sm font-semibold truncate" style={{ color: '#17233C' }}>{result.filename}</div><div className="font-mono text-[11px] mt-1" style={{ color: '#8C6C33' }}>{result.manuscriptId || `Page ${result.pageNumber}`} · {result.characterCount ?? 0} extracted characters</div></div>
                      {result.status === 'completed' ? <span className="text-[10px] font-semibold" style={{ color: '#3F5945' }}>OCR SAVED</span> : <span className="text-[10px] font-semibold" style={{ color: '#A85D32' }}>FAILED</span>}
                    </div>
                    {result.cleanedTextPreview && <p className="text-xs mt-3 line-clamp-3 whitespace-pre-wrap" style={{ color: '#5A4A3A' }}>{result.cleanedTextPreview}</p>}
                    {result.translations?.length ? <div className="mt-3 flex flex-wrap gap-2">{result.translations.map((item) => <span key={item.languageCode} className="text-[10px] px-2 py-1" style={{ background: 'rgba(63,89,69,0.1)', color: '#3F5945' }}>✓ {item.languageName} · {item.characterCount} chars</span>)}</div> : null}
                    {result.translationErrors?.length ? <p className="text-xs mt-2 whitespace-pre-wrap" style={{ color: '#A85D32' }}>{result.translationErrors.join('\n')}</p> : null}
                    {result.error && <p className="text-xs mt-2" style={{ color: '#A85D32' }}>{result.error}</p>}
                    {result.manuscriptId && <button onClick={() => navigate('viewer', result.manuscriptId)} className="mt-3 text-xs font-semibold underline" style={{ color: '#17233C' }}>Open manuscript record →</button>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {job?.errors?.length ? <div className="mt-5 p-4" style={{ background: 'rgba(168,93,50,0.07)', border: '1px solid rgba(168,93,50,0.25)' }}><div className="text-sm font-semibold mb-2" style={{ color: '#A85D32' }}>Issues encountered</div>{job.errors.map((message, index) => <p key={index} className="text-xs mb-1" style={{ color: '#5A4A3A' }}>{message}</p>)}</div> : null}

          {finished && (
            <div className="mt-6 p-6" style={{ background: 'rgba(63,89,69,0.08)', border: '1.5px solid rgba(63,89,69,0.35)' }}>
              <div className="font-display text-xl font-semibold mb-2" style={{ color: job?.status === 'failed' ? '#A85D32' : '#3F5945' }}>{job?.status === 'failed' ? 'Processing Failed' : job?.status === 'completed_with_errors' ? 'Processing Completed with Some Errors' : 'OCR Processing Complete'}</div>
              <p className="text-sm mb-4" style={{ color: '#5A4A3A' }}>{job?.completedPages ?? 0} page(s) saved to the repository. {job?.translationLanguages?.length ? `${job.translationLanguages.length} translation target(s) were requested; successful language versions are saved with each record.` : 'No translation targets were selected for this upload.'} OCR text remains available for human review.</p>
              <div className="flex flex-wrap gap-3">
                {firstResult?.manuscriptId && <button onClick={() => navigate('ocr', firstResult.manuscriptId)} className="px-6 py-3 text-sm font-semibold" style={{ background: '#17233C', color: '#F1E4C3' }}>Review OCR Text →</button>}
                {firstResult?.manuscriptId && firstResult.translations?.length ? <button onClick={() => navigate('translation', firstResult.manuscriptId)} className="px-6 py-3 text-sm font-semibold" style={{ background: '#3F5945', color: '#F1E4C3' }}>View Translations →</button> : null}
                <button onClick={() => navigate('library')} className="px-6 py-3 text-sm font-semibold" style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Open Manuscript Library</button>
                <button onClick={() => navigate('upload')} className="px-6 py-3 text-sm font-semibold" style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Process Another Bundle</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

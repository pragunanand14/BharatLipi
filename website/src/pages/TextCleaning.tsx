import { useState } from 'react';
import { useNav } from '../App';
import { RAW_OCR_TEXT, CLEANED_TEXT } from '../data';

type CleanState = 'default' | 'editing' | 'accepted' | 'reverted';

const CORRECTIONS = [
  { type: 'Spacing', before: 'चरक्सं हितायां', after: 'चरकसंहितायां', reason: 'Incorrect word break' },
  { type: 'Spacing', before: 'विमान स्थाने', after: 'विमानस्थाने', reason: 'Erroneous mid-word space' },
  { type: 'Spacing', before: 'त्रिवि धकुक्षीयं', after: 'त्रिविधकुक्षीयं', reason: 'Incorrect word break' },
  { type: 'Spacing', before: 'प्रथ मोऽध्यायः', after: 'प्रथमोऽध्यायः', reason: 'Incorrect word break' },
  { type: 'Duplicate', before: 'वक्ष्याम', after: 'वक्ष्यामि', reason: 'Missing character (visarga)' },
  { type: 'Spacing', before: 'यथाव त्', after: 'यथावत्', reason: 'Erroneous trailing space' },
];

export default function TextCleaning() {
  const { navigate, selectedManuscript } = useNav();
  const [state, setState] = useState<CleanState>('default');
  const [editText, setEditText] = useState(CLEANED_TEXT);

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div
        className="px-10 py-7"
        style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}
      >
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Stage 4 of 8</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Text Cleaning</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Normalizing raw OCR output — spacing, deduplication, segmentation — MS-00421</p>
      </div>

      {state === 'accepted' && (
        <div className="mx-10 mt-5 px-5 py-3.5 flex items-center gap-3" style={{ background: 'rgba(63,89,69,0.1)', border: '1.5px solid rgba(63,89,69,0.4)' }}>
          <span style={{ color: '#3F5945', fontSize: 18 }}>✓</span>
          <p className="text-sm font-semibold" style={{ color: '#3F5945' }}>All 12 corrections accepted — cleaned text approved for translation.</p>
        </div>
      )}

      <div className="px-10 py-8">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Corrections Applied', value: '12', color: '#B08A45' },
            { label: 'Confidence Level', value: 'High', color: '#3F5945' },
            { label: 'Lines Processed', value: '8', color: '#17233C' },
          ].map((s) => (
            <div key={s.label} className="px-5 py-4 text-center" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
              <div className="font-display text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#5A4A3A' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Raw OCR */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-0" style={{ background: '#4A3424', color: '#F1E4C3' }}>
              Raw OCR Output
            </div>
            <div
              className="p-5 text-sm leading-relaxed"
              style={{
                border: '1px solid rgba(176,138,69,0.3)',
                borderTop: 'none',
                background: '#FDF6E7',
                fontFamily: 'var(--font-mono)',
                color: '#5A4A3A',
                minHeight: 280,
              }}
            >
              {RAW_OCR_TEXT.split('\n').map((line, i) => (
                <div key={i} className={i > 0 ? 'mt-1' : ''}>
                  {CORRECTIONS.reduce((el, c) => {
                    if (line.includes(c.before)) {
                      const parts = el.split(c.before);
                      return parts.join(`⟦${c.before}⟧`);
                    }
                    return el;
                  }, line)
                    .split(/⟦(.*?)⟧/)
                    .map((part, j) => {
                      const isError = CORRECTIONS.some(c => c.before === part);
                      return isError ? (
                        <mark key={j} style={{ background: 'rgba(168,93,50,0.2)', color: '#A85D32', textDecoration: 'line-through', fontStyle: 'italic' }}>{part}</mark>
                      ) : <span key={j}>{part || ' '}</span>;
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* Cleaned text */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-0 flex items-center justify-between" style={{ background: '#17233C', color: '#F1E4C3' }}>
              <span>{state === 'editing' ? 'Manual Edit Mode' : 'Cleaned Text'}</span>
              {state !== 'editing' && (
                <span className="font-mono text-[10px] px-2 py-0.5" style={{ background: 'rgba(63,89,69,0.4)', color: '#9ECEAA' }}>AI-CLEANED</span>
              )}
            </div>
            <div
              className="p-5"
              style={{
                border: '1px solid rgba(63,89,69,0.3)',
                borderTop: 'none',
                background: '#FDF6E7',
                minHeight: 280,
              }}
            >
              {state === 'editing' ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full h-60 text-sm resize-none outline-none leading-relaxed"
                  style={{ fontFamily: 'var(--font-mono)', background: 'transparent', color: '#29231D', border: 'none' }}
                />
              ) : (
                <div
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-mono)', color: '#29231D' }}
                >
                  {CLEANED_TEXT.split('\n').map((line, i) => (
                    <div key={i} className={i > 0 ? 'mt-1' : ''}>{line || ' '}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Corrections detail */}
        <div className="mb-6 p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
          <h3 className="font-display text-base font-semibold mb-4" style={{ color: '#17233C' }}>Corrections Applied ({CORRECTIONS.length} of 12 shown)</h3>
          <div className="grid grid-cols-3 gap-3">
            {CORRECTIONS.map((c, i) => (
              <div key={i} className="px-3 py-3" style={{ background: 'rgba(176,138,69,0.05)', border: '1px solid rgba(176,138,69,0.15)' }}>
                <div className="text-[10px] font-mono mb-1.5 px-1.5 py-0.5 inline-block" style={{ background: '#17233C', color: '#B08A45' }}>{c.type.toUpperCase()}</div>
                <div className="text-xs mb-1">
                  <span style={{ color: '#A85D32', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>{c.before}</span>
                  <span className="mx-1.5" style={{ color: '#5A4A3A' }}>→</span>
                  <span style={{ color: '#3F5945', fontFamily: 'var(--font-mono)' }}>{c.after}</span>
                </div>
                <div className="text-[10px]" style={{ color: '#5A4A3A' }}>{c.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {state !== 'accepted' && (
            <>
              <button
                onClick={() => setState('accepted')}
                className="px-6 py-3 text-sm font-semibold hover:brightness-95 transition-all"
                style={{ background: '#3F5945', color: '#F1E4C3' }}
              >
                ✓ Accept Corrections
              </button>
              <button
                onClick={() => setState(state === 'editing' ? 'default' : 'editing')}
                className="px-5 py-3 text-sm font-semibold hover:bg-[#E5D4AD] transition-all"
                style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}
              >
                {state === 'editing' ? 'Save Edits' : 'Edit Manually'}
              </button>
              <button
                onClick={() => setState('reverted')}
                className="px-5 py-3 text-sm hover:bg-red-50 transition-all"
                style={{ border: '1.5px solid rgba(168,93,50,0.35)', color: '#A85D32' }}
              >
                Revert to Raw
              </button>
            </>
          )}
          <button
            onClick={() => navigate('translation', selectedManuscript)}
            className="px-5 py-3 text-sm font-semibold hover:bg-[#E5D4AD] transition-all"
            style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}
          >
            Next: Translation →
          </button>
        </div>
      </div>
    </div>
  );
}

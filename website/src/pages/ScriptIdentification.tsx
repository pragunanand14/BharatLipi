import { useNav } from '../App';

const CANDIDATES = [
  { script: 'Devanagari', confidence: 94.7, color: '#B08A45', primary: true },
  { script: 'Sharada', confidence: 3.1, color: '#5A4A3A', primary: false },
  { script: 'Grantha', confidence: 1.4, color: '#5A4A3A', primary: false },
  { script: 'Other', confidence: 0.8, color: '#5A4A3A', primary: false },
];

const CHARS = [
  { label: 'Writing System', value: 'Brahmic abugida' },
  { label: 'Script Family', value: 'Devanagari (Indo-Aryan)' },
  { label: 'Document Type', value: 'Historical manuscript' },
  { label: 'Writing Mode', value: 'Handwritten / inscribed text' },
  { label: 'Surface Condition', value: 'Degraded, aged parchment' },
  { label: 'Estimated Script Age', value: 'Compatible with 16th century hand' },
  { label: 'Line Orientation', value: 'Horizontal, left-to-right' },
  { label: 'Character Style', value: 'Classical manuscript hand' },
];

const SUPPORTED = [
  'Devanagari', 'Grantha', 'Sharada', 'Telugu', 'Malayalam',
  'Kannada', 'Bengali', 'Odia', 'Tamil', 'Tibetan',
  'Nandinagari', 'Nastaliq', 'Brahmi', 'Sinhala',
];

export default function ScriptIdentification() {
  const { navigate } = useNav();

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div
        className="px-10 py-7"
        style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}
      >
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Stage 2 of 8</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Script Identification</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Extensible multi-script recognition pipeline — MS-00421</p>
      </div>

      <div className="px-10 py-8">
        {/* Primary detection result */}
        <div
          className="flex items-center gap-8 px-8 py-7 mb-8"
          style={{ background: '#FDF6E7', border: '2px solid rgba(176,138,69,0.4)' }}
        >
          <div
            className="w-20 h-20 flex items-center justify-center flex-shrink-0"
            style={{ border: '2px solid #B08A45', background: 'rgba(176,138,69,0.1)' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#17233C', fontWeight: 700 }}>अ</span>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#B08A45' }}>Detected Script</p>
            <h2 className="font-display text-3xl font-bold mb-1" style={{ color: '#17233C' }}>Devanagari</h2>
            <p className="text-sm" style={{ color: '#5A4A3A' }}>Classical manuscript hand · Sanskrit / Hindi / Marathi</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] tracking-wide uppercase mb-1" style={{ color: '#5A4A3A' }}>Identification Confidence</p>
            <p className="font-display text-4xl font-bold" style={{ color: '#3F5945' }}>94.7%</p>
            <span className="font-mono text-[10px] px-2 py-0.5" style={{ background: 'rgba(63,89,69,0.1)', color: '#3F5945', border: '1px solid rgba(63,89,69,0.25)' }}>
              HIGH CONFIDENCE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Confidence visualization */}
          <div className="col-span-1 p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
            <h3 className="font-display text-base font-semibold mb-4" style={{ color: '#17233C' }}>Script Candidates</h3>
            <div className="flex flex-col gap-4">
              {CANDIDATES.map((c) => (
                <div key={c.script}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: c.primary ? '#17233C' : '#5A4A3A', fontWeight: c.primary ? 600 : 400 }}>{c.script}</span>
                    <span className="font-mono" style={{ color: c.primary ? '#B08A45' : '#5A4A3A' }}>{c.confidence}%</span>
                  </div>
                  <div className="h-2" style={{ background: 'rgba(176,138,69,0.12)' }}>
                    <div
                      className="h-full transition-all"
                      style={{ width: `${c.confidence}%`, background: c.primary ? '#B08A45' : 'rgba(90,74,58,0.3)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-5 pt-4"
              style={{ borderTop: '1px solid rgba(176,138,69,0.2)' }}
            >
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#5A4A3A' }}>SUPPORTED SCRIPTS</p>
              <div className="flex flex-wrap gap-1">
                {SUPPORTED.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-1.5 py-0.5"
                    style={{
                      background: s === 'Devanagari' ? '#17233C' : 'rgba(176,138,69,0.08)',
                      color: s === 'Devanagari' ? '#F1E4C3' : '#4A3424',
                      border: '1px solid rgba(176,138,69,0.2)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-[10px] mt-3 italic" style={{ color: '#5A4A3A' }}>
                BharatLipi supports multi-script, multilingual preservation — not limited to any single script.
              </p>
            </div>
          </div>

          {/* Detected characteristics */}
          <div className="col-span-2 p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
            <h3 className="font-display text-base font-semibold mb-4" style={{ color: '#17233C' }}>Detected Characteristics</h3>
            <div className="grid grid-cols-2 gap-0">
              {CHARS.map((c, i) => (
                <div
                  key={c.label}
                  className="flex gap-3 py-3 px-4"
                  style={{
                    borderBottom: '1px solid rgba(176,138,69,0.12)',
                    borderRight: i % 2 === 0 ? '1px solid rgba(176,138,69,0.12)' : 'none',
                  }}
                >
                  <span className="mt-0.5 text-xs flex-shrink-0" style={{ color: '#B08A45' }}>◎</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#5A4A3A' }}>{c.label}</div>
                    <div className="text-sm font-semibold" style={{ color: '#17233C' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-5 px-5 py-4 flex items-start gap-3"
              style={{ background: 'rgba(176,138,69,0.05)', border: '1px solid rgba(176,138,69,0.2)' }}
            >
              <span style={{ color: '#B08A45', fontSize: 16 }}>ℹ</span>
              <p className="text-xs leading-relaxed" style={{ color: '#4A3424' }}>
                <strong>Extensible Multi-Script Recognition Pipeline:</strong> BharatLipi's script identification system is designed to recognize and process manuscripts across the full range of Indian scripts. The pipeline can be extended with additional script models as training data becomes available for under-resourced scripts.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('ocr')}
            className="px-6 py-3 text-sm font-semibold hover:brightness-95 transition-all"
            style={{ background: '#17233C', color: '#F1E4C3' }}
          >
            Continue to OCR →
          </button>
          <button
            onClick={() => navigate('preprocessing')}
            className="px-6 py-3 text-sm hover:bg-[#E5D4AD] transition-all"
            style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}
          >
            ← Image Preprocessing
          </button>
        </div>
      </div>
    </div>
  );
}

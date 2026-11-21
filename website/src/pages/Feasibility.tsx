import { useNav } from '../App';

const CHALLENGES = [
  {
    num: '01',
    title: 'Poor Image Quality',
    problem: 'Faded ink, yellowed and stained surfaces, cracks and physical deterioration reduce OCR accuracy.',
    strategy: 'OpenCV preprocessing pipeline: adaptive thresholding, contrast enhancement (CLAHE), noise reduction, and binarization applied before OCR.',
    icon: '◑',
  },
  {
    num: '02',
    title: 'Limited Script Datasets',
    problem: 'Historical scripts may have limited or no labelled training data for machine learning models.',
    strategy: 'Synthetic data generation and data augmentation techniques to expand training sets for under-resourced scripts.',
    icon: '⊞',
  },
  {
    num: '03',
    title: 'Complex & Archaic Language',
    problem: 'Historical vocabulary, archaic grammatical forms, and period-specific terminology challenge modern translation systems.',
    strategy: 'IndicTrans2 with rule-based terminology support. Expert-in-the-loop verification for high-stakes translations.',
    icon: '◈',
  },
  {
    num: '04',
    title: 'Inaccurate Metadata',
    problem: 'Metadata may be incorrectly inferred when OCR is fragmented or when historical context is ambiguous.',
    strategy: 'Human-in-the-loop expert verification workflow in the BharatLipi Verification Center before archival.',
    icon: '◎',
  },
  {
    num: '05',
    title: 'Large-Scale Search',
    problem: 'Thousands of manuscript records with multi-script text require efficient and accurate search capabilities.',
    strategy: 'Optimized full-text search indexing with structured metadata, enabling keyword, script, and subject-based discovery.',
    icon: '⌕',
  },
];

const SCALE_STEPS = [
  { label: 'Digitization', desc: 'Core OCR + preprocessing pipeline' },
  { label: 'OCR', desc: 'Extended to additional scripts' },
  { label: 'Multilingual Access', desc: 'All major Indian languages' },
  { label: 'Institutional Expansion', desc: 'National archives integration' },
  { label: 'Large-Scale Archive', desc: '10,000+ manuscript capacity' },
  { label: 'Knowledge Discovery', desc: 'Searchable heritage repository' },
];

const PILLARS = [
  { label: 'Modular Architecture', desc: 'Each pipeline stage is independently deployable and replaceable.' },
  { label: 'Cloud-ready Storage', desc: 'Object storage with structured metadata for cost-effective scaling.' },
  { label: 'Expandable Script Support', desc: 'New script models can be added without redesigning the pipeline.' },
  { label: 'Scalable Search', desc: 'Search index designed to handle thousands to millions of records.' },
  { label: 'Continuous Model Improvement', desc: 'Feedback from expert verification improves OCR and translation models over time.' },
];

export default function Feasibility() {
  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Project Assessment</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Feasibility & Scalability</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Challenges identified, strategies defined, and scaling pathway planned.</p>
      </div>

      <div className="px-10 py-8">
        {/* Challenges */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-6" style={{ color: '#17233C' }}>Potential Challenges & Strategies</h2>
          <div className="flex flex-col gap-4">
            {CHALLENGES.map((c) => (
              <div
                key={c.num}
                className="flex gap-6 px-6 py-5"
                style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}
              >
                <div className="flex-shrink-0 w-8 text-right">
                  <span className="font-mono text-2xl font-bold" style={{ color: 'rgba(176,138,69,0.3)' }}>{c.num}</span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-display text-base font-semibold mb-2" style={{ color: '#17233C' }}>{c.title}</h3>
                    <div className="flex items-start gap-2">
                      <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#A85D32' }}>⚠</span>
                      <p className="text-xs leading-relaxed" style={{ color: '#4A3424' }}>
                        <strong style={{ color: '#A85D32' }}>Problem:</strong> {c.problem}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div
                      className="flex items-start gap-2 px-4 py-3 h-full"
                      style={{ background: 'rgba(63,89,69,0.06)', border: '1px solid rgba(63,89,69,0.2)' }}
                    >
                      <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#3F5945' }}>✓</span>
                      <p className="text-xs leading-relaxed" style={{ color: '#29231D' }}>
                        <strong style={{ color: '#3F5945' }}>Strategy:</strong> {c.strategy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scalability */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-6" style={{ color: '#17233C' }}>Scalability Pathway</h2>
          <div className="grid grid-cols-6 gap-0 mb-8">
            {SCALE_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full text-center px-3 py-4 flex flex-col items-center justify-center"
                  style={{
                    background: i === 0 ? '#17233C' : i === SCALE_STEPS.length - 1 ? '#3F5945' : '#FDF6E7',
                    border: `1.5px solid ${i === 0 ? '#17233C' : i === SCALE_STEPS.length - 1 ? '#3F5945' : 'rgba(176,138,69,0.3)'}`,
                    borderRight: i < SCALE_STEPS.length - 1 ? 'none' : undefined,
                    minHeight: 100,
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold mb-1.5"
                    style={{ color: i === 0 ? '#B08A45' : i === SCALE_STEPS.length - 1 ? '#9ECEAA' : '#B08A45' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-display text-[11px] font-semibold text-center leading-tight mb-1"
                    style={{ color: i === 0 || i === SCALE_STEPS.length - 1 ? '#F1E4C3' : '#17233C' }}
                  >
                    {step.label}
                  </span>
                  <span
                    className="text-[9px] text-center leading-tight"
                    style={{ color: i === 0 || i === SCALE_STEPS.length - 1 ? 'rgba(241,228,195,0.5)' : '#5A4A3A' }}
                  >
                    {step.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.label}
                className="p-4"
                style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.2)' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span style={{ color: '#3F5945', fontSize: 12 }}>✓</span>
                  <span className="text-xs font-semibold" style={{ color: '#17233C' }}>{p.label}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: '#5A4A3A' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

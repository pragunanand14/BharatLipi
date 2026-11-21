import { useState } from 'react';
import { useNav } from '../App';

const PIPELINE = [
  {
    label: 'Manuscript Image',
    tech: 'High-resolution scanning',
    purpose: 'Capture physical manuscript at sufficient resolution for OCR processing',
    output: 'TIFF / JPEG scan at 300–600 DPI',
    icon: '◑',
    type: 'input',
  },
  {
    label: 'Image Preprocessing',
    tech: 'Python + OpenCV',
    purpose: 'Enhance image quality — contrast, noise reduction, binarization, background cleanup',
    output: 'Cleaned binary image with enhanced ink visibility',
    icon: '◎',
    type: 'processing',
  },
  {
    label: 'Script Identification',
    tech: 'CNN-based classifier (custom trained)',
    purpose: 'Identify the script used in the manuscript from 14+ supported Indian scripts',
    output: 'Script label + confidence score (e.g. Devanagari 94.7%)',
    icon: '⌘',
    type: 'ml',
  },
  {
    label: 'OCR / Text Extraction',
    tech: 'Transformer-based OCR (fine-tuned)',
    purpose: 'Extract handwritten text from the preprocessed manuscript image',
    output: 'Raw Unicode text in original script',
    icon: '⊞',
    type: 'ml',
  },
  {
    label: 'Text Cleaning',
    tech: 'Python · Rule-based NLP pipeline',
    purpose: 'Normalize OCR output — fix spacing, deduplication, segmentation, punctuation',
    output: 'Cleaned, normalized text ready for translation',
    icon: '◫',
    type: 'processing',
  },
  {
    label: 'Translation',
    tech: 'IndicTrans2',
    purpose: 'Translate extracted text to modern Indian and English target languages',
    output: 'Translated text with confidence score',
    icon: '◈',
    type: 'ml',
  },
  {
    label: 'Cultural Context',
    tech: 'Contextual classification model',
    purpose: 'Identify subject, period, region, and cultural context of the manuscript',
    output: 'Structured metadata: subject, period, keywords',
    icon: '◬',
    type: 'ml',
  },
  {
    label: 'Search Indexing',
    tech: 'Full-text search engine + metadata index',
    purpose: 'Index the extracted text and metadata for discovery and keyword search',
    output: 'Searchable index record',
    icon: '⌕',
    type: 'infra',
  },
  {
    label: 'Digital Archive',
    tech: 'Cloud Storage + structured metadata store',
    purpose: 'Persist the full digitized record — image, OCR, translation, metadata — for long-term access',
    output: 'Archival record with versioning and access controls',
    icon: '◰',
    type: 'infra',
  },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  input: { bg: 'rgba(63,89,69,0.08)', text: '#3F5945', border: 'rgba(63,89,69,0.3)', label: 'INPUT' },
  processing: { bg: 'rgba(176,138,69,0.08)', text: '#8C6C33', border: 'rgba(176,138,69,0.3)', label: 'PROCESSING' },
  ml: { bg: 'rgba(23,35,60,0.06)', text: '#17233C', border: 'rgba(23,35,60,0.2)', label: 'AI / ML' },
  infra: { bg: 'rgba(74,52,36,0.06)', text: '#4A3424', border: 'rgba(74,52,36,0.2)', label: 'INFRASTRUCTURE' },
};

const STACK = [
  { category: 'Core Language', items: ['Python 3.12'] },
  { category: 'Image Processing', items: ['OpenCV', 'Pillow'] },
  { category: 'AI / ML', items: ['PyTorch', 'Transformers (Hugging Face)', 'IndicTrans2', 'Computer Vision CNN'] },
  { category: 'Web Interface', items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS'] },
  { category: 'Storage & Search', items: ['Cloud Object Storage', 'Full-text Search Index', 'Structured Metadata Store'] },
];

export default function TechnicalApproach() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>System Design</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Technical Approach</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>BharatLipi system pipeline — click any stage to view technology and output details.</p>
      </div>

      <div className="px-10 py-8 grid grid-cols-3 gap-8">
        {/* Pipeline */}
        <div className="col-span-2">
          <h2 className="font-display text-lg font-semibold mb-5" style={{ color: '#17233C' }}>Processing Pipeline</h2>
          <div className="flex flex-col gap-2">
            {PIPELINE.map((step, i) => {
              const tc = TYPE_COLORS[step.type];
              const isSelected = selected === i;
              return (
                <div key={i}>
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:brightness-95"
                    style={{
                      background: isSelected ? '#17233C' : '#FDF6E7',
                      border: `1.5px solid ${isSelected ? '#17233C' : 'rgba(176,138,69,0.25)'}`,
                    }}
                    onClick={() => setSelected(isSelected ? null : i)}
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? 'rgba(176,138,69,0.2)' : tc.bg,
                        border: `1px solid ${isSelected ? 'rgba(176,138,69,0.5)' : tc.border}`,
                      }}
                    >
                      <span style={{ color: isSelected ? '#B08A45' : tc.text, fontSize: 14 }}>{step.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-semibold text-sm"
                          style={{ color: isSelected ? '#F1E4C3' : '#17233C' }}
                        >
                          {step.label}
                        </span>
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.5"
                          style={{
                            background: isSelected ? 'rgba(176,138,69,0.2)' : tc.bg,
                            color: isSelected ? '#B08A45' : tc.text,
                            border: `1px solid ${isSelected ? 'rgba(176,138,69,0.4)' : tc.border}`,
                          }}
                        >
                          {tc.label}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: isSelected ? 'rgba(241,228,195,0.6)' : '#5A4A3A' }}>
                        {step.tech}
                      </p>
                    </div>
                    <span style={{ color: isSelected ? '#B08A45' : '#5A4A3A', fontSize: 12 }}>{isSelected ? '▲' : '▼'}</span>
                  </button>

                  {isSelected && (
                    <div className="px-5 py-4 flex flex-col gap-3" style={{ background: 'rgba(23,35,60,0.04)', border: '1.5px solid #17233C', borderTop: 'none' }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#B08A45' }}>Technology</p>
                        <p className="text-sm font-semibold" style={{ color: '#17233C' }}>{step.tech}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#B08A45' }}>Purpose</p>
                        <p className="text-sm" style={{ color: '#29231D' }}>{step.purpose}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#B08A45' }}>Example Output</p>
                        <p className="text-sm font-mono px-3 py-2" style={{ background: '#FDF6E7', color: '#4A3424', border: '1px solid rgba(176,138,69,0.2)' }}>
                          {step.output}
                        </p>
                      </div>
                    </div>
                  )}

                  {i < PIPELINE.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="h-4 w-px" style={{ background: 'rgba(176,138,69,0.4)' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-col gap-5">
          <div className="p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
            <h3 className="font-display text-base font-semibold mb-4" style={{ color: '#17233C' }}>Technology Stack</h3>
            <div className="flex flex-col gap-4">
              {STACK.map((s) => (
                <div key={s.category}>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: '#B08A45' }}>{s.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] px-2 py-1"
                        style={{ background: '#17233C', color: '#F1E4C3', fontFamily: 'var(--font-mono)' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
            <h3 className="font-display text-base font-semibold mb-3" style={{ color: '#17233C' }}>AI / ML Capabilities</h3>
            {[
              'Computer Vision — Image preprocessing',
              'Multi-script recognition (14+ scripts)',
              'Transformer-based historical OCR',
              'IndicTrans2 — Multilingual translation',
              'Contextual classification and tagging',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 py-2" style={{ borderBottom: '1px solid rgba(176,138,69,0.1)' }}>
                <span style={{ color: '#3F5945', fontSize: 12, marginTop: 2 }}>✓</span>
                <span className="text-xs" style={{ color: '#29231D' }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="p-4" style={{ background: 'rgba(23,35,60,0.05)', border: '1px solid rgba(23,35,60,0.15)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#17233C' }}>Technology Note</p>
            <p className="text-xs leading-relaxed" style={{ color: '#5A4A3A' }}>
              BharatLipi does not use proprietary translation engines. All AI/ML components are open-source or purpose-built. The IndicTrans2 model is developed by AI4Bharat for Indian language translation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

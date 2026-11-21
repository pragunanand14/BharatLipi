import { useNav } from '../App';

const IMPACT_AREAS = [
  {
    icon: '◰',
    label: 'Cultural Preservation',
    headline: 'Digitally safeguard fragile manuscripts',
    desc: 'BharatLipi creates permanent digital records of physical manuscripts that are vulnerable to deterioration, damage, and loss. Digital preservation reduces dependence on physical access to fragile originals.',
    points: ['Permanent digital archival records', 'Reduced physical handling of originals', 'Disaster-resilient knowledge storage', 'Multi-site digital redundancy'],
    color: '#B08A45',
  },
  {
    icon: '◈',
    label: 'Accessibility',
    headline: 'Make manuscript knowledge readable across languages',
    desc: 'By combining OCR with multilingual translation, BharatLipi makes manuscripts legible to scholars and researchers who may not read the original script or language of the document.',
    points: ['Multilingual translation support', 'Script-agnostic text extraction', 'Accessible digital text format', 'Screen-reader compatible output'],
    color: '#3F5945',
  },
  {
    icon: '⌕',
    label: 'Research & Discovery',
    headline: 'Enable keyword-based search across collections',
    desc: 'The integrated search system allows researchers, historians, and students to find relevant manuscripts by keyword, subject, script, period, or region — enabling cross-collection discovery that was previously impossible.',
    points: ['Full-text keyword search', 'Cross-script, cross-language discovery', 'Subject and period filtering', 'Manuscript ID direct lookup'],
    color: '#17233C',
  },
  {
    icon: '◬',
    label: 'Digital Heritage',
    headline: 'Build a scalable knowledge archive for the future',
    desc: 'BharatLipi provides a structured, scalable digital infrastructure for India\'s manuscript heritage — accessible to researchers, institutions, students, and the broader public.',
    points: ['Scalable to national archive scale', 'Open to institutional integration', 'Educational resource potential', 'Long-term heritage preservation'],
    color: '#A85D32',
  },
];

const FLOW = [
  'PRESERVE THE PAST',
  'UNDERSTAND THE KNOWLEDGE',
  'MAKE IT ACCESSIBLE TO THE FUTURE',
];

export default function Impact() {
  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Value Proposition</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Impact & Benefits</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>BharatLipi's contribution to India's cultural and intellectual heritage.</p>
      </div>

      <div className="px-10 py-8">
        {/* Four impact areas */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          {IMPACT_AREAS.map((area) => (
            <div
              key={area.label}
              className="p-6"
              style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: `${area.color}18`, border: `1.5px solid ${area.color}50` }}
                >
                  <span style={{ color: area.color, fontSize: 16 }}>{area.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: area.color }}>Impact Area</p>
                  <h3 className="font-display text-lg font-semibold" style={{ color: '#17233C' }}>{area.label}</h3>
                </div>
              </div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#29231D' }}>{area.headline}</h4>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#5A4A3A' }}>{area.desc}</p>
              <div className="pt-3" style={{ borderTop: '1px solid rgba(176,138,69,0.15)' }}>
                {area.points.map((point) => (
                  <div key={point} className="flex items-center gap-2 py-1">
                    <span style={{ color: area.color, fontSize: 10 }}>●</span>
                    <span className="text-xs" style={{ color: '#4A3424' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Central statement */}
        <div
          className="py-12 px-8"
          style={{ background: '#17233C', border: '1px solid rgba(176,138,69,0.3)', position: 'relative', overflow: 'hidden' }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #B08A45 0%, transparent 60%), radial-gradient(circle at 80% 50%, #F1E4C3 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10 text-center">
            <p className="text-[10px] tracking-[0.25em] uppercase mb-8" style={{ color: '#B08A45' }}>The BharatLipi Vision</p>
            <div className="flex items-center justify-center gap-0">
              {FLOW.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className="px-6 py-5 text-center"
                    style={{
                      border: '1.5px solid rgba(176,138,69,0.4)',
                      background: 'rgba(176,138,69,0.06)',
                      minWidth: 200,
                    }}
                  >
                    <span className="font-display text-base font-semibold" style={{ color: '#F1E4C3' }}>{step}</span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <div className="flex flex-col items-center mx-4">
                      <div className="w-px h-6" style={{ background: 'rgba(176,138,69,0.4)' }} />
                      <span style={{ color: '#B08A45' }}>↓</span>
                      <div className="w-px h-6" style={{ background: 'rgba(176,138,69,0.4)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm italic" style={{ color: 'rgba(241,228,195,0.5)', fontFamily: 'var(--font-display)' }}>
              "Preserving the written heritage of the past for the researchers of tomorrow."
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Manuscripts Catalogued', value: '1,284' },
            { label: 'Scripts Supported', value: '14+' },
            { label: 'Target Languages', value: '8+' },
            { label: 'Expert Reviews Completed', value: '847' },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 py-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.2)' }}>
              <div className="font-display text-2xl font-bold mb-1" style={{ color: '#B08A45' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#5A4A3A' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

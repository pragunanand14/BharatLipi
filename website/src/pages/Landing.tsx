import { useEffect, useState } from 'react';
import { useNav } from '../App';
import { getDashboard, DashboardData } from '../api';
import { HERO_IMAGES } from '../data';

const STEPS = [
  { label: 'MANUSCRIPT', sub: 'Historical source' },
  { label: 'DIGITIZATION', sub: 'High-resolution imaging' },
  { label: 'OCR', sub: 'Script extraction' },
  { label: 'TRANSLATION', sub: 'IndicTrans2 engine' },
  { label: 'CONTEXT', sub: 'Cultural classification' },
  { label: 'DISCOVERY', sub: 'Searchable knowledge' },
];

export default function Landing() {
  const { navigate } = useNav();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  useEffect(() => { getDashboard().then(setDashboard).catch(() => setDashboard(null)); }, []);
  const stats = [
    { value: dashboard ? dashboard.total.toLocaleString() : '—', label: 'Manuscripts Catalogued' },
    { value: dashboard ? dashboard.processed.toLocaleString() : '—', label: 'Digitizations Completed' },
    { value: dashboard ? dashboard.translated.toLocaleString() : '—', label: 'Manuscripts Translated' },
    { value: dashboard ? dashboard.searchable.toLocaleString() : '—', label: 'Searchable Records' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#17233C', fontFamily: 'var(--font-body)' }}
    >
      {/* Header bar */}
      <header
        className="flex items-center justify-between px-10 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(176,138,69,0.25)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ border: '1.5px solid #B08A45', background: 'rgba(176,138,69,0.12)' }}
          >
            <span style={{ color: '#B08A45', fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700 }}>भ</span>
          </div>
          <div>
            <div className="font-display font-bold text-xl tracking-wide" style={{ color: '#F1E4C3' }}>
              BharatLipi
            </div>
            <div className="text-[9px] tracking-[0.18em] uppercase" style={{ color: '#B08A45' }}>
              Ancient Knowledge, Digitally Preserved.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {['Dashboard', 'Manuscripts', 'Search', 'Archive'].map((item) => (
              <button
                key={item}
                className="text-sm hover:opacity-100 transition-opacity"
                style={{ color: 'rgba(241,228,195,0.5)', fontFamily: 'var(--font-body)' }}
                onClick={() => {
                  if (item === 'Dashboard') navigate('dashboard');
                  else if (item === 'Manuscripts') navigate('library');
                  else if (item === 'Search') navigate('search');
                  else if (item === 'Archive') navigate('archive');
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="relative flex-1 flex items-center overflow-hidden" style={{ minHeight: '520px' }}>
        <img
          src={HERO_IMAGES.main}
          alt="Ancient Indian manuscript with handwritten text"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.35) sepia(0.4)' }}
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 max-w-3xl px-16 py-16">
          <div
            className="inline-block text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 mb-8"
            style={{ border: '1px solid rgba(176,138,69,0.5)', color: '#B08A45', background: 'rgba(176,138,69,0.08)' }}
          >
            Digital Heritage Preservation
          </div>

          <h1
            className="font-display text-5xl font-bold leading-tight mb-6"
            style={{ color: '#F1E4C3', letterSpacing: '-0.01em' }}
          >
            Preserving India's<br />
            Written Heritage<br />
            <em className="not-italic" style={{ color: '#B08A45' }}>Through AI</em>
          </h1>

          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(241,228,195,0.72)', maxWidth: '520px' }}>
            BharatLipi transforms fragile historical manuscripts into searchable, accessible, and digitally preserved knowledge — across scripts and languages of the Indian subcontinent.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('upload')}
              className="px-7 py-3.5 font-semibold text-sm tracking-wide transition-all hover:brightness-110"
              style={{
                background: '#B08A45',
                color: '#17233C',
                fontFamily: 'var(--font-body)',
              }}
            >
              Digitize a Manuscript
            </button>
            <button
              onClick={() => navigate('archive')}
              className="px-7 py-3.5 font-semibold text-sm tracking-wide transition-all hover:bg-white/10"
              style={{
                border: '1.5px solid rgba(241,228,195,0.4)',
                color: '#F1E4C3',
                fontFamily: 'var(--font-body)',
              }}
            >
              Explore Archive
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className="px-7 py-3.5 text-sm transition-all hover:underline"
              style={{ color: 'rgba(241,228,195,0.5)', fontFamily: 'var(--font-body)' }}
            >
              View Dashboard →
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="flex-shrink-0 grid grid-cols-4"
        style={{ borderTop: '1px solid rgba(176,138,69,0.25)', borderBottom: '1px solid rgba(176,138,69,0.15)', background: 'rgba(0,0,0,0.2)' }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="px-8 py-5 text-center"
            style={{ borderRight: i < 3 ? '1px solid rgba(176,138,69,0.15)' : 'none' }}
          >
            <div className="font-display text-2xl font-bold mb-1" style={{ color: '#B08A45' }}>{s.value}</div>
            <div className="text-xs tracking-wide" style={{ color: 'rgba(241,228,195,0.45)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline section */}
      <div
        className="px-16 py-14"
        style={{ background: 'rgba(241,228,195,0.04)', borderTop: '1px solid rgba(176,138,69,0.1)' }}
      >
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#B08A45' }}>The BharatLipi Pipeline</p>
          <h2 className="font-display text-2xl font-semibold" style={{ color: '#F1E4C3' }}>
            From Manuscript to Knowledge
          </h2>
        </div>

        <div className="flex items-center justify-center gap-0 flex-wrap">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="text-center px-6">
                <div
                  className="w-12 h-12 flex items-center justify-center mx-auto mb-3"
                  style={{ border: '1px solid rgba(176,138,69,0.4)', background: 'rgba(176,138,69,0.08)' }}
                >
                  <span className="font-mono text-sm font-semibold" style={{ color: '#B08A45' }}>{i + 1}</span>
                </div>
                <div className="text-xs font-semibold tracking-wide mb-0.5" style={{ color: '#F1E4C3' }}>{step.label}</div>
                <div className="text-[10px]" style={{ color: 'rgba(241,228,195,0.35)' }}>{step.sub}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex flex-col items-center gap-0.5 px-1">
                  <div className="h-px w-6" style={{ background: 'rgba(176,138,69,0.3)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm italic" style={{ color: 'rgba(241,228,195,0.35)', fontFamily: 'var(--font-display)' }}>
          "Preserving the written heritage of the past for the researchers of tomorrow."
        </p>
      </div>

      {/* Footer CTA */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-16 py-6"
        style={{ borderTop: '1px solid rgba(176,138,69,0.15)', background: 'rgba(0,0,0,0.15)' }}
      >
        <div className="text-xs" style={{ color: 'rgba(241,228,195,0.3)' }}>
          BharatLipi · Digital Manuscript Preservation
        </div>
        <button
          onClick={() => navigate('dashboard')}
          className="text-sm font-semibold tracking-wide transition-all hover:opacity-80"
          style={{ color: '#B08A45', fontFamily: 'var(--font-body)' }}
        >
          Enter Application →
        </button>
      </div>
    </div>
  );
}

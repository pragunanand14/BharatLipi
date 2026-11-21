import { useState } from 'react';
import { useNav } from '../App';
import { HERO_IMAGES } from '../data';

const OPS = [
  { label: 'Contrast Enhancement', detail: 'CLAHE adaptive histogram equalization' },
  { label: 'Noise Reduction', detail: 'Gaussian and median filtering' },
  { label: 'Adaptive Thresholding', detail: 'Sauvola local binarization' },
  { label: 'Binarization', detail: 'Otsu\'s method with optimization' },
  { label: 'Background Cleanup', detail: 'Morphological operations' },
];

const METRICS = [
  { label: 'Image Quality', before: 'Low (38/100)', after: 'Improved (79/100)' },
  { label: 'Contrast Ratio', before: '1.8:1', after: '6.4:1' },
  { label: 'Noise Level', before: 'High', after: 'Minimal' },
  { label: 'Text Visibility', before: 'Poor', after: 'Good' },
];

export default function Preprocessing() {
  const { navigate } = useNav();
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div
        className="px-10 py-7"
        style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}
      >
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Stage 1 of 8</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Image Preprocessing</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Enhancing manuscript imagery before text extraction. Technology: OpenCV</p>
      </div>

      <div className="px-10 py-8">
        {/* Before/After comparison */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-0 flex items-center gap-2"
              style={{ background: '#17233C', color: '#F1E4C3' }}
            >
              <span style={{ color: '#A85D32' }}>●</span> ORIGINAL MANUSCRIPT
            </div>
            <div className="relative" style={{ border: '1px solid rgba(176,138,69,0.3)' }}>
              <img
                src={HERO_IMAGES.original}
                alt="Original degraded manuscript scan"
                className="w-full object-cover"
                style={{ height: 340, filter: 'contrast(0.7) brightness(1.2) sepia(0.3)', borderBottom: '1px solid rgba(176,138,69,0.2)' }}
              />
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ background: '#FDF6E7' }}
              >
                <span className="text-[10px] px-2 py-0.5 font-mono" style={{ background: 'rgba(168,93,50,0.12)', color: '#A85D32', border: '1px solid rgba(168,93,50,0.25)' }}>LOW QUALITY</span>
                <span className="text-xs" style={{ color: '#5A4A3A' }}>Faded ink · Yellowed paper · Degraded contrast</span>
              </div>
            </div>
          </div>
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-0 flex items-center gap-2"
              style={{ background: '#17233C', color: '#F1E4C3' }}
            >
              <span style={{ color: '#3F5945' }}>●</span> ENHANCED MANUSCRIPT
            </div>
            <div className="relative" style={{ border: '1px solid rgba(63,89,69,0.35)' }}>
              <img
                src={HERO_IMAGES.enhanced}
                alt="Enhanced manuscript with improved contrast"
                className="w-full object-cover"
                style={{ height: 340, filter: 'contrast(1.3) brightness(0.95) saturate(0.7)', borderBottom: '1px solid rgba(63,89,69,0.2)' }}
              />
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ background: '#FDF6E7' }}
              >
                <span className="text-[10px] px-2 py-0.5 font-mono" style={{ background: 'rgba(63,89,69,0.12)', color: '#3F5945', border: '1px solid rgba(63,89,69,0.25)' }}>IMPROVED QUALITY</span>
                <span className="text-xs" style={{ color: '#5A4A3A' }}>Stronger ink · Cleaner background · Reduced noise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison slider label */}
        <div className="mb-8 px-5 py-4" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#29231D' }}>Before / After Comparison Slider</span>
            <span className="font-mono text-xs" style={{ color: '#B08A45' }}>{sliderPos}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#B08A45' }}
          />
          <p className="text-[11px] mt-1" style={{ color: '#5A4A3A' }}>
            Drag to compare original vs. enhanced image quality.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Operations applied */}
          <div className="p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
            <h3 className="font-display text-base font-semibold mb-4" style={{ color: '#17233C' }}>Preprocessing Operations</h3>
            <div className="flex flex-col gap-3">
              {OPS.map((op) => (
                <div key={op.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#3F5945' }}>✓</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#29231D' }}>{op.label}</div>
                    <div className="text-xs" style={{ color: '#5A4A3A' }}>{op.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(176,138,69,0.2)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-1" style={{ background: '#17233C', color: '#B08A45' }}>OPENCV</span>
                <span className="text-xs" style={{ color: '#5A4A3A' }}>Computer Vision / Image Processing</span>
              </div>
            </div>
          </div>

          {/* Quality metrics */}
          <div className="p-5" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
            <h3 className="font-display text-base font-semibold mb-4" style={{ color: '#17233C' }}>Quality Metrics</h3>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-3 text-[10px] font-semibold uppercase tracking-wider pb-2 mb-2" style={{ color: '#5A4A3A', borderBottom: '1px solid rgba(176,138,69,0.2)' }}>
                <span>Metric</span>
                <span>Before</span>
                <span>After</span>
              </div>
              {METRICS.map((m) => (
                <div key={m.label} className="grid grid-cols-3 py-2.5 text-xs" style={{ borderBottom: '1px solid rgba(176,138,69,0.1)' }}>
                  <span style={{ color: '#29231D', fontWeight: 500 }}>{m.label}</span>
                  <span style={{ color: '#A85D32' }}>{m.before}</span>
                  <span style={{ color: '#3F5945', fontWeight: 600 }}>{m.after}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('script-id')}
            className="px-6 py-3 text-sm font-semibold hover:brightness-95 transition-all"
            style={{ background: '#17233C', color: '#F1E4C3' }}
          >
            Continue to Script Identification →
          </button>
          <button
            onClick={() => navigate('processing')}
            className="px-6 py-3 text-sm hover:bg-[#E5D4AD] transition-all"
            style={{ border: '1.5px solid rgba(176,138,69,0.4)', color: '#4A3424' }}
          >
            ← Back to Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}

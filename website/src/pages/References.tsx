export default function References() {
  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Academic Resources</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>References</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Source frameworks, datasets, and digital manuscript resources used in BharatLipi.</p>
      </div>

      <div className="px-10 py-8 max-w-3xl">
        {/* Section 1: Cultural & Domain Frameworks */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: 'rgba(176,138,69,0.3)' }} />
            <h2 className="font-display text-base font-semibold px-3" style={{ color: '#17233C' }}>
              Cultural & Domain Frameworks
            </h2>
            <div className="h-px flex-1" style={{ background: 'rgba(176,138,69,0.3)' }} />
          </div>

          <div className="flex flex-col gap-5">
            <div className="py-4" style={{ borderBottom: '1px solid rgba(176,138,69,0.15)' }}>
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold" style={{ color: '#17233C' }}>
                  National Mission for Manuscripts (NMM)
                </h3>
                <span className="text-[10px] px-2 py-0.5 flex-shrink-0 ml-4" style={{ background: 'rgba(176,138,69,0.1)', color: '#8C6C33', border: '1px solid rgba(176,138,69,0.25)' }}>
                  Government of India
                </span>
              </div>
              <p className="text-xs mb-1" style={{ color: '#5A4A3A' }}>Ministry of Culture, Government of India</p>
              <p className="text-xs leading-relaxed" style={{ color: '#4A3424' }}>
                Manuscript preservation, documentation, conservation and digitization. India's national program for cataloguing and preserving the country's manuscript heritage across institutions.
              </p>
            </div>

            <div className="py-4" style={{ borderBottom: '1px solid rgba(176,138,69,0.15)' }}>
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold" style={{ color: '#17233C' }}>
                  Indian Knowledge Systems (IKS) Division
                </h3>
                <span className="text-[10px] px-2 py-0.5 flex-shrink-0 ml-4" style={{ background: 'rgba(176,138,69,0.1)', color: '#8C6C33', border: '1px solid rgba(176,138,69,0.25)' }}>
                  Government of India
                </span>
              </div>
              <p className="text-xs mb-1" style={{ color: '#5A4A3A' }}>Ministry of Education, Government of India</p>
              <p className="text-xs leading-relaxed" style={{ color: '#4A3424' }}>
                Preservation and dissemination of Indian knowledge traditions. The IKS Division supports efforts to document and make accessible the intellectual heritage embedded in classical Indian texts.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Datasets & Digital Manuscript Resources */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: 'rgba(176,138,69,0.3)' }} />
            <h2 className="font-display text-base font-semibold px-3" style={{ color: '#17233C' }}>
              Datasets & Digital Manuscript Resources
            </h2>
            <div className="h-px flex-1" style={{ background: 'rgba(176,138,69,0.3)' }} />
          </div>

          <div className="flex flex-col gap-5">
            <div className="py-4" style={{ borderBottom: '1px solid rgba(176,138,69,0.15)' }}>
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold" style={{ color: '#17233C' }}>
                  Kaggle — Manuscripts Language Classification
                </h3>
                <span className="text-[10px] px-2 py-0.5 flex-shrink-0 ml-4" style={{ background: 'rgba(23,35,60,0.08)', color: '#17233C', border: '1px solid rgba(23,35,60,0.15)' }}>
                  Dataset
                </span>
              </div>
              <p className="text-xs mb-1" style={{ color: '#5A4A3A' }}>Aditya Mukati · Kaggle</p>
              <p className="text-xs leading-relaxed mb-2" style={{ color: '#4A3424' }}>
                Dataset for manuscript language classification. Used for training and validating the script identification component of the BharatLipi pipeline.
              </p>
              <a
                href="https://www.kaggle.com/datasets/adityamukati/manuscripts-language-classification"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline break-all"
                style={{ color: '#B08A45', fontFamily: 'var(--font-mono)' }}
              >
                https://www.kaggle.com/datasets/adityamukati/manuscripts-language-classification
              </a>
            </div>

            <div className="py-4" style={{ borderBottom: '1px solid rgba(176,138,69,0.15)' }}>
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold" style={{ color: '#17233C' }}>
                  SamHitā — IIC Delhi
                </h3>
                <span className="text-[10px] px-2 py-0.5 flex-shrink-0 ml-4" style={{ background: 'rgba(23,35,60,0.08)', color: '#17233C', border: '1px solid rgba(23,35,60,0.15)' }}>
                  Digital Resource
                </span>
              </div>
              <p className="text-xs mb-1" style={{ color: '#5A4A3A' }}>India International Centre, Delhi</p>
              <p className="text-xs leading-relaxed mb-2" style={{ color: '#4A3424' }}>
                Digital manuscript resource and reference collection maintained by the India International Centre. Provides access to digitized manuscripts and related scholarly resources.
              </p>
              <a
                href="https://samhitadev.iicdelhi.in/manuscripts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: '#B08A45', fontFamily: 'var(--font-mono)' }}
              >
                https://samhitadev.iicdelhi.in/manuscripts
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="px-5 py-4"
          style={{ background: 'rgba(176,138,69,0.05)', border: '1px solid rgba(176,138,69,0.2)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#5A4A3A' }}>
            <strong style={{ color: '#4A3424' }}>Note:</strong> BharatLipi is a Smart India Hackathon 2026 prototype. All manuscript records in the current prototype are illustrative samples. The platform is designed for the digital preservation of manuscripts across Indian scripts and languages — it does not emphasize any single script or regional tradition.
          </p>
        </div>
      </div>
    </div>
  );
}

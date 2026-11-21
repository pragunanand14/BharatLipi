import { useEffect, useState } from 'react';
import { AppSettings, getSettings, saveSettings, SUPPORTED_TRANSLATION_LANGUAGES, languageName } from '../preferences';

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4" style={{ borderBottom: '1px solid rgba(176,138,69,0.12)' }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#29231D' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#5A4A3A' }}>{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="w-11 h-6 relative flex-shrink-0 transition-all" style={{ background: checked ? '#17233C' : 'rgba(176,138,69,0.2)', border: `1.5px solid ${checked ? '#17233C' : 'rgba(176,138,69,0.4)'}`, borderRadius: 12 }}>
        <span className="absolute top-0.5 transition-all" style={{ left: checked ? 'calc(100% - 18px)' : '2px', width: 16, height: 16, background: checked ? '#B08A45' : '#FDF6E7', borderRadius: '50%' }} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [expandedLanguages, setExpandedLanguages] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const refresh = () => setSettings(getSettings());
    window.addEventListener('bharatlipi-settings-updated', refresh);
    return () => window.removeEventListener('bharatlipi-settings-updated', refresh);
  }, []);

  const update = (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    setMessage('Settings saved automatically.');
  };

  const toggleLanguage = (code: string) => {
    const exists = settings.defaultTranslationLanguages.includes(code);
    const next = exists
      ? settings.defaultTranslationLanguages.filter((item) => item !== code)
      : [...settings.defaultTranslationLanguages, code];
    update({ defaultTranslationLanguages: next });
  };

  const toggleNotifications = async (enabled: boolean) => {
    setMessage('');
    if (!enabled) {
      update({ notifyOnCompletion: false });
      return;
    }
    if (!('Notification' in window)) {
      setMessage('This browser does not support desktop notifications.');
      return;
    }
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (permission === 'granted') update({ notifyOnCompletion: true });
    else setMessage('Notification permission was not granted. You can enable it in your browser site settings.');
  };

  const visibleLanguages = expandedLanguages
    ? SUPPORTED_TRANSLATION_LANGUAGES
    : SUPPORTED_TRANSLATION_LANGUAGES.filter((language) => ['hin_Deva', 'eng_Latn', 'ben_Beng', 'mar_Deva', 'tam_Taml', 'tel_Telu', 'guj_Gujr', 'pan_Guru'].includes(language.code));

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Configuration</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Settings</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Choose how manuscript processing and translation behave in this workspace.</p>
      </div>

      <div className="px-10 py-8 max-w-4xl">
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-2 pb-2" style={{ color: '#17233C', borderBottom: '1px solid rgba(176,138,69,0.25)' }}>Translation defaults</h2>
          <p className="text-xs mb-4" style={{ color: '#5A4A3A' }}>Output languages are preselected for new uploads. The source language applies when translating an existing manuscript. New image uploads use the fixed Sanskrit / Devanagari OCR profile.</p>
          <div className="flex flex-wrap gap-3 mb-3">
            <label className="text-xs font-semibold" style={{ color: '#5A4A3A' }}>Default source language for existing OCR text</label>
            <select value={settings.defaultSourceLanguage} onChange={(event) => update({ defaultSourceLanguage: event.target.value, defaultTranslationLanguages: settings.defaultTranslationLanguages.filter((code) => code !== event.target.value) })} className="px-3 py-2 text-sm outline-none" style={{ border: '1px solid rgba(176,138,69,0.35)', background: '#FDF6E7', color: '#29231D' }}>
              {SUPPORTED_TRANSLATION_LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.name} · {language.nativeName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {visibleLanguages.filter((language) => language.code !== settings.defaultSourceLanguage).map((language) => (
              <label key={language.code} className="flex items-center gap-2 px-3 py-2.5 cursor-pointer" style={{ background: settings.defaultTranslationLanguages.includes(language.code) ? 'rgba(63,89,69,0.08)' : '#FDF6E7', border: `1px solid ${settings.defaultTranslationLanguages.includes(language.code) ? 'rgba(63,89,69,0.4)' : 'rgba(176,138,69,0.2)'}` }}>
                <input type="checkbox" checked={settings.defaultTranslationLanguages.includes(language.code)} onChange={() => toggleLanguage(language.code)} />
                <span className="text-xs" style={{ color: '#29231D' }}>{language.name}</span>
                <span className="text-[10px] ml-auto" style={{ color: '#8C6C33' }}>{language.nativeName}</span>
              </label>
            ))}
          </div>
          <button type="button" onClick={() => setExpandedLanguages((value) => !value)} className="mt-3 text-xs font-semibold underline" style={{ color: '#17233C' }}>{expandedLanguages ? 'Show fewer languages' : `Show all ${SUPPORTED_TRANSLATION_LANGUAGES.length} language options`}</button>
          <p className="text-xs mt-3" style={{ color: '#8C6C33' }}>Selected by default: {settings.defaultTranslationLanguages.length ? settings.defaultTranslationLanguages.map(languageName).join(', ') : 'None — OCR only'}</p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-2 pb-2" style={{ color: '#17233C', borderBottom: '1px solid rgba(176,138,69,0.25)' }}>Workspace</h2>
          <Toggle label="Compact view" description="Reduce page padding and spacing for a denser workspace." checked={settings.compactView} onChange={(value) => update({ compactView: value })} />
        </section>

        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-2 pb-2" style={{ color: '#17233C', borderBottom: '1px solid rgba(176,138,69,0.25)' }}>Notifications</h2>
          <Toggle label="Processing completion notification" description="Show a desktop notification when an OCR and translation upload job finishes." checked={settings.notifyOnCompletion} onChange={toggleNotifications} />
        </section>

        <section className="p-4" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.25)' }}>
          <p className="text-sm font-semibold" style={{ color: '#17233C' }}>Settings are saved automatically</p>
          <p className="text-xs mt-1" style={{ color: '#5A4A3A' }}>These preferences remain in this browser until you change them or reset them. Your profile is managed separately from Settings.</p>
          {message && <p className="text-xs mt-2 font-semibold" role="status" style={{ color: message.startsWith('Settings') ? '#3F5945' : '#A85D32' }}>{message}</p>}
          <button type="button" onClick={() => { saveSettings({ defaultTranslationLanguages: ['hin_Deva', 'eng_Latn'], defaultSourceLanguage: 'san_Deva', compactView: false, notifyOnCompletion: false }); setSettings(getSettings()); setMessage('Settings reset to defaults.'); }} className="mt-4 px-4 py-2 text-xs font-semibold" style={{ border: '1px solid rgba(176,138,69,0.4)', color: '#4A3424' }}>Reset Settings to Defaults</button>
        </section>
      </div>
    </div>
  );
}

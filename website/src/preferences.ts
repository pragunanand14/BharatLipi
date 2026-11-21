export interface TranslationLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  { code: 'asm_Beng', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ben_Beng', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'brx_Deva', name: 'Bodo', nativeName: 'बड़ो' },
  { code: 'doi_Deva', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'eng_Latn', name: 'English', nativeName: 'English' },
  { code: 'gom_Deva', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'guj_Gujr', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'hin_Deva', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kan_Knda', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'kas_Arab', name: 'Kashmiri (Arabic script)', nativeName: 'کٲشُر' },
  { code: 'kas_Deva', name: 'Kashmiri (Devanagari)', nativeName: 'कॉशुर' },
  { code: 'mai_Deva', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'mal_Mlym', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mni_Beng', name: 'Manipuri (Bengali script)', nativeName: 'মৈতৈলোন্' },
  { code: 'mni_Mtei', name: 'Manipuri (Meitei script)', nativeName: 'মেইতেই' },
  { code: 'mar_Deva', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'npi_Deva', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'ory_Orya', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pan_Guru', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'san_Deva', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'sat_Olck', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'snd_Arab', name: 'Sindhi (Arabic script)', nativeName: 'سنڌي' },
  { code: 'snd_Deva', name: 'Sindhi (Devanagari)', nativeName: 'सिन्धी' },
  { code: 'tam_Taml', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'tel_Telu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'urd_Arab', name: 'Urdu', nativeName: 'اردو' },
];

export interface UserProfile {
  fullName: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  bio: string;
}

export interface AppSettings {
  defaultTranslationLanguages: string[];
  defaultSourceLanguage: string;
  compactView: boolean;
  notifyOnCompletion: boolean;
}

const PROFILE_KEY = 'bharatlipi.profile.v1';
const SETTINGS_KEY = 'bharatlipi.settings.v1';

export const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  organization: '',
  role: 'Researcher',
  phone: '',
  bio: '',
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultTranslationLanguages: ['hin_Deva', 'eng_Latn'],
  defaultSourceLanguage: 'san_Deva',
  compactView: false,
  notifyOnCompletion: false,
};

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROFILE_KEY) || '{}');
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('bharatlipi-profile-updated'));
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  const validTargets = settings.defaultTranslationLanguages.filter((code) =>
    SUPPORTED_TRANSLATION_LANGUAGES.some((language) => language.code === code) && code !== settings.defaultSourceLanguage,
  );
  const normalized = { ...settings, defaultTranslationLanguages: [...new Set(validTargets)] };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
  applySettings(normalized);
  window.dispatchEvent(new CustomEvent('bharatlipi-settings-updated'));
}

export function applySettings(settings = getSettings()): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.compact = settings.compactView ? 'true' : 'false';
}

export function profileInitials(profile: UserProfile): string {
  const parts = profile.fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'BL';
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('');
}

export function languageName(code: string): string {
  return SUPPORTED_TRANSLATION_LANGUAGES.find((language) => language.code === code)?.name || code;
}

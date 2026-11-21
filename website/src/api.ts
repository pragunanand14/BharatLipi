import type { Manuscript, ManuscriptStatus } from './data';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export interface RepositoryManuscript extends Manuscript {
  manuscriptId: string;
  originalFilename: string;
  processingStatus: string;
  verificationStatus: string;
  rawOcrText: string;
  cleanedText: string;
  verifiedText: string;
  translatedText: string;
  hasTranslations: boolean;
  translationLanguages: string[];
  imageUrls: { enhanced: string | null; binary: string | null };
}
export interface ManuscriptPage {
  items: RepositoryManuscript[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export interface DashboardData {
  total: number; processed: number; translated: number; searchable: number;
  verified: number; pendingVerification: number; pendingReview: number;
  recent: RepositoryManuscript[];
}

function url(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is missing. Add it to .env.local and restart Vite.');
  let response: Response;
  try {
    response = await fetch(url(path), {
      ...init,
      headers: {
        'ngrok-skip-browser-warning': 'true',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach the BharatLipi backend. Check that the Google Colab runtime and ngrok tunnel are still running.');
  }
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try { const body = await response.json(); if (body?.detail) detail = String(body.detail); } catch { /* retain HTTP detail */ }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}
function absolute(path: string | null | undefined): string {
  if (!path) return '';
  return /^https?:\/\//i.test(path) ? path : url(path);
}
function normalise(raw: any): RepositoryManuscript {
  const valid: ManuscriptStatus[] = ['digitized','ocr-verified','translation-available','needs-review','archived','processing'];
  const status = valid.includes(raw.status) ? raw.status : 'digitized';
  const images = {
    enhanced: absolute(raw.imageUrls?.enhanced || raw.thumbnail),
    binary: absolute(raw.imageUrls?.binary),
  };
  const ocrText = String(raw.verifiedText || raw.cleanedText || raw.rawOcrText || raw.ocrText || '');
  return {
    id: String(raw.id || raw.manuscriptId || ''),
    manuscriptId: String(raw.manuscriptId || raw.id || ''),
    title: String(raw.title || `Manuscript ${raw.id || ''}`),
    script: String(raw.script || 'Unknown'),
    language: String(raw.language || 'Unknown'),
    period: String(raw.period || 'Not catalogued'),
    region: String(raw.region || 'Not catalogued'),
    subjects: Array.isArray(raw.subjects) ? raw.subjects.map(String) : [],
    keywords: Array.isArray(raw.keywords) ? raw.keywords.map(String) : [],
    status,
    ocrConfidence: Number(raw.ocrConfidence || 0),
    translationConfidence: Number(raw.translationConfidence || 0),
    description: String(raw.description || 'Descriptive metadata has not yet been catalogued for this manuscript.'),
    folios: raw.folios == null ? undefined : Number(raw.folios),
    source: raw.source ? String(raw.source) : undefined,
    lastUpdated: String(raw.lastUpdated || ''),
    thumbnail: images.enhanced,
    ocrText,
    translation: String(raw.translatedText || raw.translation || ''),
    originalFilename: String(raw.originalFilename || ''),
    processingStatus: String(raw.processingStatus || 'Unknown'),
    verificationStatus: String(raw.verificationStatus || 'Pending'),
    rawOcrText: String(raw.rawOcrText || ''),
    cleanedText: String(raw.cleanedText || ''),
    verifiedText: String(raw.verifiedText || ''),
    translatedText: String(raw.translatedText || ''),
    hasTranslations: Boolean(raw.hasTranslations || raw.translatedText),
    translationLanguages: Array.isArray(raw.translationLanguages) ? raw.translationLanguages.map(String) : [],
    imageUrls: images,
  };
}
export async function getHealth() {
  return request<{ok:boolean;databaseConnected:boolean;manuscriptCount:number;datasetDirectoryExists:boolean}>('/api/health');
}
export async function getDashboard(): Promise<DashboardData> {
  const data = await request<any>('/api/dashboard');
  return {...data, recent: (data.recent || []).map(normalise)};
}
export async function getManuscriptPage(params: Record<string,string|number|undefined> = {}): Promise<ManuscriptPage> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== '') search.set(k, String(v)); });
  const raw = await request<any>(`/api/manuscripts${search.size ? `?${search}` : ''}`);
  return {...raw, items:(raw.items || []).map(normalise)};
}
let cached: {at:number; items:RepositoryManuscript[]} | null = null;
export async function getAllManuscripts(force = false): Promise<RepositoryManuscript[]> {
  if (!force && cached && Date.now()-cached.at < 20000) return cached.items;
  const first = await getManuscriptPage({page:1,page_size:100});
  const pages = await Promise.all(Array.from({length:Math.max(0,first.totalPages-1)},(_,i)=>getManuscriptPage({page:i+2,page_size:100})));
  const items = [...first.items,...pages.flatMap(p=>p.items)];
  cached = {at:Date.now(),items};
  return items;
}
export async function searchManuscripts(q:string): Promise<RepositoryManuscript[]> {
  const first = await getManuscriptPage({q,page:1,page_size:100});
  if(first.totalPages<=1) return first.items;
  const pages = await Promise.all(Array.from({length:first.totalPages-1},(_,i)=>getManuscriptPage({q,page:i+2,page_size:100})));
  return [...first.items,...pages.flatMap(p=>p.items)];
}
export async function getManuscript(id:string): Promise<RepositoryManuscript> {
  return normalise(await request<any>(`/api/manuscripts/${encodeURIComponent(id)}`));
}
export async function getVerificationQueue() {
  const raw = await request<any>('/api/verification/queue?page=1&page_size=100');
  return {...raw,items:(raw.items || []).map(normalise) as RepositoryManuscript[]};
}
export async function getVerificationSummary() {
  return request<{pendingReview:number;verified:number;pendingVerification:number}>('/api/verification/summary');
}
export async function saveManuscriptText(id:string,payload:{cleanedText?:string;translatedText?:string;rawOcrText?:string}) {
  const result = await request<any>(`/api/manuscripts/${encodeURIComponent(id)}/text`,{method:'PUT',body:JSON.stringify(payload)});
  cached = null; return result;
}
export async function setVerificationStatus(id:string,status:'Pending'|'Verified'|'Rejected',verifiedText?:string) {
  const result = await request<any>(`/api/manuscripts/${encodeURIComponent(id)}/verification`,{
    method:'PUT',body:JSON.stringify({status,...(verifiedText !== undefined ? {verifiedText}: {})})
  });
  cached = null; return result;
}


export interface ProcessingPageResult {
  pageNumber: number;
  filename: string;
  status: 'completed' | 'failed';
  manuscriptId?: string;
  characterCount?: number;
  cleanedTextPreview?: string;
  translations?: { languageCode: string; languageName: string; characterCount: number; translatedTextPreview: string; reviewStatus: string }[];
  translationErrors?: string[];
  error?: string;
}

export interface ProcessingJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'completed_with_errors' | 'failed';
  progress: number;
  currentStage: string;
  currentFile: string;
  currentPage: number;
  totalPages: number;
  completedPages: number;
  totalFiles: number;
  results: ProcessingPageResult[];
  errors: string[];
  translationLanguages?: string[];
  translationLanguageNames?: string[];
  translationErrors?: string[];
  sourceLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export async function startProcessingJob(files: File[], translationLanguages: string[] = [], sourceLanguage = 'san_Deva'): Promise<ProcessingJob> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is missing. Add it to .env.local and restart Vite.');
  }
  const form = new FormData();
  files.forEach((file) => form.append('files', file, file.name));
  translationLanguages.forEach((language) => form.append('translation_languages', language));
  form.append('source_language', sourceLanguage);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/processing/jobs`, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: form,
    });
  } catch {
    throw new Error('Cannot reach the BharatLipi OCR backend. Check that Colab and the ngrok tunnel are running.');
  }
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try { const body = await response.json(); if (body?.detail) detail = String(body.detail); } catch { /* keep HTTP message */ }
    throw new Error(detail);
  }
  return response.json() as Promise<ProcessingJob>;
}

export async function getProcessingJob(jobId: string): Promise<ProcessingJob> {
  return request<ProcessingJob>(`/api/processing/jobs/${encodeURIComponent(jobId)}`);
}


export interface SavedTranslation {
  manuscriptId: string;
  languageCode: string;
  languageName: string;
  sourceLanguage: string;
  translatedText: string;
  engine: string;
  reviewStatus: string;
  createdAt?: string;
  updatedAt?: string;
  isCurrent: boolean;
}

export interface TranslationJob {
  jobId: string;
  manuscriptId: string;
  status: 'queued' | 'processing' | 'completed' | 'completed_with_errors' | 'failed';
  progress: number;
  currentStage: string;
  currentLanguage: string;
  completedLanguages: number;
  totalLanguages: number;
  targetLanguages: string[];
  results: SavedTranslation[];
  errors: string[];
}

export async function getSavedTranslations(manuscriptId: string): Promise<SavedTranslation[]> {
  const result = await request<{ items: SavedTranslation[] }>(`/api/manuscripts/${encodeURIComponent(manuscriptId)}/translations`);
  return result.items || [];
}

export async function startTranslationJob(manuscriptId: string, sourceLanguage: string, targetLanguages: string[]): Promise<TranslationJob> {
  return request<TranslationJob>(`/api/manuscripts/${encodeURIComponent(manuscriptId)}/translations/jobs`, {
    method: 'POST',
    body: JSON.stringify({ sourceLanguage, targetLanguages }),
  });
}

export async function getTranslationJob(jobId: string): Promise<TranslationJob> {
  return request<TranslationJob>(`/api/translations/jobs/${encodeURIComponent(jobId)}`);
}

export async function saveTranslationEdit(manuscriptId: string, languageCode: string, translatedText: string): Promise<SavedTranslation> {
  const result = await request<SavedTranslation>(`/api/manuscripts/${encodeURIComponent(manuscriptId)}/translations/${encodeURIComponent(languageCode)}`, {
    method: 'PUT',
    body: JSON.stringify({ translatedText }),
  });
  cached = null;
  return result;
}

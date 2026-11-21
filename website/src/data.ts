export type ManuscriptStatus =
  | 'digitized'
  | 'ocr-verified'
  | 'translation-available'
  | 'needs-review'
  | 'archived'
  | 'processing';

export interface Manuscript {
  id: string;
  title: string;
  script: string;
  language: string;
  period: string;
  region: string;
  subjects: string[];
  keywords: string[];
  status: ManuscriptStatus;
  ocrConfidence: number;
  translationConfidence: number;
  description: string;
  folios?: number;
  source?: string;
  lastUpdated: string;
  thumbnail: string;
  ocrText: string;
  translation: string;
}

const IMG = {
  parchment1: 'https://images.unsplash.com/photo-1522442676585-c751dab71864?w=400&h=300&fit=crop&auto=format',
  parchment2: 'https://images.unsplash.com/photo-1734357288506-5271d99f306c?w=400&h=300&fit=crop&auto=format',
  ledger: 'https://images.unsplash.com/photo-1760307837453-ce60cb209e52?w=400&h=300&fit=crop&auto=format',
  agedPaper: 'https://images.unsplash.com/photo-1595232208179-d8cf4ca455fc?w=400&h=300&fit=crop&auto=format',
  brownPaper: 'https://images.unsplash.com/photo-1706790608211-4c03fd4f4d33?w=400&h=300&fit=crop&auto=format',
  writing: 'https://images.unsplash.com/photo-1676115388797-5f448ad78e44?w=400&h=300&fit=crop&auto=format',
  inscriptions: 'https://images.unsplash.com/photo-1759134335060-9ae159bc3e12?w=400&h=300&fit=crop&auto=format',
  asian: 'https://images.unsplash.com/photo-1701071694907-46b8902ab4bc?w=400&h=300&fit=crop&auto=format',
};

export const HERO_IMAGES = {
  main: 'https://images.unsplash.com/photo-1522442676585-c751dab71864?w=1400&h=800&fit=crop&auto=format',
  original: 'https://images.unsplash.com/photo-1595232208179-d8cf4ca455fc?w=800&h=600&fit=crop&auto=format',
  enhanced: 'https://images.unsplash.com/photo-1522442676585-c751dab71864?w=800&h=600&fit=crop&auto=format',
  ocr: 'https://images.unsplash.com/photo-1760307837453-ce60cb209e52?w=800&h=600&fit=crop&auto=format',
  viewer: 'https://images.unsplash.com/photo-1734357288506-5271d99f306c?w=900&h=700&fit=crop&auto=format',
};

export const OCR_SAMPLE_TEXT = `अथ चरकसंहितायां विमानस्थाने त्रिविधकुक्षीयं नाम प्रथमोऽध्यायः ।

व्याध्यनुशयी पुरुषः सर्वमेव वैद्यमनुगच्छति ।
संशयव्यापन्नं भेषजं नानुकम्पते ॥

अतो वक्ष्यामि विज्ञानं यथावत् सर्वरोगाणाम् ।
उपक्रमं च सम्यक्त्वात् प्रक्रियां च यथोचिताम् ॥

द्विविधं खलु रोगाणां प्रतिकारस्य लक्षणम् ।
शमनं संशोधनं चेति तत्र संशोधनं पुनः ॥

वमनं विरेचनं चापि तृतीयं वस्तिकर्म च ।
शिरोविरेचनं चेति तच्चतुर्धा विभाज्यते ॥`;

export const TRANSLATION_SAMPLE = `Chapter 1: The Three-fold Knowledge of Ailments
From the Vimana Section of Charaka Samhita

The patient afflicted by illness follows every physician.
A remedy held in doubt is not worthy of compassion.

Therefore, I shall describe the knowledge of all diseases accurately,
Together with the proper methodology of treatment and appropriate procedures.

The treatment of diseases is of two principal kinds:
The palliative and the purificatory — and of the purificatory,

There are four divisions: emesis, purgation,
Enema therapy, and nasal purification — making it fourfold.`;

export const RAW_OCR_TEXT = `अथ  चरक्सं हितायां  विमान स्थाने  त्रिवि धकुक्षीयं  नाम  प्रथ मोऽध्यायः  ।

व्याध्य नुशयी  पुरुषः  सर्वमे व  वैद्यम नुगच्छति  ।
संशयव् यापन्नं  भेषजं  नानुक म्पते  ॥

अतो  वक्ष्याम  विज्ञानं  यथाव त्  सर्वरो गाणाम्  ।
उपक्रमं  च  सम्यक् त्वात्  प्रक्रि यां  च  यथोचि ताम्  ॥`;

export const CLEANED_TEXT = OCR_SAMPLE_TEXT;

export const manuscripts: Manuscript[] = [
  {
    id: 'MS-00421',
    title: 'Charaka Samhita — Medical Knowledge Compendium',
    script: 'Devanagari',
    language: 'Sanskrit',
    period: '16th Century CE',
    region: 'Rajasthan',
    subjects: ['Medicine', 'Ayurveda', 'Knowledge Systems'],
    keywords: ['medicine', 'ayurveda', 'health', 'herbs', 'treatment', 'healing'],
    status: 'ocr-verified',
    ocrConfidence: 91.8,
    translationConfidence: 89,
    description: 'A historical compendium documenting classical Ayurvedic medical knowledge, treatment methodologies, and pharmacological preparations.',
    folios: 184,
    source: 'Rajasthan Oriental Research Institute',
    lastUpdated: '2026-08-14',
    thumbnail: IMG.parchment1,
    ocrText: OCR_SAMPLE_TEXT,
    translation: TRANSLATION_SAMPLE,
  },
  {
    id: 'MS-00387',
    title: 'Panchatantra — Prose Narrative Collection',
    script: 'Grantha',
    language: 'Sanskrit',
    period: '13th Century CE',
    region: 'Tamil Nadu',
    subjects: ['Literature', 'Narratives', 'Wisdom', 'Ethics'],
    keywords: ['literature', 'stories', 'wisdom', 'animals', 'ethics', 'fables'],
    status: 'translation-available',
    ocrConfidence: 88.4,
    translationConfidence: 85,
    description: 'A collection of ancient instructional prose narratives conveying ethical and practical wisdom through allegorical stories.',
    folios: 132,
    source: 'Tamil Manuscript Library, Chennai',
    lastUpdated: '2026-08-10',
    thumbnail: IMG.parchment2,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00502',
    title: 'Shiva Sutra Vimarshini — Philosophical Commentary',
    script: 'Sharada',
    language: 'Sanskrit',
    period: '12th Century CE',
    region: 'Kashmir',
    subjects: ['Philosophy', 'Spirituality', 'Commentary'],
    keywords: ['philosophy', 'metaphysics', 'Kashmir', 'shaivism', 'commentary'],
    status: 'needs-review',
    ocrConfidence: 72.3,
    translationConfidence: 68,
    description: 'A philosophical commentary on the foundational Shaiva scriptural aphorisms, written in the Sharada script prevalent in the Kashmir valley.',
    folios: 96,
    source: 'Shri Pratap Singh Museum, Srinagar',
    lastUpdated: '2026-08-22',
    thumbnail: IMG.ledger,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00291',
    title: 'Sumati Shataka — Telugu Moral Verses',
    script: 'Telugu',
    language: 'Telugu',
    period: '15th Century CE',
    region: 'Andhra Pradesh',
    subjects: ['Literature', 'Poetry', 'Ethics', 'Moral Philosophy'],
    keywords: ['poetry', 'telugu', 'morality', 'wisdom', 'verses', 'literature'],
    status: 'translation-available',
    ocrConfidence: 90.1,
    translationConfidence: 82,
    description: 'A celebrated collection of moral aphorisms and ethical guidance written in classical Telugu verse form.',
    folios: 48,
    source: 'Andhra Pradesh Government Oriental Manuscripts Library',
    lastUpdated: '2026-08-01',
    thumbnail: IMG.agedPaper,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00614',
    title: 'Aryabhatiyam — Astronomical Treatise',
    script: 'Malayalam',
    language: 'Sanskrit',
    period: '18th Century CE (copy)',
    region: 'Kerala',
    subjects: ['Astronomy', 'Mathematics', 'Science'],
    keywords: ['astronomy', 'mathematics', 'planets', 'calculation', 'science', 'Kerala'],
    status: 'ocr-verified',
    ocrConfidence: 86.7,
    translationConfidence: 91,
    description: 'A later manuscript copy of the classical astronomical and mathematical treatise, preserved in the Kerala tradition.',
    folios: 73,
    source: 'Kerala University Oriental Research Institute, Thiruvananthapuram',
    lastUpdated: '2026-07-28',
    thumbnail: IMG.brownPaper,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00156',
    title: 'Manasara — Treatise on Architecture',
    script: 'Bengali',
    language: 'Sanskrit',
    period: '17th Century CE',
    region: 'West Bengal',
    subjects: ['Architecture', 'Vastu', 'Urban Planning', 'Design'],
    keywords: ['architecture', 'vastu', 'building', 'temple', 'urban', 'design'],
    status: 'digitized',
    ocrConfidence: 79.4,
    translationConfidence: 0,
    description: 'A manuscript copy of the classical architectural treatise documenting principles of traditional Indian town planning and temple construction.',
    folios: 218,
    source: 'Asiatic Society, Kolkata',
    lastUpdated: '2026-07-15',
    thumbnail: IMG.writing,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00378',
    title: 'Krishi Parasara — Agricultural Knowledge',
    script: 'Kannada',
    language: 'Kannada',
    period: '16th Century CE',
    region: 'Karnataka',
    subjects: ['Agriculture', 'Farming', 'Rural Knowledge'],
    keywords: ['agriculture', 'farming', 'crops', 'soil', 'seasons', 'rural'],
    status: 'translation-available',
    ocrConfidence: 83.2,
    translationConfidence: 78,
    description: 'A Kannada manuscript documenting traditional agricultural practices, seasonal planting wisdom, and land cultivation techniques.',
    folios: 61,
    source: 'Oriental Research Institute, Mysore',
    lastUpdated: '2026-08-05',
    thumbnail: IMG.inscriptions,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00489',
    title: 'Madala Panji — Historical Chronicle',
    script: 'Odia',
    language: 'Odia',
    period: '17th Century CE',
    region: 'Odisha',
    subjects: ['History', 'Chronicles', 'Administration'],
    keywords: ['history', 'chronicle', 'temple', 'administration', 'records'],
    status: 'needs-review',
    ocrConfidence: 68.9,
    translationConfidence: 0,
    description: 'A historical chronicle documenting administrative records and significant events, written in Odia script.',
    folios: 143,
    source: 'Odisha State Museum, Bhubaneswar',
    lastUpdated: '2026-08-19',
    thumbnail: IMG.asian,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00723',
    title: 'Ashtadhyayi Vritti — Grammar Commentary',
    script: 'Nandinagari',
    language: 'Sanskrit',
    period: '14th Century CE',
    region: 'Karnataka',
    subjects: ['Grammar', 'Linguistics', 'Language Sciences'],
    keywords: ['grammar', 'linguistics', 'Sanskrit', 'language', 'syntax', 'phonology'],
    status: 'archived',
    ocrConfidence: 94.2,
    translationConfidence: 93,
    description: 'A scholarly commentary on the foundational grammatical treatise, written in the Nandinagari script tradition of Karnataka.',
    folios: 287,
    source: 'Bhandarkar Oriental Research Institute, Pune',
    lastUpdated: '2026-06-30',
    thumbnail: IMG.parchment1,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00334',
    title: 'Vaishya Vyavahara — Trade and Commerce Records',
    script: 'Devanagari',
    language: 'Hindi',
    period: '18th Century CE',
    region: 'Gujarat',
    subjects: ['Commerce', 'Trade', 'Economics', 'Administration'],
    keywords: ['trade', 'commerce', 'economics', 'merchants', 'accounts', 'records'],
    status: 'ocr-verified',
    ocrConfidence: 87.6,
    translationConfidence: 90,
    description: 'Merchant account records and trade correspondence providing historical insight into commerce networks of the period.',
    folios: 52,
    source: 'Gujarat State Archives',
    lastUpdated: '2026-08-08',
    thumbnail: IMG.parchment2,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00198',
    title: 'Lilavati — Mathematical Treatise',
    script: 'Grantha',
    language: 'Sanskrit',
    period: '15th Century CE (copy)',
    region: 'Tamil Nadu',
    subjects: ['Mathematics', 'Arithmetic', 'Algebra', 'Science'],
    keywords: ['mathematics', 'arithmetic', 'algebra', 'geometry', 'calculation'],
    status: 'translation-available',
    ocrConfidence: 92.3,
    translationConfidence: 94,
    description: 'A preserved copy of the classical mathematical text covering arithmetic, fractions, geometry, and algebraic methods.',
    folios: 88,
    source: 'Tamil Manuscript Library, Chennai',
    lastUpdated: '2026-07-22',
    thumbnail: IMG.ledger,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00445',
    title: 'Natyashastra — Treatise on Performing Arts',
    script: 'Sharada',
    language: 'Sanskrit',
    period: '11th Century CE',
    region: 'Kashmir',
    subjects: ['Music', 'Dance', 'Drama', 'Performing Arts'],
    keywords: ['music', 'dance', 'drama', 'raga', 'performance', 'aesthetics'],
    status: 'digitized',
    ocrConfidence: 76.8,
    translationConfidence: 0,
    description: 'A manuscript of the foundational text on Indian performing arts, covering music theory, dance forms, and dramatic composition.',
    folios: 176,
    source: 'Shri Pratap Singh Museum, Srinagar',
    lastUpdated: '2026-07-11',
    thumbnail: IMG.agedPaper,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00678',
    title: 'Hatha Yoga Pradipika — Yogic Manual',
    script: 'Devanagari',
    language: 'Sanskrit',
    period: '17th Century CE',
    region: 'Uttar Pradesh',
    subjects: ['Yoga', 'Wellness', 'Physical Knowledge', 'Breathing'],
    keywords: ['yoga', 'breathing', 'postures', 'meditation', 'wellness', 'body'],
    status: 'archived',
    ocrConfidence: 95.1,
    translationConfidence: 92,
    description: 'A manuscript of the classical manual of yogic practices including postures, breath regulation, and meditative techniques.',
    folios: 64,
    source: 'Kaivalyadhama Yoga Institute, Lonavala',
    lastUpdated: '2026-06-18',
    thumbnail: IMG.brownPaper,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00234',
    title: 'Brahmi Inscription Compilation — Early Scripts',
    script: 'Brahmi',
    language: 'Prakrit',
    period: '3rd–5th Century CE',
    region: 'Madhya Pradesh',
    subjects: ['Epigraphy', 'Inscriptions', 'History', 'Linguistics'],
    keywords: ['brahmi', 'inscription', 'epigraphy', 'history', 'language', 'ancient'],
    status: 'needs-review',
    ocrConfidence: 58.4,
    translationConfidence: 0,
    description: 'A collection of rubbing reproductions and transcriptions of Brahmi inscriptions from rock-cut monuments.',
    folios: 34,
    source: 'Archaeological Survey of India, Bhopal',
    lastUpdated: '2026-08-25',
    thumbnail: IMG.inscriptions,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00123',
    title: 'Ashtanga Hridayam — Medical Encyclopedia',
    script: 'Malayalam',
    language: 'Sanskrit',
    period: '16th Century CE',
    region: 'Kerala',
    subjects: ['Medicine', 'Ayurveda', 'Surgery', 'Pharmacology'],
    keywords: ['medicine', 'surgery', 'ayurveda', 'herbs', 'treatment', 'pharmacy'],
    status: 'ocr-verified',
    ocrConfidence: 89.3,
    translationConfidence: 86,
    description: 'A Kerala copy of the classical Ayurvedic medical encyclopedia covering eight branches of traditional medicine.',
    folios: 231,
    source: 'Kerala University Oriental Research Institute',
    lastUpdated: '2026-08-12',
    thumbnail: IMG.writing,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00456',
    title: 'Charyapada — Early Bengali Verse',
    script: 'Bengali',
    language: 'Old Bengali',
    period: '10th–12th Century CE',
    region: 'West Bengal',
    subjects: ['Literature', 'Poetry', 'Language History', 'Early Medieval'],
    keywords: ['poetry', 'bengali', 'medieval', 'verses', 'mystical', 'literature'],
    status: 'translation-available',
    ocrConfidence: 81.6,
    translationConfidence: 74,
    description: 'A rare manuscript collection of early Bengali mystical verses representing some of the oldest recorded literature in the Bengali language.',
    folios: 29,
    source: 'Asiatic Society, Kolkata',
    lastUpdated: '2026-07-30',
    thumbnail: IMG.asian,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00567',
    title: 'Tirukkural — Ethical Aphorisms',
    script: 'Tamil',
    language: 'Tamil',
    period: '15th Century CE (copy)',
    region: 'Tamil Nadu',
    subjects: ['Ethics', 'Philosophy', 'Literature', 'Governance'],
    keywords: ['ethics', 'virtue', 'love', 'governance', 'wisdom', 'aphorisms'],
    status: 'archived',
    ocrConfidence: 93.7,
    translationConfidence: 96,
    description: 'A manuscript copy of the classical Tamil ethical text comprising aphorisms on virtue, governance, and the nature of love.',
    folios: 41,
    source: 'Tamil Manuscript Library, Chennai',
    lastUpdated: '2026-06-25',
    thumbnail: IMG.parchment2,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00890',
    title: 'Ain-i-Akbari — Administrative Chronicle',
    script: 'Nastaliq',
    language: 'Persian',
    period: '16th Century CE',
    region: 'Delhi',
    subjects: ['History', 'Administration', 'Geography', 'Revenue'],
    keywords: ['history', 'administration', 'Mughal', 'governance', 'revenue', 'geography'],
    status: 'translation-available',
    ocrConfidence: 84.2,
    translationConfidence: 79,
    description: 'A manuscript copy of the comprehensive chronicle documenting administrative, cultural, and geographical dimensions of the Mughal state.',
    folios: 312,
    source: 'National Archives of India, New Delhi',
    lastUpdated: '2026-08-03',
    thumbnail: IMG.ledger,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00312',
    title: 'Bodhicharyavatara — Guide to Awakening',
    script: 'Tibetan',
    language: 'Tibetan',
    period: '18th Century CE',
    region: 'Arunachal Pradesh',
    subjects: ['Philosophy', 'Buddhism', 'Ethics', 'Meditation'],
    keywords: ['buddhism', 'meditation', 'awakening', 'compassion', 'philosophy', 'Tibet'],
    status: 'digitized',
    ocrConfidence: 77.5,
    translationConfidence: 0,
    description: 'A Tibetan Buddhist philosophical manuscript on the path to enlightened awakening, preserved in a northeastern Indian monastery.',
    folios: 118,
    source: 'Tawang Monastery Archive, Arunachal Pradesh',
    lastUpdated: '2026-07-20',
    thumbnail: IMG.agedPaper,
    ocrText: '',
    translation: '',
  },
  {
    id: 'MS-00644',
    title: 'Surya Siddhanta — Astronomical System',
    script: 'Devanagari',
    language: 'Sanskrit',
    period: '15th Century CE',
    region: 'Maharashtra',
    subjects: ['Astronomy', 'Cosmology', 'Calendar', 'Time-keeping'],
    keywords: ['astronomy', 'sun', 'planets', 'calendar', 'cosmology', 'time'],
    status: 'ocr-verified',
    ocrConfidence: 90.4,
    translationConfidence: 88,
    description: 'A manuscript of the ancient astronomical treatise explaining planetary motion, eclipses, and the structure of time.',
    folios: 97,
    source: 'Bhandarkar Oriental Research Institute, Pune',
    lastUpdated: '2026-08-17',
    thumbnail: IMG.brownPaper,
    ocrText: '',
    translation: '',
  },
];

export const ACTIVITY_FEED = [
  { type: 'success', text: 'Manuscript MS-00421 digitization and OCR verified', time: '2 hours ago' },
  { type: 'success', text: 'OCR processing completed for MS-00387', time: '4 hours ago' },
  { type: 'success', text: 'Translation completed for MS-00291', time: '6 hours ago' },
  { type: 'success', text: 'MS-00723 archived successfully', time: 'Yesterday' },
  { type: 'warning', text: 'Expert review required for MS-00502 (low OCR confidence)', time: 'Yesterday' },
  { type: 'success', text: 'Script identification completed for MS-00614', time: '2 days ago' },
  { type: 'warning', text: 'MS-00234 flagged for low confidence review', time: '2 days ago' },
  { type: 'success', text: 'MS-00198 translation validated by expert', time: '3 days ago' },
];

export const STATUS_LABELS: Record<ManuscriptStatus, string> = {
  'digitized': 'Digitized',
  'ocr-verified': 'OCR Verified',
  'translation-available': 'Translation Available',
  'needs-review': 'Needs Review',
  'archived': 'Archived',
  'processing': 'Processing',
};

export const STATUS_COLORS: Record<ManuscriptStatus, string> = {
  'digitized': 'bg-[#3F5945]/15 text-[#3F5945] border-[#3F5945]/30',
  'ocr-verified': 'bg-[#B08A45]/15 text-[#8C6C33] border-[#B08A45]/30',
  'translation-available': 'bg-[#17233C]/10 text-[#17233C] border-[#17233C]/20',
  'needs-review': 'bg-[#A85D32]/15 text-[#A85D32] border-[#A85D32]/30',
  'archived': 'bg-[#4A3424]/10 text-[#4A3424] border-[#4A3424]/20',
  'processing': 'bg-[#B08A45]/10 text-[#B08A45] border-[#B08A45]/20 pulse-soft',
};

export const SCRIPTS = ['All Scripts', 'Devanagari', 'Grantha', 'Sharada', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Odia', 'Nandinagari', 'Brahmi', 'Tamil', 'Tibetan', 'Nastaliq'];
export const LANGUAGES = ['All Languages', 'Sanskrit', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Old Bengali', 'Odia', 'Tamil', 'Tibetan', 'Persian', 'Prakrit'];
export const REGIONS = ['All Regions', 'Rajasthan', 'Tamil Nadu', 'Kashmir', 'Andhra Pradesh', 'Kerala', 'West Bengal', 'Karnataka', 'Odisha', 'Gujarat', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Delhi', 'Arunachal Pradesh'];
export const PERIODS = ['All Periods', '3rd–5th Century CE', '10th–12th Century CE', '11th Century CE', '12th Century CE', '13th Century CE', '14th Century CE', '15th Century CE', '16th Century CE', '17th Century CE', '18th Century CE'];
export const SUBJECTS = ['All Subjects', 'Medicine', 'Mathematics', 'Astronomy', 'Literature', 'Philosophy', 'Grammar', 'Architecture', 'Agriculture', 'History', 'Music', 'Yoga', 'Commerce', 'Buddhism'];
export const STATUSES = ['All Statuses', 'Digitized', 'OCR Verified', 'Translation Available', 'Needs Review', 'Archived'];

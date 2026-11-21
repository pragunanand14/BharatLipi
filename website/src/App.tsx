import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import Preprocessing from './pages/Preprocessing';
import ScriptIdentification from './pages/ScriptIdentification';
import OCR from './pages/OCR';
import TextCleaning from './pages/TextCleaning';
import Translation from './pages/Translation';
import CulturalContext from './pages/CulturalContext';
import Search from './pages/Search';
import ManuscriptViewer from './pages/ManuscriptViewer';
import Archive from './pages/Archive';
import Verification from './pages/Verification';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { applySettings } from './preferences';

export type Page =
  | 'landing' | 'dashboard' | 'library' | 'upload' | 'processing'
  | 'preprocessing' | 'script-id' | 'ocr' | 'text-cleaning'
  | 'translation' | 'cultural-context' | 'search' | 'viewer'
  | 'archive' | 'verification' | 'settings' | 'profile';

interface NavContextType {
  page: Page;
  navigate: (p: Page, msId?: string) => void;
  back: () => void;
  selectedManuscript: string;
  activeJobId: string | null;
  setActiveJobId: (jobId: string | null) => void;
  processingStep: number;
  setProcessingStep: (n: number) => void;
}

const NavContext = createContext<NavContextType>({
  page: 'landing',
  navigate: () => {},
  back: () => {},
  selectedManuscript: 'BL-0001',
  activeJobId: null,
  setActiveJobId: () => {},
  processingStep: 4,
  setProcessingStep: () => {},
});

export const useNav = () => useContext(NavContext);

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'library': return <Library />;
    case 'upload': return <Upload />;
    case 'processing': return <Processing />;
    case 'preprocessing': return <Preprocessing />;
    case 'script-id': return <ScriptIdentification />;
    case 'ocr': return <OCR />;
    case 'text-cleaning': return <TextCleaning />;
    case 'translation': return <Translation />;
    case 'cultural-context': return <CulturalContext />;
    case 'search': return <Search />;
    case 'viewer': return <ManuscriptViewer />;
    case 'archive': return <Archive />;
    case 'verification': return <Verification />;
    case 'settings': return <Settings />;
    case 'profile': return <Profile />;
    default: return <Dashboard />;
  }
}

interface BharatLipiHistoryState extends HistoryState {
  bharatLipi: true;
  page: Page;
  manuscriptId: string;
  navIndex: number;
}

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [selectedManuscript, setSelectedManuscript] = useState('BL-0001');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState(4);
  const navIndex = useRef(0);

  useEffect(() => {
    applySettings();
    const existing = window.history.state as BharatLipiHistoryState | null;
    const initialPage: Page = existing?.bharatLipi ? existing.page : 'landing';
    const initialManuscript = existing?.bharatLipi ? (existing.manuscriptId || 'BL-0001') : 'BL-0001';
    navIndex.current = existing?.bharatLipi ? (existing.navIndex || 0) : 0;
    setPage(initialPage);
    setSelectedManuscript(initialManuscript);

    // Keep a private in-app sentinel beneath the app history. Browser Back at
    // the first app page returns to Dashboard rather than leaving the site.
    window.history.replaceState({ bharatLipiSentinel: true }, '', window.location.href);
    window.history.pushState({
      bharatLipi: true,
      page: initialPage,
      manuscriptId: initialManuscript,
      navIndex: navIndex.current,
    } satisfies BharatLipiHistoryState, '', window.location.href);

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as (BharatLipiHistoryState & { bharatLipiSentinel?: boolean }) | null;
      if (state?.bharatLipi) {
        navIndex.current = state.navIndex || 0;
        setPage(state.page);
        setSelectedManuscript(state.manuscriptId || 'BL-0001');
      } else {
        navIndex.current = 0;
        setPage('dashboard');
        setSelectedManuscript(initialManuscript);
        window.history.pushState({
          bharatLipi: true,
          page: 'dashboard',
          manuscriptId: initialManuscript,
          navIndex: 0,
        } satisfies BharatLipiHistoryState, '', window.location.href);
      }
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((nextPage: Page, msId?: string) => {
    const nextId = msId || selectedManuscript;
    setSelectedManuscript(nextId);
    if (nextPage === 'processing') setProcessingStep(4);
    navIndex.current += 1;
    const state: BharatLipiHistoryState = {
      bharatLipi: true,
      page: nextPage,
      manuscriptId: nextId,
      navIndex: navIndex.current,
    };
    window.history.pushState(state, '', window.location.href);
    setPage(nextPage);
    window.scrollTo(0, 0);
  }, [selectedManuscript]);

  const back = useCallback(() => {
    if (navIndex.current > 0) {
      window.history.back();
    } else {
      navigate('dashboard');
    }
  }, [navigate]);

  return (
    <NavContext.Provider value={{ page, navigate, back, selectedManuscript, activeJobId, setActiveJobId, processingStep, setProcessingStep }}>
      {page === 'landing' ? <Landing /> : <Layout><PageContent page={page} /></Layout>}
    </NavContext.Provider>
  );
}

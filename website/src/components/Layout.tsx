import { ReactNode, useEffect, useState } from 'react';
import { useNav, Page } from '../App';
import { getProfile, profileInitials, UserProfile } from '../preferences';

const NAV_ITEMS: { label: string; page: Page; icon: string }[] = [
  { label: 'Dashboard', page: 'dashboard', icon: '⊞' },
  { label: 'Manuscripts', page: 'library', icon: '📜' },
  { label: 'Upload', page: 'upload', icon: '↑' },
  { label: 'Processing', page: 'processing', icon: '⚙' },
  { label: 'Search', page: 'search', icon: '⌕' },
  { label: 'Archive', page: 'archive', icon: '◫' },
  { label: 'Verification', page: 'verification', icon: '✓' },
  { label: 'Settings', page: 'settings', icon: '⚙' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { page, navigate, back } = useNav();
  const [profile, setProfile] = useState<UserProfile>(getProfile());

  useEffect(() => {
    const refresh = () => setProfile(getProfile());
    window.addEventListener('bharatlipi-profile-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('bharatlipi-profile-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const displayName = profile.fullName.trim() || 'Set up profile';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1E4C3' }}>
      <aside className="flex flex-col flex-shrink-0 w-[240px] h-full overflow-y-auto" style={{ background: '#17233C', borderRight: '1px solid rgba(176,138,69,0.2)' }}>
        <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(176,138,69,0.2)' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ border: '1.5px solid #B08A45', background: 'rgba(176,138,69,0.12)' }}>
              <span style={{ color: '#B08A45', fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700 }}>भ</span>
            </div>
            <span className="font-display font-semibold text-base tracking-wide" style={{ color: '#F1E4C3' }}>BharatLipi</span>
          </div>
          <p className="text-[10px] tracking-[0.12em] uppercase" style={{ color: '#B08A45', marginLeft: 36 }}>Ancient Knowledge</p>
        </div>

        <nav className="flex-1 py-4 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 text-left text-sm transition-all ${isActive ? 'sidebar-active' : 'hover:bg-white/5'}`}
                style={{
                  color: isActive ? '#F1E4C3' : 'rgba(241,228,195,0.55)',
                  borderRadius: 2,
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '3px solid #B08A45' : '3px solid transparent',
                }}
              >
                <span className="text-base w-5 text-center flex-shrink-0" style={{ color: isActive ? '#B08A45' : 'rgba(176,138,69,0.5)' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(176,138,69,0.15)' }}>
          <button
            onClick={() => navigate('profile')}
            className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all ${page === 'profile' ? 'sidebar-active' : 'hover:bg-white/5'}`}
            style={{ color: '#F1E4C3', borderLeft: page === 'profile' ? '3px solid #B08A45' : '3px solid transparent' }}
          >
            <span className="w-9 h-9 flex items-center justify-center text-xs font-bold rounded-full" style={{ background: 'rgba(176,138,69,0.18)', color: '#D7B46C', border: '1px solid rgba(176,138,69,0.5)' }}>{profileInitials(profile)}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold truncate">{displayName}</span>
              <span className="block text-[10px] truncate" style={{ color: 'rgba(241,228,195,0.5)' }}>Profile</span>
            </span>
            <span style={{ color: '#B08A45' }}>›</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-8 h-14" style={{ background: '#17233C', borderBottom: '1px solid rgba(176,138,69,0.25)' }}>
          <div className="flex items-center gap-4">
            <button onClick={back} title="Back to previous page" aria-label="Back to previous page" className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: '#F1E4C3', border: '1px solid rgba(176,138,69,0.25)' }}>
              <span className="text-xl leading-none">←</span>
            </button>
            <div className="h-5 w-px" style={{ background: 'rgba(176,138,69,0.3)' }} />
            <span className="text-xs tracking-[0.15em] uppercase" style={{ color: 'rgba(241,228,195,0.45)', fontFamily: 'var(--font-body)' }}>Digital Manuscript Preservation Platform</span>
          </div>
          <button onClick={() => navigate('profile')} className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80" style={{ color: 'rgba(241,228,195,0.72)' }}>
            <span className="w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold" style={{ background: 'rgba(176,138,69,0.18)', color: '#D7B46C' }}>{profileInitials(profile)}</span>
            <span className="max-w-[150px] truncate">{profile.fullName || 'Profile'}</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto parchment-texture" style={{ background: '#F1E4C3' }}>{children}</main>
      </div>
    </div>
  );
}

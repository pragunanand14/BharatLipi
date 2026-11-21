import { FormEvent, useEffect, useState } from 'react';
import { getProfile, profileInitials, saveProfile, UserProfile } from '../preferences';

const fieldClass = 'w-full px-3 py-2.5 text-sm outline-none';
const fieldStyle = { border: '1px solid rgba(176,138,69,0.35)', background: '#FDF6E7', color: '#29231D', fontFamily: 'var(--font-body)' } as const;

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const update = (key: keyof UserProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    const name = profile.fullName.trim();
    if (!name) {
      setError('Please enter your full name.');
      return;
    }
    if (profile.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      setError('Enter a valid email address or leave it blank.');
      return;
    }
    const normalized = { ...profile, fullName: name, email: profile.email.trim() };
    saveProfile(normalized);
    setProfile(normalized);
    setError('');
    setSaved(true);
  };

  const initials = profileInitials(profile);

  return (
    <div className="min-h-full" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="px-10 py-7" style={{ borderBottom: '1px solid rgba(176,138,69,0.25)', background: 'rgba(23,35,60,0.03)' }}>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#B08A45' }}>Your account</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: '#17233C' }}>Profile</h1>
        <p className="mt-1 text-sm" style={{ color: '#5A4A3A' }}>Manage the information displayed in your BharatLipi workspace.</p>
      </div>

      <form onSubmit={handleSave} className="px-10 py-8 max-w-3xl">
        <div className="flex items-center gap-5 p-5 mb-7" style={{ background: '#FDF6E7', border: '1px solid rgba(176,138,69,0.3)' }}>
          <div className="w-16 h-16 flex items-center justify-center rounded-full font-display text-xl font-bold" style={{ background: '#17233C', color: '#D7B46C', border: '2px solid rgba(176,138,69,0.5)' }}>{initials}</div>
          <div>
            <p className="font-display text-lg font-semibold" style={{ color: '#17233C' }}>{profile.fullName || 'Your name'}</p>
            <p className="text-xs mt-1" style={{ color: '#5A4A3A' }}>{profile.role || 'Researcher'}{profile.organization ? ` · ${profile.organization}` : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <label className="block col-span-2">
            <span className="block text-[10px] uppercase tracking-wide mb-1.5 font-semibold" style={{ color: '#5A4A3A' }}>Full name *</span>
            <input required value={profile.fullName} onChange={(e) => update('fullName', e.target.value)} className={fieldClass} style={fieldStyle} placeholder="Your full name" />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wide mb-1.5 font-semibold" style={{ color: '#5A4A3A' }}>Email address</span>
            <input type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} className={fieldClass} style={fieldStyle} placeholder="name@example.com" />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wide mb-1.5 font-semibold" style={{ color: '#5A4A3A' }}>Role</span>
            <select value={profile.role} onChange={(e) => update('role', e.target.value)} className={fieldClass} style={fieldStyle}>
              {['Researcher', 'Archivist', 'Librarian', 'Student', 'Faculty', 'Reviewer', 'Administrator', 'Other'].map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wide mb-1.5 font-semibold" style={{ color: '#5A4A3A' }}>Institution / organization</span>
            <input value={profile.organization} onChange={(e) => update('organization', e.target.value)} className={fieldClass} style={fieldStyle} placeholder="Institution or organization" />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase tracking-wide mb-1.5 font-semibold" style={{ color: '#5A4A3A' }}>Phone (optional)</span>
            <input type="tel" value={profile.phone} onChange={(e) => update('phone', e.target.value)} className={fieldClass} style={fieldStyle} placeholder="Phone number" />
          </label>
          <label className="block col-span-2">
            <span className="block text-[10px] uppercase tracking-wide mb-1.5 font-semibold" style={{ color: '#5A4A3A' }}>About you</span>
            <textarea rows={4} value={profile.bio} onChange={(e) => update('bio', e.target.value)} className={fieldClass} style={fieldStyle} placeholder="A short description (optional)" />
          </label>
        </div>

        {error && <p className="mt-4 text-sm" role="alert" style={{ color: '#A85D32' }}>{error}</p>}
        {saved && <p className="mt-4 text-sm font-semibold" role="status" style={{ color: '#3F5945' }}>Profile saved. Your sidebar and header have been updated.</p>}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button type="submit" className="px-6 py-3 text-sm font-semibold" style={{ background: '#17233C', color: '#F1E4C3' }}>Save Profile</button>
          <span className="text-xs" style={{ color: '#7D6A50' }}>Profile information is stored in this browser on this device.</span>
        </div>
      </form>
    </div>
  );
}

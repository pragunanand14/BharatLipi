import { useEffect, useState } from 'react';
import { useNav } from '../App';
import { getDashboard, type DashboardData } from '../api';
import { STATUS_LABELS, STATUS_COLORS, type ManuscriptStatus } from '../data';

export default function Dashboard() {
  const {navigate} = useNav();
  const [data,setData] = useState<DashboardData|null>(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    let active=true;
    getDashboard().then(d=>{if(active)setData(d)})
      .catch(e=>{if(active)setError(e instanceof Error?e.message:'Could not load dashboard data.')})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[]);
  const stats = data ? [
    {label:'Total Manuscripts',value:data.total,icon:'📜',delta:'Live repository count'},
    {label:'Processed',value:data.processed,icon:'⚙',delta:`${data.total?Math.round(data.processed/data.total*100):0}% of total`},
    {label:'Translated',value:data.translated,icon:'◈',delta:`${data.total?Math.round(data.translated/data.total*100):0}% of total`},
    {label:'Searchable Records',value:data.searchable,icon:'⌕',delta:`${data.total?Math.round(data.searchable/data.total*100):0}% of total`},
  ] : [];
  return <div className="min-h-full" style={{fontFamily:'var(--font-body)'}}>
    <div className="px-10 py-7" style={{borderBottom:'1px solid rgba(176,138,69,0.25)',background:'rgba(23,35,60,0.03)'}}>
      <div className="flex items-end justify-between"><div><p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{color:'#B08A45'}}>Overview</p><h1 className="font-display text-3xl font-semibold" style={{color:'#17233C'}}>Digital Manuscript Preservation</h1><p className="mt-1 text-sm" style={{color:'#5A4A3A'}}>Digitize, understand, and preserve India's manuscript heritage.</p></div>
      <div className="flex gap-3"><button onClick={()=>navigate('upload')} className="px-5 py-2.5 text-sm font-semibold hover:brightness-95" style={{background:'#17233C',color:'#F1E4C3'}}>Upload Manuscript</button><button onClick={()=>navigate('search')} className="px-5 py-2.5 text-sm font-semibold" style={{border:'1.5px solid #B08A45',color:'#4A3424'}}>Search Archive</button></div></div>
    </div>
    <div className="px-10 py-8">
      {error&&<div className="mb-6 px-4 py-3 text-sm" style={{background:'rgba(168,93,50,0.08)',border:'1px solid rgba(168,93,50,0.3)',color:'#8C3F20'}}>{error}</div>}
      <div className="grid grid-cols-4 gap-5 mb-10">{(loading?['Total Manuscripts','Processed','Translated','Searchable Records'].map(label=>({label,value:'—',icon:'◌',delta:'Loading live data'})):stats).map(s=><div key={s.label} className="manuscript-card px-6 py-5" style={{background:'#FDF6E7',border:'1px solid rgba(176,138,69,0.3)'}}><div className="flex items-start justify-between mb-3"><span className="text-xl">{s.icon}</span><span className="text-[10px] px-2 py-0.5" style={{background:'rgba(176,138,69,0.1)',color:'#8C6C33',border:'1px solid rgba(176,138,69,0.2)'}}>{s.delta}</span></div><div className="font-display text-3xl font-bold mb-1" style={{color:'#17233C'}}>{typeof s.value==='number'?s.value.toLocaleString():s.value}</div><div className="text-xs" style={{color:'#5A4A3A'}}>{s.label}</div></div>)}</div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2"><div className="flex items-center justify-between mb-5"><div><h2 className="font-display text-lg font-semibold" style={{color:'#17233C'}}>Recently Updated</h2><p className="text-xs mt-0.5" style={{color:'#5A4A3A'}}>Latest records from the live repository</p></div><button onClick={()=>navigate('library')} className="text-xs font-semibold hover:underline" style={{color:'#B08A45'}}>View All Manuscripts →</button></div>
        {loading?<p className="text-sm" style={{color:'#5A4A3A'}}>Loading repository records…</p>:!data?.recent.length?<p className="p-5 text-sm" style={{background:'#FDF6E7',color:'#5A4A3A'}}>No manuscript records returned by the backend.</p>:<div className="flex flex-col gap-4">{data.recent.map(ms=><div key={ms.id} className="flex gap-5 p-5 hover:brightness-95 cursor-pointer" style={{background:'#FDF6E7',border:'1px solid rgba(176,138,69,0.25)'}} onClick={()=>navigate('viewer',ms.id)}><img src={ms.thumbnail||undefined} alt={ms.title} className="w-20 h-20 object-cover flex-shrink-0" style={{background:'#E5D4AD',border:'1px solid rgba(176,138,69,0.2)'}}/><div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-3 mb-2"><div><span className="font-mono text-xs font-semibold" style={{color:'#B08A45'}}>{ms.id}</span><h3 className="font-display text-base font-semibold mt-0.5" style={{color:'#17233C'}}>{ms.title}</h3></div><span className={`text-[10px] px-2 py-0.5 border ${STATUS_COLORS[ms.status as ManuscriptStatus]}`}>{STATUS_LABELS[ms.status as ManuscriptStatus]}</span></div><div className="flex gap-4 text-xs mb-3" style={{color:'#5A4A3A'}}><span>Script: <strong>{ms.script}</strong></span><span>Language: <strong>{ms.language}</strong></span><span>File: <strong>{ms.originalFilename||'—'}</strong></span></div><div className="flex justify-between"><span className="text-[11px]" style={{color:'#5A4A3A'}}>Updated {ms.lastUpdated||'—'}</span><button onClick={e=>{e.stopPropagation();navigate('viewer',ms.id)}} className="text-xs font-semibold px-3 py-1.5" style={{background:'#17233C',color:'#F1E4C3'}}>Open Manuscript</button></div></div></div>)}</div>}
        </div>
        <div className="flex flex-col gap-6"><div className="p-5" style={{background:'#FDF6E7',border:'1px solid rgba(176,138,69,0.25)'}}><h3 className="font-display text-base font-semibold mb-4" style={{color:'#17233C'}}>Repository Status</h3><div className="flex flex-col gap-3 text-xs" style={{color:'#5A4A3A'}}><div className="flex justify-between"><span>Verified</span><strong style={{color:'#3F5945'}}>{data?.verified??'—'}</strong></div><div className="flex justify-between"><span>Pending verification</span><strong>{data?.pendingVerification??'—'}</strong></div><div className="flex justify-between"><span>Pending expert review</span><strong style={{color:'#A85D32'}}>{data?.pendingReview??'—'}</strong></div></div><button onClick={()=>navigate('verification')} className="mt-4 w-full text-sm font-semibold py-2.5 px-4 text-left" style={{background:'#17233C',color:'#F1E4C3'}}>Open Verification Center →</button></div>
        <div className="p-5" style={{background:'#FDF6E7',border:'1px solid rgba(176,138,69,0.25)'}}><h3 className="font-display text-base font-semibold mb-4" style={{color:'#17233C'}}>Quick Actions</h3><div className="flex flex-col gap-2">{[{label:'Search Manuscripts',page:'search' as const},{label:'Browse Archive',page:'archive' as const},{label:'Browse Library',page:'library' as const}].map(a=><button key={a.label} onClick={()=>navigate(a.page)} className="w-full text-sm font-semibold py-2.5 px-4 text-left" style={{border:'1px solid rgba(176,138,69,0.3)',color:'#4A3424',background:'transparent'}}>{a.label}</button>)}</div></div></div>
      </div>
    </div>
  </div>;
}

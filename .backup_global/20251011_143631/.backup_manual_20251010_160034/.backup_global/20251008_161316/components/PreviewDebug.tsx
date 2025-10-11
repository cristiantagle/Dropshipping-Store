'use client';
type Props = {
  isPreview: boolean;
  hasSupabase: boolean;
  counts: { nuevos: number; destacados: number; top: number };
};
export default function PreviewDebug({ isPreview, hasSupabase, counts }: Props) {
  if (!isPreview) return null;
  return (
    <div style={{
      position:'fixed', bottom:16, left:16, zIndex:60,
      background:'rgba(255,255,255,.95)', border:'1px solid #e5e7eb',
      borderRadius:12, padding:'10px 12px', boxShadow:'0 8px 24px rgba(0,0,0,.08)'
    }}>
      <div style={{fontWeight:800, fontSize:12, marginBottom:6}}>PreviewDebug</div>
      <ul style={{fontSize:12, lineHeight:1.3}}>
        <li>VERCEL_ENV: <b>{isPreview ? 'preview' : 'other'}</b></li>
        <li>Supabase envs: <b style={{color:hasSupabase?'#16a34a':'#dc2626'}}>
          {hasSupabase ? 'OK' : 'FALTAN'}</b></li>
        <li>Nuevos: <b>{counts.nuevos}</b></li>
        <li>Destacados: <b>{counts.destacados}</b></li>
        <li>Top: <b>{counts.top}</b></li>
      </ul>
    </div>
  );
}

'use client';
type Props = { title: string; subtitle?: string; className?: string };
export default function SectionHeader({ title, subtitle, className="" }: Props){
  return (
    <header className={`mb-4 ${className}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-sub mt-1">{subtitle}</p> : null}
    </header>
  );
}

import type { Dict } from "@/lib/i18n";
export function StoreBadges({ d }: { d: Dict }) {
  const ios = process.env.NEXT_PUBLIC_APP_STORE_URL, and = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
  const phone = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></svg>;
  const play = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M6 3.5v17l14-8.5-14-8.5Z" /></svg>;
  const badge = (url: string | undefined, top: string, name: string, icon: React.ReactNode) => {
    const inner = <>{icon}<span className="sbtx"><small>{top}</small><b>{name}</b></span>{!url && <span className="sbsoon">{d.soon}</span>}</>;
    return url ? <a className="sbadge" href={url} target="_blank" rel="noopener">{inner}</a> : <span className="sbadge" aria-disabled="true">{inner}</span>;
  };
  return <div className="stores">{badge(ios, d.storeIos1, "App Store", phone)}{badge(and, d.storeAnd1, "Google Play", play)}</div>;
}

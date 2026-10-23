import Link from "next/link";
import { getDict } from "@/lib/lang";
import { StoreBadges } from "@/components/StoreBadges";

export default async function Home() {
  const { d } = await getDict();
  return (<>
    <section className="hero">
      <div>
        <p className="eyebrow">{d.eyebrow}</p>
        <h1 style={{ marginTop: 14 }}>{d.h1a}<br /><em>{d.h1b}</em></h1>
        <p className="lead" style={{ marginTop: 20 }}>{d.lead}</p>
        <div className="ctas"><Link className="btn primary" href="/signup">{d.ctaJoin}</Link><Link className="btn" href="/login">{d.login}</Link></div>
        <StoreBadges d={d} />
        <p className="tagline">{d.tagline}</p>
      </div>
      <img className="heroimg" src="/img/scene-cafe.jpg" alt="" />
    </section>
    <section className="block"><div className="deepband">
      <h2 className="h2" style={{ marginTop: 0 }}>{d.whyH}</h2>
      <div className="stats">
        <div className="stat"><b>US$1.16B</b><p>{d.s1}</p></div><div className="stat"><b>+22%</b><p>{d.s2}</p></div>
        <div className="stat"><b>C$58.4M</b><p>{d.s3}</p></div><div className="stat"><b>5–10%</b><p>{d.s4}</p></div>
      </div>
      <p className="src">FTC Consumer Sentinel Network (Jan–Sep 2025) · Canadian Anti-Fraud Centre (2024)</p>
    </div></section>
    <section className="block">
      <h2 className="h2">{d.howH}</h2>
      <div className="grid4">
        {[[d.st1h, d.st1], [d.st2h, d.st2], [d.st3h, d.st3], [d.st4h, d.st4]].map(([h, p], i) => <div key={i}><span className="eyebrow">0{i + 1}</span><h3>{h}</h3><p>{p}</p></div>)}
      </div>
    </section>
    <section className="block hero" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <img className="heroimg" src="/img/scene-lake.jpg" alt="" />
      <div><h2 className="h2">{d.promH}</h2><p className="lead" style={{ marginTop: 12 }}>{d.promP}</p></div>
    </section>
    <section className="block">
      <h2 className="h2">{d.plansH}</h2>
      <div className="plans">
        <div className="card plan"><h3>{d.free}</h3><p className="price"><b>$0</b></p><ul><li>{d.f1}</li><li>{d.f2}</li><li>{d.f3}</li></ul><Link className="btn" href="/signup">{d.join}</Link></div>
        <div className="card plan plus"><h3>Guardian+</h3><p className="price"><b>US$15</b> {d.perMonth}</p><ul><li>{d.p1}</li><li>{d.p2}</li><li>{d.p3}</li></ul><Link className="btn primary" href="/signup">{d.ctaJoin}</Link></div>
      </div>
      <p className="note" style={{ marginTop: 12 }}>{d.priceNote}</p>
      <StoreBadges d={d} />
    </section>
  </>);
}

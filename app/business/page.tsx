import { getDict } from "@/lib/lang";
import { Playground } from "@/components/Playground";
export default async function Business() {
  const { d, lang } = await getDict();
  return (<div className="stack">
    <p className="eyebrow">Guardian Engine · B2B</p><h1 style={{ fontSize: "clamp(36px,5vw,56px)", maxWidth: "18ch" }}>{d.bizH}</h1>
    <p className="lead">{d.bizP}</p>
    <section className="block"><h2 style={{ fontSize: 28 }}>POST /api/v1/conversations/analyze</h2><p className="note">{d.apiKeyNote}</p><Playground d={d} lang={lang} /></section>
  </div>);
}

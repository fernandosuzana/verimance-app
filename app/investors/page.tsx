import { getDict } from "@/lib/lang";
import { InvestorForm } from "@/components/InvestorForm";
import { sendInvestorMessage } from "./actions";
export default async function Investors() {
  const { d } = await getDict();
  return (<div className="stack" style={{ maxWidth: 760 }}>
    <p className="eyebrow">{d.investors}</p><h1 style={{ fontSize: "clamp(38px,5vw,58px)" }}>{d.invH}</h1>
    <p className="lead">{d.invP}</p>
    <InvestorForm d={d} action={sendInvestorMessage} />
    <p>E-mail: <a href="mailto:investors@verimance.com">investors@verimance.com</a></p>
  </div>);
}

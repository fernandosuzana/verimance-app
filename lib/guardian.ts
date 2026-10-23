import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export type Lang = "en" | "fr" | "pt";
export type Level = "safe" | "caution" | "high" | "critical";
export type Signal = { label: string; evidence: string; weight: "low" | "med" | "high" };
export type Analysis = { risk: number; level: Level; stage: string; signals: Signal[]; advice: string; engine: "rules" | "ai" };
export type Msg = { from: "member" | "match"; text: string };
export type MatchFacts = { name?: string; accountDays: number; idVerified: boolean; trust: number };

const LANGNAME: Record<Lang, string> = { en: "English", fr: "Canadian French", pt: "Brazilian Portuguese" };
const L = (lang: Lang, en: string, fr: string, pt: string) => ({ en, fr, pt })[lang];

const RULES: { stage: number; w: number; re: RegExp; l: [string, string, string] }[] = [
  { stage: 2, w: 22, re: /whats\s?app|telegram|hangouts|signal app|google chat|my (?:email|number)|wechat|leave this app|outside (?:this|the) app|monitored|mon numéro|meu número|sair do app|fora do app|quitter l'appli/i, l: ["Wants to leave the app", "Veut quitter l'appli", "Quer sair do app"] },
  { stage: 1, w: 12, re: /soul ?mate|destin|my queen|my dear|love you|in love|meant to be|âme sœur|ma chère|je t'aime|minha querida|alma gêmea|te amo|destino/i, l: ["Fast, intense affection", "Affection rapide et intense", "Afeto rápido e intenso"] },
  { stage: 1, w: 10, re: /deployed|peacekeep|(?<!for an )\barmy\b|military|oil rig|\brig\b|offshore|north sea|un mission|armée|exército|missão/i, l: ["Far-away job story", "Emploi lointain", "História de trabalho distante"] },
  { stage: 2, w: 10, re: /can'?t (?:do )?(?:video|call)|camera (?:is )?(?:broken|not)|security reasons|pas de (?:vidéo|caméra)|não posso (?:fazer )?(?:vídeo|chamada)|câmera quebrou/i, l: ["Avoids video calls", "Évite les appels vidéo", "Evita chamada de vídeo"] },
  { stage: 3, w: 20, re: /customs|hospital|stuck|frozen|arrest|emergency|surgery|leave papers|lawyer|douane|hôpital|bloqué|urgence|alfândega|preso|bloquead|emergência/i, l: ["Sudden crisis story", "Histoire de crise soudaine", "História de crise repentina"] },
  { stage: 4, w: 30, re: /gift ?cards?|wire|western union|moneygram|send (?:me )?(?:money|\$)|transfer|\$\s?\d|\d[\d,. ]*\s?(?:usd|cad|dollars)|cartes?-cadeaux|virement|envoyer de l'argent|cartões?[- ]presente|transferência|pix|mandar dinheiro|r\$\s?\d|\d[\d.,]*\s?(?:dólares|reais)|dólares/i, l: ["Money request", "Demande d'argent", "Pedido de dinheiro"] },
  { stage: 4, w: 28, re: /crypto|bitcoin|usdt|trading|returns?|profit|invest|% a month|plateforme|rendement|placement|plataforma|rendimento|lucro|investir/i, l: ["Investment pitch", "Proposition d'investissement", "Proposta de investimento"] },
  { stage: 2, w: 14, re: /don'?t tell|our secret|between us|n'en parlez pas|entre nous|não conta|segredo|entre nós/i, l: ["Asks for secrecy", "Demande le secret", "Pede segredo"] },
];
const STAGES = ["none", "love_bombing", "isolation", "crisis", "money_request"];

export function adviceFor(level: Level, lang: Lang) {
  return {
    safe: L(lang, "Nothing worrying so far. Keep chatting here until you meet.", "Rien d'inquiétant pour l'instant. Restez ici jusqu'à la rencontre.", "Nada preocupante até agora. Continue conversando aqui até o encontro."),
    caution: L(lang, "A few early signs to watch. Ask for a short video call before you share more.", "Quelques signes à surveiller. Proposez un court appel vidéo avant d'en dire plus.", "Alguns sinais iniciais para observar. Peça uma chamada de vídeo curta antes de compartilhar mais."),
    high: L(lang, "This conversation follows a pattern often seen in romance scams. Stay in the app and don't share contact details.", "Cette conversation suit un schéma fréquent dans les arnaques amoureuses. Restez dans l'appli et ne partagez pas vos coordonnées.", "Esta conversa segue um padrão comum em golpes românticos. Fique no app e não compartilhe seus contatos."),
    critical: L(lang, "Please don't send money, gift cards or crypto. A real partner will understand. Talk to someone you trust first.", "N'envoyez ni argent, ni cartes-cadeaux, ni crypto. Une vraie personne comprendra. Parlez-en d'abord à un proche.", "Não envie dinheiro, cartão-presente nem cripto. Uma pessoa real vai entender. Converse antes com alguém de confiança."),
  }[level];
}

export function crisisAdvice(lang: Lang) {
  return L(lang, "A sudden emergency is often how a money request starts. Don't send anything, and ask for a live video call before you go further.", "Une urgence soudaine précède souvent une demande d'argent. N'envoyez rien et demandez un appel vidéo en direct avant d'aller plus loin.", "Uma emergência repentina costuma ser o início de um pedido de dinheiro. Não envie nada e peça uma chamada de vídeo ao vivo antes de seguir.");
}

/** Fast deterministic layer. Always runs; also the fallback when AI is unavailable. */
export function analyzeRules(msgs: Msg[], match: MatchFacts, lang: Lang): Analysis {
  const them = msgs.filter((m) => m.from === "match");
  let risk = match.trust < 50 ? 18 : 4, stage = 0;
  const signals: Signal[] = [];
  if (match.accountDays < 14) signals.push({ label: L(lang, "New account", "Compte récent", "Conta nova"), evidence: L(lang, `Created ${match.accountDays} days ago`, `Créé il y a ${match.accountDays} jours`, `Criada há ${match.accountDays} dias`), weight: "med" });
  if (!match.idVerified) { risk += 8; signals.push({ label: L(lang, "Identity not verified", "Identité non vérifiée", "Identidade não verificada"), evidence: "", weight: "med" }); }
  for (const r of RULES) {
    const hit = them.find((m) => r.re.test(m.text));
    if (hit) { risk += r.w; stage = Math.max(stage, r.stage); signals.push({ label: r.l[{ en: 0, fr: 1, pt: 2 }[lang]], evidence: hit.text.slice(0, 120), weight: r.w >= 20 ? "high" : r.w >= 12 ? "med" : "low" }); }
  }
  risk = Math.min(97, risk);
  let level: Level = risk >= 70 ? "critical" : risk >= 45 ? "high" : risk >= 25 ? "caution" : "safe";
  // "critical" is reserved for a crisis story or a money/investment ask.
  if (level === "critical" && stage < 3) level = "high";
  if (stage >= 4 && risk >= 45) level = "critical";
  const order = { high: 0, med: 1, low: 2 };
  const top = signals.map((x, i) => ({ x, i })).sort((a, b) => order[a.x.weight] - order[b.x.weight] || a.i - b.i).map((o) => o.x).slice(0, 5);
  return { risk, level, stage: STAGES[stage], signals: top, advice: level === "critical" && stage === 3 ? crisisAdvice(lang) : adviceFor(level, lang), engine: "rules" };
}

function client() { return process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null; }
const FAST = () => process.env.GUARDIAN_MODEL_FAST || "claude-haiku-5-5";
const SMART = () => process.env.GUARDIAN_MODEL_SMART || "claude-sonnet-5-5";

function textOf(res: Anthropic.Messages.Message) {
  return res.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
}
function parseJson(t: string) {
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  return JSON.parse(s >= 0 && e > s ? t.slice(s, e + 1) : t);
}

/** Verimance Guardian: rules first, then the model refines. Never throws. */
export async function analyzeConversation(msgs: Msg[], match: MatchFacts, lang: Lang): Promise<Analysis> {
  const base = analyzeRules(msgs, match, lang);
  const ai = client(); if (!ai || !msgs.some((m) => m.from === "match")) return base;
  const convo = msgs.slice(-30).map((m) => `${m.from === "member" ? "Member" : "Match"}: ${m.text}`).join("\n");
  const prompt = `You are Verimance Guardian, the romance-scam protection agent inside Verimance, a dating app for adults 45+. Judge ONLY the match's behaviour.
Match facts: account ${match.accountDays} days old; ID verified: ${match.idVerified}; trust score ${match.trust}/100.
Playbook stages: love_bombing, isolation (push to WhatsApp/Telegram, avoids video, secrecy), crisis (emergency, customs, hospital, frozen account), money_request (gift cards, wire, fees), investment (crypto, trading platform, guaranteed returns). Also watch identity inconsistencies, far-away jobs, pressure and urgency.
Use "critical" only when there is a crisis story or a request for money, gift cards, crypto or an investment. Be calibrated: ordinary warmth from a genuine person is safe. Never call the person a scammer; raise flags. Speak to the member warmly and plainly.
Rules engine already found: ${JSON.stringify(base.signals.map((s) => s.label))}

Conversation:
${convo}

Reply with only JSON. Write label, advice in ${LANGNAME[lang]}; evidence is a short exact quote from the match (max 12 words).
{"risk":0-100,"level":"safe|caution|high|critical","stage":"none|love_bombing|isolation|crisis|money_request|investment","signals":[{"label":"","evidence":"","weight":"low|med|high"}],"advice":"1-2 sentences"}`;
  try {
    const res = await ai.messages.create({ model: FAST(), max_tokens: 700, messages: [{ role: "user", content: prompt }] });
    const r = parseJson(textOf(res));
    const level: Level = ["safe", "caution", "high", "critical"].includes(r.level) ? r.level : base.level;
    return {
      risk: Math.max(0, Math.min(100, Number(r.risk) || base.risk)), level, stage: String(r.stage || base.stage),
      signals: Array.isArray(r.signals) ? r.signals.slice(0, 5).map((s: Signal) => ({ label: String(s.label || ""), evidence: String(s.evidence || ""), weight: (["low", "med", "high"].includes(s.weight) ? s.weight : "med") as Signal["weight"] })) : base.signals,
      advice: String(r.advice || base.advice), engine: "ai",
    };
  } catch { return base; }
}

/** "Talk to Verimance Guardian": the member's companion. */
export async function askGuardian(history: { role: "user" | "assistant"; content: string }[], context: string, member: { name: string; age: number | null; city: string }, lang: Lang) {
  const ai = client();
  if (!ai) return L(lang, "Verimance Guardian isn't connected yet. Ask the Verimance team to add the Anthropic API key.", "Verimance Guardian n'est pas encore connecté.", "O Verimance Guardian ainda não está conectado. Peça à equipe Verimance para adicionar a chave da API da Anthropic.");
  const system = `You are Verimance Guardian, the warm, protective AI companion inside Verimance, a dating app for adults 45+. You are talking with ${member.name} (${member.age ?? "?"}, ${member.city}). Answer in ${LANGNAME[lang]}, in 2-5 short sentences, plainly, like a wise friend. Talk about dating, their matches, scams, safety, profile tips and first dates. Never call a specific person a scammer; describe the signs. Point to safe actions in Verimance: staying in the app, reporting, blocking, the family ally, meeting in public. If they sent money or feel in danger: Canadian Anti-Fraud Centre 1-888-495-8501, reportfraud.ftc.gov (US), boletim de ocorrência (Brazil), emergency 911 / 190.
Their conversations right now:
${context || "(none yet)"}`;
  try {
    const res = await ai.messages.create({ model: SMART(), max_tokens: 600, system, messages: history.slice(-14) });
    return textOf(res) || "…";
  } catch {
    return L(lang, "I couldn't answer just now. Please try again in a moment.", "Je n'ai pas pu répondre. Réessayez dans un instant.", "Não consegui responder agora. Tente de novo em instantes.");
  }
}

export const LEVEL_RANK: Record<Level, number> = { safe: 0, caution: 1, high: 2, critical: 3 };

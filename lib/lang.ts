import { cookies, headers } from "next/headers";
import { dict, pickLang, type Lang } from "./i18n";
export async function getLang(): Promise<Lang> {
  const c = await cookies(); const h = await headers();
  return pickLang(c.get("lang")?.value, h.get("accept-language"));
}
export async function getDict() { const lang = await getLang(); return { lang, d: dict(lang) }; }

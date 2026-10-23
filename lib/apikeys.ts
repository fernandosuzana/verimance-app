import "server-only";
import { createHash, randomBytes } from "crypto";
export const hashKey = (k: string) => createHash("sha256").update(k).digest("hex");
export const newKey = () => "vk_live_" + randomBytes(24).toString("base64url");

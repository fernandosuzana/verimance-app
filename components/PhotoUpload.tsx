"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export function PhotoUpload({ uid, current, label }: { uid: string; current: string | null; label: string }) {
  const [url, setUrl] = useState(current); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function onFile(f: File) {
    setBusy(true); setErr("");
    try {
      const img = await createImageBitmap(f); const z = 640, sc = Math.max(z / img.width, z / img.height);
      const c = document.createElement("canvas"); c.width = z; c.height = z;
      c.getContext("2d")!.drawImage(img, (z - img.width * sc) / 2, (z - img.height * sc) / 2, img.width * sc, img.height * sc);
      const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.85));
      const sb = supabaseBrowser(); const path = `${uid}/avatar-${Date.now()}.jpg`;
      const up = await sb.storage.from("avatars").upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (up.error) throw up.error;
      const pub = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      const { error } = await sb.from("profiles").update({ photo_url: pub }).eq("id", uid); if (error) throw error;
      setUrl(pub);
    } catch (e) { setErr((e as Error).message || "Upload failed"); }
    setBusy(false);
  }
  return (
    <div className="row">
      {url ? <img className="av" src={url} alt="" style={{ width: 80, height: 80 }} /> : <div className="av" style={{ width: 80, height: 80 }}>?</div>}
      <label className="btn sm">{busy ? "…" : label}<input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} /></label>
      {err && <span className="err">{err}</span>}
    </div>
  );
}

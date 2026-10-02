export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface Record {
  code: string;
  hash: string;
  title: string;
  name: string;
  timestamp: string;
}

// Catatan disimpan hanya di memori sesi ini (mock, tanpa backend).
const records = new Map<string, Record>();
export function saveRecord(r: Record) { records.set(r.code, r); }
export function findRecord(code: string) { return records.get(code.trim().toUpperCase()); }

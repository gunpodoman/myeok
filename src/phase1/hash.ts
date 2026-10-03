export async function sha256Bytes(bytes: Uint8Array): Promise<string> {
  const source = new Uint8Array(bytes.byteLength);
  source.set(bytes);
  const digest = await crypto.subtle.digest('SHA-256', source);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

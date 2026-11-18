export function safeExternalUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function isGenericChzzkHome(value: string): boolean {
  const url = new URL(value);
  return ['chzzk.naver.com', 'm.chzzk.naver.com'].includes(url.hostname) && url.pathname === '/';
}

export function channelIdFromChzzkLink(link: string): string | undefined {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.hostname !== 'chzzk.naver.com') return undefined;
    const match = /^\/([a-f0-9]{32})\/?$/i.exec(url.pathname);
    return match?.[1].toLowerCase();
  } catch {
    return undefined;
  }
}

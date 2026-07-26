export function buildChannelUrl(channelHandleOrUrl: string): string {
  const trimmed = channelHandleOrUrl.trim().replace(/\/+$/, '');

  if (trimmed.startsWith('@')) {
    return `https://www.youtube.com/${trimmed}`;
  }
  if (/^https?:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://www.youtube.com/@${trimmed}`;
}

export function formatCompetitorHandle(channelHandleOrUrl: string): string {
  const match = channelHandleOrUrl.match(/youtube\.com\/(@[\w.-]+)/i);
  return match ? match[1] : channelHandleOrUrl;
}

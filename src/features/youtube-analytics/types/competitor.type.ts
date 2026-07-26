export type YoutubeCompetitorStatus = 'fresh' | 'stale';

export interface YoutubeCompetitorChannel {
  id: string;
  businessId: string;
  channelHandleOrUrl: string;
  youtubeChannelId: string | null;
  status: YoutubeCompetitorStatus;
  lastSyncedAt: string | null;
  addedAt: string;
}

export interface YoutubeCompetitorVideoStats {
  id: string;
  competitorChannelId: string;
  videoId: string;
  date: string;
  title: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  thumbnailUrl: string | null;
}

export interface YoutubeCompetitorsDashboard {
  competitors: YoutubeCompetitorChannel[];
  competitorVideoStats: YoutubeCompetitorVideoStats[];
}

export interface CreateCompetitorChannelInput {
  channelHandleOrUrl: string;
}

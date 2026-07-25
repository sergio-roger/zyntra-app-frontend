export type YoutubeCredentialStatus = 'connected' | 'expired' | 'revoked';

export interface YoutubeOwnChannelStatus {
  status: YoutubeCredentialStatus;
  youtubeChannelId: string | null;
}

export interface YoutubeChannelDailyStats {
  id: string;
  businessId: string;
  date: string;
  subscribers: number;
  subscribersGained: number;
  subscribersLost: number;
  viewsTotal: number;
  watchTimeMinutes: number;
}

export interface YoutubeVideoDailyStats {
  id: string;
  businessId: string;
  videoId: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  avgViewDuration: number;
  thumbnailCtr: number;
  trafficSource: Record<string, number>;
}

export interface YoutubeOwnChannelDashboard {
  channelDailyStats: YoutubeChannelDailyStats[];
  videoDailyStats: YoutubeVideoDailyStats[];
}

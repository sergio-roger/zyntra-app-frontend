import { ApiResponse } from '@core/types/api';
import {
  CreateCompetitorChannelInput,
  YoutubeCompetitorChannel,
  YoutubeCompetitorsDashboard,
} from '@features/youtube-analytics/types/competitor.type';
import {
  YoutubeOwnChannelDashboard,
  YoutubeOwnChannelStatus,
} from '@features/youtube-analytics/types/own-channel.type';
import {
  VideoInterest,
  YoutubeInterestVideo,
} from '@features/youtube-analytics/types/video-interest.type';
import api from '@shared/api/axios';

export const youtubeAnalyticsApi = {
  getOwnChannelStatus: (): Promise<{ data: YoutubeOwnChannelStatus | null }> =>
    api
      .get<unknown, ApiResponse<YoutubeOwnChannelStatus | null>>(
        '/youtube-analytics/oauth/status',
      )
      .then((res) => ({ data: res.data })),

  disconnectOwnChannel: (): Promise<void> =>
    api.delete('/youtube-analytics/oauth'),

  getOwnChannelDashboard: (): Promise<{ data: YoutubeOwnChannelDashboard }> =>
    api
      .get<unknown, ApiResponse<YoutubeOwnChannelDashboard>>(
        '/youtube-analytics/dashboard/own-channel',
      )
      .then((res) => ({ data: res.data })),

  getCompetitorsDashboard: (): Promise<{ data: YoutubeCompetitorsDashboard }> =>
    api
      .get<unknown, ApiResponse<YoutubeCompetitorsDashboard>>(
        '/youtube-analytics/dashboard/competitors',
      )
      .then((res) => ({ data: res.data })),

  createCompetitor: (
    input: CreateCompetitorChannelInput,
  ): Promise<{ data: YoutubeCompetitorChannel }> =>
    api
      .post<unknown, ApiResponse<YoutubeCompetitorChannel>>(
        '/youtube-analytics/competitors',
        input,
      )
      .then((res) => ({ data: res.data })),

  removeCompetitor: (id: string): Promise<void> =>
    api.delete(`/youtube-analytics/competitors/${id}`),

  getVideoInterests: (): Promise<{ data: VideoInterest[] }> =>
    api
      .get<unknown, ApiResponse<VideoInterest[]>>('/youtube-analytics/interests')
      .then((res) => ({ data: res.data })),

  saveVideoInterestSelection: (interestIds: string[]): Promise<void> =>
    api.put('/youtube-analytics/interests/selection', { interestIds }),

  getInterestVideos: (): Promise<{ data: YoutubeInterestVideo[] }> =>
    api
      .get<unknown, ApiResponse<YoutubeInterestVideo[]>>(
        '/youtube-analytics/dashboard/interest-videos',
      )
      .then((res) => ({ data: res.data })),
};

import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';
import { ContentPostStatus } from '@features/content-planning/enums/content-post-status.enum';

export interface ContentPost {
  id: string;
  planId: string;
  platform: ContentPlanPlatform;
  scheduledAt: string;
  copyText: string;
  mediaType: 'image' | 'video';
  imageUrl: string | null;
  status: ContentPostStatus;
}

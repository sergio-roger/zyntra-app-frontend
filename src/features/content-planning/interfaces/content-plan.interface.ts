import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';

export interface ContentPlanPlatformConfig {
  platform: ContentPlanPlatform;
  postsPerWeek: number;
}

export interface ContentPlan {
  id: string;
  name: string;
  periodType: 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  status: 'draft' | 'approved';
}

export interface CreateContentPlanPayload {
  name: string;
  periodType: 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  brief: string;
  platformConfigs: ContentPlanPlatformConfig[];
  projectId?: string;
}

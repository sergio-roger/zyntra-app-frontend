import { ContentPlan, ContentPlanPlatformConfig } from '@features/content-planning/interfaces/content-plan.interface';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';

export interface ContentPlanDetail {
  plan: ContentPlan;
  platformConfigs: ContentPlanPlatformConfig[];
  posts: ContentPost[];
}

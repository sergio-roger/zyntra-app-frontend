import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import { ContentPlan, CreateContentPlanPayload } from '@features/content-planning/interfaces/content-plan.interface';
import { ContentPlanDetail } from '@features/content-planning/interfaces/content-plan-detail.interface';
import { CreditsUsage } from '@features/content-planning/interfaces/credits-usage.interface';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';

const base = (businessId: string) => `/businesses/${businessId}/content-planning`;

export const contentPlanningApi = {
  createPlan: (businessId: string, payload: CreateContentPlanPayload): Promise<ContentPlan> =>
    api
      .post<unknown, ApiResponse<ContentPlan>>(`${base(businessId)}/plans`, payload)
      .then(unwrap),

  listPlans: (businessId: string): Promise<ContentPlan[]> =>
    api
      .get<unknown, ApiResponse<ContentPlan[]>>(`${base(businessId)}/plans`)
      .then(unwrap),

  getPlanDetail: (businessId: string, planId: string): Promise<ContentPlanDetail> =>
    api
      .get<unknown, ApiResponse<ContentPlanDetail>>(`${base(businessId)}/plans/${planId}`)
      .then(unwrap),

  regenerateCopy: (
    businessId: string,
    postId: string,
    instruction?: string,
  ): Promise<ContentPost> =>
    api
      .post<unknown, ApiResponse<ContentPost>>(
        `${base(businessId)}/posts/${postId}/regenerate-copy`,
        { instruction },
      )
      .then(unwrap),

  generateImage: (businessId: string, postId: string, prompt: string): Promise<ContentPost> =>
    api
      .post<unknown, ApiResponse<ContentPost>>(
        `${base(businessId)}/posts/${postId}/generate-image`,
        { prompt },
      )
      .then(unwrap),

  approvePost: (businessId: string, postId: string): Promise<ContentPost> =>
    api
      .post<unknown, ApiResponse<ContentPost>>(`${base(businessId)}/posts/${postId}/approve`)
      .then(unwrap),

  getCreditsUsage: (businessId: string): Promise<CreditsUsage> =>
    api
      .get<unknown, ApiResponse<CreditsUsage>>(`${base(businessId)}/credits-usage`)
      .then(unwrap),
};

import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import { ContentPlan, CreateContentPlanPayload } from '@features/content-planning/interfaces/content-plan.interface';
import { ContentPost } from '@features/content-planning/interfaces/content-post.interface';

const base = (businessId: string) => `/businesses/${businessId}/content-planning`;

export const contentPlanningApi = {
  createPlan: (businessId: string, payload: CreateContentPlanPayload): Promise<ContentPlan> =>
    api
      .post<unknown, ApiResponse<ContentPlan>>(`${base(businessId)}/plans`, payload)
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
};

import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  CreateMarketingProjectPayload,
  ListMarketingProjectsParams,
  MarketingProject,
  PaginatedProjects,
  UpdateMarketingProjectPayload,
} from '@features/marketing-projects/interfaces/marketing-project.interface';
import { MarketingProjectStats } from '@features/marketing-projects/interfaces/marketing-project-stats.interface';
import { ResolvedProjectMember } from '@features/marketing-projects/interfaces/resolved-project-member.interface';
import { MarketingProjectMemberType } from '@features/marketing-projects/enums/marketing-project-member-type.enum';
import { ContentPlanDetail } from '@features/content-planning/interfaces/content-plan-detail.interface';

const base = (businessId: string) => `/businesses/${businessId}/marketing-projects`;

export const marketingProjectsApi = {
  create: (businessId: string, payload: CreateMarketingProjectPayload): Promise<MarketingProject> =>
    api.post<unknown, ApiResponse<MarketingProject>>(base(businessId), payload).then(unwrap),

  list: (businessId: string, params: ListMarketingProjectsParams): Promise<PaginatedProjects> =>
    api.get<unknown, ApiResponse<PaginatedProjects>>(base(businessId), { params }).then(unwrap),

  getStats: (businessId: string): Promise<MarketingProjectStats> =>
    api.get<unknown, ApiResponse<MarketingProjectStats>>(`${base(businessId)}/stats`).then(unwrap),

  getById: (businessId: string, id: string): Promise<MarketingProject> =>
    api.get<unknown, ApiResponse<MarketingProject>>(`${base(businessId)}/${id}`).then(unwrap),

  update: (businessId: string, id: string, payload: UpdateMarketingProjectPayload): Promise<MarketingProject> =>
    api.patch<unknown, ApiResponse<MarketingProject>>(`${base(businessId)}/${id}`, payload).then(unwrap),

  remove: (businessId: string, id: string): Promise<void> =>
    api.delete<unknown, ApiResponse<void>>(`${base(businessId)}/${id}`).then(unwrap),

  getMembers: (businessId: string, id: string): Promise<ResolvedProjectMember[]> =>
    api.get<unknown, ApiResponse<ResolvedProjectMember[]>>(`${base(businessId)}/${id}/members`).then(unwrap),

  updateMembers: (
    businessId: string,
    id: string,
    members: { memberType: MarketingProjectMemberType; memberId: string }[],
  ): Promise<ResolvedProjectMember[]> =>
    api
      .put<unknown, ApiResponse<ResolvedProjectMember[]>>(`${base(businessId)}/${id}/members`, { members })
      .then(unwrap),

  uploadCover: (businessId: string, id: string, file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post<unknown, ApiResponse<string>>(`${base(businessId)}/${id}/cover`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(unwrap);
  },

  generateCover: (businessId: string, id: string, prompt: string): Promise<string> =>
    api
      .post<unknown, ApiResponse<string>>(`${base(businessId)}/${id}/cover/generate`, { prompt })
      .then(unwrap),

  getContentPlan: (businessId: string, id: string): Promise<ContentPlanDetail | null> =>
    api.get<unknown, ApiResponse<ContentPlanDetail | null>>(`${base(businessId)}/${id}/content-plan`).then(unwrap),
};

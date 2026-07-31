import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

export interface MarketingProject {
  id: string;
  name: string;
  description: string | null;
  type: MarketingProjectType;
  status: MarketingProjectStatus;
  coverImageUrl: string | null;
  kpiName: string | null;
  kpiCurrentValue: number | null;
  kpiTargetValue: number | null;
  roiPercent: number | null;
  progressPercent: number | null;
  createdAt: string;
}

export interface CreateMarketingProjectPayload {
  name: string;
  description?: string;
  type: MarketingProjectType;
  kpiName?: string;
  kpiCurrentValue?: number;
  kpiTargetValue?: number;
  roiPercent?: number;
  progressPercent?: number;
}

export interface UpdateMarketingProjectPayload extends Partial<CreateMarketingProjectPayload> {
  status?: MarketingProjectStatus;
}

export interface ListMarketingProjectsParams {
  status?: MarketingProjectStatus;
  search?: string;
  sort?: 'recent' | 'name' | 'roi';
  page?: number;
  limit?: number;
}

export interface PaginatedProjects {
  items: MarketingProject[];
  total: number;
}

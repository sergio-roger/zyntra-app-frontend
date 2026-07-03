import { PaginatedResponse } from '@core/types/api';
import { CrmMember } from '@crm/types/crm-member';
import { Industry } from '@crm/types/industry';
import { LifecycleStage } from '@crm/types/lifecycle-stage';
import { Tag } from '@crm/types/tag';

export interface Company {
  businessId: string;
  createdAt: string;
  customFields: Record<string, string | number | boolean | null> | null;
  description: string | null;
  employeeRange: string | null;
  id: string;
  identification: string | null;
  industry: Industry | null;
  industryId: string | null;
  lifecycle_stage: LifecycleStage | null;
  lifecycleStageId: string | null;
  name: string;
  owner: CrmMember | null;
  ownerId: string | null;
  tags: Tag[];
  taxType: string | null;
  updatedAt: string;
  website: string | null;
}

export interface CompanyFormData {
  customFields?: Record<string, string | number | boolean | null>;
  description: string;
  employeeRange: string;
  identification: string;
  industryId: string;
  lifecycleStageId: string;
  name: string;
  ownerId: string;
  tagIds: string[];
  taxType: string;
  website: string;
}

export interface ListCompaniesQuery {
  createdAtFrom?: string;
  createdAtTo?: string;
  customFieldFilters?: string;
  employeeRange?: string;
  industryId?: string;
  lifecycleStageId?: string;
  limit?: number;
  ownerId?: string;
  page?: number;
  search?: string;
}

export interface RawCompany {
  businessId: string;
  createdAt: string;
  customFields?: Record<string, string | number | boolean | null> | null;
  description?: string | null;
  employeeRange?: string | null;
  id: string;
  identification?: string | null;
  industry?: Industry | null;
  industryId?: string | null;
  lifecycle_stage?: LifecycleStage | null;
  lifecycleStageId?: string | null;
  name: string;
  owner?: CrmMember | null;
  ownerId?: string | null;
  tags?: Tag[];
  taxType?: string | null;
  updatedAt: string;
  website?: string | null;
}

export type CreateCompanyInput = Partial<Omit<CompanyFormData, 'name'>> & {
  name: string;
};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

export type CompaniesListResponse = PaginatedResponse<Company>;

export type RawCompanyListResponse = PaginatedResponse<RawCompany>;

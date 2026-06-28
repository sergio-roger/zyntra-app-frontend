import { Tag } from "./tag";
import { LifecycleStage } from "./lifecycle-stage";
import { Industry } from "./industry";
import { CrmMember } from "./crm-member";

export interface Company {
  id: string;
  businessId: string;
  name: string;
  identification: string | null;
  taxType: string | null;
  website: string | null;
  employeeRange: string | null;
  description: string | null;
  industryId: string | null;
  industry: Industry | null;
  ownerId: string | null;
  owner: CrmMember | null;
  lifecycleStageId: string | null;
  lifecycle_stage: LifecycleStage | null;
  tags: Tag[];
  customFields: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFormData {
  name: string;
  identification: string;
  taxType: string;
  website: string;
  employeeRange: string;
  description: string;
  industryId: string;
  lifecycleStageId: string;
  ownerId: string;
  tagIds: string[];
  customFields: Record<string, any>;
}

export interface ListCompaniesQuery {
  search?: string;
  industryId?: string;
  lifecycleStageId?: string;
  ownerId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  limit?: number;
}

export interface CompaniesListResponse {
  items: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExportCompanyColumn {
  key: string;
  label: string;
}

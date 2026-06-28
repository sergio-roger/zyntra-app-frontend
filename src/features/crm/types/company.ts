import { Tag } from "./tag";
import { LifecycleStage } from "./lifecycle-stage";
import { Industry } from "./industry";
import { CrmMember } from "./crm-member";

export interface Company {
  businessId: string;
  createdAt: string;
  customFields: Record<string, any> | null;
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
  customFields: Record<string, any>;
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
  industryId?: string;
  lifecycleStageId?: string;
  limit?: number;
  ownerId?: string;
  page?: number;
  search?: string;
}

export interface CompaniesListResponse {
  items: Company[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ExportCompanyColumn {
  key: string;
  label: string;
}

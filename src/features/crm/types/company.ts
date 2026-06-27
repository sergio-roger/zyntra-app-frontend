import { Tag } from "./tag";
import { LifecycleStage } from "./lifecycle-stage";
import { Industry } from "./industry";
import { CrmMember } from "./crm-member";

export interface Company {
  id: string;
  business_id: string;
  name: string;
  identification: string | null;
  tax_type: string | null;
  website: string | null;
  employee_range: string | null;
  description: string | null;
  industry_id: string | null;
  industry: Industry | null;
  owner_id: string | null;
  owner: CrmMember | null;
  lifecycle_stage_id: string | null;
  lifecycle_stage: LifecycleStage | null;
  tags: Tag[];
  custom_fields: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyFormData {
  name: string;
  identification: string;
  tax_type: string;
  website: string;
  employee_range: string;
  description: string;
  industry_id: string;
  lifecycle_stage_id: string;
  owner_id: string;
  tag_ids: string[];
  custom_fields: Record<string, any>;
}

export interface ListCompaniesQuery {
  search?: string;
  industry_id?: string;
  lifecycle_stage_id?: string;
  owner_id?: string;
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

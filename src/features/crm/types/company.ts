import { Tag } from "./tag";
import { LifecycleStage } from "./lifecycle-stage";

export interface SectorType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Company {
  id: string;
  business_id: string;
  name: string;
  identification: string | null;
  website: string | null;
  num_employees: number | null;
  description: string | null;
  sector_type_id: string | null;
  sector_type: SectorType | null;
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
  website: string;
  num_employees: string;
  description: string;
  sector_type_id: string;
  lifecycle_stage_id: string;
  tag_ids: string[];
  custom_fields: Record<string, any>;
}

export interface ListCompaniesQuery {
  search?: string;
  sector_type_id?: string;
  lifecycle_stage_id?: string;
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

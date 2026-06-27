import api from "@shared/api/axios";
import {
  Company,
  CompaniesListResponse,
  CompanyFormData,
  ExportCompanyColumn,
  ListCompaniesQuery,
} from "@crm/types/company";

const buildQS = (q: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
};

const mapCompany = (raw: any): Company => ({
  id: raw.id,
  business_id: raw.business_id,
  name: raw.name,
  identification: raw.identification ?? null,
  website: raw.website ?? null,
  num_employees: raw.num_employees ?? null,
  description: raw.description ?? null,
  sector_type_id: raw.sector_type_id ?? null,
  sector_type: raw.sector_type ?? null,
  lifecycle_stage_id: raw.lifecycle_stage_id ?? null,
  lifecycle_stage: raw.lifecycle_stage ?? null,
  tags: raw.tags ?? [],
  custom_fields: raw.custom_fields ?? null,
  created_at: raw.created_at,
  updated_at: raw.updated_at,
});

const mapList = (raw: any): CompaniesListResponse => ({
  items: (raw.items ?? []).map(mapCompany),
  total: raw.total,
  page: raw.page,
  limit: raw.limit,
  totalPages: raw.totalPages,
});

export type CreateCompanyInput = Omit<
  CompanyFormData,
  "num_employees"
> & { num_employees?: number };

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

export const companiesApi = {
  list: (query: ListCompaniesQuery = {}) =>
    api
      .get<unknown, { data: any }>(
        `/crm/companies${buildQS(query as Record<string, unknown>)}`,
      )
      .then((r) => ({ data: mapList(r.data) })),

  get: (id: string) =>
    api
      .get<unknown, { data: any }>(`/crm/companies/${id}`)
      .then((r) => ({ data: mapCompany(r.data) })),

  create: (input: CreateCompanyInput) =>
    api
      .post<unknown, { data: any }>("/crm/companies", input)
      .then((r) => ({ data: mapCompany(r.data) })),

  update: (id: string, input: UpdateCompanyInput) =>
    api
      .patch<unknown, { data: any }>(`/crm/companies/${id}`, input)
      .then((r) => ({ data: mapCompany(r.data) })),

  remove: (id: string) => api.delete(`/crm/companies/${id}`),

  exportCsv: (params: {
    filters: Record<string, unknown>;
    columns: ExportCompanyColumn[];
  }) =>
    api.post<unknown, Blob>(
      "/crm/companies/export",
      { ...params.filters, columns: params.columns },
      { responseType: "blob" },
    ),

  import: (rows: Array<{ name: string; identification?: string; website?: string; num_employees?: number; description?: string }>) =>
    api.post<unknown, { data: { count: number } }>("/crm/companies/import", rows),

  listSectorTypes: () =>
    api.get<unknown, { data: any[] }>("/crm/sector-types"),
};

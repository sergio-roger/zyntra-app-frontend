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
  businessId: raw.businessId,
  name: raw.name,
  identification: raw.identification ?? null,
  taxType: raw.taxType ?? null,
  website: raw.website ?? null,
  employeeRange: raw.employeeRange ?? null,
  description: raw.description ?? null,
  industryId: raw.industryId ?? null,
  industry: raw.industry ?? null,
  ownerId: raw.ownerId ?? null,
  owner: raw.owner ?? null,
  lifecycleStageId: raw.lifecycleStageId ?? null,
  lifecycle_stage: raw.lifecycle_stage ?? null,
  tags: raw.tags ?? [],
  customFields: raw.customFields ?? null,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

const mapList = (raw: any): CompaniesListResponse => ({
  items: (raw.items ?? []).map(mapCompany),
  total: raw.total,
  page: raw.page,
  limit: raw.limit,
  totalPages: raw.totalPages,
});

export type CreateCompanyInput = Omit<CompanyFormData, never>;

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

  import: (rows: Array<{ name: string; identification?: string; website?: string; employeeRange?: string; description?: string }>) =>
    api.post<unknown, { data: { count: number } }>("/crm/companies/import", rows),

  listIndustries: () =>
    api.get<unknown, { data: any[] }>("/crm/industries"),
};

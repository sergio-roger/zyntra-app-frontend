import {
  CompaniesListResponse,
  Company,
  RawCompany,
  RawCompanyListResponse,
} from '@crm/types/company';

export const buildQueryString = (
  q: Record<string, string | number | boolean | undefined>,
): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const mapCompany = (raw: RawCompany): Company => ({
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

export const mapCompanyList = (
  raw: RawCompanyListResponse,
): CompaniesListResponse => ({
  items: (raw.items ?? []).map(mapCompany),
  total: raw.total,
  page: raw.page,
  limit: raw.limit,
  totalPages: raw.totalPages,
});

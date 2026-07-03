import { CompaniesListResponse, Company, RawCompany } from "@crm/types/company";

export const buildQueryString = (
  q: Record<string, string | number | boolean | undefined>,
): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
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

export const mapCompanyList = (raw: any): CompaniesListResponse => {
  const data =
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    raw.data &&
    typeof raw.data === "object" &&
    "items" in raw.data
      ? raw.data
      : raw;
  return {
    items: (data?.items ?? []).map(mapCompany),
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 20,
    totalPages: data?.totalPages ?? 1,
  };
};

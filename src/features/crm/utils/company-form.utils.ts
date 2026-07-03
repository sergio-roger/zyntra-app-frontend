import { Company, CompanyFormData } from "@crm/types/company";

export function defaultCompanyFormData(): CompanyFormData {
  return {
    name: "",
    identification: "",
    taxType: "RUC",
    website: "",
    employeeRange: "",
    description: "",
    industryId: "",
    lifecycleStageId: "",
    ownerId: "",
    tagIds: [],
    customFields: {},
  };
}

export function formDataFromCompany(c: Company): CompanyFormData {
  return {
    name: c.name,
    identification: c.identification ?? "",
    taxType: c.taxType ?? "RUC",
    website: c.website ?? "",
    employeeRange: c.employeeRange ?? "",
    description: c.description ?? "",
    industryId: c.industryId ?? "",
    lifecycleStageId: c.lifecycleStageId ?? "",
    ownerId: c.ownerId ?? "",
    tagIds: (c.tags ?? []).map((t) => t.id),
    customFields: c.customFields ?? {},
  };
}

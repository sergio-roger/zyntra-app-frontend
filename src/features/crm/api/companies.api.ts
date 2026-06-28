import { ExportColumn } from '@core/types/api';
import {
  CompaniesListResponse,
  Company,
  CreateCompanyInput,
  ListCompaniesQuery,
  RawCompany,
  RawCompanyListResponse,
  UpdateCompanyInput
} from '@crm/types/company';
import {
  buildQueryString,
  mapCompany,
  mapCompanyList,
} from '@crm/utils/company-api.utils';
import api from '@shared/api/axios';

export const companiesApi = {
  list: (query: ListCompaniesQuery = {}): Promise<{ data: CompaniesListResponse }> =>
    api
      .get<RawCompanyListResponse, RawCompanyListResponse>(
        `/crm/companies${buildQueryString(query as Record<string, string | number | boolean | undefined>)}`,
      )
      .then((res) => ({ data: mapCompanyList(res) })),

  get: (id: string): Promise<{ data: Company }> =>
    api
      .get<RawCompany, RawCompany>(`/crm/companies/${id}`)
      .then((res) => ({ data: mapCompany(res) })),

  create: (input: CreateCompanyInput): Promise<{ data: Company }> =>
    api
      .post<RawCompany, RawCompany>('/crm/companies', input)
      .then((res) => ({ data: mapCompany(res) })),

  update: (id: string, input: UpdateCompanyInput): Promise<{ data: Company }> =>
    api
      .patch<RawCompany, RawCompany>(`/crm/companies/${id}`, input)
      .then((res) => ({ data: mapCompany(res) })),

  remove: (id: string): Promise<void> => api.delete(`/crm/companies/${id}`),

  exportCsv: (params: {
    filters: Record<string, string | number | boolean | undefined>;
    columns: ExportColumn[];
  }): Promise<Blob> =>
    api.post<Blob, Blob>(
      '/crm/companies/export',
      { ...params.filters, columns: params.columns },
      { responseType: 'blob' },
    ),

  import: (
    rows: Array<{
      name: string;
      identification?: string;
      website?: string;
      employeeRange?: string;
      description?: string;
    }>,
  ): Promise<{ data: { count: number } }> =>
    api.post<{ count: number }, { count: number }>(
      '/crm/companies/import',
      rows,
    ).then((res) => ({ data: res })),

  listIndustries: (): Promise<{ data: Array<{ id: string; name: string }> }> =>
    api.get<Array<{ id: string; name: string }>, Array<{ id: string; name: string }>>('/crm/industries')
      .then((res) => ({ data: res })),
};

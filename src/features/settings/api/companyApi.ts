import api from '@shared/api/axios';
import { Company, UpdateCompanyInput } from '@features/settings/types/settings';

export const companyApi = {
  get: () => api.get<unknown, { data: Company }>('/settings/company'),

  update: (data: UpdateCompanyInput) =>
    api.patch<unknown, { data: Company }>('/settings/company', data),

  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<unknown, { data: { logoUrl: string } }>(
      '/settings/company/logo',
      formData,
    );
  },

  removeLogo: () => api.delete('/settings/company/logo'),
};

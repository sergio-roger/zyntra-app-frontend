import api from '@shared/api/axios';
import { ApiResponse } from '@core/types/api';
import { Company, UpdateCompanyInput } from '@features/settings/types/settings';

export const companyApi = {
  get: () => api.get<unknown, ApiResponse<Company>>('/settings/company'),

  update: (data: UpdateCompanyInput) =>
    api.patch<unknown, ApiResponse<Company>>('/settings/company', data),

  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<unknown, ApiResponse<{ logoUrl: string }>>(
      '/settings/company/logo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  removeLogo: () => api.delete('/settings/company/logo'),
};

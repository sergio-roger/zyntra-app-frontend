import api from '@shared/api/axios';
import { ApiResponse } from '@core/types/api';
import { Business, UpdateBusinessInput } from '@features/settings/types/settings';

const uploadImage = <T>(path: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<unknown, ApiResponse<T>>(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const businessApi = {
  get: () => api.get<unknown, ApiResponse<Business>>('/settings/business'),

  update: (data: UpdateBusinessInput) =>
    api.patch<unknown, ApiResponse<Business>>('/settings/business', data),

  uploadLogo: (file: File) =>
    uploadImage<{ logoUrl: string }>('/settings/business/logo', file),

  removeLogo: () => api.delete('/settings/business/logo'),

  uploadCover: (file: File) =>
    uploadImage<{ coverUrl: string }>('/settings/business/cover', file),

  removeCover: () => api.delete('/settings/business/cover'),
};

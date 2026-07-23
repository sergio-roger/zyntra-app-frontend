import api from '@shared/api/axios';
import { ApiResponse } from '@core/types/api';
import {
  BusinessProfile,
  UpdateBusinessProfileInput,
} from '@features/settings/types/business-profile.types';

export const businessProfileApi = {
  get: () =>
    api.get<unknown, ApiResponse<BusinessProfile>>('/settings/business-profile'),

  update: (data: UpdateBusinessProfileInput) =>
    api.patch<unknown, ApiResponse<BusinessProfile>>(
      '/settings/business-profile',
      data,
    ),
};

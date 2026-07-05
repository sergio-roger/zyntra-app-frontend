import api from '@shared/api/axios';
import { ApiResponse } from '@core/types/api';
import {
  LoginCredentials,
  RegisterData,
  User,
  MenuNode,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@features/auth/types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<unknown, ApiResponse<User>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    api.post<unknown, ApiResponse<User>>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<unknown, ApiResponse<User>>('/auth/me'),

  getMenus: () => api.get<unknown, ApiResponse<MenuNode[]>>('/auth/menus'),

  forgotPassword: (email: string) =>
    api.post<unknown, ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<unknown, ApiResponse<null>>('/auth/reset-password', {
      token,
      password,
    }),

  updateProfile: (data: UpdateProfileInput) =>
    api.patch<unknown, ApiResponse<User>>('/auth/me', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<unknown, ApiResponse<{ avatarUrl: string }>>(
      '/auth/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  removeAvatar: () => api.delete('/auth/me/avatar'),

  changePassword: (data: ChangePasswordInput) =>
    api.post<unknown, ApiResponse<null>>('/auth/change-password', data),
};

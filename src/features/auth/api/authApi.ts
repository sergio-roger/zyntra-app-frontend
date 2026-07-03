import api from '@shared/api/axios';
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
    api.post<unknown, { data: User }>('/auth/login', credentials),

  register: (data: RegisterData) =>
    api.post<unknown, { data: User }>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<unknown, { data: User }>('/auth/me'),

  getMenus: () => api.get<unknown, { data: MenuNode[] }>('/auth/menus'),

  forgotPassword: (email: string) =>
    api.post<unknown, { message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<unknown, { message: string }>('/auth/reset-password', {
      token,
      password,
    }),

  updateProfile: (data: UpdateProfileInput) =>
    api.patch<unknown, { data: User }>('/auth/me', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<unknown, { data: { avatarUrl: string } }>(
      '/auth/me/avatar',
      formData,
    );
  },

  removeAvatar: () => api.delete('/auth/me/avatar'),

  changePassword: (data: ChangePasswordInput) =>
    api.post<unknown, { message: string }>('/auth/change-password', data),
};

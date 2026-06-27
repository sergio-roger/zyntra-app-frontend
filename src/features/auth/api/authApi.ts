import api from "@shared/api/axios";
import {
  LoginCredentials,
  RegisterData,
  User,
  MenuNode,
} from "@features/auth/types/auth.types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<unknown, { data: User }>("/auth/login", credentials),

  register: (data: RegisterData) =>
    api.post<unknown, { data: User }>("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get<unknown, { data: User }>("/auth/me"),

  getMenus: () => api.get<unknown, { data: MenuNode[] }>("/auth/menus"),

  forgotPassword: (email: string) =>
    api.post<unknown, { message: string }>("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post<unknown, { message: string }>("/auth/reset-password", {
      token,
      password,
    }),
};

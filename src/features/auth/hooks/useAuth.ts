import { useCallback } from 'react';
import { authApi } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type { LoginCredentials, RegisterData } from '@features/auth/types/auth.types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    logout: clearStore,
    setLoading,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const response = await authApi.login(credentials);
        setUser(response.data);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      try {
        const response = await authApi.register(data);
        setUser(response.data);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearStore();
    }
  }, [clearStore]);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authApi.me();
      setUser(response.data);
    } catch {
      clearStore();
    } finally {
      setLoading(false);
    }
  }, [setUser, clearStore, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };
};

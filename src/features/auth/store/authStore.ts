import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './authStore.types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      allowedMenus: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setAllowedMenus: (allowedMenus) => set({ allowedMenus }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          allowedMenus: null,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

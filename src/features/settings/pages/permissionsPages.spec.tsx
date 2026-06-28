import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { PermissionsPage } from './PermissionsPage';
import { RolePermissionsPage } from './RolePermissionsPage';
import { useAuthStore } from '@features/auth/store/authStore';
import * as usePermsHook from '../hooks/usePermissions';

vi.mock('../hooks/usePermissions', () => ({
  useMenusList: vi.fn(),
  useRolePermissions: vi.fn(),
  useUpdatePermissions: vi.fn(() => ({
    isPending: false,
    variables: [],
    mutate: vi.fn(),
  })),
  useRolesList: vi.fn(),
  useCreateRole: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateRole: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useDeleteRole: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@features/auth/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('Permissions Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = { user: { plan: { name: 'Core Digital' } } };
      return selector ? selector(state) : state;
    });
    vi.mocked(usePermsHook.useRolesList).mockReturnValue({
      data: [
        {
          id: '1',
          name: 'admin',
          label: 'Administrador',
          description: 'Control total',
          isEditable: false,
          badge: 'Acceso Total',
          badgeColor: '',
          iconColor: '',
        },
        {
          id: '2',
          name: 'manager',
          label: 'Gerente',
          description: 'Gestión',
          isEditable: true,
          badge: 'Configurable',
          badgeColor: '',
          iconColor: '',
        },
        {
          id: '3',
          name: 'agent',
          label: 'Agente',
          description: 'Operación',
          isEditable: true,
          badge: 'Configurable',
          badgeColor: '',
          iconColor: '',
        },
      ],
      isLoading: false,
    } as any);
  });

  describe('PermissionsPage', () => {
    it('should render 3 roles card correctly', async () => {
      vi.mocked(usePermsHook.useMenusList).mockReturnValue({
        data: [
          {
            id: '1',
            key: 'dashboard',
            label: 'Dashboard',
            path: '/dashboard',
            parent_key: null,
          },
        ],
        isLoading: false,
      } as any);

      vi.mocked(usePermsHook.useRolePermissions).mockReturnValue({
        data: { role: 'agent', menu_ids: ['1'] },
        isLoading: false,
      } as any);

      render(
        <MemoryRouter>
          <PermissionsPage />
        </MemoryRouter>,
        { wrapper: createWrapper() },
      );

      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.getByText('Gerente')).toBeInTheDocument();
      expect(screen.getByText('Agente')).toBeInTheDocument();
    });
  });

  describe('RolePermissionsPage', () => {
    it('should show error screen if role is not valid', () => {
      render(
        <MemoryRouter initialEntries={['/settings/permissions/admin']}>
          <Routes>
            <Route
              path="/settings/permissions/:role"
              element={<RolePermissionsPage />}
            />
          </Routes>
        </MemoryRouter>,
        { wrapper: createWrapper() },
      );

      expect(
        screen.getByText('Rol no válido o no configurable.'),
      ).toBeInTheDocument();
    });

    it('should render matrix header if role is manager', () => {
      vi.mocked(usePermsHook.useMenusList).mockReturnValue({
        data: [],
        isLoading: false,
      } as any);

      vi.mocked(usePermsHook.useRolePermissions).mockReturnValue({
        data: { role: 'manager', menu_ids: [] },
        isLoading: false,
      } as any);

      render(
        <MemoryRouter initialEntries={['/settings/permissions/manager']}>
          <Routes>
            <Route
              path="/settings/permissions/:role"
              element={<RolePermissionsPage />}
            />
          </Routes>
        </MemoryRouter>,
        { wrapper: createWrapper() },
      );

      expect(
        screen.getByText('Configurar Permisos: Gerente'),
      ).toBeInTheDocument();
    });
  });
});

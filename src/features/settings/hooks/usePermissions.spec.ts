import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import api from '@shared/api/axios';
import {
  useMenusList,
  useRolePermissions,
  useUpdatePermissions,
} from './usePermissions';

vi.mock('@shared/api/axios', () => {
  return {
    default: {
      get: vi.fn(),
      put: vi.fn(),
    },
  };
});

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

describe('usePermissions Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMenusList', () => {
    it('should fetch and return all menus', async () => {
      const mockMenus = [
        {
          id: '1',
          key: 'dashboard',
          label: 'Dashboard',
          path: '/dashboard',
          parent_key: null,
        },
      ];
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockMenus });

      const { result } = renderHook(() => useMenusList(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockMenus);
      expect(api.get).toHaveBeenCalledWith('/settings/menus');
    });
  });

  describe('useRolePermissions', () => {
    it('should fetch and return role permissions', async () => {
      const mockPerms = { role: 'agent', menuIds: ['1', '2'] };
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockPerms });

      const { result } = renderHook(() => useRolePermissions('agent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockPerms);
      expect(api.get).toHaveBeenCalledWith('/settings/permissions/agent');
    });
  });

  describe('useUpdatePermissions', () => {
    it('should call put endpoint to update permissions', async () => {
      vi.mocked(api.put).mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useUpdatePermissions('agent'), {
        wrapper: createWrapper(),
      });

      result.current.mutate(['1', '2', '3']);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.put).toHaveBeenCalledWith('/settings/permissions/agent', {
        menuIds: ['1', '2', '3'],
      });
    });
  });
});

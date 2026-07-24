import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useCreateDriveFolder,
  useDriveChildren,
} from '@features/drive/hooks/use-drive-folders';
import { driveApi } from '@features/drive/api/drive.api';

vi.mock('@features/drive/api/drive.api', () => ({
  driveApi: {
    listChildren: vi.fn(),
    createFolder: vi.fn(),
  },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1', id: 'user-1', role: 'agent' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

vi.mock('@shared/components/toast/toastManager', () => ({
  toastManager: { add: vi.fn() },
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useDriveChildren', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches children for the given scope and folder', async () => {
    vi.mocked(driveApi.listChildren).mockResolvedValue({
      folderId: 'root-1',
      folders: [],
      files: [],
    });

    const { result } = renderHook(() => useDriveChildren('me', 'folder-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(driveApi.listChildren).toHaveBeenCalledWith('biz-1', 'me', 'folder-1');
  });
});

describe('useCreateDriveFolder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a folder using the current business id', async () => {
    vi.mocked(driveApi.createFolder).mockResolvedValue({
      id: 'folder-1',
      companyId: 'biz-1',
      ownerType: 'user',
      ownerId: 'user-1',
      parentId: null,
      name: 'Nueva',
      path: '/folder-1/',
      isStarred: false,
      createdAt: '',
      updatedAt: '',
    });

    const { result } = renderHook(() => useCreateDriveFolder(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ scope: 'me', name: 'Nueva' });
    });

    expect(driveApi.createFolder).toHaveBeenCalledWith('biz-1', {
      scope: 'me',
      name: 'Nueva',
    });
  });
});

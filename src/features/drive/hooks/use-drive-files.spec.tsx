import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useUploadDriveFile } from '@features/drive/hooks/use-drive-files';
import { driveApi } from '@features/drive/api/drive.api';

vi.mock('@features/drive/api/drive.api', () => ({
  driveApi: {
    uploadFile: vi.fn(),
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

describe('useUploadDriveFile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('tracks upload progress and clears it once settled', async () => {
    vi.mocked(driveApi.uploadFile).mockImplementation(
      (_businessId, _scope, _folderId, _file, onProgress) => {
        onProgress?.(50);
        return Promise.resolve({
          id: 'file-1',
          originalName: 'test.png',
          size: 10,
          mimeType: 'image/png',
          createdAt: '',
        });
      },
    );

    const { result } = renderHook(() => useUploadDriveFile(), {
      wrapper: createWrapper(),
    });

    const file = new File(['data'], 'test.png', { type: 'image/png' });

    await act(async () => {
      await result.current.mutateAsync({ scope: 'me', file });
    });

    expect(driveApi.uploadFile).toHaveBeenCalledWith(
      'biz-1',
      'me',
      undefined,
      file,
      expect.any(Function),
    );
    await waitFor(() => expect(result.current.progress).toBeNull());
  });
});

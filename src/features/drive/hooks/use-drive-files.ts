import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { driveApi } from '@features/drive/api/drive.api';
import {
  DriveScope,
  ListDriveFilesOptions,
  MoveOrRenameDriveFilePayload,
} from '@features/drive/types/drive';

const FILES_KEY = (businessId: string, scope: DriveScope, options: ListDriveFilesOptions) => [
  'drive-files',
  businessId,
  scope,
  options.trashed ? 'trashed' : options.recent ? 'recent' : 'default',
];

const invalidateDriveQueries = (queryClient: ReturnType<typeof useQueryClient>, businessId?: string) => {
  queryClient.invalidateQueries({ queryKey: ['drive-children', businessId] });
  queryClient.invalidateQueries({ queryKey: ['drive-files', businessId] });
};

export function useDriveFiles(scope: DriveScope, options: ListDriveFilesOptions = {}) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: FILES_KEY(businessId ?? '', scope, options),
    queryFn: () => driveApi.listFiles(businessId!, scope, options),
    enabled: !!businessId,
  });
}

function useMergedScopeFiles(options: ListDriveFilesOptions) {
  const me = useDriveFiles('me', options);
  const company = useDriveFiles('company', options);

  const data = [...(me.data ?? []), ...(company.data ?? [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return { data, isLoading: me.isLoading || company.isLoading };
}

export function useDriveRecentFiles() {
  return useMergedScopeFiles({ recent: true });
}

export function useDriveTrashFiles() {
  return useMergedScopeFiles({ trashed: true });
}

export function useDriveFilePreviewUrl(fileId: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['drive-file-preview-url', businessId, fileId],
    queryFn: () => driveApi.getPreviewUrl(businessId!, fileId!),
    enabled: !!businessId && !!fileId,
  });
}

export function useUploadDriveFile() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: ({
      scope,
      folderId,
      file,
    }: {
      scope: DriveScope;
      folderId?: string;
      file: File;
    }) =>
      driveApi.uploadFile(businessId!, scope, folderId, file, (percent) =>
        setProgress(percent),
      ),
    onSuccess: () => {
      invalidateDriveQueries(queryClient, businessId);
      toastManager.add({ title: 'Archivo subido', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo subir el archivo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
    onSettled: () => setProgress(null),
  });

  return { ...mutation, progress };
}

export function useMoveOrRenameDriveFile() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileId,
      payload,
    }: {
      fileId: string;
      payload: MoveOrRenameDriveFilePayload;
    }) => driveApi.moveOrRenameFile(businessId!, fileId, payload),
    onSuccess: () => {
      invalidateDriveQueries(queryClient, businessId);
      toastManager.add({ title: 'Archivo actualizado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo actualizar el archivo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useDeleteDriveFile() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => driveApi.deleteFile(businessId!, fileId),
    onSuccess: () => {
      invalidateDriveQueries(queryClient, businessId);
      toastManager.add({ title: 'Archivo movido a la papelera', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar el archivo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useRestoreDriveFile() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => driveApi.restoreFile(businessId!, fileId),
    onSuccess: () => {
      invalidateDriveQueries(queryClient, businessId);
      toastManager.add({ title: 'Archivo restaurado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo restaurar el archivo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function usePermanentlyDeleteDriveFile() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => driveApi.permanentlyDeleteFile(businessId!, fileId),
    onSuccess: () => {
      invalidateDriveQueries(queryClient, businessId);
      toastManager.add({ title: 'Archivo eliminado definitivamente', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar el archivo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

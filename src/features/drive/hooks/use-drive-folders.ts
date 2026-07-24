import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { driveApi } from '@features/drive/api/drive.api';
import {
  CreateDriveFolderPayload,
  DriveScope,
  UpdateDriveFolderPayload,
} from '@features/drive/types/drive';

const CHILDREN_KEY = (businessId: string, scope: DriveScope, folderId?: string) => [
  'drive-children',
  businessId,
  scope,
  folderId ?? 'root',
];
const BREADCRUMB_KEY = (businessId: string, folderId: string) => [
  'drive-breadcrumb',
  businessId,
  folderId,
];

export function useDriveChildren(scope: DriveScope, folderId?: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: CHILDREN_KEY(businessId ?? '', scope, folderId),
    queryFn: () => driveApi.listChildren(businessId!, scope, folderId),
    enabled: !!businessId,
  });
}

export function useDriveBreadcrumb(folderId: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: BREADCRUMB_KEY(businessId ?? '', folderId ?? ''),
    queryFn: () => driveApi.getBreadcrumb(businessId!, folderId!),
    enabled: !!businessId && !!folderId,
  });
}

export function useCreateDriveFolder() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDriveFolderPayload) =>
      driveApi.createFolder(businessId!, payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: CHILDREN_KEY(businessId ?? '', payload.scope, payload.parentId),
      });
      toastManager.add({ title: 'Carpeta creada', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo crear la carpeta',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useUpdateDriveFolder() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      folderId: string;
      payload: UpdateDriveFolderPayload;
    }) => driveApi.updateFolder(businessId!, folderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive-children', businessId] });
      toastManager.add({ title: 'Carpeta actualizada', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo actualizar la carpeta',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useDeleteDriveFolder() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: string) => driveApi.deleteFolder(businessId!, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive-children', businessId] });
      toastManager.add({ title: 'Carpeta movida a la papelera', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar la carpeta',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

import { businessApi } from '@features/settings/api/businessApi';
import { UpdateBusinessInput } from '@features/settings/types/settings';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const BUSINESS_QUERY_KEY = ['settings-business'];

export function useBusinessQuery() {
  return useQuery({
    queryKey: BUSINESS_QUERY_KEY,
    queryFn: async () => (await businessApi.get()).data,
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBusinessInput) => businessApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_QUERY_KEY });
      toastManager.add({
        title: 'Empresa actualizada',
        description: 'Los datos de la empresa se guardaron correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al actualizar la empresa',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

function useBusinessImageMutation<TInput>(
  mutationFn: (input: TInput) => Promise<unknown>,
  successTitle: string,
  successDescription: string,
  errorTitle: string,
): UseMutationResult<unknown, unknown, TInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_QUERY_KEY });
      toastManager.add({
        title: successTitle,
        description: successDescription,
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: errorTitle,
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useUploadBusinessLogo() {
  return useBusinessImageMutation<File>(
    (file) => businessApi.uploadLogo(file),
    'Logo actualizado',
    'El logo de la empresa se actualizó correctamente.',
    'Error al subir el logo',
  );
}

export function useRemoveBusinessLogo() {
  return useBusinessImageMutation<void>(
    () => businessApi.removeLogo(),
    'Logo eliminado',
    'El logo de la empresa se eliminó correctamente.',
    'Error al eliminar el logo',
  );
}

export function useUploadBusinessCover() {
  return useBusinessImageMutation<File>(
    (file) => businessApi.uploadCover(file),
    'Portada actualizada',
    'La portada de la empresa se actualizó correctamente.',
    'Error al subir la portada',
  );
}

export function useRemoveBusinessCover() {
  return useBusinessImageMutation<void>(
    () => businessApi.removeCover(),
    'Portada eliminada',
    'La portada de la empresa se eliminó correctamente.',
    'Error al eliminar la portada',
  );
}

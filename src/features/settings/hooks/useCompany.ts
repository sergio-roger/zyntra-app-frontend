import { companyApi } from '@features/settings/api/companyApi';
import { UpdateCompanyInput } from '@features/settings/types/settings';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const COMPANY_QUERY_KEY = ['settings-company'];

export function useCompanyQuery() {
  return useQuery({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: async () => (await companyApi.get()).data,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyInput) => companyApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
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

export function useUploadCompanyLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => companyApi.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
      toastManager.add({
        title: 'Logo actualizado',
        description: 'El logo de la empresa se actualizó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al subir el logo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useRemoveCompanyLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => companyApi.removeLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
      toastManager.add({
        title: 'Logo eliminado',
        description: 'El logo de la empresa se eliminó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al eliminar el logo',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

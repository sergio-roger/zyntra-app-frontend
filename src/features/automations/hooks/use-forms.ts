import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { formsApi } from '../api/forms.api';
import {
  CreateFormTemplatePayload,
  FormField,
  UpdateFormTemplatePayload,
} from '../types/forms';

const FORMS_QUERY_KEY = ['automations-forms'];
const FORM_QUERY_KEY = (id: string) => ['automations-forms', id];
const FORM_SUBMISSIONS_QUERY_KEY = (id: string, page: number, limit: number) => [
  'automations-forms',
  id,
  'submissions',
  page,
  limit,
];

export function useFormTemplatesList() {
  return useQuery({
    queryKey: FORMS_QUERY_KEY,
    queryFn: () => formsApi.list(),
  });
}

export function useFormTemplate(id: string | undefined) {
  return useQuery({
    queryKey: FORM_QUERY_KEY(id ?? ''),
    queryFn: () => formsApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateFormTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFormTemplatePayload) => formsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
      toastManager.add({
        title: 'Formulario creado',
        description: 'El formulario se creó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al crear el formulario',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useUpdateFormTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFormTemplatePayload) => formsApi.update(id, payload),
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
      queryClient.setQueryData(FORM_QUERY_KEY(id), (current: unknown) =>
        current ? { ...(current as object), ...template } : current,
      );
      toastManager.add({
        title: 'Formulario actualizado',
        description: 'Los cambios se guardaron correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al actualizar el formulario',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useDeleteFormTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => formsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEY });
      toastManager.add({
        title: 'Formulario eliminado',
        description: 'El formulario se eliminó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar el formulario',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useReplaceFormFields(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: FormField[]) => formsApi.replaceFields(id, fields),
    onSuccess: (fields) => {
      queryClient.setQueryData(FORM_QUERY_KEY(id), (current: unknown) =>
        current ? { ...(current as object), fields } : current,
      );
      toastManager.add({
        title: 'Campos guardados',
        description: 'El orden y los campos del formulario se actualizaron.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudieron guardar los campos',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useFormSubmissions(
  id: string | undefined,
  page = 1,
  limit = 20,
) {
  return useQuery({
    queryKey: FORM_SUBMISSIONS_QUERY_KEY(id ?? '', page, limit),
    queryFn: () => formsApi.listSubmissions(id!, page, limit),
    enabled: !!id,
  });
}

import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  CreateFormTemplatePayload,
  FormField,
  FormSubmissionsPage,
  FormTemplate,
  FormTemplateWithFields,
  UpdateFormTemplatePayload,
} from '../types/forms';

export const formsApi = {
  list: (): Promise<FormTemplate[]> =>
    api
      .get<unknown, ApiResponse<FormTemplate[]>>('/forms/templates')
      .then(unwrap),

  get: (id: string): Promise<FormTemplateWithFields> =>
    api
      .get<unknown, ApiResponse<FormTemplateWithFields>>(
        `/forms/templates/${id}`,
      )
      .then(unwrap),

  create: (payload: CreateFormTemplatePayload): Promise<FormTemplate> =>
    api
      .post<unknown, ApiResponse<FormTemplate>>('/forms/templates', payload)
      .then(unwrap),

  update: (
    id: string,
    payload: UpdateFormTemplatePayload,
  ): Promise<FormTemplate> =>
    api
      .patch<unknown, ApiResponse<FormTemplate>>(
        `/forms/templates/${id}`,
        payload,
      )
      .then(unwrap),

  // 204 No Content — sin envelope ApiResponse, no se llama unwrap (igual que crmApi.removeField).
  remove: (id: string): Promise<void> => api.delete(`/forms/templates/${id}`),

  replaceFields: (id: string, fields: FormField[]): Promise<FormField[]> =>
    api
      .put<unknown, ApiResponse<FormField[]>>(
        `/forms/templates/${id}/fields`,
        { fields },
      )
      .then(unwrap),

  listSubmissions: (
    id: string,
    page = 1,
    limit = 20,
  ): Promise<FormSubmissionsPage> =>
    api
      .get<unknown, ApiResponse<FormSubmissionsPage>>(
        `/forms/templates/${id}/submissions`,
        { params: { page, limit } },
      )
      .then(unwrap),
};

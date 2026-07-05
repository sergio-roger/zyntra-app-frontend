import api from '@shared/api/axios';
import { ApiResponse } from '@core/types/api';
import { Contact } from '@crm/types/contact';
import { ContactActivity } from '@crm/types/contact-activity';
import { ContactsListResponse } from '@crm/types/contacts-list-response';
import { CrmMember } from '@crm/types/crm-member';
import { ListContactsQuery } from '@crm/types/list-contacts-query';
import { Tag } from '@crm/types/tag';
import { CustomField } from '@crm/types/custom-field';
import {
  CreateContactInput,
  UpdateContactInput,
  CreateActivityInput,
  CreateTagInput,
  UpdateTagInput,
  CreateCustomFieldInput,
  UpdateCustomFieldInput,
} from './types';

export type {
  CreateContactInput,
  UpdateContactInput,
  CreateActivityInput,
  CreateTagInput,
  UpdateTagInput,
  CreateCustomFieldInput,
  UpdateCustomFieldInput,
};

const buildQS = (q: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const mapContact = (raw: any): Contact => ({
  id: raw.id,
  businessId: raw.businessId,
  name: raw.name,
  email: raw.email,
  phone: raw.phone,
  company: raw.company ?? null,
  companyId: raw.companyId ?? null,
  dealValue: raw.dealValue,
  channelId: raw.channelId ?? null,
  channel: raw.channel ?? null,
  lifecycleStageId: raw.lifecycleStageId,
  lifecycleStage: raw.lifecycleStage,
  ownerId: raw.ownerId,
  owner: raw.owner,
  tags: raw.tags ?? [],
  notes: raw.notes,
  customFields: raw.customFields,
  score: raw.score,
  isArchived: raw.isArchived,
  lastActivityAt: raw.lastActivityAt,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const mapContactsList = (raw: any): ContactsListResponse => ({
  items: (raw.items ?? []).map(mapContact),
  total: raw.total,
  page: raw.page,
  limit: raw.limit,
  totalPages: raw.totalPages,
});

export const crmApi = {
  list: (query: ListContactsQuery = {}) =>
    api
      .get<unknown, ApiResponse<any>>(
        `/crm/contacts${buildQS(query as Record<string, unknown>)}`,
      )
      .then((r) => ({ data: mapContactsList(r.data) })),

  get: (id: string) =>
    api
      .get<unknown, ApiResponse<any>>(`/crm/contacts/${id}`)
      .then((r) => ({ data: mapContact(r.data) })),

  create: (input: CreateContactInput) =>
    api
      .post<unknown, ApiResponse<any>>('/crm/contacts', input)
      .then((r) => ({ data: mapContact(r.data) })),

  update: (id: string, input: UpdateContactInput) =>
    api
      .patch<unknown, ApiResponse<any>>(`/crm/contacts/${id}`, input)
      .then((r) => ({ data: mapContact(r.data) })),

  remove: (id: string) => api.delete(`/crm/contacts/${id}`),

  listActivities: (
    contactId: string,
    query: { page?: number; limit?: number } = {},
  ) =>
    api.get<unknown, ApiResponse<{ items: ContactActivity[]; total: number }>>(
      `/crm/contacts/${contactId}/activities${buildQS(query)}`,
    ),

  addActivity: (contactId: string, input: CreateActivityInput) =>
    api.post<unknown, ApiResponse<ContactActivity>>(
      `/crm/contacts/${contactId}/activities`,
      input,
    ),

  // Tags
  listTags: (entityType?: string) =>
    api.get<unknown, ApiResponse<Tag[]>>('/crm/tags', {
      params: entityType ? { entity_type: entityType } : undefined,
    }),
  createTag: (input: CreateTagInput) =>
    api.post<unknown, ApiResponse<Tag>>('/crm/tags', input),
  updateTag: (id: string, input: UpdateTagInput) =>
    api.patch<unknown, ApiResponse<Tag>>(`/crm/tags/${id}`, input),
  removeTag: (id: string) => api.delete(`/crm/tags/${id}`),

  // User Preferences (preference payload itself has its own `data` field)
  getUserPreference: (key: string) =>
    api.get<unknown, ApiResponse<{ data: any }>>(
      `/auth/user/preferences/${key}`,
    ),
  updateUserPreference: (key: string, value: any) =>
    api.put<unknown, ApiResponse<{ data: any }>>(
      `/auth/user/preferences/${key}`,
      { value },
    ),

  exportCsv: (params: {
    filters: Record<string, unknown>;
    columns: { key: string; label: string }[];
  }) =>
    api.post<unknown, Blob>(
      '/crm/contacts/export',
      { ...params.filters, columns: params.columns },
      { responseType: 'blob' },
    ),

  // Members (for owner assignment)
  listMembers: () => api.get<unknown, ApiResponse<CrmMember[]>>('/crm/members'),

  // Custom Fields
  listFields: (entityType?: string) =>
    api.get<unknown, ApiResponse<CustomField[]>>(
      entityType ? `/crm/fields?entity_type=${entityType}` : '/crm/fields',
    ),
  createField: (input: CreateCustomFieldInput) =>
    api.post<unknown, ApiResponse<CustomField>>('/crm/fields', input),
  updateField: (id: string, input: UpdateCustomFieldInput) =>
    api.patch<unknown, ApiResponse<CustomField>>(`/crm/fields/${id}`, input),
  removeField: (id: string) => api.delete(`/crm/fields/${id}`),
};

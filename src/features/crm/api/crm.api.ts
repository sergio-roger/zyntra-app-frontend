import api from '@shared/api/axios';
import {
  Contact,
  ContactActivity,
  ContactsListResponse,
  CrmMember,
  ListContactsQuery,
  Pipeline,
  Tag,
  CustomField,
  ContactStage,
} from '@crm/types/crm';
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

export const crmApi = {
  list: (query: ListContactsQuery = {}) =>
    api.get<unknown, { data: ContactsListResponse }>(
      `/crm/contacts${buildQS(query as Record<string, unknown>)}`,
    ),

  pipeline: () => api.get<unknown, { data: Pipeline }>('/crm/pipeline'),

  kanban: () => api.get<unknown, { data: Record<ContactStage, Contact[]> }>('/crm/kanban'),

  get: (id: string) => api.get<unknown, { data: Contact }>(`/crm/contacts/${id}`),

  create: (input: CreateContactInput) =>
    api.post<unknown, { data: Contact }>('/crm/contacts', input),

  update: (id: string, input: UpdateContactInput) =>
    api.patch<unknown, { data: Contact }>(`/crm/contacts/${id}`, input),

  remove: (id: string) => api.delete(`/crm/contacts/${id}`),

  listActivities: (contactId: string, query: { page?: number; limit?: number } = {}) =>
    api.get<unknown, { data: { items: ContactActivity[]; total: number } }>(
      `/crm/contacts/${contactId}/activities${buildQS(query)}`,
    ),

  addActivity: (contactId: string, input: CreateActivityInput) =>
    api.post<unknown, { data: ContactActivity }>(
      `/crm/contacts/${contactId}/activities`,
      input,
    ),

  // Tags
  listTags: () => api.get<unknown, { data: Tag[] }>('/crm/tags'),
  createTag: (input: CreateTagInput) =>
    api.post<unknown, { data: Tag }>('/crm/tags', input),
  updateTag: (id: string, input: UpdateTagInput) =>
    api.patch<unknown, { data: Tag }>(`/crm/tags/${id}`, input),
  removeTag: (id: string) => api.delete(`/crm/tags/${id}`),

  // Members (for owner assignment)
  listMembers: () => api.get<unknown, { data: CrmMember[] }>('/crm/members'),

  // Custom Fields
  listFields: () => api.get<unknown, { data: CustomField[] }>('/crm/fields'),
  createField: (input: CreateCustomFieldInput) =>
    api.post<unknown, { data: CustomField }>('/crm/fields', input),
  updateField: (id: string, input: UpdateCustomFieldInput) =>
    api.patch<unknown, { data: CustomField }>(`/crm/fields/${id}`, input),
  removeField: (id: string) => api.delete(`/crm/fields/${id}`),
};

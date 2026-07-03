import { Contact } from './contact';

export interface ContactsListResponse {
  items: Contact[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

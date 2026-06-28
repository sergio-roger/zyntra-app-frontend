import { Contact } from './contact';

export type TaskStatus = 'pending' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CrmTask {
  assignedTo: string | null;
  businessId: string;
  contact?: Contact;
  contactId: string | null;
  createdAt: string;
  dealId?: string | null;
  description: string | null;
  dueDate: string;
  id: string;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
  updatedAt: string;
}

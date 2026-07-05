import { TaskPriority } from './crm-task';

export interface CreateTaskInput {
  contactId?: string;
  dealId?: string;
  description?: string;
  dueDate: string;
  priority?: TaskPriority;
  title: string;
}

import { TaskPriority } from "./crm-task";

export interface CreateTaskInput {
  contact_id?: string;
  deal_id?: string;
  description?: string;
  due_date: string;
  priority?: TaskPriority;
  title: string;
}

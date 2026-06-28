import { Contact } from "./contact";

export type TaskStatus = "pending" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";

export interface CrmTask {
  assigned_to: string | null;
  businessId: string;
  contact_id: string | null;
  contact?: Contact;
  createdAt: string;
  description: string | null;
  due_date: string;
  id: string;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
  updatedAt: string;
}

import { Contact } from "./contact";

export type TaskStatus = "pending" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";

export interface CrmTask {
  assigned_to: string | null;
  business_id: string;
  contact_id: string | null;
  contact?: Contact;
  created_at: string;
  description: string | null;
  due_date: string;
  id: string;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
  updated_at: string;
}

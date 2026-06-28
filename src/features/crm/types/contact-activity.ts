export type ActivityType =
  | "note"
  | "call"
  | "email"
  | "stage_change"
  | "chat"
  | "ai_suggestion";

export type ActivityCreatedBy = "system" | "user" | "ai";

export interface ContactActivity {
  contact_id: string;
  content: string;
  createdAt: string;
  created_by: ActivityCreatedBy;
  id: string;
  metadata: Record<string, unknown>;
  type: ActivityType;
}

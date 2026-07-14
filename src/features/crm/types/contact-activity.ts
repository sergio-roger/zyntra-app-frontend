export type ActivityType =
  'note' | 'call' | 'email' | 'stage_change' | 'chat' | 'ai_suggestion';

export type ActivityCreatedBy = 'system' | 'user' | 'ai';

export interface ContactActivity {
  contactId: string;
  content: string;
  createdAt: string;
  createdBy: ActivityCreatedBy;
  id: string;
  metadata: Record<string, unknown>;
  type: ActivityType;
}

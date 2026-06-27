import { CreateDealInput } from './create-deal-input';

export type ContactSource =
  | 'manual'
  | 'chatbot'
  | 'whatsapp'
  | 'instagram'
  | 'email'
  | 'form'
  | 'import';

export type ActivityType =
  | 'note'
  | 'call'
  | 'email'
  | 'stage_change'
  | 'chat'
  | 'ai_suggestion';

export type ActivityCreatedBy = 'system' | 'user' | 'ai';

export const SOURCES: ContactSource[] = [
  'manual',
  'chatbot',
  'whatsapp',
  'instagram',
  'email',
  'form',
  'import',
];

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'url';

export const SOURCE_LABELS: Record<ContactSource, string> = {
  chatbot: 'Chatbot',
  email: 'Email',
  form: 'Formulario',
  import: 'Importación',
  instagram: 'Instagram',
  manual: 'Manual',
  whatsapp: 'WhatsApp',
};

export type TaskStatus = 'pending' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export type DealStageType = 'active' | 'won' | 'lost';
export type DealStatus = 'open' | 'won' | 'lost' | 'abandoned';

export type UpdateDealInput = Partial<CreateDealInput>;

export type TabKey = 'all' | 'mine' | 'unassigned';

export * from './contact';
export * from './contact-activity';
export * from './contacts-list-response';
export * from './convert-to-deal-input';
export * from './create-deal-input';
export * from './create-segment-input';
export * from './create-task-input';
export * from './crm-member';
export * from './crm-task';
export * from './custom-field';
export * from './deal';
export * from './deal-pipeline';
export * from './deal-pipeline-stage';
export * from './deal-stage-history-record';
export * from './forecast-month';
export * from './kanban-column';
export * from './kanban-response';
export * from './lifecycle-stage';
export * from './list-contacts-query';
export * from './list-deals-query';
export * from './pipeline-forecast';
export * from './segment';
export * from './segment-condition';
export * from './tag';
export * from './update-segment-input';


export type ContactStage =
  | 'lead'
  | 'prospect'
  | 'qualified'
  | 'customer'
  | 'lost';

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

export interface LifecycleStage {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type?: 'active' | 'lost';
  description: string | null;
}

export interface Contact {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  deal_value: number;
  stage: ContactStage;
  source: ContactSource;
  lifecycle_stage_id: string | null;
  lifecycle_stage: LifecycleStage | null;
  tags: Tag[];
  notes: string | null;
  custom_fields: Record<string, any> | null;
  score: number | null;
  is_archived: boolean;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  type: ActivityType;
  content: string;
  metadata: Record<string, unknown>;
  created_by: ActivityCreatedBy;
  created_at: string;
}

export interface ContactsListResponse {
  items: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListContactsQuery {
  stage?: ContactStage;
  source?: ContactSource;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
  is_archived?: boolean;
}

export type Pipeline = Record<ContactStage, number>;

export const STAGES: ContactStage[] = [
  'lead',
  'prospect',
  'qualified',
  'customer',
  'lost',
];

export const SOURCES: ContactSource[] = [
  'manual',
  'chatbot',
  'whatsapp',
  'instagram',
  'email',
  'form',
  'import',
];

export interface Tag {
  id: string;
  business_id: string;
  name: string;
  color: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'url';

export interface CustomField {
  id: string;
  business_id: string;
  name: string;
  label: string;
  type: CustomFieldType;
  options: string[] | null;
  required: boolean;
  is_active: boolean;
  created_at: string;
}

export const STAGE_LABELS: Record<ContactStage, string> = {
  lead: 'Lead',
  prospect: 'Prospecto',
  qualified: 'Calificado',
  customer: 'Cliente',
  lost: 'Perdido',
};

export const SOURCE_LABELS: Record<ContactSource, string> = {
  manual: 'Manual',
  chatbot: 'Chatbot',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  email: 'Email',
  form: 'Formulario',
  import: 'Importación',
};

export type TaskStatus = 'pending' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CrmTask {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  contact_id: string | null;
  contact?: Contact;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date: string;
  priority?: TaskPriority;
  contact_id?: string;
  deal_id?: string;
}

export type DealStage = 
  | 'prospecting' 
  | 'qualification' 
  | 'proposal' 
  | 'negotiation' 
  | 'closing' 
  | 'won' 
  | 'lost';

export type DealStatus = 'open' | 'won' | 'lost' | 'abandoned';

export interface Deal {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  value: number;
  stage: DealStage;
  status: DealStatus;
  contact_id: string;
  contact?: Contact;
  assigned_to_id: string | null;
  assigned_to?: any; // Will refine if needed
  team_id: string | null;
  team?: any;
  expected_close_date: string | null;
  probability: number;
  created_at: string;
  updated_at: string;
}

export interface ListDealsQuery {
  search?: string;
  stage?: DealStage;
  status?: DealStatus;
  contact_id?: string;
  assigned_to_id?: string;
  page?: number;
  limit?: number;
}

export const DEAL_STAGES: DealStage[] = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closing',
  'won',
  'lost',
];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  prospecting: 'Prospección',
  qualification: 'Calificación',
  proposal: 'Propuesta',
  negotiation: 'Negociación',
  closing: 'Cierre',
  won: 'Ganado',
  lost: 'Perdido',
};

export interface ConvertToDealInput {
  title: string;
  value?: number;
  stage?: DealStage;
  expected_close_date?: string;
  description?: string;
}

export interface SegmentCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'is_empty' | 'is_not_empty';
  value: any;
}

export interface Segment {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  conditions: SegmentCondition[];
  created_at: string;
  updated_at: string;
}

export interface CreateSegmentInput {
  name: string;
  description?: string;
  conditions: SegmentCondition[];
}

export interface UpdateSegmentInput {
  name?: string;
  description?: string;
  conditions?: SegmentCondition[];
}


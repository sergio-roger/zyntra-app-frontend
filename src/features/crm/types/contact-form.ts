export interface ContactFormData {
  channelId?: string;
  customFields: Record<string, any>;
  email: string;
  lifecycleStageId: string;
  name: string;
  notes: string;
  ownerId: string | null;
  phone: string;
  tags: string[];
}

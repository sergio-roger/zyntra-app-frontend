import { Contact } from '@crm/types/contact';
import { ContactFormData } from '@crm/types/contact-form';
import { LifecycleStage } from '@crm/types/lifecycle-stage';

export function formDataFromContact(contact: Contact): ContactFormData {
  return {
    name: contact.name,
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    lifecycleStageId: contact.lifecycleStageId ?? '',
    source: contact.source ?? 'manual',
    ownerId: contact.ownerId ?? null,
    tags:
      contact.tags?.map((t: any) => (typeof t === 'string' ? t : t.id)) ?? [],
    notes: contact.notes ?? '',
    customFields: contact.customFields ?? {},
  };
}

export function defaultContactFormData(
  stages: LifecycleStage[],
  ownerId?: string | null,
): ContactFormData {
  const firstActiveStage = stages.find((s) => s.type === 'active');
  return {
    name: '',
    email: '',
    phone: '',
    lifecycleStageId: firstActiveStage?.id ?? '',
    source: 'manual',
    ownerId: ownerId ?? null,
    tags: [],
    notes: '',
    customFields: {},
  };
}

import { LifecycleStage } from "./lifecycle-stage";
import { CrmMember } from "./crm-member";
import { Tag } from "./tag";

export type ContactSource =
  "manual" | "chatbot" | "whatsapp" | "instagram" | "email" | "form" | "import";

export const SOURCES: ContactSource[] = [
  "manual",
  "chatbot",
  "whatsapp",
  "instagram",
  "email",
  "form",
  "import",
];

export const SOURCE_LABELS: Record<ContactSource, string> = {
  chatbot: "Chatbot",
  email: "Email",
  form: "Formulario",
  import: "Importación",
  instagram: "Instagram",
  manual: "Manual",
  whatsapp: "WhatsApp",
};

export interface ContactCompany {
  id: string;
  name: string;
}

export interface Contact {
  businessId: string;
  company: ContactCompany | null;
  companyId: string | null;
  createdAt: string;
  customFields: Record<string, any> | null;
  dealValue: number;
  email: string | null;
  id: string;
  isArchived: boolean;
  lastActivityAt: string | null;
  lifecycleStage: LifecycleStage | null;
  lifecycleStageId: string | null;
  name: string;
  notes: string | null;
  owner: CrmMember | null;
  ownerId: string | null;
  phone: string | null;
  score: number | null;
  source: ContactSource;
  tags: Tag[];
  updatedAt: string;
}

import React from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Camera,
  FileText,
  Upload,
  Hand,
  LucideIcon,
} from 'lucide-react';
import { SOURCE_LABELS, ContactSource } from '@crm/types/crm';

const SOURCE_ICONS: Record<ContactSource, LucideIcon> = {
  manual: Hand,
  chatbot: MessageSquare,
  whatsapp: Phone,
  instagram: Camera,
  email: Mail,
  form: FileText,
  import: Upload,
};

export const SourceBadge: React.FC<{ source: ContactSource }> = ({
  source,
}) => {
  const Icon = SOURCE_ICONS[source];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
      <Icon size={12} />
      {SOURCE_LABELS[source]}
    </span>
  );
};

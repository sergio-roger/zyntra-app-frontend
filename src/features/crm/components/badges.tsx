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
import {
  STAGE_LABELS,
  SOURCE_LABELS,
  ContactStage,
  ContactSource,
} from '@crm/types/crm';

const STAGE_CLASSES: Record<ContactStage, string> = {
  lead: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
  prospect: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  qualified: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  customer: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  lost: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
};

const SOURCE_ICONS: Record<ContactSource, LucideIcon> = {
  manual: Hand,
  chatbot: MessageSquare,
  whatsapp: Phone,
  instagram: Camera,
  email: Mail,
  form: FileText,
  import: Upload,
};

export const StageBadge: React.FC<{ stage: ContactStage | null }> = ({ stage }) => {
  if (!stage) return <span className="text-slate-600">—</span>;
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STAGE_CLASSES[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
};

export const SourceBadge: React.FC<{ source: ContactSource }> = ({ source }) => {
  const Icon = SOURCE_ICONS[source];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
      <Icon size={12} />
      {SOURCE_LABELS[source]}
    </span>
  );
};

import React from 'react';
import {
  Archive,
  ArrowRightCircle,
  Bot,
  FileText,
  Mail,
  MessageCircle,
  Share2,
  Upload,
  User,
  Inbox,
} from 'lucide-react';
import { Contact, ContactSource } from '@crm/types/crm';
import { SOURCE_LABELS } from '@crm/types/crm';

interface LeadsTableProps {
  leads: Contact[];
  onArchive: (lead: Contact) => void;
  onConvert: (lead: Contact) => void;
}

const SOURCE_ICONS: Record<ContactSource, React.ReactNode> = {
  manual: <User size={12} />,
  chatbot: <Bot size={12} />,
  whatsapp: <MessageCircle size={12} />,
  instagram: <Share2 size={12} />,
  email: <Mail size={12} />,
  form: <FileText size={12} />,
  import: <Upload size={12} />,
};

const SOURCE_COLORS: Record<ContactSource, string> = {
  manual: 'bg-slate-500/20 text-slate-300 border-slate-500/20',
  chatbot: 'bg-violet-500/20 text-violet-300 border-violet-500/20',
  whatsapp: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  instagram: 'bg-pink-500/20 text-pink-300 border-pink-500/20',
  email: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  form: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  import: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
};

const AVATAR_COLORS = [
  'bg-violet-500/30 text-violet-300',
  'bg-blue-500/30 text-blue-300',
  'bg-emerald-500/30 text-emerald-300',
  'bg-amber-500/30 text-amber-300',
  'bg-rose-500/30 text-rose-300',
  'bg-cyan-500/30 text-cyan-300',
  'bg-indigo-500/30 text-indigo-300',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es', { day: '2-digit', month: 'short' });
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onArchive, onConvert }) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-600">
          <Inbox size={32} />
        </div>
        <div className="text-center">
          <p className="text-slate-300 font-bold text-sm">No hay leads en el inbox</p>
          <p className="text-slate-500 text-xs mt-1">Los nuevos leads aparecerán aquí automáticamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/30">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Lead</th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Contacto</th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden lg:table-cell">Fuente</th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden xl:table-cell">Etiqueta</th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden lg:table-cell">Registrado</th>
            <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => {
            const avatarColor = getAvatarColor(lead.name);
            const initials = getInitials(lead.name);
            const firstTag = lead.tags?.[0];

            return (
              <tr
                key={lead.id}
                className={`group border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${idx === leads.length - 1 ? 'border-b-0' : ''}`}
              >
                {/* Lead / Avatar + Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${avatarColor}`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate max-w-[140px]">{lead.name}</p>
                      {lead.companyName && (
                        <p className="text-slate-500 text-xs truncate max-w-[140px]">{lead.companyName}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contact info */}
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-300 text-xs truncate max-w-[180px]">{lead.email || '—'}</span>
                    <span className="text-slate-500 text-xs">{lead.phone || '—'}</span>
                  </div>
                </td>

                {/* Source */}
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-semibold ${SOURCE_COLORS[lead.source]}`}>
                    {SOURCE_ICONS[lead.source]}
                    {SOURCE_LABELS[lead.source]}
                  </span>
                </td>

                {/* Tag */}
                <td className="px-5 py-3.5 hidden xl:table-cell">
                  {firstTag ? (
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                      style={{
                        backgroundColor: `${firstTag.color}20`,
                        color: firstTag.color,
                        borderColor: `${firstTag.color}30`,
                      }}
                    >
                      {firstTag.name}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">Sin etiqueta</span>
                  )}
                </td>

                {/* Created at */}
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-slate-500 text-xs">{relativeTime(lead.createdAt)}</span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onConvert(lead)}
                      title="Convertir a negocio"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all active:scale-95"
                    >
                      <ArrowRightCircle size={13} />
                      <span className="hidden sm:inline">Convertir</span>
                    </button>
                    <button
                      onClick={() => onArchive(lead)}
                      title="Archivar lead"
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-white/5 transition-all active:scale-95"
                    >
                      <Archive size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

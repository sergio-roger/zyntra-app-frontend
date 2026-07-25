import { Button } from '@core/ui/Button';
import { Contact } from '@crm/types/contact';
import {
  Archive,
  ArrowRightCircle,
  Inbox,
} from 'lucide-react';
import React from 'react';

interface LeadsTableProps {
  leads: Contact[];
  onArchive: (lead: Contact) => void;
  onConvert: (lead: Contact) => void;
}

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
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
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
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
  });
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onArchive,
  onConvert,
}) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-base-300/60 flex items-center justify-center text-base-content/40">
          <Inbox size={32} />
        </div>
        <div className="text-center">
          <p className="text-base-content/80 font-bold text-sm">
            No hay leads en el inbox
          </p>
          <p className="text-base-content/50 text-xs mt-1">
            Los nuevos leads aparecerán aquí automáticamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-200/50 shadow-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-300">
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/50">
              Lead
            </th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/50 hidden md:table-cell">
              Contacto
            </th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/50 hidden lg:table-cell">
              Canal
            </th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/50 hidden xl:table-cell">
              Etiqueta
            </th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/50 hidden lg:table-cell">
              Registrado
            </th>
            <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/50">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => {
            const avatarColor = getAvatarColor(lead.name);
            const initials = getInitials(lead.name);
            const firstTag = lead.tags?.[0];
            const channelName = lead.channel?.name || 'Manual';

            return (
              <tr
                key={lead.id}
                className={`group border-b border-base-300/50 hover:bg-base-300/20 transition-colors ${idx === leads.length - 1 ? 'border-b-0' : ''}`}
              >
                {/* Lead / Avatar + Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${avatarColor}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base-content font-semibold text-sm truncate max-w-[140px]">
                        {lead.name}
                      </p>
                      {lead.company?.name && (
                        <p className="text-base-content/50 text-xs truncate max-w-[140px]">
                          {lead.company.name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contact info */}
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base-content/70 text-xs truncate max-w-[180px]">
                      {lead.email || '—'}
                    </span>
                    <span className="text-base-content/50 text-xs">
                      {lead.phone || '—'}
                    </span>
                  </div>
                </td>

                {/* Channel */}
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {channelName}
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
                    <span className="text-base-content/40 text-xs">Sin etiqueta</span>
                  )}
                </td>

                {/* Created at */}
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-base-content/50 text-xs">
                    {relativeTime(lead.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="tertiary"
                      outline
                      size="sm"
                      onClick={() => onConvert(lead)}
                      title="Convertir a negocio"
                      icon={ArrowRightCircle}
                    >
                      <span className="hidden sm:inline">Convertir</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onArchive(lead)}
                      title="Archivar lead"
                      aria-label="Archivar lead"
                      icon={Archive}
                    />
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

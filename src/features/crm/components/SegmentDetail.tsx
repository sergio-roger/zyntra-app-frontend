import React, { useState, useEffect } from 'react';
import { Edit2, Filter, Loader2, Pencil, Tag, Users } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';
import { useSegmentContacts } from '@crm/hooks/useSegments';
import { Segment, Contact, LifecycleStage } from '@crm/types/crm';
import { Pagination } from '@crm/components/Pagination';
import { StageBadge, SourceBadge } from '@crm/components/badges';
import { ContactFormSidebar } from '@crm/components/ContactFormSidebar';
import api from '@shared/api/axios';

interface SegmentDetailProps {
  segment: Segment;
  onEdit: (seg: Segment) => void;
  onRefresh: () => void;
}

export const SegmentDetail: React.FC<SegmentDetailProps> = ({ segment, onEdit, onRefresh }) => {
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [stages, setStages] = useState<LifecycleStage[]>([]);

  const { data, isLoading } = useSegmentContacts(segment.id, { page, limit: 10 });

  useEffect(() => {
    setPage(1);
  }, [segment.id]);

  useEffect(() => {
    api.get('/lifecycle/stages')
      .then((r) => setStages(r.data))
      .catch(() => {});
  }, []);

  const openContactEdit = (c: Contact) => {
    setEditingContact(c);
    setSidebarOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 pt-5 pb-4 border-b border-slate-700/40 gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-black text-white leading-tight truncate">{segment.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {segment.description || 'Sin descripción.'}
          </p>
          {segment.conditions?.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <Filter size={10} className="text-slate-500" />
              <span className="text-[10px] text-slate-500 font-medium">
                {segment.conditions.length} regla
                {segment.conditions.length !== 1 ? 's' : ''} activa
                {segment.conditions.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => onEdit(segment)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shadow-md active:scale-95 self-start sm:self-center shrink-0"
        >
          <Edit2 size={13} /> Editar Reglas
        </button>
      </div>

      {/* Contacts */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-sm text-slate-500 font-medium animate-pulse">
              Filtrando base de datos…
            </p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Segmento vacío"
            description="Ningún contacto cumple con las reglas definidas. Edita las condiciones para ampliar el alcance."
            actionLabel="Editar reglas"
            onAction={() => onEdit(segment)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-950/20 border border-slate-700/40 px-4 py-2.5 rounded-xl">
              <span>Contactos en este segmento</span>
              <span className="font-extrabold text-white">{data.total}</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-700/40 bg-slate-900/40">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700/40 bg-slate-900/80 text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Contacto</th>
                    <th className="px-4 py-3">Etapa</th>
                    <th className="px-4 py-3">Ciclo de vida</th>
                    <th className="px-4 py-3">Origen</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((c) => (
                    <tr
                      key={c.id}
                      className="group border-b border-slate-800/40 transition-colors last:border-0 hover:bg-white/5"
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-100">{c.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-slate-200 text-xs">{c.email ?? '—'}</span>
                          {c.phone && (
                            <span className="text-slate-500 text-[10px] mt-0.5">{c.phone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StageBadge stage={c.stage} />
                      </td>
                      <td className="px-4 py-3">
                        {c.lifecycleStage ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                            style={{
                              backgroundColor: `${c.lifecycleStage.color}20`,
                              color: c.lifecycleStage.color,
                              border: `1px solid ${c.lifecycleStage.color}40`,
                            }}
                          >
                            {c.lifecycleStage.icon && (
                              <span className="text-[11px] leading-none">{c.lifecycleStage.icon}</span>
                            )}
                            {c.lifecycleStage.name}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SourceBadge source={c.source} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openContactEdit(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                            title="Editar contacto"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => openContactEdit(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Etiquetas"
                          >
                            <Tag size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      <ContactFormSidebar
        open={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setEditingContact(null);
          onRefresh();
        }}
        contact={editingContact}
        stages={stages}
      />
    </div>
  );
};

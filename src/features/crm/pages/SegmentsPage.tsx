import React, { useState } from 'react';
import { Plus, Users, Loader2, Save, X, Edit, Trash } from 'lucide-react';
import {
  useSegmentsList,
  useCreateSegment,
  useUpdateSegment,
  useDeleteSegment,
  useSegmentContacts,
  usePreviewContacts,
} from '@crm/hooks/useSegments';
import { ConditionBuilder } from '@crm/components/ConditionBuilder';
import { Segment, SegmentCondition } from '@crm/types';
import { ContactTable } from '@crm/components/ContactTable';
import { Pagination } from '@crm/components/Pagination';

export const SegmentsPage: React.FC = () => {
  const { data: segments = [], isLoading: loadingSegments, refetch: refetchSegments } = useSegmentsList();
  const createMutation = useCreateSegment();
  const updateMutation = useUpdateSegment();
  const deleteMutation = useDeleteSegment();

  // Selection states
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState<SegmentCondition[]>([]);

  // Pagination
  const [page, setPage] = useState(1);

  // Fetch contacts for selected segment
  const { data: segmentContactsData, isLoading: loadingContacts } = useSegmentContacts(
    selectedSegmentId || '',
    { page, limit: 10 }
  );

  // Preview contacts
  const { data: previewData, isLoading: loadingPreview } = usePreviewContacts(
    conditions,
    { page: 1, limit: 5 },
    isEditing || isCreating
  );

  const selectedSegment = segments.find((s) => s.id === selectedSegmentId);

  const handleCreateNew = () => {
    setName('');
    setDescription('');
    setConditions([]);
    setIsCreating(true);
    setIsEditing(false);
    setSelectedSegmentId(null);
  };

  const handleEdit = (seg: Segment) => {
    setName(seg.name);
    setDescription(seg.description || '');
    setConditions(seg.conditions || []);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este segmento inteligente? Las reglas se perderán.')) return;
    await deleteMutation.mutateAsync(id);
    if (selectedSegmentId === id) {
      setSelectedSegmentId(null);
    }
    refetchSegments();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      const newSeg = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        conditions,
      });
      setIsCreating(false);
      setSelectedSegmentId(newSeg.id);
    } else if (isEditing && selectedSegmentId) {
      await updateMutation.mutateAsync({
        id: selectedSegmentId,
        input: {
          name: name.trim(),
          description: description.trim() || undefined,
          conditions,
        },
      });
      setIsEditing(false);
    }
    refetchSegments();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (selectedSegment) {
      setName(selectedSegment.name);
      setDescription(selectedSegment.description || '');
      setConditions(selectedSegment.conditions);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-120px)] animate-in fade-in duration-500">
      {/* Left Column: Segments List */}
      <div className="w-full lg:w-80 bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-indigo-400" />
            Segmentos
          </h3>
          <button
            onClick={handleCreateNew}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
            title="Crear segmento"
          >
            <Plus size={16} />
          </button>
        </div>

        {loadingSegments ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-indigo-500" size={24} />
          </div>
        ) : segments.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-medium">
            No tienes segmentos inteligentes.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[400px] lg:max-h-none">
            {segments.map((seg) => {
              const active = selectedSegmentId === seg.id;
              return (
                <div
                  key={seg.id}
                  onClick={() => {
                    setSelectedSegmentId(seg.id);
                    setIsEditing(false);
                    setIsCreating(false);
                    setPage(1);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    active
                      ? 'bg-indigo-600/10 border-indigo-500/20 text-white'
                      : 'border-transparent bg-slate-950/20 hover:bg-slate-900/40 text-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{seg.name}</p>
                    {seg.description && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{seg.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSegmentId(seg.id);
                        handleEdit(seg);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Editar"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(seg.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Work Area */}
      <div className="flex-1 bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
        {isCreating || isEditing ? (
          /* Create or Edit View */
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">
                  {isCreating ? 'Crear Segmento Inteligente' : `Editar Segmento: ${selectedSegment?.name}`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Define las reglas para filtrar automáticamente tus contactos en tiempo real.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all"
                >
                  <X size={14} /> Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <Save size={14} /> Guardar Segmento
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nombre del Segmento
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Clientes de WhatsApp"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el propósito del segmento..."
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 placeholder-slate-600"
                  />
                </div>

                <ConditionBuilder conditions={conditions} onChange={setConditions} />
              </div>

              {/* Real-time Preview */}
              <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Previsualización del Segmento</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Mostrando primeros 5 contactos que coinciden actualmente.</p>
                </div>

                {loadingPreview ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    <p className="text-xs text-slate-500 animate-pulse font-medium">Calculando coincidencias...</p>
                  </div>
                ) : !previewData || previewData.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <Users size={32} className="text-slate-700" />
                    <p className="text-xs text-slate-500 font-medium">Ningún contacto coincide con las reglas actuales.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-indigo-500/5 border border-indigo-500/10 px-3 py-2 rounded-xl text-xs text-indigo-300">
                      <span>Total de coincidencias en base de datos:</span>
                      <span className="font-black">{previewData.total}</span>
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[300px]">
                      {previewData.items.map((c) => (
                        <div key={c.id} className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-xl border border-white/5 text-xs">
                          <div>
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{c.email || c.phone || 'Sin contacto'}</p>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {c.stage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        ) : selectedSegmentId ? (
          /* Segment detail view */
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 gap-4">
              <div>
                <h2 className="text-xl font-black text-white">{selectedSegment?.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedSegment?.description || 'Sin descripción.'}</p>
              </div>
              <button
                onClick={() => selectedSegment && handleEdit(selectedSegment)}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shadow-md self-start sm:self-center"
              >
                <Edit size={14} /> Editar Reglas
              </button>
            </div>

            {loadingContacts ? (
              <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-sm text-slate-500 font-medium animate-pulse">Filtrando base de datos...</p>
              </div>
            ) : !segmentContactsData || segmentContactsData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-slate-950/10 rounded-2xl border border-white/5">
                <Users size={48} className="text-slate-700" />
                <div>
                  <h4 className="text-base font-bold text-white">Segmento vacío</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                    Actualmente ningún contacto cumple con las reglas definidas para este segmento inteligente.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-950/20 border border-white/5 px-4 py-2.5 rounded-xl">
                  <span>Contactos en este segmento:</span>
                  <span className="font-extrabold text-white">{segmentContactsData.total} registrados</span>
                </div>

                <ContactTable
                  contacts={segmentContactsData.items}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onSelect={() => {}}
                />

                <Pagination
                  page={segmentContactsData.page}
                  totalPages={segmentContactsData.totalPages}
                  total={segmentContactsData.total}
                  onChange={setPage}
                />
              </div>
            )}
          </div>
        ) : (
          /* Empty state view */
          <div className="flex flex-col items-center justify-center py-36 text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users size={32} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-black text-white">Segmentos Inteligentes</h3>
              <p className="text-sm text-slate-500 mt-2">
                Selecciona un segmento existente de la lista de la izquierda o crea uno nuevo para empezar a filtrar tus contactos dinámicamente.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 mt-2"
            >
              <Plus size={16} /> Crear primer segmento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

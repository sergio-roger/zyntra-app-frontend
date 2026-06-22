import React, { useState, useEffect } from 'react';
import { Plus, Users, Loader2, Save, X, Edit2, Trash2, ChevronRight, Filter, Pencil, Tag } from 'lucide-react';
import {
  useSegmentsList,
  useCreateSegment,
  useUpdateSegment,
  useDeleteSegment,
  useSegmentContacts,
  usePreviewContacts,
} from '@crm/hooks/useSegments';
import { ConditionBuilder } from '@crm/components/ConditionBuilder';
import { Segment, SegmentCondition, Contact, LifecycleStage } from '@crm/types';
import { Pagination } from '@crm/components/Pagination';
import { StageBadge, SourceBadge } from '@crm/components/badges';
import { ContactFormSidebar } from '@crm/components/ContactFormSidebar';
import api from '@shared/api/axios';

export const SegmentsPage: React.FC = () => {
  const { data: segments = [], isLoading: loadingSegments, refetch: refetchSegments } =
    useSegmentsList();
  const createMutation = useCreateSegment();
  const updateMutation = useUpdateSegment();
  const deleteMutation = useDeleteSegment();

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState<SegmentCondition[]>([]);
  const [page, setPage] = useState(1);

  // States for ContactFormSidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [stages, setStages] = useState<LifecycleStage[]>([]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await api.get('/lifecycle/stages');
        setStages(response.data);
      } catch (error) {
        console.error('Error fetching lifecycle stages:', error);
      }
    };
    fetchStages();
  }, []);

  const openContactEdit = (c: Contact) => {
    setEditingContact(c);
    setSidebarOpen(true);
  };

  const { data: segmentContactsData, isLoading: loadingContacts } = useSegmentContacts(
    selectedSegmentId || '',
    { page, limit: 10 }
  );

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
    if (!confirm('¿Estás seguro de eliminar este segmento? Las reglas se perderán.')) return;
    await deleteMutation.mutateAsync(id);
    if (selectedSegmentId === id) setSelectedSegmentId(null);
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
        input: { name: name.trim(), description: description.trim() || undefined, conditions },
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
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-140px)] animate-in fade-in duration-500">

        {/* ── Left Panel: Segment list ── */}
        <aside className="w-full lg:w-72 shrink-0 bg-slate-900/40 border border-slate-700/40 rounded-2xl p-4 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-indigo-500/15 flex items-center justify-center">
                <Users size={13} className="text-indigo-400" />
              </div>
              <h3 className="text-sm font-black text-white tracking-tight">Segmentos</h3>
              {segments.length > 0 && (
                <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">
                  {segments.length}
                </span>
              )}
            </div>
            <button
              onClick={handleCreateNew}
              className="h-7 w-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Crear segmento"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* List */}
          {loadingSegments ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={22} />
            </div>
          ) : segments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="h-10 w-10 rounded-full bg-slate-800/60 flex items-center justify-center">
                <Users size={18} className="text-slate-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[160px]">
                Aún no tienes segmentos. Crea el primero.
              </p>
              <button
                onClick={handleCreateNew}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                + Nuevo segmento
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[360px] lg:max-h-none -mx-1 px-1">
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
                    className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                      active
                        ? 'bg-indigo-600/10 border-indigo-500/20 text-white'
                        : 'border-transparent hover:bg-slate-900/50 text-slate-300 hover:text-white'
                    }`}
                  >
                    <ChevronRight
                      size={12}
                      className={`shrink-0 transition-all ${
                        active ? 'text-indigo-400 opacity-100' : 'opacity-0 group-hover:opacity-40'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate leading-tight">{seg.name}</p>
                      {seg.description && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {seg.description}
                        </p>
                      )}
                      {seg.conditions?.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Filter size={9} className="text-slate-600" />
                          <span className="text-[9px] text-slate-600 font-medium">
                            {seg.conditions.length} regla{seg.conditions.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSegmentId(seg.id);
                          handleEdit(seg);
                        }}
                        className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(seg.id);
                        }}
                        className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* ── Right Panel: Work area ── */}
        <main className="flex-1 min-w-0 bg-slate-900/20 border border-slate-700/40 rounded-2xl flex flex-col">

          {isCreating || isEditing ? (
            /* ── Form view ── */
            <form onSubmit={handleSave} className="flex flex-col h-full">

              {/* Form header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-700/40 gap-4">
                <div>
                  <h3 className="text-base font-black text-white leading-tight">
                    {isCreating ? 'Nuevo Segmento Inteligente' : `Editando: ${selectedSegment?.name}`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Define reglas para filtrar contactos automáticamente en tiempo real.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700/60 bg-slate-800/80 text-slate-300 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all"
                  >
                    <X size={13} />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || createMutation.isPending || updateMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    Guardar
                  </button>
                </div>
              </div>

              {/* Form body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex flex-col xl:flex-row xl:items-stretch gap-6 h-full">

                  {/* Left: fields + conditions */}
                  <div className="flex-1 min-w-0 space-y-5">
                    {/* Name + Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Nombre del segmento <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej: Clientes de WhatsApp"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 placeholder-slate-600 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Descripción <span className="text-slate-600 normal-case font-normal tracking-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe el propósito del segmento…"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 placeholder-slate-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/20 p-4">
                      <ConditionBuilder conditions={conditions} onChange={setConditions} />
                    </div>
                  </div>

                  {/* Right: live preview */}
                  <div className="w-full xl:w-[300px] shrink-0 xl:h-full">
                    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4 flex flex-col gap-4 min-h-[280px] xl:h-full">
                      <div className="border-b border-slate-700/40 pb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Vista Previa
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          Primeros 5 contactos que coinciden.
                        </p>
                      </div>

                      {loadingPreview ? (
                        <div className="flex flex-col items-center justify-center py-14 gap-2">
                          <Loader2 className="animate-spin text-indigo-500" size={24} />
                          <p className="text-[10px] text-slate-500 animate-pulse">Calculando…</p>
                        </div>
                      ) : !previewData || previewData.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-center gap-2">
                          <Users size={24} className="text-slate-700" />
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[180px]">
                            Ningún contacto coincide con las reglas actuales.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between items-center bg-indigo-500/8 border border-indigo-500/15 px-3 py-2 rounded-lg text-xs text-indigo-300">
                            <span className="text-indigo-400/70">Total coincidencias</span>
                            <span className="font-black">{previewData.total}</span>
                          </div>
                          <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                            {previewData.items.map((c) => (
                              <div
                                key={c.id}
                                className="flex justify-between items-center bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/40 text-xs"
                              >
                                <div className="min-w-0 mr-2">
                                  <p className="font-bold text-white truncate">{c.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                    {c.email || c.phone || 'Sin contacto'}
                                  </p>
                                </div>
                                <span className="shrink-0 text-[9px] uppercase font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/15">
                                  {c.stage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>

          ) : selectedSegmentId ? (
            /* ── Detail view ── */
            <div className="flex flex-col gap-0 h-full">
              {/* Detail header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 pt-5 pb-4 border-b border-slate-700/40 gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-white leading-tight truncate">
                    {selectedSegment?.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedSegment?.description || 'Sin descripción.'}
                  </p>
                  {selectedSegment?.conditions?.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Filter size={10} className="text-slate-500" />
                      <span className="text-[10px] text-slate-500 font-medium">
                        {selectedSegment.conditions.length} regla
                        {selectedSegment.conditions.length !== 1 ? 's' : ''} activa
                        {selectedSegment.conditions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => selectedSegment && handleEdit(selectedSegment)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shadow-md active:scale-95 self-start sm:self-center shrink-0"
                >
                  <Edit2 size={13} /> Editar Reglas
                </button>
              </div>

              {/* Contacts body */}
              <div className="flex-1 p-6">
                {loadingContacts ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-3">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    <p className="text-sm text-slate-500 font-medium animate-pulse">
                      Filtrando base de datos…
                    </p>
                  </div>
                ) : !segmentContactsData || segmentContactsData.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-slate-950/10 rounded-2xl border border-slate-700/40">
                    <div className="h-14 w-14 rounded-full bg-slate-800/60 flex items-center justify-center">
                      <Users size={24} className="text-slate-700" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Segmento vacío</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1.5 mx-auto leading-relaxed">
                        Ningún contacto cumple con las reglas definidas. Edita las condiciones para
                        ampliar el alcance.
                      </p>
                    </div>
                    <button
                      onClick={() => selectedSegment && handleEdit(selectedSegment)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                    >
                      Editar reglas →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-950/20 border border-slate-700/40 px-4 py-2.5 rounded-xl">
                      <span>Contactos en este segmento</span>
                      <span className="font-extrabold text-white">{segmentContactsData.total}</span>
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
                          {segmentContactsData.items.map((c) => (
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
                                  {c.phone && <span className="text-slate-500 text-[10px] mt-0.5">{c.phone}</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <StageBadge stage={c.stage} />
                              </td>
                              <td className="px-4 py-3">
                                {c.lifecycle_stage ? (
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                                    style={{
                                      backgroundColor: `${c.lifecycle_stage.color}20`,
                                      color: c.lifecycle_stage.color,
                                      border: `1px solid ${c.lifecycle_stage.color}40`,
                                    }}
                                  >
                                    {c.lifecycle_stage.name}
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
                      page={segmentContactsData.page}
                      totalPages={segmentContactsData.totalPages}
                      total={segmentContactsData.total}
                      onChange={setPage}
                    />
                  </div>
                )}
              </div>
            </div>

          ) : (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center h-full py-36 text-center gap-5 px-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
                  <Users size={36} className="text-indigo-400/70" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center">
                  <Filter size={10} className="text-white" />
                </div>
              </div>
              <div className="max-w-sm">
                <h3 className="text-lg font-black text-white">Segmentos Inteligentes</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Crea segmentos con reglas dinámicas para filtrar tus contactos automáticamente y
                  actuar sobre grupos específicos.
                </p>
              </div>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 mt-1"
              >
                <Plus size={16} /> Crear primer segmento
              </button>
            </div>
          )}
        </main>
      </div>

      <ContactFormSidebar
        open={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setEditingContact(null);
          // Refrescar los segmentos o los contactos para reflejar cambios
          refetchSegments();
        }}
        contact={editingContact}
        stages={stages}
      />
    </div>
  );
};

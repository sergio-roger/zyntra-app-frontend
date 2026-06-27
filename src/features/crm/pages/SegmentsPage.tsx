import { SegmentDetail } from '@crm/components/SegmentDetail';
import { SegmentEditor } from '@crm/components/SegmentEditor';
import { SegmentListPanel } from '@crm/components/SegmentListPanel';
import {
  useCreateSegment,
  useDeleteSegment,
  useSegmentsList,
  useUpdateSegment,
} from '@crm/hooks/useSegments';
import { Segment } from '@crm/types/segment';
import { SegmentCondition } from '@crm/types/segment-condition';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { Users } from 'lucide-react';
import React, { useState } from 'react';

export const SegmentsPage: React.FC = () => {
  const { data: segments = [], isLoading, refetch } = useSegmentsList();
  const createMutation = useCreateSegment();
  const updateMutation = useUpdateSegment();
  const deleteMutation = useDeleteSegment();

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingSegmentId, setDeletingSegmentId] = useState<string | null>(null);

  const selectedSegment = segments.find((s) => s.id === selectedSegmentId) ?? null;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSelect = (id: string) => {
    setSelectedSegmentId(id);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedSegmentId(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (seg: Segment) => {
    setSelectedSegmentId(seg.id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setDeletingSegmentId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSegmentId) return;
    await deleteMutation.mutateAsync(deletingSegmentId);
    if (selectedSegmentId === deletingSegmentId) setSelectedSegmentId(null);
    setDeletingSegmentId(null);
    refetch();
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    conditions: SegmentCondition[];
  }) => {
    if (isCreating) {
      const newSeg = await createMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        conditions: data.conditions,
      });
      setIsCreating(false);
      setSelectedSegmentId(newSeg.id);
    } else if (isEditing && selectedSegmentId) {
      await updateMutation.mutateAsync({
        id: selectedSegmentId,
        input: {
          name: data.name,
          description: data.description || undefined,
          conditions: data.conditions,
        },
      });
      setIsEditing(false);
    }
    refetch();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-140px)] animate-in fade-in duration-500">
        <SegmentListPanel
          segments={segments}
          isLoading={isLoading}
          selectedId={selectedSegmentId}
          onSelect={handleSelect}
          onCreate={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <main className="flex-1 min-w-0 bg-slate-900/20 border border-slate-700/40 rounded-2xl flex flex-col">
          {isCreating || isEditing ? (
            <SegmentEditor
              segment={isEditing ? selectedSegment : null}
              isPending={isPending}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : selectedSegment ? (
            <SegmentDetail
              segment={selectedSegment}
              onEdit={handleEdit}
              onRefresh={refetch}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="Segmentos Inteligentes"
              description="Crea segmentos con reglas dinámicas para filtrar tus contactos automáticamente y actuar sobre grupos específicos."
              actionLabel="Crear primer segmento"
              onAction={handleCreateNew}
            />
          )}
        </main>
      </div>
      <ConfirmModal
        isOpen={!!deletingSegmentId}
        onClose={() => setDeletingSegmentId(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar segmento"
        description="¿Estás seguro de eliminar este segmento? Las reglas definidas se perderán de forma permanente."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
};

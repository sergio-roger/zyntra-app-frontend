import { dealsApi } from '@crm/api/deals.api';
import { dealsKeys } from '@crm/hooks/useDeals';
import { useKanbanStore } from '@crm/store/kanbanStore';
import { Deal, KanbanResponse } from '@crm/types/crm';
import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { DealCard } from './DealCard';
import { DealsColumn } from './DealsColumn';

interface DealsKanbanProps {
  kanbanData: KanbanResponse;
  onDealClick?: (deal: Deal) => void;
}

const kanbanCollision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  if (hits.length > 0) return hits;
  return rectIntersection(args);
};

export const DealsKanban: React.FC<DealsKanbanProps> = ({ kanbanData, onDealClick }) => {
  const qc = useQueryClient();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const { pendingMoves, setPendingMove, clearPendingMove } = useKanbanStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const displayData = useMemo<KanbanResponse>(() => {
    if (Object.keys(pendingMoves).length === 0) return kanbanData;

    const allDeals = kanbanData.columns.flatMap((c) => c.deals);

    return {
      ...kanbanData,
      columns: kanbanData.columns.map((col) => {
        const staying = col.deals.filter(
          (d) => !pendingMoves[d.id] || pendingMoves[d.id] === col.stage.id,
        );
        const arriving = allDeals.filter(
          (d) =>
            pendingMoves[d.id] === col.stage.id &&
            col.deals.every((existing) => existing.id !== d.id),
        );
        const merged = [
          ...staying,
          ...arriving.map((d) => ({ ...d, stage_id: col.stage.id })),
        ];
        return {
          ...col,
          deals: merged,
          total_value: merged.reduce((s, d) => s + Number(d.value), 0),
        };
      }),
    };
  }, [kanbanData, pendingMoves]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const dealId = event.active.id as string;
    const deal = kanbanData.columns
      .flatMap((col) => col.deals)
      .find((d) => d.id === dealId);
    setActiveDeal(deal ?? null);
  }, [kanbanData]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveDeal(null);
      const { active, over } = event;
      if (!over) return;

      const dealId = active.id as string;
      const newStageId = over.id as string;

      const sourceCol = kanbanData.columns.find((col) =>
        col.deals.some((d) => d.id === dealId),
      );
      if (!sourceCol || sourceCol.stage.id === newStageId) return;

      const queryKey = dealsKeys.kanban(kanbanData.pipeline.id);

      // 1. Immediate visual move via Zustand
      setPendingMove(dealId, newStageId);

      try {
        // 2. Persist on the server — capture the full updated deal (includes
        //    stage, contact, and other relations) so we can patch the cache
        //    with exact server data and avoid a second round-trip.
        const { data: updatedDeal } = await dealsApi.update(dealId, {
          stage_id: newStageId,
          pipeline_id: kanbanData.pipeline.id,
        });

        // 3. Patch the cache with the server-returned deal so every field
        //    (including the stage relation object) is already correct.
        //    This prevents the "pulse" that occurred when setQueryData only
        //    set stage_id and the background invalidation later brought in
        //    the full stage object — causing a visible diff and re-render.
        qc.setQueryData<KanbanResponse>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            columns: old.columns.map((col) => {
              if (col.stage.id === newStageId) {
                if (col.deals.some((d) => d.id === dealId)) {
                  const updated = col.deals.map((d) =>
                    d.id === dealId ? updatedDeal : d,
                  );
                  return {
                    ...col,
                    deals: updated,
                    total_value: updated.reduce(
                      (s, d) => s + Number(d.value),
                      0,
                    ),
                  };
                }
                const updated = [...col.deals, updatedDeal];
                return {
                  ...col,
                  deals: updated,
                  total_value: updated.reduce((s, d) => s + Number(d.value), 0),
                };
              }
              if (col.deals.some((d) => d.id === dealId)) {
                const updated = col.deals.filter((d) => d.id !== dealId);
                return {
                  ...col,
                  deals: updated,
                  total_value: updated.reduce((s, d) => s + Number(d.value), 0),
                };
              }
              return col;
            }),
          };
        });

        // 4. Override no longer needed — cache and Zustand now agree
        clearPendingMove(dealId);
      } catch (err) {
        clearPendingMove(dealId);
        qc.invalidateQueries({ queryKey });
        console.error('Failed to move deal:', err);
      }
    },
    [kanbanData, qc, setPendingMove, clearPendingMove],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={kanbanCollision}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {displayData.columns.map((col) => (
          <DealsColumn
            key={col.stage.id}
            stage={col.stage}
            deals={col.deals}
            totalValue={col.total_value}
            onDealClick={onDealClick}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeDeal ? (
          <div className="rotate-2 opacity-95 shadow-2xl shadow-black/50">
            <DealCard deal={activeDeal} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

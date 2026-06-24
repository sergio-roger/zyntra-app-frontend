import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import { dealsKeys } from '@crm/hooks/useDeals';
import { dealsApi } from '@crm/api/deals.api';
import { Deal, KanbanResponse } from '@crm/types/crm';
import { DealsColumn } from './DealsColumn';
import { DealCard } from './DealCard';

interface DealsKanbanProps {
  kanbanData: KanbanResponse;
  onDealClick?: (deal: Deal) => void;
}

export const DealsKanban: React.FC<DealsKanbanProps> = ({ kanbanData, onDealClick }) => {
  const qc = useQueryClient();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

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

      const pipelineId = kanbanData.pipeline.id;
      const queryKey = dealsKeys.kanban(pipelineId);

      // Optimistic update
      qc.setQueryData<KanbanResponse>(queryKey, (prev) => {
        if (!prev) return prev;
        const deal = prev.columns
          .flatMap((c) => c.deals)
          .find((d) => d.id === dealId);
        if (!deal) return prev;

        return {
          ...prev,
          columns: prev.columns.map((col) => {
            if (col.stage.id === sourceCol.stage.id) {
              const newDeals = col.deals.filter((d) => d.id !== dealId);
              return {
                ...col,
                deals: newDeals,
                total_value: newDeals.reduce((s, d) => s + Number(d.value), 0),
              };
            }
            if (col.stage.id === newStageId) {
              const movedDeal = { ...deal, stage_id: newStageId };
              const targetDeals = [...col.deals, movedDeal];
              return {
                ...col,
                deals: targetDeals,
                total_value: targetDeals.reduce((s, d) => s + Number(d.value), 0),
              };
            }
            return col;
          }),
        };
      });

      try {
        await dealsApi.update(dealId, { stage_id: newStageId });
        // Refresh to get accurate status/closed_at from server
        qc.invalidateQueries({ queryKey });
      } catch {
        // Revert on error
        qc.invalidateQueries({ queryKey });
      }
    },
    [kanbanData, qc],
  );

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Visual feedback is handled by droppable isOver in DealsColumn
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {kanbanData.columns.map((col) => (
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

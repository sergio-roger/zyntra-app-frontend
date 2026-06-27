import { dealsApi } from "@crm/api/deals.api";
import { dealsKeys } from "@crm/hooks/useDeals";
import { Deal } from "@crm/types/deal";
import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";
import { KanbanResponse } from "@crm/types/kanban-response";
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
} from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { DealCard } from "./DealCard";
import { DealsColumn } from "./DealsColumn";

interface DealsKanbanProps {
  kanbanData: KanbanResponse;
  onDealClick?: (deal: Deal) => void;
  onEditStage?: (stage: DealPipelineStage) => void;
}

const kanbanCollision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  if (hits.length > 0) return hits;
  return rectIntersection(args);
};

export const DealsKanban: React.FC<DealsKanbanProps> = ({
  kanbanData,
  onDealClick,
  onEditStage,
}) => {
  const qc = useQueryClient();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const dealId = event.active.id as string;
      const deal = kanbanData.columns
        .flatMap((col) => col.deals)
        .find((d) => d.id === dealId);
      setActiveDeal(deal ?? null);
    },
    [kanbanData],
  );

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

      const dealToMove = sourceCol.deals.find((d) => d.id === dealId)!;
      const queryKey = dealsKeys.kanban(kanbanData.pipeline.id);

      // 1. Optimistic update directo en el cache de React Query — única fuente
      //    de verdad, sin Zustand intermedio que genere renders extra.
      qc.setQueryData<KanbanResponse>(queryKey, (old) => {
        if (!old) return old;
        const optimistic = { ...dealToMove, stage_id: newStageId };
        return {
          ...old,
          columns: old.columns.map((col) => {
            if (col.stage.id === newStageId) {
              const updated = [...col.deals, optimistic];
              return {
                ...col,
                deals: updated,
                total_value: updated.reduce((s, d) => s + Number(d.value), 0),
              };
            }
            if (col.stage.id === sourceCol.stage.id) {
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

      try {
        // 2. Persist en el servidor y actualizar el cache con datos exactos
        //    (incluye relación stage completa, evita diff en background refetch).
        const { data: updatedDeal } = await dealsApi.update(dealId, {
          stage_id: newStageId,
          pipeline_id: kanbanData.pipeline.id,
        });

        qc.setQueryData<KanbanResponse>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            columns: old.columns.map((col) => {
              if (col.stage.id === newStageId) {
                return {
                  ...col,
                  deals: col.deals.map((d) =>
                    d.id === dealId ? updatedDeal : d,
                  ),
                };
              }
              return col;
            }),
          };
        });
      } catch (err) {
        // En error revertimos al estado real del servidor
        qc.invalidateQueries({ queryKey });
        console.error("Failed to move deal:", err);
      }
    },
    [kanbanData, qc],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={kanbanCollision}
      onDragStart={handleDragStart}
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
            onEditStage={onEditStage}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {activeDeal ? (
          <div className="rotate-2 opacity-95 shadow-2xl shadow-black/50">
            <DealCard deal={activeDeal} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

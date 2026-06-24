import { create } from 'zustand';

interface KanbanStore {
  // dealId → newStageId — holds optimistic moves while the PATCH is in-flight
  pendingMoves: Record<string, string>;
  setPendingMove: (dealId: string, stageId: string) => void;
  clearPendingMove: (dealId: string) => void;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
  pendingMoves: {},

  setPendingMove: (dealId, stageId) =>
    set((s) => ({ pendingMoves: { ...s.pendingMoves, [dealId]: stageId } })),

  clearPendingMove: (dealId) =>
    set((s) => {
      const { [dealId]: _removed, ...rest } = s.pendingMoves;
      return { pendingMoves: rest };
    }),
}));

import { create } from 'zustand';

interface KanbanStore {
  pendingMoves: Record<string, string>;
  setPendingMove: (dealId: string, stageId: string) => void;
  clearPendingMove: (dealId: string) => void;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
  pendingMoves: {},

  setPendingMove: (dealId, stageId) =>
    set((s) => ({ pendingMoves: { ...s.pendingMoves, [dealId]: stageId } })),

  clearPendingMove: (dealId) =>
    set((s) => ({
      pendingMoves: Object.fromEntries(
        Object.entries(s.pendingMoves).filter(([key]) => key !== dealId),
      ),
    })),
}));

import { create } from 'zustand';
import { ChannelDraft, ChannelsUiState } from '@features/channels/store/store.types';
import { WIZARD_STEPS } from '@features/channels/constants/channels.constants';

const initialDraft: ChannelDraft = {};

export const useChannelsStore = create<ChannelsUiState>((set, get) => ({
  // ── Canal seleccionado ────────────────────────────────────────────────
  selectedChannelId: null,
  setSelectedChannelId: (id) => set({ selectedChannelId: id }),

  // ── Wizard ────────────────────────────────────────────────────────────
  wizardStep: 'select-type',
  setWizardStep: (step) => set({ wizardStep: step }),

  wizardNextStep: () => {
    const current = get().wizardStep;
    const idx = WIZARD_STEPS.indexOf(current);
    const next = WIZARD_STEPS[idx + 1];
    if (next) set({ wizardStep: next });
  },

  wizardPrevStep: () => {
    const current = get().wizardStep;
    const idx = WIZARD_STEPS.indexOf(current);
    const prev = WIZARD_STEPS[idx - 1];
    if (prev) set({ wizardStep: prev });
  },

  // ── Borrador ──────────────────────────────────────────────────────────
  draft: initialDraft,
  setDraft: (partial) =>
    set((s) => ({ draft: { ...s.draft, ...partial } })),
  resetDraft: () => set({ draft: initialDraft }),

  // ── Reset completo del wizard ─────────────────────────────────────────
  resetWizard: () =>
    set({
      wizardStep: 'select-type',
      draft: initialDraft,
    }),
}));

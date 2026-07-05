import { CreateChannelPayload } from '@features/channels/types/channels.types';

/** Pasos posibles del wizard de creación de canal */
export type ChannelWizardStep = 'select-type' | 'configure' | 'confirm';

export interface ChannelDraft extends Partial<CreateChannelPayload> {
  /** ID del ChannelType seleccionado por el usuario */
  channelTypeId?: string;
  /** Nombre provisional ingresado en el wizard */
  name?: string;
  /** Config parcial del canal (dependiente del tipo) */
  config?: Record<string, unknown>;
}

export interface ChannelsUiState {
  // ── Canal seleccionado (en lista o panel de detalle) ──────────────────
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;

  // ── Wizard de creación/edición ────────────────────────────────────────
  wizardStep: ChannelWizardStep;
  setWizardStep: (step: ChannelWizardStep) => void;
  wizardNextStep: () => void;
  wizardPrevStep: () => void;

  // ── Borrador en edición ───────────────────────────────────────────────
  draft: ChannelDraft;
  setDraft: (partial: Partial<ChannelDraft>) => void;
  resetDraft: () => void;

  // ── Reset completo (al salir del wizard) ──────────────────────────────
  resetWizard: () => void;
}

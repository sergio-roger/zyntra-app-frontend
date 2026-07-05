import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';

/** Pasos del stepform de creación/edición de un canal web */
export type WebChannelFormStep =
  | 'identity'
  | 'appearance'
  | 'security'
  | 'agent'
  | 'summary';

export type { WebChannelFormValues };

export interface ChannelsUiState {
  // ── Canal seleccionado (en lista o panel de detalle) ──────────────────
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;

  // ── Stepform de creación/edición de canal web ─────────────────────────
  formStep: WebChannelFormStep;
  setFormStep: (step: WebChannelFormStep) => void;
  formNextStep: () => void;
  formPrevStep: () => void;

  formValues: WebChannelFormValues;
  setFormValues: (partial: Partial<WebChannelFormValues>) => void;

  /** Snapshot tomado al entrar al stepform, usado para el dirty-check */
  initialValues: WebChannelFormValues | null;
  setInitialValues: (values: WebChannelFormValues) => void;
  isDirty: () => boolean;

  /** Reinicia paso, borrador y snapshot inicial */
  resetForm: () => void;
}

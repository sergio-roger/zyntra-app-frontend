import { create } from 'zustand';
import {
  ChannelsUiState,
  WebChannelFormValues,
} from '@features/channels/store/store.types';
import { WEB_CHANNEL_FORM_STEPS } from '@features/channels/constants/channels.constants';

export const DEFAULT_WEB_CHANNEL_FORM_VALUES: WebChannelFormValues = {
  name: '',
  greeting: '',
  assistantName: 'Asistente',
  primaryColor: '#6366f1',
  position: 'bottom-right',
  theme: 'auto',
  allowedDomains: [],
  agentId: null,
};

export const useChannelsStore = create<ChannelsUiState>((set, get) => ({
  // ── Canal seleccionado ────────────────────────────────────────────────
  selectedChannelId: null,
  setSelectedChannelId: (id) => set({ selectedChannelId: id }),

  // ── Stepform ──────────────────────────────────────────────────────────
  formStep: 'identity',
  setFormStep: (step) => set({ formStep: step }),

  formNextStep: () => {
    const current = get().formStep;
    const idx = WEB_CHANNEL_FORM_STEPS.indexOf(current);
    const next = WEB_CHANNEL_FORM_STEPS[idx + 1];
    if (next) set({ formStep: next });
  },

  formPrevStep: () => {
    const current = get().formStep;
    const idx = WEB_CHANNEL_FORM_STEPS.indexOf(current);
    const prev = WEB_CHANNEL_FORM_STEPS[idx - 1];
    if (prev) set({ formStep: prev });
  },

  formValues: DEFAULT_WEB_CHANNEL_FORM_VALUES,
  setFormValues: (partial) =>
    set((s) => ({ formValues: { ...s.formValues, ...partial } })),

  initialValues: null,
  setInitialValues: (values) =>
    set({ initialValues: values, formValues: values }),

  isDirty: () => {
    const { formValues, initialValues } = get();
    if (!initialValues) return false;
    return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  },

  resetForm: () =>
    set({
      formStep: 'identity',
      formValues: DEFAULT_WEB_CHANNEL_FORM_VALUES,
      initialValues: null,
    }),
}));

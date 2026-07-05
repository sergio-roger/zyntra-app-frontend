import { ChannelWizardStep } from '@features/channels/store/store.types';

// ─── Orden de pasos del wizard ────────────────────────────────────────────────
export const WIZARD_STEPS: ChannelWizardStep[] = [
  'select-type',
  'configure',
  'confirm',
];

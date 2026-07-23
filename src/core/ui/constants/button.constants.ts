import { ButtonSize, ButtonVariant } from '@core/ui/button.types';

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};

export const BUTTON_ICON_SIZES: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const BUTTON_VARIANT_SOLID_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90',
  secondary:
    'bg-slate-700 text-white shadow-lg shadow-black/10 hover:bg-slate-600',
  tertiary:
    'bg-accent text-white shadow-lg shadow-accent/20 hover:opacity-90',
};

export const BUTTON_VARIANT_OUTLINE_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border border-primary/40 text-primary hover:bg-primary/10',
  secondary: 'border border-white/10 text-slate-300 hover:bg-white/5',
  tertiary: 'border border-accent/40 text-accent hover:bg-accent/10',
};

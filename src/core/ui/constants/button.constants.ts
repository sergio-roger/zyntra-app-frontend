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
    'bg-base-300 text-base-content shadow-md hover:bg-base-300/80',
  tertiary:
    'bg-tertiary text-tertiary-content shadow-lg shadow-tertiary/20 hover:opacity-90',
  danger:
    'bg-error/10 text-error border border-error/20 hover:bg-error/20',
};

export const BUTTON_VARIANT_OUTLINE_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border border-primary/40 text-primary hover:bg-primary/10',
  secondary: 'border border-base-content/10 text-base-content/70 hover:bg-base-content/5',
  tertiary: 'border border-tertiary/40 text-tertiary hover:bg-tertiary/10',
  danger: 'border border-error/40 text-error hover:bg-error/10',
};

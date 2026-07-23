import { ButtonProps } from '@core/ui/button.types';
import {
  BUTTON_ICON_SIZES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_OUTLINE_CLASSES,
  BUTTON_VARIANT_SOLID_CLASSES,
} from '@core/ui/constants/button.constants';
import { Loader2 } from 'lucide-react';
import React, { forwardRef } from 'react';

const buildButtonClassName = (
  props: Required<Pick<ButtonProps, 'variant' | 'outline' | 'size'>> &
    Pick<ButtonProps, 'fullWidth' | 'className'>,
): string => {
  const variantClasses = props.outline
    ? BUTTON_VARIANT_OUTLINE_CLASSES[props.variant]
    : BUTTON_VARIANT_SOLID_CLASSES[props.variant];

  return [
    'inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
    BUTTON_SIZE_CLASSES[props.size],
    variantClasses,
    props.fullWidth ? 'w-full' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      outline = false,
      size = 'md',
      loading = false,
      icon: Icon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const iconSize = BUTTON_ICON_SIZES[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={buildButtonClassName({
          variant,
          outline,
          size,
          fullWidth,
          className,
        })}
        {...rest}
      >
        {loading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          Icon && <Icon size={iconSize} />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

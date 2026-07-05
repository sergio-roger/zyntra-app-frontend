import { SelectOption } from '@core/ui/select.types';

export function findSelectedOption<TValue>(
  options: SelectOption<TValue>[],
  value: TValue | null | undefined,
): SelectOption<TValue> | undefined {
  return options.find((o) => o.value === value);
}

export function getTriggerLabel<TValue>(
  value: TValue | null | undefined,
  selectedOption: SelectOption<TValue> | undefined,
  placeholder: string,
  displayValue?: (
    value: TValue | null,
    option: SelectOption<TValue> | undefined,
  ) => string,
): string {
  return displayValue
    ? displayValue(value ?? null, selectedOption)
    : (selectedOption?.label ?? placeholder);
}

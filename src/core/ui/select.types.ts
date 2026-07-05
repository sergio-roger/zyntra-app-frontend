export interface SelectOption<TValue = string> {
  disabled?: boolean;
  label: string;
  value: TValue;
}

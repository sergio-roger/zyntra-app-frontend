export type CustomFieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "url";

export interface CustomField {
  businessId: string;
  createdAt: string;
  entity_type: "contact" | "company";
  id: string;
  is_active: boolean;
  label: string;
  name: string;
  options: string[] | null;
  required: boolean;
  type: CustomFieldType;
}

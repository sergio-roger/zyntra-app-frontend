import { ColumnConfig } from "@shared/types/column";

export const DEFAULT_COMPANY_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Nombre", visible: true },
  { key: "tax_type", label: "Tipo Id", visible: true },
  { key: "identification", label: "Identificación", visible: true },
  { key: "website", label: "Sitio web", visible: true },
  { key: "industry", label: "Industria", visible: true },
  { key: "lifecycleStage", label: "Ciclo de vida", visible: true },
  { key: "employeeRange", label: "Rango Empleados", visible: true },
  { key: "owner", label: "Propietario", visible: true },
  { key: "tags", label: "Etiquetas", visible: true },
  { key: "createdAt", label: "Registrado", visible: false },
];

import { ColumnConfig } from "@shared/types/column";

export const DEFAULT_COMPANY_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Nombre", visible: true },
  { key: "identification", label: "Identificación", visible: true },
  { key: "website", label: "Sitio web", visible: true },
  { key: "sector", label: "Sector", visible: true },
  { key: "lifecycleStage", label: "Etapa", visible: true },
  { key: "numEmployees", label: "Empleados", visible: true },
  { key: "tags", label: "Etiquetas", visible: true },
  { key: "createdAt", label: "Registrado", visible: false },
];

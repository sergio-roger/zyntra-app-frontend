import { ExportColumn } from "@core/types/api";
import { ColumnConfig } from "@shared/types/column";

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Nombre", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "phone", label: "Teléfono", visible: true },
  { key: "lifecycleStage", label: "Ciclo de vida", visible: true },
  { key: "source", label: "Origen", visible: false },
  { key: "owner", label: "Propietario", visible: true },
  { key: "notes", label: "Notas", visible: false },
  { key: "lastActivityAt", label: "Último contacto", visible: false },
];

export const STANDARD_CONTACT_EXPORT_COLUMNS: ExportColumn[] = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Teléfono" },
  { key: "company", label: "Empresa" },
  { key: "source", label: "Origen" },
  { key: "lifecycleStage", label: "Etapa del ciclo" },
  { key: "ownerName", label: "Propietario" },
  { key: "tags", label: "Etiquetas" },
  { key: "score", label: "Puntuación" },
  { key: "dealValue", label: "Valor negocio" },
  { key: "notes", label: "Notas" },
  { key: "createdAt", label: "Fecha de registro" },
  { key: "lastActivityAt", label: "Último contacto" },
];

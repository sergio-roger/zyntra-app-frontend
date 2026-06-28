import { ExportColumn } from '@core/types/api';
import { ColumnConfig } from '@shared/types/column';

export const DEFAULT_COMPANY_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Nombre', visible: true },
  { key: 'taxType', label: 'Tipo Id', visible: true },
  { key: 'identification', label: 'Identificación', visible: true },
  { key: 'website', label: 'Sitio web', visible: true },
  { key: 'industry', label: 'Industria', visible: true },
  { key: 'lifecycleStage', label: 'Ciclo de vida', visible: true },
  { key: 'employeeRange', label: 'Rango Empleados', visible: true },
  { key: 'owner', label: 'Propietario', visible: true },
  { key: 'tags', label: 'Etiquetas', visible: true },
  { key: 'createdAt', label: 'Registrado', visible: false },
];

export const STANDARD_COMPANY_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'identification', label: 'RUC / Identificación' },
  { key: 'website', label: 'Sitio web' },
  { key: 'industry', label: 'Industria' },
  { key: 'lifecycleStage', label: 'Etapa del ciclo' },
  { key: 'employeeRange', label: 'Empleados' },
  { key: 'tags', label: 'Etiquetas' },
  { key: 'description', label: 'Descripción' },
  { key: 'createdAt', label: 'Fecha de registro' },
  { key: 'updatedAt', label: 'Última actualización' },
];

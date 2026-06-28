import { ColumnConfig } from '@shared/types/column';

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Nombre', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'phone', label: 'Teléfono', visible: true },
  { key: 'lifecycleStage', label: 'Ciclo de vida', visible: true },
  { key: 'source', label: 'Origen', visible: false },
  { key: 'owner', label: 'Propietario', visible: true },
  { key: 'notes', label: 'Notas', visible: false },
  { key: 'lastActivityAt', label: 'Último contacto', visible: false },
];

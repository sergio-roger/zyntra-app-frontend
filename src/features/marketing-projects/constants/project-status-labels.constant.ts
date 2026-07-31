import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

export const PROJECT_STATUS_LABELS: Record<MarketingProjectStatus, string> = {
  [MarketingProjectStatus.DRAFT]: 'Borrador',
  [MarketingProjectStatus.ACTIVE]: 'Activo',
  [MarketingProjectStatus.PAUSED]: 'En pausa',
  [MarketingProjectStatus.COMPLETED]: 'Completado',
};

export const PROJECT_STATUS_BADGE_CLASSES: Record<MarketingProjectStatus, string> = {
  [MarketingProjectStatus.DRAFT]: 'badge-ghost',
  [MarketingProjectStatus.ACTIVE]: 'badge-success',
  [MarketingProjectStatus.PAUSED]: 'badge-warning',
  [MarketingProjectStatus.COMPLETED]: 'badge-info',
};

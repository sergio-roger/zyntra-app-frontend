export interface ContactExportModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  queryParams: {
    search?: string;
    source?: string;
    ownerId?: string;
    lifecycleStageId?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    lastActivityAtFrom?: string;
    lastActivityAtTo?: string;
    customFieldFilters?: string;
  };
}

export interface ContactExportModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  queryParams: {
    channelId?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    customFieldFilters?: string;
    lastActivityAtFrom?: string;
    lastActivityAtTo?: string;
    lifecycleStageId?: string;
    ownerId?: string;
    search?: string;
  };
}

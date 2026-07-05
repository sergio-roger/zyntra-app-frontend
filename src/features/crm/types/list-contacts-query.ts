export type TabKey = 'all' | 'mine' | 'unassigned';

export interface ListContactsQuery {
  channelId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  customFieldFilters?: string;
  isArchived?: boolean;
  lastActivityAtFrom?: string;
  lastActivityAtTo?: string;
  lifecycleStageId?: string;
  limit?: number;
  ownerId?: string;
  page?: number;
  search?: string;
  tag?: string;
}

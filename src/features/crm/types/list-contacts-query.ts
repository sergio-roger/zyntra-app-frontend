import { ContactSource } from "./contact";

export type TabKey = "all" | "mine" | "unassigned";

export interface ListContactsQuery {
  createdAtFrom?: string;
  createdAtTo?: string;
  lastActivityAtFrom?: string;
  lastActivityAtTo?: string;
  isArchived?: boolean;
  lifecycleStageId?: string;
  limit?: number;
  ownerId?: string;
  page?: number;
  search?: string;
  source?: ContactSource;
  tag?: string;
  customFieldFilters?: string;
}

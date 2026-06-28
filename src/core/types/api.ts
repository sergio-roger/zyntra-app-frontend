export interface PaginatedResponse<T> {
  items?: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ExportColumn {
  key: string;
  label: string;
}

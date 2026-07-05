export interface PaginatedResponse<T> {
  items?: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: ApiError[];
}

export interface ExportColumn {
  key: string;
  label: string;
}

export interface ApiError {
  code: string;
  description: string;
}

/** TransformInterceptor wraps every backend response, so `data` is always present. */
export const unwrap = <T>(res: ApiResponse<T>): T => res.data;

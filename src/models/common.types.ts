// Note: ApiResponse interface also exists in src/pages/Authentication/models/AuthInterfaces.ts
// Consider consolidating these definitions
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FilterState {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
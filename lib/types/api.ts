export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  to: number | null;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[] | boolean>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[] | boolean>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[] | boolean>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false &&
    'message' in data &&
    typeof (data as ApiErrorResponse).message === 'string'
  );
}

export interface PaginationResult<T> {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  docs: T[];
}

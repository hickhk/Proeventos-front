export class Pagination {
  currentPage?: number | undefined;
  itemsPerPage?: number | undefined;
  totalItems?: number | undefined;
  totalPages?: number | undefined;
}

export class PaginatedResult<T> {
  result!: T;
  pagination!: Pagination;
}

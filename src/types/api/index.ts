// Common pagination shape for list responses
export type ApiPagination = {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

// Standard list response wrapper
export type ApiResponseListType<T> = {
  pagination: ApiPagination
  results: T[]
}

// Standard single-entity response wrapper
export type ApiResponseItemType<T> = {
  result: T
}

// Common list query params
export type ApiListParams = Partial<{
  page: number
  perPage: number
  search: string
  ordering: string
  // Allow additional backend-specific filters
  [key: string]: any
}>

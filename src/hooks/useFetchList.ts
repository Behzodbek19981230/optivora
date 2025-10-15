import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { DataService } from 'src/configs/dataService'
import { ApiResponseListType, ApiListParams } from 'src/types/api'

export function useFetchList<T = any>(
  endpoint: string,
  params: ApiListParams = {},
  options?: SWRConfiguration<ApiResponseListType<T>, any>
) {
  const key: [string, ApiListParams] | null = endpoint ? [endpoint, params] : null

  const fetcher = async ([url, p]: [string, ApiListParams]) => {
    const res = await DataService.get<ApiResponseListType<T>>(url, p)
    return res.data
  }

  const { data: payload, error, isLoading, mutate }: SWRResponse<ApiResponseListType<T>, any> = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options
    }
  )
  console.log('payload', payload);
  

  return {
    data: payload?.results || [],
    total: payload?.pagination?.total || 0,
    loading: Boolean(isLoading),
    error,
    mutate,
    raw: payload
  }
}

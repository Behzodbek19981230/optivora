import { DataService } from 'src/configs/dataService'
import useSWR from 'swr'

export const useDashboardStats = () => {
  const fetcher = async () => {
    const res = await DataService.get('/dashboard/stats/')
    return res.data
  }
  const { data, error, isLoading } = useSWR('/dashboard/stats/', fetcher)
  return { data, error, isLoading }
}

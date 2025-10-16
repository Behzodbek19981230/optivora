import useSWR from 'swr'
import { DataService } from '../configs/dataService'

export const useInquiryNotifications = () => {
  const fetcher = async () => {
    const res = await DataService.get('/inquiry?status=new')
    return res.data?.results || []
  }
  const { data, error, isLoading } = useSWR('/inquiry?status=new', fetcher)
  return { data, error, isLoading }
}

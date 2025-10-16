import useSWR from 'swr'
import { DataService } from '../configs/dataService'
import { User } from '../types/user'

export const useUsers = () => {
  const fetcher = async () => {
    const res = await DataService.get('/user/')
    return res.data?.results || []
  }
  const { data, error, isLoading, mutate } = useSWR('/user/', fetcher)
  return { data, error, isLoading, mutate }
}

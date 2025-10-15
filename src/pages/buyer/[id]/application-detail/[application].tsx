import ApplicationDetailBuyer from 'src/views/pages/buyer/Application-detail/ApplicationDetailBuyer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Loader from 'src/@core/components/spinner/Loader'
type ApiStruct = {
  message: string
  result: any
  statusCode: boolean
}
const ApplicationDetail = () => {
  const router = useRouter()
  const [apiData, setApiData] = useState<ApiStruct>()
  const fetchData = async () => {
    const response = await DataService.get(endpoints.applicationByersByID(router.query?.id))
    setApiData(response?.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  if (apiData) return <ApplicationDetailBuyer application={router.query?.application} apiData={apiData} />
  else return <Loader />
}

export default ApplicationDetail

import { useRouter } from 'next/router'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useEffect, useState } from 'react'
import Loader from 'src/@core/components/spinner/Loader'
import TabContentBuyer from 'src/views/pages/buyer/TabContent'
type ApiStruct = {
  message: string
  result: any
  statusCode: boolean
}
const BuyerListByID = () => {
  const router = useRouter()
  const [apiData, setApiData] = useState<ApiStruct>()
  const fetchData = async () => {
    const response = await DataService.get(endpoints.applicationByersByID(router.query?.id))
    setApiData(response?.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  if (apiData) return <TabContentBuyer tab={router.query?.tab} apiData={apiData} />
  else return <Loader />
}

export default BuyerListByID

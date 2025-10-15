import { Box, Grid } from '@mui/material'
import ApplicationsList from 'src/views/pages/application/ApplicationsList'
import CardHorizontal from 'src/views/pages/client/dashboard/Cards'
import { useEffect, useState } from 'react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
type StatisticMerchantType = {
  total_applications: number
  total_clients: number
  total_sum: number
}
export default function ClientDashboard() {
  const [apiData, setApidata] = useState<StatisticMerchantType>()
  const fetchData = async () => {
    const response = await DataService.get(endpoints.getStatisticMerchant)
    setApidata(response.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  const data = [
    {
      stats: apiData?.total_applications,
      icon: 'tabler:shopping-cart',
      title: 'Approved_applications'
    },
    {
      stats: apiData?.total_clients,
      icon: 'tabler:users',
      title: 'Clients'
    },
    {
      stats: <CurrencyFormatter amount={apiData?.total_sum as number} currency='sum' />,

      title: 'Sold_for_total_amount',
      icon: 'tabler:cash'
    }
  ]
  return (
    <Box sx={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={6}>
        {data.map((item: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CardHorizontal {...item} />
          </Grid>
        ))}
      </Grid>
      <ApplicationsList />
    </Box>
  )
}

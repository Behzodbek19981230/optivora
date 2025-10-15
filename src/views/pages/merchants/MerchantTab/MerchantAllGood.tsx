// ** React Imports
import { SyntheticEvent, useState, useEffect, ReactElement } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab, { TabProps } from '@mui/material/Tab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { UserProfileActiveTab } from 'src/@fake-db/types'
import Grid from '@mui/system/Unstable_Grid/Grid'
import { Badge, BadgeProps, Card, CardContent } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import PageHeader from 'src/@core/components/page-header'
import ActivatedList from 'src/pages/employee/ActivatedList'
import BuyerList from 'src/pages/buyer/components/BuyerList'
import MerchantList from 'src/pages/merchants'
import MerchantListTab from './MerchantList'
import toast from 'react-hot-toast'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Loader from 'src/@core/components/spinner/Loader'

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
type ApiDataStatus = {
  activeList: []
  passiveList: []
  blockedList: []
}
const MerchantAllGood = () => {
  const [activeTab, setActiveTab] = useState<string>('active')
  const [apiData, setApiData] = useState<ApiDataStatus>({ activeList: [], passiveList: [], blockedList: [] })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [value, setValue] = useState<string>('')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }
  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Fetch active list
      const res = await DataService.get(endpoints.merchant, { status: 'active', search: value })

      // Fetch passive list
      const resp = await DataService.get(endpoints.merchant, { status: 'passive', search: value })

      // Fetch blocked list
      const resb = await DataService.get(endpoints.merchant, { status: 'blocked', search: value })

      setApiData({
        activeList: res.data.result,
        passiveList: resp.data.result,
        blockedList: resb.data.result
      })
      setIsLoading(false)
    } catch (err: any) {
      toast.error(err.message)
    }
  }
  useEffect(() => {
    fetchData()
  }, [value])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab
          value='active'
          label={
            <StyledBadge badgeContent={apiData?.activeList?.length} max={999} color='primary' sx={{ pr: 6 }}>
              <Translations text='active_' />
            </StyledBadge>
          }
        />
        <Tab
          value='approval'
          label={
            <StyledBadge badgeContent={apiData?.passiveList?.length} max={999} color='primary' sx={{ pr: 6 }}>
              <Translations text='awaiting_approval' />
            </StyledBadge>
          }
        />
        <Tab
          value='not_valid'
          label={
            <StyledBadge badgeContent={apiData?.blockedList?.length} max={999} color='primary' sx={{ pr: 6 }}>
              <Translations text='not_valid' />
            </StyledBadge>
          }
        />
      </TabList>

      <Box sx={{ mt: 4 }}>
        <>
          <TabPanel sx={{ p: 0 }} value='active'>
            <MerchantListTab
              apiData={apiData?.activeList}
              fetchData={fetchData}
              value={value}
              setValue={val => setValue(val)}
            />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='approval'>
            <MerchantListTab
              apiData={apiData?.passiveList}
              fetchData={fetchData}
              value={value}
              setValue={val => setValue(val)}
            />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='not_valid'>
            <MerchantListTab
              apiData={apiData?.blockedList}
              fetchData={fetchData}
              value={value}
              setValue={val => setValue(val)}
            />
          </TabPanel>
        </>
      </Box>
    </TabContext>
  )
}

export default MerchantAllGood

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
import BuyerList from './BuyerList'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import BuyerListVerify from './BuyerListVerify'
import BuyerListInVerify from './BuyerListInVerify'

// ** Styled Tab component
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
type ApiDataStatus = {
  allList: number
  activeList: number
  inActiveList: number
}
const BuyerTab = ({ tab }: { tab: string }) => {
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [apiData, setApiData] = useState<ApiDataStatus>({
    allList: 0,
    activeList: 0,
    inActiveList: 0
  })
  const [value, setValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resAll = await DataService.get(endpoints.merchantClientsFilter, { search: value })
      // Fetch active list
      const res = await DataService.get(endpoints.merchantClientsFilter, { is_active: 'true', search: value })
      // Fetch passive list
      const resp = await DataService.get(endpoints.merchantClientsFilter, { is_active: 'false', search: value })
      // Fetch blocked list

      setApiData({
        allList: resAll.data?.pagination?.total,
        activeList: res.data?.pagination?.total,
        inActiveList: resp.data?.pagination?.total
      })
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
  }, [value])
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/buyer/list/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    setIsLoading(false)
  }, [])
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <PageHeader
          title={
            <Typography variant='h4'>
              <Translations text='Buyers' />
            </Typography>
          }
        />
      </Box>
      {activeTab === undefined ? null : (
        <Card>
          <TabContext value={activeTab}>
            <TabList
              variant='fullWidth'
              scrollButtons='auto'
              onChange={handleChange}
              aria-label='forced scroll tabs example'
              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
              <Tab
                value='all'
                label={
                  <StyledBadge max={1000000} badgeContent={apiData?.allList} color='primary' sx={{ pr: 6 }}>
                    <Translations text='All' />{' '}
                  </StyledBadge>
                }
              />
              <Tab
                value='verified'
                label={
                  <StyledBadge max={1000000} badgeContent={apiData?.activeList} color='primary' sx={{ pr: 6 }}>
                    <Translations text='Verified' />{' '}
                  </StyledBadge>
                }
              />
              <Tab
                value='on_verification'
                label={
                  <StyledBadge max={10000000} badgeContent={apiData?.inActiveList} color='primary' sx={{ pr: 6 }}>
                    <Translations text='On verification' />{' '}
                  </StyledBadge>
                }
              />{' '}
            </TabList>
            <Box sx={{ mt: 4 }}>
              <>
                <TabPanel sx={{ p: 0 }} value='all'>
                  <BuyerList />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='verified'>
                  <BuyerListVerify />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='on_verification'>
                  <BuyerListInVerify />
                </TabPanel>
              </>
            </Box>
          </TabContext>
        </Card>
      )}
    </Box>
  )
}

export default BuyerTab

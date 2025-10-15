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
import ActivatedList from './ActivatedList'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import PageHeader from 'src/@core/components/page-header'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { apiStructure } from 'src/context/types'
interface Props {
  tab: string
}

// ** Styled Tab component
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
const EmployeeTab = ({ tab }: { tab: string }) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [lengActive, setlengActive] = useState<number>(0)
  const [lenginActive, setLengthInActive] = useState(0)
  const [apiData, setApiData] = useState<apiStructure | undefined>()
  const router = useRouter()
  const onFilter = async (val: string) => {
    setApiData(undefined)
    const res = await DataService.get(endpoints.usersStaff, { search: val })
    setlengActive(res?.data?.result?.filter((item: any) => item.is_active == 1)?.length)
    setLengthInActive(res?.data?.result?.filter((item: any) => item.is_active == 0)?.length)
    if (tab == 'activated') {
      setApiData(res?.data?.result?.filter((item: any) => item.is_active))
    } else {
      setApiData(res?.data?.result?.filter((item: any) => !item.is_active))
    }
  }
  const getData = async () => {
    setIsLoading(true)
    setApiData(undefined)
    const res = await DataService.get(endpoints.usersStaff)
    setlengActive(res?.data?.result?.filter((item: any) => item.is_active == 1)?.length)
    setLengthInActive(res?.data?.result?.filter((item: any) => item.is_active == 0)?.length)
    if (tab == 'activated') {
      setApiData(res?.data?.result?.filter((item: any) => item.is_active))
    } else {
      setApiData(res?.data?.result?.filter((item: any) => !item.is_active))
    }
  }
  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/employee/list/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    getData()
    setIsLoading(false)
  }, [tab])
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
              <Translations text='Employees' />
            </Typography>
          }
        />
      </Box>
      {activeTab === undefined ? null : (
        <Card>
          <TabContext value={activeTab}>
            <TabList
              variant='scrollable'
              scrollButtons='auto'
              onChange={handleChange}
              aria-label='forced scroll tabs example'
              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
              <Tab
                value='activated'
                label={
                  <StyledBadge badgeContent={lengActive} color='primary' sx={{ pr: 6 }}>
                    <Translations text='Activated' />
                  </StyledBadge>
                }
              />
              <Tab
                value='deactivated'
                label={
                  <StyledBadge badgeContent={lenginActive} color='primary' sx={{ pr: 6 }}>
                    <Translations text='Deactivated' />
                  </StyledBadge>
                }
              />
            </TabList>
            <Box sx={{ mt: 4 }}>
              {apiData && isLoading ? (
                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CircularProgress sx={{ mb: 4 }} />
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <>
                  <TabPanel sx={{ p: 0 }} value='activated'>
                    <ActivatedList apiData={apiData} onFilter={onFilter} />
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value='deactivated'>
                    <ActivatedList apiData={apiData} onFilter={onFilter} />
                  </TabPanel>
                </>
              )}
            </Box>
          </TabContext>
        </Card>
      )}
    </Box>
  )
}

export default EmployeeTab

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
import CircularProgress from '@mui/material/CircularProgress'
import { Badge, BadgeProps, Card } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import PageHeader from 'src/@core/components/page-header'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { apiStructure } from 'src/context/types'
import RegionsList from 'src/views/pages/directory/Regions'
import DistrictsList from 'src/views/pages/directory/Districts'

// ** Styled Tab component
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
const RegionTab = () => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>('head')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [lengActive, setlengActive] = useState<number>(0)
  const [lenginActive, setLengthInActive] = useState(0)
  const [apiData, setApiData] = useState<apiStructure | undefined>()
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/directory/regions/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    setActiveTab(router.query.tab as string)
    setIsLoading(false)
  }, [router.query.tab])

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <PageHeader
          title={
            <Typography variant='h4'>
              <Translations text='regions' />
            </Typography>
          }
        />
      </Box>

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
              value='region'
              label={
                <StyledBadge badgeContent={lengActive} color='primary' sx={{ pr: 6 }}>
                  <Translations text='region' />
                </StyledBadge>
              }
            />
            <Tab
              value='district'
              label={
                <StyledBadge badgeContent={lenginActive} color='primary' sx={{ pr: 6 }}>
                  <Translations text='district' />
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
                <TabPanel sx={{ p: 0 }} value='region'>
                  <RegionsList />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='district'>
                  <DistrictsList />
                </TabPanel>
              </>
            )}
          </Box>
        </TabContext>
      </Card>
    </Box>
  )
}

export default RegionTab

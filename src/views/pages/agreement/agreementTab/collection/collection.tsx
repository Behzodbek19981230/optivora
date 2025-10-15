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
import { Badge, BadgeProps, Button, Card, CardContent } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import PageHeader from 'src/@core/components/page-header'
import ActivatedList from 'src/pages/employee/ActivatedList'
import BuyerList from 'src/pages/buyer/components/BuyerList'
import MerchantList from 'src/pages/merchants'
import CollectionListTab from './list'
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
const Collection = () => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>('All_debtors')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    setIsLoading(false)
  }
  useEffect(() => {
    setIsLoading(true)
  }, [])

  return (
    <TabContext value={activeTab}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          <Translations text='collection' />
        </Typography>
        <Button variant='outlined' startIcon={<Icon icon='tabler:refresh' />}>
          <Translations text='Update_list' />
        </Button>
      </CardContent>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab
          value='All_debtors'
          label={
            <StyledBadge badgeContent={99} color='primary' sx={{ pr: 6 }}>
              <Translations text='All_debtors' />
            </StyledBadge>
          }
        />
        <Tab
          value='Debtors_for_the_current_month'
          label={
            <StyledBadge badgeContent={90} color='primary' sx={{ pr: 6 }}>
              <Translations text='Debtors_for_the_current_month' />
            </StyledBadge>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        <>
          <TabPanel sx={{ p: 0 }} value='All_debtors'>
            <CollectionListTab tab='All_debtors' />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='Debtors_for_the_current_month'>
            <CollectionListTab tab='Debtors_for_the_current_month' />
          </TabPanel>
        </>
      </Box>
    </TabContext>
  )
}

export default Collection

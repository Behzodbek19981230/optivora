// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'

import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'

import { useRouter } from 'next/router'
// ** Icon Imports
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MuiTab, { TabProps } from '@mui/material/Tab'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import Collection from '../agreement/agreementTab/collection/collection'
import BillingTypeAListTabAll from './TypeAList'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: theme.palette.grey[200],
    color: theme.palette.primary.main,

    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))
const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const BillingTabMain = ({ tab }: any) => {
  // ** State
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  useEffect(() => {
    router
      .push({
        pathname: `/billing/${tab}`
      })
      .then(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='billing' />
          </Typography>
        }
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => router.push('/reports/create')} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:file' />
          <Translations text='reports' />
        </Button>
      </Box>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            aria-label='forced scroll tabs example'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='transaction_type_a'
              label={<Translations text='transaction_type_a' />}
              icon={<Icon fontSize='1.125rem' icon='tabler:arrows-horizontal' />}
              sx={{ mr: 2 }}
            />
            {/* <Tab
              value='transactions_type_in'
              label={<Translations text='transactions_type_in' />}
              icon={<Icon fontSize='1.125rem' icon='tabler:arrows-horizontal' />}
              sx={{ mr: 2 }}
            /> */}
            <Tab
              value='add_report'
              label={<Translations text='Add_report' />}
              onClick={() => router.push('/reports/create')}
              icon={<Icon fontSize='1.125rem' icon='tabler:plus' />}
              sx={{ mr: 2 }}
            />
          </TabList>
          <Card sx={{ mt: 10 }}>
            <TabPanel sx={{ p: 0 }} value='transaction_type_a'>
              <BillingTypeAListTabAll />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='transactions_type_in'>
              <Collection />{' '}
            </TabPanel>
          </Card>
        </TabContext>
      </Grid>
    </Grid>
  )
}
export default BillingTabMain

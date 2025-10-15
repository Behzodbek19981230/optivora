// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import { styled } from '@mui/material/styles'

import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'

import Button, { ButtonProps } from '@mui/material/Button'
import { useTheme } from '@mui/material'

import { useRouter } from 'next/router'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTab, { TabProps } from '@mui/material/Tab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import ApplicationList from 'src/views/pages/application/TabContent/ApplicationList'
import PageHeader from 'src/@core/components/page-header'
import Confirmation from '../agreement/agreementTab/confirmation/confirmation'
import Collection from '../agreement/agreementTab/collection/collection'

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

const ApplicationMainTab = () => {
  // ** State
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<string>('confirmation')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='forced scroll tabs example'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='confirmation'
              label={<Translations text='confirmation' />}
              icon={<Icon fontSize='1.125rem' icon='tabler:checks' />}
              sx={{ mr: 2 }}
            />
            {/* <Tab
              value='collection'
              label={<Translations text='collection' />}
              icon={<Icon fontSize='1.125rem' icon='tabler:ban' />}
              sx={{ mr: 2 }}
            />
            <Tab
              value='support'
              label={<Translations text='support' />}
              icon={<Icon fontSize='1.125rem' icon='tabler:lifebuoy' />}
              sx={{ mr: 2 }}
            />
            <Tab
              value='calculation_of_the_amount_of_goods'
              label={<Translations text='calculation_of_the_amount_of_goods' />}
              icon={<Icon fontSize='1.125rem' icon='tabler:calculator' />}
            /> */}
          </TabList>
          <Card sx={{ mt: 10 }}>
            <TabPanel sx={{ p: 0 }} value='confirmation'>
              <Confirmation />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='collection'>
              <Collection />{' '}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='support'>
              <ApplicationList />{' '}
            </TabPanel>{' '}
            <TabPanel sx={{ p: 0 }} value='calculation_of_the_amount_of_goods'>
              <ApplicationList />{' '}
            </TabPanel>
          </Card>
        </TabContext>
      </Grid>
    </Grid>
  )
}
export default ApplicationMainTab

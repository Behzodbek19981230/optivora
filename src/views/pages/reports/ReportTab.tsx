// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'

import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material'

import { useRouter } from 'next/router'
// ** Icon Imports
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MuiTab, { TabProps } from '@mui/material/Tab'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import ReportTypeTab from './ReportTypeTab'
import ReportList from './bnpl/ReportList'
import ReportListBriefcase from './briefcase/ReportList'
import ReportByRegions from './ReportByRegions'
import ReportByExitensionBnpl from 'src/views/pages/reports/extension-to-bnpl/ReportByExitensionBnpl'
import ReportByMerchants from 'src/views/pages/reports/ReportByMerchants'
import ReportByStatus from 'src/views/pages/reports/ReportByStatus'

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

const ReportTab = ({ tab }: any) => {
  // ** State
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  useEffect(() => {
    router
      .push({
        pathname: `/reports/${tab}`
      })
      .then(() => {
        setIsLoading(false)
      })
  }, [])
  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    router
      .push({
        pathname: `/reports/${value}`
      })
      .then(() => {
        setActiveTab(value)
        setIsLoading(false)
      })
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='reports' />
          </Typography>
        }
      />
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='forced scroll tabs example'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab value='bnpl' label={<Translations text='bnpl' />} sx={{ mr: 2 }} />
            <Tab value='briefcase' label={<Translations text='briefcase' />} sx={{ mr: 2 }} />
            <Tab value='extension-to-bnpl' label={<Translations text='extension-to-bnpl' />} sx={{ mr: 2 }} />
            <Tab value='statistics-by-region' label={<Translations text='statistics-by-region' />} sx={{ mr: 2 }} />
            <Tab value='merchant-statistics' label={<Translations text='merchant-statistics' />} sx={{ mr: 2 }} />
            <Tab value='borrower-statistics' label={<Translations text='borrower-statistics' />} sx={{ mr: 2 }} />
          </TabList>
          <Card sx={{ mt: 10 }}>
            <TabPanel sx={{ p: 0 }} value='bnpl'>
              <ReportTypeTab title='bnpl' />
              <ReportList tab='bnpl' />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='briefcase'>
              <ReportTypeTab title='briefcase' />
              <ReportListBriefcase />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='extension-to-bnpl'>
              <ReportTypeTab title='extension-to-bnpl' />
              <ReportByExitensionBnpl />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='statistics-by-region'>
              <ReportTypeTab title='statistics-by-region' />
              <ReportByRegions />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='merchant-statistics'>
              <ReportTypeTab title='merchant-statistics' />
              <ReportByMerchants />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='borrower-statistics'>
              <ReportTypeTab title='borrower-statistics' />
              <ReportByStatus />
            </TabPanel>
          </Card>
        </TabContext>
      </Grid>
    </Grid>
  )
}
export default ReportTab

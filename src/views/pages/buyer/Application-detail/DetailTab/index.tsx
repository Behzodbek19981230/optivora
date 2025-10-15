import { SyntheticEvent, useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import Translations from 'src/layouts/components/Translations'
import { Icon } from '@iconify/react'
import GeneralInfo from './GeneralInfo'
import Button, { ButtonProps } from '@mui/material/Button'
import PaymentSchedule from './PaymentSchedule'
import PaidCompany from './PaidCompany'
import CallHistory from './CallHistory'
import { Box, useTheme } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import Link from 'next/link'
import { ApplicationInfo, ApplicationUserType } from 'src/context/types'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useRouter } from 'next/router'
import moment from 'moment'

const DetailTab = () => {
  const theme = useTheme()
  const router = useRouter()
  const [value, setValue] = useState<string>('1')
  const [apiData, setApidata] = useState<ApplicationUserType & ApplicationInfo>()
  const fetchData = async () => {
    const response = await DataService.get(endpoints.applicationGetById(router.query?.application))
    const resInfo = await DataService.get(endpoints.applicationInfoByID(router.query?.application))

    setApidata({ ...response?.data?.result, loan_amount: response.data?.result?.total_sum, ...resInfo?.data?.result })
  }
  useEffect(() => {
    fetchData()
  }, [])
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <PageHeader
          title={
            <Box sx={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Typography variant='h4'>
                <Translations text='applic_' /> № {apiData?.id}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 4 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                  <Translations text='Application_date_and_time' />:
                </Typography>
                <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {moment(apiData?.created_at).format('DD-MM-yyyy HH:mm')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 4 }}>
                <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                  <Translations text='Contract_number' />:
                </Typography>
                <Typography sx={{ color: 'text.secondary', textAlign: 'start' }}>{apiData?.contract} </Typography>
              </Box>
            </Box>
          }
        />
        <Typography sx={{ fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
          <Translations text='app_details_info' />
          <Typography
            flexWrap='wrap'
            component={Link}
            href={`#`}
            sx={{
              fontWeight: 500,
              fontSize: 14,
              textDecoration: 'none',
              color: theme.palette.primary.main,
              '&:hover': { color: 'primary.main' }
            }}
          >
            <Translations text='More_details' />
          </Typography>
        </Typography>
      </Box>
      <TabContext value={value}>
        <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
          <Tab
            value='1'
            label={<Translations text='general_information' />}
            iconPosition='start'
            icon={<Icon fontSize='1.125rem' icon='tabler:file-text' />}
            sx={{ mr: 5 }}
          />
          <Tab
            value='2'
            iconPosition='start'
            label={<Translations text='Payment_schedule' />}
            icon={<Icon fontSize='1.125rem' icon='tabler:calendar-time' />}
          />
          {/* <Tab
            value='3'
            iconPosition='start'
            label={<Translations text='Paid_insurance_company' />}
            icon={<Icon fontSize='1.125rem' icon='tabler:shield-check' />}
          />
          <Tab
            value='4'
            iconPosition='start'
            label={<Translations text='Call_history' />}
            icon={<Icon fontSize='1.125rem' icon='tabler:message' />}
          /> */}
        </TabList>
        <TabPanel value='1' sx={{ p: 0 }}>
          <GeneralInfo apiData={apiData as ApplicationUserType & ApplicationInfo} />
        </TabPanel>
        <TabPanel value='2' sx={{ p: 0 }}>
          <PaymentSchedule apiData={apiData as ApplicationUserType & ApplicationInfo} />
        </TabPanel>
        <TabPanel value='3' sx={{ p: 0 }}>
          {/* <PaidCompany /> */}
        </TabPanel>
        <TabPanel value='4' sx={{ p: 0 }}>
          {/* <CallHistory /> */}
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default DetailTab

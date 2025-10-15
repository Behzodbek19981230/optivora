import { SyntheticEvent, useState } from 'react'
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

const DetailTab = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab
          value='1'
          label={<Translations text='Общая информация' />}
          iconPosition='start'
          icon={<Icon fontSize='1.125rem' icon='tabler:file-text' />}
          sx={{ mr: 5 }}
        />
        <Tab
          value='2'
          iconPosition='start'
          label={<Translations text='График платежей' />}
          icon={<Icon fontSize='1.125rem' icon='tabler:calendar-time' />}
        />
        {/* <Tab
          value='3'
          iconPosition='start'
          label={<Translations text='Выплачено страховой компании' />}
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
        <GeneralInfo />
      </TabPanel>
      <TabPanel value='2' sx={{ p: 0 }}>
        <PaymentSchedule />
      </TabPanel>
      <TabPanel value='3' sx={{ p: 0 }}>
        <PaidCompany />
      </TabPanel>
      <TabPanel value='4' sx={{ p: 0 }}>
        <CallHistory />
      </TabPanel>
    </TabContext>
  )
}

export default DetailTab

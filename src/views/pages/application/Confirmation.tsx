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
import Icon from 'src/@core/components/icon'
import { Badge, BadgeProps, Button, Card, CardContent } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
const Confirmation = () => {
  const [activeTab, setActiveTab] = useState<string>('all_application')
  const [isLoading, setIsLoading] = useState<boolean>(true)
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
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab
          value='all_application'
          label={
            <StyledBadge badgeContent={99} color='primary' sx={{ pr: 6 }}>
              <Translations text='all_application' />
            </StyledBadge>
          }
        />
        <Tab
          value='new_application'
          label={
            <StyledBadge badgeContent={90} color='primary' sx={{ pr: 6 }}>
              <Translations text='new_application' />
            </StyledBadge>
          }
        />
        <Tab
          value='accepted'
          label={
            <StyledBadge badgeContent={9} color='primary' sx={{ pr: 6 }}>
              <Translations text='accepted' />
            </StyledBadge>
          }
        />
        <Tab
          value='refused'
          label={
            <StyledBadge badgeContent={9} color='primary' sx={{ pr: 6 }}>
              <Translations text='refused' />
            </StyledBadge>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        <>
          <TabPanel sx={{ p: 0 }} value='all_application'>
            {/* <ConfirmationListTab apiData={} fetchData={fetchData}/> */}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='new_application'>
            {/* <ConfirmationListTab apiData={} fetchData={fetchData}/> */}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='accepted'>
            {/* <ConfirmationListTab apiData={} fetchData={fetchData}/> */}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='refused'>
            {/* <ConfirmationListTab apiData={} fetchData={fetchData}/> */}
          </TabPanel>
        </>
      </Box>
    </TabContext>
  )
}

export default Confirmation

import { SyntheticEvent, useState, useEffect, ReactElement } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import { Badge, BadgeProps, Card, CardContent } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import Interest from './Interest'
import UsersList from './Users'
import MerchantBranchPersonal from './Personel'
import FallbackSpinner from 'src/@core/components/spinner'
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
const MerchantBranchEdite = () => {
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [id, setId] = useState<string>()
  const router = useRouter()
  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    setIsLoading(false)
  }
  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false)
    }
  }, [router.isReady])

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
          value='profile'
          label={
            <StyledBadge color='primary' sx={{ pr: 6 }}>
              <Translations text='Branch' />
            </StyledBadge>
          }
        />

        <Tab
          value='users'
          label={
            <StyledBadge color='primary' sx={{ pr: 6 }}>
              <Translations text='Users' />
            </StyledBadge>
          }
        />
        <Tab
          value='prosents'
          label={
            <StyledBadge color='primary' sx={{ pr: 6 }}>
              <Translations text='Interest' />
            </StyledBadge>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        {!isLoading ? (
          <>
            <TabPanel sx={{ p: 0 }} value='profile'>
              <MerchantBranchPersonal id={router.query.id as string} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='users'>
              <UsersList id={router.query.id as string} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='prosents'>
              <Interest />
            </TabPanel>
          </>
        ) : (
          <FallbackSpinner />
        )}
      </Box>
    </TabContext>
  )
}

export default MerchantBranchEdite

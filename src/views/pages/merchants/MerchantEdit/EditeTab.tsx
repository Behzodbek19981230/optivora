// ** React Imports
import { SyntheticEvent, useState, useEffect, ReactElement } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import { Badge, BadgeProps, Card, CardContent } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'

import toast from 'react-hot-toast'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import MerchantPersonal from './Personel'
import Filials from './Filials'
import Interest from './Interest'
import UsersList from './Users'
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import FallbackSpinner from 'src/@core/components/spinner'
import { useSelector } from 'react-redux'

// ** Styled Tab component
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
const MerchantEdite = () => {
  // ** State
  const [data, setData] = useState<any>()
  const hasBranch = useSelector((state: any) => state?.tabBranch?.hasBranch)
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    setIsLoading(false)
  }
  const fetchData = async () => {
    setIsLoading(true)
    const res = await DataService.get(endpoints.merchant + `/${router.query?.id}`)
    setData(res.data?.result)
    setIsLoading(false)
  }
  useEffect(() => {
    if (router.isReady) {
      fetchData()
    }
  }, [router.isReady, hasBranch])

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
              <Translations text='Profile' />
            </StyledBadge>
          }
        />
        {data?.has_branch ? (
          <Tab
            value='filial'
            label={
              // <StyledBadge badgeContent={90} color='primary' sx={{ pr: 6 }}>
              <StyledBadge color='primary' sx={{ pr: 6 }}>
                <Translations text='Branches' />
              </StyledBadge>
            }
          />
        ) : (
          ''
        )}
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
              <MerchantPersonal id={router.query.id as string} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='filial'>
              <Filials id={router.query.id as string} />
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

export default MerchantEdite

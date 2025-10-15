import { SyntheticEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { ApiListStructure } from 'src/context/types'
import ConfirmationListTabAll from './All'
import ConfirmationListTabNew from './New'
import ConfirmationListTabAccepted from './Accepted'
import ConfirmationListTabRefused from './Refused'
import { useAuth } from 'src/hooks/useAuth'
import ConfirmationListTabSchedule from './Schedule'
import { StatusesEnum } from 'src/configs/const'
import ConfirmationListTabApprove from './Approving'
import Identification from 'src/views/pages/client/application-create/Identification'
import IdentificationListTabApprove from 'src/views/pages/agreement/agreementTab/confirmation/Identification'

// ** Styled Tab component
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))
type ApiDataStatus = {
  allList: ApiListStructure | null
  openList: ApiListStructure | null
  indentificationList: ApiListStructure | null
  scoringList: ApiListStructure | null
  approvingList: ApiListStructure | null
  verifyingList: ApiListStructure | null

  scheduleList: ApiListStructure | null
}
const Confirmation = () => {
  const [activeTab, setActiveTab] = useState<string>('all_application')
  const [apiData, setApiData] = useState<ApiDataStatus>({
    allList: null,
    openList: null,
    indentificationList: null,
    scoringList: null,
    approvingList: null,
    scheduleList: null,
    verifyingList: null
  })
  const user = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [value, setValue] = useState<string>('')
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({ page: 0, pageSize: 10 })
  const [refresh, setRefresh] = useState<string>()
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resAll = await DataService.get(endpoints.applicationApprovedFilter, {
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })
      // Fetch active list
      const res = await DataService.get(endpoints.applicationApprovedFilter, {
        status: 'open',
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })
      const resi = await DataService.get(endpoints.applicationApprovedFilter, {
        status: 'identification',
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })
      // Fetch passive list
      const resp = await DataService.get(endpoints.applicationApprovedFilter, {
        status: StatusesEnum.scoring,
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })
      // Fetch blocked list
      const resb = await DataService.get(endpoints.applicationApprovedFilter, {
        status: StatusesEnum.approving,
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })
      const resv = await DataService.get(endpoints.applicationApprovedFilter, {
        status: StatusesEnum.verifying,
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })
      const ress = await DataService.get(endpoints.applicationApprovedFilter, {
        status: StatusesEnum.scheduling,
        search: value,
        page: pagination.page + 1,
        perpage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id : null
      })

      setApiData({
        allList: resAll.data,
        openList: res.data,
        indentificationList: resi.data,
        scoringList: resp.data,
        approvingList: resb.data,
        scheduleList: ress.data,
        verifyingList: resv.data
      })
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
  }, [value, pagination])

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    setIsLoading(false)
  }
  useEffect(() => {
    setIsLoading(true)
  }, [])

  function onRefresh() {
    setRefresh(Date().toString())
  }

  return (
    <TabContext value={activeTab}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          <Translations text='Applications_for_confirmation_of_installments' />
        </Typography>
        <Button variant='outlined' startIcon={<Icon icon='tabler:refresh' />} onClick={onRefresh}>
          <Translations text='Update_list' />
        </Button>
      </CardContent>
      <TabList
        variant='fullWidth'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab
          value='all_application'
          label={
            <StyledBadge badgeContent={apiData?.allList?.pagination?.total} max={9999} color='primary' sx={{ pr: 6 }}>
              <Translations text='all_application' />
            </StyledBadge>
          }
        />
        <Tab
          value='new_application'
          label={
            <StyledBadge badgeContent={apiData?.openList?.pagination.total} max={9999} color='primary' sx={{ pr: 6 }}>
              <Translations text='new_application' />
            </StyledBadge>
          }
        />
        <Tab
          value='identification'
          label={
            <StyledBadge
              badgeContent={apiData?.indentificationList?.pagination.total}
              max={9999}
              color='primary'
              sx={{ pr: 6 }}
            >
              <Translations text='identification' />
            </StyledBadge>
          }
        />
        <Tab
          value='scoring'
          label={
            <StyledBadge
              badgeContent={apiData?.scoringList?.pagination.total}
              max={9999}
              color='primary'
              sx={{ pr: 6 }}
            >
              <Translations text='scoring_' />
            </StyledBadge>
          }
        />

        <Tab
          value='approving'
          label={
            <StyledBadge
              badgeContent={apiData?.approvingList?.pagination.total}
              max={9999}
              color='primary'
              sx={{ pr: 6 }}
            >
              <Translations text='approving_' />
            </StyledBadge>
          }
        />

        <Tab
          value='verifying'
          label={
            <StyledBadge
              badgeContent={apiData?.verifyingList?.pagination.total}
              max={9999}
              color='primary'
              sx={{ pr: 6 }}
            >
              <Translations text='verifying_' />
            </StyledBadge>
          }
        />
        <Tab
          value='scheduling'
          label={
            <StyledBadge
              badgeContent={apiData?.scheduleList?.pagination.total}
              max={9999}
              color='primary'
              sx={{ pr: 6 }}
            >
              <Translations text='scheduling_' />
            </StyledBadge>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        <>
          <TabPanel sx={{ p: 0 }} value='all_application'>
            <ConfirmationListTabAll refresh={refresh as string} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='new_application'>
            <ConfirmationListTabNew refresh={refresh as string} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='identification'>
            <IdentificationListTabApprove refresh={refresh as string} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='scoring'>
            <ConfirmationListTabAccepted refresh={refresh as string} />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value='approving'>
            <ConfirmationListTabApprove refresh={refresh as string} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='verifying'>
            <ConfirmationListTabRefused refresh={refresh as string} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='scheduling'>
            <ConfirmationListTabSchedule refresh={refresh as string} />
          </TabPanel>
        </>
      </Box>
    </TabContext>
  )
}

export default Confirmation

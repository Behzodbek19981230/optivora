import { TabContext, TabPanel } from '@mui/lab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import ApplicationMainTab from 'src/views/pages/application/MainTab'
import MerchantBranches from 'src/views/pages/merchants/detail/MerchantBranches'
import MerchantProfile from 'src/views/pages/merchants/detail/MerchantProfile'
import MerchantStorys from 'src/views/pages/merchants/detail/MerchantStory'
import MerchantUsers from 'src/views/pages/merchants/detail/MerchantUsers'
interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const MerchantDetail = ({ data }: any) => {
  const { t } = useTranslation()
  const [apiData, setApiData] = useState<any>()
  const [startDate, setStartDate] = useState<DateType>(new Date())
  const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15))
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
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.primary.main,

      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }))
  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <CustomTextField
        size='small'
        inputRef={ref}
        {...props}
        value={value}
        InputProps={{
          endAdornment: <Icon fontSize='1.25rem' icon={'tabler:calendar'} />
        }}
      />
    )
  })
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const { direction } = theme
  const handleChange = (e: string) => {
    setActiveTab(e)
  }
  const fetchData = async () => {
    const res = await DataService.get(endpoints.merchant + `/${router.query?.id}`)
    setApiData(res.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  if (apiData) {
    return (
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled
                  src={
                    apiData?.logo ? `${process.env.NEXT_PUBLIC_BASE_URL}/${apiData?.logo}` : '/images/logos/slack.png'
                  }
                  alt='Profile Pic'
                />
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'end', justifyContent: 'space-between' }}>
                  <Box sx={{ width: '80%' }}>
                    <Typography variant='h3'>{apiData?.name}</Typography>
                    <Box sx={{ display: 'flex', mt: 4, alignItems: 'end' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Icon icon='tabler:id' color={theme.palette.primary.main} />
                        <Typography variant='body2' sx={{ ml: 1, fontSize: 14 }}>
                          {apiData?.inn}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Icon icon='tabler:user-circle' color={theme.palette.primary.main} />
                        <Typography variant='body2' sx={{ ml: 1, fontSize: 14 }}>
                          {apiData?.username}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Icon icon='tabler:phone' color={theme.palette.primary.main} />
                        <Typography variant='body2' sx={{ ml: 1, fontSize: 14 }}>
                          {apiData?.owner_phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Icon icon='tabler:calendar' color={theme.palette.primary.main} />
                        <Typography variant='body2' sx={{ ml: 1, fontSize: 14 }}>
                          {moment(apiData?.created_at).format('DD.MM.YYYY HH:mm')}
                        </Typography>
                      </Box>
                      {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <CustomChip
                          rounded
                          skin='light'
                          size='small'
                          label={apiData?. ? t('verified_') : t('noverified_')}
                          color={apiData?.is_active ? 'success' : 'error'}
                          // sx={{ textTransform: 'capitalize' }}
                        />
                      </Box> */}
                    </Box>
                    <Box sx={{ marginTop: 3 }}>
                      <TabList
                        variant='scrollable'
                        scrollButtons='auto'
                        aria-label='forced scroll tabs example'
                        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                      >
                        <Tab
                          onClick={() => handleChange('profile')}
                          value='profile'
                          label={<Translations text='Profile' />}
                          icon={<Icon fontSize='1.125rem' icon='tabler:user' />}
                          sx={{ mr: 5 }}
                        />
                        <Tab
                          onClick={() => handleChange('branches')}
                          value='branches'
                          label={<Translations text='Branches' />}
                          icon={<Icon fontSize='1.125rem' icon='tabler:hierarchy-2' />}
                          sx={{ mr: 5 }}
                        />
                        <Tab
                          onClick={() => handleChange('users')}
                          value='users'
                          label={<Translations text='Users' />}
                          icon={<Icon fontSize='1.125rem' icon='tabler:users' />}
                          sx={{ mr: 5 }}
                        />
                        <Tab
                          onClick={() => handleChange('application')}
                          value='application'
                          label={<Translations text='Application' />}
                          icon={<Icon fontSize='1.125rem' icon='tabler:shopping-cart' />}
                          sx={{ mr: 5 }}
                        />
                        <Tab
                          onClick={() => handleChange('story')}
                          value='story'
                          label={<Translations text='story_' />}
                          icon={<Icon fontSize='1.125rem' icon='tabler:clock' />}
                        />
                      </TabList>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {apiData?.static_contract != 'null' ? (
                      <Link target='_blank' href={`${process.env.NEXT_PUBLIC_BASE_URL}/${apiData?.static_contract}`}>
                        <Button variant='outlined' sx={{ '& svg': { mr: 2 } }}>
                          <Icon icon='tabler:download' />
                          <Translations text='Download_contract' />
                        </Button>
                      </Link>
                    ) : (
                      ''
                    )}
                    <Button
                      variant='contained'
                      sx={{ '& svg': { mr: 2 } }}
                      onClick={() => router.push(`/merchants/edit/${router.query?.id}`)}
                    >
                      <Icon icon='tabler:edit' />
                      <Translations text='edit_profile' />
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <TabPanel sx={{ p: 0, py: 10 }} value='profile'>
              <MerchantProfile data={apiData} />
            </TabPanel>
            <TabPanel sx={{ p: 0, py: 10 }} value='branches'>
              <MerchantBranches id={router.query?.id as string} />
            </TabPanel>
            <TabPanel sx={{ p: 0, py: 10 }} value='users'>
              <MerchantUsers id={router.query?.id as string} />
            </TabPanel>
            <TabPanel sx={{ p: 0, py: 10 }} value='application'>
              <ApplicationMainTab />
            </TabPanel>
            <TabPanel sx={{ p: 0, py: 10 }} value='story'>
              <MerchantStorys id={router.query?.id as string} />
            </TabPanel>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', gap: 5 }}>
            <Button variant='contained' color='secondary' onClick={() => router.back()}>
              <Translations text='Cancel' />
            </Button>
          </Grid>
        </Grid>
      </TabContext>
    )
  } else return <></>
}
export default MerchantDetail

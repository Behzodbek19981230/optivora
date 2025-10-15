import { useState, SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTab, { TabProps } from '@mui/material/Tab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import ApplicationList from 'src/views/pages/application/TabContent/ApplicationList'
import { useAuth } from 'src/hooks/useAuth'
import DetailTab from './DetailTab'
import { useTranslation } from 'react-i18next'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
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
const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ApplicationDetailBuyer = ({ apiData }: any) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const auth = useAuth()
  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    router
      .push({
        pathname: `/buyer/${router.query?.id}/${value}`
      })
      .then(() => {
        setActiveTab(value)
        setIsLoading(false)
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={apiData?.image ?? '/images/avatars/3.png'} alt='Profile Pic' />
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mr: 4, color: 'text.disabled' }}>ID #{apiData?.id}</Typography>
                    <CustomChip
                      rounded
                      skin='light'
                      size='small'
                      label={apiData?.is_active ? t('verified_') : t('noverified_')}
                      color={apiData?.is_active ? 'success' : 'error'}
                      // sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Typography variant='h3' sx={{ my: 2 }}>
                    {apiData?.name}
                  </Typography>
                  <TabList
                    variant='scrollable'
                    scrollButtons='auto'
                    onChange={handleChange}
                    aria-label='forced scroll tabs example'
                    sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                  >
                    <Tab
                      value='info'
                      label={<Translations text='Detailed_information' />}
                      icon={<Icon fontSize='1.125rem' icon='tabler:user' />}
                      sx={{ mr: 5 }}
                    />
                    <Tab
                      value='application'
                      label={<Translations text='Application' />}
                      icon={<Icon fontSize='1.125rem' icon='tabler:shopping-cart' />}
                    />
                  </TabList>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                      <Icon fontSize='1.75rem' icon='tabler:shopping-cart' />
                    </CustomAvatar>
                    <div>
                      <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        <CurrencyFormatter amount={apiData?.remaining} currency='sum' />
                      </Typography>
                      <Typography variant='body2'>
                        <Translations text='Current_limit' />
                      </Typography>
                    </div>
                  </Box>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                      <Icon fontSize='1.75rem' icon='tabler:clock' />
                    </CustomAvatar>
                    <div>
                      <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>000’000’000.00</Typography>
                      <Typography variant='body2'>Просрочка</Typography>
                    </div>
                  </Box> */}
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 10 }}>
            <TabPanel sx={{ p: 0 }} value='info'>
              <CardContent>
                <Typography variant='h3' sx={{ color: 'text.disabled' }}>
                  <Translations text='Detailed_information' />
                </Typography>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                      <Translations text='Address' />:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {auth.user && (auth.user.role === 'superuser' || auth.user.role === 'manager')
                        ? apiData?.address
                        : '******'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                      <Translations text='Passport_details' />:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {auth.user && (auth.user.role === 'superuser' || auth.user.role === 'manager')
                        ? apiData?.passport
                        : '******'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                      <Translations text='Place_of_work_TIN' />:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {auth.user && (auth.user.role === 'superuser' || auth.user.role === 'manager')
                        ? apiData?.inn
                        : '******'}
                    </Typography>
                  </Box>
                  {apiData?.phone ? (
                    <Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
                      <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                        <Translations text='phone' />:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>+{apiData?.phone} </Typography>
                    </Box>
                  ) : (
                    ''
                  )}
                  {apiData?.additional_phone ? (
                    <Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
                      <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                        <Translations text='phone' />:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>+{apiData?.additional_phone} </Typography>
                    </Box>
                  ) : (
                    ''
                  )}
                </Box>
                {/* <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Translations text='Добавить новый номер' />
                </Button> */}
              </CardContent>
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='application'>
              <ApplicationList />
            </TabPanel>
          </Card>
        </TabContext>
        <Card>
          <CardContent>
            <DetailTab />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
export default ApplicationDetailBuyer

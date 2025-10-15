// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent } from 'react'

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
import DetailTab from './DetailTab'
import PageHeader from 'src/@core/components/page-header'
import Link from 'next/link'
interface Data {
  email: string
  state: string
  address: string
  country: string
  lastName: string
  currency: string
  language: string
  timezone: string
  firstName: string
  organization: string
  number: number | string
  zipCode: number | string
}

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

const DetailBuyer = ({ tab, data }: any) => {
  // ** State
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    router
      .push({
        pathname: `/buyer/list/detail/${router.query?.id}/application-detail/${value}`
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
              <ImgStyled src='/images/avatars/3.png' alt='Profile Pic' />
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mr: 4, color: 'text.disabled' }}>ID #0000001</Typography>{' '}
                    <CustomChip
                      rounded
                      skin='light'
                      size='small'
                      label='Верифицирован'
                      color='success'
                      // sx={{ textTransform: 'capitalize' }}
                    />{' '}
                  </Box>
                  <Typography variant='h3' sx={{ my: 2 }}>
                    {data?.fullName}
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
                      label={<Translations text='Детальная информация' />}
                      icon={<Icon fontSize='1.125rem' icon='tabler:user' />}
                      sx={{ mr: 5 }}
                    />
                    <Tab
                      value='application'
                      label={<Translations text='Заявки' />}
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
                      <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>000’000’000.00</Typography>
                      <Typography variant='body2'>Текущий лимит</Typography>
                    </div>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                      <Icon fontSize='1.75rem' icon='tabler:clock' />
                    </CustomAvatar>
                    <div>
                      <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>000’000’000.00</Typography>
                      <Typography variant='body2'>Просрочка</Typography>
                    </div>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 10 }}>
            <TabPanel sx={{ p: 0 }} value='info'>
              <CardContent>
                <Typography variant='h3' sx={{ color: 'text.disabled' }}>
                  <Translations text='Детальная информация' />{' '}
                </Typography>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                      Адрес:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Узбекистан, Республика Каракалпакстан, Беруни, ул. Строительная, 1
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                      Паспортные данные:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>XX 1234567 </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                      Место работы ИНН:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>123 456 789</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                      Телефон:{' '}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>+998-88-888-88-88 </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: '10%' }}>
                      Телефон:{' '}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>+998-88-888-88-88 </Typography>
                  </Box>
                </Box>
                <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Translations text='Добавить новый номер' />
                </Button>
              </CardContent>{' '}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='application'>
              <ApplicationList />{' '}
            </TabPanel>
          </Card>
          <Card sx={{ mt: 10 }}>
            <CardContent>
              <PageHeader title={<Typography variant='h4'>Заявка №12345</Typography>} />
              <Typography sx={{ my: 6 }}>
                Тут показано все собранные товары клиента за текущее время. Нужно учитывать, что общая сумма товара не
                должно превышать максимальную сумму рассрочки.
                <Typography
                  flexWrap='wrap'
                  component={Link}
                  href={`/buyer/list/`}
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Подробнее{' '}
                </Typography>
              </Typography>
              <DetailTab />
            </CardContent>
          </Card>
        </TabContext>
      </Grid>
    </Grid>
  )
}
export default DetailBuyer

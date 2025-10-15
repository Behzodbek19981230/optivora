import { Grid, styled, Box, Button, CardContent, Typography, useTheme, Tab, Badge, BadgeProps } from '@mui/material'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import { useRouter } from 'next/router'
import CustomTextField from 'src/@core/components/mui/text-field'
import Card from '@mui/material/Card'
import { ButtonProps } from '@mui/material/Button'
import Translations from 'src/layouts/components/Translations'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Icon } from '@iconify/react'
import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import Link from 'next/link'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { StatesEnum, StatusesEnum } from 'src/configs/const'
import QRCode from 'react-qr-code'
import { ApplicationUserType, ProductType, ScheduleType } from 'src/context/types'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import moment from 'moment'
import { generatePDF } from 'src/views/components/pdf'
import { useTranslation } from 'react-i18next'

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))

export default function Schedule({ apiData }: { apiData?: ApplicationUserType }) {
  const printRef1 = useRef<HTMLDivElement>(null)
  const printRef2 = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const theme = useTheme()
  const [step, setStep] = useState(0)
  const [size, setSize] = useState(150)
  const [totalSum, setTotalSum] = useState(0)
  const [activeTab, setActiveTab] = useState('info')
  // const [baseLink, setBase64Link] = useState<string>()
  const [scheduleData, setScheduleData] = useState<ScheduleType>()
  const handleStep = () => {
    setStep(1)
  }
  const fetchData = async () => {
    try {
      const res = await DataService.get(endpoints.schedule(apiData?.id))
      setScheduleData(res?.data?.result)
      const resProd = await DataService.get(endpoints.productGetByID(apiData?.id))
      setTotalSum(
        resProd?.data?.result?.reduce((s: number, item: ProductType) => {
          return s + Number(item.price) * item.count
        }, 0)
      )
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = () => {
    generatePDF(printRef1, printRef2, `${t('Payment_schedule')}_${apiData?.id}`)
  }
  if (step == 0)
    return (
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%'
        }}
      >
        {/* <PdfGenerate onDownload={pdfDownload} /> */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Img height='150' alt='error-illustration' src='/images/info.svg' style={{ marginTop: 0 }} />
          <Typography sx={{ fontSize: 28, fontWeight: 700, width: '50%', textAlign: 'center' }}>
            <Translations text='Congratulations!' />
          </Typography>

          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 5 }}>
            <Translations text='info_confirmation' />
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, width: '50%', textAlign: 'center' }}>
            <Translations text='applic_' /> № {apiData?.id}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexDirection: 'column'
          }}
        >
          {scheduleData?.schedule_file && <QRCode value={scheduleData?.schedule_file as string} size={size} />}
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.grey[500] }}>
            <Translations text='info_target_pdf' />
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ my: 3 }}>
          <Grid item md={6} xs>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 500, width: '50%', textAlign: 'center' }}>
                <Translations text='Monthly_payment' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <CurrencyFormatter amount={scheduleData?.monthly_payment as number} currency='sum' />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 500, width: '50%', textAlign: 'center' }}>
                <Translations text='Total_debt' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {' '}
                <CurrencyFormatter amount={scheduleData?.total_sum as number} currency='sum' />
              </Typography>
            </Box>
          </Grid>
          <Grid item md={6} xs>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 500, width: '50%', textAlign: 'center' }}>
                <Translations text='Installment_period' />:
              </Typography>

              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {apiData?.period} <Translations text='month' />
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 500, width: '50%', textAlign: 'center' }}>
                <Translations text='Total_repayment_amount' />
              </Typography>
            </Box> */}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleStep}>
            <Translations text='Submit_data_for_processing' /> <Icon icon='tabler:arrow-right' />
          </Button>
        </Box>
      </CardContent>
    )
  else
    return (
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0
        }}
      >
        <Box>
          <PageHeader
            title={
              <Typography variant='h4'>
                {' '}
                <Translations text='applic_' /> № {apiData?.id}
              </Typography>
            }
          />
          <Typography sx={{ my: 6 }}>
            <Translations text='info_schedule' />
            <Typography
              flexWrap='wrap'
              component={Link}
              href={`/buyer/${apiData?.user?.id}/application-detail/${apiData?.id}/`}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: theme.palette.primary.main,
                '&:hover': { color: 'primary.main' }
              }}
            >
              <Translations text='More_details' />
            </Typography>
          </Typography>
          {/* <TabContext value={activeTab}>
            <TabList
              variant='scrollable'
              scrollButtons='auto'
              onChange={handleChange}
              aria-label='forced scroll tabs example'
              sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
              <Tab
                value='info'
                sx={{ flexDirection: 'row' }}
                icon={<Icon fontSize='1.125rem' icon='tabler:file-text' style={{ marginBottom: 0 }} />}
                label={<Translations text='general_information' />}
              />
              <Tab
                value='table'
                sx={{ flexDirection: 'row' }}
                icon={<Icon fontSize='1.125rem' icon='tabler:calendar-time' style={{ marginBottom: 0 }} />}
                label={<Translations text='Payment_schedule' />}
              />
            </TabList>
            <TabPanel sx={{ p: 0 }} value='info'> */}
          <Box ref={printRef1}>
            <Grid container spacing={6} sx={{ my: 3 }}>
              <Grid item md={6} xs sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* <Box>
                  <Img
                    height='120'
                    sx={{ marginTop: '0 !important', display: 'none' }}
                    width='100%'
                    src='/images/allgood.png'
                  />
                </Box> */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='Monthly_payment' /> :
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {/* {scheduleData && (
                        <CurrencyFormatter
                          amount={
                            scheduleData?.total_sum + scheduleData?.contract_period * scheduleData?.monthly_payment
                          }
                          currency='sum'
                        />
                      )} */}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='Total_debt' />
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {' '}
                    <CurrencyFormatter amount={scheduleData?.total_sum as number} currency='sum' />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='Monthly_fee' />
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      <CurrencyFormatter amount={scheduleData?.monthly_payment as number} currency='sum' />
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='Installment_period' />
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>
                    {scheduleData?.contract_period} <Translations text='month' />
                  </Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', gap: 2,  }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                      <Translations text='agreement' />
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>666 011 </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2,  }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                      <Translations text='info_code_sch' /> :
                    </Typography>

                    <Typography sx={{ color: 'text.secondary', textDecorationLine: 'underline' }}>456544 </Typography>
                  </Box> */}
              </Grid>
              <Grid item md={6} xs sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='Client_full_name' /> :
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{scheduleData?.client_full_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='pasport' /> :
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{scheduleData?.client_passport_credentials}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='merchant' /> :
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{scheduleData?.merchant_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='Bank' /> :
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{scheduleData?.bank_name} </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                    <Translations text='registration_date' /> :
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{scheduleData?.formulated_at}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid sx={{ mt: 5, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant='h5'>
                <Translations text='Payment_schedule' />{' '}
              </Typography>
              <Box>
                <Button variant='outlined' sx={{ mr: 4, '& svg': { mr: 2 } }} onClick={fetchData}>
                  <Icon fontSize='1.125rem' icon='tabler:refresh' />
                  <Translations text='Update_schedule' />
                </Button>
                <Button
                  variant='outlined'
                  sx={{ '& svg': { mr: 2 } }}
                  href={`${scheduleData?.schedule_file}`}
                  target='_blank'
                >
                  <Icon fontSize='1.125rem' icon='tabler:printer' />
                  <Translations text='Print_chart' />
                </Button>
              </Box>
            </Box>
            <Box ref={printRef2}>
              <TableContainer>
                <Table aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>
                        <Translations text='schedule_1' />
                      </TableCell>
                      <TableCell align='right'>
                        <Translations text='schedule_2' />
                      </TableCell>
                      <TableCell align='right'>
                        <Translations text='schedule_3' />
                      </TableCell>
                      <TableCell align='right'>
                        <Translations text='schedule_4' />
                      </TableCell>
                      <TableCell align='right'>
                        <Translations text='schedule_5' />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scheduleData?.schedule?.map((row, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          '&:last-of-type td, &:last-of-type th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell align='center'>{row?.due_date}</TableCell>
                        <TableCell align='right'>
                          <CurrencyFormatter amount={row?.due_amount as number} currency='sum' />
                        </TableCell>
                        <TableCell align='right'>
                          <CurrencyFormatter amount={0} currency='sum' />
                        </TableCell>
                        <TableCell align='right'>
                          <CurrencyFormatter amount={row?.due_amount as number} currency='sum' />
                        </TableCell>
                        <TableCell align='right'>
                          <CurrencyFormatter amount={row.remaining_due_after_payment as number} currency='sum' />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' onClick={() => setStep(0)}>
            <Icon icon='tabler:arrow-left' />
            <Translations text='Previous' />
          </Button>
        </Box>
      </CardContent>
    )
}

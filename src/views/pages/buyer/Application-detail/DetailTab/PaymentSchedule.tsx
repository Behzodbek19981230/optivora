import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Icon } from '@iconify/react'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import { ApplicationUserType, ScheduleType } from 'src/context/types'
import { useEffect, useRef, useState } from 'react'
import { styled, useTheme } from '@mui/material'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import moment from 'moment'
import { generatePDF } from 'src/views/components/pdf'
import { useTranslation } from 'react-i18next'
import { isNull } from 'util'
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
const PaymentSchedule = ({ apiData }: { apiData?: ApplicationUserType }) => {
  const printRef1 = useRef<HTMLDivElement>(null)
  const printRef2 = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const { t } = useTranslation()
  const [scheduleData, setScheduleData] = useState<ScheduleType>()

  const fetchData = async () => {
    try {
      const res = await DataService.get(endpoints.schedule(apiData?.id))
      setScheduleData(res?.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

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
        <Box ref={printRef1}>
          <Grid container spacing={6} sx={{ my: 3 }}>
            <Grid item md={6} xs sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                  <Translations text='Total_debt' />
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
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
    </CardContent>
  )
}
export default PaymentSchedule

import React, { use, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePDF } from '.'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useRouter } from 'next/router'
import { ScheduleType } from 'src/context/types'
import {
  Box,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled
} from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import moment from 'moment'

export default function PdfDownload() {
  const printRef1 = useRef<HTMLDivElement>(null)
  const printRef2 = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const [scheduleData, setScheduleData] = useState<ScheduleType>()
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
  const router = useRouter()
  const fetchData = async () => {
    try {
      const res = await DataService.get(endpoints.schedule(router.query?.id))
      setScheduleData(res?.data?.result)
      generatePDF(printRef1, printRef2, `${t('Payment_schedule')}_${router.query?.id}`)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
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
        <Box ref={printRef1}>
          <Grid container spacing={6} sx={{ my: 3 }}>
            <Grid item md={6} xs sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Img
                  height='120'
                  sx={{ marginTop: '0 !important', display: 'none' }}
                  width='100%'
                  src='/images/allgood.png'
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                  <Translations text='Installment_amount' /> :
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {scheduleData && (
                    <CurrencyFormatter
                      amount={scheduleData?.total_sum + scheduleData?.contract_period * scheduleData?.monthly_payment}
                      currency='sum'
                    />
                  )}
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
              {/* <Box>
                  <Img height='120' sx={{ marginTop: '0 !important' }} width='100%' src='/images/Anorbank.png' />
                </Box> */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                  <Translations text='Client_full_name' /> :
                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>hbsdvcsvh</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 500, width: '50%' }}>
                  <Translations text='pasport' /> :
                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>ssdcsdc</Typography>
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

                <Typography sx={{ color: 'text.secondary' }}>
                  {moment(scheduleData?.formulated_at).format('DD.MM.YYYY')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
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
                    <TableCell align='center'>{moment(row?.due_date).format('DD.MM.YYYY')}</TableCell>
                    <TableCell align='right'>
                      <CurrencyFormatter amount={row?.due_amount_with_percent as number} currency='sum' />
                    </TableCell>
                    <TableCell align='right'>
                      <CurrencyFormatter amount={0} currency='sum' />
                    </TableCell>
                    <TableCell align='right'>
                      <CurrencyFormatter amount={row?.due_amount_with_percent as number} currency='sum' />
                    </TableCell>
                    <TableCell align='right'>
                      {' '}
                      <CurrencyFormatter amount={row.remaining_due_after_payment as number} currency='sum' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </>
  )
}

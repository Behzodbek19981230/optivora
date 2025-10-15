// ** React Imports
import {
  Button,
  CardContent,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { forwardRef, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import uz from 'date-fns/locale/uz'
import ru from 'date-fns/locale/ru'
import downloadExcel from 'src/views/components/export/Excel'
import { LoadingButton } from '@mui/lab'
import { Icon } from '@iconify/react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}
const months = [
  { id: 1, name: 'Jan' },
  { id: 2, name: 'Feb' },
  { id: 3, name: 'Mar' },
  { id: 4, name: 'Apr' },
  { id: 5, name: 'May' },
  { id: 6, name: 'Jun' },
  { id: 7, name: 'Jul' },
  { id: 8, name: 'Aug' },
  { id: 9, name: 'Sep' },
  { id: 10, name: 'Oct' },
  { id: 11, name: 'Nov' },
  { id: 12, name: 'Dec' }
]

const ReportByMerchants = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectMonth, setSelectMonth] = useState<number | null>()
  const [selectBank, setSelectBank] = useState<number | null>()
  const [selectYear, setSelectYear] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<[]>()
  const [locale, setLocale] = useState<string>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [check, setCheck] = useState(false)
  const fetchData = async () => {
    try {
      setIsLoading(true)
      let params: any = {}
      if (check) {
        params.from = startDate ? format(startDate, 'yyyy-MM-dd') : null
        params['to'] = endDate ? format(endDate, 'yyyy-MM-dd') : null
        params.year = null
        params.month = null
      } else {
        params.from = null
        params['to'] = null
        params.year = selectYear
        params.month = selectMonth == 0 ? null : selectMonth
      }
      const resAll = await DataService.get(endpoints.reportByMerchants, params)
      setApiData(resAll.data)
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
    if (typeof window != 'undefined') {
      if (localStorage.getItem('allGoodLanguage') == 'uz') {
        registerLocale('uz', uz), setLocale('uz')
      } else {
        registerLocale('ru', ru), setLocale('ru')
      }
    }
  }, [])

  let years = []
  for (let i = 0; i < 20; i++) {
    years.push({ id: i, name: Number(new Date().getFullYear()) - i })
  }
  const onExport = async () => {
    const column = [
      {
        header: t('Category'),
        key: 'Category',
        width: 50
      },

      {
        header: t('Group'),
        key: 'Group',
        width: 30
      },
      {
        header: t('Connected_merchants'),
        key: 'Connected_merchants',
        width: 30
      },
      { header: t('Number_of_applications'), key: 'Number_of_applications', width: 30 },

      {
        header: t('number_unissued_limits'),
        key: 'number_unissued_limits',
        width: 30
      },
      {
        header: t('amount_unregistered_limits'),
        key: 'amount_unregistered_limits',
        width: 30
      },
      {
        header: t('number_of_failures'),
        key: 'number_of_failures',
        width: 30
      },
      {
        header: t('Quantity_no_limit'),
        key: 'Quantity_no_limit',
        width: 30
      },
      {
        header: t('qty_completed_applications_refusals'),
        key: 'qty_completed_applications_refusals',
        width: 30
      },
      {
        header: t('Amount_completed_applications'),
        key: 'Amount_completed_applications',
        width: 30
      }
    ]

    const data =
      apiData?.map((item: any) => ({
        [column[0].key as string]: `${item.categories}`,
        [column[1].key as string]: `${item.group}`,
        [column[2].key as string]: `${item.merchant_name}`,
        [column[3].key as string]: `${item.application_count}`,
        [column[4].key as string]: `${item.count_limit_approved}`,
        [column[5].key as string]: `${item.sum_limit_no_approved_amount}`,
        [column[6].key as string]: `${item.reject_application}`,
        [column[7].key as string]: `${item.no_limit_application}`,
        [column[8].key as string]: `${item.approved_reject_application}`,
        [column[9].key as string]: `${item.sum_limit_approved_amount}`
      })) || []
    downloadExcel(data || [], column || [], t('merchant-statistics') as string)
  }

  return (
    <Grid>
      <DatePickerWrapper>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={8} sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', width: '20%', alignItems: 'center', gap: 3 }}>
                <FormControlLabel
                  label={t('range_date')}
                  control={
                    <Checkbox defaultChecked={check} onChange={e => setCheck(e.target.checked)} name='basic-checked' />
                  }
                />
              </Box>

              {check ? (
                <Box sx={{ display: 'flex', width: '80%', alignItems: 'center', gap: 3 }}>
                  <DatePicker
                    locale={locale}
                    selected={startDate}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => {
                      setStartDate(e || undefined)
                    }}
                    placeholderText='dd-MM-yyyy'
                    dateFormat='dd-MM-yyyy'
                    customInput={
                      <CustomTextField fullWidth label={t('From') as string} aria-describedby='validation-basic-dob' />
                    }
                  />
                  <DatePicker
                    locale={locale}
                    selected={endDate}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => {
                      setEndDate(e || undefined)
                    }}
                    placeholderText='dd-MM-yyyy'
                    dateFormat='dd-MM-yyyy'
                    customInput={
                      <CustomTextField fullWidth label={t('To') as string} aria-describedby='validation-basic-dob' />
                    }
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue={0}
                    focused
                    label={t('month')}
                    color='primary'
                    onChange={e => setSelectMonth(Number(e.target.value))}
                    SelectProps={{
                      MenuProps
                    }}
                  >
                    <MenuItem value={0}>
                      <Translations text='All' />
                    </MenuItem>
                    {months.map((item: any) => (
                      <MenuItem id={item.id} value={item.id}>
                        {t(item.name)}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                  <CustomTextField
                    fullWidth
                    label={t('year')}
                    select
                    defaultValue={0}
                    focused
                    color='primary'
                    onChange={e => setSelectYear(Number(e.target.value))}
                    SelectProps={{
                      MenuProps
                    }}
                  >
                    <MenuItem value={0} disabled>
                      <Translations text='year' />
                    </MenuItem>
                    {years.map((item: any) => (
                      <MenuItem id={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <LoadingButton fullWidth loading={isLoading} variant='contained' onClick={() => fetchData()}>
                <Translations text='Find' />
              </LoadingButton>
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button fullWidth variant='outlined' startIcon={<Icon icon='tabler:screen-share' />} onClick={onExport}>
                <Translations text='Export' />
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Category')}</TableCell>
                <TableCell>{t('Group')}</TableCell>
                <TableCell>{t('Connected_merchants')}</TableCell>
                <TableCell>{t('Number_of_applications')}</TableCell>
                <TableCell>{t('number_unissued_limits')}</TableCell>
                <TableCell>{t('amount_unregistered_limits')}</TableCell>
                <TableCell>{t('number_of_failures')}</TableCell>
                <TableCell>{t('Quantity_no_limit')}</TableCell>
                <TableCell>{t('qty_completed_applications_refusals')}</TableCell>
                <TableCell>{t('Amount_completed_applications')}</TableCell>
              </TableRow>
            </TableHead>
            <TableRow sx={{ background: theme.palette.primary.main, color: 'white' }}>
              <TableCell>{t('Total')}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{apiData?.reduce((acc: any, item: any) => acc + Number(item.application_count), 0)}</TableCell>

              <TableCell>
                {apiData?.reduce((acc: any, item: any) => acc + Number(item.count_limit_no_approved), 0)}
              </TableCell>
              <TableCell>
                <CurrencyFormatter
                  amount={apiData?.reduce((acc: any, item: any) => acc + Number(item.sum_limit_no_approved_amount), 0)}
                  currency='sum'
                  color='white'
                />
              </TableCell>
              <TableCell>
                {apiData?.reduce((acc: any, item: any) => acc + Number(item.reject_application), 0)}
              </TableCell>
              <TableCell>
                {apiData?.reduce((acc: any, item: any) => acc + Number(item.no_limit_application), 0)}
              </TableCell>
              <TableCell>
                {apiData?.reduce((acc: any, item: any) => acc + Number(item.approved_reject_application), 0)}
              </TableCell>
              <TableCell>
                <CurrencyFormatter
                  amount={apiData?.reduce((acc: any, item: any) => acc + Number(item.sum_limit_approved_amount), 0)}
                  currency='sum'
                  color='white'
                />
              </TableCell>
            </TableRow>
            <TableBody>
              {apiData?.map((item: any, key: number) => (
                <TableRow key={key}>
                  <TableCell>{item.categories}</TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.merchant_name}</TableCell>
                  <TableCell>{item.application_count}</TableCell>

                  <TableCell>{item.count_limit_no_approved}</TableCell>
                  <TableCell>
                    <CurrencyFormatter amount={item.sum_limit_no_approved_amount} currency='sum' />
                  </TableCell>
                  <TableCell>{item.reject_application}</TableCell>
                  <TableCell>{item.no_limit_application}</TableCell>
                  <TableCell>{item.approved_reject_application}</TableCell>
                  <TableCell>
                    <CurrencyFormatter amount={item.sum_limit_approved_amount} currency='sum' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DatePickerWrapper>
    </Grid>
  )
}

export default ReportByMerchants

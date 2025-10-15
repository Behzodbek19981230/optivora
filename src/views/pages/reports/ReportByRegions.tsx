// ** React Imports
import {
  Button,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker, { registerLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ru from 'date-fns/locale/ru'
import uz from 'date-fns/locale/uz'
import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'
import Loader from 'src/@core/components/spinner/Loader'
import downloadExcel from 'src/views/components/export/Excel'

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

const ReportByRegions = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectMonth, setSelectMonth] = useState<number | null>()
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
      } else {
        params.year = selectYear
        params.month = selectMonth == 0 ? null : selectMonth
      }
      const resAll = await DataService.get(endpoints.reportByRegions, params)
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
        header: t('regions'),
        key: 'Regions',
        width: 50
      },
      {
        header: t('Number_of_applications'),
        key: 'Number_of_applications',
        width: 30
      },
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
      { header: t('number_of_failures'), key: 'number_of_failures', width: 30 },
      {
        header: t('Quantity_no_limit'),
        key: 'Quantity_no_limit',
        width: 30
      },
      {
        header: t('number_completed_applications'),
        key: 'number_completed_applications',
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
        [column[0].key as string]: `${item.region_name}`,
        [column[1].key as string]: `${item.count}`,
        [column[2].key as string]: `${item.approved_count}`,
        [column[3].key as string]: `${item.limit_amount}`,
        [column[4].key as string]: `${item.failed_count}`,
        [column[5].key as string]: `${item.not_limit_count}`,
        [column[6].key as string]: `${item.limit_count}`,
        [column[7].key as string]: `${item.approved_amount}`
      })) || []
    downloadExcel(data || [], column || [], t('borrower-statistics') as string)
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
              <LoadingButton fullWidth loading={isLoading} variant='contained' onClick={fetchData}>
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
          {isLoading ? (
            <Loader />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('regions')}</TableCell>
                  <TableCell>{t('Number_of_applications')}</TableCell>
                  <TableCell>{t('number_unissued_limits')}</TableCell>
                  <TableCell>{t('amount_unregistered_limits')}</TableCell>
                  <TableCell>{t('number_of_failures')}</TableCell>
                  <TableCell>{t('Quantity_no_limit')}</TableCell>
                  <TableCell>{t('number_completed_applications')}</TableCell>
                  <TableCell>{t('Amount_completed_applications')}</TableCell>
                </TableRow>
              </TableHead>
              <TableRow sx={{ background: theme.palette.primary.main, color: 'white' }}>
                <TableCell>{t('Total')}</TableCell>
                <TableCell>{apiData?.reduce((acc: number, item: any) => acc + Number(item.count), 0)}</TableCell>
                <TableCell>
                  {apiData?.reduce((acc: number, item: any) => acc + Number(item.count_limit_no_approved), 0)}
                </TableCell>
                <TableCell>
                  <CurrencyFormatter
                    amount={
                      apiData?.reduce(
                        (acc: number, item: any) => acc + Number(item.sum_limit_no_approved_amount),
                        0
                      ) as number
                    }
                    currency='sum'
                    color='white'
                  />
                </TableCell>
                <TableCell>{apiData?.reduce((acc: number, item: any) => acc + Number(item.failed_count), 0)}</TableCell>
                <TableCell>
                  {apiData?.reduce((acc: number, item: any) => acc + Number(item.not_limit_count), 0)}
                </TableCell>
                <TableCell>{apiData?.reduce((acc: number, item: any) => acc + Number(item.limit_count), 0)}</TableCell>
                <TableCell>
                  <CurrencyFormatter
                    amount={
                      apiData?.reduce((acc: number, item: any) => acc + Number(item.approved_amount), 0) as number
                    }
                    currency='sum'
                    color='white'
                  />
                </TableCell>
              </TableRow>
              <TableBody>
                {apiData?.map((item: any, key: number) => (
                  <TableRow key={key}>
                    <TableCell>{item.region_name}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.count_limit_no_approved}</TableCell>

                    <TableCell>
                      <CurrencyFormatter amount={item.sum_limit_no_approved_amount} currency='sum' />
                    </TableCell>
                    <TableCell>{item.failed_count}</TableCell>
                    <TableCell>{item.not_limit_count}</TableCell>
                    <TableCell>{item.limit_count}</TableCell>

                    <TableCell>
                      <CurrencyFormatter amount={item.approved_amount} currency='sum' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </DatePickerWrapper>
    </Grid>
  )
}

export default ReportByRegions

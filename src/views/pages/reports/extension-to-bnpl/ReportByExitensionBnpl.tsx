// ** React Imports
import {
  Button,
  CardContent,
  Checkbox,
  Collapse,
  Container,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
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
import { UsersType } from 'src/types/apps/userTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ApiListStructure, apiStructure } from 'src/context/types'
import downloadExcel from 'src/views/components/export/Excel'
import { LoadingButton } from '@mui/lab'
import { Icon } from '@iconify/react'
import Loader from 'src/@core/components/spinner/Loader'
import uz from 'date-fns/locale/uz'
import ru from 'date-fns/locale/ru'
type ExpenseType = {
  month: string
  marketing: string
  server_expenses: string
  system_improvement: string
  pht_taxes: string
  bonuses_managers: string
  office_rental: string
  tech_support: string
  other_admin_expenses: string
  bonuses_agents: string
  company_taxes: string
  forecast: string
}
type ApiData = {
  year: number
  results: []
  resultsExpense: ExpenseType[]
}
interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}
type ResultsType = {
  price: string
  total: string
  allgood_sum: string
  bank_sum: string
}
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
const banks = [
  {
    id: 1,
    name: 'Anorbank'
  },
  {
    id: 2,
    name: 'Davr Bank'
  }
]
const ReportByExitensionBnpl = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectMonth, setSelectMonth] = useState<number | null>()
  const [selectBank, setSelectBank] = useState<number | null>()
  const [selectYear, setSelectYear] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<ApiListStructure>()

  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [locale, setLocale] = useState<string>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [check, setCheck] = useState(false)
  const fetchData = async (page?: number, perPage?: number) => {
    try {
      setIsLoading(true)
      let params: any = {}
      params.page = page ?? 1
      params.perPage = perPage ?? 10
      if (check) {
        params.from = startDate
        params['to'] = endDate
        params.year = null
        params.month = null
      } else {
        params.from = null
        params['to'] = null

        params.year = selectYear
        params.month = selectMonth == 0 ? null : selectMonth
      }
      const resAll = await DataService.get(endpoints.reportByExitensionBnpl, params)
      setApiData(resAll.data)
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    if (typeof window != 'undefined') {
      if (localStorage.getItem('allGoodLanguage') == 'uz') {
        registerLocale('uz', uz), setLocale('uz')
      } else {
        registerLocale('ru', ru), setLocale('ru')
      }
    }
  }, [])
  useEffect(() => {
    fetchData(page, rowsPerPage)
  }, [page, rowsPerPage])

  let years = []
  for (let i = 0; i < 20; i++) {
    years.push({ id: i, name: Number(new Date().getFullYear()) - i })
  }

  const handlePageChange = async (_event: any, value: any) => {
    setPage(value)
    fetchData(value, rowsPerPage)
  }

  const totalPages = Math.ceil((apiData?.pagination.total ?? 0) / Number(apiData?.pagination.perPage) ?? 10)
  const onExport = async () => {
    const column = [
      {
        header: t('The_bank_that_gave_limit'),
        key: 'The_bank_that_gave_limit',
        width: 50
      },
      {
        header: t('Merchants'),
        key: 'Merchants',
        width: 30
      },
      {
        header: t('TOTAL_INSTALLMENT_AMOUNT'),
        key: 'TOTAL_INSTALLMENT_AMOUNT',
        width: 30
      },
      {
        header: t('Cost_of_goods'),
        key: 'Cost_of_goods',
        width: 30
      },
      { header: t('Commission_of_bank'), key: 'Commission_of_bank', width: 30 },
      {
        header: t('ALLGOOD_Nasiya_revenue'),
        key: 'ALLGOOD_Nasiya_revenue',
        width: 30
      }
    ]
    let params: any = {}
    params.page = 1
    params.perPage = apiData?.pagination.total
    if (check) {
      params.from = startDate
      params['to'] = endDate
      params.year = null
      params.month = null
    } else {
      params.from = null
      params['to'] = null

      params.year = selectYear
      params.month = selectMonth == 0 ? null : selectMonth
    }
    const resAll = await DataService.get(endpoints.reportByExitensionBnpl, params)
    const data =
      resAll?.data?.result?.map((item: any) => ({
        [column[0].key as string]: `${item.bank}`,
        [column[1].key as string]: `${item.merchant ?? item.branch}`,
        [column[2].key as string]: `${item.total}`,
        [column[3].key as string]: `${item.total_price}`,
        [column[4].key as string]: `${item.bank_sum}`,
        [column[5].key as string]: `${item.allgood_sum}`
      })) || []
    downloadExcel(data || [], column || [], t('extension-to-bnpl') as string)
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
        {isLoading ? (
          <Loader />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('The_bank_that_gave_limit')}</TableCell>
                  <TableCell>{t('Merchants')}</TableCell>
                  <TableCell>{t('TOTAL_INSTALLMENT_AMOUNT')}</TableCell>
                  <TableCell>{t('Cost_of_goods')}</TableCell>
                  <TableCell>{t('Commission_of_bank')}</TableCell>
                  <TableCell>{t('ALLGOOD_Nasiya_revenue')}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {apiData?.result?.map((item: any, key: number) => (
                  <TableRow key={key}>
                    <TableCell>{item.bank}</TableCell>
                    <TableCell>{item.merchant ?? item.branch}</TableCell>

                    <TableCell>
                      <CurrencyFormatter amount={item.total} currency='sum' />
                    </TableCell>
                    <TableCell>
                      <CurrencyFormatter amount={item.total_price} currency='sum' />
                    </TableCell>

                    <TableCell>
                      <CurrencyFormatter amount={item.bank_sum} currency='sum' />
                    </TableCell>
                    <TableCell>
                      <CurrencyFormatter amount={item.allgood_sum} currency='sum' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Container sx={{ display: 'flex', justifyContent: 'end', marginY: 5 }}>
          <Pagination
            count={totalPages as number}
            page={Number(apiData?.pagination.page ?? 1)}
            onChange={handlePageChange}
            shape='rounded'
            color='primary'
            variant='outlined'
          />
        </Container>
      </DatePickerWrapper>
    </Grid>
  )
}

export default ReportByExitensionBnpl

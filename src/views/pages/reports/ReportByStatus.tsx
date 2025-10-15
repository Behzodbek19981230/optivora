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
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { MerchantType } from 'src/types/dictionaries/merchantType'
import { BranchesType } from 'src/types/dictionaries/branchesType'
import moment from 'moment'
import { Icon } from '@iconify/react'
import downloadExcel from 'src/views/components/export/Excel'
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

const ReportByStatus = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [merchant, setMerchant] = useState<MerchantType[]>()
  const [branch, setBranch] = useState<BranchesType[]>()
  const [selectMerchant, setSelectMerchant] = useState<number>(0)
  const [selectBranch, setSelectBranch] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<any>()

  const [page, setPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const fetchData = async (page?: number, perPage?: number) => {
    try {
      setIsLoading(true)
      let params: any = {}
      params.page = page ?? 1
      params.perPage = perPage ?? 10
      params.merchant = selectMerchant == 0 ? null : selectMerchant
      params.branch = selectBranch == 0 ? null : selectBranch
      params.from = startDate ? format(startDate, 'yyyy-MM-dd') : null
      params['to'] = endDate ? format(endDate, 'yyyy-MM-dd') : null

      const resAll = await DataService.get(endpoints.reportByStatus, params)
      setApiData(resAll.data)
      setIsLoading(false)

      const res = await DataService.get(endpoints.merchant)
      setMerchant(res.data?.result)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData(page, rowsPerPage)
  }, [page, rowsPerPage])
  const selectMerchantId = async (id: number) => {
    setSelectMerchant(id)
    try {
      const resBranch = await DataService.get(endpoints.branchesMerchant + `/${id}`)
      setBranch(resBranch?.data?.result)
    } catch (err: any) {}
  }

  const handlePageChange = async (_event: any, value: any) => {
    setPage(value)
    fetchData(value, rowsPerPage)
  }

  const totalPages = Math.ceil((apiData?.total ?? 0) / Number(apiData?.perPage) ?? 10)
  const onExport = async () => {
    const column = [
      {
        header: t('app_num'),
        key: 'app_num',
        width: 50
      },
      {
        header: t('operator_merchant'),
        key: 'operator_merchant',
        width: 30
      },
      {
        header: t('merchant'),
        key: 'merchant',
        width: 30
      },
      {
        header: t('OTP ALL GOOD NASIYA (смс код) Статусы'),
        key: 'OTP ALL GOOD NASIYA (смс код) Статусы',
        width: 30
      },
      { header: t('FACE ID (СТАТУС)'), key: 'FACE ID (СТАТУС)', width: 30 },
      {
        header: t('my_id данний'),
        key: 'my_id данний',
        width: 30
      },
      {
        header: t('СКОРИНГ (СТАТУС)'),
        key: 'СКОРИНГ (СТАТУС)',
        width: 30
      },
      {
        header: t('ВВОД ТОВАРА (СТАТУСЫ)'),
        key: 'ВВОД ТОВАРА (СТАТУСЫ)',
        width: 30
      },
      {
        header: t('Офформления'),
        key: 'Офформления',
        width: 30
      },
      {
        header: t('Новий клиент отп'),
        key: 'Новий клиент отп',
        width: 30
      },
      {
        header: t('ГРАФИК ПОГОШЕНИЯ (СТАТУС)'),
        key: 'ГРАФИК ПОГОШЕНИЯ (СТАТУС)',
        width: 30
      },
      {
        header: t('ВЫДАЧА РАССРОЧКУ (СТАТУС)'),
        key: 'ВЫДАЧА РАССРОЧКУ (СТАТУС)',
        width: 30
      }
    ]

    const data =
      apiData?.result?.map((item: any) => ({
        [column[0].key as string]: `${item.a_id}`,
        [column[1].key as string]: `${item.a_created_by}`,
        [column[2].key as string]: `${item.merchant_name}`,
        [column[3].key as string]: `${item.otp_status_allgood}`,
        [column[4].key as string]: `${item.face_id_status}`,
        [column[5].key as string]: `${item.my_id_status}`,
        [column[6].key as string]: `${item.scoring_status}`,
        [column[7].key as string]: `${item.product_add}`,
        [column[8].key as string]: `${item.approving_status}`,
        [column[9].key as string]: `${item.new_client_otp_status}`,
        [column[10].key as string]: `${item.scheduling_status}`,
        [column[11].key as string]: `${item.pay_status}`
      })) || []
    downloadExcel(data || [], column || [], t('borrower-statistics') as string)
  }
  return (
    <Grid>
      <DatePickerWrapper>
        <CardContent>
          <Box sx={{ width: '100%', display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <DatePicker
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

            <CustomTextField
              select
              fullWidth
              defaultValue={0}
              focused
              label={t('Merchant')}
              color='primary'
              onChange={e => selectMerchantId(Number(e.target.value))}
              SelectProps={{
                MenuProps
              }}
            >
              <MenuItem value={0}>
                <Translations text='All' />
              </MenuItem>
              {merchant?.map((item: MerchantType) => (
                <MenuItem id={item.id.toString()} value={item.id.toString()}>
                  {t(item.name)}
                </MenuItem>
              ))}
            </CustomTextField>
            <CustomTextField
              fullWidth
              label={t('Branch')}
              select
              defaultValue={0}
              focused
              color='primary'
              onChange={e => setSelectBranch(Number(e.target.value))}
              SelectProps={{
                MenuProps
              }}
            >
              <MenuItem value={0} disabled>
                <Translations text='Branchs' />
              </MenuItem>
              {branch?.map((item: BranchesType) => (
                <MenuItem id={item?.id?.toString()} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>

            <Box sx={{ display: 'flex', alignItems: 'end' }}>
              <Button variant='contained' onClick={() => fetchData()}>
                <Translations text='Find' />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <CustomTextField
                fullWidth
                label={t('All')}
                select
                defaultValue={10}
                focused
                color='primary'
                onChange={e => {
                  setRowsPerPage(Number(e.target.value))
                  setPage(1)
                }}
                SelectProps={{
                  MenuProps
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={apiData?.total}>{t('All')}</MenuItem>
              </CustomTextField>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
              <Button variant='outlined' startIcon={<Icon icon='tabler:screen-share' />} onClick={onExport}>
                <Translations text='Export' />
              </Button>
            </Box>
          </Box>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('app_num')}</TableCell>
                <TableCell>{t('operator_merchant')}</TableCell>
                <TableCell>{t('merchant')}</TableCell>
                <TableCell>{t('OTP ALL GOOD NASIYA (смс код) Статусы')}</TableCell>
                <TableCell>{t('FACE ID (СТАТУС)')}</TableCell>
                <TableCell>{t('my_id данний')}</TableCell>
                <TableCell>{t('СКОРИНГ (СТАТУС)')}</TableCell>
                <TableCell>{t('ВВОД ТОВАРА (СТАТУСЫ)')}</TableCell>
                <TableCell>{t('Офформления')}</TableCell>
                <TableCell>{t('Новий клиент отп')}</TableCell>
                <TableCell>{t('ГРАФИК ПОГОШЕНИЯ (СТАТУС)')}</TableCell>
                <TableCell>{t('ВЫДАЧА РАССРОЧКУ (СТАТУС)')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {apiData?.result?.map((item: any, key: number) => (
                <TableRow key={key}>
                  <TableCell>{item.a_id}</TableCell>
                  <TableCell>{item.a_created_by}</TableCell>
                  <TableCell>{item.merchant_name}</TableCell>
                  <TableCell>{item.otp_status_allgood}</TableCell>
                  <TableCell>{item.face_id_status}</TableCell>
                  <TableCell>{item.my_id_status}</TableCell>
                  <TableCell>{item.scoring_status}</TableCell>
                  <TableCell>{item.product_add}</TableCell>
                  <TableCell>{item.approving_status}</TableCell>
                  <TableCell>{item.new_client_otp_status}</TableCell>
                  <TableCell>{item.scheduling_status}</TableCell>
                  <TableCell>{item.pay_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Container sx={{ display: 'flex', justifyContent: 'end', marginY: 5 }}>
          <Pagination
            count={totalPages as number}
            page={Number(apiData?.page ?? 1)}
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

export default ReportByStatus

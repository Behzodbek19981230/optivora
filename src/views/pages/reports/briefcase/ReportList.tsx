// ** React Imports
import {
  Button,
  CardContent,
  Collapse,
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
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'
import { UsersType } from 'src/types/apps/userTypes'
import downloadExcel from 'src/views/components/export/Excel'

interface CellType {
  row: UsersType
}
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
    name: 'ANORBANK'
  },
  {
    id: 2,
    name: 'DAVRBANK'
  }
]
const ReportListBriefcase = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectMonth, setSelectMonth] = useState<number | null>()
  const [selectBank, setSelectBank] = useState<string | null>()
  const [selectYear, setSelectYear] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<any>()
  const [open, setOpen] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resAll = await DataService.get(endpoints.reportBriefcase, {
        year: selectYear,
        month: selectMonth == 0 ? null : selectMonth,
        bank: selectBank == 'All' ? null : selectBank
      })
      setApiData(resAll.data)
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
  }, [])

  let years = []
  for (let i = 0; i < 20; i++) {
    years.push({ id: i, name: Number(new Date().getFullYear()) - i })
  }
  const onExport = async () => {
    const column = [
      {
        header: t('financing'),
        key: 'financing',
        width: 50
      },
      {
        header: t('Installment_portfolio_quantity_per_month'),
        key: 'Installment_portfolio_quantity_per_month',
        width: 30
      },
      {
        header: t('Installment_portfolio_amount_month'),
        key: 'Installment_portfolio_amount_month',
        width: 30
      },
      {
        header: t('Forecast_manually'),
        key: 'Forecast_manually',
        width: 30
      }
    ]

    const data =
      apiData?.data?.map((item: any) => ({
        [column[0].key as string]: `${item.bank}`,
        [column[1].key as string]: `${item.count}`,
        [column[2].key as string]: `${item.total}`,
        [column[3].key as string]: `${apiData?.forecast}`
      })) || []
    downloadExcel(data || [], column || [], t('briefcase') as string)
  }
  return (
    <Grid>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <CustomTextField
            select
            defaultValue={0}
            focused
            color='primary'
            onChange={e => setSelectBank(e.target.value as string)}
            SelectProps={{
              MenuProps
            }}
          >
            <MenuItem value={'All'}>
              <Translations text='All' />
            </MenuItem>
            {banks.map((item: any) => (
              <MenuItem id={item.id} value={item.name}>
                {t(item.name)}
              </MenuItem>
            ))}
          </CustomTextField>
          <CustomTextField
            select
            defaultValue={0}
            focused
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
          <Button variant='contained' onClick={fetchData}>
            <Translations text='Find' />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 5 }}>
          <Button fullWidth variant='outlined' startIcon={<Icon icon='tabler:screen-share' />} onClick={onExport}>
            <Translations text='Export' />
          </Button>
        </Box>
      </CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('financing')}</TableCell>
              <TableCell>{t('Installment_portfolio_quantity_per_month')}</TableCell>
              <TableCell>{t('Installment_portfolio_amount_month')}</TableCell>
              <TableCell>{t('Forecast_manually')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiData?.data.map((item: any) => (
              <TableRow>
                <TableCell>{item.bank}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>
                  <CurrencyFormatter amount={item.total} currency='sum' />
                </TableCell>
                <TableCell>
                  <CurrencyFormatter amount={apiData?.forecast} currency='sum' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>{' '}
    </Grid>
  )
}

export default ReportListBriefcase

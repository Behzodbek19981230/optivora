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

const ReportList = ({ tab }: { tab: string }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectMonth, setSelectMonth] = useState<number | null>()
  const [selectYear, setSelectYear] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<ApiData>()
  const [open, setOpen] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resAll = await DataService.get(endpoints.reportBnpl, {
        year: selectYear,
        month: selectMonth == 0 ? null : selectMonth
      })
      setApiData(resAll.data?.result)
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
  const ItemsData = (res: any) => {
    const ItemsPrice = res?.map((item: any) => (
      <TableCell>
        <CurrencyFormatter amount={item.price} currency='sum' />
      </TableCell>
    ))
    const ItemAllgood = res?.map((item: any) => (
      <TableCell>
        <CurrencyFormatter amount={item.allgood_sum} currency='sum' />{' '}
      </TableCell>
    ))
    const ItemBank = res?.map((item: any) => (
      <TableCell>
        <CurrencyFormatter amount={item.bank_sum} currency='sum' />
      </TableCell>
    ))
    return (
      <TableBody>
        <TableRow>
          <TableCell>
            <Icon icon='tabler:arrow-narrow-right' />
          </TableCell>
          <TableCell>{t('Cost_of_goods')}</TableCell>
          {ItemsPrice}
        </TableRow>
        <TableRow>
          <TableCell>
            <Icon icon='tabler:arrow-narrow-right' />
          </TableCell>
          <TableCell>{t('Bank_commission')}</TableCell>
          {ItemBank}
        </TableRow>
        <TableRow>
          <TableCell>
            <Icon icon='tabler:arrow-narrow-right' />
          </TableCell>
          <TableCell>{t('ALLGOOD_Nasiya_revenue')}</TableCell>
          {ItemAllgood}
        </TableRow>
      </TableBody>
    )
  }

  const CollasPaceData = (res: ExpenseType[]) => {
    const ItemMarketing = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.marketing)} currency='sum' />
      </TableCell>
    ))
    const ItemServerExpenses = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.server_expenses)} currency='sum' />
      </TableCell>
    ))
    const ItemSystemImprovement = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.system_improvement)} currency='sum' />
      </TableCell>
    ))
    const ItemPhtTaxes = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.pht_taxes)} currency='sum' />
      </TableCell>
    ))
    const ItemBonusesManagers = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.bonuses_managers)} currency='sum' />
      </TableCell>
    ))
    const ItemOfficeRental = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.office_rental)} currency='sum' />
      </TableCell>
    ))
    const ItemTechSupport = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.tech_support)} currency='sum' />
      </TableCell>
    ))
    const ItemOtherAdminExpenses = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.other_admin_expenses)} currency='sum' />
      </TableCell>
    ))
    const ItemBonusesAgents = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.bonuses_agents)} currency='sum' />
      </TableCell>
    ))
    const ItemCompanyTaxes = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.company_taxes)} currency='sum' />
      </TableCell>
    ))
    const ItemForecast = res?.map((item: ExpenseType) => (
      <TableCell>
        <CurrencyFormatter amount={Number(item.forecast)} currency='sum' />
      </TableCell>
    ))
    return (
      <TableBody>
        <TableRow>
          <TableCell>{t('Marketing')}</TableCell>
          {ItemMarketing}
        </TableRow>
        <TableRow>
          <TableCell>{t('Server_expenses')}</TableCell>
          {ItemServerExpenses}
        </TableRow>
        <TableRow>
          <TableCell>{t('System_improvement')}</TableCell>
          {ItemSystemImprovement}
        </TableRow>
        <TableRow>
          <TableCell>{t('Pht_taxes')}</TableCell>
          {ItemPhtTaxes}
        </TableRow>
        <TableRow>
          <TableCell>{t('Bonuses_managers')}</TableCell>
          {ItemBonusesManagers}
        </TableRow>
        <TableRow>
          <TableCell>{t('Office_rental')}</TableCell>
          {ItemOfficeRental}
        </TableRow>
        <TableRow>
          <TableCell>{t('Tech_support')}</TableCell>
          {ItemTechSupport}
        </TableRow>
        <TableRow>
          <TableCell>{t('Other_admin_expenses')}</TableCell>
          {ItemOtherAdminExpenses}
        </TableRow>
        <TableRow>
          <TableCell>{t('Bonuses_agents')}</TableCell>
          {ItemBonusesAgents}
        </TableRow>
        <TableRow>
          <TableCell>{t('Company_taxes')}</TableCell>
          {ItemCompanyTaxes}
        </TableRow>
        <TableRow>
          <TableCell sx={{ maxWidth: 200, textWrap: 'wrap' }}>{t('Forecast_manually')}</TableCell>
          {ItemForecast}
        </TableRow>
      </TableBody>
    )
  }
  const onExport = async () => {
    const column1 = [
      {
        header: t('TOTAL_INSTALLMENT_AMOUNT'),
        key: 'title',
        width: 50
      }
    ]
    const column2 =
      apiData?.results.map((items: any) => {
        return {
          header: t(months.find(item => item.id == Number(items.month))?.name as string),
          key: months.find(item => item.id == Number(items.month))?.name,
          width: 30
        }
      }) || []
    const column = [...column1, ...column2]
    const col11: { [key: string]: string } = {}
    apiData?.results.forEach((items: any) => {
      const month = months.find(item => item.id === Number(items.month))
      if (month) {
        col11[month.name] = items.price
      }
    })
    const col12: { [key: string]: string } = {}
    apiData?.results.forEach((items: any) => {
      const month = months.find(item => item.id === Number(items.month))
      if (month) {
        col12[month.name] = items.bank_sum
      }
    })
    const col13: { [key: string]: string } = {}
    apiData?.results.forEach((items: any) => {
      const month = months.find(item => item.id === Number(items.month))
      if (month) {
        col13[month.name] = items.allgood_sum
      }
    })
    const col14: { [key: string]: string } = {}

    apiData?.resultsExpense.forEach((items: any) => {
      const month = months.find(item => item.id === Number(items.month))
      if (month) {
        col14[month.name] = (
          parseFloat(items.marketing) +
          parseFloat(items.server_expenses) +
          parseFloat(items.system_improvement) +
          parseFloat(items.pht_taxes) +
          parseFloat(items.bonuses_managers) +
          parseFloat(items.office_rental) +
          parseFloat(items.tech_support) +
          parseFloat(items.other_admin_expenses) +
          parseFloat(items.bonuses_agents) +
          parseFloat(items.company_taxes) +
          Number(items.forecast)
        ).toString()
      }
    })

    const customData = [
      {
        title: t('Cost_of_goods'),
        ...col11
      },
      {
        title: t('Bank_commission'),
        ...col12
      },
      {
        title: t('ALLGOOD_Nasiya_revenue'),
        ...col13
      },
      {
        title: t('Expenses_ALLGOOD_Nasiya'),
        ...col14
      }
    ]

    downloadExcel(customData || [], column || [], t('bnpl') as string)
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
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ maxWidth: 400, minWidth: 400 }}>{apiData?.year}</TableCell>
              {apiData?.results.map((items: any) => (
                <TableCell sx={{ maxWidth: 200, minWidth: 200 }} key={items.month}>
                  {t(months.find(item => item.id == Number(items.month))?.name as string)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow sx={{ background: theme.palette.primary.main, color: 'white' }}>
              <TableCell />
              <TableCell sx={{ maxWidth: 400, minWidth: 400, color: 'white' }}>
                {t('TOTAL_INSTALLMENT_AMOUNT')}
              </TableCell>
              {apiData?.results.map((items: ResultsType, key) => (
                <TableCell sx={{ maxWidth: 200, minWidth: 200, color: 'white' }}>
                  <CurrencyFormatter
                    amount={
                      // summExpenses[key] +
                      parseFloat(items.allgood_sum) + parseFloat(items.bank_sum) + parseFloat(items.price)
                    }
                    currency='sum'
                    color='white'
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {ItemsData(apiData?.results)}
          <TableRow sx={{ background: theme.palette.primary.main, color: 'white' }}>
            <TableCell>
              <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
                <Icon icon={open ? 'tabler:chevron-up' : 'tabler:chevron-down'} />
              </IconButton>{' '}
            </TableCell>
            <TableCell>{t('Expenses_ALLGOOD_Nasiya')}</TableCell>
            {apiData?.resultsExpense.map((items: ExpenseType) => (
              <TableCell>
                <CurrencyFormatter
                  amount={
                    parseFloat(items.marketing) +
                    parseFloat(items.server_expenses) +
                    parseFloat(items.system_improvement) +
                    parseFloat(items.pht_taxes) +
                    parseFloat(items.bonuses_managers) +
                    parseFloat(items.office_rental) +
                    parseFloat(items.tech_support) +
                    parseFloat(items.other_admin_expenses) +
                    parseFloat(items.bonuses_agents) +
                    parseFloat(items.company_taxes) +
                    Number(items.forecast)
                  }
                  currency='sum'
                  color='white'
                />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell colSpan={18}>
              <Collapse in={open} timeout='auto'>
                <TableContainer component={Paper}>
                  <Table aria-label='collapsible table'>
                    {' '}
                    {CollasPaceData(apiData?.resultsExpense as ExpenseType[])}
                  </Table>
                </TableContainer>
              </Collapse>
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>{' '}
    </Grid>
  )
}

export default ReportList

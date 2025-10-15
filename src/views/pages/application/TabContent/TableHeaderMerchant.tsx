import Box from '@mui/material/Box'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
import { Autocomplete, createFilterOptions, Grid, MenuItem, TextField, useTheme } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import moment from 'moment'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { MerchantType } from 'src/types/dictionaries/merchantType'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useEffect, useRef, useState } from 'react'
import { BranchesType } from 'src/types/dictionaries/branchesType'
import { useAuth } from 'src/hooks/useAuth'

interface TableHeaderProps {
  toggle?: () => void
  handleFilter: (
    val: string,
    fromDate?: string,
    toDate?: string,
    merchant?: number | null,
    branch?: number | null
  ) => void
  handleClick?: () => void
  onExport?: () => void
  exportLoading?: boolean
  data?: any[]
  fromDate?: string
  toDate?: string
  onChangeFrom?: (val: any) => void
  onChangeTo?: (val: any) => void
  changeBranch?: (val: string) => void
  merchants?: MerchantType[]
}

const TableHeaderMerchant = (props: TableHeaderProps) => {
  // ** Props
  const theme = useTheme()
  const user = useAuth()

  const [value, setValue] = useState<string>('')
  const { handleFilter, handleClick, onExport, changeBranch, data, fromDate, onChangeFrom, onChangeTo, toDate } = props
  const [merchants, setMerchants] = useState<MerchantType[]>()
  const [branchs, setBranchs] = useState<BranchesType[]>()
  const { t } = useTranslation()
  const [merchant, setMerchant] = useState<number | null>(user.user?.merchant?.id || null)
  const [branch, setBranch] = useState<number | null>((user.user?.branch?.id as number) || null)
  const fetchData = async () => {
    const merchantsRes = await DataService.get(endpoints.merchant)
    setMerchants(merchantsRes.data?.result)
  }
  const onSelectMerchant = async (id: number = 0) => {
    const resBranch = await DataService.get(endpoints.branchesMerchant + `/${id}`)
    setBranchs(resBranch?.data?.result)
    setMerchant(id)
  }
  useEffect(() => {
    fetchData()
    if (user.user?.merchant?.id) {
      onSelectMerchant(user.user?.merchant?.id)
    }
  }, [])

  return (
    <DatePickerWrapper>
      <Grid container spacing={2} sx={{ py: 4, px: 6 }}>
        <Grid item xs={2}>
          <DatePicker
            selected={moment(fromDate).toDate()}
            showYearDropdown
            dateFormat='dd-MM-yyyy'
            showMonthDropdown
            // @ts-ignore
            onChange={(e: any) => onChangeFrom(e)}
            customInput={
              <CustomTextField label={t('From_date') as string} fullWidth aria-describedby='validation-basic-dob' />
            }
          />
        </Grid>
        <Grid item xs={2}>
          <DatePicker
            selected={moment(toDate).toDate()}
            showYearDropdown
            dateFormat='dd-MM-yyyy'
            // @ts-ignore
            onChange={(e: any) => onChangeTo(e)}
            showMonthDropdown
            customInput={
              <CustomTextField label={t('To_date') as string} fullWidth aria-describedby='validation-basic-dob' />
            }
          />
        </Grid>

        {user.user?.merchant && (
          <Grid item xs={3}>
            <Autocomplete
              disablePortal
              id='branches'
              key={branchs?.length}
              options={
                branchs?.map(item => {
                  return {
                    value: item.id,
                    label: `${item.id}. ${item.name}`.toString()
                  }
                }) || []
              }
              onChange={(e, val) => {
                setBranch(val?.value as number)
              }}
              renderInput={params => <CustomTextField key={params.id} {...params} label={t('Branches') as string} />}
            />
          </Grid>
        )}
        <Grid item xs={2}>
          <CustomTextField
            value={value}
            fullWidth
            sx={{ mr: 4 }}
            id='search'
            onChange={e => setValue(e.target.value)}
            label={t('Search') as string}
            placeholder={t('Search') ?? ''}
          />
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'end' }}>
          <LoadingButton
            style={{ background: theme.palette.primary.contrastText }}
            variant='outlined'
            onClick={() => {
              handleFilter(value, fromDate, toDate, merchant, branch)
            }}
          >
            <Translations text='Search' />
          </LoadingButton>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'end', textAlign: 'end' }}>
          <LoadingButton
            style={{ background: theme.palette.primary.contrastText }}
            variant='outlined'
            startIcon={<Icon icon='tabler:screen-share' />}
            onClick={onExport}
            loading={props.exportLoading}
          >
            <Translations text='Export' />
          </LoadingButton>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default TableHeaderMerchant

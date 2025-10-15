import Box from '@mui/material/Box'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import { Grid, MenuItem, SelectChangeEvent, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import moment from 'moment'
import { useAuth } from 'src/hooks/useAuth'
interface TableHeaderProps {
  value: string
  toggle?: () => void
  handleFilter: (val: string) => void
  handleClick?: () => void
  onExport?: () => void
  data?: any[]
  fromDate?: string
  toDate?: string
  onChangeFrom?: (val: any) => void
  onChangeTo?: (val: any) => void
  changeBranch?: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const [branch, setBranch] = useState('')
  const auth = useAuth()
  const theme = useTheme()
  const { handleFilter, value, changeBranch, data, onChangeFrom, onChangeTo, fromDate, toDate } = props
  const { t } = useTranslation()
  const handleBranchChange = (e: SelectChangeEvent<unknown>) => {
    setBranch(e.target.value as string)
    // @ts-ignore
    changeBranch(e.target.value as string)
  }
  return (
    <DatePickerWrapper>
      <Box
        sx={{
          py: 4,
          px: 6,
          rowGap: 2,
          columnGap: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <DatePicker
              selected={moment(fromDate).toDate()}
              showYearDropdown
              dateFormat='dd-MM-yyyy'
              showMonthDropdown
              // @ts-ignore
              onChange={(e: any) => onChangeFrom(e)}
              customInput={<CustomTextField fullWidth aria-describedby='validation-basic-dob' />}
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
              customInput={<CustomTextField fullWidth aria-describedby='validation-basic-dob' />}
            />
          </Grid>

          <Grid item xs={4}>
            {!auth?.user?.branch && (
              <CustomTextField
                select
                fullWidth
                defaultValue='Select Plan'
                SelectProps={{
                  value: branch,
                  displayEmpty: true,
                  onChange: e => handleBranchChange(e)
                }}
              >
                {data?.map((value: any) => (
                  <MenuItem value={value?.id} key={value?.id}>
                    {value.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          </Grid>

          <Grid item xs={4}>
            <CustomTextField
              value={value}
              fullWidth
              sx={{ mr: 4 }}
              placeholder={t('Search') ?? ''}
              onChange={e => handleFilter(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={1}>
            <Button
              style={{ background: theme.palette.primary.contrastText }}
              variant='outlined'
              startIcon={<Icon icon='tabler:screen-share' />}
              onClick={onExport}
            >
              <Translations text='Export' />
            </Button>
          </Grid> */}
        </Grid>
      </Box>
    </DatePickerWrapper>
  )
}

export default TableHeader

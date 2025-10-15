import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'
import { RatesType } from 'src/types/dictionaries/ratesType'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DeleteModal from 'src/views/components/modals/DeleteModal'
import FormModal from 'src/views/components/modals/FormModal'
import DatePicker from 'react-datepicker'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import moment from 'moment'
import FallbackSpinner from 'src/@core/components/spinner'
import Loader from 'src/@core/components/spinner/Loader'

type ProsentRates = {
  name: string
  id: number
  tariffRate: RatesType
  rate_id: number | string
  modelId: number
  modelName: string
  start_date: Date | string
  end_date: Date | string
  note: string
  value: number
  is_active: boolean
}
export default function Interest() {
  const [rates, setRates] = useState<[]>()
  const [currentRate, setCurrentRate] = useState<any>()
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [apiData, setApiData] = useState<[]>()
  const [stateEdit, setStateEdit] = useState<ProsentRates | any>()
  const [state, setState] = useState<ProsentRates | any>({ end_date: new Date(), start_date: new Date() })
  const [currentData, setCurrentData] = useState<any>()

  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [stateError, setStateError] = useState({ markup: '', note: '' })
  const handleDelete = async () => {
    try {
      await DataService.delete(endpoints.periodRate + `/${currentData?.id}`)
      toast.success(<Translations text='Success!' />)
      handleClose()
      getData()
    } catch (err: any) {
      toast.error(err)
    }
  }
  const handleClose = () => {
    setOpenDelete(false)
    setOpenEdit(false)
    setOpen(false)
    setCurrentRate(undefined)
    setStateEdit(undefined)
    setCurrentRate(undefined)
    setStateError({ markup: '', note: '' })
  }

  const handleCreate = async (e: any) => {
    e.preventDefault()
    try {
      await DataService.post(endpoints.periodRate, {
        ...state,
        modelId: router.query?.id,
        modelName: 'branch',
        is_active: true
      })
      toast.success(<Translations text='Success!' />)
      handleClose()
      getData()
    } catch (err: any) {
      toast.error(err)
    }
  }
  const handleEdit = async (e: any) => {
    e.preventDefault()
    try {
      await DataService.patch(endpoints.periodRate + `/${currentData?.id}`, stateEdit)
      toast.success(<Translations text='Success!' />)
      handleClose()
      getData()
    } catch (err: any) {
      toast.error(err)
    }
  }

  const getData = async () => {
    try {
      const reponseRates = await DataService.get(endpoints.rate)
      setRates(reponseRates.data?.result)
      const reponse = await DataService.get(endpoints.periodRate, { modelId: router.query?.id, modelName: 'branch' })
      setApiData(reponse.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  const handleCheckMarkup = (e: any) => {
    if (
      (currentRate?.minValue as number) <= (e.target.value as number) &&
      (currentRate?.maxValue as number) >= (e.target.value as number)
    ) {
      setState({ ...state, value: e.target.value })

      setStateError({ ...stateError, markup: '' })
    } else {
      setStateError({ ...stateError, markup: 'Invalid Markup' })
    }
  }
  const handleCheckMarkupEdit = (e: any) => {
    if (
      (currentRate?.minValue as number) <= (e.target.value as number) &&
      (currentRate?.maxValue as number) >= (e.target.value as number)
    ) {
      setStateEdit({ ...stateEdit, value: e.target.value })

      setStateError({ ...stateError, markup: '' })
    } else {
      setStateError({ ...stateError, markup: 'Invalid Markup' })
    }
  }
  return (
    <div>
      <DeleteModal
        title={currentData?.tariffRate?.name}
        handleClose={handleClose}
        handleDelete={handleDelete}
        open={openDelete}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='outlined'
            startIcon={<Icon fontSize='1.25rem' icon={'tabler:plus'} />}
            onClick={() => setOpen(true)}
          >
            <Translations text='add_rates' />
          </Button>
        </Box>
      </CardContent>
      {apiData ? (
        <TableContainer>
          {apiData?.length > 0 ? (
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Translations text='name' />
                  </TableCell>
                  <TableCell>
                    <Translations text='CategoryType' />
                  </TableCell>
                  <TableCell align='right'>
                    <Translations text='markup' />
                  </TableCell>

                  <TableCell align='right'>
                    <Translations text='min_markup' />
                  </TableCell>
                  <TableCell align='right'>
                    <Translations text='max_markup' />
                  </TableCell>
                  <TableCell align='center'>
                    <Translations text='period' />
                  </TableCell>
                  <TableCell align='center'>
                    <Translations text='Status' />
                  </TableCell>
                  <TableCell align='right'>
                    <Translations text='Actions' />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiData?.map((row: ProsentRates) => (
                  <TableRow
                    key={row?.id}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {row?.tariffRate?.name}
                    </TableCell>
                    <TableCell align='right'>{row?.tariffRate?.categoryType}</TableCell>

                    <TableCell align='right'>{row?.value}%</TableCell>
                    <TableCell align='right'>{row?.tariffRate?.minValue}%</TableCell>
                    <TableCell align='right'>{row?.tariffRate?.maxValue}%</TableCell>
                    <TableCell align='center'>
                      {moment(row?.start_date).format('DD.MM.yyyy') as string}-
                      {moment(row?.end_date).format('DD.MM.yyyy') as string}
                    </TableCell>
                    <TableCell align='center'>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
                        <Icon
                          fontSize={26}
                          icon={row.is_active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
                          color={row.is_active ? theme.palette.primary.main : theme.palette.grey[400]}
                        />
                        <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                          {row.is_active ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align='center'>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => {
                            setOpenDelete(true), setCurrentData(row)
                          }}
                        >
                          <Icon icon='tabler:trash' fontSize={18} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setOpenEdit(true)
                            setCurrentRate(currentData?.tariffRate)
                            setCurrentData(row)
                          }}
                        >
                          <Icon icon='tabler:edit' fontSize={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Typography variant='body2'>no data </Typography>
            </CardContent>
          )}
        </TableContainer>
      ) : (
        <Loader />
      )}
      <Dialog
        fullWidth={true}
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <form onSubmit={handleCreate}>
          <DialogTitle id='alert-dialog-title'>
            <Translations text={`${title}`} />
          </DialogTitle>
          <DialogContent>
            <DatePickerWrapper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomTextField
                      select
                      required
                      fullWidth
                      label={t('Rates') as string}
                      id='validation-basic-select'
                      aria-describedby='validation-basic-select'
                      placeholder={t('Rates') as string}
                      onChange={e => {
                        //@ts-ignore - necessary to load object into value

                        setState({ ...state, rate_id: e.target.value?.id }), setCurrentRate(e.target.value)
                      }}
                    >
                      {rates?.map((rate: any) => (
                        <MenuItem key={rate.id} value={rate}>
                          {rate?.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      selected={state?.start_date}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => setState({ ...state, start_date: e })}
                      placeholderText='dd-MM-yyyy'
                      dateFormat='dd-MM-yyyy'
                      customInput={
                        <CustomTextField
                          fullWidth
                          label={t('period_start') as string}
                          aria-describedby='validation-basic-dob'
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      selected={state.end_date}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => setState({ ...state, end_date: e })}
                      placeholderText='dd-MM-yyyy'
                      dateFormat='dd-MM-yyyy'
                      customInput={
                        <CustomTextField
                          fullWidth
                          label={t('period_end') as string}
                          aria-describedby='validation-basic-dob'
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      disabled
                      value={currentRate?.categoryType}
                      label={t('CategoryType') as string}
                      aria-describedby='validation-basic-first-name'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      disabled
                      value={currentRate?.minValue ? currentRate?.minValue + ' %' : ''}
                      label={t('min_markup') as string}
                      aria-describedby='validation-basic-first-name'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      disabled
                      value={currentRate?.maxValue ? currentRate?.maxValue + ' %' : ''}
                      label={t('max_markup') as string}
                      aria-describedby='validation-basic-first-name'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      required
                      fullWidth
                      type='number'
                      onChange={handleCheckMarkup}
                      label={t('markup') as string}
                      placeholder={t('markup') as string}
                      error={Boolean(stateError?.markup)}
                      aria-describedby='validation-basic-first-name'
                      {...(stateError?.markup && { helperText: 'Invalid markup' })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      required
                      fullWidth
                      label={t('note') as string}
                      placeholder={t('note') as string}
                      onChange={e => setState({ ...state, note: e.target.value })}
                      error={Boolean(stateError?.note)}
                      aria-describedby='validation-basic-first-name'
                      {...(stateError?.note && { helperText: 'This field is required' })}
                      multiline
                      rows={6}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DatePickerWrapper>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>
              <Translations text='Cancel' />
            </Button>
            <Button type='submit'>
              <Translations text='Save' />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        fullWidth={true}
        open={openEdit}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <form onSubmit={handleEdit}>
          <DialogTitle id='alert-dialog-title'>
            <Translations text={`${title}`} />
          </DialogTitle>
          <DialogContent>
            <DatePickerWrapper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {stateEdit?.rate_id ? (
                      <CustomTextField
                        select
                        fullWidth
                        required
                        defaultValue={currentRate}
                        label={t('Rates') as string}
                        aria-describedby='validation-basic-select'
                        placeholder={t('Rates') as string}
                        onChange={e => {
                          //@ts-ignore - necessary to load object into value
                          setStateEdit({ ...stateEdit, rate_id: e.target.value }), setCurrentRate(e.target.value)
                        }}
                      >
                        {rates?.map((rate: any) => (
                          <MenuItem key={rate.id} value={rate}>
                            {rate?.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    ) : (
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue={currentData?.tariffRate?.id}
                        label={t('Rates') as string}
                        id='validation-basic-select'
                        aria-describedby='validation-basic-select'
                        placeholder={t('Rates') as string}
                        onChange={e => {
                          //@ts-ignore - necessary to load object into value

                          setStateEdit({ ...stateEdit, rate_id: e.target.value }), setCurrentRate(e.target.value)
                        }}
                      >
                        {rates?.map((rate: any) => (
                          <MenuItem key={rate.id} value={rate.id}>
                            {rate?.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <DatePicker
                      selected={
                        stateEdit?.start_date ? stateEdit?.start_date : moment(currentData?.start_date).toDate()
                      }
                      showYearDropdown
                      dateFormat='dd-MM-yyyy'
                      showMonthDropdown
                      onChange={e => setStateEdit({ ...stateEdit, start_date: e })}
                      customInput={
                        <CustomTextField
                          fullWidth
                          label={t('period_start') as string}
                          aria-describedby='validation-basic-dob'
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      selected={stateEdit?.end_date ? stateEdit?.end_date : moment(currentData?.end_date).toDate()}
                      showYearDropdown
                      dateFormat='dd-MM-yyyy'
                      showMonthDropdown
                      onChange={e => setStateEdit({ ...stateEdit, end_date: e })}
                      customInput={
                        <CustomTextField
                          fullWidth
                          label={t('period_end') as string}
                          aria-describedby='validation-basic-dob'
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      disabled
                      value={
                        currentRate?.minValue ? currentRate?.minValue + ' %' : currentData?.tariffRate?.minValue + ' %'
                      }
                      label={t('min_markup') as string}
                      aria-describedby='validation-basic-first-name'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      disabled
                      value={
                        currentRate?.maxValue ? currentRate?.maxValue + ' %' : currentData?.tariffRate?.maxValue + ' %'
                      }
                      label={t('max_markup') as string}
                      aria-describedby='validation-basic-first-name'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      required
                      defaultValue={currentData?.value}
                      type='number'
                      onChange={handleCheckMarkupEdit}
                      label={t('markup') as string}
                      placeholder={t('markup') as string}
                      error={Boolean(stateError?.markup)}
                      aria-describedby='validation-basic-first-name'
                      {...(stateError?.markup && { helperText: 'Invalid markup' })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      required
                      defaultValue={currentData?.note}
                      onChange={e => setStateEdit({ ...stateEdit, note: e.target.value })}
                      label={t('note') as string}
                      placeholder={t('note') as string}
                      error={Boolean(stateError?.note)}
                      aria-describedby='validation-basic-first-name'
                      {...(stateError?.note && { helperText: 'This field is required' })}
                      multiline
                      rows={6}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      onChange={(e: any) => setStateEdit({ ...stateEdit, is_active: e.target?.checked })}
                      control={<Switch defaultChecked={currentData?.is_active} />}
                      label={
                        (stateEdit?.is_active ? stateEdit?.is_active : currentData?.is_active) ? (
                          <Translations text='Activate' />
                        ) : (
                          <Translations text='Deactivate' />
                        )
                      }
                    />{' '}
                  </Grid>
                </Grid>
              </Box>
            </DatePickerWrapper>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>
              <Translations text='Cancel' />
            </Button>
            <Button type='submit'>
              <Translations text='Save' />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

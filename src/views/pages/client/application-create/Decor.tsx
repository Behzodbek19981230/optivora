import {
  Grid,
  styled,
  Box,
  Button,
  CardContent,
  Typography,
  useTheme,
  MenuItem,
  Dialog,
  DialogContent,
  Paper
} from '@mui/material'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Icon } from '@iconify/react'
import { ApplicationUserType, ProductType } from 'src/context/types'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { PeriodType } from 'src/types/dictionaries/periodType'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import { StatusesEnum } from 'src/configs/const'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))
type ChangeStep = (text: string) => void

export default function Decor({ changeStep, apiData }: { changeStep: ChangeStep; apiData?: ApplicationUserType }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const auth = useAuth()
  const [limitData, setLimitData] = useState([])

  const [periods, setPeriods] = useState([])
  const [state, setState] = useState({ periodId: '', period: apiData?.period ?? 0 })
  const [product, setProduct] = useState({ name: '', summ: '', count: 1 })
  const [productsList, setproductsList] = useState([])
  const [totalSum, setTotalSum] = useState(0)
  const [open, setOpen] = useState(false)
  const [periodRates, setPeriodRates] = useState<any[]>()
  const [error, setError] = useState({ totalSum: '', period: '' })
  const [errorAmount, setErrorAmount] = useState('')
  const toggleProduct = () => {
    setOpen(!open)
  }
  const handleStep = async () => {
    if (!apiData?.contract_price) changeStep(StatusesEnum.verifying)
    else {
      if (totalSum && state.period) {
        const data = {
          // contract_price: totalSum,
          period: state.period
        }
        try {
          await DataService.post(endpoints.applicationApprovedByID(apiData?.id), data)
          changeStep(StatusesEnum.verifying)
        } catch (err: any) {
          toast.error(err?.data?.message)
        }
      } else {
        if (!totalSum) {
          setError({ ...error, totalSum: 'You_must_add_product' })
        }
        if (!state.period) {
          setError({ ...error, period: 'No_period_selected' })
        }
      }
    }
  }
  const handleStepBack = () => {
    changeStep(StatusesEnum.scoring)
  }
  const fetchData = async () => {
    try {
      setState({ ...state, period: state.period ?? apiData?.period })

      const resProd = await DataService.get(endpoints.productGetByID(apiData?.id))
      setproductsList(resProd?.data?.result)
      setTotalSum(
        resProd?.data?.result?.reduce((s: number, item: ProductType) => {
          return s + (item.amount ?? 0) * item.count
        }, 0)
      )
      const data = await DataService.get(endpoints.limitData, {
        modelId: apiData?.merchant?.id ?? apiData?.branch?.id,
        modelName: apiData?.merchant ? 'merchant' : 'branch',
        summ: resProd?.data?.result?.reduce((s: number, item: ProductType) => {
          return s + (item.amount ?? 0) * item.count
        }, 0),
        categoryType: apiData?.categoryType
      })

      setLimitData(data.data?.result)
      const resPeriodRates = await DataService.get(endpoints.periodRate, {
        modelId: apiData?.merchant?.id,
        modelName: 'merchant',
        categoryType: apiData?.categoryType
      })
      const sortedData = resPeriodRates?.data?.result?.sort((a: any, b: any) => {
        const periodA = a.tariffRate.tariffPeriod.period
        const periodB = b.tariffRate.tariffPeriod.period

        return periodA - periodB
      })
      setPeriods(sortedData)

      setPeriodRates(resPeriodRates?.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  const onSelectRates = (value: number) => {
    return periodRates?.find(val => val?.tariffRate?.tariffPeriod?.period == value)?.value
  }
  useEffect(() => {
    fetchData()
  }, [])
  const onSave = async (e: any) => {
    e.preventDefault()
    const data = {
      name: e.target.name.value,
      amount: e.target.summ.value * 100,
      application: apiData?.id,
      count: e.target.count.value
    }
    try {
      await DataService.post(endpoints.productPost, data)
      toast.success(t('successfull_created'))
      fetchData()
      setError({ ...error, totalSum: '' })
      toggleProduct()
    } catch (err) {
      toast.error(JSON.stringify(err) ?? 'Error!')
    }
  }
  const onDeleteProd = async (id: number) => {
    try {
      await DataService.delete(endpoints.productDelete(id))
      toast.success(t('deleted_successfully'))
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }
  const onChangeSumm = (e: any) => {
    if (apiData?.limit_amount) {
      if (apiData?.limit_amount - totalSum - e.target.value * product.count * 100 > 0) {
        setErrorAmount('')
        setProduct({ ...product, summ: e.target.value as string })
      } else setErrorAmount('You_have_exceeded_the_limit')
    }
  }
  return (
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
      }}
    >
      <Dialog
        maxWidth='sm'
        fullWidth={true}
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setOpen(false)
          }
        }}
      >
        <DialogContent>
          <form onSubmit={onSave}>
            <Box sx={{ padding: 5, display: 'flex', flexDirection: 'column', width: '100%', textAlign: 'center' }}>
              <Typography sx={{ fontSize: 26, fontWeight: 500 }}>
                <Translations text='Add a new product to the list' />
              </Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: theme.palette.grey[400] }}>
                <Translations text='info_add_product' />
              </Typography>
              <CustomTextField
                fullWidth
                required
                name='name'
                onChange={e => setProduct({ ...product, name: e.target.value })}
                label={t('Name_of_product') as string}
                placeholder={t('Name_of_product') as string}
                aria-describedby='validation-basic-first-name'
              />
              <Box sx={{ display: 'flex', gap: 5, my: 5 }}>
                <CustomTextField
                  fullWidth
                  type='number'
                  required
                  name='count'
                  onChange={e => setProduct({ ...product, count: Number(e.target.value) })}
                  label={t('Quantity') as string}
                  placeholder={t('Quantity') as string}
                  aria-describedby='validation-basic-first-name'
                />
                <CustomTextField
                  fullWidth
                  type='number'
                  required
                  name='summ'
                  onChange={e => onChangeSumm(e)}
                  label={t('Installment_amount_months') as string}
                  placeholder={t('Installment_amount_months') as string}
                  aria-describedby='validation-basic-first-name'
                  error={Boolean(errorAmount)}
                  {...(errorAmount && { helperText: 'Invalid amount' })}
                />
              </Box>

              <Typography sx={{ fontSize: 15, fontWeight: 400 }}>
                <Translations text='Remaining limit' />
              </Typography>
              <Grid container spacing={5}>
                {periods?.map((period: any) => (
                  <Grid item xs={12} sm={4} key={period?.tariffRate?.tariffPeriod?.id}>
                    <Typography>{period?.tariffRate?.tariffPeriod?.name}</Typography>
                    {apiData?.limit_amount && (
                      <Typography>
                        <CurrencyFormatter
                          amount={
                            apiData?.limit_amount / (1 + onSelectRates(period?.tariffRate?.tariffPeriod?.period) / 100)
                          }
                          currency='sum'
                        />
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
              <Typography sx={{ fontWeight: 500 }}>
                {apiData?.limit_amount && (
                  <CurrencyFormatter amount={(apiData?.limit_amount - totalSum) as number} currency='sum' size={28} />
                )}
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                <Button type='submit' variant='contained' disabled={Boolean(errorAmount)}>
                  <Translations text='add' />
                </Button>
                <Button onClick={toggleProduct} variant='contained' color='inherit'>
                  <Translations text='Cancel' />
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
        {/* <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>
            <Translations text='Cancel' />
          </Button>
          <Button onClick={onSave}>
            <Translations text='Save' />
          </Button>
        </DialogActions> */}
      </Dialog>
      <CleaveWrapper sx={{ gap: 5, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor='phone-number'>
              <Translations text='Contract number' />
            </InputLabel>
            <Typography sx={{ color: 'text.secondary', textAlign: 'start' }}>№ {apiData?.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor='date'>
              <Translations text='agreement_date' />
            </InputLabel>
            <Typography sx={{ color: 'text.secondary', textAlign: 'start' }}>
              {moment(apiData?.contract_date).format('DD-MM-YYYY')}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
                marginBottom: 5,
                color: 'text.disabled',
                textTransform: 'uppercase'
              }}
            >
              <Translations text='BUYER INFORMATION' />
            </Typography>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='Full Name' /> :
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>
                {apiData?.user?.surname + ' ' + apiData?.user?.name + ' ' + apiData?.user?.fathers_name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='Address' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>
                {auth.user && (auth.user.role === 'superuser' || auth.user.role === 'manager')
                  ? apiData?.address
                  : '******'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='Passport_details' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>
                {auth.user && (auth.user.role === 'superuser' || auth.user.role === 'manager')
                  ? apiData?.user?.p_seria_number
                  : '******'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='Place_of_work_TIN' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>{apiData?.inn}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='phone' />:{' '}
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>+{apiData?.owner_phone} </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='phone' />:{' '}
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>+{apiData?.close_phone} </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
                marginBottom: 5,
                color: 'text.disabled',
                textTransform: 'uppercase'
              }}
            >
              <Translations text='SELLER_INFORMATION' />
            </Typography>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='name_group' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>{apiData?.merchant?.group}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='Name_of_shop' />:
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>
                {' '}
                {apiData?.branch?.name ?? apiData?.merchant?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='Address' />:{' '}
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>{apiData?.merchant?.address}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='phone' />:{' '}
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>
                +{apiData?.merchant?.owner_phone}{' '}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'space-between' }}>
              <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                <Translations text='CategoryType' />:{' '}
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'end' }}>{apiData?.categoryType} </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={12} sm={12} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: 'text.disabled', textTransform: 'uppercase' }}>
              <Translations text='TERMS_AND_CONDITIONS_THE_INSTALLMENT_AGREEMENT' />
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                  <Translations text='Maturity_' />:
                </Typography>
              </Grid>
              <Grid container spacing={4}>
                {limitData?.map((item: { period: number; value: number }, index) => (
                  <Grid item key={index} xs={12} sm={6} md={3}>
                    <Paper
                      onClick={() => {
                        setState({ ...state, period: Number(item.period) })
                      }}
                      elevation={state.period === item.period ? 3 : 0}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 5,
                        cursor: 'pointer',
                        border: state.period === item.period ? '2px solid #FFA726' : '1px solid #E0E0E0',
                        backgroundColor: state.period == item.period ? '#FFF5E5' : '#FFFFFF'
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Icon icon='tabler:calendar-event' color={theme.palette.primary.main} fontSize={20} />
                          <Typography>
                            {item.period} <Translations text='month' />
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          <CurrencyFormatter
                            amount={(totalSum * (onSelectRates(item?.period) + 100)) / 100 / item.period}
                            size={16}
                            currency='sum'
                          />
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                  <Translations text='Monthly_fee' />:{' '}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {onSelectRates(state?.period) ? (
                  <CurrencyFormatter
                    amount={(totalSum * (onSelectRates(state?.period) + 100)) / 100 / state?.period}
                    currency='sum'
                  />
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                  <Translations text='total_amount' />:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CurrencyFormatter
                  amount={apiData?.categoryType == 'A' ? totalSum * (1 + onSelectRates(state.period) / 100) : totalSum}
                  currency='sum'
                />
              </Grid>
            </Grid>
            {/* <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
                  <Translations text='Total_repayment_amount' />:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {onSelectRates(state?.period) ? (
                  <Typography sx={{ color: 'text.secondary' }}>
                    <CurrencyFormatter
                      amount={(totalSum * (onSelectRates(state?.period) + 100)) / 100}
                      currency='sum'
                    />
                  </Typography>
                ) : (
                  ''
                )}
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>

        <Grid container spacing={12}>
          <Grid item xs={12} sm={12} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: 'text.disabled', textTransform: 'capitalize' }}>
              <Translations text='INFORMATION_ABOUT_PRODUCT' />
            </Typography>
            <Box>
              <Button variant='outlined' sx={{ '& svg': { mr: 2 } }} onClick={toggleProduct}>
                <Icon fontSize='1.125rem' icon='tabler:box' />
                <Translations text='Add_product' />
              </Button>
            </Box>
            <Typography sx={{ color: 'red' }}>
              <Translations text={error.totalSum} />
            </Typography>
            <TableContainer>
              <Table aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell align='right'>
                      <Translations text='Name_of_product' />
                    </TableCell>
                    <TableCell align='right'>
                      <Translations text='Quantity' />
                    </TableCell>
                    <TableCell align='right'>
                      <Translations text='Price per 1 unit' />
                    </TableCell>
                    <TableCell align='right'>
                      <Translations text='total_amount_goods' />
                    </TableCell>
                    <TableCell align='right'>
                      <Translations text='Actions' />
                    </TableCell>
                  </TableRow>
                </TableHead>{' '}
                <TableBody>
                  {productsList?.map((row: ProductType, i) => (
                    <TableRow
                      key={row?.id}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        }
                      }}
                    >
                      <TableCell component='th' scope='row'>
                        {i + 1}
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align='right'>{row.name}</TableCell>
                      <TableCell align='right'>{row.count}</TableCell>
                      <TableCell align='right'>
                        <CurrencyFormatter amount={row.amount || 0} currency='sum' />
                      </TableCell>
                      <TableCell align='right'>
                        <CurrencyFormatter amount={(row.amount ?? 0) * row.count} currency='sum' />
                      </TableCell>

                      <TableCell align='right'>
                        <Icon icon='tabler:trash' style={{ cursor: 'pointer' }} onClick={() => onDeleteProd(row.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' onClick={handleStepBack}>
            <Icon icon='tabler:arrow-left' />
            <Translations text='Previous' />
          </Button>
          <Button variant='contained' onClick={handleStep}>
            <Translations text='Submit_data_for_processing' /> <Icon icon='tabler:arrow-right' />
          </Button>
        </Box>
      </CleaveWrapper>
    </CardContent>
  )
}

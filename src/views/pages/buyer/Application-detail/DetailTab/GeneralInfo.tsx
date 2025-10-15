import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Icon } from '@iconify/react'
import ContentChat from './ContentChat'
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, styled } from '@mui/material'
import { ElementType, useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import toast from 'react-hot-toast'
import { ApplicationInfo, ApplicationUserType, ProductType } from 'src/context/types'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import moment from 'moment'
import { useRouter } from 'next/router'

const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
  return { name, calories, fat, carbs, protein }
}
const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]
const activs = [
  {
    id: 1,
    name: 'Напомнить'
  },
  {
    id: 2,
    name: 'Оплатил'
  },
  {
    id: 3,
    name: 'Оплатит'
  },
  {
    id: 4,
    name: 'Отказался(ась) платить'
  },
  {
    id: 5,
    name: 'Надо проверить'
  },
  {
    id: 6,
    name: 'Телефон отключен'
  },
  {
    id: 7,
    name: 'Кредит закрыт'
  },
  {
    id: 8,
    name: 'Другой номер'
  }
]
const GeneralInfo = ({ apiData }: { apiData: ApplicationUserType & ApplicationInfo }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [state, setState] = useState<any>({ date_type: new Date(), note: '', activity: '' })
  const [inputValue, setInputValue] = useState<string>('')
  const [staticContract, setStaticContract] = useState<File>()
  const [productsList, setproductsList] = useState([])
  const fetchData = async () => {
    try {
      const resProd = await DataService.get(endpoints.productGetByID(router?.query?.application))
      setproductsList(resProd?.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const handleClose = () => {
    setOpen(false)
  }
  const handleCreate = async (e: any) => {
    e.preventDefault()
    try {
      // await DataService.post(endpoints.periodRate, {
      //   ...state
      // })
      // toast.success(<Translations text='Success!' />)
      // handleClose()
      // getData()
    } catch (err: any) {
      toast.error(err)
    }
  }
  return (
    <Grid container spacing={6} sx={{ my: 5 }}>
      <Grid item xs={12} sm={9} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* ИНФОРМАЦИЯ О ПРОДАВЦЕ */}
        <Typography
          sx={{
            my: 4,
            fontSize: 13,
            fontWeight: 400,
            color: 'text.disabled',
            textTransform: 'uppercase'
          }}
        >
          <Translations text='SELLER_INFORMATION' />
        </Typography>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
            <Translations text='name_group' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.merchant?.group ?? apiData?.branch?.merchant?.group}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
            <Translations text='Name_of_shop' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.branch?.name ?? apiData?.merchant?.name}
          </Typography>
        </Box>

        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
            <Translations text='Address' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.merchant?.address ?? apiData?.branch?.address}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
            <Translations text='Full Name' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.created_by}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
            <Translations text='phone' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            +{apiData?.merchant?.owner_phone ?? apiData?.branch?.merchant?.owner_phone}
          </Typography>
        </Box>
        {/* УСЛОВИЯ ДОГОВОРА РАССРОЧКИ */}

        <Typography sx={{ my: 4, fontSize: 13, fontWeight: 400, color: 'text.disabled', textTransform: 'uppercase' }}>
          <Translations text='TERMS_AND_CONDITIONS_THE_INSTALLMENT_AGREEMENT' />
        </Typography>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black' }}>
            <Translations text='Maturity_' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.loan_period} <Translations text='month' />
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='schedule_4' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            <CurrencyFormatter amount={apiData?.loan_amount as number} currency='sum' />
          </Typography>
        </Box>
        {/* ИНФОРМАЦИЯ О ДОГОВОРЕ */}

        <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
          <Translations text='INFORMATION_ABOUT_AGREEMENT' />
        </Typography>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Number_of_goods_type' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.total_count}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Total_amount_goods' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            <CurrencyFormatter
              amount={
                (apiData?.products as ProductType[])?.reduce(
                  (sum, product) => sum + product?.count * Number(product?.price),
                  0
                ) as number
              }
              currency='sum'
            />
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Credit_ID_for_payment' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>{apiData?.loan_id}</Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Contract_number' />
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.contract}{' '}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Agreement_date' />
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {moment(apiData?.contract_date).format('DD.MM.yyyy')}{' '}
          </Typography>
        </Box>
        {/* <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            СМС код
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>3245yt5 </Typography>
        </Box> */}
        {/* ИНФОРМАЦИЯ О ПОКУПАТЕЛЕ */}
        <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
          <Translations text='BUYER INFORMATION' />
        </Typography>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Address' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>{apiData?.address}</Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Passport_details' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.MyID?.profile?.doc_data?.pass_data}{' '}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='Place_of_work_TIN' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>{apiData?.inn}</Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='number_card' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>{apiData?.card}</Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='card_expiry' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            {apiData?.card_expiry}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='phone' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            +{apiData?.owner_phone}{' '}
          </Typography>
        </Box>
        <Box sx={{ with: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
            <Translations text='phone' />:
          </Typography>
          <Typography sx={{ width: '70%', color: 'text.secondary', textAlign: 'start' }}>
            +{apiData?.close_phone}{' '}
          </Typography>
        </Box>
        {/* <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Translations text='Добавить новый номер' />
        </Button> */}
        {/* ИНФОРМАЦИЯ О ТОВАРЕ/ТОВАРАХ */}
        <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
          <Translations text='INFORMATION_ABOUT_PRODUCT' />
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
                  <Translations text='total_amount' />
                </TableCell>
              </TableRow>
            </TableHead>
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
                    <CurrencyFormatter amount={Number(row.price)} currency='sum' />
                  </TableCell>
                  <TableCell align='right'>
                    <CurrencyFormatter amount={Number(row.price) * row.count} currency='sum' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={() => setOpen(true)}>
              <Icon fontSize='1.125rem' icon='tabler:switch-2' />
              <Translations text='Создать взаимодействия' />
            </Button>
            <Box>
              <Typography variant='h5' sx={{ my: 5 }}>
                Активность
              </Typography>
              Показать:
              <Box sx={{ with: '100%', display: 'flex', my: 3, justifyContent: 'space-between' }}>
                <Button variant='contained' sx={{ mr: 4, '& svg': { mr: 2 } }}>
                  <Translations text='Все' />
                </Button>
                <Button variant='contained' sx={{ mr: 4, '& svg': { mr: 2 } }}>
                  <Translations text='Новые' />
                </Button>
                <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Translations text='Старые' />
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ContentChat />
              <ContentChat />
              <ContentChat />
              <ContentChat />
              <ContentChat />
            </Box>
          </CardContent>
        </Card>
      </Grid>
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
            <Translations text={`Interaction`} />
          </DialogTitle>
          <DialogContent>
            <DatePickerWrapper>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomTextField
                    select
                    required
                    fullWidth
                    label={t('New_activity') as string}
                    id='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    placeholder={t('New_activity') as string}
                    onChange={e => {
                      //@ts-ignore - necessary to load object into value

                      setState({ ...state, activity: e.target.value?.id })
                    }}
                  >
                    {activs?.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    selected={state?.date_type}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => {
                      setState({ ...state, date_type: e })
                    }}
                    placeholderText='dd-MM-yyyy'
                    dateFormat='dd-MM-yyyy'
                    customInput={
                      <CustomTextField
                        fullWidth
                        label={t('Reminder') as string}
                        aria-describedby='validation-basic-dob'
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <ButtonStyled component='label' variant='contained' htmlFor='Add_file' sx={{ my: 3 }}>
                      <Translations text='Add_file' />
                      <input
                        hidden
                        type='file'
                        value={inputValue}
                        accept='*'
                        onChange={(e: any) => setStaticContract(e.target.files[0])}
                        id='Add_file'
                      />
                    </ButtonStyled>
                    {staticContract && <Typography>{staticContract?.name}</Typography>}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    required
                    fullWidth
                    label={t('Comment') as string}
                    placeholder={t('Comment') as string}
                    onChange={e => setState({ ...state, note: e.target.value })}
                    aria-describedby='validation-basic-first-name'
                    multiline
                    rows={7}
                  />
                </Grid>
              </Grid>
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
    </Grid>
  )
}
export default GeneralInfo

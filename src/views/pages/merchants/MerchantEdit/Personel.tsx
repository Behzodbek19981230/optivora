import { Box, ButtonProps, SelectChangeEvent, styled, Switch, Typography, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ChangeEvent, ElementType, forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import InputMask from 'react-input-mask'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import Loader from 'src/@core/components/spinner/Loader'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'
import { getdataMap } from 'src/store/map'
import { getBranchTab } from 'src/store/tabbranch'
import { BankBranchType, BankType } from 'src/types/dictionaries/banks'
import { Category } from 'src/types/dictionaries/category'
import { Districts, Region } from 'src/types/dictionaries/regions'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import Map from 'src/views/components/lafletMap'
import FormModal from 'src/views/components/modals/FormModal'
import Checkbox from '@mui/material/Checkbox'
import { end } from '@popperjs/core'

interface FormInputs {
  id: number
  name: string
  condition: string
  group: string
  end_date: DateType
  category: Category
  auto_annual: string
  has_branch: number
  brandname: string
  status: string
  inn: string
  bank_account: string
  bank: BankType
  bankId: number
  mfo: string
  address: string
  owner: string
  owner_phone: string
  cashback: true
  strategy: string
  longitude: string
  latitude: string
  tax_code: string
  contract_no: string
  contract_start: DateType
  contract_expiry: DateType
  logo: string
  bankBranchId?: number
  regionId?: number
  districtId?: number
  is_broker?: boolean
}
type FormInput = {
  [key: string]: string | boolean | File | number | null | undefined | any
}
interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})
const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))
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
const MerchantPersonal = ({ id }: { id: string }) => {
  const coordinateSelector = useSelector((state: any) => state.map.coordinate)
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [imgSrc, setImgSrc] = useState<string>('/images/logos/slack.png')
  const [inputValue, setInputValue] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [bankBranch, setBankBranch] = useState<BankBranchType[]>([])
  const [district, setDistrict] = useState<Districts[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [data, setData] = useState<FormInputs>()
  const [categories, setCategories] = useState<string[]>([])
  const [staticContract, setStaticContract] = useState<File>()
  const [logo, setLogo] = useState<File>()
  const [state, setState] = useState({ is_broker: false, broker_key: '' })
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<any>()
  const dispatch = useDispatch()
  const [banks, setBanks] = useState<[]>()
  const [category, setCategory] = useState<[]>()
  const getCategoryName = (categoryDefault: any, categoryList: any) => {
    let arr = [] as unknown as string[]
    categoryList?.forEach((item: Category) => {
      categoryDefault?.forEach((res: any) => {
        if (res?.category == item?.category) {
          arr.push(item?.category as string)
        }
      })
    })
    return arr
  }
  const onSelectBank = async (id: number) => {
    try {
      const response = await DataService.get(endpoints.bankBraches, { bankId: id })
      setBankBranch(response.data.result)
    } catch (error: any) {
      toast.error(error?.error)
    }
  }
  const onSelectRegion = async (id: number) => {
    try {
      const response = await DataService.get(endpoints.district, { regionId: id })
      setDistrict(response.data.result)
    } catch (error: any) {
      toast.error(error?.error)
    }
  }
  const getData = async () => {
    try {
      const reponseCategory = await DataService.get(endpoints.categories)
      setCategory(reponseCategory.data.result)
      const resBroker = await DataService.get(endpoints.getBrokerKey(Number(id)))
      // setState({ ...state, broker_key: resBroker?.data?.broker_key })
      const resbank = await DataService.get(endpoints.banks)
      setBanks(resbank.data.result)
      const resRegion = await DataService.get(endpoints.region)
      setRegions(resRegion.data.result)
      const res = await DataService.get(endpoints.merchant + `/${id}`)
      setData(res.data?.result)
      setState({ ...state, is_broker: res.data?.result?.is_broker, broker_key: resBroker?.data?.broker_key })
      onSelectRegion(res.data?.result?.regionId)

      onSelectBank(res.data?.result?.bankId)
      setImgSrc(process.env.NEXT_PUBLIC_BASE_URL + res.data?.result?.logo)

      setCategories(getCategoryName(res?.data?.result?.categories, reponseCategory.data.result))
      dispatch(getdataMap([res.data?.result?.latitude ?? 0, res.data?.result?.longitude ?? 0]))
      for (const [key, value] of Object.entries(res.data?.result)) {
        setValue(key, value, {
          shouldDirty: true
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.isReady])
  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setLogo(files[0])
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/15.png')
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleCreate = () => {
    setOpen(false)
  }

  const onSubmit = async (data: FormInput) => {
    const formData = new FormData()

    for (const key in data) {
      switch (key) {
        case 'bankId':
          formData.append(key, JSON.stringify(data[key]))
          break
        case 'contract_expiry':
          formData.append(key, new Date(data[key] as any).toISOString() as any)
          break
        case 'contract_start':
          formData.append(key, new Date(data[key] as any).toISOString() as any)
          break
        case 'categories':
          getCategoryId().forEach((item: any) => formData.append('categories[]', item?.id as any))
          break
        case 'latitude':
          formData.append('latitude', coordinateSelector?.length > 0 ? coordinateSelector[0] : 0)
          break
        case 'longitude':
          formData.append('longitude', coordinateSelector?.length > 0 ? coordinateSelector[1] : 0)
          break
        case 'static_contract':
          if (staticContract) {
            formData.append('static_contract', staticContract as File)
          }
          break
        case 'has_branch':
          // @ts-ignore
          formData.append('has_branch', Number(data[key]))
          break
        default:
          if (key != 'bank' && key != 'id' && key != 'deletedAt' && key != 'updated_at' && key != 'created_at')
            formData.append(key, data[key] as any)
          break
      }
    }
    if (logo) {
      formData.append('logo', logo as File)
    }

    // formData.append('static_contract', staticContract as File)
    // formData.append('categories', getCategoryId() as any)

    try {
      dispatch(getBranchTab(false))
      await DataService.putForm(endpoints.merchant + `/${id}`, formData)
      toast.success(<Translations text='Successfully' />)
      router.push(`/merchants/edit/${id}`)
      dispatch(getBranchTab(true))
    } catch (error: any) {
      toast.error(error.error)
    }
  }
  const onBlocked = async () => {
    try {
      const data1 = {
        status: data?.status != 'blocked' ? 'blocked' : 'active'
      }
      const res = await DataService.put(`${endpoints.merchant}/${data?.id}`, data1)
      getData()
    } catch (error: any) {
      toast.error(error?.message)
    }
  }
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setCategories(event.target.value as string[])
  }
  const getCategoryId = () => {
    let arr = [] as unknown as number[]
    category?.forEach((item: Category) => {
      categories?.forEach((res: string) => {
        if (res == item?.category) {
          arr.push(item as any)
        }
      })
    })
    return arr
  }
  const generateKey = async () => {
    try {
      const res = await DataService.post(endpoints.getBrokerKey(Number(id)))
      setState({ ...state, is_broker: true, broker_key: res?.data?.broker_key })
    } catch (e: any) {
      toast.error(e?.data?.message)
    }
  }
  return (
    <DatePickerWrapper>
      <CardContent>
        {data ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: 10
                      // padding: 3
                    }}
                  >
                    <ImgStyled src={imgSrc} alt='Profile Pic' />
                    <div>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        <Translations text='Upload new logo' />
                        <input
                          hidden
                          type='file'
                          value={inputValue}
                          accept='image/png, image/jpeg'
                          onChange={handleInputImageChange}
                          id='account-settings-upload-image'
                        />
                      </ButtonStyled>
                      <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                        <Translations text='Reset' />
                      </ResetButtonStyled>
                      <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                        <Translations text='Allowed PNG or JPEG. Max size of 800K' /> .
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: theme.palette.grey[400], my: 5 }}>
              <Translations text='LEGAL INFORMATION' />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={2.4}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      // value={value}
                      defaultValue={data?.name}
                      label={t('name') as string}
                      onChange={onChange}
                      placeholder={t('name') as string}
                      error={Boolean(errors.name)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.name && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='group'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      defaultValue={data?.group}
                      // value={value}
                      label={t('Group') as string}
                      onChange={onChange}
                      placeholder={t('Group') as string}
                      error={Boolean(errors.group)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.group && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='contract_no'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      defaultValue={data.contract_no}
                      type='text'
                      label={t('contract_number') as string}
                      onChange={onChange}
                      placeholder={t('contract_number') as string}
                      error={Boolean(errors.contract_no)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.contract_no && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='contract_expiry'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value ? moment(value).toDate() : moment(data?.contract_expiry).toDate()}
                      showYearDropdown
                      showMonthDropdown
                      dateFormat='dd-MM-yyyy'
                      onChange={e => onChange(e)}
                      placeholderText='DD-MM-YYYY'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          label={t('expiration date') as string}
                          error={Boolean(errors.contract_expiry)}
                          aria-describedby='validation-basic-dob'
                          {...(errors.contract_expiry && { helperText: 'This field is required' })}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='contract_start'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value ? moment(value).toDate() : moment(data?.contract_start).toDate()}
                      showYearDropdown
                      showMonthDropdown
                      dateFormat='dd-MM-yyyy'
                      onChange={e => onChange(e)}
                      placeholderText='DD/MM/YYYY'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          label={t('contract_date') as string}
                          error={Boolean(errors.contract_start)}
                          aria-describedby='validation-basic-dob'
                          {...(errors.contract_start && { helperText: 'This field is required' })}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='regionId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      select
                      defaultValue={data?.regionId}
                      // value={value}
                      label={t('region') as string}
                      onChange={e => {
                        onChange(e)
                        onSelectRegion(Number(e.target.value) as number)
                      }}
                      placeholder={t('region') as string}
                      error={Boolean(errors.region)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.region && { helperText: 'This field is required' })}
                    >
                      <MenuItem value=''>None</MenuItem>
                      {regions?.map((item: Region) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='districtId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      select
                      defaultValue={data?.districtId}
                      // value={value}
                      label={t('district') as string}
                      onChange={onChange}
                      placeholder={t('district') as string}
                      error={Boolean(errors.district)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.district && { helperText: 'This field is required' })}
                    >
                      <MenuItem value=''>None</MenuItem>
                      {district?.map((item: Districts) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Controller
                  name='address'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      // value={value}
                      defaultValue={data?.address}
                      label={t('Address') as string}
                      onChange={onChange}
                      placeholder={t('Address') as string}
                      error={Boolean(errors.address)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.address && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={2.4}>
                <Controller
                  name='bank_account'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      inputProps={{ maxLength: 20, type: 'text' }} // Corrected maxLength and changed type to 'text'
                      value={value}
                      label={t('bank_account') as string}
                      onChange={e => {
                        // Only update if the input is numeric and does not exceed 10 characters
                        const newValue = e.target.value
                        if (/^\d{0,20}$/.test(newValue)) {
                          onChange(newValue)
                        }
                      }}
                      defaultValue={data?.bank_account}
                      placeholder={t('bank_account') as string}
                      error={Boolean(errors.bank_account)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.bank_account && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={1.2}>
                <Controller
                  name='mfo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      // value={value}
                      defaultValue={data?.mfo}
                      label={t('mfo') as string}
                      onChange={onChange}
                      placeholder={t('mfo') as string}
                      error={Boolean(errors.mfo)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.mfo && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1.2}>
                <Controller
                  name='inn'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      defaultValue={data?.inn}
                      // value={value}
                      label={t('STIR') as string}
                      onChange={onChange}
                      placeholder={t('STIR') as string}
                      error={Boolean(errors.inn)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.inn && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='bankId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      select
                      defaultValue={data?.bankId}
                      // value={value}
                      label={t('bank') as string}
                      onChange={e => {
                        onChange(e)
                        onSelectBank(Number(e.target.value) as number)
                      }}
                      placeholder={t('bank') as string}
                      error={Boolean(errors.bank)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.bank && { helperText: 'This field is required' })}
                    >
                      <MenuItem value=''>None</MenuItem>
                      {banks?.map((item: BankType) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='bankBranchId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      select
                      defaultValue={data?.bankBranchId}
                      // value={value}
                      label={t('branch_banks') as string}
                      onChange={onChange}
                      placeholder={t('branch_banks') as string}
                      error={Boolean(errors.bankBranch)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.bankBranch && { helperText: 'This field is required' })}
                    >
                      <MenuItem value=''>None</MenuItem>
                      {bankBranch?.map((item: BankBranchType) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='Download the contract' sx={{ mt: 3 }}>
                  <Translations text='Download the contract' />
                  <input
                    hidden
                    type='file'
                    value={inputValue}
                    accept='*'
                    onChange={(e: any) => setStaticContract(e.target.files[0])}
                    id='Download the contract'
                  />
                </ButtonStyled>
                {staticContract && <Typography>{staticContract?.name}</Typography>}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}>
                <Grid item xs={2}>
                  <CustomTextField
                    value={coordinateSelector?.length > 0 ? coordinateSelector[0] : 0}
                    fullWidth
                    name='latitude'
                    disabled
                    defaultValue={data?.latitude}
                    placeholder={t('x') as string}
                    aria-describedby='validation-basic-first-name'
                  />
                </Grid>
                <Grid item xs={2} sx={{ my: 8 }}>
                  <CustomTextField
                    fullWidth
                    name='longitude'
                    disabled
                    defaultValue={data?.longitude}
                    value={coordinateSelector?.length > 0 ? coordinateSelector[1] : 0}
                    placeholder={t('y') as string}
                    aria-describedby='validation-basic-first-name'
                  />
                </Grid>
                <Grid item xs={2} sx={{ my: 8 }}>
                  <Button variant='contained' onClick={() => setOpen(true)}>
                    <Translations text='Address' />
                  </Button>
                </Grid>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: theme.palette.grey[400], my: 5 }}>
              <Translations text='CONTACT INFORMATION' />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='owner'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      // value={value}
                      label={t('Owner') as string}
                      onChange={onChange}
                      defaultValue={data?.owner}
                      placeholder={t('Owner') as string}
                      error={Boolean(errors.owner)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.owner && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='owner_phone'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <InputMask
                      mask='99-999-99-99'
                      disabled={false}
                      onChange={e => onChange('998' + e.target.value?.split('-').join(''))}
                    >
                      <CustomTextField
                        fullWidth
                        defaultValue={data?.owner_phone}
                        label={t("Owner's phone number") as string}
                        error={Boolean(errors.owner_phone)}
                        aria-describedby='validation-basic-last-name'
                        {...(errors.owner_phone && { helperText: 'This field is required' })}
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                        }}
                      />
                    </InputMask>
                  )}
                />
              </Grid>
            </Grid>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: theme.palette.grey[400], my: 5 }}>
              <Translations text='ADDITIONAL INFORMATION' />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Controller
                  name='cashback'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      select
                      defaultValue={data?.cashback}
                      // value={value}
                      label={t('Cashback') as string}
                      onChange={onChange}
                      placeholder={t('Cashback') as string}
                      aria-describedby='validation-basic-first-name'
                    >
                      <MenuItem value=''>None</MenuItem>
                      <MenuItem value='cashback_in'>IN</MenuItem>
                      <MenuItem value='cashback_out'>OUT</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='tax_code'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      // value={value}
                      label={t('Tax code') as string}
                      onChange={onChange}
                      defaultValue={data?.tax_code}
                      placeholder={t('Tax code') as string}
                      error={Boolean(errors.tax_code)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.tax_code && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  select
                  fullWidth
                  placeholder={t('Category') as string}
                  label={t('Category') as string}
                  id='select-multiple-chip'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: categories,
                    onChange: e => handleChange(e),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[])?.map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {category?.map((category: Category) => (
                    <MenuItem key={category.id} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: theme.palette.grey[400], my: 5 }}>
              <Translations text='CONDITIONS' />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name='condition'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      defaultValue={data?.condition}
                      fullWidth
                      label={t('Conditions') as string}
                      SelectProps={{
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.condition)}
                      aria-describedby='validation-basic-select'
                      {...(errors.condition && { helperText: 'This field is required' })}
                      placeholder={t('Conditions') as string}
                    >
                      <MenuItem value=''>None</MenuItem>
                      <MenuItem value='A'>A</MenuItem>
                      <MenuItem value='B'>B</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='auto_annual'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      defaultValue={data?.auto_annual}
                      fullWidth
                      label={t('Auto reset') as string}
                      SelectProps={{
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.auto_annual)}
                      aria-describedby='validation-basic-select'
                      {...(errors.auto_annual && { helperText: 'This field is required' })}
                    >
                      <MenuItem value=''>None</MenuItem>

                      <MenuItem value='3'>3 oy</MenuItem>
                      <MenuItem value='12'>12 oy</MenuItem>
                      <MenuItem value='18'>1.5 yil</MenuItem>
                      <MenuItem value='36'>3 yil</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='has_branch'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    onChange={(e: any) => onChange(Number(e.target?.checked))}
                    control={<Switch defaultChecked={Boolean(data?.has_branch) as boolean} />}
                    label={
                      value ? (
                        <Translations text={`Merchant_has_branch`} />
                      ) : (
                        <Translations text='Merchant_has_not_branch' />
                      )
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name='is_broker'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    onChange={(e: any) => {
                      onChange(Number(e.target?.checked))
                      setState({ ...state, is_broker: e.target?.checked })
                    }}
                    control={<Checkbox defaultChecked={Boolean(data?.is_broker) as boolean} />}
                    label={<Translations text={`Merchant_is_broker`} />}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 4 }}>
              {state?.is_broker && !state.broker_key ? (
                <Button onClick={generateKey} sx={{ marginTop: 3 }} variant='tonal' color='warning'>
                  <Translations text='Generation_key' />
                </Button>
              ) : (
                ''
              )}
              <Typography>{state.broker_key}</Typography>
            </Grid>

            <Grid container spacing={2} my={3}>
              <Grid item xs={6}>
                {/* <Button onClick={onBlocked} variant='tonal' color='error'>
                  {data?.status == 'active' ? <Translations text='Block' /> : <Translations text='Unblock' />}
                </Button> */}
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'end', gap: 5 }}>
                <Button type='submit' variant='contained'>
                  <Translations text='Save' />
                </Button>
                <Button onClick={() => router.push('/merchants')} variant='contained' color='secondary'>
                  <Translations text='Cancel' />
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Loader />
        )}
      </CardContent>
      <FormModal maxWidth='lg' title='' handleClose={handleClose} handleSave={handleCreate} open={open}>
        <Map />
      </FormModal>
    </DatePickerWrapper>
  )
}

export default MerchantPersonal

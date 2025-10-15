import { forwardRef, useState, ChangeEvent, ElementType, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Box, SelectChangeEvent, Switch, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import { styled, ButtonProps, useTheme } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import InputMask from 'react-input-mask'
import { useTranslation } from 'react-i18next'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useRouter } from 'next/router'
import { Category } from 'src/types/dictionaries/category'
import FormModal from 'src/views/components/modals/FormModal'
import Map from 'src/views/components/lafletMap'
import { useSelector } from 'react-redux'
import { BankBranchType, BankType } from 'src/types/dictionaries/banks'
import CustomChip from 'src/@core/components/mui/chip'
import { Districts, Region } from 'src/types/dictionaries/regions'

interface State {
  password: string
  showPassword: boolean
}

type FormInput = {
  [key: string]: string | File | Blob | null | undefined | boolean
}
interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
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

const MerchantCreate = () => {
  // ** States
  const coordinateSelector = useSelector((state: any) => state.map.coordinate)

  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [imgSrc, setImgSrc] = useState<string>('/images/logos/slack.png')
  const [inputValue, setInputValue] = useState<string>('')
  const [staticContract, setStaticContract] = useState<File>()
  const [logo, setLogo] = useState<File>()
  const [open, setOpen] = useState<boolean>(false)
  const [banks, setBanks] = useState<[]>()
  const [bankBranch, setBankBranch] = useState<BankBranchType[]>([])
  const [category, setCategory] = useState<[]>()
  const [categories, setCategories] = useState<string[]>([])
  const [district, setDistrict] = useState<Districts[]>([])
  const [regions, setRegions] = useState<Region[]>([])
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
      const resbank = await DataService.get(endpoints.banks)
      setBanks(resbank.data.result)
      const reponseCategory = await DataService.get(endpoints.categories)
      setCategory(reponseCategory.data.result)
      const resRegion = await DataService.get(endpoints.region)
      setRegions(resRegion.data.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getData()
  }, [])
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
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setCategories(event.target.value as string[])
  }
  const onSelectBank = async (id: number) => {
    try {
      const response = await DataService.get(endpoints.bankBraches, { bankId: id })
      setBankBranch(response.data.result)
    } catch (error: any) {
      toast.error(error?.error)
    }
  }
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<any>()
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

        case 'has_branch':
          {
            // @ts-ignore
            if (data[key] == undefined) formData.append(key, '0')
            else formData.append(key, '1')
          }
          break
        default:
          formData.append(key, data[key] as string)
          break
      }
    }
    formData.append('latitude', coordinateSelector?.length > 0 ? coordinateSelector[0] : 0)
    formData.append('longitude', coordinateSelector?.length > 0 ? coordinateSelector[1] : 0)
    if (logo) {
      formData.append('logo', logo as File)
    }
    if (staticContract) {
      formData.append('static_contract', staticContract as File)
    }
    formData.append('status', 'active')
    getCategoryId().forEach((item: any) => formData.append('categories[]', item?.id))

    try {
      const response = await DataService.postForm(endpoints.merchant, formData)
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        toast.success(<Translations text='Successfully' />)
        router.push(`/merchants/edit/${response?.data?.result?.id}`)
      }
    } catch (error: any) {
      toast.error(error?.error)
    }
  }

  return (
    <DatePickerWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PageHeader
          title={
            <Typography variant='h4'>
              <Translations text='Create_merchant' />
            </Typography>
          }
        />
        <Card>
          <CardContent>
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
                        selected={value}
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
                        selected={value}
                        showYearDropdown
                        showMonthDropdown
                        dateFormat='dd-MM-yyyy'
                        onChange={e => onChange(e)}
                        placeholderText='DD-MM-YYYY'
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
                        defaultValue=''
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
                          <MenuItem value={item.id} key={item.id}>
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
                        defaultValue=''
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
                      name='longitude'
                      disabled
                      placeholder={t('x') as string}
                      aria-describedby='validation-basic-first-name'
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ my: 8 }}>
                    <CustomTextField
                      fullWidth
                      name='latitude'
                      disabled
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
                          // value={value}
                          label={t("Owner's phone number") as string}
                          // onChange={onChange}
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
                        defaultValue=''
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
              <Grid container spacing={2} my={3}>
                {/* <Grid item xs={3}>
                  <Controller
                    name='username'
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
                          // value={value}
                          label={t('login') as string}
                          // onChange={onChange}
                          error={Boolean(errors.username)}
                          aria-describedby='validation-basic-last-name'
                          {...(errors.username && { helperText: 'This field is required' })}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                          }}
                        />
                      </InputMask>
                    )}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        // value={value}
                        label={t('Password') as string}
                        onChange={onChange}
                        id='validation-basic-password'
                        error={Boolean(errors.password)}
                        type={state.showPassword ? 'text' : 'password'}
                        {...(errors.password && { helperText: 'This field is required' })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon fontSize='1.25rem' icon={state.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid> */}

                <Grid item xs={6}>
                  <Controller
                    name='condition'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        defaultValue=''
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
                        defaultValue=''
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
              <Grid item xs={6}>
                <Controller
                  name='has_branch'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      defaultValue='false'
                      onChange={(e: any) => onChange(Number(e.target?.checked))}
                      control={<Switch defaultChecked={false} />}
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

              <Grid container spacing={2}>
                {/* <Grid item xs={6}>
                  <Button onClick={onBlocked} variant='tonal' color='error'>
                    <Translations text='Block' />
                  </Button>
                </Grid> */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
                  <Button type='submit' variant='contained'>
                    <Translations text='Save' />
                  </Button>
                  <Button variant='contained' color='secondary' onClick={() => router.push('/merchants')}>
                    <Translations text='Cancel' />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
      <FormModal maxWidth='lg' title='' handleClose={handleClose} handleSave={handleCreate} open={open}>
        <Map />
      </FormModal>
    </DatePickerWrapper>
  )
}

export default MerchantCreate

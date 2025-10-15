// ** React Imports
import { useState, ElementType, ChangeEvent, FormEvent } from 'react'
import InputMask from 'react-input-mask'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button, { ButtonProps } from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
import { IconButton, InputAdornment } from '@mui/material'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

interface Data {
  name: string
  surname: string
  fathers_name: string
  role: string
  username: string
  password: string
  password2: string
  image: File | null
}

const initialData: Data = {
  name: '',
  surname: '',
  fathers_name: '',
  role: '',
  username: '',
  password: '',
  password2: '',
  image: null
}

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

const EmployeeAccount = () => {
  // ** State
  const router = useRouter()
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [error, setError] = useState<Data>(initialData)
  const handleClose = () => setOpen(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const defaultValues = {
    name: '',
    surname: '',
    father_name: '',
    username: '',
    password: '',
    password2: '',
    role: ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const onSubmit = async () => {
    if (formData.password != formData.password2) {
      toast.error('Parollar mos emas!')
    } else {
      const dataForm = new FormData()
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          dataForm.append(key, (formData as any)[key])
        }
      }
      const response = await DataService.postForm(endpoints.usersStaff, dataForm)
      if (response.data?.error) {
        toast.error(response.data?.error)
      } else {
        toast.success(t('employee_created_successfully'))
        router.push('/employee/list')
      }
    }
  }
  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      setFormData(prevData => ({ ...prevData, image: files[0] }))

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

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='Add employee' />
          </Typography>
        }
      />
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Translations text='Profile Details' />} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    <Translations text='Upload New Photo' />
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
                    <Translations text='Allowed PNG or JPEG. Max size of 800K' />.
                  </Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    inputProps={register('name', {
                      required: 'Please enter name'
                    })}
                    label={<Translations text='First Name' />}
                    placeholder={t('First Name') as string}
                    onChange={e => handleFormChange('name', e.target.value)}
                    error={Boolean(errors.name)}
                    aria-describedby='validation-basic-last-name'
                    {...(errors.name && { helperText: t('field_is_required') })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Last Name' />}
                    placeholder={t('Last Name') as string}
                    onChange={e => handleFormChange('surname', e.target.value)}
                    // inputProps={register('surname', {
                    //   required: 'Please enter name'
                    // })}
                    // error={Boolean(errors.surname)}
                    // aria-describedby='validation-basic-last-name'
                    // {...(errors.surname && { helperText: t('field_is_required') })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Patronymic' />}
                    placeholder={t('Patronymic') as string}
                    onChange={e => handleFormChange('fathers_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputMask
                    mask='99-999-99-99'
                    disabled={false}
                    onChange={e => handleFormChange('username', '998' + e.target.value?.split('-').join(''))}
                  >
                    <CustomTextField
                      fullWidth
                      label={t('phone') as string}
                      aria-describedby='validation-basic-last-name'
                      {...(error.username && { helperText: error.username })}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                      }}
                      inputProps={register('username', {
                        required: 'Please enter name'
                      })}
                      error={Boolean(errors.username)}
                      {...(errors.username && { helperText: t('field_is_required') })}
                    />
                  </InputMask>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Password' />}
                    placeholder={t('Password') as string}
                    onChange={e => handleFormChange('password', e.target.value)}
                    aria-describedby='validation-basic-last-name'
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    inputProps={register('password', {
                      required: 'Please enter name'
                    })}
                    error={Boolean(errors.password)}
                    {...(errors.password && { helperText: t('field_is_required') })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Reset password' />}
                    placeholder={t('Reset password') as string}
                    onChange={e => handleFormChange('password2', e.target.value)}
                    aria-describedby='validation-basic-last-name'
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    inputProps={register('password2', {
                      required: 'Please enter name'
                    })}
                    error={Boolean(errors.password2)}
                    {...(errors.password2 && { helperText: t('field_is_required') })}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    defaultValue=''
                    label={<Translations text='Role' />}
                    placeholder={t('Role') as string}
                    select
                    onChange={e => handleFormChange('role', e.target.value)}
                    aria-describedby='validation-basic-last-name'
                    inputProps={register('role', {
                      required: 'Please enter name'
                    })}
                    error={Boolean(errors.role)}
                    {...(errors.role && { helperText: t('field_is_required') })}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='accountant'>
                      <Translations text='accountant_' />
                    </MenuItem>
                    <MenuItem value='call'>
                      <Translations text='call_center' />
                    </MenuItem>
                    <MenuItem value='manager'>
                      <Translations text='manager_' />
                    </MenuItem>
                    <MenuItem value='superuser'>
                      <Translations text='administrator_' />
                    </MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 5 }}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
                    <Button variant='contained' sx={{ mr: 4 }} type='submit'>
                      <Translations text='Save' />
                    </Button>
                    <Button type='reset' variant='tonal' color='secondary' onClick={() => setFormData(initialData)}>
                      <Translations text='Reset' />
                    </Button>
                    <Button variant='tonal' color='secondary' onClick={() => router.back()}>
                      <Translations text='Cancel' />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EmployeeAccount

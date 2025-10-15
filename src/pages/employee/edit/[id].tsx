// ** React Imports
import { FormControlLabel, IconButton, InputAdornment, Switch } from '@mui/material'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { ChangeEvent, ElementType, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import ReactInputMask from 'react-input-mask'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'

interface Data {
  name: string
  is_active: boolean | number
  surname: string
  fathers_name: string
  role: string
  username: string
  password: string
  password2: string
}

const initialData: Data = {
  name: '',
  surname: '',
  is_active: true,
  fathers_name: '',
  role: '',
  username: '',
  password: '',
  password2: ''
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

const EmployeeAccountEdit = () => {
  // ** State
  const router = useRouter()
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<any>()
  const [imgSrc, setImgSrc] = useState<string>()
  const [error, setError] = useState<Data>(initialData)
  const handleClose = () => setOpen(false)
  const [data, setData] = useState<any>()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()
  const [passError, setPassError] = useState({ newPassword: '', confirmPassword: '' })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<any>()
  const fetchData = async () => {
    try {
      const res = await DataService.get(endpoints.usersStaff + `/${router.query?.id}`)
      setData(res.data?.result)
      if (res.data?.result?.image) {
        setImgSrc(process.env.NEXT_PUBLIC_BASE_URL + res.data?.result?.image)
      } else setImgSrc('/images/avatars/15.png')
      for (const [key, value] of Object.entries(res.data?.result)) {
        if (key != 'password')
          setValue(key, value, {
            shouldDirty: true
          })
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const onSubmit = async () => {
    if (formData?.password != formData?.password2) {
      toast.error('Parollar mos emas!')
    } else {
      const dataForm = new FormData()
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          dataForm.append(key, (formData as any)[key])
        }
      }
      const response = await DataService.putForm(endpoints.usersStaff + `/${router?.query?.id}`, dataForm)
      if (response.data?.error) {
        toast.error(response.data?.error)
      } else {
        toast.success(t('edited_successfully'))
        router.push('/employee/list')
      }
    }
  }
  const onSave = async () => {
    try {
      if (newPassword == confirmPassword) {
        await DataService.post(endpoints.resetPasswordStaff, { id: router.query?.id, newPassword: newPassword })
        toast.success(t('edited_successfully'))
        setPassError({ newPassword: '', confirmPassword: '' })
      } else {
        if (newPassword) setPassError({ ...passError, newPassword: '', confirmPassword: 'mos emas' })
        else if (confirmPassword) {
          setPassError({ ...passError, newPassword: '', confirmPassword: 'mos emas' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      setFormData((prevData: any) => ({ ...prevData, image: files[0] }))
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc(process.env.NEXT_PUBLIC_BASE_URL + data?.image)
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }
  const onDelete = async () => {
    try {
      await DataService.delete(endpoints.usersStaff + `/${router.query?.id}`)
      toast.success(t('deleted_successfully'))
      router.push('/employee/list')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Grid container spacing={6}>
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
                    name='name'
                    defaultValue={data?.name}
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
                    name='surname'
                    label={<Translations text='Last Name' />}
                    defaultValue={data?.surname}
                    placeholder={t('Last Name') as string}
                    onChange={e => handleFormChange('surname', e.target.value)}
                    inputProps={register('surname')}
                    // error={Boolean(errors.surname)}
                    // aria-describedby='validation-basic-last-name'
                    // {...(errors.surname && { helperText: t('field_is_required') })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    key={data?.fathers_name}
                    name='fathers_name'
                    inputProps={register('fathers_name')}
                    defaultValue={data?.fathers_name}
                    fullWidth
                    label={<Translations text='Patronymic' />}
                    placeholder={t('Patronymic') as string}
                    onChange={e => handleFormChange('fathers_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ReactInputMask
                    mask='99-999-99-99'
                    disabled={false}
                    onChange={e =>
                      handleFormChange('username', '998' + e.target.value?.split('-').join('').split('_').join(''))
                    }
                  >
                    <CustomTextField
                      fullWidth
                      key={data?.username}
                      defaultValue={data?.username?.slice(3)}
                      label={t('phone') as string}
                      error={Boolean(formData?.username?.length < 12)}
                      aria-describedby='validation-basic-last-name'
                      {...(error.username && { helperText: error.username })}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                      }}
                    />
                  </ReactInputMask>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    key={data?.role}
                    fullWidth
                    name='role'
                    defaultValue={data?.role}
                    label={<Translations text='Role' />}
                    placeholder={t('Role') as string}
                    select
                    onChange={e => handleFormChange('role', e.target.value)}
                    aria-describedby='validation-basic-last-name'
                    inputProps={register('role')}
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
                <Grid item xs={12} sm={4}></Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    autoComplete='new-password'
                    label={<Translations text='new_password' />}
                    placeholder={t('new_password') as string}
                    onChange={e => setNewPassword(e.target.value)}
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
                    error={Boolean(passError.newPassword)}
                    {...(passError.newPassword && { helperText: t('field_is_required') })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Reset password' />}
                    placeholder={t('Reset password') as string}
                    onChange={e => setConfirmPassword(e.target.value)}
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
                    error={Boolean(passError.confirmPassword)}
                    {...(passError.confirmPassword && { helperText: t('field_is_required') })}
                  />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button variant='contained' sx={{ mr: 4 }} type='button' onClick={onSave}>
                    <Translations text='change_password' />
                  </Button>
                </Grid>
                <Typography></Typography>
                <Grid item xs={12} sm={12}>
                  {data ? (
                    <FormControlLabel
                      onChange={(e: any) => handleFormChange('is_active', Number(e.target?.checked))}
                      control={<Switch defaultChecked={data?.is_active} />}
                      label={
                        (formData ? formData?.is_active : data?.is_active) ? (
                          <Translations text='Activate' />
                        ) : (
                          <Translations text='Deactivate' />
                        )
                      }
                    />
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
                    <Button variant='contained' sx={{ mr: 4 }} color='error' onClick={onDelete}>
                      <Translations text='Delete' />
                    </Button>
                    <Button variant='contained' sx={{ mr: 4 }} type='submit'>
                      <Translations text='Save' />
                    </Button>
                    <Button variant='tonal' color='secondary' onClick={() => router.push('/employee/list')}>
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

export default EmployeeAccountEdit

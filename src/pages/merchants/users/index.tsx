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

interface Data {
  name: string
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

const MerchantUserAccount = () => {
  // ** State
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [error, setError] = useState<Data>(initialData)
  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log(formData.username.split('-').join('').split('_').join(''))
    if (formData.password != formData.password2) {
      toast.error('Parollar mos emas!')
    }
    if (
      !Boolean(formData.fathers_name) ||
      !Boolean(formData.name) ||
      !Boolean(formData.password) ||
      !Boolean(formData.password2) ||
      !Boolean(formData.role) ||
      !Boolean(formData.username.split('-').join('').split('_').join('')) ||
      !Boolean(formData.fathers_name)
    ) {
      toast.error("Maydonlar to'ldirilmagan yoki xatolik bor!")
    } else {
      try {
        const response = await DataService.post(endpoints.usersStaff, formData)
      } catch (err) {
        console.log(err)
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
            <Translations text='Add user' />
          </Typography>
        }
      />
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Translations text='Profile Details' />} />
          <form onSubmit={onSubmit}>
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
                    label={<Translations text='First Name' />}
                    placeholder={t('First Name') as string}
                    onChange={e => handleFormChange('name', e.target.value)}
                    error={Boolean(error.name)}
                    aria-describedby='validation-basic-last-name'
                    {...(error.name && { helperText: error.name })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Last Name' />}
                    placeholder={t('Last Name') as string}
                    onChange={e => handleFormChange('surname', e.target.value)}
                    error={Boolean(error.surname)}
                    aria-describedby='validation-basic-last-name'
                    {...(error.surname && { helperText: error.surname })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Patronymic' />}
                    error={Boolean(error.fathers_name)}
                    aria-describedby='validation-basic-last-name'
                    {...(error.fathers_name && { helperText: error.fathers_name })}
                    placeholder={t('Patronymic') as string}
                    onChange={e => handleFormChange('fathers_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputMask
                    mask='99-999-99-99'
                    disabled={false}
                    onChange={e => handleFormChange('username', e.target.value)}
                  >
                    <CustomTextField
                      fullWidth
                      label={t('phone') as string}
                      error={Boolean(error.username)}
                      aria-describedby='validation-basic-last-name'
                      {...(error.username && { helperText: error.username })}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                      }}
                    />
                  </InputMask>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label={<Translations text='Password' />}
                    placeholder={t('Password') as string}
                    onChange={e => handleFormChange('password', e.target.value)}
                    error={Boolean(error.password)}
                    aria-describedby='validation-basic-last-name'
                    {...(error.password && { helperText: error.password })}
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
                  />
                </Grid>

                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                  <Button variant='contained' sx={{ mr: 4 }} type='submit'>
                    <Translations text='Save' />
                  </Button>
                  {/* <Button  variant='tonal' color='secondary' onClick={() =>}>
                    <Translations text='Cancel' />
                  </Button> */}
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Deactivate Account Dialogs */}
      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography>Are you sure you would like to cancel your subscription?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default MerchantUserAccount

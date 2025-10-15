// ** React Imports
import { useState, ReactNode } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import InputMask from 'react-input-mask'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Translations from 'src/layouts/components/Translations'
import NasiyaIcon from 'src/views/ui/icons/Nasiya'
import LogoIcon from 'src/views/ui/icons/Logo'
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const LoginAllPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const auth = useAuth()
  const theme = useTheme()
  const schema = yup.object().shape({
    username: yup.string().min(5).required(),
    password: yup.string().min(5).required()
  })

  const defaultValues = {
    password: '',
    username: ''
  }
  interface FormData {
    username: string
    password: string
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const onSubmit = (data: FormData) => {
    const { username, password } = data
    auth.login({ username, password }, error => {
      console.log(error)

      setError('username', {
        message: 'username or Password is invalid'
      })
    })
  }

  return (
    <Card>
      <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
        <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.1 }}>
          <LogoIcon />
          
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='h4' sx={{ mb: 1.5, textAlign: 'center' }}>
            <Translations text="Login to the administrator's account" />
          </Typography>
        </Box>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 4 }}>
            <Controller
              name='username'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
              
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Foydalanuvchi nomi'
                    error={Boolean(errors.username)}
                    aria-describedby='validation-basic-last-name'
                    {...(errors.username && { helperText: errors.username.message })}
                    onBlur={onBlur}
                    onChange={onChange}
                    
                  />
           
              )}
            />
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label={<Translations text='Password' />}
                  onChange={onChange}
                  id='auth-login-v2-password'
                  error={Boolean(errors.password)}
                  {...(errors.password && { helperText: errors.password.message })}
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
              )}
            />
          </Box>
          <Box
            sx={{
              mb: 1.75,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'end'
            }}
          >
            {/* <FormControlLabel control={<Checkbox />} label='Remember Me' /> */}
            {/* <Typography component={LinkStyled} href='/forgot-password'>
              <Translations text='Forgot Password?' />
            </Typography> */}
          </Box>
          <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
            {<Translations text='Login' />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

LoginAllPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginAllPage.guestGuard = true

export default LoginAllPage

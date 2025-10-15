// ** React Imports
import { FormEventHandler, ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputMask from 'react-input-mask'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { Card, CardContent, InputAdornment } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import LogoIcon from 'src/views/ui/icons/Logo'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const [error, setError] = useState<string>('')
  const handleSend = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    // const
  }
  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.1 }}>
              <LogoIcon />
                Optivora
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5, textAlign: 'center' }}>
                <Translations text='Forgot Password?' /> 🔒
              </Typography>
            </Box>

            <form autoComplete='off' noValidate onSubmit={handleSend}>
              <InputMask mask='99-999-99-99' disabled={false}>
                <CustomTextField
                  fullWidth
                  // value={value}
                  label='Телефон владельца'
                  error={Boolean(error)}
                  aria-describedby='validation-basic-last-name'
                  {...(error && { helperText: error })}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                  }}
                />
              </InputMask>

              <Button fullWidth type='submit' variant='contained' sx={{ my: 4 }}>
                Send reset link
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}
ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true
export default ForgotPassword

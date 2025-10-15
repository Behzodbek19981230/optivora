// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { Card, CardContent } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { useRouter } from 'next/router'
import LogoIcon from 'src/views/ui/icons/Logo'

// Styled Components

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const SendSmS = () => {
  // ** Hooks
  const [value, setValue] = useState()
  const [time, setTime] = useState(60)
  const router = useRouter()
  const theme = useTheme()
  useEffect(() => {
    setTimeout(() => {
      if (time > 1) {
        setTime(time - 1)
      } else {
        router.push('/login')
      }
    }, 1000)
  }, [time])
  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogoIcon />
                <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                    Optivora
                </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5, textAlign: 'center' }}>
                {/* <Translations text='Forgot Password?' /> 🔒 */}
              </Typography>
            </Box>

            {/* <TwoStepsSMSLogin phone='' /> */}
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}
SendSmS.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
SendSmS.guestGuard = true
export default SendSmS

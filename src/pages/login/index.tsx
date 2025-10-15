import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LoginWrapper from './LoginWrapper'
import LoginAllPage from 'src/views/pages/login/LoginAll'


const LoginPage = () => {


  return (
    <Box className='content-center'>
      <LoginWrapper>
        <LoginAllPage />
      </LoginWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage

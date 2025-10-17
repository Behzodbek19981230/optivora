// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useAuth } from 'src/hooks/useAuth'
import moment from 'moment'
import { useRouter } from 'next/router'
const Illustration = styled('img')(({ theme }) => ({
  right: 20,
  bottom: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    right: 5,
    width: 110
  }
}))

const EcommerceCongratulationsJohn = () => {
    const {user}=useAuth()
    const router=useRouter()
  return (
    <Card sx={{ position: 'relative',height: '100%' }}>
      <CardContent>
        <Typography variant='h5' sx={{ mb: 0.5 }}>
        Xush kelibsiz {user?.first_name} {user?.last_name}! 🎉
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
            {user?.role} sifatida tizimga muvaffaqiyatli kirdingiz.
        </Typography>
        <Typography variant='h4' sx={{ mb: 0.75, color: 'primary.main' }}>
          {
          moment(user?.date_joined).format('DD.MM.YYYY')
          }
        </Typography>
        <Button variant='contained' onClick={()=>router.push('/cms/users')}>
            Foydalanuvchi qo'shish
        </Button>
        <Illustration width={116} alt='congratulations john' src='/images/cards/congratulations-john.png' />
      </CardContent>
    </Card>
  )
}

export default EcommerceCongratulationsJohn

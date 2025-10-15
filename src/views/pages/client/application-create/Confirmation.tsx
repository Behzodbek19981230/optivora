import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import Translations from 'src/layouts/components/Translations'
import { ApplicationUserType } from 'src/context/types'
import { Alert, Button, ListItemIcon } from '@mui/material'
import { Icon } from '@iconify/react'

type ChangeStep = () => void
interface TwoStepsSMSProps {
  changeStep: ChangeStep
  apiData?: ApplicationUserType
}
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))
const Confirmation = ({ changeStep, apiData }: TwoStepsSMSProps) => {
  const theme = useTheme()
  const [time, setTime] = useState(10)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (time === 0) {
        clearInterval(intervalId)
      } else {
        if (time > 1) {
          setTime(prevCount => prevCount - 1)
        }
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleStep = () => {
    changeStep()
    setTime(10)
  }

  return (
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Img height='150' alt='error-illustration' src='/images/info.svg' style={{ marginTop: 0 }} />
        <Typography sx={{ fontSize: 28, fontWeight: 700, width: '50%', textAlign: 'center' }}>
          <Translations text='Congratulations!' />
        </Typography>

        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 5 }}>
          <Translations text='info_confirmation' />
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, width: '50%', textAlign: 'center' }}>
          <Translations text='applic_' /> № {apiData?.id}
        </Typography>
      </Box>
      {time > 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <ListItemIcon sx={{ mr: 2 }}>
            <Icon icon='tabler:clock' color={theme.palette.primary.main} fontSize='1.5rem' />
          </ListItemIcon>
          <FormHelperText sx={{ color: 'grey', fontSize: theme => theme.typography.body2.fontSize, textAlign: 'end' }}>
            00:{time}
          </FormHelperText>
        </Box>
      ) : (
        ''
      )}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          flexDirection: 'column'
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.grey[500] }}>
          <Translations text='info_conf_waiting' />
        </Typography>
        <Alert severity='warning'>
          <Translations text='info_conf_warning' />
        </Alert>
      </Box>

      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Button variant='contained' onClick={handleStep} disabled={time > 0}>
          <Translations text='Confirm' />
        </Button>
      </Box>
    </CardContent>
  )
}
export default Confirmation

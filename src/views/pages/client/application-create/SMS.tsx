// ** React Imports
import { ReactNode, ChangeEvent, useState, KeyboardEvent, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import Translations from 'src/layouts/components/Translations'
import { LoadingButton } from '@mui/lab'

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 48,
  textAlign: 'center',
  height: '48px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: '',
  val6: ''
}
interface TwoStepsSMSProps {
  onSubmitSMS: (arg: any) => void
  loading: boolean
  onReset: () => void
  text?: string
  times?: number
}

const TwoStepsSMS = ({ onSubmitSMS, loading, onReset, text, times }: TwoStepsSMSProps) => {
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  const errorsArray = Object.keys(errors)
  const [time, setTime] = useState(times ?? 60)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (time === 0) {
        clearInterval(intervalId)
      } else {
        setTime(prevCount => prevCount - 1)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])
  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)
      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }
  const handleReset = () => {
    setTime(60)
    onReset()
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <CardContent sx={{ width: 500, p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant='h4' sx={{ mb: 1.5 }}>
            <Translations text={text ?? 'create_application'} /> 💬
          </Typography>

          {/* <Typography variant='h6'>******9763</Typography> */}
        </Box>
        {/* <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Type your 6 digit security code</Typography> */}
        <form onSubmit={handleSubmit(onSubmitSMS)}>
          <CleaveWrapper
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...(errorsArray.length && {
                '& .invalid:focus': {
                  borderColor: theme => `${theme.palette.error.main} !important`,
                  boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                }
              })
            }}
          >
            {renderInputs()}
          </CleaveWrapper>
          {time > 0 ? (
            <FormHelperText
              sx={{ color: 'error.main', fontSize: theme => theme.typography.body2.fontSize, textAlign: 'end' }}
            >
              00:{time}
            </FormHelperText>
          ) : (
            ''
          )}
          {errorsArray.length ? (
            <FormHelperText sx={{ color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}>
              Please enter a valid OTP
            </FormHelperText>
          ) : null}
          {time > 0 ? (
            <LoadingButton sx={{ mt: 2 }} type='submit' variant='contained' loading={loading}>
              <Translations text='verify_otp' />
            </LoadingButton>
          ) : (
            <LoadingButton sx={{ mt: 2 }} type='button' variant='contained' loading={loading} onClick={handleReset}>
              <Translations text='reset_otp' />
            </LoadingButton>
          )}
        </form>
      </CardContent>
    </Box>
  )
}

TwoStepsSMS.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default TwoStepsSMS

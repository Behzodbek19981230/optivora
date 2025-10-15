import { Avatar, Box, Card, CardContent, Grid, StepLabel, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import { useState, ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputAdornment from '@mui/material/InputAdornment'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'
import { useTranslation } from 'react-i18next'
import { formatCreditCardNumber, formatExpirationDate } from 'src/@core/utils/format'
import Payment from 'payment'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import MuiStep, { StepProps } from '@mui/material/Step'
import MuiStepper, { StepperProps } from '@mui/material/Stepper'
import { CardContentProps } from '@mui/material/CardContent'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Icon } from '@iconify/react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import QRcode from 'src/@core/components/qr-code/QRcode'
import TwoStepsSMS from 'src/views/pages/client/application-create/SMS'
import { LoadingButton } from '@mui/lab'
import { useAuth } from 'src/hooks/useAuth'
import useWebSocket from './useSocket'

export type Focused = 'name' | 'number' | 'expiry' | 'cvc'
interface FormInputs {
  add_phone: string
  owner_phone: string
  close_phone: string
  card: string
  card_expiry: string
}
const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  height: '100%',
  minWidth: '15rem',
  '& .MuiStep-root:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 0
  }
}))

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(6)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))
export default function CreateCardNumber() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [responseOne, setResponseOne] = useState<any>()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [cardNumber, setCardNumber] = useState<string>('')
  const [applicId, setApplicId] = useState<number>()
  const [focus, setFocus] = useState<Focused | undefined>()
  const [expiry, setExpiry] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const schema = yup.object().shape({
    add_phone: yup.string().max(23).required(),
    owner_phone: yup.string().min(10).max(20).required(),
    close_phone: yup.string().min(10).max(20).required(),
    card: yup.string().min(19, 'Card must be at least 12 characters').required()
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { add_phone: '', owner_phone: '', close_phone: '' }
  })

  const steps = [
    {
      title: t('Card_information'),
      icon: 'tabler:credit-card',
      subtitle: ''
    },
    {
      icon: 'tabler:message',
      title: 'SMS',
      subtitle: ''
    },
    {
      title: 'QR code',
      icon: 'tabler:qrcode',
      subtitle: ''
    }
  ]
  const { socket, loadingSocket } = useWebSocket('')

  const onSubmitSMS = async (data: any) => {
    setLoading(true)
    try {
      const res = await DataService.post(endpoints.applicationVerify + `/${responseOne?.application?.id}`, {
        id: responseOne?.otp_id,
        otp: data?.val1 + data?.val2 + data?.val3 + data?.val4 + data?.val5 + data?.val6
      })
      if (res?.data?.statusCode) {
        toast.success(res?.data?.message)
        setApplicId(res?.data?.result?.id)
        handleNext()
      } else {
        toast.error(res?.data?.message)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const onReset = async () => {
    setLoading(true)
    try {
      const res = await DataService.get(endpoints.resendOtp(responseOne?.otp_id))
      if (res?.data?.statusCode) {
        toast.success(res?.data?.message)
        setApplicId(res?.data?.result?.id)
        handleNext()
      } else {
        toast.error(res?.data?.message)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }
  useEffect(() => {
    if (socket) {
      socket.on('update', (update: any) => {
        console.log(update)
      })
    }
  }, [socket])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='owner_phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <ReactInputMask
                        mask='99-999-99-99'
                        disabled={false}
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                      >
                        <CustomTextField
                          fullWidth
                          required
                          // value={value}
                          label={t('owner_phone')}
                          error={Boolean(errors.owner_phone)}
                          {...(errors.owner_phone && { helperText: errors.owner_phone.message })}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                          }}
                        />
                      </ReactInputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='add_phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <ReactInputMask
                        mask='99-999-99-99'
                        disabled={false}
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                      >
                        <CustomTextField
                          fullWidth
                          required
                          // value={value}

                          label={t('add_phone')}
                          error={Boolean(errors.add_phone)}
                          {...(errors.add_phone && { helperText: errors.add_phone.message })}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                          }}
                        />
                      </ReactInputMask>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='close_phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <ReactInputMask
                        mask='99-999-99-99'
                        disabled={false}
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                      >
                        <CustomTextField
                          fullWidth
                          required
                          // value={value}
                          inputProps={register('close_phone', {
                            required: t('field_is_required') as string
                          })}
                          label={t('close_phone')}
                          error={Boolean(errors.close_phone)}
                          {...(errors.close_phone && { helperText: errors.close_phone.message })}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                          }}
                        />
                      </ReactInputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    name='card'
                    value={cardNumber}
                    required
                    autoComplete='off'
                    label={t('card')}
                    inputProps={register('card', {
                      required: t('field_is_required') as string,
                      minLength: {
                        value: 14,
                        message: t('card_min_length') // You can add a translation key for the error message
                      }
                    })}
                    error={Boolean(errors.card)}
                    {...(errors.card && { helperText: errors.card?.message })}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    placeholder='0000 0000 0000 0000'
                    onFocus={e => setFocus(e.target.name as Focused)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    required
                    name='card_expiry'
                    error={Boolean(errors.card_expiry)}
                    {...(errors.card_expiry && { helperText: errors.card_expiry.message })}
                    label={t('card_expiry')}
                    value={expiry}
                    onBlur={handleBlur}
                    placeholder='MM/YY'
                    onChange={handleInputChange}
                    inputProps={{ maxLength: '5' }}
                    onFocus={e => setFocus(e.target.name as Focused)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type='submit' variant='contained' loading={loading}>
                    <Translations text='Save' />
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        )
      case 1:
        return (
          <>
            <TwoStepsSMS onSubmitSMS={onSubmitSMS} loading={loading} onReset={onReset} />
            {renderFooter()}
          </>
        )
      case 2:
        if (applicId) return <QRcode value={applicId as number} />
        else return <></>

      default:
        return null
    }
  }
  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const renderFooter = () => {
    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='tonal'
          color='secondary'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon={theme.direction === 'ltr' ? 'tabler:arrow-left' : 'tabler:arrow-right'} />}
        >
          <Translations text='Cancel' />
        </Button>
        {/* <Button
          variant='contained'
          color={stepCondition ? 'success' : 'primary'}
          onClick={() => (stepCondition ? alert('Submitted..!!') : handleNext())}
          endIcon={
            <Icon
              icon={
                stepCondition ? 'tabler:check' : theme.direction === 'ltr' ? 'tabler:arrow-right' : 'tabler:arrow-left'
              }
            />
          }
        >
          {stepCondition ? 'Submit' : 'Next'}
        </Button> */}
      </Box>
    )
  }
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'card') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'card_expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    }
  }
  const handleBlur = () => setFocus(undefined)
  const auth = useAuth()

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    const add_phone = '998' + data.add_phone?.split('-').join('')
    const close_phone = '998' + data.close_phone?.split('-').join('')
    const owner_phone = '998' + data.owner_phone?.split('-').join('')
    {
      setLoading(false)

      try {
        const res = await DataService.post(endpoints.applicationMerchant, {
          add_phone: add_phone,
          close_phone: close_phone,
          owner_phone: owner_phone,
          card: cardNumber?.split(' ').join(''),
          card_expiry: expiry?.split('/').join('')
        })
        setResponseOne(res?.data?.result)
        toast.success(t('successfull_created'))
        handleNext()
        setLoading(false)
      } catch (error: any) {
        toast.error(error?.error)
        setLoading(false)
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='new_Application' />
          </Typography>
        }
      />
      {/* <WebSocketProvider /> */}
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <StepperHeaderContainer>
          <StepperWrapper sx={{ height: '100%' }}>
            <Stepper
              connector={<></>}
              orientation='vertical'
              activeStep={activeStep}
              sx={{ height: '100%', minWidth: '15rem' }}
            >
              {steps.map((step, index) => {
                const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

                return (
                  <Step
                    key={index}
                    // onClick={() => setActiveStep(index)}
                    sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
                  >
                    <StepLabel>
                      <div className='step-label'>
                        <RenderAvatar
                          variant='rounded'
                          {...(activeStep >= index && { skin: 'light' })}
                          {...(activeStep === index && { skin: 'filled' })}
                          {...(activeStep >= index && { color: 'primary' })}
                          sx={{
                            ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                            ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                          }}
                        >
                          <Icon icon={step.icon} fontSize='1.5rem' />
                        </RenderAvatar>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                          <Typography className='step-subtitle'>{step.subtitle}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </StepperWrapper>
        </StepperHeaderContainer>
        <CardContent
          sx={{
            pt: theme => `${theme.spacing(6)} !important`
            // display: 'flex',
            // width: '100%',
            // justifyContent: 'center'
          }}
        >
          {renderContent()}
        </CardContent>
      </Card>
    </Box>
  )
}

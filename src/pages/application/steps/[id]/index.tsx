import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Alert, Box, Button, Typography, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'
import PageHeader from 'src/@core/components/page-header'
import Identification from 'src/views/pages/client/application-create/Identification'
import CreateStepsLeftBar from 'src/views/pages/client/application-create/create-steps'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { ApplicationInfo, ApplicationUserType } from 'src/context/types'
import Loader from 'src/@core/components/spinner/Loader'
import Scoring from 'src/views/pages/client/application-create/Scoring'
import Decor from 'src/views/pages/client/application-create/Decor'
import Schedule from 'src/views/pages/client/application-create/Schedule'
import Confirmation from 'src/views/pages/client/application-create/Confirmation'
import toast from 'react-hot-toast'
import QRcode from 'src/@core/components/qr-code/QRcode'
import FormModal from 'src/views/components/modals/FormModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import { Roles, StatesEnum, StatusesEnum, otpBillingTypes } from 'src/configs/const'
import TwoStepsSMS from 'src/views/pages/client/application-create/SMS'
import { useAuth } from 'src/hooks/useAuth'
import { LoadingButton } from '@mui/lab'
export default function StepsDetail() {
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const auth = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [apiData, setApidata] = useState<ApplicationUserType>()
  const [status, setStatus] = useState<string>()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [decidedInfo, setDecidedInfo] = useState('')
  const fetchData = async () => {
    const response = await DataService.get(endpoints.applicationGetById(router.query?.id))
    setApidata(response?.data?.result)
    setStatus(response?.data?.result?.status)

    if (response?.data?.result?.b_state == 'current_client_decision') {
      handleDecign()
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const changeStep = (step: string) => {
    setStatus(step)
  }
  const onSubmitSMS = async (data: any) => {
    setLoading(true)
    try {
      const res = await DataService.post(endpoints.applicationOtp, {
        type: apiData?.otp_type,
        id: apiData?.id,
        otp: data?.val1 + data?.val2 + data?.val3 + data?.val4 + data?.val5 + data?.val6
      })
      if (res?.data?.statusCode) {
        toast.success(res?.data?.message)
        fetchData()
      } else {
        toast.error(res?.data?.message)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }
  const onReset = async () => {
    setLoading(true)
    try {
      const res = await DataService.get(
        endpoints.resendOtpApplication(apiData?.id),

        { type: apiData?.otp_type }
      )
      if (res?.data?.statusCode) {
        toast.success(res?.data?.message)
        fetchData()
      } else {
        toast.error(res?.data?.message)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }
  const getElement = (status: any) => {
    {
      switch (status) {
        case StatusesEnum.identification: {
          if (apiData?.state == StatesEnum.failed) {
            return (
              <Box>
                <Alert variant='outlined' severity='error'>
                  {t(apiData?.b_state as string)}
                </Alert>
              </Box>
            )
          } else {
            if (apiData?.otp_type == otpBillingTypes.uzcard && apiData?.is_otp) {
              return <TwoStepsSMS onSubmitSMS={onSubmitSMS} loading={loading} onReset={onReset} />
            } else {
              if (apiData?.is_otp && apiData?.otp_type == otpBillingTypes.current_client) {
                return (
                  <TwoStepsSMS
                    onSubmitSMS={onSubmitSMS}
                    loading={loading}
                    onReset={onReset}
                    text='SMS code for available'
                  />
                )
              } else {
                if (apiData?.is_otp && apiData?.otp_type == otpBillingTypes.davr) {
                  return (
                    <TwoStepsSMS
                      onSubmitSMS={onSubmitSMS}
                      loading={loading}
                      onReset={onReset}
                      text='SMS code for available'
                    />
                  )
                } else return <Identification checkResult={fetchData} />
              }
            }
          }
        }
        case StatusesEnum.scoring:
          return (
            <Scoring
              changeStep={changeStep}
              checkResult={fetchData}
              apiData={apiData as ApplicationUserType & ApplicationInfo}
            />
          )
        case StatusesEnum.approving:
          return <Decor changeStep={changeStep} apiData={apiData as ApplicationUserType} />
        case StatusesEnum.verifying:
          if (apiData?.state == StatesEnum.failed) {
            return (
              <Box>
                <Alert variant='outlined' severity='error'>
                  {t(apiData?.b_state as string)}
                </Alert>
              </Box>
            )
          } else {
            if (apiData?.otp_type == otpBillingTypes.new_client && apiData?.is_otp) {
              return <TwoStepsSMS onSubmitSMS={onSubmitSMS} loading={loading} onReset={onReset} />
            } else {
              if (apiData?.is_otp && apiData?.otp_type == otpBillingTypes.payment) {
                return (
                  <TwoStepsSMS
                    onSubmitSMS={onSubmitSMS}
                    loading={loading}
                    onReset={onReset}
                    text='SMS code for available'
                  />
                )
              } else return <Confirmation changeStep={fetchData} apiData={apiData as ApplicationUserType} />
            }
          }

        case StatusesEnum.scheduling:
          return <Schedule apiData={apiData as ApplicationUserType} />
        case StatusesEnum.open: {
          if (apiData?.otp_type == otpBillingTypes.uzcard && apiData?.is_otp) {
            return <TwoStepsSMS onSubmitSMS={onSubmitSMS} loading={loading} onReset={onReset} />
          } else {
            if (apiData?.is_otp && apiData?.otp_type == otpBillingTypes.new_client) {
              return <TwoStepsSMS onSubmitSMS={onSubmitSMS} loading={loading} onReset={onReset} />
            } else return <QRcode value={apiData?.id as number} />
          }
        }
      }
    }
  }
  const handleDecign = async () => {
    try {
      await DataService.post(endpoints.applicationDecide, {
        application_id: router.query?.id,
        decision: 1
      })
    } catch (err: any) {
      setDecidedInfo('decided_info_for_client')
      toast.error(err?.message)
    }
  }
  const resendContract = async () => {
    try {
      setLoading(true)
      await DataService.get(endpoints.resendContract(Number(router.query?.id)))
    } catch (err: any) {
      toast.error(err?.message)
    }
    setLoading(false)
  }
  const handleSave = async () => {
    try {
      await DataService.put(endpoints.applicationRejectByID(router.query?.id), {
        reject_reason: reason
      })
      try {
        await DataService.post(endpoints.applicationDecide, {
          application_id: router.query?.id,
          decision: 0
        })
      } catch (err: any) {
        toast.error(err.data.message)
      }
      toast.success(t('edited_successfully'))
      setOpen(false)
      setReason('')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='Application' /> {apiData?.id}
          </Typography>
        }
      />
      <FormModal handleClose={() => setOpen(false)} open={open} handleSave={handleSave} title={t('The_client_refused')}>
        <form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              fullWidth
              name='reason'
              rows={3}
              multiline
              id='reason'
              value={reason}
              required
              onChange={e => setReason(e.target.value as string)}
              label={t('Rejection reason') as string}
            />
          </Box>
        </form>
      </FormModal>
      <Card>
        {apiData ? (
          <Grid container spacing={6}>
            <Grid item md={3} xs sx={{ borderRight: 1, borderRightColor: theme.palette.grey[300] }}>
              <CardContent>
                <CreateStepsLeftBar apiData={apiData} currentStatus={status as string} />
                <Button sx={{ my: 5 }} variant='contained' onClick={() => setOpen(true)}>
                  <Translations text='The_client_refused' />
                </Button>
                {(auth?.user?.role == Roles.superuser || auth.user?.role == Roles.manager) && (
                  <Button sx={{ my: 5 }} variant='contained' onClick={handleDecign}>
                    <Translations text='Client_design' />
                  </Button>
                )}
                <LoadingButton loading={loading} sx={{ my: 5 }} variant='contained' onClick={resendContract}>
                  {t('Resend_contract')}
                </LoadingButton>
              </CardContent>
            </Grid>
            <Grid item md={9} xs>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: '100%'
                }}
              >
                {decidedInfo && (
                  <Box>
                    <Alert variant='outlined' severity='warning'>
                      {t(decidedInfo) as string}
                    </Alert>
                  </Box>
                )}
                {getElement(status)}
              </CardContent>
            </Grid>
          </Grid>
        ) : (
          <Loader />
        )}
      </Card>
    </Box>
  )
}

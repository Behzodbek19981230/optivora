import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import { StatusesEnum } from 'src/configs/const'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { ApplicationInfo, ApplicationUserType } from 'src/context/types'
import { useAuth } from 'src/hooks/useAuth'
import Translations from 'src/layouts/components/Translations'
import { CategoryTypes } from 'src/types/dictionaries/ratesType'
type ChangeStep = (text: string) => void
type CheckResult = () => void
export default function Scoring({
  changeStep,
  checkResult,
  apiData
}: {
  changeStep: ChangeStep
  checkResult: CheckResult
  apiData: ApplicationUserType & ApplicationInfo
}) {
  const theme = useTheme()
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
  const auth = useAuth()
  const { t } = useTranslation()
  const [limitData, setLimitData] = useState([])
  const [loading, setLoading] = useState(false)
  const [categoryType, setCategoryType] = useState<string>(apiData?.categoryType as string)
  const handleStep = async () => {
    try {
      setLoading(true)
      await DataService.put(endpoints.applicationById(apiData.id as number), { categoryType })
      await checkResult()
      setLoading(false)
      changeStep(StatusesEnum.approving)
    } catch (e: any) {
      toast.error(e?.message)
    }
  }
  const fetchData = async () => {
    try {
      const data = await DataService.get(endpoints.limitData, {
        modelId: auth.user?.merchant?.id ?? auth.user?.branch?.id,
        modelName: auth.user?.merchant ? 'merchant' : 'branch',
        summ: apiData?.limit_amount,
        categoryType: categoryType
      })
      setLimitData(data.data?.result)
    } catch (error) {
      toast.error(t('error'))
    }
  }
  useEffect(() => {
    fetchData()
  }, [categoryType])
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Img height='150' alt='error-illustration' src='/images/info.svg' style={{ marginTop: 0 }} />
        <Typography sx={{ fontSize: 28, fontWeight: 700, width: '50%', textAlign: 'center' }}>
          <Translations text='Congratulations' />
        </Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700, width: '50%', textAlign: 'center', mb: 10 }}>
          <Translations text='Your limit has been approved.' />
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 10 }}>
          <Translations text={`application_approved`} /> № {apiData?.id}{' '}
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
          <Translations text='approved_limit' />:
          <CurrencyFormatter amount={apiData?.limit_amount} currency='sum' size={30} />
        </Typography>

        <FormControlLabel
          disabled={limitData.length == 0}
          onChange={(e: any) => setCategoryType(e.target?.checked ? 'A' : 'B')}
          control={<Switch defaultChecked={categoryType == 'A'} />}
          label={categoryType}
        />
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '320px',
            margin: 'auto',
            my: 3
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            <Translations text='Preliminary_limit_amount_for_goods' />
          </Typography>
          <Box sx={{ borderBottom: '1px solid #E0E0E0', marginBottom: '8px' }} />
          <Grid container direction='column' spacing={2}>
            {limitData?.map((item: { period: number; value: number }, index) => (
              <Grid item key={index} container alignItems='center' justifyContent='space-between'>
                <Grid item sx={{ display: 'flex', gap: 2 }}>
                  <Icon icon='tabler:calendar-event' color={theme.palette.primary.main} fontSize={20} />

                  <Typography>
                    {item.period} <Translations text='month' />
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    <CurrencyFormatter amount={item.value} size={20} currency='sum' />
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {apiData?.status == StatusesEnum.scoring ? (
        <Button variant='contained' onClick={checkResult}>
          <Translations text='Check' />
        </Button>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton variant='contained' onClick={handleStep} loading={loading}>
            <Translations text='Next' /> <Icon icon='tabler:arrow-right' />
          </LoadingButton>
        </Box>
      )}
    </CardContent>
  )
}

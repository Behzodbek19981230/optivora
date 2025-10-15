// ** React Imports
import { MenuItem } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { default as CustomTextField } from 'src/@core/components/mui/text-field'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}
interface Data {
  year: string
  month: string
  marketing: string
  server_expenses: string
  system_improvement: string
  pht_taxes: string
  bonuses_managers: string
  office_rental: string
  tech_support: string
  other_admin_expenses: string
  bonuses_agents: string
  company_taxes: string
  forecast: string
}

const initialData: Data = {
  year: '',
  month: '',
  marketing: '',
  server_expenses: '',
  system_improvement: '',
  pht_taxes: '',
  bonuses_agents: '',
  office_rental: '',
  tech_support: '',
  other_admin_expenses: '',
  bonuses_managers: '',
  company_taxes: '',
  forecast: ''
}

const ReportCreate = () => {
  // ** State
  const router = useRouter()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Data>(initialData)
  const defaultValues = {
    year: '',
    month: '',
    marketing: '',
    server_expenses: '',
    system_improvement: '',
    pht_taxes: '',
    bonuses_agents: '',
    office_rental: '',
    tech_support: '',
    other_admin_expenses: '',
    bonuses_managers: '',
    company_taxes: '',
    forecast: ''
  }
  const months = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' }
  ]
  let years = []
  for (let i = 0; i < 20; i++) {
    years.push({ id: i, name: Number(new Date().getFullYear()) - i })
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = async () => {
    try {
      await DataService.post(endpoints.reportsExpense, formData)
      setFormData(initialData)
      reset()
      toast.success(t('Report_added_successfully'))
    } catch (error) {
      toast.error(t('Something_went_wrong'))
      console.error(error)
    }
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    console.log(field)
    if (field != 'month' && field != 'year') setFormData({ ...formData, [field]: parseFloat(value) * 100 })
    else setFormData({ ...formData, [field]: value })
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='Add_report' />
          </Typography>
        }
      />
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <DatePickerWrapper>
                <Grid container spacing={4}>
                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      select
                      focused
                      color='primary'
                      SelectProps={{
                        MenuProps
                      }}
                      inputProps={register('month', {
                        required: 'Please enter marketing'
                      })}
                      onChange={e => handleFormChange('month', e.target.value)}
                      error={Boolean(errors.month)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.month && { helperText: t('field_is_required') })}
                    >
                      <MenuItem disabled>
                        <Translations text='month' />
                      </MenuItem>
                      {months.map((item: any) => (
                        <MenuItem id={item.id} value={item.id}>
                          {t(item.name)}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      select
                      focused
                      inputProps={register('year', {
                        required: 'Please enter marketing'
                      })}
                      onChange={e => handleFormChange('year', e.target.value)}
                      color='primary'
                      SelectProps={{
                        MenuProps
                      }}
                      error={Boolean(errors.year)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.year && { helperText: t('field_is_required') })}
                    >
                      <MenuItem disabled>
                        <Translations text='year' />
                      </MenuItem>
                      {years.map((item: any) => (
                        <MenuItem id={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Marketing' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('marketing', {
                        required: 'Please enter marketing'
                      })}
                      placeholder={t('Marketing') as string}
                      onChange={e => handleFormChange('marketing', e.target.value)}
                      error={Boolean(errors.marketing)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.marketing && { helperText: t('field_is_required') })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Server_expenses' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('server_expenses', {
                        required: 'Please enter server_expenses'
                      })}
                      placeholder={t('Server_expenses') as string}
                      onChange={e => handleFormChange('server_expenses', e.target.value)}
                      error={Boolean(errors.server_expenses)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.server_expenses && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='System_improvement' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('system_improvement', {
                        required: 'Please enter system_improvement'
                      })}
                      placeholder={t('System_improvement') as string}
                      onChange={e => handleFormChange('system_improvement', e.target.value)}
                      error={Boolean(errors.system_improvement)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.system_improvement && { helperText: t('field_is_required') })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Pht_taxes' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('pht_taxes', {
                        required: 'Please enter pht_taxes'
                      })}
                      placeholder={t('Pht_taxes') as string}
                      onChange={e => handleFormChange('pht_taxes', e.target.value)}
                      error={Boolean(errors.pht_taxes)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.pht_taxes && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Bonuses_agents' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('bonuses_agents', {
                        required: 'Please enter bonuses_agents'
                      })}
                      placeholder={t('Bonuses_agents') as string}
                      onChange={e => handleFormChange('bonuses_agents', e.target.value)}
                      error={Boolean(errors.bonuses_agents)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.bonuses_agents && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Office_rental' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('office_rental', {
                        required: 'Please enter office_rental'
                      })}
                      placeholder={t('Office_rental') as string}
                      onChange={e => handleFormChange('office_rental', e.target.value)}
                      error={Boolean(errors.office_rental)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.office_rental && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Tech_support' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('tech_support', {
                        required: 'Please enter tech_support'
                      })}
                      placeholder={t('Tech_support') as string}
                      onChange={e => handleFormChange('tech_support', e.target.value)}
                      error={Boolean(errors.tech_support)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.tech_support && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Other_admin_expenses' />
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('other_admin_expenses', {
                        required: 'Please enter other_admin_expenses'
                      })}
                      placeholder={t('Other_admin_expenses') as string}
                      onChange={e => handleFormChange('other_admin_expenses', e.target.value)}
                      error={Boolean(errors.other_admin_expenses)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.other_admin_expenses && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Bonuses_managers' />
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('bonuses_managers', {
                        required: 'Please enter bonuses_managers'
                      })}
                      placeholder={t('Bonuses_managers') as string}
                      onChange={e => handleFormChange('bonuses_managers', e.target.value)}
                      error={Boolean(errors.bonuses_managers)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.bonuses_managers && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Company_taxes' />
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('company_taxes', {
                        required: 'Please enter company_taxes'
                      })}
                      placeholder={t('Company_taxes') as string}
                      onChange={e => handleFormChange('company_taxes', e.target.value)}
                      error={Boolean(errors.company_taxes)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.company_taxes && { helperText: t('field_is_required') })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <Translations text='Forecast_manually' />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      inputProps={register('forecast', {
                        required: 'Please enter forecast'
                      })}
                      placeholder={t('Forecast_manually') as string}
                      onChange={e => handleFormChange('forecast', e.target.value)}
                      error={Boolean(errors.forecast)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.forecast && { helperText: t('field_is_required') })}
                    />
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 5 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
                      <Button variant='contained' sx={{ mr: 4 }} type='submit'>
                        <Translations text='Save' />
                      </Button>
                      <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                        <Translations text='Reset' />
                      </Button>
                      <Button variant='tonal' color='secondary' onClick={() => router.back()}>
                        <Translations text='Cancel' />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </DatePickerWrapper>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReportCreate

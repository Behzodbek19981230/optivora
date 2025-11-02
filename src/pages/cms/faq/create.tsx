import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import toast from 'react-hot-toast'
import { Faq } from 'src/types/faq'

const defaultValues: Partial<Faq> = {
  question: '',
  question_en: '',
  question_uz: '',
  question_ru: '',
  question_lt: '',
  answer: '',
  answer_en: '',
  answer_uz: '',
  answer_ru: '',
  answer_lt: '',
  order_index: 0
}

const FaqCreatePage = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({ defaultValues })

  const onSubmit = async (values: any) => {
    try {
      await DataService.post(endpoints.faqs, values)
      toast.success('FAQ muvaffaqiyatli qo‘shildi!')
      router.push('/cms/faq')
    } catch (e) {
      toast.error('FAQ qo‘shishda xatolik!')
    }
  }

  return (
    <Card>
      <CardHeader title='Yangi FAQ qo‘shish' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Controller
                name='question_uz'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <CustomTextField fullWidth label='Savol (UZ)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='question_en'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Savol (EN)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='question_ru'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Savol (RU)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='question_lt'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Savol (LT)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='question'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Savol (DEFAULT)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='answer_uz'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Javob (UZ)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='answer_en'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Javob (EN)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='answer_ru'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Javob (RU)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='answer_lt'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Javob (LT)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='answer'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Javob (DEFAULT)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='order_index'
                control={control}
                render={({ field }) => (
                  <CustomTextField fullWidth type='number' label='Tartib raqami' {...field} inputProps={{ min: 0 }} />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            {isSubmitting ? 'Saqlanmoqda…' : 'Saqlash'}
          </Button>
          <Button
            type='button'
            variant='tonal'
            color='secondary'
            onClick={() => router.push('/cms/faq')}
            style={{ marginLeft: 16 }}
          >
            Bekor qilish
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

FaqCreatePage.acl = { action: 'create', subject: 'cms' }
FaqCreatePage.authGuard = true

export default FaqCreatePage

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
import { NewsPost } from 'src/types/news-post'
import { MenuItem } from '@mui/material'
const defaultValues: Partial<NewsPost> = {
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  body: '',
  cover_image: '',
  status: 'draft',
}
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' }
]
const CATEGORY_OPTIONS = [
  { value: 'project_updates', label: 'Project Updates' },
  { value: 'industry_news', label: 'Industry News' },
  { value: 'company_announcements', label: 'Company Announcements' }
]
const NewsEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { control, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm({ defaultValues })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      DataService.get(`${endpoints.news}/${id}`).then((res: any) => {
        reset({ ...res.data, cover_image: '' })
        if (typeof res.data.cover_image === 'string') setImagePreview(process.env.NEXT_PUBLIC_BASE_URL + res.data.cover_image)
      })
    }
  }, [id, reset])

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('cover_image', file as any)
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: any) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'cover_image' && value) {
        formData.append('cover_image', value as File)
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    try {
      await DataService.putForm(`${endpoints.news}/${id}`, formData)
      toast.success('Yangilik muvaffaqiyatli yangilandi!')
      router.push('/cms/news')
    } catch (e) {
      toast.error('Yangilikni yangilashda xatolik!')
    }
  }

  return (
    <Card>
      <CardHeader title='Yangilikni tahrirlash' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Controller name='title' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Sarlavha' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='slug' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Slug' {...field} />} />
            </Grid>
         <Grid item xs={12} md={6}>
              <Controller
                name='category'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Kategoriya'
                    {...field}
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Status'
                    {...field}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller name='excerpt' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqacha' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12}>
              <Controller name='body' control={control} render={({ field }) => <CustomTextField fullWidth label='To‘liq matn' multiline minRows={4} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label style={{ display: 'block', marginBottom: 8 }}>Cover rasm:</label>
              <input type='file' accept='image/*' onChange={onImageChange} />
              {imagePreview && (
                <div style={{ marginTop: 8 }}>
                  <img src={ imagePreview} alt='cover preview' style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8 }} />
                </div>
              )}
            </Grid>
           
          </Grid>
        </CardContent>
        <CardContent>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            {isSubmitting ? 'Saqlanmoqda…' : 'Saqlash'}
          </Button>
          <Button type='button' variant='tonal' color='secondary' onClick={() => router.push('/cms/news')} style={{ marginLeft: 16 }}>
            Bekor qilish
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

NewsEditPage.acl = { action: 'update', subject: 'cms' }
NewsEditPage.authGuard = true

export default NewsEditPage

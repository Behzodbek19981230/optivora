import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import { useForm, Controller } from 'react-hook-form'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useFetchList } from 'src/hooks/useFetchList'
import { Industry, EquipmentCategory, Partner } from 'src/types/cms'
import toast from 'react-hot-toast'

type ProjectFormValues = {
  industries: number[]
  equipment_categories: number[]
  partners: number[]
  title: string
  title_en: string
  title_uz: string
  title_ru: string
  title_lt: string
  slug: string
  year: number
  scope: string
  scope_en: string
  scope_uz: string
  scope_ru: string
  scope_lt: string
  summary: string
  summary_en: string
  summary_uz: string
  summary_ru: string
  summary_lt: string
  featured_image: File | null
  is_featured: boolean
  order_index: number
  country: string
  region: string
  district: string
}

const defaultValues: ProjectFormValues = {
  industries: [],
  partners: [],
  title: '',
  title_en: '',
  title_uz: '',
  title_ru: '',
  title_lt: '',

  slug: '',
  year: new Date().getFullYear(),
  scope: '',
  scope_en: '',
  scope_uz: '',
  scope_ru: '',
  scope_lt: '',
  summary: '',
  summary_en: '',
  summary_uz: '',
  summary_ru: '',
  summary_lt: '',
  featured_image: null,
  is_featured: false,
  order_index: 0,
  country: '',
  region: '',
  district: '',
  equipment_categories: []
}

const ProjectCreatePage = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting }
  } = useForm({ defaultValues })

  const { data: industries = [] } = useFetchList<Industry>(endpoints.industries, { perPage: 100 })
  const { data: equipmentCategories = [] } = useFetchList<EquipmentCategory>(endpoints.equipmentCategories, {
    perPage: 100
  })
  const { data: partners = [] } = useFetchList<Partner>(endpoints.partners, { perPage: 100 })
  const { data: countries = [] } = useFetchList<any>('/country', { perPage: 100 })
  const { data: regions = [] } = useFetchList<any>('/region', { perPage: 100, country: watch('country') })
  const { data: districts = [] } = useFetchList<any>('/district', { perPage: 100, region: watch('region') })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('featured_image', file ?? null)
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: any) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'featured_image' && value) {
        formData.append('featured_image', value as File)
      } else if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, String(v)))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    try {
      await DataService.postForm(endpoints.projects, formData)
      toast.success('Loyiha muvaffaqiyatli qo‘shildi!')
      router.push('/cms/projects')
    } catch (e) {
      toast.error('Loyihani qo‘shishda xatolik!')
    }
  }

  return (
    <Card>
      <CardHeader title='Yangi loyiha qo‘shish' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Controller
                name='title_en'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Nomi (EN)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='title_uz'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Nomi (UZ)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='title_ru'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Nomi (RU)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='title_lt'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Nomi (LT)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='slug'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <CustomTextField fullWidth label='Slug' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='year'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    label='Yil'
                    {...field}
                    inputProps={{ min: 1900, max: 2100 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='scope_en'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (EN)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='scope_uz'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (UZ)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='scope_ru'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (RU)' {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='scope_lt'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (LT)' {...field} />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='summary_en'
                control={control}
                render={({ field }) => (
                  <CustomTextField fullWidth label='Qisqacha ma’lumot (EN)' multiline minRows={2} {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='summary_uz'
                control={control}
                render={({ field }) => (
                  <CustomTextField fullWidth label='Qisqacha ma’lumot (UZ)' multiline minRows={2} {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='summary_ru'
                control={control}
                render={({ field }) => (
                  <CustomTextField fullWidth label='Qisqacha ma’lumot (RU)' multiline minRows={2} {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='summary_lt'
                control={control}
                render={({ field }) => (
                  <CustomTextField fullWidth label='Qisqacha ma’lumot (LT)' multiline minRows={2} {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label style={{ display: 'block', marginBottom: 8 }}>Asosiy rasm:</label>
              <input type='file' accept='image/*' onChange={onImageChange} />
              {imagePreview && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={imagePreview}
                    alt='featured preview'
                    style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8 }}
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='is_featured'
                control={control}
                render={({ field }) => (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type='checkbox' checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    Asosiy loyiha
                  </label>
                )}
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
            <Grid item xs={12} md={6}>
              <Controller<any, 'industries'>
                name='industries'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={industries}
                    getOptionLabel={option => option.name_uz || option.name || ''}
                    value={industries.filter(i => (field.value as number[] | undefined)?.includes(i.id))}
                    onChange={(_, value) => field.onChange(value.map(v => v.id))}
                    renderInput={params => <CustomTextField {...params} label='Sanoat turlari' />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <span {...getTagProps({ index })}>{option.name_uz || option.name}</span>
                      ))
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='equipment_categories'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={equipmentCategories}
                    getOptionLabel={option => option.name_uz || option.name_en || ''}
                    value={equipmentCategories.filter(i => (field.value as number[] | undefined)?.includes(i.id))}
                    onChange={(_, value) => field.onChange(value.map(v => v.id))}
                    renderInput={params => <CustomTextField {...params} label='Jihoz kategoriyalari' />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <span {...getTagProps({ index })}>{option.name_uz || option.name_en}</span>
                      ))
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='partners'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={partners}
                    getOptionLabel={option => option.name_uz || option.name || ''}
                    value={partners.filter(i => (field.value as number[] | undefined)?.includes(i.id))}
                    onChange={(_, value) => field.onChange(value.map(v => v.id))}
                    renderInput={params => <CustomTextField {...params} label='Hamkorlar' />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <span {...getTagProps({ index })}>{option.name_uz || option.name}</span>
                      ))
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Mamlakat' {...field} value={field.value || ''}>
                    {countries.map((country: any) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name_uz || country.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name='region'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Viloyat' {...field} value={field.value || ''}>
                    {regions.map((region: any) => (
                      <MenuItem key={region.id} value={region.id}>
                        {region.name_uz || region.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name='district'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Tuman' {...field} value={field.value || ''}>
                    {districts.map((district: any) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name_uz || district.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
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
            onClick={() => router.push('/cms/projects')}
            style={{ marginLeft: 16 }}
          >
            Bekor qilish
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

ProjectCreatePage.acl = { action: 'create', subject: 'cms' }
ProjectCreatePage.authGuard = true

export default ProjectCreatePage

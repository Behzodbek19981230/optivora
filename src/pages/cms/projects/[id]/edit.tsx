import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import { useForm, Controller, FieldValues, UseFormSetValue } from 'react-hook-form'
import ProjectDeliverableTable from 'src/views/cms/projects/ProjectDeliverableTable'
import ProjectImageGallery from 'src/views/cms/projects/ProjectImageGallery'
import { useProjectDeliverables } from 'src/views/cms/projects/hooks/useProjectDeliverables'
import { useProjectImages } from 'src/views/cms/projects/hooks/useProjectImages'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useFetchList } from 'src/hooks/useFetchList'
import toast from 'react-hot-toast'

const defaultValues = {
  industries: [],
  equipment_categories: [],
  partners: [],
  title: '',
  title_en: '',
  title_uz: '',
  title_ru: '',
  slug: '',
  year: new Date().getFullYear(),
  scope: '',
  scope_en: '',
  scope_uz: '',
  scope_ru: '',
  summary: '',
  summary_en: '',
  summary_uz: '',
  summary_ru: '',
  featured_image: null,
  is_featured: false,
  order_index: 0,
  country: '',
  region: '',
  district: ''
}

const ProjectEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const projectId = Number(id) || 0
  const deliverables = useProjectDeliverables(projectId)
  const images = useProjectImages(projectId)
  const { control, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm({ defaultValues })

  const { data: industries = [] } = useFetchList<any>(endpoints.industries, { perPage: 100 })
  const { data: equipmentCategories = [] } = useFetchList<any>(endpoints.equipmentCategories, { perPage: 100 })
  const { data: partners = [] } = useFetchList<any>(endpoints.partners, { perPage: 100 })
  const { data: countries = [] } = useFetchList<any>('/country', { perPage: 100 })
  const { data: regions = [] } = useFetchList<any>('/region', { perPage: 100, country: watch('country') })
  const { data: districts = [] } = useFetchList<any>('/district', { perPage: 100, region: watch('region') })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      DataService.get(`${endpoints.projects}/${id}`).then((res: any) => {
        reset({ ...res.data, featured_image: null })
        if (typeof res.data.featured_image === 'string') setImagePreview(res.data.featured_image)
      })
    }
  }, [id, reset])

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
  setValue('featured_image', file as any)
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
      await DataService.putForm(`${endpoints.projects}/${id}`, formData)
      toast.success('Loyiha muvaffaqiyatli yangilandi!')
      router.push('/cms/projects')
    } catch (e) {
      toast.error('Loyihani yangilashda xatolik!')
    }
  }

  return (
    <Card>
      <CardHeader title='Loyihani tahrirlash' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={4}>
          
            <Grid item xs={12} md={6}>
              <Controller name='title_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='title_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='title_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (RU)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='slug' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Slug' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='year' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Yil' {...field} inputProps={{ min: 1900, max: 2100 }} />} />
            </Grid>
          
            <Grid item xs={12} md={6}>
              <Controller name='scope_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='scope_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='scope_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi (RU)' {...field} />} />
            </Grid>
          
            <Grid item xs={12} md={6}>
              <Controller name='summary_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqacha ma’lumot (EN)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='summary_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqacha ma’lumot (UZ)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='summary_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqacha ma’lumot (RU)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label style={{ display: 'block', marginBottom: 8 }}>Asosiy rasm:</label>
              <input type='file' accept='image/*' onChange={onImageChange} />
              {imagePreview && (
                <div style={{ marginTop: 8 }}>
                  <img src={process.env.NEXT_PUBLIC_BASE_URL+imagePreview} alt='featured preview' style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='is_featured' control={control} render={({ field }) => (
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type='checkbox' checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  Asosiy loyiha
                </label>
              )} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='order_index' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Tartib raqami' {...field} inputProps={{ min: 0 }} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='industries'
                control={control}
                render={({ field }) => {
                  // @ts-ignore
                  return (
                    <Autocomplete<any, true, false, false>
                      multiple
                      options={industries as any[]}
                      getOptionLabel={(option: any) => option.name_uz || option.name || ''}
                      value={Array.isArray(field.value) ? (industries.filter((i: any) => (field.value as number[]).includes(i.id)) as any[]) : []}
                      onChange={(_, value: any[]) => field.onChange(value.map((v: any) => v.id))}
                      renderInput={params => <CustomTextField {...params} label='Sanoat turlari' />}
                      renderTags={(value: any[], getTagProps: any) =>
                        value.map((option, index) => (
                          <span {...getTagProps({ index })}>{option.name_uz || option.name}</span>
                        ))
                      }
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='equipment_categories'
                control={control}
                render={({ field }) => {
                  // @ts-ignore
                  return (
                    <Autocomplete<any, true, false, false>
                      multiple
                      options={equipmentCategories as any[]}
                      getOptionLabel={(option: any) => option.name_uz || option.name_en || ''}
                      value={Array.isArray(field.value) ? (equipmentCategories.filter((i: any) => (field.value as number[]).includes(i.id)) as any[]) : []}
                      onChange={(_, value: any[]) => field.onChange(value.map((v: any) => v.id))}
                      renderInput={params => <CustomTextField {...params} label='Jihoz kategoriyalari' />}
                      renderTags={(value: any[], getTagProps: any) =>
                        value.map((option, index) => (
                          <span {...getTagProps({ index })}>{option.name_uz || option.name_en}</span>
                        ))
                      }
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='partners'
                control={control}
                render={({ field }) => {
                  // @ts-ignore
                  return (
                    <Autocomplete<any, true, false, false>
                      multiple
                      options={partners as any[]}
                      getOptionLabel={(option: any) => option.name_uz || option.name || ''}
                      value={Array.isArray(field.value) ? (partners.filter((i: any) => (field.value as number[]).includes(i.id)) as any[]) : []}
                      onChange={(_, value: any[]) => field.onChange(value.map((v: any) => v.id))}
                      renderInput={params => <CustomTextField {...params} label='Hamkorlar' />}
                      renderTags={(value: any[], getTagProps: any) =>
                        value.map((option, index) => (
                          <span {...getTagProps({ index })}>{option.name_uz || option.name}</span>
                        ))
                      }
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='country' control={control} render={({ field }) => (
                <CustomTextField select fullWidth label='Mamlakat' {...field} value={field.value || ''}>
                  {countries.map((country: any) => (
                    <MenuItem key={country.id} value={country.id}>{country.name_uz || country.name}</MenuItem>
                  ))}
                </CustomTextField>
              )} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='region' control={control} render={({ field }) => (
                <CustomTextField select fullWidth label='Viloyat' {...field} value={field.value || ''}>
                  {regions.map((region: any) => (
                    <MenuItem key={region.id} value={region.id}>{region.name_uz || region.name}</MenuItem>
                  ))}
                </CustomTextField>
              )} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='district' control={control} render={({ field }) => (
                <CustomTextField select fullWidth label='Tuman' {...field} value={field.value || ''}>
                  {districts.map((district: any) => (
                    <MenuItem key={district.id} value={district.id}>{district.name_uz || district.name}</MenuItem>
                  ))}
                </CustomTextField>
              )} />
            </Grid>
          </Grid>
  </CardContent>
        <CardContent>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            {isSubmitting ? 'Saqlanmoqda…' : 'Saqlash'}
          </Button>
          <Button type='button' variant='tonal' color='secondary' onClick={() => router.push('/cms/projects')} style={{ marginLeft: 16 }}>
            Bekor qilish
          </Button>
        </CardContent>

        {/* Deliverables and Gallery only if projectId is valid */}
        {projectId > 0 && (
          <>
            <ProjectDeliverableTable
              projectId={projectId}
              items={deliverables.items}
              onAdd={deliverables.add}
              onDelete={deliverables.remove}
            />
            <ProjectImageGallery
              projectId={projectId}
              items={images.items}
              onAdd={images.add}
              onDelete={images.remove}
            />
          </>
        )}
      </form>
    </Card>
  )
}

ProjectEditPage.acl = { action: 'update', subject: 'cms' }
ProjectEditPage.authGuard = true

export default ProjectEditPage

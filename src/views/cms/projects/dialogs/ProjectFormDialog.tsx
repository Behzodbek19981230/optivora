import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useFetchList } from 'src/hooks/useFetchList'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { Project, ProjectCreate, ProjectUpdate, Industry, EquipmentCategory, Partner } from 'src/types/cms'

export type FormValues = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'featured_image' | 'year'>
  & {
    featured_image?: File | string | null
    title_en?: string
    title_uz?: string
    title_ru?: string
    scope?: string
    scope_en?: string
    scope_uz?: string
    scope_ru?: string
    summary?: string
    summary_en?: string
    summary_uz?: string
    summary_ru?: string
    year?: number
    country?: number
    region?: number
    district?: number
  }

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  mode: 'create' | 'edit'
  item?: Project | null
}

const defaultValues: FormValues = {
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
  description: '',
  description_en: '',
  description_uz: '',
  description_ru: '',
  client: '',
  featured_image: null,
  is_featured: false,
  order_index: 0,
  industries: [],
  equipment_categories: [],
  partners: [],
  country: 0,
  region: 0,
  district: 0,
  sector: '',
  services: []
}

const ProjectFormDialog = ({ open, onClose, onSaved, mode, item }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<FormValues>({ defaultValues })

  const { data: industries } = useFetchList<Industry>(endpoints.industries, { perPage: 100 })
  const { data: equipmentCategories } = useFetchList<EquipmentCategory>(endpoints.equipmentCategories, { perPage: 100 })
  const { data: partners } = useFetchList<Partner>(endpoints.partners, { perPage: 100 })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' && item) {
      reset({ ...item, featured_image: null })
      setImagePreview(typeof item.featured_image === 'string' ? item.featured_image : null)
    } else if (mode === 'create') {
      reset(defaultValues)
      setImagePreview(null)
    }
  }, [mode, item, reset])

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('featured_image', file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (values: FormValues) => {
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
    if (mode === 'create') {
      await DataService.postForm(endpoints.projects, formData)
    } else if (mode === 'edit' && item) {
      await DataService.putForm(endpoints.projectById(item.id), formData)
    }
    onSaved()
    onClose()
  }

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth='md'>
      <DialogTitle>{mode === 'create' ? 'Loyiha qo‘shish' : 'Loyihani tahrirlash'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Controller name='title' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Nomi' {...field} />} />
            </Grid>
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
              <Controller name='scope' control={control} render={({ field }) => <CustomTextField fullWidth label='Loyiha doirasi' {...field} />} />
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
            <Grid item xs={12}>
              <Controller name='summary' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqacha ma’lumot' multiline minRows={2} {...field} />} />
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
                  <img src={imagePreview} alt='featured preview' style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8 }} />
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
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={industries || []}
                    getOptionLabel={option => option.name_uz || option.name || ''}
                    value={industries?.filter(i => field.value?.includes(i.id)) || []}
                    onChange={(_, value) => field.onChange(value.map(v => v.id))}
                    renderInput={params => <CustomTextField {...params} label='Sanoat turlari' />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option.name_uz || option.name} {...getTagProps({ index })} />
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
                    options={equipmentCategories || []}
                    getOptionLabel={option => option.name_uz || option.name_en || ''}
                    value={equipmentCategories?.filter(i => field.value?.includes(i.id)) || []}
                    onChange={(_, value) => field.onChange(value.map(v => v.id))}
                    renderInput={params => <CustomTextField {...params} label='Jihoz kategoriyalari' />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option.name_uz || option.name_en} {...getTagProps({ index })} />
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
                    options={partners || []}
                    getOptionLabel={option => option.name_uz || option.name || ''}
                    value={partners?.filter(i => field.value?.includes(i.id)) || []}
                    onChange={(_, value) => field.onChange(value.map(v => v.id))}
                    renderInput={params => <CustomTextField {...params} label='Hamkorlar' />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option.name_uz || option.name} {...getTagProps({ index })} />
                      ))
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='country' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Mamlakat ID' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='region' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Viloyat ID' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='district' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Tuman ID' {...field} />} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type='button' variant='tonal' color='secondary' onClick={onClose} disabled={isSubmitting}>
            Bekor qilish
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saqlanmoqda…' : 'Saqlash'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProjectFormDialog

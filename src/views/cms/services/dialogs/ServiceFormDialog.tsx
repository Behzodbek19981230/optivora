import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Service, ServiceCreate, ServiceUpdate, Industry, EquipmentCategory } from 'src/types/cms'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import CustomTextField from 'src/@core/components/mui/text-field'
import { useFetchList } from 'src/hooks/useFetchList'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import toast from 'react-hot-toast'

export type FormValues = Omit<Service, 'id' | 'created_at' | 'updated_at' | 'icon'> & { icon?: File | string | null }

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  mode: 'create' | 'edit'
  item?: Service | null
}

const defaultValues: FormValues = {
  name: '',
  name_en: '',
  name_uz: '',
  name_ru: '',
  slug: '',
  short_description: '',
  short_description_en: '',
  short_description_uz: '',
  short_description_ru: '',
  description: '',
  description_en: '',
  description_uz: '',
  description_ru: '',
  icon: null,
  industries: [],
  equipment_categories: [],
  order_index: 0
}

const ServiceFormDialog = ({ open, onClose, onSaved, mode, item }: Props) => {
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

  const [iconPreview, setIconPreview] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' && item) {
      reset({ ...item, icon: null })
      setIconPreview(typeof item.icon === 'string' ? item.icon : null)
    } else if (mode === 'create') {
      reset(defaultValues)
      setIconPreview(null)
    }
  }, [mode, item, reset])

  const onIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('icon', file)
    if (file) {
      setIconPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'icon' && value) {
        formData.append('icon', value as File)
      } else if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, String(v)))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    try{
    if (mode === 'create') {
      await DataService.postForm(endpoints.services, formData)
    } else if (mode === 'edit' && item) {
      await DataService.putForm(endpoints.serviceById(item.id), formData)
    }
    onSaved()
    onClose()
}
    catch(error){
      console.error('Failed to save service:', error)
      toast.error('Xizmatni saqlashda xatolik yuz berdi')
    }

  }

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth='md'>
      <DialogTitle>{mode === 'create' ? 'Xizmat qo‘shish' : 'Xizmatni tahrirlash'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={4}>
           
            <Grid item xs={12} md={6}>
              <Controller name='name_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='name_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='name_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (RU)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='slug' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Slug' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='order_index' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Tartib raqami' {...field} inputProps={{ min: 0 }} />} />
            </Grid>
          
            <Grid item xs={12} md={6}>
              <Controller name='short_description_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqa tavsif (EN)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='short_description_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqa tavsif (UZ)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='short_description_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Qisqa tavsif (RU)' multiline minRows={2} {...field} />} />
            </Grid>
           
            <Grid item xs={12} md={6}>
              <Controller name='description_en' control={control} render={({ field }) => <CustomTextField fullWidth label='To‘liq tavsif (EN)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='description_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='To‘liq tavsif (UZ)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='description_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='To‘liq tavsif (RU)' multiline minRows={2} {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label style={{ display: 'block', marginBottom: 8 }}>Icon (rasm):</label>
              <input type='file' accept='image/*' onChange={onIconChange} />
              {iconPreview && (
                <div style={{ marginTop: 8 }}>
                  <img src={iconPreview} alt='icon preview' style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8 }} />
                </div>
              )}
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

export default ServiceFormDialog

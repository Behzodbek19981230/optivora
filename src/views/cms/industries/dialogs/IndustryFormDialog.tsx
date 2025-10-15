import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Industry, IndustryCreate, IndustryUpdate } from 'src/types/cms'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import DialogCloseButton from 'src/@core/components/dialog/DialogCloseButton'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

type FormValues = Omit<Industry, 'id' | 'created_at' | 'updated_at'> & {
  iconFile?: File | null
}

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  mode: 'create' | 'edit'
  item?: Industry | null
}

const defaultValues: FormValues = {
  name: '',
  name_en: '',
  name_uz: '',
  name_ru: '',
  slug: '',
  description: '',
  icon: '',
  iconFile: null,
  order_index: 0
}

const IndustryFormDialog = ({ open, onClose, onSaved, mode, item }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting }
  } = useForm<FormValues>({ defaultValues })

  const iconFile = watch('iconFile')
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  useEffect(() => {
    if (iconFile && iconFile instanceof File) {
      const url = URL.createObjectURL(iconFile)
      setIconPreview(url)
      return () => URL.revokeObjectURL(url)
    } else if (item?.icon && !iconFile) {
      setIconPreview(item.icon)
    } else {
      setIconPreview(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconFile, item])

  useEffect(() => {
    if (mode === 'edit' && item) {
      reset({
        name: item.name,
        name_en: item.name_en,
        name_uz: item.name_uz,
        name_ru: item.name_ru,
        slug: item.slug,
        short_description: item.short_description || '',
        description: item.description || '',
        icon: item.icon || '',
        iconFile: null,
        order_index: item.order_index
      })
    } else if (mode === 'create') {
      reset(defaultValues)
    }
  }, [mode, item, reset])

  const onSubmit = async (values: FormValues) => {
    const fd = new FormData()
    fd.append('name_en', values.name_en)
    fd.append('name_uz', values.name_uz)
    fd.append('name_ru', values.name_ru)
    fd.append('slug', values.slug)
    if (values.description !== undefined) fd.append('description', values.description || '')
    fd.append('order_index', String(Number(values.order_index) || 0))
    if (values.iconFile) {
      fd.append('icon', values.iconFile)
    }

    try{
    if (mode === 'create') {
      await DataService.postForm(endpoints.industries, fd)
    } else if (mode === 'edit' && item) {
      await DataService.putForm(endpoints.industryById(item.id), fd)
    }
    onSaved()
    onClose()
}
    catch(error: any){
      console.error('Failed to save industry:', error)
      toast.error(error?.message || 'Failed to save industry')
    }
   
  }

  return (
     <Dialog
        fullWidth
        open={open}
        onClose={onClose}
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={onClose} disableRipple>
          <Icon icon={'tabler:x'} />
        </DialogCloseButton>
  <DialogTitle>{mode === 'create' ? 'Sanoat qo‘shish' : 'Sanoatni tahrirlash'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={4}>
            
              <Grid item xs={12} md={6}>
                <Controller
                  name='name_en'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <CustomTextField fullWidth label='Nomi (EN)' {...field} />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='name_uz'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <CustomTextField fullWidth label='Nomi (UZ)' {...field} />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='name_ru'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <CustomTextField fullWidth label='Nomi (RU)' {...field} />}
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
            
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => <CustomTextField fullWidth label='To‘liq tavsif' multiline minRows={3} {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='iconFile'
                control={control}
                render={({ field: { onChange } }) => (
                  <>
                    <Button variant='outlined' component='label' fullWidth sx={{ mb: 2 }}>
                      Icon yuklash (rasm)
                      <input
                        hidden
                        type='file'
                        accept='image/*'
                        onChange={e => onChange(e.target.files?.[0] || null)}
                      />
                    </Button>
                    {iconPreview && (
                      <img
                        src={iconPreview}
                        alt='Icon ko‘rinishi'
                        style={{ display: 'block', maxWidth: 80, maxHeight: 80, marginTop: 4, borderRadius: 8 }}
                      />
                    )}
                  </>
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

export default IndustryFormDialog

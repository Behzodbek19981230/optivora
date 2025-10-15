import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { EquipmentCategory, EquipmentCategoryCreate, EquipmentCategoryUpdate } from 'src/types/cms'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import DialogCloseButton from 'src/@core/components/dialog/DialogCloseButton'
import toast from 'react-hot-toast'

type FormValues = Omit<EquipmentCategory, 'id' | 'created_at' | 'updated_at'>

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  mode: 'create' | 'edit'
  item?: EquipmentCategory | null
}

const defaultValues: FormValues = {
  name_en: '',
  name_uz: '',
  name_ru: '',
  slug: '',
  description: '',
  description_en: '',
  description_uz: '',
  description_ru: '',
  order_index: 0
}

const EquipmentCategoryFormDialog = ({ open, onClose, onSaved, mode, item }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FormValues>({ defaultValues })

  useEffect(() => {
    if (mode === 'edit' && item) {
      reset({
        name_en: item.name_en,
        name_uz: item.name_uz,
        name_ru: item.name_ru,
        slug: item.slug,
        description: item.description,
        description_en: item.description_en,
        description_uz: item.description_uz,
        description_ru: item.description_ru,
        order_index: item.order_index
      })
    } else if (mode === 'create') {
      reset(defaultValues)
    }
  }, [mode, item, reset])

  const onSubmit = async (values: FormValues) => {
    const body: Partial<EquipmentCategoryCreate | EquipmentCategoryUpdate> = {
      ...values,
      order_index: Number(values.order_index) || 0
    }
    try{
    if (mode === 'create') {
      await DataService.post(endpoints.equipmentCategories, body)
    } else if (mode === 'edit' && item) {
      await DataService.put(endpoints.equipmentCategoryById(item.id), body)
    }
    onSaved()
    onClose()
}
    catch(error){
      console.error(error);
      toast.error('Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.')
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
      <DialogTitle>{mode === 'create' ? 'Jihoz kategoriyasi qo‘shish' : 'Jihoz kategoriyasini tahrirlash'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={4}>
            
            <Grid item xs={12} md={6}>
              <Controller name='name_en' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Nomi (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='name_uz' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Nomi (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='name_ru' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Nomi (RU)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller name='slug' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Slug' {...field} />} />
            </Grid>
            <Grid item xs={12}>
              <Controller name='description' control={control} render={({ field }) => <CustomTextField fullWidth label='To‘liq tavsif' multiline minRows={2} {...field} />} />
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
              <Controller name='order_index' control={control} render={({ field }) => <CustomTextField fullWidth type='number' label='Tartib raqami' {...field} inputProps={{ min: 0 }} />} />
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

export default EquipmentCategoryFormDialog

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Partner, PartnerCategory, PartnerCreate, PartnerUpdate, Industry, EquipmentCategory } from 'src/types/cms'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import CustomTextField from 'src/@core/components/mui/text-field'
import MenuItem from '@mui/material/MenuItem'
import { useFetchList } from 'src/hooks/useFetchList'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import toast from 'react-hot-toast'
import { PartnerCategoryList } from 'src/configs/const'

export type FormValues = Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'logo'> & { logo?: File | string | null }

type Props = {
    open: boolean
    onClose: () => void
    onSaved: () => void
    mode: 'create' | 'edit'
    item?: Partner | null
}

const defaultValues: FormValues = {
    name: '',
    name_en: '',
    name_uz: '',
    name_ru: '',
    logo: '',
    category: 'power_control',
    website: '',
    description: '',
    description_en: '',
    description_uz: '',
    description_ru: '',
    industries: [],
    equipment_categories: [],
    order_index: 0,
    is_featured: false,
    partners: [],
    country: 0,
    region: 0,
    district: 0

}

const PartnerFormDialog = ({ open, onClose, onSaved, mode, item }: Props) => {
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

    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    useEffect(() => {
        if (mode === 'edit' && item) {
            reset({ ...item, logo: null })
            setLogoPreview(typeof item.logo === 'string' ? item.logo : null)
        } else if (mode === 'create') {
            reset(defaultValues)
            setLogoPreview(null)
        }
    }, [mode, item, reset])

    const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setValue('logo', file)
        if (file) {
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'logo' && value) {
                formData.append('logo', value as File)
            } else if (Array.isArray(value)) {
                value.forEach(v => formData.append(key, String(v)))
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value))
            }
        })
        try {
            if (mode === 'create') {
                await DataService.postForm(endpoints.partners, formData)
            } else if (mode === 'edit' && item) {
                await DataService.putForm(endpoints.partnerById(item.id), formData)
            }
            onSaved()
            onClose()
        } catch (error) {
            console.error('Failed to save partner:', error)
            toast.error('Hamkorni saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.')
        }
    }

    return (
        <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth='md'>
            <DialogTitle>{mode === 'create' ? 'Hamkor qo‘shish' : 'Hamkorni tahrirlash'}</DialogTitle>
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
                            <Controller name='category' control={control} rules={{ required: true }} render={({ field }) => (
                                <CustomTextField select fullWidth label='Kategoriya' {...field} value={field.value || ''}>
                                    {PartnerCategoryList.map(cat => (
                                        <MenuItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name='website' control={control} render={({ field }) => <CustomTextField fullWidth label='Vebsayt' {...field} />} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <label style={{ display: 'block', marginBottom: 8 }}>Logo (rasm):</label>
                            <input type='file' accept='image/*' onChange={onLogoChange} />
                            {logoPreview && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={logoPreview} alt='logo preview' style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8 }} />
                                </div>
                            )}
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
                        {/* ...existing code... */}
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

export default PartnerFormDialog

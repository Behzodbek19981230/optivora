import { CompanyProfile } from 'src/types/company-profile'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'

interface Props {
  initialValues?: Partial<CompanyProfile>
  onSubmit: (values: any) => void
  loading?: boolean
}

const CompanyProfileForm = ({ initialValues, onSubmit, loading }: Props) => {
  const { control, handleSubmit, setValue, formState: { isSubmitting } } = useForm({ defaultValues: initialValues })
  const [logoPreview, setLogoPreview] = useState<string | null>(initialValues?.logo || null)
  const [fileName, setFileName] = useState<string | null>(null)

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('logo', file as any)
    if (file) setLogoPreview(URL.createObjectURL(file))
  }

  const onFileDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setValue('file', file as any)
    setFileName(file ? file.name : null)
  }

  return (
    <Card >
      <CardHeader title={initialValues?.id ? 'Kompaniya maʼlumotlarini tahrirlash' : 'Kompaniya maʼlumotlarini qo‘shish'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Controller name='name_uz' control={control} rules={{ required: true }} render={({ field }) => <CustomTextField fullWidth label='Nomi (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='name_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='name_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Nomi (RU)' {...field} />} />
            </Grid>
           
            <Grid item xs={12} md={6}>
              <label style={{ display: 'block', marginBottom: 8 }}>Logo:</label>
              <input type='file' accept='image/*' onChange={onLogoChange} />
              {logoPreview && (
                <div style={{ marginTop: 8 }}>
                  <img src={logoPreview} alt='logo preview' style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8 }} />
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <label style={{ display: 'block', marginBottom: 8 }}>Qo‘shimcha fayl (file_data):</label>
              <input type='file' onChange={onFileDataChange} />
              {fileName && <div style={{ marginTop: 8, fontSize: 13 }}>{fileName}</div>}
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller name='email' control={control} render={({ field }) => <CustomTextField fullWidth label='Email' {...field} />} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller name='phone' control={control} render={({ field }) => <CustomTextField fullWidth label='Telefon' {...field} />} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller name='address' control={control} render={({ field }) => <CustomTextField fullWidth label='Manzil' {...field} />} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller name='business_hours' control={control} render={({ field }) => <CustomTextField fullWidth label='Ish vaqti' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='title_uz' control={control} render={({ field }) => <CustomTextField fullWidth label='Lavozim (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='title_en' control={control} render={({ field }) => <CustomTextField fullWidth label='Lavozim (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='title_ru' control={control} render={({ field }) => <CustomTextField fullWidth label='Lavozim (RU)' {...field} />} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller name='description_uz' control={control} render={({ field }) => <CustomTextField fullWidth multiline rows={4} label='Tavsif (UZ)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='description_en' control={control} render={({ field }) => <CustomTextField fullWidth multiline rows={4} label='Tavsif (EN)' {...field} />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller name='description_ru' control={control} render={({ field }) => <CustomTextField fullWidth multiline rows={4} label='Tavsif (RU)' {...field} />} />
            </Grid>
          
          </Grid>
        </CardContent>
        <CardContent>
          <Button type='submit' variant='contained' disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Saqlanmoqda…' : 'Saqlash'}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

export default CompanyProfileForm

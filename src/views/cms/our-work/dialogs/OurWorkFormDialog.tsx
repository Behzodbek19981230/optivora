import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,  MenuItem, Grid } from '@mui/material'
import { OurWork, OUR_WORK_TYPE_OPTIONS } from 'src/types/our-work'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import CustomTextField from 'src/@core/components/mui/text-field'

interface OurWorkFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: Partial<OurWork>
}

const OurWorkFormDialog: React.FC<OurWorkFormDialogProps> = ({ open, onClose, onSuccess, initialData }) => {
  const [form, setForm] = useState<Partial<Omit<OurWork, 'icon'> & { icon?: File | string }>>({})
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(initialData || {})
      setLogoPreview(typeof initialData?.icon === 'string' ? initialData.icon : null)
    }
  }, [open, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setForm({ ...form, icon: file })
    if (file) setLogoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'icon' && value && typeof value !== 'string') {
          formData.append('icon', value as unknown as File)
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      if (form.id) {
        await DataService.putForm(endpoints.ourWorkById(form.id), formData)
      } else {
        await DataService.postForm(endpoints.ourWork, formData)
      }
      onSuccess()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{form.id ? 'Tahrirlash' : 'Yangi qo‘shish'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <CustomTextField label='Sarlavha' name='title' value={form.title || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Tavsif' name='description' value={form.description || ''} onChange={handleChange} fullWidth multiline rows={3} />
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
          <Grid item xs={12}>
            <CustomTextField label='Type' name='type' value={form.type || ''} onChange={handleChange} select fullWidth required>
              {OUR_WORK_TYPE_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </CustomTextField>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Tartib raqami' name='order_index' type='number' value={form.order_index ?? ''} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>{form.id ? 'Saqlash' : 'Qo‘shish'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OurWorkFormDialog

import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,  MenuItem, Grid } from '@mui/material'
import { User } from 'src/types/user'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import CustomTextField from 'src/@core/components/mui/text-field'

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: Partial<User>
}

const roles = [
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Manager' },
  { value: '3', label: 'User' }
]

const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, onClose, onSuccess, initialData }) => {
  const [form, setForm] = useState<Partial<User>>(initialData || {})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (form.id) {
        await DataService.patch(endpoints.userById(form.id), form)
      } else {
        await DataService.post(endpoints.user, form)
      }
      onSuccess()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{form.id ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Familiya' name='last_name' value={form.last_name || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Ism' name='first_name' value={form.first_name || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Otasining ismi' name='second_name' value={form.second_name || ''} onChange={handleChange} fullWidth />
          </Grid>
           <Grid item xs={12} sm={6}>
            <CustomTextField label='Telefon' name='phone_number' value={form.phone_number || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Foydalanuvchi nomi' name='username' value={form.username || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Parol' name='password' type='password' value={form.password || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Email' name='email' value={form.email || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Rol' name='role' value={form.role || ''} onChange={handleChange} select fullWidth required>
              {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </CustomTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField label='Holat' name='is_active' value={form.is_active ? 'true' : 'false'} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })} select fullWidth required>
              <MenuItem value={'true'}>Faol</MenuItem>
              <MenuItem value={'false'}>Faol emas</MenuItem>
            </CustomTextField>
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

export default UserFormDialog

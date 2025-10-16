import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material'
import { User } from 'src/types/user'
import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (user: User) => void
  user?: User | null
}

const UserModal = ({ open, onClose, onSave, user }: Props) => {
  const [form, setForm] = useState<User>(user || {
    id: 0,
    username: '', last_name: '', first_name: '', second_name: '', is_active: true,
    date_of_birthday: '', gender: '', phone_number: '', avatar: '', email: '', role: '', password: '',
    country: 0, region: 0, district: 0, address: '', passport_series: '', passport_number: ''
  })

  const handleChange = (field: keyof User, value: any) => {
    setForm({ ...form, [field]: value })
  }

  const handleSave = () => {
    onSave(form)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Foydalanuvchi</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Username" fullWidth value={form.username} onChange={e => handleChange('username', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Familiya" fullWidth value={form.last_name} onChange={e => handleChange('last_name', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Ism" fullWidth value={form.first_name} onChange={e => handleChange('first_name', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Otasining ismi" fullWidth value={form.second_name} onChange={e => handleChange('second_name', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" fullWidth value={form.email} onChange={e => handleChange('email', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Telefon" fullWidth value={form.phone_number} onChange={e => handleChange('phone_number', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Role" fullWidth value={form.role} onChange={e => handleChange('role', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Manzil" fullWidth value={form.address} onChange={e => handleChange('address', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Passport seriyasi" fullWidth value={form.passport_series} onChange={e => handleChange('passport_series', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Passport raqami" fullWidth value={form.passport_number} onChange={e => handleChange('passport_number', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Tug'ilgan sana" fullWidth value={form.date_of_birthday} onChange={e => handleChange('date_of_birthday', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Jinsi" fullWidth value={form.gender} onChange={e => handleChange('gender', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Davlat" fullWidth value={form.country} onChange={e => handleChange('country', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Viloyat" fullWidth value={form.region} onChange={e => handleChange('region', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Tuman" fullWidth value={form.district} onChange={e => handleChange('district', e.target.value)} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bekor qilish</Button>
        <Button onClick={handleSave} variant="contained">Saqlash</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserModal

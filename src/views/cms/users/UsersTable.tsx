import { useState } from 'react'
import { useUsers } from 'src/hooks/useUsers'
import { User } from 'src/types/user'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import UserModal from './UserModal'


const UsersTable = () => {
  const { data: users = [], isLoading, mutate } = useUsers()
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedUser(null)
  }

  // CRUD: Update/Create user
  const handleSave = async (user: User) => {
    if (user.id) {
      await fetch(`/user/${user.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
    } else {
      await fetch(`/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
    }
    mutate()
    handleClose()
  }

  // CRUD: Delete user
  const handleDelete = async (id: number) => {
    await fetch(`/user/${id}/`, { method: 'DELETE' })
    mutate()
  }

  return (
    <TableContainer component={Paper}>
      <Button variant="contained" sx={{ m: 2 }} onClick={() => { setSelectedUser(null); setOpen(true) }}>
        Yangi foydalanuvchi qo'shish
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Familiya</TableCell>
            <TableCell>Ism</TableCell>
            <TableCell>Otasining ismi</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Manzil</TableCell>
            <TableCell>Passport seriyasi</TableCell>
            <TableCell>Passport raqami</TableCell>
            <TableCell>Tug'ilgan sana</TableCell>
            <TableCell>Jinsi</TableCell>
            <TableCell>Davlat</TableCell>
            <TableCell>Viloyat</TableCell>
            <TableCell>Tuman</TableCell>
            <TableCell>Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={16}>Yuklanmoqda...</TableCell>
            </TableRow>
          ) : users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.second_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{user.passport_series}</TableCell>
              <TableCell>{user.passport_number}</TableCell>
              <TableCell>{user.date_of_birthday}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.country}</TableCell>
              <TableCell>{user.region}</TableCell>
              <TableCell>{user.district}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(user)}><IconifyIcon icon="mdi:pencil" /></IconButton>
                <IconButton onClick={() => handleDelete(user.id)}><IconifyIcon icon="mdi:delete" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserModal open={open} onClose={handleClose} onSave={handleSave} user={selectedUser} />
    </TableContainer>
  )
}

export default UsersTable

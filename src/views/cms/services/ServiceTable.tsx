import { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
const EditIcon = () => <span style={{fontWeight:'bold'}}>✏️</span>
const DeleteIcon = () => <span style={{fontWeight:'bold', color:'red'}}>🗑️</span>
const AddIcon = () => <span style={{fontWeight:'bold'}}>＋</span>
import { Service } from 'src/types/cms'
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import ServiceFormDialog from './dialogs/ServiceFormDialog'
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog'
import { useFetchList } from 'src/hooks/useFetchList'
import { TablePagination } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const ServiceTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data, total, loading, mutate } = useFetchList<Service>(endpoints.services, {
    page: page + 1,
    perPage: rowsPerPage,
    search
  })
  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selected, setSelected] = useState<Service | null>(null)
  const [openDelete, setOpenDelete] = useState(false)

  const handleCreate = () => {
    setFormMode('create')
    setSelected(null)
    setOpenForm(true)
  }

  const handleEdit = (item: Service) => {
    setFormMode('edit')
    setSelected(item)
    setOpenForm(true)
  }

  const handleDelete = (item: Service) => {
    setSelected(item)
    setOpenDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (selected) {
      await DataService.delete(endpoints.serviceById(selected.id))
      mutate()
      setOpenDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title='Xizmatlar'
        action={
          <Button variant='contained' startIcon={<AddIcon />} onClick={handleCreate}>
            Yangi xizmat
          </Button>
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nomi (UZ)</TableCell>
              <TableCell>Nomi (EN)</TableCell>
              <TableCell>Nomi (RU)</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Tartib raqami</TableCell>
              <TableCell align='right'>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>Yuklanmoqda…</TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name_uz}</TableCell>
                  <TableCell>{row.name_en}</TableCell>
                  <TableCell>{row.name_ru}</TableCell>
                  <TableCell>{row.slug}</TableCell>
                    <TableCell>
                    <img
                        src={row.icon ?? undefined}
                        width={100}
                        height={100}
                        alt={row.name_uz ?? ''}
                        style={{ maxWidth: '100%', maxHeight: 40, objectFit: 'contain' }}
                      />
                    </TableCell>
                  <TableCell>{row.order_index}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Tooltip title='Tahrirlash'>
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                          <IconifyIcon icon='tabler:edit' />
                          
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='O‘chirish'>
                        <IconButton size='small' color='error' onClick={() => handleDelete(row)}>
                          <IconifyIcon icon='tabler:trash' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align='center'>Ma‘lumotlar yo‘q</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={total}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
      <ServiceFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSaved={mutate}
        mode={formMode}
        item={selected}
      />
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title='Xizmatni o‘chirishni tasdiqlang'
        description={selected ? `“${selected.name_uz}” xizmatini o‘chirmoqchimisiz?` : undefined}
      />
    </Card>
  )
}

export default ServiceTable

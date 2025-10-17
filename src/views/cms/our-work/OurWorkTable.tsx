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
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import DeleteConfirmDialog from '../projects/dialogs/DeleteConfirmDialog'
import { useFetchList } from 'src/hooks/useFetchList'
import { TablePagination, Chip } from '@mui/material'
import { OurWork, OUR_WORK_TYPE_OPTIONS } from 'src/types/our-work'
import OurWorkFormDialog from './dialogs/OurWorkFormDialog'

const OurWorkTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { data, total, loading, mutate } = useFetchList<OurWork>(endpoints.ourWork, {
    page: page + 1,
    perPage: rowsPerPage
  })
  const [selected, setSelected] = useState<OurWork | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  const handleDelete = (item: OurWork) => {
    setSelected(item)
    setOpenDelete(true)
  }

  const handleEdit = (item: OurWork) => {
    setSelected(item)
    setOpenForm(true)
  }

  const handleCreate = () => {
    setSelected(null)
    setOpenForm(true)
  }

  const handleDeleteConfirm = async () => {
    if (selected) {
      await DataService.delete(endpoints.ourWorkById(selected.id))
      mutate()
      setOpenDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title='Our Work'
        action={
          <Button variant='contained' startIcon={<AddIcon />} onClick={handleCreate}>
            Yangi qo‘shish
          </Button>
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sarlavha</TableCell>
              <TableCell>Tavsif</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Type</TableCell>
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
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <img src={row.icon} alt={row.title} style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8 }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={OUR_WORK_TYPE_OPTIONS.find(opt => opt.value === row.type)?.label || row.type}
                      color='primary'
                      size='small'
                    />
                  </TableCell>
                  <TableCell>{row.order_index}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Tooltip title='Tahrirlash'>
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='O‘chirish'>
                        <IconButton size='small' color='error' onClick={() => handleDelete(row)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align='center'>Ma‘lumotlar yo‘q</TableCell>
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
      <OurWorkFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={mutate}
        initialData={selected || undefined}
      />
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title='Our Workni o‘chirishni tasdiqlang'
        description={selected ? `“${selected.title}”ni o‘chirmoqchimisiz?` : undefined}
      />
    </Card>
  )
}

export default OurWorkTable

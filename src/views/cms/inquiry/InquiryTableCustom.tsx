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
const DeleteIcon = () => <span style={{fontWeight:'bold', color:'red'}}>🗑️</span>
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import DeleteConfirmDialog from '../projects/dialogs/DeleteConfirmDialog'
import { useFetchList } from 'src/hooks/useFetchList'
import { TablePagination, Typography } from '@mui/material'
import { Inquiry } from 'src/types/inquiry'

const InquiryTableCustom = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { data, total, loading, mutate } = useFetchList<Inquiry>(endpoints.inquiries, {
    page: page + 1,
    perPage: rowsPerPage
  })
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDelete = (item: Inquiry) => {
    setSelected(item)
    setOpenDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (selected) {
      await DataService.delete(endpoints.inquiryById(selected.id))
      mutate()
      setOpenDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Murojaatlar' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>F.I.Sh.</TableCell>
              <TableCell>Kompaniya</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Murojaat turi</TableCell>
              <TableCell>Loyiha sohasi</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='right'>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align='center'>Yuklanmoqda…</TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.full_name}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.inquiry_type}</TableCell>
                  <TableCell>{row.project_sector}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
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
                <TableCell colSpan={8} align='center'>Ma‘lumotlar yo‘q</TableCell>
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
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Murojaatni o‘chirishni tasdiqlang"
        description={selected ? `“${selected.full_name}” murojaatini o‘chirmoqchimisiz?` : undefined}
      />
    </Card>
  )
}

export default InquiryTableCustom

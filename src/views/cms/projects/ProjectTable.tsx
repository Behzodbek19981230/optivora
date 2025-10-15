import { useState } from 'react'
import Link from 'next/link'
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
import ProjectFormDialog from './dialogs/ProjectFormDialog'
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog'
import { useFetchList } from 'src/hooks/useFetchList'
import { TablePagination } from '@mui/material'
import { Project } from 'src/types/cms'
import IconifyIcon from 'src/@core/components/icon'

const ProjectTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data, total, loading, mutate } = useFetchList<Project>(endpoints.projects, {
    page: page + 1,
    perPage: rowsPerPage,
    search
  })

  const [selected, setSelected] = useState<Project | null>(null)
  const [openDelete, setOpenDelete] = useState(false)

  // Remove dialog-based create/edit, use pages instead

  const handleDelete = (item: Project) => {
    setSelected(item)
    setOpenDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (selected) {
      await DataService.delete(endpoints.projectById(selected.id))
      mutate()
      setOpenDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title='Loyihalar'
        action={
          <Link href='/cms/projects/create' passHref legacyBehavior>
            <Button variant='contained' startIcon={<AddIcon />} component='a'>
              Yangi loyiha
            </Button>
          </Link>
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nomi (UZ)</TableCell>
              <TableCell>Nomi (EN)</TableCell>
              <TableCell>Nomi (RU)</TableCell>
              <TableCell>Yil</TableCell>
              <TableCell>Asosiy</TableCell>
              <TableCell>Tartib raqami</TableCell>
              <TableCell align='right'>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>Yuklanmoqda…</TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.title_uz}</TableCell>
                  <TableCell>{row.title_en}</TableCell>
                  <TableCell>{row.title_ru}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.is_featured ? 'Ha' : 'Yo‘q'}</TableCell>
                  <TableCell>{row.order_index}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Tooltip title='Tahrirlash'>
                        <Link href={`/cms/projects/${row.id}/edit`} passHref legacyBehavior>
                          <IconButton size='small' component='a'>
                            <IconifyIcon icon='tabler:edit' />
                          </IconButton>
                        </Link>
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
      {/* ProjectFormDialog removed, handled by page */}
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title='Loyihani o‘chirishni tasdiqlang'
        description={selected ? `“${selected.title_uz}” loyihasini o‘chirmoqchimisiz?` : undefined}
      />
    </Card>
  )
}

export default ProjectTable

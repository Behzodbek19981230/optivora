import { useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useFetchList } from 'src/hooks/useFetchList'
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import { Industry } from 'src/types/cms'
import IndustryFormDialog from './dialogs/IndustryFormDialog'
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog'
import Icon from 'src/@core/components/icon'

const IndustriesTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')

  const { data, total, loading, error, mutate } = useFetchList<Industry>(endpoints.industries, {
    page: page + 1,
    perPage: rowsPerPage,
    search
  })

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [current, setCurrent] = useState<Industry | null>(null)

  const [delOpen, setDelOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleAdd = () => {
    setCurrent(null)
    setFormMode('create')
    setFormOpen(true)
  }
  const handleEdit = (row: Industry) => {
    setCurrent(row)
    setFormMode('edit')
    setFormOpen(true)
  }
  const handleDelete = (row: Industry) => {
    setCurrent(row)
    setDelOpen(true)
  }

  const confirmDelete = async () => {
    if (!current) return
    try {
      setDeleting(true)
      await DataService.delete(endpoints.industryById(current.id))
      setDelOpen(false)
      setCurrent(null)
      mutate()
    } finally {
      setDeleting(false)
    }
  }

  const subtitle = useMemo(() => {
    const showing = Math.min((page + 1) * rowsPerPage, total)
    return `${total ? showing : 0} of ${total}`
  }, [page, rowsPerPage, total])

  return (
    <Card>
      <CardHeader
        title='Sanoatlar'
        subheader={subtitle}
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size='small'
              placeholder='Qidirish…'
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(0)
              }}
            />
            <Button startIcon={<Icon icon='tabler:plus' />} onClick={handleAdd}>
              Qo‘shish
            </Button>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {loading && (
          <Box display='flex' justifyContent='center' py={6}>
            <CircularProgress size={24} />
          </Box>
        )}
        {Boolean(error) && (
          <Typography color='error' variant='body2' sx={{ mb: 2 }}>
            {`Failed to load industries${error ? `: ${error instanceof Error ? error.message : String(error)}` : ''}`}
          </Typography>
        )}
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell width={80}>ID</TableCell>
              <TableCell>Nomi</TableCell>
              <TableCell>Nomi (EN)</TableCell>
              <TableCell>Nomi (UZ)</TableCell>
              <TableCell>Nomi (RU)</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell width={120}>Tartib raqami</TableCell>
              <TableCell align='right' width={120}>
                Amallar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.name_en}</TableCell>
                <TableCell>{row.name_uz}</TableCell>
                <TableCell>{row.name_ru}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>
                  <img
                    src={row.icon ?? undefined}
                    width={100}
                    height={100}
                    alt={row.name ?? ''}
                    style={{ maxWidth: '100%', maxHeight: 40, objectFit: 'contain' }}
                  />
                </TableCell>
                <TableCell>{row.order_index}</TableCell>
                <TableCell align='right'>
                  <Tooltip title='Tahrirlash'>
                    <IconButton size='small' onClick={() => handleEdit(row)}>
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='O‘chirish'>
                    <IconButton size='small' color='error' onClick={() => handleDelete(row)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align='center'>
                  Ma’lumot yo‘q
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      </CardContent>

      <IndustryFormDialog
        open={formOpen}
        mode={formMode}
        item={current}
        onClose={() => setFormOpen(false)}
        onSaved={() => mutate()}
      />
      <DeleteConfirmDialog
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title='Delete industry?'
        description={`Are you sure you want to delete "${current?.name ?? ''}"?`}
      />
    </Card>
  )
}

export default IndustriesTable

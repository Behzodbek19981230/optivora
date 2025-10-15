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
import { Faq } from 'src/types/faq'
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import DeleteConfirmDialog from 'src/views/cms/projects/dialogs/DeleteConfirmDialog'
import { useFetchList } from 'src/hooks/useFetchList'

const EditIcon = () => <span style={{fontWeight:'bold'}}>✏️</span>
const DeleteIcon = () => <span style={{fontWeight:'bold', color:'red'}}>🗑️</span>
const AddIcon = () => <span style={{fontWeight:'bold'}}>＋</span>

const FaqTable = () => {
  const { data, total, loading, mutate } = useFetchList<Faq>(endpoints.faqs, { perPage: 100 })
  const [selected, setSelected] = useState<Faq | null>(null)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDelete = (item: Faq) => {
    setSelected(item)
    setOpenDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (selected) {
      await DataService.delete(endpoints.faqById(selected.id))
      mutate()
      setOpenDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title='FAQ'
        action={
          <Button variant='contained' startIcon={<AddIcon />} href='/cms/faq/create'>Yangi FAQ</Button>
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Savol (UZ)</TableCell>
              <TableCell>Javob (UZ)</TableCell>
              <TableCell>Tartib raqami</TableCell>
              <TableCell align='right'>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align='center'>Yuklanmoqda…</TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.question_uz}</TableCell>
                  <TableCell>{row.answer_uz}</TableCell>
                  <TableCell>{row.order_index}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Tooltip title='Tahrirlash'>
                        <Button size='small' href={`/cms/faq/${row.id}/edit`}><EditIcon /></Button>
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
                <TableCell colSpan={4} align='center'>Ma‘lumotlar yo‘q</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title='FAQni o‘chirishni tasdiqlang'
        description={selected ? `“${selected.question_uz}” savolini o‘chirmoqchimisiz?` : undefined}
      />
    </Card>
  )
}

export default FaqTable

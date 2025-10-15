import { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { ProjectImage } from 'src/types/project-image'
import { GridAddIcon, GridDeleteIcon } from '@mui/x-data-grid'

interface Props {
  projectId: number
  items: ProjectImage[]
  onAdd: (item: Omit<ProjectImage, 'id'>, file: File) => void
  onDelete: (id: number) => void
}

export default function ProjectImageGallery({ projectId, items, onAdd, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [file, setFile] = useState<File | null>(null)

  const handleAdd = () => {
    if (file) {
      onAdd({ image: '', caption, order_index: orderIndex, project: projectId }, file)
      setCaption('')
      setOrderIndex(0)
      setFile(null)
      setOpen(false)
    }
  }

  return (
    <>
      <CardHeader title='Galereya' action={<Button startIcon={<GridAddIcon />} onClick={() => setOpen(true)}>Yangi rasm</Button>} />
      <CardContent>
        <Grid container spacing={2}>
          {items.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || item.caption}>
              <Card sx={{ position: 'relative', p: 1 }}>
                <img src={item.image} alt={item.caption} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ padding: 8 }}>
                  <div style={{ fontWeight: 500 }}>{item.caption}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Tartib: {item.order_index}</div>
                </div>
                <IconButton color='error' size='small' sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => item.id && onDelete(item.id)}><GridDeleteIcon fontSize='small' /></IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Yangi rasm</DialogTitle>
        <DialogContent>
          <TextField fullWidth label='Izoh' value={caption} onChange={e => setCaption(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth type='number' label='Tartib raqami' value={orderIndex} onChange={e => setOrderIndex(Number(e.target.value))} sx={{ mb: 2 }} />
          <input type='file' accept='image/*' onChange={e => setFile(e.target.files?.[0] || null)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleAdd} variant='contained' disabled={!file}>Qo'shish</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

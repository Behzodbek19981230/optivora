import { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { ProjectDeliverable } from 'src/types/project-deliverable'
import { GridAddIcon, GridDeleteIcon } from '@mui/x-data-grid'

interface Props {
  projectId: number
  items: ProjectDeliverable[]
  onAdd: (item: Omit<ProjectDeliverable, 'id'>) => void
  onDelete: (id: number) => void
}

export default function ProjectDeliverableTable({ projectId, items, onAdd, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (name.trim()) {
      onAdd({ name, project: projectId })
      setName('')
      setOpen(false)
    }
  }

  return (
    <>
      <CardHeader title='Loyiha deliverabllari' action={<Button startIcon={<GridAddIcon />} onClick={() => setOpen(true)}>Yangi deliverable</Button>} />
      <CardContent>
        <Grid container spacing={2}>
          {items.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || item.name}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <IconButton color='error' onClick={() => item.id && onDelete(item.id)}><GridDeleteIcon /></IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Yangi deliverable</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label='Nomi' value={name} onChange={e => setName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleAdd} variant='contained'>Qo'shish</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

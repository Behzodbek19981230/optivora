import { Icon } from '@iconify/react'
import { Box, Button, CardContent, Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'

export default function ReportTypeTab({ title }: { title: string }) {
  return (
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant='h4'>
        <Translations text={title} />
      </Typography>
      <Box sx={{ display: 'flex', gap: 5 }}>
        <Button variant='outlined' startIcon={<Icon icon='tabler:table' />}>
          <Translations text='table' />
        </Button>
        <Button variant='outlined' startIcon={<Icon icon='tabler:chart-line' />}>
          <Translations text='Diagram' />
        </Button>
      </Box>
    </CardContent>
  )
}

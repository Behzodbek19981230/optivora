import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { NewsPost } from 'src/types/news-post'

interface NewsCardGridProps {
  data: NewsPost[]
  onEdit?: (item: NewsPost) => void
  onDelete?: (item: NewsPost) => void
}

const NewsCardGrid = ({ data, onEdit, onDelete }: NewsCardGridProps) => {
  return (
    <Grid container spacing={6}>
      {data && data.map((item, index) => (
        <Grid key={item.id || index} item xs={12} md={6} lg={4}>
          <Card>
            {item.cover_image && (
              <Box sx={{ height: 180, overflow: 'hidden', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                <img src={item.cover_image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            )}
            <CardContent>
              <Typography variant='h5' sx={{ mb: 2 }}>{item.title}</Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>{item.excerpt}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='caption' color='text.disabled'>Kategoriya: {item.category}</Typography>
                <Typography variant='caption' color='text.disabled' sx={{ ml: 2 }}>Status: {item.status}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button component={Link} href={`/cms/news/${item.id}/edit`} size='small' variant='outlined'>Tahrirlash</Button>
                <Button color='error' size='small' variant='outlined' onClick={() => onDelete && onDelete(item)}>O‘chirish</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default NewsCardGrid

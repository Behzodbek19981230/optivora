import { Card, CardContent, CardHeader, Typography, CircularProgress, Box, List, ListItem, ListItemText } from '@mui/material'
import endpoints from 'src/configs/endpoint '
import { useFetchList } from 'src/hooks/useFetchList'
import { Industry } from 'src/types/cms'

const IndustriesPage = () => {
  const { data, loading, error, total } = useFetchList<Industry>(endpoints.industries, { page: 1, perPage: 20 })

  return (
    <Card>
      <CardHeader title={`Industries (${total})`} />
      <CardContent>
        {loading && (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress size={24} />
          </Box>
        )}
        {Boolean(error) && (
          <Typography color='error' variant='body2'>
            {`Failed to load industries${error ? `: ${error instanceof Error ? error.message : String(error)}` : ''}`}
          </Typography>
        )}
        {!loading && !error && (
          <List>
            {data.map(item => (
              <ListItem key={item.id} divider>
                <ListItemText primary={item.name} secondary={item.short_description || item.slug} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

IndustriesPage.acl = { action: 'read', subject: 'cms' }
IndustriesPage.authGuard = true

export default IndustriesPage

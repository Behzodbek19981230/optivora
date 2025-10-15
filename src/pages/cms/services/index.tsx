import { Card, CardContent, CardHeader, Typography, CircularProgress, Box, List, ListItem, ListItemText, Chip, Stack } from '@mui/material'
import endpoints from 'src/configs/endpoint '
import { useFetchList } from 'src/hooks/useFetchList'
import { Service } from 'src/types/cms'

const ServicesPage = () => {
  const { data, loading, error, total } = useFetchList<Service>(endpoints.services, { page: 1, perPage: 20 })

  return (
    <Card>
      <CardHeader title={`Services (${total})`} />
      <CardContent>
        {loading && (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress size={24} />
          </Box>
        )}
        {Boolean(error) && (
          <Typography color='error' variant='body2'>
            {`Failed to load services${error ? `: ${error instanceof Error ? error.message : String(error)}` : ''}`}
          </Typography>
        )}
        {!loading && !error && (
          <List>
            {data.map(item => (
              <ListItem key={item.id} divider>
                <ListItemText primary={item.name} secondary={item.short_description || item.slug} />
                <Stack direction='row' spacing={1}>
                  {item.industries?.slice(0, 3).map(id => (
                    <Chip key={id} label={`Industry #${id}`} size='small' />
                  ))}
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

ServicesPage.acl = { action: 'read', subject: 'cms' }
ServicesPage.authGuard = true

export default ServicesPage

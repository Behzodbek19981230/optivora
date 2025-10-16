// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'


import { useDashboardStats } from '../../../hooks/useDashboardStats'
import moment from 'moment'

type StatsApi = {
  users: { total: number, by_role: { id: number, name: string, count: number }[] }
  partners: { total: number }
  services: { total: number }
  industries: { total: number }
  projects: { total: number, featured: number }
  inquiries: { total: number, by_status: { code: string, label: string, count: number }[] }
  news: { total: number, published: number, draft: number }
}

const statMap: { key: string; label: string; icon: string; color?: ThemeColor }[] = [
   { key: 'users', label: 'Foydalanuvchilar', icon: 'tabler:users', color: 'info' },
   { key: 'partners', label: 'Hamkorlar', icon: 'tabler:users', color: 'primary' },
   { key: 'services', label: 'Xizmatlar', icon: 'tabler:settings', color: 'success' },
   { key: 'industries', label: 'Sektorlar', icon: 'tabler:building-factory', color: 'warning' },
   { key: 'projects', label: 'Loyihalar', icon: 'tabler:briefcase', color: 'error' },
   { key: 'inquiries', label: 'Murojaatlar', icon: 'tabler:mail', color: 'secondary' },
   { key: 'news', label: 'Yangiliklar', icon: 'tabler:news', color: undefined }
]

const renderStats = (stats: StatsApi | null) => {
  if (!stats) return null
  return statMap.map((item, idx) => {
    let value = ''
    switch (item.key) {
      case 'users': value = stats.users?.total?.toString() || '0'; break
      case 'partners': value = stats.partners?.total?.toString() || '0'; break
      case 'services': value = stats.services?.total?.toString() || '0'; break
      case 'industries': value = stats.industries?.total?.toString() || '0'; break
      case 'projects': value = stats.projects?.total?.toString() || '0'; break
      case 'inquiries': value = stats.inquiries?.total?.toString() || '0'; break
      case 'news': value = stats.news?.total?.toString() || '0'; break
      default: value = '0'
    }
    return (
      <Grid item xs={6} md={3} key={item.key}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' color={item.color} sx={{ mr: 4, width: 42, height: 42 }}>
            <Icon icon={item.icon} fontSize='1.5rem' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{value}</Typography>
            <Typography variant='body2'>{item.label}</Typography>
          </Box>
        </Box>
      </Grid>
    )
  })
}

const EcommerceStatistics = () => {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <Card>
      <CardHeader
  title='Statistika'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {isLoading ? 'Loading...' : `Yuklangan: ${moment(stats?.generated_at || '').format('DD.MM.YYYY HH:mm')}`}
          </Typography>
        }
      />
      <CardContent
        sx={{ pt: theme => `${theme.spacing(7)} !important`, pb: theme => `${theme.spacing(7.5)} !important` }}
      >
        <Grid container spacing={6}>
          {renderStats(stats)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceStatistics

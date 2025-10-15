import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Icon } from '@iconify/react'
import CustomChip from 'src/@core/components/mui/chip'
import { useTheme } from '@mui/material'

const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

const CallHistory = () => {
  const theme = useTheme()
  return (
    <Grid sx={{ mt: 5, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant='h5'>
          <Translations text='Call_history' />
        </Typography>
      </Box>

      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align='right'>Дата и время звонка</TableCell>
              <TableCell align='right'>Оператор</TableCell>
              <TableCell align='right'>Абонент</TableCell>
              <TableCell align='right'>Тип звонка</TableCell>
              <TableCell align='right'>Продолжительность</TableCell>

              <TableCell align='right'>Статус</TableCell>
              <TableCell align='right'>Запись звонка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {i + 1}
                </TableCell>
                <TableCell align='right'>01.01.2023 00:00:00</TableCell>
                <TableCell align='right'>Фамилия Имя </TableCell>
                <TableCell align='right'>+998-88-888-88-88</TableCell>
                <TableCell align='right'>Исходящий</TableCell>
                <TableCell align='right'>00:00</TableCell>

                <TableCell align='right'>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label='Отвеченный'
                    color='success'
                    // sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align='right'>
                  <audio controls key={i + 1}>
                    <source src='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' type='audio/mp3' />
                  </audio>
                  {/* <Box
                    sx={{
                      display: 'flex',
                      background: theme.palette.grey[300],
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1,
                      px: 2,
                      borderRadius: 5,
                      width: 200
                    }}
                  >
                    <Icon fontSize='1.125rem' icon='tabler:player-play' color={theme.palette.text.secondary} />
                    <Typography>00:00 / 00:00</Typography>
                    <Icon fontSize='1.125rem' icon='tabler:volume' color={theme.palette.text.secondary} />
                    <Icon fontSize='1.125rem' icon='tabler:cloud-download' color={theme.palette.text.secondary} />
                  </Box> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
export default CallHistory

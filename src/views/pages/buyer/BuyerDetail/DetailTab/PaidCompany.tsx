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

const PaidCompany = () => {
  return (
    <Grid sx={{ mt: 5, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant='h5'>
          <Translations text='График платежей' />{' '}
        </Typography>
        <Box>
          <Button variant='outlined' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:receipt' />
            <Translations text='Добавить квитанцию' />
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Месяц</TableCell>
              <TableCell align='right'>Дата</TableCell>
              <TableCell align='right'>Номер карты</TableCell>
              <TableCell align='right'>Сумма</TableCell>
              <TableCell align='right'>Статус</TableCell>
              <TableCell align='right'>Дата отмены</TableCell>
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
                <TableCell align='right'>01.01.2023</TableCell>
                <TableCell align='right'>1234-1234-1234-1234</TableCell>
                <TableCell align='right'>000’000’000.00 сум</TableCell>
                <TableCell align='right'>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label='Погашен'
                    color='success'
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align='right'>01.01.2023</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
export default PaidCompany

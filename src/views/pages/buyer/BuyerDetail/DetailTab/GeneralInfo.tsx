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

const GeneralInfo = () => {
  return (
    <Grid sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Grid sx={{ width: '70%' }}>
        {/* ИНФОРМАЦИЯ О ПРОДАВЦЕ */}
        <Box>
          <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
            <Translations text='ИНФОРМАЦИЯ О ПРОДАВЦЕ' />{' '}
          </Typography>
          <Box sx={{ display: 'flex', mb: 3, width: '80%' }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Название компании:
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>ARTEL </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Название магазина:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>OOO KAMRON BIZNESMAN</Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Адрес:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Узбекистан, Республика Каракалпакстан, Беруни, ул. Строительная, 168
            </Typography>
          </Box>
        </Box>
        {/* УСЛОВИЯ ДОГОВОРА РАССРОЧКИ */}
        <Box>
          <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
            <Translations text='УСЛОВИЯ ДОГОВОРА РАССРОЧКИ' />{' '}
          </Typography>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Срок погашения::
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>12 мес. </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Общая сумма погашения:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>000’000’000.00 сум</Typography>
          </Box>
        </Box>
        {/* ИНФОРМАЦИЯ О ДОГОВОРЕ */}
        <Box>
          <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
            <Translations text='ИНФОРМАЦИЯ О ДОГОВОРЕ' />{' '}
          </Typography>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Количество товаров:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>1</Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Общая сумма товаров:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>000’000’000.00 сум </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              ID кредита для оплаты:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>12345678 </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Номер договора
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>123456 </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Дата договора
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>01.01.2023 </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              СМС код
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>3245yt5 </Typography>
          </Box>
        </Box>
        {/* ИНФОРМАЦИЯ О ПОКУПАТЕЛЕ */}
        <Box>
          <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
            <Translations text='ИНФОРМАЦИЯ О ПОКУПАТЕЛЕ' />{' '}
          </Typography>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Адрес:
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Узбекистан, Республика Каракалпакстан, Беруни, ул. Строительная, 1
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Паспортные данные:
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>XX 1234567 </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Место работы ИНН:
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>123 456 789</Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Телефон:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>+998-88-888-88-88 </Typography>
          </Box>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ mr: 2, fontWeight: 600, fontSize: 15, color: 'text.black', width: 250 }}>
              Телефон:{' '}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>+998-88-888-88-88 </Typography>
          </Box>
          <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
            <Translations text='Добавить новый номер' />
          </Button>
        </Box>
        {/* ИНФОРМАЦИЯ О ТОВАРЕ/ТОВАРАХ */}
        <Box>
          <Typography variant='h6' sx={{ color: 'text.disabled', my: 5 }}>
            <Translations text='INFORMATION_ABOUT_PRODUCT' />{' '}
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align='right'>ID товара</TableCell>
                  <TableCell align='right'>Название товара</TableCell>
                  <TableCell align='right'>Цена товара (без наценки)</TableCell>
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
                    <TableCell align='right'>{row.calories}</TableCell>
                    <TableCell align='right'>Название товара</TableCell>
                    <TableCell align='right'>000’000’000.00 сум</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Grid>
        <Card>
          <CardContent>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:switch-2' />
              <Translations text='Создать взаимодействия' />
            </Button>
            <Box>
              <Typography variant='h5' sx={{ my: 5 }}>
                Активность{' '}
              </Typography>
              Показать:
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Button variant='contained' sx={{ mr: 4, '& svg': { mr: 2 } }}>
                  <Translations text='Все' />
                </Button>
                <Button variant='contained' sx={{ mr: 4, '& svg': { mr: 2 } }}>
                  <Translations text='Новые' />
                </Button>
                <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Translations text='Старые' />
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
export default GeneralInfo

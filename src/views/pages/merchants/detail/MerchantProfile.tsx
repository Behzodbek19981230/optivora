import { Icon } from '@iconify/react'
import {
  CardContent,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
  styled,
  TableRowProps,
  TableHead,
  Box
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Translations from 'src/layouts/components/Translations'
import { BankType } from 'src/types/dictionaries/banks'
import { Category } from 'src/types/dictionaries/category'
import StatusEnumApplication from 'src/views/ui/status'
import { ProsentRates } from '../MerchantEdit/Interest'
const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))
type MerchantProfileType = {
  address: string
  auto_annual: string
  bank_account: string
  brandname: string
  cashback: string
  condition: string
  contract_expiry: string
  contract_no: string
  contract_start: string
  created_at: string
  group: string
  inn: string
  latitude: string
  logo: string
  longitude: string
  mfo: string
  name: string
  owner: string
  owner_phone: string
  password: string
  static_contract: string
  status: string
  tax_code: string
  username: string
  bank: BankType
  categories: []
  category: Category
}
const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
  return { name, calories, fat, carbs, protein }
}
export default function MerchantProfile({ data }: { data: MerchantProfileType }) {
  const theme = useTheme()
  const router = useRouter()
  const [apiData, setApiData] = useState<[]>([])

  const fetchData = async () => {
    const reponse = await DataService.get(endpoints.periodRate, { modelId: router.query?.id, modelName: 'merchant' })
    setApiData(reponse.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 13, color: theme.palette.grey[400], textTransform: 'uppercase', pb: 5 }}>
          <Translations text='merchant_information' />
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <TableContainer>
              <Table size='small' sx={{ width: '95%' }}>
                <TableBody
                  sx={{
                    '& .MuiTableCell-root': {
                      border: 0,
                      pt: 2,
                      pb: 2,
                      pl: '0 !important',
                      pr: '0 !important',
                      verticalAlign: 'unset',
                      '&:first-of-type': {
                        width: 200
                      }
                    }
                  }}
                >
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='name' /> :
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.name}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='contract_number' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.contract_no}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='expiration date' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {moment(data?.contract_expiry).format('DD.MM.yyyy ')}
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='contract_date' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {moment(data?.contract_start).format('DD.MM.yyyy')}
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Address' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.address}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='STIR' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.inn}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='bank_account' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.bank_account}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='bank' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.bank.name}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='mfo' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.mfo}</Typography>
                    </TableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={6}>
            <TableContainer>
              <Table size='small'>
                <TableBody
                  sx={{
                    '& .MuiTableCell-root': {
                      border: 0,
                      pt: 2,
                      pb: 2,
                      pl: '0 !important',
                      pr: '0 !important',
                      verticalAlign: 'unset',
                      '&:first-of-type': {
                        width: 200
                      }
                    }
                  }}
                >
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Owner' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.owner}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text="Owner's phone number" />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.owner_phone}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Tax code' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.tax_code}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Category' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {data?.categories?.map((item: any) => ` ${item?.category}`)}
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Login' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.username}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Password' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.password}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Conditions' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data?.condition}</Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Auto reset' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {data?.auto_annual}
                        {'  '}
                        <Translations text='month' />
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        <Translations text='Status' />:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>
                        <StatusEnumApplication status={data?.status as string} />
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {/* <Typography sx={{ fontSize: 13, color: theme.palette.grey[400], textTransform: 'uppercase', py: 8 }}>
          <Translations text='Interest' />
        </Typography>
        <TableContainer>
          {apiData?.length > 0 ? (
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Translations text='name' />
                  </TableCell>
                  <TableCell align='right'>
                    <Translations text='markup' />
                  </TableCell>

                  <TableCell align='right'>
                    <Translations text='min_markup' />
                  </TableCell>
                  <TableCell align='right'>
                    <Translations text='max_markup' />
                  </TableCell>
                  <TableCell align='center'>
                    <Translations text='period' />
                  </TableCell>
                  <TableCell align='center'>
                    <Translations text='Status' />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiData?.map((row: ProsentRates) => (
                  <TableRow
                    key={row?.id}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      {row?.tariffRate?.name}
                    </TableCell>
                    <TableCell align='right'>{row?.value}%</TableCell>

                    <TableCell align='right'>{row?.tariffRate?.minValue}%</TableCell>
                    <TableCell align='right'>{row?.tariffRate?.maxValue}%</TableCell>
                    <TableCell align='center'>
                      {moment(row?.start_date).format('DD.MM.yyyy') as string}-
                      {moment(row?.end_date).format('DD.MM.yyyy') as string}
                    </TableCell>

                    <TableCell align='center'>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
                        <Icon
                          fontSize={26}
                          icon={row.is_active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
                          color={row.is_active ? theme.palette.primary.main : theme.palette.grey[400]}
                        />
                        <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                          {row.is_active ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Typography variant='body2'>no data </Typography>
            </CardContent>
          )}
        </TableContainer> */}
      </CardContent>
    </Card>
  )
}

// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import { Card, CardHeader, CardContent } from '@mui/material'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { useDispatch, useSelector } from 'react-redux'

import CustomChip from 'src/@core/components/mui/chip'

// ** Actions Imports

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from 'src/views/pages/application/TabContent/TableHeader'
import TableHeader2 from '../application/TabContent/TableHeader2'
interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const MyApplicationList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const { t } = useTranslation()
  const theme = useTheme()
  const IconColor: any = {
    active: theme.palette.primary.main,
    pending: 'white',
    inactive: 'rgba(217, 216, 223, 1)'
  }
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'createdAt',
      maxWidth: 120,
      headerName: t('ID заявки') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              12345
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.32,
      minWidth: 500,
      field: 'fullName',
      headerName: t('Мерчант') as string,
      renderCell: ({ row }: CellType) => {
        const { fullName, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                flexWrap='wrap'
                component={Link}
                href={`/my-application/detail/${row.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Mediapark Group MChJ
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.28,
      field: 'phone',
      headerName: t('Начало кредита') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              01.01.2023{' '}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,

      field: 'currentLimit',
      headerName: t('Последняя оплата') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              000’000’000.00
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.status}
            color={userStatusObj[row.status]}
            // sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    }
  ]
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => router.push('/employee/add')
  return (
    <Card>
      <TableHeader2 value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
      <DataGrid
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
            whiteSpace: 'pre-wrap'
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
            whiteSpace: 'pre-wrap'
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
            whiteSpace: 'pre-wrap'
          }
        }}
        getRowHeight={() => 'auto'}
        autoHeight
        rowHeight={62}
        rows={[]}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default MyApplicationList

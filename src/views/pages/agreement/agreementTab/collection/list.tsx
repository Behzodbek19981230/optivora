// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { useTranslation } from 'react-i18next'
import { Chip, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from 'src/views/pages/application/TabContent/TableHeader'
import TableHeader2 from 'src/views/pages/application/TabContent/TableHeader2'

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: UsersType
}

const CollectionListTab = ({ tab }: { tab: string }) => {
  // ** State

  const { t } = useTranslation()
  const theme = useTheme()
  const columns: GridColDef[] = [
    {
      field: 'id',
      flex: 0.1,
      minWidth: 100,
      maxWidth: 100,
      headerName: 'ID',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.id}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'merchant',
      flex: 0.2,
      minWidth: 200,
      maxWidth: 450,
      headerName: t('merchant') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              Название компании
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'Client_full_name',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.25,
      headerName: t('Client_full_name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              Фамилия Имя Отчество{' '}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'fullName',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.2,
      headerName: t('Installment_amount') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                flexWrap='wrap'
                component={Link}
                href={`/buyer/list/detail/${row.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                000’000’000.00{' '}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'ttt',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.25,
      headerName: t('Application_date_and_time') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              01.01.2023 00:00:00
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'status',
      flex: 0.1,
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => {
        return <Chip label='Status' color='info' />
      }
    }
  ]
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => router.push('/employee/add')
  const handleRouterDetail = (id: number) => router.push(`/merchants/detail/${id}`)
  return (
    <Grid>
      <TableHeader2
        value={value}
        handleFilter={handleFilter}
        toggle={toggleAddUserDrawer}
        // handleClick={() =>
        //   router.push({
        //     pathname: `/merchants/create/`
        //   })
        // }
      />
      <DataGrid
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
            whiteSpace: 'normal'
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
            whiteSpace: 'normal'
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
            whiteSpace: 'normal'
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
        onCellClick={event => {
          handleRouterDetail(event.row.id)
        }}
      />
    </Grid>
  )
}

export default CollectionListTab

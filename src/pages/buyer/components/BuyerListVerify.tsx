// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from 'src/views/pages/application/TabContent/TableHeader'
import moment from 'moment'
import { ApiListStructure, ClientUserType, UserDataType } from 'src/context/types'
import downloadExcel from 'src/views/components/export/Excel'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import TableHeader2 from 'src/views/pages/application/TabContent/TableHeader2'

interface CellType {
  row: UsersType & ClientUserType
}

const BuyerListVerify = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [apiData, setApiData] = useState({} as ApiListStructure)
  const [exportLoading, setExportLoading] = useState(false)

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'created_at',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('Date_of_creation') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {moment(row.created_at).format('DD-MM-yyyy HH:mm')}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.22,
      maxWidth: 200,
      minWidth: 200,
      field: 'name',
      align: 'left',
      headerAlign: 'left',
      headerName: t('Full Name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                flexWrap='wrap'
                component={Link}
                href={`/buyer/${row.id}/info`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {`${row.name ?? ''} ${row.surname ?? ''}`}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      maxWidth: 200,
      minWidth: 200,
      field: 'phone',
      align: 'left',
      headerAlign: 'left',
      headerName: t('phone') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            +{row.username}{' '}
          </Typography>
        )
      }
    },
    {
      flex: 0.18,
      maxWidth: 200,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      field: 'current_limit',
      headerName: t('Current_limit') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              <CurrencyFormatter amount={row.limit as number} currency='sum' />
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      field: 'Overdue',
      maxWidth: 200,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      headerName: t('Delay_') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              <CurrencyFormatter amount={row.delay as number} currency='sum' />
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'status',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row?.is_active ? t('verified_') : t('noverified_')}
            color={row?.is_active ? 'success' : 'error'}
            // sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      field: 'Reminder',
      flex: 0.15,
      maxWidth: 200,
      minWidth: 200,
      headerName: t('Reminder') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.reminder}
            </Typography>
          </Box>
        )
      }
    }
  ]

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => router.push('/employee/add')
  const onExport = async () => {
    setExportLoading(true)
    const column = [
      {
        header: [columns[0].headerName as string],
        key: [columns[0].field as string],
        width: 50
      },
      {
        header: [columns[1].headerName as string],
        key: [columns[1].field as string],
        width: 30
      },
      {
        header: [columns[2].headerName as string],
        key: [columns[2].field as string],
        width: 30
      },
      {
        header: [columns[3].headerName as string],
        key: [columns[3].field as string],
        width: 30
      },
      {
        header: [columns[4].headerName as string],
        key: [columns[4].field as string],
        width: 30
      }
    ]
    const resAll = await DataService.get(endpoints.merchantClientsFilter, {
      search: value,
      is_active: true,
      page: 1,
      perPage: apiData?.pagination?.total
    })
    const data =
      resAll?.data?.result?.map((item: UsersType & ClientUserType) => ({
        [columns[0].field as string]: `${moment(item.created_at).format('DD.MM.YYYY HH:mm')}`,
        [columns[1].field as string]: `${item.surname ?? ''} ${item.name ?? ''} ${item.fathers_name ?? ''}`,
        [columns[2].field as string]: `+${item.username}`,
        [columns[3].field as string]: `${Number(item.limit) / 100}`,
        [columns[4].field as string]: `${Number(item.delay) / 100 ?? ''}`
      })) || []
    downloadExcel(data || [], column || [])
    setExportLoading(false)
  }
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({ page: 0, pageSize: 10 })

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resAll = await DataService.get(endpoints.merchantClientsFilter, {
        search: value,
        is_active: true,
        page: pagination.page + 1,
        perPage: pagination.pageSize
      })

      setApiData(resAll.data)
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
  }, [value, pagination])
  const handleRouterDetail = (row: UserDataType) => router.push(`/buyer/${row.id}/info`)
  return (
    <Grid>
      <Grid item xs={12}>
        <TableHeader2
          exportLoading={exportLoading}
          onExport={onExport}
          value={value}
          handleFilter={handleFilter}
          toggle={toggleAddUserDrawer}
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
          rowCount={apiData?.pagination?.total}
          rowHeight={62}
          rows={apiData?.result || []}
          loading={isLoading}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode='server'
          onPaginationModelChange={e => {
            setPaginationModel({ ...e })
            setPagination(e)
          }}
          onCellClick={event => {
            handleRouterDetail(event.row)
          }}
        />
      </Grid>
    </Grid>
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

export default BuyerListVerify

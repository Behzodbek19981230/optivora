import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, Chip, IconButton, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from 'src/views/pages/application/TabContent/TableHeader'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import PageHeader from 'src/@core/components/page-header'
import { ApplicationUserType } from 'src/context/types'
import moment from 'moment'
import StatusEnumApplication from 'src/views/ui/status'
import { Icon } from '@iconify/react'
import TableHeader2 from 'src/views/pages/application/TabContent/TableHeader2'

interface CellType {
  row: ApplicationUserType
}
const ApplicationList = () => {
  const { t } = useTranslation()
  const params = useRouter()
  const theme = useTheme()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()
  const [apiData, setApiData] = useState()
  const columns: GridColDef[] = [
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
              {row.merchant?.name}
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
              {row.MyID?.profile?.common_data?.last_name +
                ' ' +
                row.MyID?.profile?.common_data?.first_name +
                ' ' +
                row.MyID?.profile?.common_data?.middle_name}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'phone',
      minWidth: 200,
      maxWidth: 200,
      flex: 0.1,
      headerName: t('phone') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              +{row.add_phone}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'contract_date',
      minWidth: 200,
      maxWidth: 200,
      flex: 0.25,
      headerName: t('Application_date_and_time') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {moment(row.contract_date).format('DD.MM.YYYY')}
            </Typography>
          </Box>
        )
      }
    },

    {
      field: 'status',
      flex: 0.1,
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => (
        <StatusEnumApplication status={row.status as string} state={row.state as string} />
      )
    },
    {
      flex: 0.1,
      maxWidth: 100,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => router.push(`/application/steps/${row?.id}`)}>
            <Icon icon='tabler:edit' />
          </IconButton>
        </Box>
      )
    }
  ]
  const fetchData = async () => {
    const response = await DataService.get(endpoints.userApplicationList(params.query?.id))
    setApiData(response?.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => router.push('/employee/add')
  const handleRouterDetail = (id: number) => router.push(`/merchants/detail/${id}`)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* @ts-ignore */}
      <PageHeader
        title={
          <Typography variant='h4'>
            {/* @ts-ignore */}
            {apiData ? apiData[0]?.user.name + ' ' + apiData[0]?.user.surname : ''}
          </Typography>
        }
      />
      <Card>
        <TableHeader2 value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
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
          rows={apiData || []}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          // onCellClick={event => {
          //   handleRouterDetail(event.row.id)
          // }}
        />
      </Card>
    </Box>
  )
}

export default ApplicationList

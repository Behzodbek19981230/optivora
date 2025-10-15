import { useState, useEffect, useCallback } from 'react'
import { Card } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { ApiListStructure, ApplicationUserType, apiStructure } from 'src/context/types'
import moment from 'moment'
import StatusEnumApplication from 'src/views/ui/status'
import { Icon } from '@iconify/react'
import downloadExcel from 'src/views/components/export/Excel'
import TableHeader from './TableHeader'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { StatusesEnum } from 'src/configs/const'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import TableHeader2 from './TableHeader2'

interface CellType {
  row: ApplicationUserType
}

const ApplicationList = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [apiData, setApiData] = useState({} as ApiListStructure)
  const auth = useAuth()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({ page: 0, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(false)
  const fetchData = async () => {
    setIsLoading(true)

    const response = await DataService.get(endpoints.userApplicationList(router.query?.id), {
      search: value,
      page: pagination.page + 1,
      perPage: pagination.pageSize
    })
    setApiData(response?.data)
    setIsLoading(false)
  }
  useEffect(() => {
    fetchData()
  }, [value, pagination])
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      maxWidth: 120,
      minWidth: 120,
      headerName: t('Application_ID') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.id}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'Client_full_name',
      minWidth: 200,
      maxWidth: 250,
      flex: 0.25,
      headerName: t('Client_full_name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar src={row?.image ?? ''} sx={{ mr: 2.5, width: 38, height: 38 }} />
            <Typography sx={{ flexWrap: 'wrap', whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 500 }}>
              {`${row.user?.name ?? ''} ${row.user?.surname ?? ''} ${row.user?.fathers_name ?? ''}`}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.32,
      minWidth: 250,
      maxWidth: 250,
      field: 'name',
      headerName: t('merchant') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                flexWrap='wrap'
                component={Link}
                href={`/buyer/${router.query?.id}/application-detail/${row?.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {row.merchant?.name ?? row.branch?.name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.28,
      minWidth: 200,
      maxWidth: 200,
      field: 'contract_date',

      headerName: t('registration_date') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {moment(row.contract_date).format('DD-MM-YYYY')}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      maxWidth: 200,
      minWidth: 200,
      field: 'currentLimit',
      headerName: t('Commodity_sum') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              <CurrencyFormatter
                amount={row.products?.reduce((sum, product) => sum + product.count * Number(product.price), 0) as number}
                currency='sum'
              />
            </Typography>
          </Box>
        )
      }
    },

    {
      maxWidth: 150,
      minWidth: 150,
      field: 'status',
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => (
        <StatusEnumApplication status={row.status as string} state={row.state as string} />
      )
    },
    {
      maxWidth: 100,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.status != StatusesEnum.scheduling && (auth.user?.role == 'merchant' || auth.user?.role == 'branch') ? (
            <IconButton onClick={() => router.push(`/application/steps/${row?.id}`)}>
              <Icon icon='tabler:edit' />
            </IconButton>
          ) : (
            <IconButton onClick={() => router.push(`/buyer/${router.query?.id}/application-detail/${row?.id}`)}>
              <Icon icon='tabler:eye' />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const onExport = () => {
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
    const data =
      apiData?.result?.map((item: any) => ({
        [columns[0].field as string]: `${item?.id}`,

        [columns[1].field as string]: `${item?.merchant?.name}`,

        [columns[2].field as string]: `${moment(item?.contract_date).format('DD-MM-YYYY')}`,

        [columns[3].field as string]: `000’000’000.00`,

        [columns[4].field as string]: `${item.status}`
      })) || []
    downloadExcel(data || [], column || [])
  }
  return (
    <Card>
      <TableHeader2 value={value} handleFilter={handleFilter} onExport={onExport} />
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
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: 'normal'
          },
          '& .MuiDataGrid-columnHeader': {
            // Forced to use important since overriding inline styles
            height: 'unset !important'
          },
          '& .MuiDataGrid-columnHeaders': {
            // Forced to use important since overriding inline styles
            maxHeight: '150px !important'
          }
        }}
        getRowHeight={() => 'auto'}
        autoHeight
        rowHeight={62}
        loading={isLoading}
        rows={apiData?.result || []}
        rowCount={apiData?.pagination?.total}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        paginationMode='server'
        onPaginationModelChange={e => {
          setPaginationModel({ ...e })
          setPagination(e)
        }}
      />
    </Card>
  )
}

export default ApplicationList

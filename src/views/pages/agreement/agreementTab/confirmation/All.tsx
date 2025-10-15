// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { Chip, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from 'src/views/pages/application/TabContent/TableHeader'
import { ApiListStructure, ApplicationInfo, ApplicationUserType } from 'src/context/types'
import moment from 'moment'
import StatusEnumApplication from 'src/views/ui/status'
import downloadExcel from 'src/views/components/export/Excel'
import CustomAvatar from 'src/@core/components/mui/avatar'
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import { useAuth } from 'src/hooks/useAuth'
import { StatesEnum } from 'src/configs/const'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import { MerchantType } from 'src/types/dictionaries/merchantType'
import TableHeaderMerchant from 'src/views/pages/application/TabContent/TableHeaderMerchant'

interface CellType {
  row: ApplicationInfo & ApplicationUserType
}

const ConfirmationListTabAll = ({ refresh }: { refresh: string }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const user = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [apiData, setApiData] = useState({} as ApiListStructure)
  const todayDate = new Date()
  todayDate.setDate(todayDate.getDate() + 1)
  const [fromDate, setFromDate] = useState<string>(new Date('2024-01-31').toDateString())
  const [toDate, setToDate] = useState<string>(todayDate.toDateString())
  const [branch, setBranch] = useState<[]>([])
  const [branchCurrent, setCurrentBranch] = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 100,
      maxWidth: 100,
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
      maxWidth: 250,
      minWidth: 250,
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
      field: 'merchant',
      flex: 0.2,
      maxWidth: 250,
      minWidth: 200,
      headerName: t('merchant') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.merchant?.name ?? row.branch?.name}
            </Typography>
          </Box>
        )
      }
    },

    {
      field: 'loan_sum',
      maxWidth: 180,
      minWidth: 180,
      flex: 0.2,
      headerName: t('Installment_amount') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                <CurrencyFormatter amount={Number(row?.total_sum) ?? 0} currency='sum' />
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'product_sum',
      maxWidth: 180,
      minWidth: 180,
      flex: 0.2,
      headerName: t('Commodity_sum') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                <CurrencyFormatter
                  amount={
                    row?.products?.reduce((accumulator, product: { price: string }) => {
                      return accumulator + (isNaN(Number(product?.price)) ? 0 : Number(product?.price))
                    }, 0) ?? 0
                  }
                  currency='sum'
                />
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'created_at',
      maxWidth: 200,
      minWidth: 200,
      flex: 0.25,
      headerName: t('Application_date_and_time') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {moment(row?.created_at).format('DD-MM-yyyy HH:mm')}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'status',
      flex: 0.1,
      maxWidth: 200,
      minWidth: 200,
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => {
        return <StatusEnumApplication status={row?.status as string} state={row?.state as string} />
      }
    },
    {
      field: 'reason_error',
      flex: 0.2,
      minWidth: 200,
      maxWidth: 200,
      headerName: t('reason_error') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              sx={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {row.state == StatesEnum.failed ? t(row.reason_error as string) : ''}
            </Typography>
          </Box>
        )
      }
    }
  ]
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()
  const [params, setParams] = useState<{}>({
    merchant: !user.user?.merchant ? router.query?.id : null
  })

  const handleFilter = async (
    val: string,
    fromDate?: string,
    toDate?: string,
    merchant?: number | null,
    branch?: number | null
  ) => {
    setValue(val)

    try {
      setIsLoading(true)
      setParams({
        search: value,
        page: pagination.page + 1,
        perPage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? (router.query?.id as string | null) ?? merchant : null,
        from: moment(fromDate).toISOString(),
        to: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'),
        branch: branch
      })
      const resAll = await DataService.get(endpoints.applicationApprovedFilter, {
        search: val,
        page: pagination.page + 1,
        perPage: pagination.pageSize,
        merchant: !(user.user?.merchant || user.user?.branch) ? router.query?.id ?? merchant : null,
        from: moment(fromDate).toISOString(),
        to: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'),
        branch: branch
      })

      setApiData(resAll.data)
      setIsLoading(false)
    } catch (err: any) {}
  }
  const toggleAddUserDrawer = () => router.push('/employee/add')
  const handleRouterDetail = (row: ApplicationInfo & ApplicationUserType) =>
    router.push(`/buyer/${row.user?.id}/application-detail/${row.id}`)
  const onExport = async () => {
    setExportLoading(true)
    const resAll = await DataService.get(endpoints.applicationApprovedFilter, {
      ...params,
      search: value,
      page: 1,
      perPage: apiData?.pagination?.total
    })

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
      { header: [columns[4].headerName as string], key: [columns[4].field as string], width: 30 }
    ]
    const data =
      resAll?.data?.result?.map((item: ApplicationInfo & ApplicationUserType) => ({
        [columns[0].field as string]: `${item?.id}`,
        [columns[1].field as string]: `${item?.user?.surname} ${item?.user?.name} ${item?.user?.fathers_name}`,

        [columns[2].field as string]: `${item?.merchant?.name ?? ''}`,

        [columns[3].field as string]: `${item?.total_sum ?? ''}`,

        [columns[4].field as string]: `${moment(item.created_at).format('DD.MM.YYYY HH:mm')}`
      })) || []
    downloadExcel(data || [], column || [])
    setExportLoading(false)
  }
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({ page: 0, pageSize: 10 })
  const fetchData = async () => {
    try {
      setIsLoading(true)

      const resAll = await DataService.get(endpoints.applicationApprovedFilter, {
        ...params,
        page: pagination.page + 1,
        perPage: pagination.pageSize
      })

      setApiData(resAll.data)
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
  }, [pagination, refresh])
  return (
    <Grid>
      <TableHeader
        onExport={onExport}
        exportLoading={exportLoading}
        handleFilter={handleFilter}
        toggle={toggleAddUserDrawer}
        fromDate={fromDate}
        toDate={toDate}
        data={branch}
        changeBranch={e => setCurrentBranch(e)}
        onChangeFrom={(e: any) => setFromDate(e)}
        onChangeTo={(e: any) => setToDate(e)}
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
        paginationMode='server'
        rowCount={apiData?.pagination?.total ?? 0}
        rowHeight={62}
        rows={apiData?.result || []}
        loading={isLoading}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={e => {
          setPaginationModel({ ...e })
          setPagination(e)
        }}
        onCellClick={event => {
          handleRouterDetail(event.row)
        }}
      />
    </Grid>
  )
}

export default ConfirmationListTabAll

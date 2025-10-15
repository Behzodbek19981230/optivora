// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AvatarGroup from '@mui/material/AvatarGroup'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import { Icon } from '@iconify/react'
// ** Third Party Imports
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { ProjectTableRowType } from 'src/@fake-db/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import TableHeader from './TableHeader'
import { useRouter } from 'next/router'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useAuth } from 'src/hooks/useAuth'
import { ApiListStructure, ClientUserType, UserDataType, apiStructure } from 'src/context/types'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import Translations from 'src/layouts/components/Translations'
import { IconButton } from '@mui/material'
import downloadExcel from 'src/views/components/export/Excel'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'

interface CellType {
  row: ClientUserType
}

// ** renders name column
const renderName = (row: ClientUserType) => {
  if (row?.id) {
    //@ts-ignore
    return <CustomAvatar src={row?.image} sx={{ mr: 2.5, width: 38, height: 38 }} />
  }
}

const ApplicationsList = () => {
  const auth = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [apiData, setApiData] = useState({} as ApiListStructure)
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const columns: GridColDef[] = [
    {
      field: 'name',
      minWidth: 220,
      maxWidth: 420,
      headerName: t('Client_full_name') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderName(row)}
            <Typography sx={{ flexWrap: 'wrap', whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 500 }}>
              {row.surname} {row.name} {row.fathers_name}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 105,
      maxWidth: 305,
      field: 'leader',
      headerName: t('Application_date_and_time') as string,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {moment(row.application_date).format('DD.MM.YYYY HH:mm')}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'team',
      maxWidth: 320,
      minWidth: 120,
      sortable: false,
      headerName: t('Installment_amount') as string,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          <CurrencyFormatter amount={row.loan_sum as number} currency='sum' />
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      maxWidth: 250,
      field: 'phone',
      headerName: t('phone') as string,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>+{row.username}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 250,
      maxWidth: 250,
      field: 'address',
      headerName: t('Residence address') as string,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ flexWrap: 'wrap', whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
          {row.address}
        </Typography>
      )
    }
  ]
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({ page: 0, pageSize: 10 })

  const fetchData = async () => {
    try {
      setIsLoading(true)

      if (auth.user?.merchant?.id) {
        const res = await DataService.get(endpoints.merchantClients(auth.user?.merchant?.id), {
          search: value,
          page: pagination.page + 1,
          perPage: pagination.pageSize
        })
        setApiData(res.data)
      }
      if (auth?.user?.branch?.id) {
        const res = await DataService.get(endpoints.merchantClients(auth.user?.branch?.id), {
          search: value,
          page: pagination.page + 1,
          perPage: pagination.pageSize
        })
        setApiData(res.data)
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [value, paginationModel])

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const onExport = async () => {
    setExportLoading(true)
    let res
    if (auth.user?.merchant?.id) {
      res = await DataService.get(endpoints.merchantClients(auth.user?.merchant?.id), {
        search: value,
        page: 1,
        perPage: apiData?.pagination.total
      })
    }
    if (auth?.user?.branch?.id) {
      res = await DataService.get(endpoints.merchantClients(auth.user?.branch?.id), {
        search: value,
        page: 1,
        perPage: apiData?.pagination.total
      })
    }

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
      res?.data?.result?.map((item: ClientUserType) => ({
        [columns[0].field as string]: `${item.surname ?? ''} ${item.name ?? ''} ${item.fathers_name ?? ''}`,

        [columns[1].field as string]: `${moment(item.created_at).format('DD.MM.YYYY HH:mm')}`,

        [columns[2].field as string]: `${item.loan_sum}`,

        [columns[3].field as string]: `+${item.username}`,

        [columns[4].field as string]: `${item.address ?? ''}`
      })) || []
    downloadExcel(data || [], column || [], `${t('Application')}_${moment().format('DD.MM.YYYY HH:mm')}`)
    setExportLoading(false)
  }
  return data ? (
    <Card>
      <TableHeader
        exportLoading={exportLoading}
        onExport={onExport}
        handleFilter={handleFilter}
        value={value}
        toggle={() => 232}
        handleClick={() => router.push('/application/create')}
      />

      <DataGrid
        autoHeight
        pagination
        getRowHeight={() => 'auto'}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 2
          },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer'
          }
        }}
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
        onCellClick={row => router.push(`application/${row?.id}/info`)}
      />
    </Card>
  ) : null
}

export default ApplicationsList

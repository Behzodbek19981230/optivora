import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { EmployeeType } from 'src/context/types'
import Translations from 'src/layouts/components/Translations'
import { MerchantType } from 'src/types/dictionaries/merchantType'
import downloadExcel from 'src/views/components/export/Excel'
import TableHeader2 from 'src/views/pages/application/TabContent/TableHeader2'
import TableHeaderEmployee from 'src/views/pages/application/TabContent/TableHeaderEmployee'
import TableHeader from 'src/views/pages/employee/TableHeader'
interface CellType {
  row: EmployeeType
}

const renderClient = (row: EmployeeType) => {
  if (row.image) {
    return <CustomAvatar src={process.env.NEXT_PUBLIC_BASE_URL + row?.image} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials((row?.name ?? '') + ' ' + (row?.surname ?? ''))}
      </CustomAvatar>
    )
  }
}

const ActivatedList: React.FC<{ apiData?: any; onFilter: (val: string) => void }> = ({ apiData, onFilter }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'name',
      headerName: t('Full Name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                // component={Link}
                // href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {(row?.name ?? '') + ' ' + (row?.surname ?? '') + ' ' + (row?.fathers_name ?? '')}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 170,
      headerName: t('Role') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              <Translations text={row.role as string} />
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'status',
      minWidth: 170,
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
          <Icon
            fontSize={26}
            icon={row.is_active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
            color={row.is_active ? theme.palette.primary.main : theme.palette.grey[400]}
          />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.is_active ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
          </Typography>
        </Box>
      )
    },

    // {
    //   flex: 0.1,
    //   minWidth: 110,
    //   field: 'status',
    //   headerName: t('Status') as string,
    //   headerAlign: 'center',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
    //         <Icon
    //           fontSize={26}
    //           icon={row.status == 'active' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
    //           color={row.status == 'active' ? theme.palette.primary.main : theme.palette.grey[400]}
    //         />
    //         <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
    //           {row.status == 'active' ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
    //         </Typography>
    //       </Box>
    //     )
    //   }
    // },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerName: t('Actions') as string,
      renderCell: ({ row }: CellType) => (
        <IconButton size='small' onClick={() => router.push(`/employee/edit/${row.id}`)}>
          <Icon icon='tabler:edit' color={theme.palette.primary.main} fontSize={20} />
        </IconButton>
      )
    }
  ]
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
    onFilter(val)
  }, [])
  const toggleAddUserDrawer = () => router.push('/employee/add')

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
      // {
      //   header: [columns[4].headerName as string],
      //   key: [columns[4].field as string],
      //   width: 30
      // },
      {
        header: t('Contract_number'),
        key: 'contract',
        width: 20
      }
    ]
    const data =
      apiData?.map((item: MerchantType) => ({
        [columns[0].field as string]: `${item.name}`,
        [columns[1].field as string]: `${item.group}`,
        [columns[2].field as string]: `${moment(item.created_at).format('DD.MM.YYYY HH:mm')}`,
        [columns[3].field as string]: `${item.owner_phone}`,
        // [columns[4].field as string]: `${item.status == 'active' ? t('Activate') : t('Deactivate')}`,
        contract: `${item.contract_no}`
      })) || []
    console.log(data)

    downloadExcel(data || [], column || [])
  }
  useEffect(() => {
    console.log(apiData)
  }, [])
  return (
    <Grid>
      <Grid item xs={12}>
        <TableHeaderEmployee value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
        <DataGrid
          autoHeight
          rowHeight={62}
          rows={apiData || []}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Grid>
    </Grid>
  )
}

export default ActivatedList

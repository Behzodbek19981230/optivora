import { Card, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import { getInitials } from 'src/@core/utils/get-initials'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { MerchantUserType } from 'src/context/types'
import Translations from 'src/layouts/components/Translations'

interface CellType {
  row: MerchantUserType
}
// ** renders client column
const renderClient = (row: MerchantUserType) => {
  if (row.avatar) {
    return <CustomAvatar src={process.env.NEXT_PUBLIC_BASE_URL + row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
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

const MerchantUsers = ({ id }: { id: string }) => {
  // ** State
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'fullName',
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
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={row?.is_active ? t('verified_') : t('noverified_')}
                color={row?.is_active ? 'success' : 'error'}
                // sx={{ textTransform: 'capitalize' }}
              />
            </Typography>
          </Box>
        )
      }
    }
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   field: 'actions',
    //   headerAlign: 'center',
    //   align: 'center',

    //   headerName: t('Actions') as string,
    //   renderCell: ({ row }: CellType) => (
    //     <IconButton size='small'>
    //       <Icon icon='tabler:edit' color={theme.palette.primary.main} fontSize={20} />
    //     </IconButton>
    //   )
    // }
  ]
  const [apiData, setApiData] = useState<[]>()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const fetchData = async () => {
    const response = await DataService.get(endpoints.merchantUsers(router.query?.id))
    setApiData(response?.data?.result)
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Card>
      <Grid>
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={apiData ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default MerchantUsers

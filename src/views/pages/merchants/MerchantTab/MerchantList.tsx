import { useState, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, IconButton, Switch, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from '../TableHeader'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import toast from 'react-hot-toast'
import { MerchantType } from 'src/types/dictionaries/merchantType'
import moment from 'moment'
import DeleteModal from 'src/views/components/modals/DeleteModal'
import downloadExcel from 'src/views/components/export/Excel'

interface CellType {
  row: MerchantType
}

const MerchantListTab = ({
  apiData,
  fetchData,
  value,
  setValue
}: {
  apiData: []
  fetchData: () => void
  value: string
  setValue: (item: string) => void
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const UpdateStatus = async (row: MerchantType) => {
    try {
      const status = row?.status == 'active' ? 'blocked' : 'active'
      await DataService.put(endpoints.merchant + `/${row.id}`, { status })
      toast.success(t('edited_successfully') as string)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }
  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'name',
      maxWidth: 250,

      headerName: t('name') as string,
      headerAlign: 'left',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.name}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 1,
      field: 'group',
      maxWidth: 250,
      headerName: t('Group') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                flexWrap='wrap'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {row.group}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      field: 'created_at',
      maxWidth: 200,
      headerName: t('created_at') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {moment(row.created_at).format('DD.MM.YYYY HH:mm').toString()}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 1,
      maxWidth: 200,
      field: 'phone',
      headerName: t('phone') as string,
      headerAlign: 'left',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
            <Icon icon='tabler:brand-telegram' color={theme.palette.primary.main} />
            <Typography
              component={Link}
              href={`tel:${row.owner_phone}`}
              flexWrap='wrap'
              sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
            >
              {row.owner_phone}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 1,
      maxWidth: 200,
      minWidth: 200,
      field: 'status',
      headerName: t('Status') as string,
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
            <FormControlLabel
              control={<Switch defaultChecked={row.status == 'active'} size='small' />}
              onChange={() => {
                UpdateStatus(row)
              }}
              label={row.status == 'active' ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
            />

            {/* <Icon
              fontSize={26}
              icon={row.status == 'active' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
              color={row.status == 'active' ? theme.palette.primary.main : theme.palette.grey[400]}
            />
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.status == 'active' ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
            </Typography> */}
          </Box>
        )
      }
    },
    {
      flex: 1,
      field: 'action',
      align: 'right',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('Actions') as string,
      headerAlign: 'right',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <IconButton
              onClick={() => {
                router.push(`/merchants/detail/${row.id}`)
              }}
            >
              <Icon icon='tabler:eye' fontSize={18} />
            </IconButton>
            <IconButton
              onClick={() => {
                router.push(`/merchants/edit/${row.id}`)
              }}
            >
              <Icon icon='tabler:edit' fontSize={18} />
            </IconButton>
            <IconButton
              onClick={() => {
                setOpenDelete(true), setCurrentDelete({ row })
              }}
            >
              <Icon icon='tabler:trash' fontSize={18} />
            </IconButton>
          </Box>
        )
      }
    }
  ]
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [currentDelete, setCurrentDelete] = useState<CellType>()
  const [data, setData] = useState<[]>()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()

  const onDelete = async () => {
    try {
      await DataService.delete(endpoints.merchant + `/${currentDelete?.row.id}`)
      toast.success(t('deleted_successfully') as string)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    }
    setOpenDelete(false)
    setCurrentDelete(undefined)
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
      },
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
        [columns[4].field as string]: `${item.status == 'active' ? t('Activate') : t('Deactivate')}`,
        contract: `${item.contract_no}`
      })) || []
    downloadExcel(data || [], column || [])
  }

  return (
    <Grid>
      <TableHeader
        onExport={onExport}
        value={value}
        handleFilter={e => setValue(e)}
        toggle={() => {}}
        handleClick={() =>
          router.push({
            pathname: `/merchants/create/`
          })
        }
      />
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
        rows={apiData || []}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <DeleteModal
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        handleDelete={onDelete}
        title={currentDelete?.row.name as string}
      />
    </Grid>
  )
}

export default MerchantListTab

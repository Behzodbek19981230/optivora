import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, Button, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { Icon } from '@iconify/react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import FormModal from 'src/views/components/modals/FormModal'
import toast from 'react-hot-toast'
import DeleteModal from 'src/views/components/modals/DeleteModal'
import { BankBranchType } from 'src/types/dictionaries/banks'

interface CellType {
  row: BankBranchType
}

const BankBranch = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [apiData, setApiData] = useState<[]>()
  const [state, setState] = useState<BankBranchType | any>()
  const [stateEdite, setStateEdite] = useState<BankBranchType | any>()
  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [currentData, setCurrentData] = useState<BankBranchType>()
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleSave = async () => {
    try {
      await DataService.post(endpoints.bankBraches, state)
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
    } catch (err: any) {
      console.log(err)

      toast.error(err)
    }
  }
  const handleEdit = async () => {
    try {
      await DataService.put(endpoints.bankBrachById(currentData?.id), stateEdite)
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
    } catch (err: any) {
      console.log(err)

      // toast.error(err.message)
    }
  }
  const handleClose = () => {
    setOpen(false)
    setOpenDelete(false)
    setOpenEdit(false)
    setCurrentData(undefined)
  }

  const fetchData = async () => {
    try {
      const response = await DataService.get(endpoints.bankBraches, { search: value })

      setApiData(response.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [value])
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      field: 'name',
      headerName: t('name') as string,
      minWidth: 400,
      maxWidth: 400,
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
      flex: 0.18,
      field: 'code',
      maxWidth: 150,
      minWidth: 150,
      headerName: t('code') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.code}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      field: 'bank',
      maxWidth: 150,
      minWidth: 150,
      headerName: t('bank') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.bank?.name}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      field: 'region',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('region') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.region}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      field: 'district',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('district') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.district}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      field: 'stir',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('STIR') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.stir}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.15,
      field: 'address',
      minWidth: 370,
      maxWidth: 370,
      headerName: t('Address') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{row.address}</Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerName: t('Actions') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            size='small'
            onClick={() => {
              setCurrentData(row), setOpenDelete(true)
            }}
          >
            <Icon icon='tabler:trash' color={theme.palette.primary.main} fontSize={20} />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => {
              setCurrentData(row)
              setOpenEdit(true)
            }}
          >
            <Icon icon='tabler:edit' color={theme.palette.primary.main} fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const onDelete = async () => {
    try {
      await DataService.delete(endpoints.bankBrachById + `/${currentData?.id}`)
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Card>
      <FormModal handleClose={handleClose} open={open} handleSave={handleSave} title=''>
        <form ref={formRef}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              fullWidth
              name='name'
              // value={value}
              onChange={e => setState({ ...state, name: e.target.value as string })}
              label={t('name') as string}
              placeholder={t('name') as string}
              required
            />

            <CustomTextField
              fullWidth
              name='inn'
              type='number'
              onChange={e => setState({ ...state, inn: e.target.value })}
              label={t('STIR') as string}
              placeholder={t('STIR') as string}
              required
            />
            <CustomTextField
              fullWidth
              // value={value}
              onChange={e => setState({ ...state, mfo: e.target.value })}
              type='number'
              name='mfo'
              label={t('mfo') as string}
              placeholder={t('mfo') as string}
              required
            />
          </Box>
        </form>
      </FormModal>
      <FormModal handleClose={handleClose} open={openEdit} handleSave={handleEdit} title=''>
        <form ref={formRef}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              fullWidth
              name='name'
              // value={value}
              defaultValue={currentData?.name}
              onChange={e => setStateEdite({ ...stateEdite, name: e.target.value as string })}
              label={t('name') as string}
              placeholder={t('name') as string}
              required
            />
            <CustomTextField
              fullWidth
              name='code'
              // value={value}
              defaultValue={currentData?.code}
              onChange={e => setStateEdite({ ...stateEdite, code: e.target.value as string })}
              label={t('code') as string}
              placeholder={t('code') as string}
              required
            />

            <CustomTextField
              fullWidth
              // value={value}
              name='inn'
              onChange={e => setStateEdite({ ...stateEdite, inn: e.target.value })}
              defaultValue={currentData?.stir}
              label={t('STIR') as string}
              placeholder={t('STIR') as string}
              required
            />
            <CustomTextField
              fullWidth
              name='region'
              // value={value}
              defaultValue={currentData?.region}
              onChange={e => setStateEdite({ ...stateEdite, region: e.target.value as string })}
              label={t('region') as string}
              placeholder={t('region') as string}
              required
            />
            <CustomTextField
              fullWidth
              name='district'
              // value={value}
              defaultValue={currentData?.district}
              onChange={e => setStateEdite({ ...stateEdite, district: e.target.value as string })}
              label={t('district') as string}
              placeholder={t('district') as string}
              required
            />
            <CustomTextField
              fullWidth
              // value={value}
              name='address'
              onChange={e => setStateEdite({ ...stateEdite, address: e.target.value })}
              defaultValue={currentData?.address}
              label={t('Address') as string}
              placeholder={t('Address') as string}
              required
            />
          </Box>
        </form>
      </FormModal>
      <DeleteModal
        title={currentData?.name as string}
        open={openDelete}
        handleClose={handleClose}
        handleDelete={onDelete}
      />

      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder={t('Search') ?? ''}
          onChange={e => handleFilter(e.target.value)}
        />

        {/* <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={() => setOpen(true)}>
          <Translations text='add' />
        </Button> */}
      </CardContent>
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
    </Card>
  )
}

export default BankBranch

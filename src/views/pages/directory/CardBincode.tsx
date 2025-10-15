import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Card,
  CardContent,
  Button,
  IconButton,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from '@mui/material'
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
import toast from 'react-hot-toast'
import DeleteModal from 'src/views/components/modals/DeleteModal'
import { BincodeType, CardtypeType } from 'src/context/types'
interface CellType {
  row: BincodeType
}
const CardBincode = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [apiData, setApiData] = useState<[]>()
  const [state, setState] = useState<BincodeType>()
  const [stateEdite, setStateEdite] = useState<BincodeType>()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [currentData, setCurrentData] = useState<BincodeType>()
  const [errors, setErrors] = useState<any>({ prefix: '', card_type: '' })
  const handleSave = async (e: any) => {
    e.preventDefault()
    try {
      if (!state?.prefix) {
        setErrors({ ...errors, prefix: 'Prefix is required' })
      } else {
        setErrors({ ...errors, prefix: '' })
        if (!state?.card_type) {
          setErrors({ ...errors, card_type: 'Card type is required' })
        } else {
          await DataService.post(endpoints.bincodes, state)
          toast.success(<Translations text='Success!' />)
          handleClose()
          fetchData()
          // @ts-ignore
          setState()
        }
      }
    } catch (err: any) {
      toast.error(err)
    }
  }
  const handleEdit = async (e: any) => {
    e.preventDefault()
    try {
      await DataService.put(endpoints.bincodeById(currentData?.id), stateEdite)
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
      // @ts-ignore
      setStateEdite()
    } catch (err: any) {
      toast.error(err)
    }
  }
  const handleClose = () => {
    setOpen(false)
    setOpenDelete(false)
    setOpenEdit(false)
    setCurrentData(undefined)
    setErrors({ prefix: '', card_type: '' })
  }

  const fetchData = async () => {
    try {
      const rep = await DataService.get(endpoints.bincodes, { search: value })
      setApiData(rep.data?.result)
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
      field: 'prefix',
      headerName: t('prefix') as string,
      minWidth: 200,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.prefix}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.18,
      field: 'card_type',
      headerName: t('card_type') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              {row?.card_type}
            </Typography>
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
      await DataService.delete(endpoints.bincodeById(currentData?.id))
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
    } catch (err: any) {
      handleClose()

      toast.error(err)
    }
  }

  return (
    <Card>
      <Dialog
        fullWidth={true}
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <form onSubmit={handleSave}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <CustomTextField
                required
                fullWidth
                inputProps={{ maxLength: 4 }}
                name='prefix'
                onChange={e => setState({ ...state, prefix: e.target.value as string })}
                label={t('prefix') as string}
                placeholder={t('prefix') as string}
                error={Boolean(errors?.prefix)}
                aria-describedby='validation-basic-first-name'
                {...(errors?.prefix && { helperText: 'This field is required' })}
              />

              <CustomTextField
                select
                required
                fullWidth
                name='card_type'
                label={t('card_type') as string}
                id='validation-basic-select'
                error={Boolean(errors?.card_type)}
                aria-describedby='validation-basic-select'
                // @ts-ignore
                onChange={e => setState({ ...state, card_type: e.target.value as CardtypeType })}
                {...(errors?.card_type && { helperText: 'This field is required' })}
              >
                <MenuItem value='uzcard'>uzcard</MenuItem>
                <MenuItem value='humo'>humo</MenuItem>
              </CustomTextField>
            </Box>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>
              <Translations text='Cancel' />
            </Button>
            <Button type='submit'>
              <Translations text='Save' />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        fullWidth={true}
        open={openEdit}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <form onSubmit={handleEdit}>
          <DialogTitle id='alert-dialog-title'>
            <Translations text={`${currentData?.prefix}`} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <CustomTextField
                fullWidth
                name='prefix'
                required
                inputProps={{ maxLength: 4 }}
                defaultValue={currentData?.prefix}
                onChange={e => setState({ ...state, prefix: e.target.value as string })}
                label={t('prefix') as string}
                placeholder={t('prefix') as string}
                error={Boolean(errors?.prefix)}
                aria-describedby='validation-basic-first-name'
                {...(errors?.prefix && { helperText: 'This field is required' })}
              />

              <CustomTextField
                select
                fullWidth
                required
                defaultValue={currentData?.card_type}
                name='card_type'
                label={t('card_type') as string}
                id='validation-basic-select'
                error={Boolean(errors?.card_type)}
                aria-describedby='validation-basic-select'
                // @ts-ignore
                onChange={e => setStateEdite({ ...stateEdite, card_type: e.target.value as string })}
                {...(errors?.card_type && { helperText: 'This field is required' })}
              >
                <MenuItem value='uzcard'>uzcard</MenuItem>
                <MenuItem value='humo'>humo</MenuItem>
              </CustomTextField>
            </Box>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleClose}>
              <Translations text='Cancel' />
            </Button>
            <Button type='submit'>
              <Translations text='Save' />
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteModal
        title={currentData?.prefix as string}
        open={openDelete}
        handleClose={handleClose}
        handleDelete={onDelete}
      />
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          <Translations text='bincodes' />
        </Typography>
      </CardContent>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder={t('Search') ?? ''}
          onChange={e => handleFilter(e.target.value)}
        />
        <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={() => setOpen(true)}>
          <Translations text='add' />
        </Button>
        {/* <Box sx={{ display: 'flex', gap: 5 }}>
          <Button variant='outlined' startIcon={<Icon icon='tabler:screen-share' />}>
            <Translations text='Export' />
          </Button>
        </Box> */}
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

export default CardBincode

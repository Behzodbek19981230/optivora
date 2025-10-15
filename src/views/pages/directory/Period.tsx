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
import { RatesType } from 'src/types/dictionaries/ratesType'
import { PeriodType } from 'src/types/dictionaries/periodType'
import DeleteModal from 'src/views/components/modals/DeleteModal'

interface CellType {
  row: PeriodType
}

const PeriodList = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [apiData, setApiData] = useState<[]>()
  const [errors, setErrors] = useState<RatesType | any>({
    id: 0,
    period: null,
    name: '',

    isActive: false
  })
  const [state, setState] = useState<PeriodType | any>()
  const [stateEdite, setStateEdite] = useState<PeriodType | any>()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [currentData, setCurrentData] = useState<PeriodType>()
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleSave = async () => {
    try {
      await DataService.post(endpoints.period, state)
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
      await DataService.patch(endpoints.period + `/${currentData?.id}`, stateEdite)
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
    } catch (err: any) {
      toast.error(err)
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
      const rep = await DataService.get(endpoints.period, { search: value })
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
      field: 'name',
      headerName: t('name') as string,
      minWidth: 200,
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

      field: 'period',
      headerName: t('period') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.period}
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
          {/* <IconButton
            size='small'
            onClick={() => {
              setCurrentData(row), setOpenDelete(true)
            }}
          >
            <Icon icon='tabler:trash' color={theme.palette.primary.main} fontSize={20} />
          </IconButton> */}
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
      await DataService.delete(endpoints.period + `/${currentData?.id}`)
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
      <FormModal handleClose={handleClose} open={open} handleSave={handleSave} title=''>
        <form ref={formRef}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              fullWidth
              name='name'
              onChange={e => setState({ ...state, name: e.target.value as string })}
              label={t('name') as string}
              placeholder={t('name') as string}
              error={Boolean(errors?.name)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.name && { helperText: 'This field is required' })}
            />

            <CustomTextField
              fullWidth
              name='period'
              type='number'
              onChange={e => setState({ ...state, period: e.target.value })}
              label={t('period') as string}
              placeholder={t('period') as string}
              error={Boolean(errors?.period)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.period && { helperText: 'This field is required' })}
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
              error={Boolean(errors?.name)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.name && { helperText: 'This field is required' })}
            />

            <CustomTextField
              fullWidth
              name='period'
              onChange={e => setStateEdite({ ...stateEdite, period: e.target.value })}
              defaultValue={currentData?.period}
              label={t('period') as string}
              placeholder={t('period') as string}
              error={Boolean(errors?.period)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.period && { helperText: 'This field is required' })}
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
        <Typography variant='h4'>
          <Translations text='period' />
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

export default PeriodList

// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, useRef } from 'react'
// ** Next Imports
import { Card, CardContent, Button, FormControlLabel, Switch, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ThemeColor } from 'src/@core/layouts/types'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { Icon } from '@iconify/react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import FormModal from 'src/views/components/modals/FormModal'
import { Region } from 'src/types/dictionaries/regions'
import toast from 'react-hot-toast'
import { CategoryTypes, RatesType } from 'src/types/dictionaries/ratesType'
import { PeriodType } from 'src/types/dictionaries/periodType'
import DeleteModal from 'src/views/components/modals/DeleteModal'

interface CellType {
  row: RatesType
}

const TariffList = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [apiData, setApiData] = useState<[]>()
  const [periods, setPeriods] = useState<[]>()
  const [errors, setErrors] = useState<RatesType | any>({
    id: 0,
    period: null,
    name: '',
    max_markup: 0,
    min_markup: 0,
    isActive: false
  })
  const [state, setState] = useState<RatesType | any>()
  const [stateEdite, setStateEdite] = useState<RatesType | any>()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [currentData, setCurrentData] = useState<RatesType>()
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleSave = async () => {
    try {
      await DataService.post(endpoints.rate, state)
      toast.success(<Translations text='Success!' />)
      handleClose()
      fetchData()
    } catch (err: any) {
      toast.error(err)
    }
  }
  const handleEdit = async () => {
    try {
      await DataService.patch(endpoints.rate + `/${currentData?.id}`, stateEdite)
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
      const reponse = await DataService.get(endpoints.period)
      setPeriods(reponse.data?.result)
      const rep = await DataService.get(endpoints.rate, { search: value })
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
              {row?.tariffPeriod?.name}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      maxWidth: 100,
      minWidth: 100,
      field: 'categoryType',
      headerName: t('categoryType') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.categoryType}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'max_markup',
      minWidth: 170,
      headerName: t('max_markup') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.maxValue}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'min_markup',
      minWidth: 170,
      headerName: t('min_markup') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.minValue}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      maxWidth: 200,
      minWidth: 200,

      field: 'status',
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
          <Icon
            fontSize={26}
            icon={row.isActive ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
            color={row.isActive ? theme.palette.primary.main : theme.palette.grey[400]}
          />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.isActive ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
          </Typography>
        </Box>
      )
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
      await DataService.delete(endpoints.rate + `/${currentData?.id}`)
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
              select
              fullWidth
              defaultValue={CategoryTypes.A}
              label={t('categoryType') as string}
              id='validation-basic-select'
              onChange={e => setState({ ...state, categoryType: e.target.value })}
              error={Boolean(errors?.categoryType)}
              aria-describedby='validation-basic-select'
              {...(errors?.categoryType && { helperText: 'This field is required' })}
              placeholder={t('categoryType') as string}
            >
              <MenuItem value={CategoryTypes.A}>{CategoryTypes.A}</MenuItem>
              <MenuItem value={CategoryTypes.B}>{CategoryTypes.B}</MenuItem>
            </CustomTextField>
            <CustomTextField
              fullWidth
              name='name'
              // value={value}
              onChange={e => setState({ ...state, name: e.target.value as string })}
              label={t('name') as string}
              placeholder={t('name') as string}
              error={Boolean(errors?.name)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.name && { helperText: 'This field is required' })}
            />
            <CustomTextField
              select
              fullWidth
              label={t('period') as string}
              id='validation-basic-select'
              onChange={e => setState({ ...state, periodId: e.target.value })}
              error={Boolean(errors?.period)}
              aria-describedby='validation-basic-select'
              {...(errors?.period && { helperText: 'This field is required' })}
              placeholder={t('period') as string}
            >
              <MenuItem value=''>None</MenuItem>
              {periods?.map((period: PeriodType) => (
                <MenuItem key={period.id} value={period.id}>
                  {period?.name}
                </MenuItem>
              ))}
            </CustomTextField>
            <CustomTextField
              fullWidth
              // value={value}
              name='max_markup'
              type='number'
              onChange={e => setState({ ...state, maxValue: e.target.value })}
              label={t('max_markup') as string}
              placeholder={t('max_markup') as string}
              error={Boolean(errors?.max_markup)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.max_markup && { helperText: 'This field is required' })}
            />
            <CustomTextField
              fullWidth
              // value={value}
              onChange={e => setState({ ...state, minValue: e.target.value })}
              type='number'
              name='min_markup'
              label={t('min_markup') as string}
              placeholder={t('min_markup') as string}
              error={Boolean(errors?.min_markup)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.min_markup && { helperText: 'This field is required' })}
            />
          </Box>
        </form>
      </FormModal>
      <FormModal handleClose={handleClose} open={openEdit} handleSave={handleEdit} title=''>
        <form ref={formRef}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              select
              fullWidth
              defaultValue={currentData?.categoryType}
              label={t('categoryType') as string}
              id='validation-basic-select'
              onChange={e => setStateEdite({ ...stateEdite, categoryType: e.target.value })}
              error={Boolean(errors?.categoryType)}
              aria-describedby='validation-basic-select'
              {...(errors?.categoryType && { helperText: 'This field is required' })}
              placeholder={t('categoryType') as string}
            >
              <MenuItem value={CategoryTypes.A}>{CategoryTypes.A}</MenuItem>
              <MenuItem value={CategoryTypes.B}>{CategoryTypes.B}</MenuItem>
            </CustomTextField>
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
              select
              fullWidth
              label={t('period') as string}
              defaultValue={currentData?.periodId}
              id='validation-basic-select'
              onChange={e => setStateEdite({ ...stateEdite, periodId: e.target.value })}
              error={Boolean(errors?.period)}
              aria-describedby='validation-basic-select'
              {...(errors?.period && { helperText: 'This field is required' })}
              placeholder={t('period') as string}
            >
              <MenuItem value=''>None</MenuItem>
              {periods?.map((period: PeriodType) => (
                <MenuItem key={period.id} value={period.id}>
                  {period.name}
                </MenuItem>
              ))}
            </CustomTextField>
            <CustomTextField
              fullWidth
              // value={value}
              name='max_markup'
              onChange={e => setStateEdite({ ...stateEdite, maxValue: e.target.value })}
              defaultValue={currentData?.maxValue}
              label={t('max_markup') as string}
              placeholder={t('max_markup') as string}
              error={Boolean(errors?.max_markup)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.max_markup && { helperText: 'This field is required' })}
            />
            <CustomTextField
              fullWidth
              // value={value}
              name='min_markup'
              onChange={e => setStateEdite({ ...stateEdite, minValue: e.target.value })}
              defaultValue={currentData?.minValue}
              label={t('min_markup') as string}
              placeholder={t('min_markup') as string}
              error={Boolean(errors?.min_markup)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.min_markup && { helperText: 'This field is required' })}
            />
            <FormControlLabel
              onChange={(e: any) => setStateEdite({ ...stateEdite, isActive: e.target?.checked })}
              control={<Switch defaultChecked={currentData?.isActive} />}
              label={
                (state ? state?.isActive : currentData?.isActive) ? (
                  <Translations text='Activate' />
                ) : (
                  <Translations text='Deactivate' />
                )
              }
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
          <Translations text='tariff' />
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

export default TariffList

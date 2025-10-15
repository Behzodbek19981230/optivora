// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, useRef } from 'react'
// ** Next Imports
import { Card, CardContent, Button } from '@mui/material'
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
import { Districts, Region } from 'src/types/dictionaries/regions'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import FormModal from 'src/views/components/modals/FormModal'
import toast from 'react-hot-toast'

interface CellType {
  row: Districts
}

const DistrictsList = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [regions, setRegions] = useState<[]>()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [errors, setErrors] = useState({ district: '', code: '', region: '' })
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleSave = async () => {
    const regionElement = formRef.current?.elements.namedItem('region') as HTMLInputElement
    if (!regionElement.value) {
      setErrors({ ...errors, region: 'Required' })
    }
    const CodeElement = formRef.current?.elements.namedItem('code') as HTMLInputElement
    if (!CodeElement.value) {
      setErrors({ ...errors, code: 'Required' })
    }
    const districtElement = formRef.current?.elements.namedItem('district') as HTMLInputElement
    if (!districtElement.value) {
      setErrors({ ...errors, district: 'Required' })
    }
    const data = {
      region: regionElement.value,
      code: CodeElement.value,
      district: districtElement.value
    }
    console.log(data)

    try {
      const res = await DataService.post(endpoints.district, data)
      toast.success(<Translations text='Success!' />)
      handleClose()
      getData()
    } catch (err: any) {
      console.log(err)

      // toast.error(err.message)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }

  const [districts, setDistricts] = useState<[]>()
  const getData = async () => {
    try {
      const res = await DataService.get(endpoints.country)
      setRegions(res.data?.result)
      const reponse = await DataService.get(endpoints.district, { search: value })
      setDistricts(reponse.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getData()
  }, [value])
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'district',
      maxWidth: 420,
      minWidth: 420,
      headerName: t('district') as string,

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
      flex: 0.28,
      field: 'region',
      maxWidth: 320,
      minWidth: 320,
      sortable: true,
      headerName: t('region') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.region?.name}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      field: 'code',
      maxWidth: 200,
      minWidth: 200,
      headerName: t('code_district') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.sv_districtId}
            </Typography>
          </Box>
        )
      }
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <Card>
      <FormModal handleClose={handleClose} open={open} handleSave={handleSave} title='district'>
        <form ref={formRef}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              fullWidth
              name='district'
              // value={value}
              label={t('district') as string}
              placeholder={t('district') as string}
              error={Boolean(errors?.district)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.district && { helperText: 'This field is required' })}
            />
            <CustomTextField
              fullWidth
              name='code'
              // value={value}
              label={t('code_district') as string}
              placeholder={t('code_district') as string}
              error={Boolean(errors?.code)}
              aria-describedby='validation-basic-first-name'
              {...(errors?.code && { helperText: 'This field is required' })}
            />
            <CustomTextField
              select
              fullWidth
              name='region'
              label={t('region') as string}
              id='validation-basic-select'
              error={Boolean(errors?.region)}
              aria-describedby='validation-basic-select'
              {...(errors?.region && { helperText: 'This field is required' })}
            >
              {regions?.map((item: Region) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Box>
        </form>
      </FormModal>
      {/* <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          <Translations text='district' />
        </Typography>
        <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={() => setOpen(true)}>
          <Translations text='add' />
        </Button>
      </CardContent> */}
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder={t('Search') ?? ''}
          onChange={e => handleFilter(e.target.value)}
        />

        {/* <Box sx={{ display: 'flex', gap: 5 }}>
          <Button variant='outlined' startIcon={<Icon icon='tabler:screen-share' />}>
            <Translations text='Export' />
          </Button>
        </Box> */}
      </CardContent>{' '}
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
        rows={districts || []}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default DistrictsList

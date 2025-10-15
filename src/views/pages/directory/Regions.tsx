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
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import FormModal from 'src/views/components/modals/FormModal'
import { Region } from 'src/types/dictionaries/regions'
import toast from 'react-hot-toast'

interface CellType {
  row: Region
}

const RegionsList = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [value, setValue] = useState<string>('')

  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleSave = async () => {
    const regionElement = formRef.current?.elements.namedItem('name') as HTMLInputElement

    const CodeElement = formRef.current?.elements.namedItem('sv_regionId') as HTMLInputElement

    const data = {
      name: regionElement.value,
      sv_regionId: CodeElement.value
    }

    try {
      await DataService.post(endpoints.country, data)
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

  const [regions, setRegions] = useState<[]>()
  const getData = async () => {
    try {
      const reponse = await DataService.get(endpoints.country, { search: value })
      setRegions(reponse.data?.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getData()
  }, [value])
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      field: 'id',
      maxWidth: 100,
      minWidth: 100,
      headerName: t('ID') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.id}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.18,
      maxWidth: 200,
      minWidth: 200,
      field: 'sv_regionId',
      headerName: t('sv_regionId') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.sv_regionId}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.18,
      maxWidth: 250,
      minWidth: 250,
      field: 'name',
      headerName: t('name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.name}
            </Typography>
          </Box>
        )
      }
    }
  ]
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <Card>
      <FormModal handleClose={handleClose} open={open} handleSave={handleSave} title='region'>
        <form ref={formRef}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <CustomTextField
              fullWidth
              name='name'
              // value={value}
              label={t('name') as string}
              placeholder={t('name') as string}
              required
            />
            <CustomTextField
              fullWidth
              // value={value}
              name='sv_regionId'
              label={t('sv_regionId') as string}
              placeholder={t('sv_regionId') as string}
              required
            />
          </Box>
        </form>
      </FormModal>
      {/* <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          <Translations text='regions' />
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
        rows={regions || []}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default RegionsList

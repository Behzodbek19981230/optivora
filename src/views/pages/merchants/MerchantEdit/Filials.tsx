import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Icon } from '@iconify/react'
import CustomChip from 'src/@core/components/mui/chip'
import {
  Box,
  Button,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
  Switch,
  Typography,
  useTheme
} from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import DeleteModal from 'src/views/components/modals/DeleteModal'
import FormModal from 'src/views/components/modals/FormModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import dynamic from 'next/dynamic'
import Map from 'src/views/components/lafletMap'
import { useSelector } from 'react-redux'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useRouter } from 'next/router'
import { Category } from 'src/types/dictionaries/category'
import { BranchesListType, BranchesType } from 'src/types/dictionaries/branchesType'
import toast from 'react-hot-toast'
import Loader from 'src/@core/components/spinner/Loader'
import { Districts, Region } from 'src/types/dictionaries/regions'

type Data = {
  name: string
  calories: number
  fat: number
  carbs: number
  protein: number
  type: string
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}
export default function Filials({ id }: { id: string }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [category, setCategory] = useState<[]>()
  const [state, setState] = useState<any>({
    address: '',
    latitude: '',
    longitude: '',
    name: '',
    status: 'active',
    merchant: Number(id),
    category: '',
    regionId: '',
    districtId: ''
  })
  const [district, setDistrict] = useState<Districts[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const onSelectRegion = async (id: number) => {
    try {
      const response = await DataService.get(endpoints.district, { regionId: id })
      setDistrict(response.data.result)
    } catch (error: any) {
      toast.error(error?.error)
    }
  }
  const coordinateSelector = useSelector((state: any) => state.map.coordinate)
  const [errors, setErrors] = useState<Data>()
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [categories, setCategories] = useState<string[]>([])
  const [currentData, setCurrentData] = useState<BranchesListType>()
  const [title, setTitle] = useState<string>('')
  const [data, setData] = useState<[]>()
  const [current, setCurrent] = useState<BranchesListType>()
  const getData = async () => {
    try {
      const res = await DataService.get(endpoints.branchesMerchant + `/${id}`)
      setData(res.data?.result)
      const resRegion = await DataService.get(endpoints.region)
      setRegions(resRegion.data.result)
      onSelectRegion(res.data?.result?.regionId)
      const reponseCategory = await DataService.get(endpoints.categories)
      setCategory(reponseCategory.data.result)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.isReady])
  const handleDelete = async () => {
    try {
      await DataService.delete(endpoints.branches + `/${currentData?.id}`)
      toast.success(<Translations text='Success!' />)
      handleClose()
      getData()
    } catch (err: any) {
      toast.error(err.error)
    }
  }
  const handleClose = () => {
    setOpenDelete(false)
    setOpen(false)
    setOpenEdit(false)
    setCurrentData(undefined)
  }
  const onDelete = (data: BranchesListType) => {
    setTitle(data.name)
    setCurrentData(data)
    setOpenDelete(true)
  }
  const onCreate = () => {
    setTitle('Add')
    setOpen(true)
  }
  const handleCreate = async () => {
    const dataForm = {
      merchantId: id,
      name: state.name,
      categories: getCategoryId(),
      address: state.address,
      status: state.status,
      longitude: coordinateSelector?.length > 0 ? coordinateSelector[1] : 0,
      latitude: coordinateSelector?.length > 0 ? coordinateSelector[0] : 0,
      regionId: state.regionId,
      districtId: state.districtId
    }
    try {
      await DataService.post(endpoints.branches, dataForm)
      toast.success(<Translations text='Successfully' />)
      setOpen(false)
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdite = async () => {
    const dataForm = {
      merchantId: id,
      name: state.name,
      category: state.category,
      address: state.address,
      status: state.status,
      longitude: coordinateSelector?.length > 0 ? coordinateSelector[1] : 0,
      latitude: coordinateSelector?.length > 0 ? coordinateSelector[0] : 0,
      regionId: state.regionId,
      districtId: state.districtId
    }
    try {
      await DataService.patch(endpoints.branches + `/${current?.id}`, dataForm)
      toast.success(<Translations text='Successfully' />)
      setOpenEdit(false)
      getData()
    } catch (err) {
      console.log(err)
    }
  }
  const getCategoryId = () => {
    let arr = [] as unknown as number[]
    category?.forEach((item: Category) => {
      categories?.forEach((res: string) => {
        if (res == item?.category) {
          arr.push(item as any)
        }
      })
    })
    return arr
  }
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setCategories(event.target.value as string[])
  }
  return (
    <div>
      <DeleteModal title={title} handleClose={handleClose} handleDelete={handleDelete} open={openDelete} />

      <TableContainer>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4'>
            <Translations text='Branches' />
          </Typography>
          <Button variant='outlined' startIcon={<Icon icon='tabler:plus' />} onClick={onCreate}>
            <Translations text='Add a branch' />
          </Button>
        </CardContent>
        {data ? (
          data?.length > 0 ? (
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>
                    <Translations text='Branch name' />
                  </TableCell>
                  {/* <TableCell align='center'>
                  <Translations text='Branch type' />
                </TableCell> */}
                  <TableCell align='left'>
                    <Translations text='Address' />
                  </TableCell>
                  <TableCell align='left'>
                    <Translations text='Status' />
                  </TableCell>
                  <TableCell align='right'>
                    <Translations text='Actions' />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: BranchesListType, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>{row.address}</TableCell>
                    <TableCell align='left'>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
                        <Icon
                          fontSize={26}
                          icon={row.status == 'active' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
                          color={row.status == 'active' ? theme.palette.primary.main : theme.palette.grey[400]}
                        />
                        <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                          {row.status == 'active' ? (
                            <Translations text='Activate' />
                          ) : (
                            <Translations text='Deactivate' />
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align='right'>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => onDelete(row)}>
                          <Icon icon='tabler:trash' fontSize={18} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            router.push(`/merchants/branches/${row.id}`)
                            // setCurrent(row)
                            // setOpenEdit(true),
                            //   setState({
                            //     ...state,
                            //     status: row.status,
                            //     address: row.address,
                            //     category: row.category.id.toString(),
                            //     latitude: row.latitude,
                            //     longitude: row.longitude,
                            //     merchant: row.merchant,
                            //     name: row.name
                            //   })
                          }}
                        >
                          <Icon icon='tabler:edit' fontSize={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Typography variant='body2'>no data </Typography>
            </CardContent>
          )
        ) : (
          <Loader />
        )}
      </TableContainer>

      <FormModal maxWidth='lg' title='add' handleClose={handleClose} handleSave={handleCreate} open={open}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CustomTextField
            fullWidth
            label={t('Branch name') as string}
            placeholder={t('Branch name') as string}
            error={Boolean(errors?.name)}
            aria-describedby='validation-basic-first-name'
            {...(errors?.name && { helperText: 'This field is required' })}
            onChange={e => setState({ ...state, name: e.target.value })}
          />
          <CustomTextField
            fullWidth
            defaultValue={current?.regionId}
            select
            // value={value}
            label={t('region') as string}
            onChange={e => {
              setState({ ...state, regionId: e.target.value })
              onSelectRegion(Number(e.target.value) as number)
            }}
            placeholder={t('region') as string}
            aria-describedby='validation-basic-first-name'
          >
            <MenuItem value=''>None</MenuItem>
            {regions?.map((item: Region) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField
            fullWidth
            select
            defaultValue={current?.districtId}
            onChange={e => setState({ ...state, districtId: e.target.value })}
            // value={value}
            label={t('district') as string}
            placeholder={t('district') as string}
            aria-describedby='validation-basic-first-name'
          >
            <MenuItem value=''>None</MenuItem>
            {district?.map((item: Districts) => (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </CustomTextField>
          <CustomTextField
            fullWidth
            label={t('Address') as string}
            placeholder={t('Address') as string}
            error={Boolean(errors?.name)}
            aria-describedby='validation-basic-first-name'
            onChange={e => setState({ ...state, address: e.target.value })}
            {...(errors?.name && { helperText: 'This field is required' })}
          />
          <CustomTextField
            select
            fullWidth
            placeholder={t('Category') as string}
            label={t('Category') as string}
            id='select-multiple-chip'
            SelectProps={{
              MenuProps,
              multiple: true,
              value: categories,
              onChange: e => handleChange(e),
              renderValue: selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {(selected as unknown as string[])?.map(value => (
                    <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                  ))}
                </Box>
              )
            }}
          >
            {category?.map((category: Category) => (
              <MenuItem key={category.id} value={category.category}>
                {category.category}
              </MenuItem>
            ))}
          </CustomTextField>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <CustomTextField
              value={coordinateSelector?.length > 0 ? coordinateSelector[0] : 0}
              fullWidth
              id='longitude'
              disabled
              placeholder={t('x') as string}
              aria-describedby='validation-basic-first-name'
            />
            <CustomTextField
              fullWidth
              id='latitude'
              disabled
              value={coordinateSelector?.length > 0 ? coordinateSelector[1] : 0}
              placeholder={t('y') as string}
              aria-describedby='validation-basic-first-name'
            />
          </Box>

          <Map />
        </Box>
      </FormModal>
      <FormModal title={current?.name as string} handleClose={handleClose} handleSave={handleEdite} open={openEdit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CustomTextField
            fullWidth
            defaultValue={current?.name}
            label={t('Branch name') as string}
            placeholder={t('Branch name') as string}
            error={Boolean(errors?.name)}
            aria-describedby='validation-basic-first-name'
            {...(errors?.name && { helperText: 'This field is required' })}
            onChange={e => setState({ ...state, name: e.target.value })}
          />
          {/* <CustomTextField
            fullWidth
            label={t('Branch type') as string}
            placeholder={t('Branch type') as string}
            error={Boolean(errors?.name)}
            aria-describedby='validation-basic-first-name'
            {...(errors?.name && { helperText: 'This field is required' })}
          /> */}
          <CustomTextField
            fullWidth
            label={t('Address') as string}
            defaultValue={current?.address}
            placeholder={t('Address') as string}
            error={Boolean(errors?.name)}
            aria-describedby='validation-basic-first-name'
            onChange={e => setState({ ...state, address: e.target.value })}
            {...(errors?.name && { helperText: 'This field is required' })}
          />
          <CustomTextField
            select
            fullWidth
            defaultValue={current?.category.id}
            label={t('Category') as string}
            id='validation-basic-select'
            onChange={e => setState({ ...state, category: e.target.value })}
            error={Boolean(errors?.type)}
            aria-describedby='validation-basic-select'
            {...(errors?.type && { helperText: 'This field is required' })}
            placeholder={t('Category') as string}
          >
            <MenuItem value=''>None</MenuItem>
            {category?.map((category: Category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.category}
              </MenuItem>
            ))}
          </CustomTextField>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <CustomTextField
              value={coordinateSelector?.length > 0 ? coordinateSelector[0] : 0}
              defaultValue={current?.longitude}
              fullWidth
              id='longitude'
              disabled
              placeholder={t('x') as string}
              aria-describedby='validation-basic-first-name'
            />
            <CustomTextField
              fullWidth
              id='latitude'
              defaultValue={current?.latitude}
              disabled
              value={coordinateSelector?.length > 0 ? coordinateSelector[1] : 0}
              placeholder={t('y') as string}
              aria-describedby='validation-basic-first-name'
            />
          </Box>
          <Map />
          <FormControlLabel
            onChange={(e: any) => setState({ ...state, status: e.target?.checked ? 'active' : 'inactive' })}
            control={<Switch defaultChecked={current?.status == 'active'} />}
            label={state.status == 'active' ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
          />
        </Box>
      </FormModal>
    </div>
  )
}

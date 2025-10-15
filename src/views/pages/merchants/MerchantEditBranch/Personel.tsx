import { forwardRef, useState, ChangeEvent, ElementType, useEffect, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { Box, OutlinedInput, Select, SelectChangeEvent, Switch, Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { useTheme } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTranslation } from 'react-i18next'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { useRouter } from 'next/router'
import { Category } from 'src/types/dictionaries/category'
import Map from 'src/views/components/lafletMap'
import { useSelector } from 'react-redux'
import { BranchesListType, BranchesType } from 'src/types/dictionaries/branchesType'
import { useDispatch } from 'react-redux'
import { getdataMap } from 'src/store/map'
import CustomChip from 'src/@core/components/mui/chip'
import Loader from 'src/@core/components/spinner/Loader'
import { Districts, Region } from 'src/types/dictionaries/regions'

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
const MerchantBranchPersonal = ({ id }: { id: string }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [category, setCategory] = useState<[]>()
  const [categories, setCategories] = useState<string[]>([])

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
  const dispatch = useDispatch()
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
  const [errors, setErrors] = useState<BranchesType>()
  const [data, setData] = useState<[]>([])
  const [current, setCurrent] = useState<BranchesListType>()
  const getCategoryName = (categoryDefault: any, categoryList: any) => {
    let arr = [] as unknown as string[]
    categoryList?.forEach((item: Category) => {
      categoryDefault?.forEach((res: any) => {
        if (res?.category == item?.category) {
          arr.push(item?.category as string)
        }
      })
    })
    return arr
  }
  const getData = async () => {
    try {
      const res = await DataService.get(endpoints.branches + `/${id}`)
      setCurrent(res.data?.result)
      dispatch(getdataMap([res.data?.result?.latitude ?? 0, res.data?.result?.longitude ?? 0]))
      const resRegion = await DataService.get(endpoints.region)
      setRegions(resRegion.data.result)
      onSelectRegion(res.data?.result?.regionId)

      setState({
        ...state,
        status: res.data?.result.status,
        address: res.data?.result.address,
        latitude: res.data?.result.latitude,
        longitude: res.data?.result.longitude,
        name: res.data?.result.name,
        regionId: res.data?.result.regionId,
        districtId: res.data?.result.districtId
      })
      const reponseCategory = await DataService.get(endpoints.categories)
      setCategory(reponseCategory.data.result)
      setCategories(getCategoryName(res.data?.result.categories, reponseCategory.data.result))
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.isReady])
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
  const handleEdite = async () => {
    const dataForm = {
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
      const res = await DataService.patch(endpoints.branches + `/${current?.id}`, dataForm)
      toast.success(<Translations text='Successfully' />)
      getData()
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setCategories(event.target.value as string[])
  }

  return (
    <DatePickerWrapper>
      <CardContent>
        {current ? (
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
            <Grid item xs={2.4}>
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
            </Grid>
            <Grid item xs={2.4}>
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
            </Grid>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}>
              <Grid item xs={6}>
                <CustomTextField
                  value={coordinateSelector?.length > 0 ? coordinateSelector[0] : 0}
                  fullWidth
                  name='latitude'
                  disabled
                  defaultValue={current?.latitude}
                  placeholder={t('x') as string}
                  aria-describedby='validation-basic-first-name'
                />
              </Grid>
              <Grid item xs={6} sx={{ my: 8 }}>
                <CustomTextField
                  fullWidth
                  name='longitude'
                  disabled
                  defaultValue={current?.longitude}
                  value={coordinateSelector?.length > 0 ? coordinateSelector[1] : 0}
                  placeholder={t('y') as string}
                  aria-describedby='validation-basic-first-name'
                />
              </Grid>
            </Box>
            <Map />
            <FormControlLabel
              onChange={(e: any) => setState({ ...state, status: e.target?.checked ? 'active' : 'inactive' })}
              control={<Switch defaultChecked={current?.status == 'active'} />}
              label={state.status == 'active' ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
            />
          </Box>
        ) : (
          <Loader />
        )}
        <Grid container spacing={2} justifyContent='flex-end'>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
            <Button variant='contained' onClick={handleEdite}>
              <Translations text='Save' />
            </Button>
            <Button variant='contained' color='secondary' onClick={() => router.back()}>
              <Translations text='Cancel' />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </DatePickerWrapper>
  )
}

export default MerchantBranchPersonal

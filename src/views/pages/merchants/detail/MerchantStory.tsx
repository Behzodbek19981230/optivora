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
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
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

type Data = {
  name: string
  calories: number
  fat: number
  carbs: number
  protein: number
  type: string
}

export default function MerchantStorys({ id }: { id: string }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [category, setCategory] = useState<[]>()

  const coordinateSelector = useSelector((state: any) => state.map.coordinate)
  const [errors, setErrors] = useState<Data>()
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  const [title, setTitle] = useState<string>('')
  const [data, setData] = useState<[]>([])
  const [current, setCurrent] = useState<BranchesListType>()
  const getData = async () => {
    try {
      const res = await DataService.get(endpoints.branchesMerchant + `/${id}`)
      setData(res.data?.result)
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

  return (
    <Card>
      <TableContainer>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4'>
            <Translations text='story_' />
          </Typography>
        </CardContent>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant='body2'>no data </Typography>
        </CardContent>
        {/* {data.length > 0 ? (
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='left'>
                  <Translations text='Branch name' />
                </TableCell>
                
                <TableCell align='left'>
                  <Translations text='Address' />
                </TableCell>
                <TableCell align='left'>
                  <Translations text='Status' />
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
                        {row.status == 'active' ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
                      </Typography>
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
        )} */}
      </TableContainer>
    </Card>
  )
}

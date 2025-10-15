// ** React Imports
import { ChangeEvent, ElementType, useCallback, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import Icon from 'src/@core/components/icon'

import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

import { Button, ButtonProps, FormControlLabel, InputAdornment, Switch, styled, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import ReactInputMask from 'react-input-mask'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { MerchantUserType, apiStructure } from 'src/context/types'
import Translations from 'src/layouts/components/Translations'
import DeleteModal from 'src/views/components/modals/DeleteModal'
import FormModal from 'src/views/components/modals/FormModal'
import TableHeaderUser from '../TableHeaderUser'
interface Data {
  name: string
  surname: string
  fathers_name: string
  username: string
  password: string
  is_active: boolean
}

const initialData: Data = {
  name: '',
  surname: '',
  is_active: true,
  fathers_name: '',
  username: '',
  password: ''
}
const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

interface CellType {
  row: MerchantUserType
}

// ** renders client column
const renderClient = (row: MerchantUserType) => {
  if (row.avatar) {
    return <CustomAvatar src={process.env.NEXT_PUBLIC_BASE_URL + row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials((row?.name ?? '') + ' ' + (row?.surname ?? ''))}
      </CustomAvatar>
    )
  }
}

const UsersList = ({ id }: { id: string }) => {
  // ** State
  const { t } = useTranslation()
  const theme = useTheme()
  const [apiData, setApiData] = useState<apiStructure>()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<CellType>()
  const [openEdite, setOpenEdite] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentDelete, setCurrentDelete] = useState<any>()
  const [formData, setFormData] = useState<Data>(initialData)
  const [formDataEdit, setFormDataEdit] = useState<any>()
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [open, setOpen] = useState<boolean>(false)
  const [errorName, setErrorName] = useState('')
  const [errorSername, setErrorSurname] = useState('')
  const [errorFatherName, setErrorFatherName] = useState('')
  const [errorusername, setErrorUsername] = useState('')
  const [errorpassword, setErrorPassword] = useState('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()
  const [passError, setPassError] = useState({ newPassword: '', confirmPassword: '' })
  const [inputValue, setInputValue] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png')
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'fullName',
      headerName: t('Full Name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                // component={Link}
                // href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {(row?.name ?? '') + ' ' + (row?.surname ?? '') + ' ' + (row?.fathers_name ?? '')}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 170,
      headerName: t('Role') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              <Translations text={row.role as string} />
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 5 }}>
          <Icon
            fontSize={26}
            icon={row.is_active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
            color={row.is_active ? theme.palette.primary.main : theme.palette.grey[400]}
          />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.is_active ? <Translations text='Activate' /> : <Translations text='Deactivate' />}
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
          <IconButton
            size='small'
            onClick={() => {
              setCurrentDelete({ row }), setOpenDelete(true)
            }}
          >
            <Icon icon='tabler:trash' color={theme.palette.primary.main} fontSize={20} />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => {
              setCurrentUser({ row })
              setOpenEdite(true)
            }}
          >
            <Icon icon='tabler:edit' color={theme.palette.primary.main} fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]
  const onDelete = async () => {
    if (currentDelete?.row?.id) {
      const response = await DataService.delete(endpoints.merchantUsersId(currentDelete?.row?.id))
      if (response.data?.error) {
        toast.error(response.data?.error)
      } else {
        toast.success(t('deleted_successfully'))
        fetchData()
        setCurrentDelete(null)
        handleClose()
      }
    }
  }
  const handleClose = () => {
    setOpen(false), setOpenEdite(false), setOpenDelete(false)
    setFormDataEdit(null)
  }
  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/15.png')
  }
  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }
  const handleFormEdit = (field: keyof Data, value: Data[keyof Data]) => {
    setFormDataEdit({ ...formDataEdit, [field]: value })
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const toggleAdd = () => {
    setOpen(!open)
  }
  const handleCreate = async () => {
    if (
      !Boolean(formData.name) ||
      !Boolean(formData.password) ||
      !Boolean(formData.username.split('-').join('').split('_').join(''))
    ) {
      if (!Boolean(formData.name)) setErrorName(t('field_is_required') as string)
      else setErrorName('')
      // if (!Boolean(formData.fathers_name)) setErrorFatherName(t('field_is_required') as string)
      // else setErrorFatherName('')
      if (!Boolean(formData.surname)) setErrorSurname(t('field_is_required') as string)
      else setErrorSurname('')
      if (!Boolean(formData.username)) setErrorUsername(t('field_is_required') as string)
      else setErrorUsername('')
      if (!Boolean(formData.password)) setErrorPassword(t('field_is_required') as string)
      else setErrorPassword('')
    } else {
      try {
        await DataService.post(endpoints.merchant + `/user/${id}`, formData)
        toast.success(t('Successfully_created_user'))
        handleClose()
        setErrorFatherName('')
        setErrorName('')
        setErrorUsername('')
        setErrorPassword('')
        setErrorSurname('')
        fetchData()
      } catch (err: any) {
        setErrorUsername(err?.error)
      }
    }
  }
  const onSave = async () => {
    const response = await DataService.put(endpoints.merchantUsersId(currentUser?.row.id), formDataEdit)
    if (response.data?.error) {
      toast.error(response.data?.error)
    } else {
      toast.success(t('edited_successfully'))
      fetchData()
      setFormDataEdit(null)
      handleClose()
    }
  }
  const onSavePass = async () => {
    try {
      if (newPassword == confirmPassword) {
        await DataService.post(endpoints.resetPasswordMerchant, { id: currentUser?.row?.id, newPassword: newPassword })
        toast.success(t('edited_successfully'))
        setPassError({ newPassword: '', confirmPassword: '' })
      } else {
        if (newPassword) setPassError({ ...passError, newPassword: '', confirmPassword: 'mos emas' })
        else if (confirmPassword) {
          setPassError({ ...passError, newPassword: '', confirmPassword: 'mos emas' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchData = async () => {
    const response = await DataService.get(endpoints.merchantUsers(router.query?.id))
    setApiData(response?.data)
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Grid>
      <Grid item xs={12}>
        <TableHeaderUser value={value} handleFilter={handleFilter} toggle={toggleAdd} />
        <DataGrid
          autoHeight
          rowHeight={62}
          rows={apiData?.result || []}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Grid>
      <FormModal maxWidth='lg' title='' handleClose={toggleAdd} handleSave={handleCreate} open={open}>
        <form>
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ImgStyled src={imgSrc} alt='Profile Pic' />
            <div>
              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                <Translations text='Upload New Photo' />
                <input
                  hidden
                  type='file'
                  value={inputValue}
                  accept='image/png, image/jpeg'
                  onChange={handleInputImageChange}
                  id='account-settings-upload-image'
                />
              </ButtonStyled>
              <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                <Translations text='Reset' />
              </ResetButtonStyled>
              <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                <Translations text='Allowed PNG or JPEG. Max size of 800K' />.
              </Typography>
            </div>
          </Box> */}
          {/* <Divider sx={{ my: 5 }} /> */}
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                label={<Translations text='First Name' />}
                placeholder={t('First Name') as string}
                onChange={e => handleFormChange('name', e.target.value)}
                error={Boolean(errorName)}
                aria-describedby='validation-basic-last-name'
                {...(errorName && { helperText: errorName })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                label={<Translations text='Last Name' />}
                placeholder={t('Last Name') as string}
                onChange={e => handleFormChange('surname', e.target.value)}
                error={Boolean(errorSername)}
                aria-describedby='validation-basic-last-name'
                {...(errorSername && { helperText: errorSername })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                label={<Translations text='Patronymic' />}
                // error={Boolean(errorFatherName)}
                aria-describedby='validation-basic-last-name'
                // {...(errorFatherName && { helperText: errorFatherName })}
                placeholder={t('Patronymic') as string}
                onChange={e => handleFormChange('fathers_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ReactInputMask
                mask='99-999-99-99'
                disabled={false}
                onChange={e => handleFormChange('username', '998' + e.target.value?.split('-').join(''))}
              >
                <CustomTextField
                  fullWidth
                  label={t('phone') as string}
                  error={Boolean(errorusername)}
                  aria-describedby='validation-basic-last-name'
                  {...(errorusername && { helperText: errorusername })}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                  }}
                />
              </ReactInputMask>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                autoComplete='new-password'
                label={<Translations text='Password' />}
                placeholder={t('Password') as string}
                onChange={e => handleFormChange('password', e.target.value)}
                error={Boolean(errorpassword)}
                aria-describedby='validation-basic-last-name'
                {...(errorpassword && { helperText: errorpassword })}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </form>
      </FormModal>
      <FormModal maxWidth='lg' title='' handleClose={handleClose} handleSave={onSave} open={openEdite}>
        <form>
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ImgStyled src={imgSrc} alt='Profile Pic' />
            <div>
              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                <Translations text='Upload New Photo' />
                <input
                  hidden
                  type='file'
                  value={inputValue}
                  accept='image/png, image/jpeg'
                  onChange={handleInputImageChange}
                  id='account-settings-upload-image'
                />
              </ButtonStyled>
              <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                <Translations text='Reset' />
              </ResetButtonStyled>
              <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                <Translations text='Allowed PNG or JPEG. Max size of 800K' />.
              </Typography>
            </div>
          </Box>
          <Divider sx={{ my: 5 }} /> */}
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                defaultValue={currentUser?.row.name}
                label={<Translations text='First Name' />}
                placeholder={t('First Name') as string}
                onChange={e => handleFormEdit('name', e.target.value)}
                error={Boolean(errorName)}
                aria-describedby='validation-basic-last-name'
                {...(errorName && { helperText: errorName })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                defaultValue={currentUser?.row.surname}
                label={<Translations text='Last Name' />}
                placeholder={t('Last Name') as string}
                onChange={e => handleFormEdit('surname', e.target.value)}
                error={Boolean(errorSername)}
                aria-describedby='validation-basic-last-name'
                {...(errorSername && { helperText: errorSername })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                defaultValue={currentUser?.row.fathers_name}
                label={<Translations text='Patronymic' />}
                // error={Boolean(errorFatherName)}
                aria-describedby='validation-basic-last-name'
                // {...(errorFatherName && { helperText: errorFatherName })}
                placeholder={t('Patronymic') as string}
                onChange={e => handleFormEdit('fathers_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ReactInputMask
                mask='99-999-99-99'
                disabled={false}
                onChange={e =>
                  handleFormEdit('username', '998' + e.target.value?.split('-').join('').split('_').join(''))
                }
              >
                <CustomTextField
                  fullWidth
                  defaultValue={currentUser?.row.username?.slice(3)}
                  label={t('phone') as string}
                  error={Boolean(formDataEdit?.username?.length < 12)}
                  aria-describedby='validation-basic-last-name'
                  {...(errorusername && { helperText: errorusername })}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                  }}
                />
              </ReactInputMask>
            </Grid>
            <Grid item xs={12} sm={8}></Grid>

            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                autoComplete='new-password'
                label={<Translations text='new_password' />}
                placeholder={t('new_password') as string}
                onChange={e => setNewPassword(e.target.value)}
                aria-describedby='validation-basic-last-name'
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(passError.newPassword)}
                {...(passError.newPassword && { helperText: t('field_is_required') })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                label={<Translations text='Reset password' />}
                placeholder={t('Reset password') as string}
                onChange={e => setConfirmPassword(e.target.value)}
                aria-describedby='validation-basic-last-name'
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(passError.confirmPassword)}
                {...(passError.confirmPassword && { helperText: t('field_is_required') })}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button variant='contained' sx={{ mr: 4 }} type='button' onClick={onSavePass}>
                <Translations text='change_password' />
              </Button>
            </Grid>
          </Grid>

          <FormControlLabel
            onChange={(e: any) => handleFormEdit('is_active', e.target?.checked)}
            control={<Switch defaultChecked={currentUser?.row?.is_active} />}
            label={
              (formDataEdit ? formDataEdit?.is_active : currentUser?.row?.is_active) ? (
                <Translations text='Activate' />
              ) : (
                <Translations text='Deactivate' />
              )
            }
          />
        </form>
      </FormModal>
      <DeleteModal
        title={currentDelete?.row.name as string}
        open={openDelete}
        handleClose={handleClose}
        handleDelete={onDelete}
      />
    </Grid>
  )
}

export default UsersList

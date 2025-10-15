import { useState, useEffect, MouseEvent, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { Chip, IconButton, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import TableHeader from 'src/views/pages/application/TabContent/TableHeader'
import { BillingReportType } from 'src/context/types'
import moment from 'moment'
import endpoints from 'src/configs/endpoint '
import { DataService } from 'src/configs/dataService'
import { CurrencyFormatter } from 'src/@core/components/currency/CurrencyFormatter'
import { Icon } from '@iconify/react'
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader2 from '../application/TabContent/TableHeader2'
import downloadExcel from 'src/views/components/export/Excel'

interface CellType {
  row: BillingReportType
}
const TextData = (dataText: BillingReportType) => {
  return `1CClientBankExchange
ВерсияФормата=1.03
Кодировка=Windows
Отправитель=Бухгалтерия предприятия для Узбекистана, редакция 1.2
Получатель=Анорбанк
ДатаСоздания=${moment().format('DD.MM.yyyy')}
ВремяСоздания=${moment().add(5, 'minutes').format('HH:mm:ss')}
ДатаНачала=${moment().format('DD.MM.yyyy')}
ДатаКонца=${moment().format('DD.MM.yyyy')}
РасчСчет=20208000105474855002
Документ=Платежное поручение
СекцияДокумент=Платежное поручение
Номер=${dataText?.backend_application_id}
Дата=${moment().format('DD.MM.yyyy')}
Сумма=${Number(dataText?.price) / 100}
ПлательщикСчет=20208000105474855002
Плательщик=ИНН 309166181 ООО "ALL-GOOD MARKETPLACE"
ПлательщикИНН=309166181
Плательщик1=ООО "ALL-GOOD MARKETPLACE"
ПлательщикРасчСчет=20208000105474855002
ПлательщикБанк1=ОА «ANOR BANK»
ПлательщикБанк2=г. Ташкент
ПлательщикМФО=01183
ПлательщикКорсчет=10301000000001183001
ПолучательСчет=${dataText?.bank_account}
Получатель=ИНН ${dataText?.inn} ${dataText?.merchant}
ПолучательИНН=${dataText?.inn}
Получатель1=${dataText?.merchant}
ПолучательРасчСчет=${dataText?.bank_account}
ПолучательБанк1=${dataText?.merchant_bank.replace(/^"|"$/g, '')}
ПолучательБанк2=${dataText?.merchant_bank_address}
ПолучательМФО=${dataText?.mfo}
ВидОплаты=01
НазначениеПлатежа=00668 за услуги сог договора ${dataText?.contract_no} по рассрочки "бытовой техники" ${
    dataText.name
  } ID${dataText?.backend_application_id}
НазначениеПлатежа1=00668 за услуги сог договора ${dataText.contract_no} по рассрочки бытовой техники ${
    dataText.name
  } ID${dataText?.backend_application_id}
КонецДокумента
КонецФайла
  `
}

const BillingTypeAListTabAll = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [apiData, setApiData] = useState([])
  const [exportLoading, setExportLoading] = useState(false)
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      maxWidth: 120,
      minWidth: 120,
      headerName: t('Application_ID') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.backend_application_id}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'Client_full_name',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.25,
      headerName: t('Client_full_name') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ flexWrap: 'wrap', whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 500 }}>
              {row.name}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'merchant',
      flex: 0.2,
      minWidth: 200,
      maxWidth: 450,
      headerName: t('merchant') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.merchant}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'price',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.2,
      headerName: t('product_price') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                <CurrencyFormatter amount={Number(row.price) as number} currency='sum' />
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'total',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.2,
      headerName: t('total_sum') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                <CurrencyFormatter amount={Number(row.total) as number} currency='sum' />
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'allgood_sum',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.2,
      headerName: t('allgood_sum') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                <CurrencyFormatter amount={Number(row.allgood_sum) as number} currency='sum' />
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'bank_sum',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.2,
      renderHeader: (params: GridColumnHeaderParams) => (
        <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
          {t('bank_sum') as string}
        </Typography>
      ),
      headerName: t('bank_sum') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                <CurrencyFormatter amount={Number(row.bank_sum) as number} currency='sum' />
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'updated_at',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.25,
      headerName: t('pay_date') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              {moment(row?.updated_at).format('DD-MM-yyyy HH:mm')}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'merchant_bank',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.25,
      headerName: t('bank') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              {row.bank}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'status',
      flex: 0.1,
      minWidth: 250,
      maxWidth: 250,
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row?.status == 'BillingSuccess' ? t('paid') : t('not_paid')}
            color={row?.status == 'BillingSuccess' ? 'success' : 'warning'}
            sx={{ textTransform: 'uppercase' }}
          />
        )
      }
    },
    {
      field: 'log',
      minWidth: 200,
      maxWidth: 450,
      flex: 0.25,
      headerName: t('log') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography flexWrap='wrap' sx={{ color: 'text.secondary' }}>
              {row.log}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      field: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerName: t('Actions') as string,
      renderCell: ({ row }: CellType) =>
        row?.status == 'BillingSuccess' ? (
          <IconButton size='small' onClick={() => downloadTxtFile(row)}>
            <Icon icon='tabler:download' color={theme.palette.primary.main} fontSize={20} />
          </IconButton>
        ) : (
          ''
        )
    }
  ]
  const router = useRouter()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const toggleAddUserDrawer = () => router.push('/employee/add')

  const onExport = async () => {
    setExportLoading(true)
    const resAll = await DataService.get(endpoints.reportBilling, {
      search: value
    })

    const column = [
      {
        header: [columns[0].headerName as string],
        key: [columns[0].field as string],
        width: 10
      },
      {
        header: [columns[1].headerName as string],
        key: [columns[1].field as string],
        width: 30
      },
      {
        header: [columns[2].headerName as string],
        key: [columns[2].field as string],
        width: 30
      },
      {
        header: [columns[3].headerName as string],
        key: [columns[3].field as string],
        width: 30
      },
      { header: [columns[4].headerName as string], key: [columns[4].field as string], width: 30 },
      {
        header: [columns[5].headerName as string],
        key: [columns[5].field as string],
        width: 30
      },
      {
        header: [columns[6].headerName as string],
        key: [columns[6].field as string],
        width: 30
      },
      {
        header: [columns[7].headerName as string],
        key: [columns[7].field as string],
        width: 30
      },
      {
        header: [columns[8].headerName as string],
        key: [columns[8].field as string],
        width: 30
      },
      {
        header: [columns[9].headerName as string],
        key: [columns[9].field as string],
        width: 30
      },
      {
        header: [columns[10].headerName as string],
        key: [columns[10].field as string],
        width: 30
      }
    ]
    const data =
      resAll?.data?.result?.map((item: any) => ({
        [columns[0].field as string]: `${item?.backend_application_id}`,
        [columns[1].field as string]: `${item?.name ?? ''}`,

        [columns[2].field as string]: `${item?.merchant ?? ''}`,

        [columns[3].field as string]: `${parseFloat(item?.price) / 100 ?? ''}`,

        [columns[4].field as string]: `${parseFloat(item?.total) / 100 ?? ''}`,
        [columns[5].field as string]: `${parseFloat(item?.allgood_sum) / 100 ?? ''}`,
        [columns[6].field as string]: `${parseFloat(item?.bank_sum) / 100 ?? ''}`,
        [columns[7].field as string]: `${moment(item.updated_at).format('DD.MM.YYYY HH:mm')}`,
        [columns[8].field as string]: `${item?.bank ?? ''}`,
        [columns[9].field as string]: `${item?.status ?? ''}`,
        [columns[10].field as string]: `${item?.log ?? ''}`
      })) || []
    downloadExcel(data || [], column || [], `BillingReport_${moment().format('DD-MM-YYYY')}`)
    setExportLoading(false)
  }
  const downloadTxtFile = (data: BillingReportType) => {
    const blob = new Blob([TextData(data)], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `${moment().format('DD-MM-YYYY')}_ID${data.backend_application_id}.txt`)
  }
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resAll = await DataService.get(endpoints.reportBilling, {
        search: value
      })
      setApiData(resAll.data?.result)
      setIsLoading(false)
    } catch (err: any) {}
  }
  useEffect(() => {
    fetchData()
  }, [value])
  return (
    <Grid>
      <TableHeader2 onExport={onExport} value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
      <DataGrid
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
            whiteSpace: 'normal'
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
            whiteSpace: 'normal'
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
            whiteSpace: 'normal'
          }
        }}
        getRowHeight={() => 'auto'}
        autoHeight
        rowHeight={62}
        loading={isLoading}
        rows={apiData || []}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Grid>
  )
}

export default BillingTypeAListTabAll

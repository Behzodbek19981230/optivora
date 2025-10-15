import React, { useState } from 'react'
import { Box, Button, CardContent, Grid, Typography, useTheme } from '@mui/material'
import QRCode from 'react-qr-code'
import Translations from 'src/layouts/components/Translations'
import { useRouter } from 'next/router'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { StatusesEnum } from 'src/configs/const'
function QRcode({ value }: { value: number }) {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()
  const [back, setBack] = useState('#FFFFFF')
  const [fore, setFore] = useState('#000000')
  const [size, setSize] = useState(256)

  const handleCheck = async () => {
    try {
      const response = await DataService.get(endpoints.applicationGetById(value))
      if (response.data?.result?.status != StatusesEnum.open) {
        router.push(`/application/steps/${value}/`)
      } else {
        toast.loading(t('info_for_qrcode'), {
          duration: 3000
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <CardContent
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        py: 20
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5
        }}
      >
        <Typography sx={{ fontSize: 24, mb: 1.5, color: 'text.secondary' }}>
          <Translations text='Scan_with_mobile_app' />
        </Typography>
        <QRCode
          value={JSON.stringify({ url: 'allgood_nasiya_merchant', application_id: value })}
          // bgColor={back}
          // fgColor={theme.palette.primary.main}
          size={size}
        />
      </Box>
      <Grid container spacing={6} sx={{ mt: 'auto' }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleCheck}>
            <Translations text='Check' />
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default QRcode

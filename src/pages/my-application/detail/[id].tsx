import React from 'react'
import PageHeader from 'src/@core/components/page-header'
import { Card, CardContent, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import DetailTab from 'src/views/pages/buyer/Application-detail/DetailTab'

export default function Detail() {
  const theme = useTheme()
  return (
    <Card sx={{ mt: 10 }}>
      <CardContent>
        <PageHeader title={<Typography variant='h4'>Заявка №12345</Typography>} />
        <Typography sx={{ my: 6 }}>
          Тут показано все собранные товары клиента за текущее время. Нужно учитывать, что общая сумма товара не должно
          превышать максимальную сумму рассрочки.
          <Typography
            flexWrap='wrap'
            component={Link}
            href={`/buyer/list/`}
            sx={{
              fontWeight: 500,
              textDecoration: 'none',
              color: theme.palette.primary.main,
              '&:hover': { color: 'primary.main' }
            }}
          >
            Подробнее{' '}
          </Typography>
        </Typography>
        <DetailTab />
      </CardContent>
    </Card>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

interface CurrencyFormatterProps {
  amount: number
  currency: string
  size?: number
  color?: string
}

export const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ amount, currency, size, color }) => {
  const { t } = useTranslation()
  const formattedAmount = new Intl.NumberFormat('ru', {
    style: 'currency',
    currency: currency
  }).format(amount / 100)
  // Split the string by "&nbsp;SUM"
  let parts = formattedAmount.split('SUM')

  // Join the parts excluding the last one
  let result = parts.slice(0, -1).join('')
  return (
    <Typography variant='body1' sx={{ fontSize: size }} color={color ?? 'textSecondary'}>
      {result} {t(currency) as string}
    </Typography>
  )
}

CurrencyFormatter.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
}

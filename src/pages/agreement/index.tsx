import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import AgreementList from 'src/views/pages/agreement/agreement-merchant/confirmation'
export default function MerchantList() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (auth.user && (auth.user.role === 'superuser' || auth.user.role === 'manager')) {
      router
        .push({
          pathname: '/agreement/confirmation'
        })
        .then(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  return (
    <div>
      {!isLoading ? (
        <AgreementList />
      ) : (
        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>Loading...</Typography>
        </Box>
      )}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Typography } from '@mui/material'
export default function BuyList() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  useEffect(() => {
    router
      .push({
        pathname: `/buyer/list/detail/${router.query?.id}/info`
      })
      .then(() => setIsLoading(false))
  }, [])

  return (
    <div>
      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    </div>
  )
}

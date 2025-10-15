import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Tab, Typography, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { TabList } from '@mui/lab'
import { Icon } from '@iconify/react'
import Translations from 'src/layouts/components/Translations'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CustomAvatar from 'src/@core/components/mui/avatar'
import PageHeader from 'src/@core/components/page-header'
import Identification from 'src/views/pages/client/application-create/Identification'
import Scoring from 'src/views/pages/client/application-create/Scoring'
import Schedule from 'src/views/pages/client/application-create/Scoring'
import CreateStepsLeftBar from 'src/views/pages/client/application-create/create-steps'
export default function CreateSteps() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [active, setActive] = useState(2)
  const theme = useTheme()
  const router = useRouter()
  const getElement = () => {
    switch (router.query.create) {
      case 'identification':
      // return <Identification />
      // case 'scoring':
      //   return <Scoring />
      // case 'schedule':
      //   return <Schedule />
    }
  }
  useEffect(() => {
    switch (router.query.create) {
      case 'identification':
        setActive(2)
        break
      case 'scoring':
        setActive(3)
        break
      case 'schedule':
        setActive(6)
        break
    }
  }, [router.query.create])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PageHeader
        title={
          <Typography variant='h4'>
            <Translations text='Новая заявка' />
          </Typography>
        }
      />
      <Card>
        <Grid container spacing={6}>
          <Grid item md={3} xs sx={{ borderRight: 1, borderRightColor: theme.palette.grey[300] }}>
            <CardContent>{/* <CreateStepsLeftBar /> */}</CardContent>
          </Grid>
          <Grid item md={9} xs>
            {/* <CardContent>{getElement()}</CardContent> */}
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}

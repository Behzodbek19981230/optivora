import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import RegionsList from 'src/views/pages/directory/Regions'
import DistrictsList from 'src/views/pages/directory/Districts'

const DirectoryDistrict = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DistrictsList />
      </Grid>
    </Grid>
  )
}
export default DirectoryDistrict

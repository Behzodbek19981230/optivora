import Grid from '@mui/material/Grid'
import PeriodList from 'src/views/pages/directory/Period'

const Directorytariff = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PeriodList />
      </Grid>
    </Grid>
  )
}
export default Directorytariff

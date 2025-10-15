import Grid from '@mui/material/Grid'
import TariffList from 'src/views/pages/directory/Tariff'

const Directorytariff = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TariffList />
      </Grid>
    </Grid>
  )
}
export default Directorytariff

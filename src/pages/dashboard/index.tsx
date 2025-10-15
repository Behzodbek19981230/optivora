// ** MUI Import
import Grid from '@mui/material/Grid'




// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import EcommerceCongratulationsJohn from 'src/views/pages/dashboard/EcommerceCongratulationsJohn'
import EcommerceStatistics from 'src/views/pages/dashboard/EcommerceStatistics'

const EcommerceDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <EcommerceCongratulationsJohn/>
        </Grid>
        <Grid item xs={12} md={8}>
          <EcommerceStatistics />
        </Grid>
   
      </Grid>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard

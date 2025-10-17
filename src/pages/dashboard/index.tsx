// ** MUI Import
import Grid from '@mui/material/Grid'




// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import EcommerceCongratulationsJohn from 'src/views/pages/dashboard/EcommerceCongratulationsJohn'
import EcommerceStatistics from 'src/views/pages/dashboard/EcommerceStatistics'

const EcommerceDashboard = () => {
  return (
    <ApexChartWrapper>
 <Grid container spacing={6} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <div style={{
            height: '100%',
            flex: 1
          }}><EcommerceCongratulationsJohn /></div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div 
          style={{
            height: '100%',
            flex: 1
          }}
          ><EcommerceStatistics /></div>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard

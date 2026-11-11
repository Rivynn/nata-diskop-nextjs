// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import GeneralDetails from './GeneralDetails'

const General = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <GeneralDetails />
      </Grid>
    </Grid>
  )
}

export default General

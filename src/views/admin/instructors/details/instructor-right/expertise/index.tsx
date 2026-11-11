// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ExpertiseOverview from './ExpertiseOverview'
import ExpertiseList from './ExpertiseList'

const Expertise = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ExpertiseOverview />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ExpertiseList />
      </Grid>
    </Grid>
  )
}

export default Expertise

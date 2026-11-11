// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InstructorStatisticsCard from './InstructorStatisticsCard'
import TrainingListTable from './TrainingListTable'

const Overview = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <InstructorStatisticsCard />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TrainingListTable />
      </Grid>
    </Grid>
  )
}

export default Overview

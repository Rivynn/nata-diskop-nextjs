// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TrainingListTable from './TrainingListTable'

const Trainings = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TrainingListTable />
      </Grid>
    </Grid>
  )
}

export default Trainings

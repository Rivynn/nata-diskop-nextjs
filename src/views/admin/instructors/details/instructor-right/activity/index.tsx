// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ActivityTimeline from './ActivityTimeline'

const Activity = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ActivityTimeline />
      </Grid>
    </Grid>
  )
}

export default Activity

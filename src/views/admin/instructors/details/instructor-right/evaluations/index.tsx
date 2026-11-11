// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import EvaluationSummary from './EvaluationSummary'
import EvaluationReviews from './EvaluationReviews'

const Evaluations = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <EvaluationSummary />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EvaluationReviews />
      </Grid>
    </Grid>
  )
}

export default Evaluations

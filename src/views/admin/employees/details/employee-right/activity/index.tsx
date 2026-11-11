import Grid from '@mui/material/Grid2'

import ActivityTimeline from './ActivityTimeline'

type Props = {
  employeeId: string
}

const Activity = ({ employeeId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ActivityTimeline employeeId={employeeId} />
      </Grid>
    </Grid>
  )
}

export default Activity

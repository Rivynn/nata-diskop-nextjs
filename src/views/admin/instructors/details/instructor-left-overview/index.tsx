import Grid from '@mui/material/Grid2'
import type { InstructorCardType } from '../../types'
import InstructorDetails from './InstructorDetails'

type Props = {
  instructorData?: InstructorCardType
}

const InstructorLeftOverview = ({ instructorData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <InstructorDetails instructorData={instructorData} />
      </Grid>
    </Grid>
  )
}

export default InstructorLeftOverview

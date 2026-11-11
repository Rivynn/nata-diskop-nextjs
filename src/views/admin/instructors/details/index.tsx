// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { InstructorCardType } from './types'

// Component Imports
import InstructorDetailsHeader from './InstructorDetailsHeader'
import InstructorLeftOverview from './instructor-left-overview'
import InstructorRight from './instructor-right'

const InstructorDetails = ({
                             instructorData,
                             instructorId
                           }: {
  instructorData?: InstructorCardType
  instructorId: string
}) => {
  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <InstructorDetailsHeader
          instructorId={instructorId}
          instructorData={instructorData}
        />
      </Grid>

      {/* Left Overview */}
      <Grid size={{ xs: 12, md: 4 }}>
        <InstructorLeftOverview
          instructorData={instructorData}
        />
      </Grid>

      {/* Right Content */}
      <Grid size={{ xs: 12, md: 8 }}>
        <InstructorRight
          instructorId={instructorId}
        />
      </Grid>
    </Grid>
  )
}

export default InstructorDetails

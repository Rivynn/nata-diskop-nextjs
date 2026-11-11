'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InstructorHeader from './InstructorHeader'
import InstructorCards from './InstructorCards'

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const Instructors = () => {
  return (
    <Grid container spacing={6}>
      {/* ----------------------------------------------------------------- */}
      {/* Header */}
      {/* ----------------------------------------------------------------- */}

      <Grid size={{ xs: 12 }}>
        <InstructorHeader />
      </Grid>

      {/* ----------------------------------------------------------------- */}
      {/* Instructor Directory */}
      {/* ----------------------------------------------------------------- */}

      <Grid
        size={{ xs: 12 }}
        className='flex flex-col gap-6'
      >
        <InstructorCards />
      </Grid>
    </Grid>
  )
}

export default Instructors

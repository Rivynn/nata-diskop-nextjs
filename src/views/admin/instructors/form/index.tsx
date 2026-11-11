'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InstructorFormHeader from './InstructorFormHeader'
import InstructorAccount from './InstructorAccount'
import InstructorInformation from './InstructorInformation'
import InstructorEngagement from './InstructorEngagement'
import InstructorDocuments from './InstructorDocuments'

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

const InstructorForm = ({
                          mode,
                          instructorId
                        }: Props) => {
  return (
    <Grid container spacing={6}>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Grid size={{ xs: 12 }}>
        <InstructorFormHeader
          mode={mode}
          instructorId={instructorId}
        />
      </Grid>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>

          {/* Account */}
          <Grid size={{ xs: 12 }}>
            <InstructorAccount
              mode={mode}
              instructorId={instructorId}
            />
          </Grid>

          {/* Instructor Information */}
          <Grid size={{ xs: 12 }}>
            <InstructorInformation
              mode={mode}
              instructorId={instructorId}
            />
          </Grid>

        </Grid>
      </Grid>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>

          {/* Engagement */}
          <Grid size={{ xs: 12 }}>
            <InstructorEngagement
              mode={mode}
              instructorId={instructorId}
            />
          </Grid>

          {/* Documents */}
          <Grid size={{ xs: 12 }}>
            <InstructorDocuments
              mode={mode}
              instructorId={instructorId}
            />
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  )
}

export default InstructorForm

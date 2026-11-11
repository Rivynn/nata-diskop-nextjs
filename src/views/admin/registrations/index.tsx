
// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { TrainingRegistrationTableType } from '@/types/apps/registrationTypes'

// Component Imports
import RegistrationListTable from './RegistrationListTable'
import RegistrationListCards from './RegistrationListCards'

const RegistrationList = ({
                            registrationData
                          }: {
  registrationData?: TrainingRegistrationTableType[]
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <RegistrationListCards />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <RegistrationListTable tableData={registrationData} />
      </Grid>
    </Grid>
  )
}

export default RegistrationList

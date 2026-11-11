// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import PersonalInformation from './PersonalInformation'
import ContactInformation from './ContactInformation'

const Personal = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PersonalInformation />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ContactInformation />
      </Grid>
    </Grid>
  )
}

export default Personal

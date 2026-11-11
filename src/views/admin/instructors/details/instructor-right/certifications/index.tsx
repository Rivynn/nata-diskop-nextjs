// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CertificationListTable from './CertificationListTable'

const Certifications = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CertificationListTable />
      </Grid>
    </Grid>
  )
}

export default Certifications

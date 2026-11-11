// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import EngagementOverview from './EngagementOverview'
import ContractDetails from './ContractDetails'
import PartnerRelations from './PartnerRelations'

const Engagement = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <EngagementOverview />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ContractDetails />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PartnerRelations />
      </Grid>
    </Grid>
  )
}

export default Engagement

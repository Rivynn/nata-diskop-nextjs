// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import WelcomeCard from '@views/admin/dashboard/WelcomeCard'
import StatisticsCards from '@views/admin/dashboard/StatisticsCards'
import TrainingOverview from '@views/admin/dashboard/TrainingOverview'
import RegistrationOverview from '@views/admin/dashboard/RegistrationOverview'
import PopularInstructors from '@views/admin/dashboard/PopularInstructors'
import RecentRegistrations from '@views/admin/dashboard/RecentRegistrations'

const Page = async () => {
  return (
    <Grid container spacing={6}>
      {/* Welcome */}
      <Grid size={{ xs: 12 }}>
        <WelcomeCard />
      </Grid>

      {/* Statistics */}
      <Grid size={{ xs: 12 }}>
        <StatisticsCards />
      </Grid>

      {/* Training Categories */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <TrainingOverview />
      </Grid>

      {/* Training Status */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <RegistrationOverview />
      </Grid>

      {/* Recent Registrations */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentRegistrations />
      </Grid>

      {/* Action Required */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <PopularInstructors />
      </Grid>


    </Grid>
  )
}

export default Page

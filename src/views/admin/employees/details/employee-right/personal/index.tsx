import Grid from '@mui/material/Grid2'

import PersonalInformation from './PersonalInformation'
import ContactInformation from './ContactInformation'

type Props = {
  employeeId: string
}

const Personal = ({ employeeId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PersonalInformation employeeId={employeeId} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ContactInformation employeeId={employeeId} />
      </Grid>
    </Grid>
  )
}

export default Personal


// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { ParticipantsType } from '@/types/apps/participantTypes'

// Component Imports
import ParticipantListTable from './ParticipantListTable'
import ParticipantListCards from './ParticipantListCards'

const ParticipantList = ({
                           participantData
                         }: {
  participantData?: ParticipantsType[]
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ParticipantListCards />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ParticipantListTable tableData={participantData} />
      </Grid>
    </Grid>
  )
}

export default ParticipantList

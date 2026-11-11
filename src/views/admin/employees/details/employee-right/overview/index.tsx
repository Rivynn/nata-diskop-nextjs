import Grid from '@mui/material/Grid2'

import EmployeeStatisticsCard from './EmployeeStatisticsCard'
import EmploymentHistoryTable from './EmploymentHistoryTable'

type Props = {
  employeeId: string
}

const Overview = ({ employeeId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <EmployeeStatisticsCard employeeId={employeeId} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EmploymentHistoryTable employeeId={employeeId} />
      </Grid>
    </Grid>
  )
}

export default Overview

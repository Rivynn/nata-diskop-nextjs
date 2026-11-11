
import Grid from '@mui/material/Grid2'

import type { EmployeeRecord } from '../../all/types'

import EmployeeDetails from './EmployeeDetails'

type Props = {
  employeeData?: EmployeeRecord
}

const EmployeeLeftOverview = ({ employeeData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <EmployeeDetails employeeData={employeeData} />
      </Grid>
    </Grid>
  )
}

export default EmployeeLeftOverview


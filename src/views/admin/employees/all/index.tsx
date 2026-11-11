import Grid from '@mui/material/Grid2'

import EmployeeListCards from './EmployeeListCards'
import EmployeeListTable from './EmployeeListTable'
import type { EmployeeRecord } from './types'

type EmployeeListProps = {
  employeeData?: EmployeeRecord[] | null
}

const EmployeeList = ({ employeeData = [] }: EmployeeListProps) => {
  const data = employeeData ?? []

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <EmployeeListCards data={data} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EmployeeListTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default EmployeeList

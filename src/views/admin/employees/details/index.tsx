// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { EmployeeRecord } from '@/views/admin/employees/all/types'

// Component Imports
import EmployeeDetailsHeader from './EmployeeDetailsHeader'
import EmployeeLeftOverview from './employee-left-overview'
import EmployeeRight from './employee-right'

const EmployeeDetails = ({
  employeeData,
  employeeId
}: {
  employeeData?: EmployeeRecord
  employeeId: string
}) => {
  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <EmployeeDetailsHeader
          employeeId={employeeId}
          employeeData={employeeData}
        />
      </Grid>

      {/* Left Overview */}
      <Grid size={{ xs: 12, md: 4 }}>
        <EmployeeLeftOverview employeeData={employeeData} />
      </Grid>

      {/* Right Content */}
      <Grid size={{ xs: 12, md: 8 }}>
        <EmployeeRight employeeData={employeeData} />
      </Grid>
    </Grid>
  )
}

export default EmployeeDetails

'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import EmployeeFormHeader from './EmployeeFormHeader'
import EmployeeAccount from './EmployeeAccount'
import EmployeeInformation from './EmployeeInformation'
import EmployeeDocuments from './EmployeeDocuments'

type Props = {
  mode: 'create' | 'edit'
  employeeId?: string
}

const EmployeeForm = ({
                        mode,
                        employeeId
                      }: Props) => {
  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <EmployeeAccount
            mode={mode}
            employeeId={employeeId}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <EmployeeInformation
            mode={mode}
            employeeId={employeeId}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EmployeeForm

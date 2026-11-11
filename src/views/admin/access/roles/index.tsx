// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component Imports
import RoleCards from './RoleCards'
import RolesTable from './RolesTable'

// Type Imports
import type { RoleType } from './types'

const Roles = ({ roleData }: { roleData?: RoleType[] }) => {
  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='mbe-1'>
          Role & Hak Akses
        </Typography>

        <Typography color='text.secondary'>
          Kelola tampilan role sistem dan lihat hak akses yang tersedia untuk setiap role.
          Hak akses ditentukan oleh sistem dan tidak dapat diubah melalui halaman ini.
        </Typography>
      </Grid>

      {/* Role Cards */}
      <Grid size={{ xs: 12 }}>
        <RoleCards />
      </Grid>

   
    </Grid>
  )
}

export default Roles

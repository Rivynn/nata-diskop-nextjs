import Grid from '@mui/material/Grid2'

import type { UsersType } from '@/types/apps/userTypes'

import AdminListCards from './AdminListCards'
import AdminListTable from './AdminListTable'

type Props = {
  adminData?: UsersType[]
}

const AdminList = ({ adminData = [] }: Props) => {
  return (
    <Grid container spacing={6}>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Grid size={{ xs: 12 }}>
        <div className='flex flex-col gap-1'>
          <h4 className='text-[24px] font-semibold leading-[1.4]'>
            Administrator
          </h4>

          <p className='text-[15px] text-textSecondary'>
            Kelola akun administrator dan akses pengelolaan
            sistem DISKOP.
          </p>
        </div>
      </Grid>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <Grid size={{ xs: 12 }}>
        <AdminListCards adminData={adminData} />
      </Grid>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <Grid size={{ xs: 12 }}>
        <AdminListTable adminData={adminData} />
      </Grid>
    </Grid>
  )
}

export default AdminList

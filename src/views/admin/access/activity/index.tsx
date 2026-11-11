'use client'

import Typography from '@mui/material/Typography'

import ActivityCards from './ActivityCards'
import ActivityTable from './ActivityTable'
import { activityDb } from './fakeDb'

const Activity = () => {
  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-1'>
        <Typography variant='h4'>
          Log Aktivitas
        </Typography>

        <Typography
          color='text.secondary'
        >
          Riwayat aktivitas pengguna dan
          perubahan data di dalam sistem.
        </Typography>
      </div>

      {/* Summary */}
      <ActivityCards
        activities={activityDb}
      />

      {/* Table */}
      <ActivityTable
        data={activityDb}
      />
    </div>
  )
}

export default Activity

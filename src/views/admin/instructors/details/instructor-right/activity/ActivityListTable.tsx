// React Imports
import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type ActivityType = {
  id: number
  activity: string
  description: string
  module: string
  date: string
  status: 'success' | 'failed'
}

const activityData: ActivityType[] = [
  {
    id: 1,
    activity: 'Memperbarui profil',
    description: 'Mengubah informasi profil pelatih.',
    module: 'Profil',
    date: '2026-10-04T09:24:00',
    status: 'success'
  },
  {
    id: 2,
    activity: 'Mengubah keahlian',
    description: 'Menambahkan keahlian Digital Marketing.',
    module: 'Keahlian',
    date: '2026-10-03T14:18:00',
    status: 'success'
  },
  {
    id: 3,
    activity: 'Mengunggah dokumen',
    description: 'Mengunggah sertifikat kompetensi.',
    module: 'Dokumen',
    date: '2026-10-02T10:42:00',
    status: 'success'
  },
  {
    id: 4,
    activity: 'Memperbarui keterikatan',
    description: 'Memperbarui informasi kontrak pelatih.',
    module: 'Keterikatan',
    date: '2026-09-30T15:10:00',
    status: 'success'
  },
  {
    id: 5,
    activity: 'Login',
    description: 'Berhasil masuk ke sistem DISKOP.',
    module: 'Akun',
    date: '2026-09-29T08:12:00',
    status: 'success'
  }
]

const ActivityListTable = () => {
  const data = useMemo(() => activityData, [])

  return (
    <Card>
      <CardContent className='flex flex-col gap-1'>
        <Typography variant='h5'>Aktivitas</Typography>

        <Typography variant='body2' color='text.secondary'>
          Riwayat aktivitas pelatih dalam sistem DISKOP.
        </Typography>
      </CardContent>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
          <tr>
            <th>Aktivitas</th>
            <th>Modul</th>
            <th>Waktu</th>
            <th>Status</th>
          </tr>
          </thead>

          <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>
                <div className='flex flex-col gap-1'>
                  <Typography className='font-medium'>
                    {item.activity}
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    {item.description}
                  </Typography>
                </div>
              </td>

              <td>
                <Chip
                  label={item.module}
                  variant='tonal'
                  color='primary'
                  size='small'
                />
              </td>

              <td>
                <Typography variant='body2'>
                  {new Date(item.date).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </td>

              <td>
                <Chip
                  label={item.status === 'success' ? 'Berhasil' : 'Gagal'}
                  variant='tonal'
                  color={item.status === 'success' ? 'success' : 'error'}
                  size='small'
                />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ActivityListTable

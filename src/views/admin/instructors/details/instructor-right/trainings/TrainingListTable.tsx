'use client'

// React Imports
import { useMemo } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type InstructorTraining = {
  id: number
  title: string
  category: string
  startDate: string
  endDate: string
  participants: number
  rating: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

const trainingData: InstructorTraining[] = [
  {
    id: 1,
    title: 'Digital Marketing untuk UMKM',
    category: 'Digital Marketing',
    startDate: '2026-10-06',
    endDate: '2026-10-10',
    participants: 32,
    rating: 4.9,
    status: 'ongoing'
  },
  {
    id: 2,
    title: 'Administrasi Perkantoran Digital',
    category: 'Administrasi Perkantoran',
    startDate: '2026-09-15',
    endDate: '2026-09-19',
    participants: 28,
    rating: 4.8,
    status: 'completed'
  },
  {
    id: 3,
    title: 'Strategi Bisnis untuk UMKM',
    category: 'Kewirausahaan',
    startDate: '2026-08-11',
    endDate: '2026-08-15',
    participants: 41,
    rating: 4.9,
    status: 'completed'
  },
  {
    id: 4,
    title: 'Pemasaran melalui Media Sosial',
    category: 'Digital Marketing',
    startDate: '2026-11-03',
    endDate: '2026-11-07',
    participants: 35,
    rating: 0,
    status: 'upcoming'
  },
  {
    id: 5,
    title: 'Dasar-Dasar Manajemen Bisnis',
    category: 'Manajemen Bisnis',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    participants: 26,
    rating: 4.7,
    status: 'completed'
  }
]

const TrainingListTable = () => {
  const data = useMemo(() => trainingData, [])

  const getStatus = (status: InstructorTraining['status']) => {
    switch (status) {
      case 'upcoming':
        return {
          label: 'Akan Datang',
          color: 'info' as const
        }

      case 'ongoing':
        return {
          label: 'Berlangsung',
          color: 'primary' as const
        }

      case 'completed':
        return {
          label: 'Selesai',
          color: 'success' as const
        }

      case 'cancelled':
        return {
          label: 'Dibatalkan',
          color: 'error' as const
        }
    }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-1'>
        <Typography variant='h5'>Pelatihan yang Ditangani</Typography>

        <Typography variant='body2' color='text.secondary'>
          Daftar program pelatihan yang pernah dan sedang ditangani oleh pelatih.
        </Typography>
      </CardContent>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
          <tr>
            <th>Pelatihan</th>
            <th>Periode</th>
            <th>Peserta</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
          </thead>

          <tbody>
          {data.map(item => {
            const status = getStatus(item.status)

            return (
              <tr key={item.id}>
                <td>
                  <div className='flex flex-col gap-1'>
                    <Typography
                      component={Link}
                      href={`/admin/trainings/${item.id}`}
                      color='primary.main'
                      className='font-medium'
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      {item.category}
                    </Typography>
                  </div>
                </td>

                <td>
                  <div className='flex flex-col'>
                    <Typography variant='body2'>
                      {new Date(item.startDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      s/d{' '}
                      {new Date(item.endDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>
                  </div>
                </td>

                <td>
                  <div className='flex items-center gap-2'>
                    <i className='tabler-users text-textSecondary' />

                    <Typography variant='body2'>
                      {item.participants}
                    </Typography>
                  </div>
                </td>

                <td>
                  {item.rating > 0 ? (
                    <div className='flex items-center gap-1'>
                      <i className='tabler-star-filled text-warning' />

                      <Typography variant='body2'>
                        {item.rating.toFixed(1)}
                      </Typography>
                    </div>
                  ) : (
                    <Typography
                      variant='body2'
                      color='text.disabled'
                    >
                      Belum ada
                    </Typography>
                  )}
                </td>

                <td>
                  <Chip
                    label={status.label}
                    color={status.color}
                    variant='tonal'
                    size='small'
                  />
                </td>

                <td>
                  <Link
                    href={`/admin/trainings/${item.id}`}
                    className='flex items-center gap-1 text-primary'
                  >
                    <i className='tabler-eye' />
                    <Typography
                      component='span'
                      variant='body2'
                      color='primary'
                    >
                      Lihat
                    </Typography>
                  </Link>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TrainingListTable

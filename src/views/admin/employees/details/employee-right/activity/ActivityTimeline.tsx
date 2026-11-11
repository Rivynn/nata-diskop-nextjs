'use client'

import { useMemo } from 'react'


import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import type { TimelineProps } from '@mui/lab/Timeline'

import CustomAvatar from '@core/components/mui/Avatar'

type EmployeeActivityType = {
  id: number
  employeeId: string
  title: string
  description: string
  module: string
  time: string
  date: string
  type: 'login' | 'logout' | 'profile' | 'employment' | 'document' | 'security' | 'account'
  color: 'primary' | 'success' | 'info' | 'warning' | 'error'
  attachment?: {
    name: string
    type: 'pdf' | 'image'
  }
}

type Props = {
  employeeId: string
}

const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,

  '& .MuiTimelineItem-root': {
    width: '100%',

    '&:before': {
      display: 'none'
    }
  }
})

// Dummy activity data untuk prototipe UI.
const activityData: EmployeeActivityType[] = [
  {
    id: 1,
    employeeId: '1',
    title: 'Masuk ke akun',
    description: 'Pegawai berhasil masuk ke sistem melalui perangkat desktop.',
    module: 'Keamanan',
    time: '09:12',
    date: '04 Okt 2026',
    type: 'login',
    color: 'success'
  },
  {
    id: 2,
    employeeId: '1',
    title: 'Memperbarui profil',
    description: 'Informasi profil pegawai diperbarui.',
    module: 'Profil',
    time: '09:26',
    date: '04 Okt 2026',
    type: 'profile',
    color: 'primary'
  },
  {
    id: 3,
    employeeId: '1',
    title: 'Mengunggah dokumen',
    description: 'Pegawai menambahkan dokumen pendukung pada profil.',
    module: 'Dokumen',
    time: '10:14',
    date: '03 Okt 2026',
    type: 'document',
    color: 'info',
    attachment: {
      name: 'Dokumen_Pendukung.pdf',
      type: 'pdf'
    }
  },
  {
    id: 4,
    employeeId: '1',
    title: 'Data kepegawaian diperbarui',
    description: 'Informasi jabatan atau keterikatan kerja diperbarui.',
    module: 'Kepegawaian',
    time: '16:42',
    date: '02 Okt 2026',
    type: 'employment',
    color: 'success'
  },
  {
    id: 5,
    employeeId: '1',
    title: 'Mengubah kata sandi',
    description: 'Kata sandi akun berhasil diperbarui.',
    module: 'Keamanan',
    time: '10:08',
    date: '24 Sep 2026',
    type: 'security',
    color: 'warning'
  },
  {
    id: 6,
    employeeId: '1',
    title: 'Status akun diperbarui',
    description: 'Status akun pegawai mengalami perubahan.',
    module: 'Manajemen Akun',
    time: '14:36',
    date: '22 Sep 2026',
    type: 'account',
    color: 'info'
  },
  {
    id: 7,
    employeeId: '1',
    title: 'Keluar dari akun',
    description: 'Pegawai mengakhiri sesi akun.',
    module: 'Keamanan',
    time: '18:21',
    date: '20 Sep 2026',
    type: 'logout',
    color: 'error'
  }
]

const ActivityTimeline = ({ employeeId }: Props) => {
  const data = useMemo(
    () => activityData.filter(item => item.employeeId === employeeId),
    [employeeId]
  )

  const getIcon = (type: EmployeeActivityType['type']) => {
    switch (type) {
      case 'login':
        return 'tabler-login'
      case 'logout':
        return 'tabler-logout'
      case 'profile':
        return 'tabler-user-edit'
      case 'employment':
        return 'tabler-briefcase'
      case 'document':
        return 'tabler-file-upload'
      case 'security':
        return 'tabler-shield-lock'
      case 'account':
        return 'tabler-user-cog'
      default:
        return 'tabler-history'
    }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <CustomAvatar variant='rounded' skin='light' color='primary' size={44}>
              <i className='tabler-history text-[1.35rem]' />
            </CustomAvatar>

            <div className='flex flex-col gap-0.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <Typography variant='h5'>Aktivitas Pegawai</Typography>

                <Chip
                  label={`${data.length} Aktivitas`}
                  size='small'
                  variant='tonal'
                  color='primary'
                />
              </div>

              <Typography variant='body2' color='text.secondary'>
                Riwayat aktivitas akun dan administrasi pegawai.
              </Typography>
            </div>
          </div>

          <Tooltip title='Muat ulang'>
            <IconButton
              size='small'
              onClick={() => window.location.reload()}
              aria-label='Muat ulang aktivitas'
            >
              <i className='tabler-refresh' />
            </IconButton>
          </Tooltip>
        </div>

        {data.length > 0 ? (
          <div className='overflow-y-auto pe-2' style={{ maxHeight: 620 }}>
            <Timeline>
              {data.map((item, index) => (
                <TimelineItem key={item.id}>
                  <TimelineSeparator>
                    <TimelineDot
                      color={item.color}
                      sx={{
                        boxShadow: 'none',
                        margin: 0,
                        width: 34,
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={`${getIcon(item.type)} text-[1rem]`} />
                    </TimelineDot>

                    {index !== data.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>

                  <TimelineContent
                    className='flex flex-col gap-2'
                    sx={{
                      paddingTop: 0,
                      paddingBottom: 5
                    }}
                  >
                    <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <Typography className='font-medium' color='text.primary'>
                          {item.title}
                        </Typography>

                        <Chip
                          label={item.module}
                          size='small'
                          variant='tonal'
                          color={item.color}
                          sx={{
                            height: 22,
                            '& .MuiChip-label': {
                              px: 1.5
                            }
                          }}
                        />
                      </div>

                      <Typography variant='caption'>
                        {item.date} • {item.time}
                      </Typography>
                    </div>

                    <Typography>{item.description}</Typography>

                    {item.attachment && (
                      <div className='flex items-center gap-2.5 is-fit rounded bg-actionHover plb-[5px] pli-2.5'>
                        <i className='tabler-file-type-pdf text-xl text-error' />

                        <Typography variant='body2' className='font-medium'>
                          {item.attachment.name}
                        </Typography>

                        <Tooltip title='Pratinjau belum tersedia'>
                          <IconButton
                            size='small'
                            className='mis-1'
                            aria-label='Pratinjau dokumen'
                          >
                            <i className='tabler-eye text-[1rem]' />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-divider px-6 py-12 text-center'>
            <CustomAvatar variant='rounded' skin='light' color='secondary' size={54}>
              <i className='tabler-history text-2xl' />
            </CustomAvatar>

            <Typography variant='h6'>Belum Ada Aktivitas</Typography>

            <Typography variant='body2' color='text.secondary'>
              Belum ada riwayat aktivitas yang tercatat untuk pegawai ini.
            </Typography>
          </div>
        )}

        <div className='rounded-lg bg-actionHover px-4 py-3'>
          <div className='flex items-start gap-2'>
            <i className='tabler-info-circle mt-0.5 text-textSecondary' />

            <Typography variant='caption' color='text.secondary'>
              Riwayat ini merupakan data simulasi untuk prototipe. Pada implementasi
              produksi, aktivitas harus diambil dari audit log sistem agar waktu,
              pelaku, dan tindakan tercatat secara akurat.
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline

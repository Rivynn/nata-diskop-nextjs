'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Timeline Imports
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import type { TimelineProps } from '@mui/lab/Timeline'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Timeline
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

type ActivityType = {
  id: number
  title: string
  description: string
  module: string
  time: string
  date: string
  type:
    | 'login'
    | 'logout'
    | 'profile'
    | 'training'
    | 'material'
    | 'evaluation'
    | 'certificate'
    | 'security'
  color: 'primary' | 'success' | 'info' | 'warning' | 'error'
  attachment?: {
    name: string
    type: 'pdf' | 'image'
  }
  training?: {
    name: string
  }
}

const activityData: ActivityType[] = [
  {
    id: 1,
    title: 'Masuk ke akun',
    description:
      'Berhasil masuk ke akun pelatih melalui perangkat desktop.',
    module: 'Keamanan',
    time: '09:12',
    date: '04 Okt 2026',
    type: 'login',
    color: 'success'
  },
  {
    id: 2,
    title: 'Memperbarui profil',
    description:
      'Memperbarui informasi profil dan deskripsi sebagai pelatih.',
    module: 'Profil',
    time: '09:26',
    date: '04 Okt 2026',
    type: 'profile',
    color: 'primary'
  },
  {
    id: 3,
    title: 'Mengunggah materi',
    description:
      'Mengunggah materi pembelajaran baru untuk pelatihan Digital Marketing Dasar.',
    module: 'Materi',
    time: '10:14',
    date: '03 Okt 2026',
    type: 'material',
    color: 'info',
    training: {
      name: 'Digital Marketing Dasar'
    },
    attachment: {
      name: 'Modul_Digital_Marketing.pdf',
      type: 'pdf'
    }
  },
  {
    id: 4,
    title: 'Menyelesaikan sesi pelatihan',
    description:
      'Menyelesaikan sesi pelatihan dan memperbarui aktivitas kelas.',
    module: 'Pelatihan',
    time: '16:42',
    date: '02 Okt 2026',
    type: 'training',
    color: 'success',
    training: {
      name: 'Digital Marketing Dasar'
    }
  },
  {
    id: 5,
    title: 'Memberikan penilaian peserta',
    description:
      'Memberikan penilaian terhadap peserta pada sesi pelatihan yang telah berlangsung.',
    module: 'Penilaian',
    time: '15:18',
    date: '01 Okt 2026',
    type: 'evaluation',
    color: 'warning',
    training: {
      name: 'Digital Marketing Dasar'
    }
  },
  {
    id: 6,
    title: 'Mengisi evaluasi pelatihan',
    description:
      'Memberikan evaluasi terhadap pelaksanaan pelatihan yang telah selesai.',
    module: 'Evaluasi',
    time: '17:05',
    date: '30 Sep 2026',
    type: 'evaluation',
    color: 'warning',
    training: {
      name: 'Administrasi Perkantoran'
    }
  },
  {
    id: 7,
    title: 'Memperbarui keahlian',
    description:
      'Menambahkan keahlian baru pada profil sebagai pelatih.',
    module: 'Keahlian',
    time: '14:36',
    date: '28 Sep 2026',
    type: 'profile',
    color: 'info'
  },
  {
    id: 8,
    title: 'Mengunggah sertifikat',
    description:
      'Menambahkan sertifikat kompetensi baru ke profil pelatih.',
    module: 'Sertifikasi',
    time: '11:24',
    date: '26 Sep 2026',
    type: 'certificate',
    color: 'success',
    attachment: {
      name: 'Sertifikat_Junior_Web_Developer.pdf',
      type: 'pdf'
    }
  },
  {
    id: 9,
    title: 'Mengubah kata sandi',
    description:
      'Berhasil memperbarui kata sandi akun pelatih.',
    module: 'Keamanan',
    time: '10:08',
    date: '24 Sep 2026',
    type: 'security',
    color: 'warning'
  },
  {
    id: 10,
    title: 'Keluar dari akun',
    description:
      'Keluar dari sesi akun pelatih.',
    module: 'Keamanan',
    time: '18:21',
    date: '23 Sep 2026',
    type: 'logout',
    color: 'error'
  }
]

const ActivityTimeline = () => {
  const data = useMemo(() => activityData, [])

  const getIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'login':
        return 'tabler-login'

      case 'logout':
        return 'tabler-logout'

      case 'profile':
        return 'tabler-user-edit'

      case 'training':
        return 'tabler-school'

      case 'material':
        return 'tabler-file-upload'

      case 'evaluation':
        return 'tabler-message-star'

      case 'certificate':
        return 'tabler-certificate'

      case 'security':
        return 'tabler-shield-lock'

      default:
        return 'tabler-history'
    }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='primary'
              size={44}
            >
              <i className='tabler-history text-[1.35rem]' />
            </CustomAvatar>

            <div className='flex flex-col gap-0.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <Typography variant='h5'>
                  Aktivitas
                </Typography>

                <Chip
                  label={`${data.length} Aktivitas`}
                  size='small'
                  variant='tonal'
                  color='primary'
                />
              </div>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Riwayat aktivitas yang dilakukan oleh pelatih.
              </Typography>
            </div>
          </div>

          <Tooltip title='Muat ulang'>
            <IconButton size='small'>
              <i className='tabler-refresh' />
            </IconButton>
          </Tooltip>
        </div>

        {/* Scrollable Timeline */}
        <div
          className='overflow-y-auto pe-2'
          style={{
            maxHeight: 620
          }}
        >
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
                    <i
                      className={`${getIcon(item.type)} text-[1rem]`}
                    />
                  </TimelineDot>

                  {index !== data.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>

                <TimelineContent
                  className='flex flex-col gap-2'
                  sx={{
                    paddingTop: 0,
                    paddingBottom: 5
                  }}
                >
                  {/* Activity title */}
                  <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Typography
                        className='font-medium'
                        color='text.primary'
                      >
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

                  {/* Description */}
                  <Typography>
                    {item.description}
                  </Typography>

                  {/* Training */}
                  {item.training && (
                    <div className='flex items-center gap-2.5 is-fit rounded bg-actionHover plb-[5px] pli-2.5'>
                      <CustomAvatar
                        variant='rounded'
                        skin='light'
                        color='primary'
                        size={28}
                      >
                        <i className='tabler-school text-[0.9rem]' />
                      </CustomAvatar>

                      <Typography
                        variant='body2'
                        className='font-medium'
                      >
                        {item.training.name}
                      </Typography>
                    </div>
                  )}

                  {/* Attachment */}
                  {item.attachment && (
                    <div className='flex items-center gap-2.5 is-fit rounded bg-actionHover plb-[5px] pli-2.5'>
                      <img
                        alt={item.attachment.name}
                        src='/images/icons/pdf-document.png'
                        className='h-5'
                      />

                      <Typography className='font-medium'>
                        {item.attachment.name}
                      </Typography>

                      <Tooltip title='Lihat dokumen'>
                        <IconButton
                          size='small'
                          className='mis-1'
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

        {/* Footer */}
        <div className='rounded-lg bg-actionHover px-4 py-3'>
          <div className='flex items-center gap-2'>
            <i className='tabler-info-circle text-textSecondary' />

            <Typography
              variant='caption'
              color='text.secondary'
            >
              Aktivitas ini hanya mencatat tindakan yang
              dilakukan oleh pelatih pada akun dan program
              pelatihannya.
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline

'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import type { TimelineProps } from '@mui/lab/Timeline'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Components
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    }
  }
})

const ActivityTimeline = () => {
  return (
    <Card>
      <CardHeader
        title='Log Aktivitas'
        avatar={<i className='tabler-chart-bar text-textSecondary' />}
        titleTypographyProps={{ variant: 'h5' }}
      />

      <CardContent
        sx={{
          height: 650,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            backgroundColor: 'var(--mui-palette-divider)'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--mui-palette-divider) transparent'
        }}
      >
        <Timeline>

          {/* Login Berhasil */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Login berhasil
                </Typography>

                <Typography variant='caption'>
                  12 min ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Berhasil masuk ke akun administrator.
              </Typography>

              <div className='flex'>
                <div className='flex gap-2.5 items-center pli-2.5 bg-actionHover plb-[0.3125rem] rounded'>
                  <img
                    alt='document.pdf'
                    src='/images/icons/pdf-document.png'
                    className='bs-5'
                  />

                  <Typography className='font-medium'>
                    document.pdf
                  </Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Profil Diperbarui */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='success' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Profil diperbarui
                </Typography>

                <Typography variant='caption'>
                  2 jam ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Data profil pengguna berhasil diperbarui.
              </Typography>

              <div className='flex items-center gap-2'>
                <CustomAvatar
                  src='/images/avatars/1.png'
                  skin='light'
                  size={24}
                  color='primary'
                />

                <Typography variant='body2'>
                  Muhammad Rizki Firdaus
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Password Diubah */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='warning' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Kata sandi diubah
                </Typography>

                <Typography variant='caption'>
                  Kemarin
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Kata sandi akun berhasil diperbarui.
              </Typography>

              <div className='flex items-center gap-2'>
                <CustomAvatar
                  skin='light'
                  color='warning'
                  size={24}
                >
                  <i className='tabler-lock' />
                </CustomAvatar>

                <Typography variant='body2'>
                  Keamanan Akun
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Foto Profil */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Foto profil diperbarui
                </Typography>

                <Typography variant='caption'>
                  2 hari ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Foto profil baru berhasil diunggah ke akun.
              </Typography>

              <div className='flex'>
                <div className='flex gap-2.5 items-center pli-2.5 bg-actionHover plb-[0.3125rem] rounded'>
                  <img
                    alt='profile-photo.pdf'
                    src='/images/icons/pdf-document.png'
                    className='bs-5'
                  />

                  <Typography className='font-medium'>
                    profile-photo.pdf
                  </Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Data Pribadi */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='secondary' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Data pribadi diperbarui
                </Typography>

                <Typography variant='caption'>
                  3 hari ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Informasi data pribadi berhasil diperbarui.
              </Typography>

              <div className='flex'>
                <div className='flex gap-2.5 items-center pli-2.5 bg-actionHover plb-[0.3125rem] rounded'>
                  <img
                    alt='personal-data.pdf'
                    src='/images/icons/pdf-document.png'
                    className='bs-5'
                  />

                  <Typography className='font-medium'>
                    personal-data.pdf
                  </Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Login Perangkat Baru */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='error' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Login dari perangkat baru
                </Typography>

                <Typography variant='caption'>
                  5 hari ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Akun digunakan untuk login dari perangkat baru.
              </Typography>

              <div className='flex items-center gap-2'>
                <CustomAvatar
                  skin='light'
                  color='error'
                  size={24}
                >
                  <i className='tabler-device-laptop' />
                </CustomAvatar>

                <div>
                  <Typography variant='body2' className='font-medium'>
                    Windows PC
                  </Typography>

                  <Typography variant='caption'>
                    Banjarmasin, Kalimantan Selatan
                  </Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Verifikasi Identitas */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='success' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Profil berhasil diverifikasi
                </Typography>

                <Typography variant='caption'>
                  1 minggu ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Data identitas akun telah berhasil diverifikasi.
              </Typography>

              <div className='flex'>
                <div className='flex gap-2.5 items-center pli-2.5 bg-actionHover plb-[0.3125rem] rounded'>
                  <img
                    alt='identity-verification.pdf'
                    src='/images/icons/pdf-document.png'
                    className='bs-5'
                  />

                  <Typography className='font-medium'>
                    identity-verification.pdf
                  </Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Sesi Perangkat Ditutup */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='warning' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Sesi perangkat ditutup
                </Typography>

                <Typography variant='caption'>
                  1 minggu ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Salah satu sesi aktif pada perangkat lain telah ditutup.
              </Typography>

              <AvatarGroup
                total={3}
                className='pull-up'
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 30,
                    height: 30,
                    fontSize: '0.8rem'
                  }
                }}
              >
                <Avatar
                  alt='Windows'
                  src='/images/avatars/1.png'
                />

                <Avatar
                  alt='Android'
                  src='/images/avatars/2.png'
                />

                <Avatar
                  alt='Chrome'
                  src='/images/avatars/3.png'
                />
              </AvatarGroup>
            </TimelineContent>
          </TimelineItem>

          {/* Notifikasi */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Pengaturan notifikasi diperbarui
                </Typography>

                <Typography variant='caption'>
                  2 minggu ago
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Preferensi notifikasi akun berhasil diperbarui.
              </Typography>

              <div className='flex'>
                <div className='flex gap-2.5 items-center pli-2.5 bg-actionHover plb-[0.3125rem] rounded'>
                  <img
                    alt='notification-settings.pdf'
                    src='/images/icons/pdf-document.png'
                    className='bs-5'
                  />

                  <Typography className='font-medium'>
                    notification-settings.pdf
                  </Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {/* Akun Dibuat */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='success' />
            </TimelineSeparator>

            <TimelineContent>
              <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                <Typography className='text-textPrimary font-medium'>
                  Akun dibuat
                </Typography>

                <Typography variant='caption'>
                  Januari 2025
                </Typography>
              </div>

              <Typography className='mbe-2'>
                Akun administrator berhasil dibuat dan terdaftar pada sistem DISKOP.
              </Typography>

              <div className='flex items-center gap-2'>
                <CustomAvatar
                  skin='light'
                  color='success'
                  size={24}
                >
                  <i className='tabler-building-community' />
                </CustomAvatar>

                <Typography variant='body2'>
                  DISKOP Banjarbaru
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>

        </Timeline>
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline

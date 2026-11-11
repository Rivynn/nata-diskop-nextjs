// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Type Imports
import type { InstructorCardType } from '../types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

type Props = {
  instructorData?: InstructorCardType
}

const InstructorDetails = ({
                             instructorData
                           }: Props) => {
  // Dummy fallback data
  const instructor = {
    name: instructorData?.name ?? 'Natasya Deviana',
    username: instructorData?.username ?? '@natasya',
    id: instructorData?.id ?? 1,
    avatar: instructorData?.avatar ?? '/images/avatars/tasya-pp.png',
    position:
      instructorData?.position ?? 'Pelatih Digital Marketing',
    status: instructorData?.status ?? 'active',
    totalTrainings: instructorData?.totalTrainings ?? 18,
    totalParticipants:
      instructorData?.totalParticipants ?? 426,
    rating: instructorData?.rating ?? 4.8,
    totalReviews: instructorData?.totalReviews ?? 128,
    expertise: instructorData?.expertise ?? [
      {
        title: 'Digital Marketing',
        color: 'primary' as const
      },
      {
        title: 'Social Media',
        color: 'info' as const
      },
      {
        title: 'Branding',
        color: 'warning' as const
      }
    ]
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-10 gap-7'>

        {/* ─────────────────────────────────────────────
            PROFILE
        ───────────────────────────────────────────── */}
        <div className='flex flex-col items-center gap-5'>
          <div className='relative'>
            <div className='absolute -inset-1 rounded-full bg-primary/10 blur-md' />

            <CustomAvatar
              src={instructor.avatar}
              variant='rounded'
              alt={instructor.name}
              size={116}
              className='relative ring-4 ring-background'
            />
          </div>

          <div className='flex flex-col items-center text-center gap-1.5'>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <Typography variant='h5'>
                {instructor.name}
              </Typography>

              <Chip
                label={
                  instructor.status === 'active'
                    ? 'Aktif'
                    : 'Nonaktif'
                }
                variant='tonal'
                color={
                  instructor.status === 'active'
                    ? 'success'
                    : 'secondary'
                }
                size='small'
              />
            </div>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              {instructor.username}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              {instructor.position}
            </Typography>

            <Typography
              variant='caption'
              color='text.disabled'
              className='mbe-1'
            >
              ID Pelatih #{instructor.id}
            </Typography>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            QUICK STATISTICS
        ───────────────────────────────────────────── */}
        <div className='grid grid-cols-3 rounded-lg border border-divider overflow-hidden'>
          {/* Training */}
          <div className='flex flex-col items-center gap-2 p-4'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='primary'
              size={38}
            >
              <i className='tabler-school text-lg' />
            </CustomAvatar>

            <div className='flex flex-col items-center'>
              <Typography variant='h6'>
                {instructor.totalTrainings}
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Pelatihan
              </Typography>
            </div>
          </div>

          {/* Participants */}
          <div className='flex flex-col items-center gap-2 p-4 border-is border-divider'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='info'
              size={38}
            >
              <i className='tabler-users text-lg' />
            </CustomAvatar>

            <div className='flex flex-col items-center'>
              <Typography variant='h6'>
                {instructor.totalParticipants}
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Peserta
              </Typography>
            </div>
          </div>

          {/* Rating */}
          <div className='flex flex-col items-center gap-2 p-4 border-is border-divider'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='warning'
              size={38}
            >
              <i className='tabler-star-filled text-lg' />
            </CustomAvatar>

            <div className='flex flex-col items-center'>
              <Typography variant='h6'>
                {instructor.rating.toFixed(1)}
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Rating
              </Typography>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            DETAIL PELATIH
        ───────────────────────────────────────────── */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <Typography variant='h6'>
              Detail Pelatih
            </Typography>

            <i className='tabler-user text-textSecondary' />
          </div>

          <Divider />

          <div className='flex flex-col gap-3'>
            {/* Username */}
            <div className='flex items-start justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Username
              </Typography>

              <Typography
                variant='body2'
                className='font-medium text-end'
              >
                {instructor.username}
              </Typography>
            </div>

            {/* Position */}
            <div className='flex items-start justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Jabatan
              </Typography>

              <Typography
                variant='body2'
                className='font-medium text-end'
              >
                {instructor.position}
              </Typography>
            </div>

            {/* Status */}
            <div className='flex items-center justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Status
              </Typography>

              <Chip
                label={
                  instructor.status === 'active'
                    ? 'Aktif'
                    : 'Nonaktif'
                }
                variant='tonal'
                color={
                  instructor.status === 'active'
                    ? 'success'
                    : 'secondary'
                }
                size='small'
              />
            </div>

            {/* Rating */}
            <div className='flex items-center justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Evaluasi
              </Typography>

              <div className='flex items-center gap-1'>
                <i className='tabler-star-filled text-warning' />

                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  {instructor.rating.toFixed(1)}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  ({instructor.totalReviews})
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            KEAHLIAN
        ───────────────────────────────────────────── */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <Typography variant='h6'>
                Keahlian
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kompetensi utama pelatih
              </Typography>
            </div>

            <Chip
              label={`${instructor.expertise.length} keahlian`}
              size='small'
              variant='tonal'
              color='primary'
            />
          </div>

          <Divider />

          <div className='flex flex-wrap gap-2'>
            {instructor.expertise.map(
              (expertise, index) => (
                <Chip
                  key={`${expertise.title}-${index}`}
                  label={expertise.title}
                  variant='tonal'
                  color={expertise.color}
                  size='small'
                />
              )
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            KETERIKATAN
        ───────────────────────────────────────────── */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <Typography variant='h6'>
                Keterikatan
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Hubungan kerja dan kemitraan
              </Typography>
            </div>

            <div className='flex bs-9 is-9 items-center justify-center rounded-lg bg-primary/10'>
              <i className='tabler-briefcase text-primary' />
            </div>
          </div>

          <Divider />

          {/* Employment */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Jenis Keterikatan
              </Typography>

              <Chip
                label='Kontrak'
                size='small'
                variant='tonal'
                color='warning'
              />
            </div>

            <div className='flex items-start justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Periode
              </Typography>

              <Typography
                variant='body2'
                className='font-medium text-end'
              >
                01 Jan 2026 — 31 Des 2026
              </Typography>
            </div>

            <div className='flex items-center justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Status Keterikatan
              </Typography>

              <Chip
                label='Aktif'
                size='small'
                variant='tonal'
                color='success'
              />
            </div>

            <div className='flex items-center justify-between gap-4'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Auto Nonaktif
              </Typography>

              <Typography
                variant='body2'
                className='font-medium'
              >
                Ya
              </Typography>
            </div>
          </div>

          {/* Partner */}
          <div className='flex flex-col gap-3'>
            <Typography
              variant='body2'
              className='font-medium'
            >
              Keterikatan Mitra
            </Typography>

            <div className='rounded-lg border border-divider p-3.5'>
              <div className='flex items-start gap-3'>
                <CustomAvatar
                  variant='rounded'
                  skin='light'
                  color='info'
                  size={38}
                >
                  <i className='tabler-building-skyscraper' />
                </CustomAvatar>

                <div className='flex flex-col gap-1 min-is-0'>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    Tidak ada mitra
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Pelatih belum memiliki keterikatan
                    dengan mitra.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

export default InstructorDetails

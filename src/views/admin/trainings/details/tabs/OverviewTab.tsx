'use client'

import { useMemo } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

const training = {
  code: 'PLT-DISKOP-2026-001',
  title: 'Digital Marketing untuk Pengembangan UMKM',
  subtitle: 'Strategi digital untuk mengembangkan bisnis lokal',
  category: 'Kewirausahaan',
  level: 'Pemula',
  format: 'Hybrid',
  status: 'Dipublikasikan',
  featured: true,
  cover:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=90',

  description:
    'Program pelatihan untuk membantu pelaku UMKM memanfaatkan pemasaran digital, membangun identitas merek, dan menjangkau pelanggan melalui kanal digital yang sesuai dengan kebutuhan usaha.',

  objectives: [
    'Memilih kanal pemasaran digital sesuai target pelanggan.',
    'Menyusun konten promosi yang konsisten dengan identitas merek.',
    'Membaca metrik dasar untuk mengevaluasi performa pemasaran.'
  ],

  advantages: [
    {
      icon: 'tabler-tool',
      title: 'Latihan langsung',
      description: 'Peserta menerapkan materi melalui studi kasus usaha.'
    },
    {
      icon: 'tabler-message-circle',
      title: 'Diskusi bersama instruktur',
      description: 'Peserta dapat membahas tantangan pemasaran yang dihadapi.'
    },
    {
      icon: 'tabler-file-check',
      title: 'Hasil yang bisa diterapkan',
      description: 'Peserta menyusun rencana pemasaran untuk usahanya.'
    }
  ],

  target:
    'Pelaku UMKM, calon wirausaha, dan pengelola usaha yang ingin meningkatkan pemasaran digital.',

  requirements: [
    'Memiliki minat dalam pengembangan usaha.',
    'Mampu menggunakan komputer atau smartphone.',
    'Bersedia mengikuti rangkaian pelatihan.'
  ],

  registration: {
    isOpen: true,
    openAt: '2026-10-01',
    closeAt: '2026-10-18',
    quota: 40,
    registered: 32,
    waitingList: 5
  },

  schedule: {
    startDate: '2026-10-20',
    endDate: '2026-10-22',
    startTime: '08:00',
    endTime: '16:00',
    timezone: 'WITA',
    format: 'Hybrid',
    venue: 'Aula Pelatihan Diskop Banjarbaru',
    address: 'Banjarbaru, Kalimantan Selatan'
  },

  instructor: {
    name: 'Andi Pratama, S.Kom.',
    position: 'Digital Marketing Consultant',
    organization: 'Digital Business Academy',
    avatar: 'https://i.pravatar.cc/240?img=12',
    rating: 4.8,
    reviewCount: 126,
    expertise: ['Digital Marketing', 'SEO', 'Social Media']
  },

  certificate: {
    available: true,
    issuer: 'Dinas Koperasi dan UKM Kota Banjarbaru',
    requirements: [
      'Kehadiran minimal 80%.',
      'Menyelesaikan evaluasi pelatihan.'
    ]
  },

  timeline: [
    {
      title: 'Program dipublikasikan',
      date: '2026-09-25',
      completed: true
    },
    {
      title: 'Pendaftaran berakhir',
      date: '2026-10-18',
      completed: false
    },
    {
      title: 'Pelatihan dimulai',
      date: '2026-10-20',
      completed: false
    }
  ],

  updatedAt: '2026-10-05'
}

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('id-ID').format(value)

const SectionTitle = ({
                        title,
                        description,
                        action
                      }: {
  title: string
  description?: string
  action?: React.ReactNode
}) => (
  <div className='flex items-start justify-between gap-3'>
    <div className='min-w-0'>
      <Typography variant='h6' className='font-semibold'>
        {title}
      </Typography>

      {description && (
        <Typography variant='body2' color='text.secondary' className='mt-1'>
          {description}
        </Typography>
      )}
    </div>

    {action}
  </div>
)

const InfoRow = ({
                   icon,
                   label,
                   value
                 }: {
  icon: string
  label: string
  value: string
}) => (
  <div className='flex items-start gap-3'>
    <i className={`${icon} mt-0.5 text-lg text-textSecondary`} />

    <div className='min-w-0 flex-1'>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>

      <Typography variant='body2' className='mt-0.5 font-medium'>
        {value}
      </Typography>
    </div>
  </div>
)

const OverviewTab = () => {
  const { registration, schedule, instructor } = training

  const progress = useMemo(
    () =>
      registration.quota > 0
        ? Math.min(
          (registration.registered / registration.quota) * 100,
          100
        )
        : 0,
    []
  )

  const remaining = Math.max(
    registration.quota - registration.registered,
    0
  )

  return (
    <Box className='flex flex-col gap-5'>
      {/* Program header */}
      <Card className='overflow-hidden'>
        <Box className='relative h-48 overflow-hidden bg-actionHover sm:h-60'>
          <Box
            component='img'
            src={training.cover}
            alt={training.title}
            className='h-full w-full object-cover'
          />

          <div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent' />

          <div className='absolute inset-0 flex flex-col justify-end p-5 sm:p-7'>
            <div className='mb-3 flex flex-wrap gap-2'>
              <Chip
                size='small'
                label={training.category}
                className='border border-white/20 bg-white/15 text-white'
              />

              <Chip
                size='small'
                label={training.status}
                color='success'
              />

              {training.featured && (
                <Chip
                  size='small'
                  icon={<i className='tabler-star-filled text-sm' />}
                  label='Unggulan'
                  color='warning'
                />
              )}
            </div>

            <Typography
              variant='h4'
              className='max-w-3xl font-bold leading-tight text-white'
            >
              {training.title}
            </Typography>

            <Typography variant='body2' className='mt-2 text-white/80'>
              {training.subtitle}
            </Typography>
          </div>
        </Box>

        <CardContent className='p-4 sm:p-5'>
          <div className='flex flex-wrap items-center gap-x-5 gap-y-3'>
            <InfoRow
              icon='tabler-id'
              label='Kode program'
              value={training.code}
            />

            <InfoRow
              icon='tabler-signal'
              label='Tingkat'
              value={training.level}
            />

            <InfoRow
              icon='tabler-device-laptop'
              label='Metode'
              value={training.format}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compact program stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className='h-full'>
            <CardContent className='flex items-center gap-3 p-4'>
              <Avatar
                variant='rounded'
                className='bs-11 is-11 shrink-0 bg-primaryLight text-primary'
              >
                <i className='tabler-users text-2xl' />
              </Avatar>

              <div className='min-w-0'>
                <Typography variant='h5' className='font-bold'>
                  {formatNumber(registration.registered)}
                  <Typography
                    component='span'
                    variant='body2'
                    color='text.secondary'
                  >
                    {' '}/ {formatNumber(registration.quota)}
                  </Typography>
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  Peserta terdaftar
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className='h-full'>
            <CardContent className='flex items-center gap-3 p-4'>
              <Avatar
                variant='rounded'
                className='bs-11 is-11 shrink-0 bg-warningLight text-warning'
              >
                <i className='tabler-clock text-2xl' />
              </Avatar>

              <div className='min-w-0'>
                <Typography variant='h5' className='font-bold'>
                  {formatNumber(registration.waitingList)}
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  Daftar tunggu
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className='h-full'>
            <CardContent className='flex items-center gap-3 p-4'>
              <Avatar
                variant='rounded'
                className='bs-11 is-11 shrink-0 bg-infoLight text-info'
              >
                <i className='tabler-calendar-event text-2xl' />
              </Avatar>

              <div className='min-w-0'>
                <Typography variant='h5' className='font-bold'>
                  3 hari
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  Periode pelatihan
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content */}
      <Grid container spacing={4} alignItems='flex-start'>
        <Grid size={{ xs: 12, lg: 8 }}>
          <div className='flex flex-col gap-5'>
            {/* About */}
            <Card>
              <CardContent className='flex flex-col gap-4 p-5 sm:p-6'>
                <SectionTitle title='Tentang Program' />

                <Typography
                  variant='body1'
                  color='text.secondary'
                  className='leading-8'
                >
                  {training.description}
                </Typography>

                <Divider />

                <SectionTitle title='Fokus Pembelajaran' />

                <div className='flex flex-col gap-3'>
                  {training.objectives.map((objective, index) => (
                    <div key={objective} className='flex items-start gap-3'>
                      <Avatar
                        variant='rounded'
                        className='bs-8 is-8 shrink-0 bg-primaryLight text-primary'
                      >
                        <Typography variant='caption' className='font-bold'>
                          {index + 1}
                        </Typography>
                      </Avatar>

                      <Typography
                        variant='body2'
                        className='flex-1 pt-1 leading-relaxed'
                      >
                        {objective}
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advantages: compact list, not multiple cards */}
            <Card>
              <CardContent className='flex flex-col gap-4 p-5 sm:p-6'>
                <SectionTitle
                  title='Keunggulan Program'
                  description='Pendekatan yang membedakan pengalaman pelatihan ini.'
                />

                <div className='flex flex-col'>
                  {training.advantages.map((item, index) => (
                    <div key={item.title}>
                      {index > 0 && <Divider className='my-3' />}

                      <div className='flex items-start gap-3'>
                        <Avatar
                          variant='rounded'
                          className='bs-10 is-10 shrink-0 bg-actionHover text-primary'
                        >
                          <i className={`${item.icon} text-xl`} />
                        </Avatar>

                        <div className='min-w-0 flex-1'>
                          <Typography variant='body2' className='font-semibold'>
                            {item.title}
                          </Typography>

                          <Typography
                            variant='body2'
                            color='text.secondary'
                            className='mt-1 leading-relaxed'
                          >
                            {item.description}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target */}
            <Card>
              <CardContent className='flex flex-col gap-4 p-5 sm:p-6'>
                <SectionTitle title='Target & Persyaratan Peserta' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='leading-relaxed'
                >
                  {training.target}
                </Typography>

                <Divider />

                {training.requirements.map(requirement => (
                  <div key={requirement} className='flex items-start gap-2.5'>
                    <i className='tabler-circle-check mt-0.5 text-lg text-success' />

                    <Typography variant='body2' className='leading-relaxed'>
                      {requirement}
                    </Typography>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Grid>

        {/* Right column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <div className='flex flex-col gap-5'>
            {/* Instructor */}
            <Card>
              <CardContent className='flex flex-col gap-4 p-5'>
                <SectionTitle title='Instruktur Utama' />

                <div className='flex items-start gap-3'>
                  <Avatar
                    src={instructor.avatar}
                    alt={instructor.name}
                    className='bs-[68px] is-[68px] shrink-0'
                  />

                  <div className='min-w-0 flex-1'>
                    <Typography variant='subtitle1' className='font-bold'>
                      {instructor.name}
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      className='mt-1'
                    >
                      {instructor.position}
                    </Typography>

                    <Typography variant='caption' color='text.secondary'>
                      {instructor.organization}
                    </Typography>
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                  <div className='flex items-center gap-1 rounded-lg bg-warningLight px-2.5 py-1.5 text-warning'>
                    <i className='tabler-star-filled text-sm' />

                    <Typography variant='body2' className='font-bold'>
                      {instructor.rating.toFixed(1)}
                    </Typography>
                  </div>

                  <Typography variant='caption' color='text.secondary'>
                    {formatNumber(instructor.reviewCount)} ulasan
                  </Typography>
                </div>

                <Divider />

                <div className='flex flex-wrap gap-2'>
                  {instructor.expertise.map(item => (
                    <Chip
                      key={item}
                      size='small'
                      variant='outlined'
                      label={item}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardContent className='flex flex-col gap-4 p-5'>
                <SectionTitle title='Jadwal Pelatihan' />

                <div className='rounded-xl bg-primaryLight p-4'>
                  <Typography
                    variant='caption'
                    className='font-semibold uppercase tracking-wider text-primary'
                  >
                    Periode
                  </Typography>

                  <Typography variant='h6' className='mt-1 font-bold text-primary'>
                    {formatDate(training.schedule.startDate)}
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    sampai {formatDate(training.schedule.endDate)}
                  </Typography>
                </div>

                <InfoRow
                  icon='tabler-clock'
                  label='Jam pelaksanaan'
                  value={`${schedule.startTime}–${schedule.endTime} ${schedule.timezone}`}
                />

                <InfoRow
                  icon='tabler-device-laptop'
                  label='Metode'
                  value={schedule.format}
                />

                <InfoRow
                  icon='tabler-map-pin'
                  label='Lokasi'
                  value={schedule.venue}
                />
              </CardContent>
            </Card>

            {/* Registration: one progress block */}
            <Card>
              <CardContent className='flex flex-col gap-4 p-5'>
                <SectionTitle
                  title='Pendaftaran'
                  action={
                    <Chip
                      size='small'
                      color={registration.isOpen ? 'success' : 'default'}
                      variant='tonal'
                      label={registration.isOpen ? 'Dibuka' : 'Ditutup'}
                    />
                  }
                />

                <div className='flex items-end justify-between gap-3'>
                  <div>
                    <Typography variant='h4' className='font-bold'>
                      {formatNumber(registration.registered)}
                      <Typography
                        component='span'
                        variant='body2'
                        color='text.secondary'
                      >
                        {' '}/ {formatNumber(registration.quota)}
                      </Typography>
                    </Typography>

                    <Typography variant='caption' color='text.secondary'>
                      Kuota peserta terisi
                    </Typography>
                  </div>

                  <Typography variant='body2' className='font-semibold text-primary'>
                    {Math.round(progress)}%
                  </Typography>
                </div>

                <LinearProgress
                  variant='determinate'
                  value={progress}
                  className='h-2 rounded-full'
                />

                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <i className='tabler-user-check text-lg text-success' />

                    <Typography variant='caption' color='text.secondary'>
                      {remaining} kuota tersisa
                    </Typography>
                  </div>

                  <div className='flex items-center gap-2'>
                    <i className='tabler-user-clock text-lg text-warning' />

                    <Typography variant='caption' color='text.secondary'>
                      {registration.waitingList} antrean
                    </Typography>
                  </div>
                </div>

                <Divider />

                <InfoRow
                  icon='tabler-calendar-time'
                  label='Batas pendaftaran'
                  value={formatDate(registration.closeAt)}
                />
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OverviewTab

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

// -----------------------------------------------------------------------------
// Type
// -----------------------------------------------------------------------------

export type InstructorHeaderType = {
  title: string
  description: string
  coverImg: string
  location: string
  totalInstructors: number
  activeInstructors: number
  totalExpertise: number
  averageRating: number
  totalReviews: number
  totalTrainings: number
}

// -----------------------------------------------------------------------------
// Hardcoded Data
// -----------------------------------------------------------------------------

const instructorHeaderData: InstructorHeaderType = {
  title: 'SDM Pelatih',

  description:
    'Kelola tenaga pelatih, kompetensi, keahlian, dan performa pelatih yang mendukung program pelatihan DISKOP.',

  coverImg: '/images/pages/banner-diskop.png',

  location: 'Kota Banjarbaru',

  totalInstructors: 48,

  activeInstructors: 42,

  totalExpertise: 27,

  averageRating: 4.8,

  totalReviews: 684,

  totalTrainings: 126
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const InstructorHeader = () => {
  const data = instructorHeaderData

  return (
    <Card className='overflow-hidden'>
      {/* ----------------------------------------------------------------- */}
      {/* Cover */}
      {/* ----------------------------------------------------------------- */}

      <div className='relative'>
        <CardMedia
          image={data.coverImg}
          className='bs-[260px] max-md:bs-[190px]'
        />

        {/* Soft overlay */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.12) 100%)'
          }}
        />

        {/* Cover badge */}
        <div className='absolute top-4 end-4'>
          <Chip
            size='small'
            variant='filled'
            icon={<i className='tabler-shield-check' />}
            label='DISKOP'
            sx={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
            }}
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Content */}
      {/* ----------------------------------------------------------------- */}

      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        {/* --------------------------------------------------------------- */}
        {/* Page Icon */}
        {/* --------------------------------------------------------------- */}

        <div className='flex items-center justify-center rounded-bs-md mbs-[-44px] border-[5px] mis-[-5px] border-be-0 border-backgroundPaper bg-backgroundPaper relative z-[1]'>
          <div
            className='flex items-center justify-center bs-[120px] is-[120px] rounded-xl bg-primaryLight'
            style={{
              boxShadow:
                '0 12px 30px rgba(var(--mui-palette-primary-mainChannel) / 0.18)'
            }}
          >
            <div className='flex items-center justify-center bs-[86px] is-[86px] rounded-lg bg-primary'>
              <i className='tabler-chalkboard text-white text-[42px]' />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Information */}
        {/* --------------------------------------------------------------- */}

        <div className='flex is-full justify-start self-end flex-col gap-5 sm:gap-4 sm:flex-row sm:justify-between sm:items-end'>
          <div className='flex flex-col items-center sm:items-start gap-3'>
            {/* ----------------------------------------------------------- */}
            {/* Title */}
            {/* ----------------------------------------------------------- */}

            <div className='flex items-center gap-2'>
              <Typography
                variant='h4'
                className='font-semibold tracking-tight'
              >
                {data.title}
              </Typography>

              <Tooltip title='Manajemen tenaga pelatih DISKOP'>
                <i className='tabler-info-circle text-textSecondary text-lg cursor-help' />
              </Tooltip>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Meta */}
            {/* ----------------------------------------------------------- */}

            <div className='flex flex-wrap gap-x-5 gap-y-2 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                <i className='tabler-map-pin text-textSecondary' />

                <Typography className='font-medium'>
                  {data.location}
                </Typography>
              </div>

              <div className='flex items-center gap-2'>
                <i className='tabler-school text-textSecondary' />

                <Typography
                  className='font-medium'
                  color='text.secondary'
                >
                  Tenaga Pelatih DISKOP
                </Typography>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Description */}
            {/* ----------------------------------------------------------- */}

            <Typography
              variant='body2'
              color='text.secondary'
              className='max-is-[760px] text-center sm:text-start leading-relaxed'
            >
              {data.description}
            </Typography>

            {/* ----------------------------------------------------------- */}
            {/* Statistics */}
            {/* ----------------------------------------------------------- */}

            <div className='flex flex-wrap items-center gap-2 justify-center sm:justify-start'>
              {/* Total Instructors */}

              <Tooltip title='Total tenaga pelatih yang terdaftar'>
                <Chip
                  size='small'
                  variant='tonal'
                  color='primary'
                  icon={<i className='tabler-users' />}
                  label={`${data.totalInstructors} Pelatih`}
                  className='font-medium'
                />
              </Tooltip>

              {/* Active */}

              <Tooltip title='Pelatih yang saat ini aktif'>
                <Chip
                  size='small'
                  variant='tonal'
                  color='success'
                  icon={<i className='tabler-user-check' />}
                  label={`${data.activeInstructors} Aktif`}
                  className='font-medium'
                />
              </Tooltip>

              {/* Expertise */}

              <Tooltip title='Total bidang keahlian yang tersedia'>
                <Chip
                  size='small'
                  variant='tonal'
                  color='info'
                  icon={<i className='tabler-sparkles' />}
                  label={`${data.totalExpertise} Keahlian`}
                  className='font-medium'
                />
              </Tooltip>

              {/* Rating */}

              <Tooltip
                title={`Rata-rata dari ${data.totalReviews} evaluasi peserta`}
              >
                <Chip
                  size='small'
                  variant='tonal'
                  color='warning'
                  icon={<i className='tabler-star-filled' />}
                  label={`${data.averageRating.toFixed(1)} Rating`}
                  className='font-medium'
                />
              </Tooltip>

              {/* Trainings */}

              <Tooltip title='Total pelatihan yang telah ditangani seluruh pelatih'>
                <Chip
                  size='small'
                  variant='tonal'
                  color='secondary'
                  icon={<i className='tabler-school' />}
                  label={`${data.totalTrainings} Pelatihan`}
                  className='font-medium'
                />
              </Tooltip>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Actions */}
          {/* --------------------------------------------------------------- */}

          <div className='flex items-center gap-2 self-center sm:self-end'>
            <Button
              variant='outlined'
              color='secondary'
              className='flex gap-2'
              startIcon={<i className='tabler-filter-off' />}
            >
              Reset Filter
            </Button>

            <Button
              variant='contained'
              className='flex gap-2 shadow-md'
              startIcon={<i className='tabler-user-plus' />}
            >
              Tambah Pelatih
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InstructorHeader

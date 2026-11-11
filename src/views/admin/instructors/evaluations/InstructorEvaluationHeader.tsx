'use client'

import Link from 'next/link'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  instructorId: string
}

type InstructorData = {
  id: string
  name: string
  username: string
  avatar: string
  position: string
  expertise: string[]
  rating: number
  totalReviews: number
  totalTrainings: number
  totalParticipants: number
  status: 'active' | 'inactive'
}

// -----------------------------------------------------------------------------
// Temporary Data
// -----------------------------------------------------------------------------

const instructors: Record<string, InstructorData> = {
  '1': {
    id: '1',
    name: 'Ahmad Fauzan',
    username: '@ahmad.fauzan',
    avatar: '/images/avatars/1.png',
    position: 'Pelatih',
    expertise: [
      'Programming',
      'Web Development'
    ],
    rating: 4.8,
    totalReviews: 684,
    totalTrainings: 24,
    totalParticipants: 684,
    status: 'active'
  },

  '2': {
    id: '2',
    name: 'Siti Rahma',
    username: '@siti.rahma',
    avatar: '/images/avatars/2.png',
    position: 'Pelatih',
    expertise: [
      'Digital Marketing',
      'Kewirausahaan'
    ],
    rating: 4.9,
    totalReviews: 521,
    totalTrainings: 18,
    totalParticipants: 521,
    status: 'active'
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const InstructorEvaluationHeader = ({
                                      instructorId
                                    }: Props) => {
  const instructor =
    instructors[instructorId] ??
    instructors['1']

  return (
    <Card className='overflow-hidden'>

      {/* =================================================================== */}
      {/* Top Accent */}
      {/* =================================================================== */}

      <div className='bs-1 bg-primary opacity-80' />

      <CardContent className='p-6'>

        {/* ================================================================= */}
        {/* Profile */}
        {/* ================================================================= */}

        <div className='flex flex-col gap-6'>

          <div className='flex flex-col sm:flex-row sm:items-center gap-5'>

            {/* ------------------------------------------------------------- */}
            {/* Avatar */}
            {/* ------------------------------------------------------------- */}

            <div className='relative shrink-0'>

              <div className='absolute -inset-1 rounded-full bg-primary/10' />

              <Avatar
                src={instructor.avatar}
                alt={instructor.name}
                sx={{
                  width: 72,
                  height: 72,
                  position: 'relative',
                  border:
                    '3px solid var(--mui-palette-background-paper)'
                }}
              />

              {instructor.status === 'active' && (
                <span
                  className='absolute bottom-0 end-0 block bs-4 is-4 rounded-full bg-success border-2 border-backgroundPaper'
                  title='Pelatih aktif'
                />
              )}

            </div>

            {/* ------------------------------------------------------------- */}
            {/* Identity */}
            {/* ------------------------------------------------------------- */}

            <div className='flex flex-col gap-1 min-is-0 flex-1'>

              <div className='flex flex-wrap items-center gap-2'>

                <Typography
                  variant='h5'
                  className='font-semibold'
                >
                  {instructor.name}
                </Typography>

                <Chip
                  label={
                    instructor.status === 'active'
                      ? 'Aktif'
                      : 'Nonaktif'
                  }
                  size='small'
                  variant='tonal'
                  color={
                    instructor.status === 'active'
                      ? 'success'
                      : 'secondary'
                  }
                />

              </div>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                {instructor.username}
              </Typography>

              <div className='flex flex-wrap items-center gap-2 mt-2'>

                <span className='inline-flex items-center gap-1.5 text-sm text-textSecondary'>
                  <i className='tabler-chalkboard text-[17px]' />
                  {instructor.position}
                </span>

                <span className='text-textDisabled'>
                  •
                </span>

                {instructor.expertise.map(
                  expertise => (
                    <Chip
                      key={expertise}
                      label={expertise}
                      size='small'
                      variant='tonal'
                      color='primary'
                    />
                  )
                )}

              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* Profile Action */}
            {/* ------------------------------------------------------------- */}

            <Link
              href={`/admin/instructors/${instructor.id}`}
              className='shrink-0'
            >
              <Button
                variant='tonal'
                startIcon={
                  <i className='tabler-user' />
                }
              >
                Lihat Profil
              </Button>
            </Link>

          </div>

          <Divider />

          {/* ================================================================= */}
          {/* Summary */}
          {/* ================================================================= */}

          <div className='flex flex-wrap items-center gap-x-8 gap-y-4'>

            {/* Rating */}

            <div className='flex items-center gap-2'>

              <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-warning/10'>
                <i className='tabler-star-filled text-warning text-[19px]' />
              </div>

              <div className='flex flex-col'>

                <div className='flex items-center gap-1.5'>

                  <Typography
                    variant='body2'
                    className='font-semibold'
                  >
                    {instructor.rating}
                  </Typography>

                  <Rating
                    value={instructor.rating}
                    precision={0.1}
                    readOnly
                    size='small'
                    sx={{
                      '& .MuiRating-icon': {
                        fontSize: '1rem'
                      }
                    }}
                    emptyIcon={
                      <i className='tabler-star-filled text-[16px]' />
                    }
                  />

                </div>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {instructor.totalReviews} evaluasi
                </Typography>

              </div>

            </div>

            {/* Trainings */}

            <div className='flex items-center gap-2'>

              <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-primary/10'>
                <i className='tabler-school text-primary text-[19px]' />
              </div>

              <div className='flex flex-col'>

                <Typography
                  variant='body2'
                  className='font-semibold'
                >
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

            <div className='flex items-center gap-2'>

              <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-info/10'>
                <i className='tabler-users text-info text-[19px]' />
              </div>

              <div className='flex flex-col'>

                <Typography
                  variant='body2'
                  className='font-semibold'
                >
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

          </div>

        </div>

      </CardContent>
    </Card>
  )
}

export default InstructorEvaluationHeader

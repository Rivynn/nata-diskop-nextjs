'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type EvaluationSource =
  | 'peserta'
  | 'pegawai'
  | 'mitra'

type DataType = {
  rating: number
  value: number
}

// -----------------------------------------------------------------------------
// Temporary Data
// -----------------------------------------------------------------------------

const totalReviewsData: DataType[] = [
  {
    rating: 5,
    value: 109
  },
  {
    rating: 4,
    value: 40
  },
  {
    rating: 3,
    value: 18
  },
  {
    rating: 2,
    value: 12
  },
  {
    rating: 1,
    value: 8
  }
]

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

type Props = {
  instructorId: string
  source: EvaluationSource
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const sourceConfig: Record<
  EvaluationSource,
  {
    label: string
    description: string
    icon: string
  }
> = {
  peserta: {
    label: 'peserta',
    description:
      'Evaluasi berasal dari peserta yang mengikuti pelatihan.',
    icon: 'tabler-users'
  },

  pegawai: {
    label: 'pegawai',
    description:
      'Evaluasi berasal dari pegawai internal DISKOP.',
    icon: 'tabler-building-community'
  },

  mitra: {
    label: 'mitra',
    description:
      'Evaluasi berasal dari mitra dan pihak industri.',
    icon: 'tabler-building-skyscraper'
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const TotalReviews = ({
                        instructorId,
                        source
                      }: Props) => {
  // Hooks
  const theme = useTheme()

  const isSmallScreen =
    useMediaQuery(
      theme.breakpoints.down('sm')
    )

  // ---------------------------------------------------------------------------
  // Vars
  // ---------------------------------------------------------------------------

  const config =
    sourceConfig[source]

  const totalReviews =
    totalReviewsData.reduce(
      (total, item) =>
        total + item.value,
      0
    )

  const weightedRating =
    totalReviewsData.reduce(
      (total, item) =>
        total +
        item.rating * item.value,
      0
    ) / totalReviews

  const positiveReviews =
    totalReviewsData
      .filter(item => item.rating >= 4)
      .reduce(
        (total, item) =>
          total + item.value,
        0
      )

  const positivePercentage =
    Math.round(
      (positiveReviews /
        totalReviews) *
      100
    )

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card className='bs-full'>
      <CardContent>
        <div className='flex max-sm:flex-col items-center gap-6'>

          {/* =============================================================== */}
          {/* Summary */}
          {/* =============================================================== */}

          <div className='flex flex-col items-start gap-2 is-full sm:is-6/12'>

            <div className='flex items-center gap-2'>

              <Typography
                variant='h3'
                color='primary.main'
              >
                {weightedRating.toFixed(2)}
              </Typography>

              <i className='tabler-star-filled text-[32px] text-primary' />

            </div>

            <Typography
              className='font-medium'
              color='text.primary'
            >
              Total {totalReviews} evaluasi{' '}
              {config.label}
            </Typography>

            <div className='flex items-center gap-1.5'>
              <i
                className={`${config.icon} text-textSecondary text-[18px]`}
              />

              <Typography
                variant='body2'
                color='text.secondary'
              >
                {config.description}
              </Typography>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-1'>

              <Chip
                label={`+5 minggu ini`}
                variant='tonal'
                size='small'
                color='primary'
              />

              <Chip
                label={`${positivePercentage}% positif`}
                variant='tonal'
                size='small'
                color='success'
              />

            </div>

          </div>

          {/* =============================================================== */}
          {/* Divider */}
          {/* =============================================================== */}

          <Divider
            orientation={
              isSmallScreen
                ? 'horizontal'
                : 'vertical'
            }
            flexItem
          />

          {/* =============================================================== */}
          {/* Rating Distribution */}
          {/* =============================================================== */}

          <div className='flex flex-col gap-3 is-full sm:is-6/12'>

            {totalReviewsData.map(
              (item, index) => {
                const percentage =
                  Math.round(
                    (item.value /
                      totalReviews) *
                    100
                  )

                return (
                  <div
                    key={index}
                    className='flex items-center gap-2'
                  >

                    <Typography
                      variant='body2'
                      className='text-nowrap'
                    >
                      {item.rating}{' '}
                      <i className='tabler-star-filled text-warning text-[12px]' />
                    </Typography>

                    <LinearProgress
                      color='primary'
                      value={percentage}
                      variant='determinate'
                      className='bs-2 is-full'
                    />

                    <Typography
                      variant='body2'
                      className='min-is-[28px] text-end'
                    >
                      {item.value}
                    </Typography>

                  </div>
                )
              }
            )}

          </div>

        </div>
      </CardContent>
    </Card>
  )
}

export default TotalReviews

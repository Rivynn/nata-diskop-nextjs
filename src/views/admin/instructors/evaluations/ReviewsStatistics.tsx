'use client'

// React Imports
import { useMemo } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(
  () =>
    import(
      '@/libs/styles/AppReactApexCharts'
      )
)

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type EvaluationSource =
  | 'peserta'
  | 'pegawai'
  | 'mitra'

type Props = {
  instructorId: string
  source: EvaluationSource
}

// -----------------------------------------------------------------------------
// Temporary Data
// -----------------------------------------------------------------------------

const statisticsData: Record<
  EvaluationSource,
  {
    series: number[]
    newReviews: number
    change: number
    positivePercentage: number
  }
> = {
  peserta: {
    series: [
      32,
      52,
      72,
      94,
      116,
      94,
      72
    ],
    newReviews: 12,
    change: 8.4,
    positivePercentage: 87
  },

  pegawai: {
    series: [
      8,
      12,
      18,
      14,
      24,
      19,
      27
    ],
    newReviews: 5,
    change: 4.8,
    positivePercentage: 92
  },

  mitra: {
    series: [
      4,
      7,
      6,
      11,
      9,
      14,
      12
    ],
    newReviews: 3,
    change: 6.2,
    positivePercentage: 89
  }
}

// -----------------------------------------------------------------------------
// Source Configuration
// -----------------------------------------------------------------------------

const sourceConfig: Record<
  EvaluationSource,
  {
    title: string
    reviewLabel: string
    positiveLabel: string
    icon: string
  }
> = {
  peserta: {
    title: 'Statistik Evaluasi Peserta',
    reviewLabel: 'evaluasi baru',
    positiveLabel: 'evaluasi positif',
    icon: 'tabler-users'
  },

  pegawai: {
    title: 'Statistik Evaluasi Pegawai',
    reviewLabel: 'evaluasi baru',
    positiveLabel: 'evaluasi positif',
    icon: 'tabler-building-community'
  },

  mitra: {
    title: 'Statistik Evaluasi Mitra',
    reviewLabel: 'evaluasi baru',
    positiveLabel: 'evaluasi positif',
    icon: 'tabler-building-skyscraper'
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const ReviewsStatistics = ({
                             instructorId,
                             source
                           }: Props) => {
  // Hook
  const theme = useTheme()

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  const data =
    statisticsData[source]

  const config =
    sourceConfig[source]

  // ---------------------------------------------------------------------------
  // Chart Series
  // ---------------------------------------------------------------------------

  const series = useMemo(
    () => [
      {
        data: data.series
      }
    ],
    [data]
  )

  // ---------------------------------------------------------------------------
  // Chart Options
  // ---------------------------------------------------------------------------

  const successLightOpacity =
    'var(--mui-palette-success-lightOpacity)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      }
    },

    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '40%'
      }
    },

    legend: {
      show: false
    },

    tooltip: {
      enabled: false
    },

    dataLabels: {
      enabled: false
    },

    colors: [
      successLightOpacity,
      successLightOpacity,
      successLightOpacity,
      successLightOpacity,
      'var(--mui-palette-success-main)',
      successLightOpacity,
      successLightOpacity
    ],

    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },

      active: {
        filter: {
          type: 'none'
        }
      }
    },

    grid: {
      show: false,

      padding: {
        top: -30,
        left: 0,
        right: 0,
        bottom: -12
      }
    },

    xaxis: {
      categories: [
        'Sen',
        'Sel',
        'Rab',
        'Kam',
        'Jum',
        'Sab',
        'Min'
      ],

      axisTicks: {
        show: false
      },

      axisBorder: {
        show: false
      },

      tickPlacement: 'on',

      labels: {
        style: {
          colors:
            'var(--mui-palette-text-disabled)',

          fontFamily:
          theme.typography.fontFamily,

          fontSize:
            theme.typography.body2
              .fontSize as string
        }
      }
    },

    yaxis: {
      show: false
    },

    responsive: [
      {
        breakpoint: 600,

        options: {
          chart: {
            width: 275
          }
        }
      }
    ]
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>

          {/* =============================================================== */}
          {/* Statistics Summary */}
          {/* =============================================================== */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <div className='bs-full flex flex-col items-start justify-between gap-6'>

              {/* ----------------------------------------------------------- */}
              {/* Header */}
              {/* ----------------------------------------------------------- */}

              <div className='flex flex-col items-start gap-2'>

                <div className='flex items-center gap-2'>

                  <i
                    className={`${config.icon} text-primary text-[22px]`}
                  />

                  <Typography variant='h5'>
                    {config.title}
                  </Typography>

                </div>

                <div className='flex items-center gap-2'>

                  <Typography>
                    {data.newReviews}{' '}
                    {config.reviewLabel}
                  </Typography>

                  <Chip
                    label={`+${data.change}%`}
                    variant='tonal'
                    size='small'
                    color='success'
                  />

                </div>

              </div>

              {/* ----------------------------------------------------------- */}
              {/* Bottom Summary */}
              {/* ----------------------------------------------------------- */}

              <div className='flex flex-col items-start gap-2'>

                <Typography color='text.primary'>

                  <span className='text-success'>
                    {data.positivePercentage}%
                  </span>{' '}

                  {config.positiveLabel}

                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Laporan Mingguan
                </Typography>

              </div>

            </div>
          </Grid>

          {/* =============================================================== */}
          {/* Chart */}
          {/* =============================================================== */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
            className='flex justify-center'
          >
            <AppReactApexCharts
              type='bar'
              width='100%'
              height={156}
              series={series}
              options={options}
            />
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReviewsStatistics

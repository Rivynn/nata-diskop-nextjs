'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Component Imports
import InstructorEvaluationHeader from './InstructorEvaluationHeader'
import TotalReviews from './TotalReviews'
import ReviewsStatistics from './ReviewsStatistics'
import InstructorReviewsTable from './InstructorReviewsTable'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type EvaluationSource =
  | 'peserta'
  | 'pegawai'
  | 'mitra'

type Props = {
  instructorId: string
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const InstructorEvaluations = ({
                                 instructorId
                               }: Props) => {
  const [source, setSource] =
    useState<EvaluationSource>('peserta')

  return (
    <Grid container spacing={6}>

      {/* =================================================================== */}
      {/* Instructor Profile */}
      {/* =================================================================== */}

      <Grid size={{ xs: 12 }}>
        <InstructorEvaluationHeader
          instructorId={instructorId}
        />
      </Grid>

      {/* =================================================================== */}
      {/* Statistics */}
      {/* =================================================================== */}

      <Grid size={{ xs: 12, md: 6 }}>
        <TotalReviews
          instructorId={instructorId}
          source={source}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ReviewsStatistics
          instructorId={instructorId}
          source={source}
        />
      </Grid>

      {/* =================================================================== */}
      {/* Evaluation Source */}
      {/* =================================================================== */}

      <Grid size={{ xs: 12 }}>

        <div className='flex flex-col gap-4'>

          {/* --------------------------------------------------------------- */}
          {/* Source Navigation */}
          {/* --------------------------------------------------------------- */}

          <div className='flex items-center justify-between gap-4'>

            <div>
              <div className='flex items-center gap-2'>
                <i className='tabler-message-star text-primary text-xl' />

                <h5 className='text-lg font-semibold'>
                  Evaluasi
                </h5>
              </div>

              <p className='text-sm text-textSecondary mt-1'>
                Kelola evaluasi berdasarkan sumber penilaian.
              </p>
            </div>

          </div>

          <Card className='overflow-hidden'>

            <CardContent className='p-0'>

              <Tabs
                value={source}
                onChange={(_, value) => {
                  setSource(
                    value as EvaluationSource
                  )
                }}
                variant='scrollable'
                scrollButtons='auto'
                sx={{
                  minHeight: 64,

                  '& .MuiTabs-flexContainer': {
                    gap: 1,
                    px: 2
                  },

                  '& .MuiTab-root': {
                    minHeight: 64,
                    minWidth: 120,
                    borderRadius: '10px 10px 0 0',
                    textTransform: 'none',
                    fontWeight: 500
                  }
                }}
              >

                <Tab
                  value='peserta'
                  icon={
                    <i className='tabler-users' />
                  }
                  iconPosition='start'
                  label='Peserta'
                />

                <Tab
                  value='pegawai'
                  icon={
                    <i className='tabler-building-community' />
                  }
                  iconPosition='start'
                  label='Pegawai'
                />

                <Tab
                  value='mitra'
                  icon={
                    <i className='tabler-building-skyscraper' />
                  }
                  iconPosition='start'
                  label='Mitra'
                />

              </Tabs>

            </CardContent>

          </Card>

          {/* --------------------------------------------------------------- */}
          {/* Reviews */}
          {/* --------------------------------------------------------------- */}

          <InstructorReviewsTable
            instructorId={instructorId}
            source={source}
          />

        </div>

      </Grid>

    </Grid>
  )
}

export default InstructorEvaluations

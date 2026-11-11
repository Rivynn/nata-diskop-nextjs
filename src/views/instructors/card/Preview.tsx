'use client'

import Link from 'next/link'

import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'

type PreviewProps = {
  instructorId?: string
}

const Preview = ({ instructorId }: PreviewProps) => {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    console.log(
      'Download instructor card:',
      instructorId
    )
  }

  const instructorDetailUrl = instructorId
    ? `/admin/instructors/${instructorId}`
    : '/admin/instructors'

  return (
    <Grid container spacing={6}>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between gap-4'>

          {/* LEFT */}

          <div className='flex items-center gap-3'>

            <IconButton
              component={Link}
              href={instructorDetailUrl}
              aria-label='Kembali ke profil pelatih'
              className='text-textPrimary'
            >
              <i className='tabler-arrow-left' />
            </IconButton>

            <div className='flex flex-col'>

              <div className='flex items-center gap-2'>

                <Typography
                  variant='h5'
                  className='font-semibold'
                >
                  Kartu Pelatih
                </Typography>

                <span
                  className='inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
                  style={{
                    backgroundColor: 'var(--mui-palette-success-light)',
                    color: 'var(--mui-palette-success-main)'
                  }}
                >
                  Pratinjau
                </span>

              </div>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Pratinjau kartu penugasan pelatih
              </Typography>

            </div>

          </div>

        </div>
      </Grid>

      {/* =====================================================
          CARD PREVIEW
      ====================================================== */}

      <Grid size={{ xs: 12, md: 9 }}>
        <PreviewCard
          instructorId={instructorId}
        />
      </Grid>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <Grid size={{ xs: 12, md: 3 }}>
        <PreviewActions
          instructorId={instructorId}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </Grid>

    </Grid>
  )
}

export default Preview

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { InstructorCardType } from '../types'

// Component Imports

type Props = {
  instructorData?: InstructorCardType
}

const InstructorEngagement = ({
                                instructorData
                              }: Props) => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h5'>
              Keterikatan
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Informasi hubungan kerja dan keterikatan pelatih.
            </Typography>
          </div>

          <div className='flex bs-10 is-10 items-center justify-center rounded-lg bg-primary/10'>
            <i className='tabler-briefcase text-primary text-xl' />
          </div>
        </div>

        <Divider />

        {/* Employment */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between gap-3'>
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

          <div className='flex items-center justify-between gap-3'>
            <Typography
              variant='body2'
              color='text.secondary'
            >
              Periode
            </Typography>

            <Typography
              variant='body2'
              className='font-medium'
            >
              01 Jan 2026 — 31 Des 2026
            </Typography>
          </div>

          <div className='flex items-center justify-between gap-3'>
            <Typography
              variant='body2'
              color='text.secondary'
            >
              Status
            </Typography>

            <Chip
              label='Aktif'
              size='small'
              variant='tonal'
              color='success'
            />
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

          <div className='rounded-lg border border-divider p-4'>
            <div className='flex items-start gap-3'>
              <div className='flex bs-10 is-10 shrink-0 items-center justify-center rounded-lg bg-info/10'>
                <i className='tabler-building-skyscraper text-info text-xl' />
              </div>

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
                  Pelatih belum memiliki keterikatan dengan mitra.
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button
          variant='tonal'
          color='primary'
          startIcon={<i className='tabler-settings' />}
        >
          Kelola Keterikatan
        </Button>
      </CardContent>
    </Card>
  )
}

export default InstructorEngagement

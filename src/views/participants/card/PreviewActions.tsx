'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type PreviewActionsProps = {
  participantId?: string
  onPrint: () => void
  onDownload: () => void
}

const PreviewActions = ({
                          participantId,
                          onPrint,
                          onDownload
                        }: PreviewActionsProps) => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        {/* Status */}

        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center bs-10 is-10 rounded bg-primary/10'>
              <i className='tabler-id text-[20px] text-primary' />
            </div>

            <div className='min-is-0'>
              <Typography className='font-medium'>
                Kartu Peserta
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                {participantId
                  ? `#${participantId}`
                  : 'Peserta'}
              </Typography>
            </div>
          </div>

          <Chip
            size='small'
            color='success'
            variant='tonal'
            label='Aktif'
          />
        </div>

        <Divider />

        {/* Download */}

        <Button
          fullWidth
          variant='contained'
          startIcon={
            <i className='tabler-download' />
          }
          onClick={onDownload}
        >
          Download Kartu
        </Button>

        {/* Print */}

        <Button
          fullWidth
          color='secondary'
          variant='tonal'
          startIcon={
            <i className='tabler-printer' />
          }
          onClick={onPrint}
        >
          Cetak Kartu
        </Button>

        <Divider />

        {/* Information */}

        <div className='flex flex-col gap-3'>
          <Typography
            variant='caption'
            color='text.disabled'
            className='uppercase font-semibold'
          >
            Informasi
          </Typography>

          <div className='flex items-start gap-3'>
            <i className='tabler-id text-[18px] text-textSecondary' />

            <div>
              <Typography variant='body2'>
                Identitas Peserta
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kartu identitas resmi peserta.
              </Typography>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <i className='tabler-qrcode text-[18px] text-textSecondary' />

            <div>
              <Typography variant='body2'>
                Verifikasi
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kartu dapat diverifikasi melalui QR.
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PreviewActions

'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type PreviewActionsProps = {
  instructorId?: string
  onPrint: () => void
  onDownload: () => void
}

const PreviewActions = ({
                          instructorId,
                          onPrint,
                          onDownload
                        }: PreviewActionsProps) => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>

        {/* ===================================================
            STATUS
        ==================================================== */}

        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>

            <div className='flex items-center justify-center bs-10 is-10 rounded bg-info/10'>
              <i className='tabler-chalkboard text-[20px] text-info' />
            </div>

            <div className='min-is-0'>
              <Typography className='font-medium'>
                Kartu Pelatih
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                {instructorId
                  ? `#${instructorId}`
                  : 'Pelatih'}
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

        {/* ===================================================
            DOWNLOAD
        ==================================================== */}

        <Button
          fullWidth
          variant='contained'
          color='info'
          startIcon={
            <i className='tabler-download' />
          }
          onClick={onDownload}
        >
          Download Kartu
        </Button>

        {/* ===================================================
            PRINT
        ==================================================== */}

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

        {/* ===================================================
            INFORMATION
        ==================================================== */}

        <div className='flex flex-col gap-3'>

          <Typography
            variant='caption'
            color='text.disabled'
            className='uppercase font-semibold'
          >
            Informasi
          </Typography>

          <div className='flex items-start gap-3'>
            <i className='tabler-id-badge-2 text-[18px] text-textSecondary' />

            <div>
              <Typography variant='body2'>
                Identitas Pelatih
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kartu identitas resmi pelatih DISKOP.
              </Typography>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <i className='tabler-certificate text-[18px] text-textSecondary' />

            <div>
              <Typography variant='body2'>
                Kompetensi
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Menampilkan status dan kompetensi profesional pelatih.
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

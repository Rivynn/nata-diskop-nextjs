// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

const PartnerRelations = () => {
  return (
    <Card className='h-full'>
      <CardContent className='flex flex-col gap-5'>
        <div className='flex items-center gap-3'>
          <div className='flex bs-10 is-10 items-center justify-center rounded-lg bg-info/10'>
            <i className='tabler-building-skyscraper text-info text-xl' />
          </div>

          <div>
            <Typography variant='h6'>Keterikatan Mitra</Typography>

            <Typography variant='body2' color='text.secondary'>
              Hubungan pelatih dengan mitra kerja
            </Typography>
          </div>
        </div>

        <Divider />

        <div className='rounded-lg border border-divider p-4'>
          <div className='flex items-start gap-3'>
            <div className='flex bs-10 is-10 shrink-0 items-center justify-center rounded-lg bg-info/10'>
              <i className='tabler-building-community text-info text-xl' />
            </div>

            <div className='flex flex-col gap-1 min-is-0'>
              <div className='flex items-center gap-2 flex-wrap'>
                <Typography className='font-medium'>
                  PT Banua Digital
                </Typography>

                <Chip
                  label='Aktif'
                  color='success'
                  variant='tonal'
                  size='small'
                />
              </div>

              <Typography variant='body2' color='text.secondary'>
                Mitra kerja sama pelatihan
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                Digital & Teknologi
              </Typography>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-background p-4'>
          <Typography variant='body2' color='text.secondary'>
            Peran Pelatih
          </Typography>

          <Typography variant='body2' className='font-medium mt-1'>
            Trainer / Instruktur
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default PartnerRelations

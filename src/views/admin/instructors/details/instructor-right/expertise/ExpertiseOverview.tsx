// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

const ExpertiseOverview = () => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h5'>Keahlian Pelatih</Typography>

            <Typography variant='body2' color='text.secondary'>
              Kompetensi dan bidang keahlian yang dimiliki pelatih.
            </Typography>
          </div>

          <Chip
            label='5 Keahlian'
            color='primary'
            variant='tonal'
            size='small'
          />
        </div>

        <Divider />

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='rounded-lg border border-divider p-4'>
            <Typography variant='caption' color='text.secondary'>
              Total Keahlian
            </Typography>

            <Typography variant='h5' className='mt-1'>
              5
            </Typography>
          </div>

          <div className='rounded-lg border border-divider p-4'>
            <Typography variant='caption' color='text.secondary'>
              Pelatihan Terkait
            </Typography>

            <Typography variant='h5' className='mt-1'>
              24
            </Typography>
          </div>

          <div className='rounded-lg border border-divider p-4'>
            <Typography variant='caption' color='text.secondary'>
              Peserta Dilatih
            </Typography>

            <Typography variant='h5' className='mt-1'>
              386
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExpertiseOverview

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

const ContractDetails = () => {
  return (
    <Card className='h-full'>
      <CardContent className='flex flex-col gap-5'>
        <div className='flex items-center gap-3'>
          <div className='flex bs-10 is-10 items-center justify-center rounded-lg bg-warning/10'>
            <i className='tabler-file-contract text-warning text-xl' />
          </div>

          <div>
            <Typography variant='h6'>Detail Kontrak</Typography>

            <Typography variant='body2' color='text.secondary'>
              Informasi perjanjian keterikatan
            </Typography>
          </div>
        </div>

        <Divider />

        <div className='flex flex-col gap-4'>
          <div className='flex justify-between gap-4'>
            <Typography variant='body2' color='text.secondary'>
              Nomor Kontrak
            </Typography>

            <Typography variant='body2' className='font-medium'>
              PKL/DISKOP/2026/00124
            </Typography>
          </div>

          <div className='flex justify-between gap-4'>
            <Typography variant='body2' color='text.secondary'>
              Organisasi
            </Typography>

            <Typography variant='body2' className='font-medium'>
              DISKOP Kota Banjarbaru
            </Typography>
          </div>

          <div className='flex justify-between gap-4'>
            <Typography variant='body2' color='text.secondary'>
              Mulai
            </Typography>

            <Typography variant='body2' className='font-medium'>
              01 Jan 2026
            </Typography>
          </div>

          <div className='flex justify-between gap-4'>
            <Typography variant='body2' color='text.secondary'>
              Berakhir
            </Typography>

            <Typography variant='body2' className='font-medium'>
              31 Des 2026
            </Typography>
          </div>

          <div className='flex justify-between items-center gap-4'>
            <Typography variant='body2' color='text.secondary'>
              Status Kontrak
            </Typography>

            <Chip
              label='Aktif'
              color='success'
              variant='tonal'
              size='small'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContractDetails

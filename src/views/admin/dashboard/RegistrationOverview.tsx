// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

// Type Imports
import type { ThemeColor } from '@core/types'

type DataType = {
  title: string
  participants: number
  progress: number
  color: ThemeColor
}

// Vars
const data: DataType[] = [
  {
    title: 'Sedang Mengikuti',
    participants: 286,
    progress: 28,
    color: 'primary'
  },
  {
    title: 'Selesai Pelatihan',
    participants: 428,
    progress: 42,
    color: 'success'
  },
  {
    title: 'Menunggu Pelatihan',
    participants: 184,
    progress: 18,
    color: 'warning'
  },
  {
    title: 'Dalam Evaluasi',
    participants: 122,
    progress: 12,
    color: 'info'
  }
]

const RegistrationOverview = () => {
  return (
    <Card className='h-full'>
      <CardHeader
        title='Status Peserta Aktif'
        subheader='Distribusi peserta yang telah mengikuti pelatihan'
      />

      <CardContent className='flex flex-col gap-8'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <div className='relative flex items-center justify-center'>
              <CircularProgress
                variant='determinate'
                size={54}
                value={100}
                thickness={3}
                className='absolute text-[var(--mui-palette-customColors-trackBg)]'
              />

              <CircularProgress
                variant='determinate'
                size={54}
                value={item.progress}
                thickness={3}
                color={item.color}
                sx={{
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round'
                  }
                }}
              />

              <Typography
                className='absolute font-medium'
                color='text.primary'
              >
                {`${item.progress}%`}
              </Typography>
            </div>

            <div className='flex justify-between items-center is-full gap-4'>
              <div>
                <Typography
                  className='font-medium mbe-1.5'
                  color='text.primary'
                >
                  {item.title}
                </Typography>

                <Typography variant='body2'>
                  {`${item.participants.toLocaleString('id-ID')} Peserta`}
                </Typography>
              </div>

              <Chip
                label='Aktif'
                size='small'
                variant='tonal'
                color='success'
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RegistrationOverview

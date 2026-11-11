// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Type Imports
import type { ThemeColor } from '@core/types'

type ActionData = {
  title: string
  description: string
  count: number
  icon: string
  color: ThemeColor
  href: string
}

const data: ActionData[] = [
  {
    title: 'Pendaftaran',
    description: 'Peserta menunggu verifikasi',
    count: 18,
    icon: 'tabler-user-check',
    color: 'warning',
    href: '/admin/registrations'
  },
  {
    title: 'Pelatihan',
    description: 'Belum memiliki pelatih',
    count: 5,
    icon: 'tabler-school',
    color: 'error',
    href: '/admin/trainings'
  },
  {
    title: 'Jadwal',
    description: 'Menunggu konfirmasi',
    count: 7,
    icon: 'tabler-calendar-event',
    color: 'info',
    href: '/admin/trainings/schedules'
  },
  {
    title: 'Penilaian',
    description: 'Belum diselesaikan',
    count: 12,
    icon: 'tabler-file-certificate',
    color: 'error',
    href: '/admin/assessments'
  },
  {
    title: 'Sertifikat',
    description: 'Siap diterbitkan',
    count: 9,
    icon: 'tabler-certificate',
    color: 'success',
    href: '/admin/certificates'
  }
]

const ActionRequired = () => {
  return (
    <Card>
      <CardHeader
        title='Perlu Tindakan'
        subheader='Aktivitas yang membutuhkan perhatian'
      />

      <CardContent className='flex flex-col gap-5'>
        {data.map(item => (
          <a
            key={item.title}
            href={item.href}
            className='flex items-center gap-4 hover:opacity-80 transition-opacity'
          >
            <CustomAvatar
              variant='rounded'
              skin='light'
              color={item.color}
              size={42}
            >
              <i className={`${item.icon} text-xl`} />
            </CustomAvatar>

            <div className='flex-1 min-is-0'>
              <Typography
                className='font-medium'
                color='text.primary'
              >
                {item.title}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='truncate'
              >
                {item.description}
              </Typography>
            </div>

            <Chip
              label={item.count}
              size='small'
              color={item.color}
              variant='tonal'
            />
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

export default ActionRequired

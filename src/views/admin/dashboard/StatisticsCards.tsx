// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

type StatisticData = {
  title: string
  value: string
  subtitle: string
  icon: string
  color: ThemeColor
}

const data: StatisticData[] = [
  {
    title: 'Total Pelatihan',
    value: '42',
    subtitle: '+12.5% dari bulan lalu',
    icon: 'tabler-school',
    color: 'primary'
  },
  {
    title: 'Peserta Terdaftar',
    value: '1,284',
    subtitle: '+18.2% dari bulan lalu',
    icon: 'tabler-users',
    color: 'info'
  },
  {
    title: 'Pelatih Aktif',
    value: '86',
    subtitle: '+6.4% dari bulan lalu',
    icon: 'tabler-chalkboard',
    color: 'success'
  },
  {
    title: 'Mitra Aktif',
    value: '37',
    subtitle: '+9.8% dari bulan lalu',
    icon: 'tabler-building-community',
    color: 'warning'
  }
]

const StatisticsCards = () => {
  return (
    <Card>
      <CardContent className='flex max-md:flex-col md:items-center p-0'>
        {data.map((item, index) => (
          <div
            key={item.title}
            className='flex flex-1 items-center gap-4 p-6'
          >
            <CustomAvatar
              variant='rounded'
              skin='light'
              color={item.color}
              size={54}
            >
              <i className={`${item.icon} text-[28px]`} />
            </CustomAvatar>

            <div className='flex flex-col gap-0.5'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                {item.title}
              </Typography>

              <Typography
                variant='h4'
                className='font-medium'
                color='text.primary'
              >
                {item.value}
              </Typography>

              <Typography
                variant='body2'
                color='success.main'
              >
                {item.subtitle}
              </Typography>
            </div>

            {index < data.length - 1 && (
              <Divider
                orientation='vertical'
                flexItem
                className='max-md:hidden mis-auto'
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default StatisticsCards

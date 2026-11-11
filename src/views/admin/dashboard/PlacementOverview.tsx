// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

type PlacementData = {
  title: string
  value: number
  percentage: number
  icon: string
  color: ThemeColor
}

const data: PlacementData[] = [
  {
    title: 'Lulus Pelatihan',
    value: 486,
    percentage: 100,
    icon: 'tabler-certificate',
    color: 'primary'
  },
  {
    title: 'Direkomendasikan',
    value: 213,
    percentage: 44,
    icon: 'tabler-user-star',
    color: 'info'
  },
  {
    title: 'Interview',
    value: 87,
    percentage: 18,
    icon: 'tabler-message',
    color: 'warning'
  },
  {
    title: 'Diterima Kerja',
    value: 42,
    percentage: 9,
    icon: 'tabler-briefcase',
    color: 'success'
  }
]

const PlacementOverview = () => {
  return (
    <Card>
      <CardHeader
        title='Penempatan Tenaga Kerja'
        subheader='Perjalanan peserta menuju dunia kerja'
        action={
          <OptionMenu
            options={[
              'Tahun Ini',
              'Tahun Lalu',
              '2 Tahun Terakhir'
            ]}
          />
        }
      />

      <CardContent className='flex flex-col gap-6'>
        {data.map(item => (
          <div
            key={item.title}
            className='flex flex-col gap-2'
          >
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <CustomAvatar
                  variant='rounded'
                  skin='light'
                  color={item.color}
                  size={40}
                >
                  <i className={`${item.icon} text-xl`} />
                </CustomAvatar>

                <div>
                  <Typography
                    className='font-medium'
                    color='text.primary'
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    {item.percentage}% dari peserta lulus
                  </Typography>
                </div>
              </div>

              <Typography
                variant='h6'
                className='font-medium'
                color='text.primary'
              >
                {item.value}
              </Typography>
            </div>

            <LinearProgress
              variant='determinate'
              value={item.percentage}
              color={item.color}
              className='bs-1.5'
              sx={{
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5
                }
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PlacementOverview

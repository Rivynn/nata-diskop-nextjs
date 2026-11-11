// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

type TrainingData = {
  title: string
  participants: string
  icon: string
  color: ThemeColor
}

const data: TrainingData[] = [
  {
    title: 'Web Development',
    participants: '187',
    icon: 'tabler-code',
    color: 'primary'
  },
  {
    title: 'Digital Marketing',
    participants: '164',
    icon: 'tabler-speakerphone',
    color: 'info'
  },
  {
    title: 'Administrasi Perkantoran',
    participants: '142',
    icon: 'tabler-file-text',
    color: 'success'
  },
  {
    title: 'Networking',
    participants: '118',
    icon: 'tabler-network',
    color: 'warning'
  },
  {
    title: 'Desain Grafis',
    participants: '96',
    icon: 'tabler-palette',
    color: 'error'
  }
]

const PopularTrainings = () => {
  return (
    <Card>
      <CardHeader
        title='Pelatihan Terpopuler'
        subheader='Pelatihan dengan jumlah peserta terbanyak'
        action={
          <OptionMenu
            options={[
              '28 Hari Terakhir',
              'Bulan Ini',
              'Tahun Ini'
            ]}
          />
        }
      />

      <CardContent className='flex flex-col gap-6'>
        {data.map(item => (
          <div
            key={item.title}
            className='flex items-center gap-4'
          >
            <CustomAvatar
              variant='rounded'
              skin='light'
              color={item.color}
            >
              <i className={item.icon} />
            </CustomAvatar>

            <div className='flex justify-between items-center gap-4 is-full flex-wrap'>
              <Typography
                className='font-medium flex-1'
                color='text.primary'
              >
                {item.title}
              </Typography>

              <Chip
                label={`${item.participants} Peserta`}
                variant='tonal'
                size='small'
                color='secondary'
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PopularTrainings

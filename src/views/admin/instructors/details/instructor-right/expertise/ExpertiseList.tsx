// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const expertiseData = [
  {
    name: 'Digital Marketing',
    description:
      'Strategi pemasaran digital, media sosial, dan pemasaran berbasis konten.',
    trainings: 9,
    participants: 142,
    color: 'primary' as const
  },
  {
    name: 'Kewirausahaan',
    description:
      'Pengembangan usaha, strategi bisnis, dan pengelolaan UMKM.',
    trainings: 6,
    participants: 98,
    color: 'success' as const
  },
  {
    name: 'Manajemen Bisnis',
    description:
      'Perencanaan bisnis, pengelolaan operasional, dan strategi organisasi.',
    trainings: 4,
    participants: 76,
    color: 'info' as const
  },
  {
    name: 'Administrasi Perkantoran',
    description:
      'Administrasi digital, pengelolaan dokumen, dan tata kelola perkantoran.',
    trainings: 3,
    participants: 42,
    color: 'warning' as const
  },
  {
    name: 'Microsoft Office',
    description:
      'Penggunaan Microsoft Word, Excel, PowerPoint, dan aplikasi perkantoran.',
    trainings: 2,
    participants: 28,
    color: 'secondary' as const
  }
]

const ExpertiseList = () => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-1'>
        <Typography variant='h5'>Daftar Keahlian</Typography>

        <Typography variant='body2' color='text.secondary'>
          Keahlian yang telah ditetapkan pada profil pelatih.
        </Typography>
      </CardContent>

      <div className='flex flex-col'>
        {expertiseData.map((expertise, index) => (
          <div key={expertise.name}>
            <div className='flex items-center gap-4 p-6'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color={expertise.color}
                size={44}
              >
                <i className='tabler-sparkles text-xl' />
              </CustomAvatar>

              <div className='flex flex-col gap-1 flex-1 min-is-0'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <Typography className='font-medium'>
                    {expertise.name}
                  </Typography>

                  <Chip
                    label={`${expertise.trainings} Pelatihan`}
                    size='small'
                    variant='tonal'
                    color={expertise.color}
                  />
                </div>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  {expertise.description}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {expertise.participants} peserta telah mengikuti
                  pelatihan pada bidang ini
                </Typography>
              </div>
            </div>

            {index < expertiseData.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ExpertiseList

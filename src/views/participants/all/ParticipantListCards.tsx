
// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const data: UserDataType[] = [
  {
    title: 'Total Peserta',
    stats: '856',
    avatarIcon: 'tabler-users',
    avatarColor: 'primary',
    trend: 'positive',
    trendNumber: '12.8%',
    subtitle: 'Seluruh peserta terdaftar'
  },
  {
    title: 'Peserta Disetujui',
    stats: '742',
    avatarIcon: 'tabler-user-check',
    avatarColor: 'success',
    trend: 'positive',
    trendNumber: '9.6%',
    subtitle: 'Peserta lolos verifikasi'
  },
  {
    title: 'Menunggu Verifikasi',
    stats: '86',
    avatarIcon: 'tabler-user-search',
    avatarColor: 'warning',
    trend: 'negative',
    trendNumber: '4.2%',
    subtitle: 'Perlu ditindaklanjuti'
  },
  {
    title: 'Pelatihan Selesai',
    stats: '628',
    avatarIcon: 'tabler-certificate',
    avatarColor: 'info',
    trend: 'positive',
    trendNumber: '16.4%',
    subtitle: 'Peserta menyelesaikan pelatihan'
  }
]

const ParticipantListCards = () => {
  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default ParticipantListCards

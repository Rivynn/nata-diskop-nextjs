// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const data: UserDataType[] = [
  {
    title: 'Total Pengguna',
    stats: '1,284',
    avatarIcon: 'tabler-users',
    avatarColor: 'primary',
    trend: 'positive',
    trendNumber: '12.5%',
    subtitle: 'Seluruh akun terdaftar'
  },
  {
    title: 'Pengguna Aktif',
    stats: '1,176',
    avatarIcon: 'tabler-user-check',
    avatarColor: 'success',
    trend: 'positive',
    trendNumber: '8.4%',
    subtitle: 'Akun aktif saat ini'
  },
  {
    title: 'Menunggu Verifikasi',
    stats: '18',
    avatarIcon: 'tabler-user-search',
    avatarColor: 'warning',
    trend: 'negative',
    trendNumber: '4.2%',
    subtitle: 'Perlu ditindaklanjuti'
  },
  {
    title: 'Pengguna Baru',
    stats: '94',
    avatarIcon: 'tabler-user-plus',
    avatarColor: 'info',
    trend: 'positive',
    trendNumber: '16.8%',
    subtitle: 'Bulan ini'
  }
]

const UserListCards = () => {
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

export default UserListCards

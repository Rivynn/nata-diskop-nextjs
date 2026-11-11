import Grid from '@mui/material/Grid2'

import type { UsersType } from '@/types/apps/userTypes'
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

type Props = {
  adminData: UsersType[]
}

const AdminListCards = ({ adminData }: Props) => {
  const totalAdmins = adminData.length

  const activeAdmins = adminData.filter(
    user => user.status === 'active'
  ).length

  const pendingAdmins = adminData.filter(
    user => user.status === 'pending'
  ).length

  const newAdmins = adminData.filter(user => {
    const createdAt = new Date(user.createdAt)
    const now = new Date()

    return (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    )
  }).length

  const data: UserDataType[] = [
    {
      title: 'Total Administrator',
      stats: totalAdmins.toString(),
      avatarIcon: 'tabler-shield',
      avatarColor: 'primary',
      trend: 'up',
      trendNumber: '8.2%',
      subtitle: 'Dibanding bulan lalu'
    },
    {
      title: 'Administrator Aktif',
      stats: activeAdmins.toString(),
      avatarIcon: 'tabler-shield-check',
      avatarColor: 'success',
      trend: 'up',
      trendNumber: '5.4%',
      subtitle: 'Dibanding bulan lalu'
    },
    {
      title: 'Menunggu Aktivasi',
      stats: pendingAdmins.toString(),
      avatarIcon: 'tabler-shield-question',
      avatarColor: 'warning',
      trend: 'down',
      trendNumber: '2.1%',
      subtitle: 'Dibanding bulan lalu'
    },
    {
      title: 'Administrator Baru',
      stats: newAdmins.toString(),
      avatarIcon: 'tabler-shield-plus',
      avatarColor: 'info',
      trend: 'up',
      trendNumber: '12.5%',
      subtitle: 'Bulan ini'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default AdminListCards

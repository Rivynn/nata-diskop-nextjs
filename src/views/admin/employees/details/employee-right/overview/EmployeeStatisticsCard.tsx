import Grid from '@mui/material/Grid2'

import type { InstructorStatsType } from 'types'

import InstructorStats from '@components/card-statistics/InstructorStats'

type Props = {
  employeeId: string
}

const EmployeeStatisticsCard = ({ employeeId }: Props) => {
  // Ganti dengan data pegawai dari sumber data aplikasi.
  // Jangan tampilkan angka statistik palsu.
  const employeeStatData: InstructorStatsType[] = [
    {
      title: 'Masa Kerja',
      avatarIcon: 'tabler-calendar-time',
      color: 'primary',
      stats: '-',
      content: '',
      description: 'Durasi hubungan kerja pegawai'
    },
    {
      title: 'Jenis Pegawai',
      avatarIcon: 'tabler-briefcase',
      color: 'info',
      stats: '-',
      content: '',
      description: 'Jenis keterikatan kerja'
    },
    {
      title: 'Kelengkapan Data',
      avatarIcon: 'tabler-user-check',
      color: 'success',
      stats: '-',
      content: '',
      description: 'Kelengkapan profil pegawai'
    },
    {
      title: 'Dokumen',
      avatarIcon: 'tabler-files',
      color: 'warning',
      stats: '-',
      content: '',
      description: 'Dokumen pegawai yang tercatat'
    }
  ]

  return (
    <Grid container spacing={6}>
      {employeeStatData.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6 }} key={`${employeeId}-${index}`}>
          <InstructorStats {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default EmployeeStatisticsCard

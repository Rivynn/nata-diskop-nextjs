// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { InstructorStatsType } from 'types'

// Component Imports
import InstructorStats from '@components/card-statistics/InstructorStats'

const InstructorStatisticsCard = () => {
  const instructorStatData: InstructorStatsType[] = [
    {
      title: 'Pelatihan',
      avatarIcon: 'tabler-school',
      color: 'primary',
      stats: '18',
      content: 'program',
      description: 'Pelatihan yang telah ditangani'
    },
    {
      title: 'Peserta',
      avatarIcon: 'tabler-users',
      color: 'info',
      stats: '426',
      content: 'peserta',
      description: 'Total peserta yang telah dilatih'
    },
    {
      title: 'Rating',
      avatarIcon: 'tabler-star-filled',
      color: 'warning',
      stats: '4.8',
      content: '/ 5.0',
      description: 'Rata-rata evaluasi peserta'
    },
    {
      title: 'Evaluasi',
      avatarIcon: 'tabler-message-star',
      color: 'success',
      stats: '128',
      content: 'evaluasi',
      description: 'Total evaluasi yang diterima'
    }
  ]

  return (
    <Grid container spacing={6}>
      {instructorStatData.map((item, index) => (
        <Grid
          size={{ xs: 12, sm: 6 }}
          key={index}
        >
          <InstructorStats {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default InstructorStatisticsCard

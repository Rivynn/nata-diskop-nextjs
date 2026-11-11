
'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Type Imports
import type { TrainingRegistrationTableType } from '@/types/apps/registrationTypes'

type RegistrationListCardsProps = {
  registrationData?: TrainingRegistrationTableType[]
}

const RegistrationListCards = ({ registrationData = [] }: RegistrationListCardsProps) => {
  const summary = useMemo(() => {
    return {
      total: registrationData.length,
      pending: registrationData.filter(item => item.registrationStatus === 'pending').length,
      approved: registrationData.filter(item => item.registrationStatus === 'approved').length,
      rejected: registrationData.filter(item => item.registrationStatus === 'rejected').length
    }
  }, [registrationData])

  const cardData = [
    {
      title: 'Total Pendaftaran',
      value: summary.total,
      description: 'Seluruh pendaftaran',
      icon: 'tabler-users',
      color: 'primary'
    },
    {
      title: 'Menunggu Verifikasi',
      value: summary.pending,
      description: 'Perlu ditinjau admin',
      icon: 'tabler-clock-hour-4',
      color: 'warning'
    },
    {
      title: 'Disetujui',
      value: summary.approved,
      description: 'Pendaftaran diterima',
      icon: 'tabler-circle-check',
      color: 'success'
    },
    {
      title: 'Ditolak',
      value: summary.rejected,
      description: 'Pendaftaran tidak diterima',
      icon: 'tabler-circle-x',
      color: 'error'
    }
  ]

  return (
    <Grid container spacing={6}>
      {cardData.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent>
              <Box className='flex items-start justify-between gap-2'>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='body2' color='text.secondary'>
                    {card.title}
                  </Typography>

                  <Typography variant='h4'>
                    {card.value.toLocaleString('id-ID')}
                  </Typography>

                  <Typography variant='caption' color='text.secondary'>
                    {card.description}
                  </Typography>
                </Box>

                <Box
                  className={`flex items-center justify-center rounded p-2 bg-${card.color}Light`}
                  sx={{
                    color: `${card.color}.main`,
                    backgroundColor: `${card.color}.lightOpacity`
                  }}
                >
                  <i className={`${card.icon} text-2xl`} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default RegistrationListCards

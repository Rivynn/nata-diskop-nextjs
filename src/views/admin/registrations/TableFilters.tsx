
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type {
  RegistrationStatus,
  TrainingRegistrationType
} from '@/types/apps/registrationTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

type ParticipantSearchData = {
  id: number
  name: string
  email: string
}

type Props = {
  tableData: TrainingRegistrationType[]
  setData: (data: TrainingRegistrationType[]) => void
  participants: ParticipantSearchData[]
  trainingOptions: {
    id: string
    name: string
  }[]
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const TableFilters = ({
                        tableData,
                        setData,
                        participants,
                        trainingOptions
                      }: Props) => {
  const [search, setSearch] = useState('')
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus | ''>('')

  const [trainingId, setTrainingId] = useState('')

  useEffect(() => {
    const keyword = search.trim().toLowerCase()

    const filteredData = tableData.filter(registration => {
      const participant = participants.find(
        item => item.id === registration.participantId
      )

      const training = trainingOptions.find(
        item => item.id === registration.trainingId
      )

      const searchMatch =
        !keyword ||
        registration.registrationCode.toLowerCase().includes(keyword) ||
        participant?.name.toLowerCase().includes(keyword) ||
        participant?.email.toLowerCase().includes(keyword) ||
        training?.name.toLowerCase().includes(keyword)

      const statusMatch =
        !registrationStatus ||
        registration.registrationStatus === registrationStatus

      const trainingMatch =
        !trainingId || registration.trainingId === trainingId

      return searchMatch && statusMatch && trainingMatch
    })

    setData(filteredData)
  }, [
    search,
    registrationStatus,
    trainingId,
    tableData,
    participants,
    trainingOptions,
    setData
  ])

  const handleReset = () => {
    setSearch('')
    setRegistrationStatus('')
    setTrainingId('')
  }

  return (
    <CardContent>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomTextField
            fullWidth
            size='small'
            value={search}
            placeholder='Cari kode, nama peserta, atau pelatihan...'
            onChange={event => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <i className='tabler-search text-xl text-textSecondary mie-2' />
                )
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            size='small'
            label='Program Pelatihan'
            value={trainingId}
            onChange={event => setTrainingId(event.target.value)}
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>Semua Pelatihan</MenuItem>

            {trainingOptions.map(training => (
              <MenuItem key={training.id} value={training.id}>
                {training.name}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            size='small'
            label='Status Pendaftaran'
            value={registrationStatus}
            onChange={event =>
              setRegistrationStatus(
                event.target.value as RegistrationStatus | ''
              )
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>Semua Status</MenuItem>
            <MenuItem value='pending'>Menunggu</MenuItem>
            <MenuItem value='approved'>Disetujui</MenuItem>
            <MenuItem value='rejected'>Ditolak</MenuItem>
            <MenuItem value='waitlisted'>Daftar Tunggu</MenuItem>
            <MenuItem value='cancelled'>Dibatalkan</MenuItem>
          </CustomTextField>
        </Grid>

        <Grid
          size={{ xs: 12, md: 2 }}
          className='flex items-center'
        >
          <ButtonReset onClick={handleReset} />
        </Grid>
      </Grid>
    </CardContent>
  )
}

// ---------------------------------------------------------
// Reset Button
// ---------------------------------------------------------

import Button from '@mui/material/Button'

const ButtonReset = ({ onClick }: { onClick: () => void }) => (
  <Button
    fullWidth
    variant='tonal'
    color='secondary'
    onClick={onClick}
    startIcon={<i className='tabler-refresh' />}
  >
    Reset Filter
  </Button>
)

export default TableFilters

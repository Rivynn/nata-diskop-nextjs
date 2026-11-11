'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { Mode } from '@core/types'


// Component Imports
import TrainingHeader from './TrainingHeader'
import Trainings from './Trainings'
import type { TrainingRecord } from '@/types/admin/trainingTypes'

type Props = {
  trainingData?: TrainingRecord[]
  mode: Mode
}

const TrainingList = ({ trainingData, mode }: Props) => {
  // States
  const [searchValue, setSearchValue] = useState('')

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TrainingHeader
          mode={mode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Trainings
          trainingData={trainingData}
          searchValue={searchValue}
        />
      </Grid>
    </Grid>
  )
}

export default TrainingList

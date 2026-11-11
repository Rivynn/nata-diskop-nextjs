// Component Imports
import AdminTrainings from '@/views/admin/trainings/list'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Data Imports
import { getTrainingData } from '@/app/server/actions'

const TrainingsPage = async () => {
  // Vars
  const mode = await getServerMode()
  const data = await getTrainingData()

  return <AdminTrainings mode={mode} trainingData={data?.trainings} />
}

export default TrainingsPage

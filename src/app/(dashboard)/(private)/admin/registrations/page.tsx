
// Component Imports
import RegistrationList from '@/views/admin/registrations'

// Data Imports
import { getRegistrationData } from '@/app/server/actions'

const RegistrationPage = async () => {
  const data = await getRegistrationData()

  return <RegistrationList registrationData={data} />
}

export default RegistrationPage

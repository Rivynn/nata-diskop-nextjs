
// Component Imports
import RegistrationListTable from '@/views/admin/registrations'

// Data Imports
import { getRegistrationData } from '@/app/server/actions'

const RegistrationListApp = async () => {
  // Vars
  const data = await getRegistrationData()

  return <RegistrationListTable registrationData={data} />
}

export default RegistrationListApp

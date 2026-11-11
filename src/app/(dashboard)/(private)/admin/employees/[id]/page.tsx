
// Next Imports
import { redirect } from 'next/navigation'

// Type Imports
import type { EmployeeRecord } from '@/views/admin/employees/all/types'

// Component Imports
import EmployeeDetails from '@/views/admin/employees/details'

// Data Imports
import { getEmployeeData } from '@/app/server/actions'

const EmployeeDetailsPage = async (
  props: {
    params: Promise<{ id: string }>
  }
) => {
  const params = await props.params

  // Vars
  const data = await getEmployeeData()

  const filteredData = data?.employees?.find(
    (item: EmployeeRecord) =>
      item.id.toString() === params.id
  )

  if (!filteredData) {
    redirect('/not-found')
  }

  return (
    <EmployeeDetails
      employeeData={filteredData}
      employeeId={params.id}
    />
  )
}

export default EmployeeDetailsPage

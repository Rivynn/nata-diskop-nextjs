// Next Imports
import { redirect } from 'next/navigation'

// Type Imports
import type { InstructorCardType } from '@/views/admin/instructors/details/types'

// Component Imports
import InstructorDetails from '@/views/admin/instructors/details'

// Data Imports
import { getInstructorData } from '@/app/server/actions'

const InstructorDetailsPage = async (
  props: {
    params: Promise<{ id: string }>
  }
) => {
  const params = await props.params

  // Vars
  const data = await getInstructorData()

  const filteredData = data?.instructors?.find(
    (item: InstructorCardType) =>
      item.id.toString() === params.id
  )

  // if (!filteredData) {
  //   redirect('/not-found')
  // }

  return (
    <InstructorDetails
      instructorData={filteredData}
      instructorId={params.id}
    />
  )
}

export default InstructorDetailsPage

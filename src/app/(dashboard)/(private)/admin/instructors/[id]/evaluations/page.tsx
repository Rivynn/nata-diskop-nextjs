// Component Imports
import InstructorEvaluations from '@/views/admin/instructors/evaluations'

type Props = {
  params: Promise<{
    id: string
  }>
}

const InstructorEvaluationsPage = async ({
                                           params
                                         }: Props) => {
  const { id } = await params

  return (
    <InstructorEvaluations
      instructorId={id}
    />
  )
}

export default InstructorEvaluationsPage

import InstructorForm from '@/views/admin/instructors/form'

type Props = {
  params: Promise<{
    id: string
  }>
}

const InstructorEditPage = async ({ params }: Props) => {
  const { id } = await params

  return <InstructorForm mode='edit' instructorId={id} />
}

export default InstructorEditPage

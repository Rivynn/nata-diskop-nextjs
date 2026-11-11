import EmployeeForm from '@/views/admin/employees/form'

type Props = {
  params: Promise<{
    id: string
  }>
}

const EmployeeEditPage = async ({ params }: Props) => {
  const { id } = await params

  return <EmployeeForm mode='edit' employeeId={id} />
}

export default EmployeeEditPage

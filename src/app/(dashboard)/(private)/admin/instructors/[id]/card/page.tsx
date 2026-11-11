import Preview from '@/views/instructors/card/Preview'

type InstructorCardPageProps = {
  params: Promise<{
    id: string
  }>
}

const InstructorCardPage = async ({
                                    params
                                  }: InstructorCardPageProps) => {
  const { id } = await params

  return <Preview instructorId={id} />
}

export default InstructorCardPage

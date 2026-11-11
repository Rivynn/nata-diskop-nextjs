import Preview from '@/views/participants/card/Preview'

type ParticipantCardPageProps = {
  params: Promise<{
    id: string
  }>
}

const ParticipantCardPage = async ({
                                     params
                                   }: ParticipantCardPageProps) => {
  const { id } = await params

  return <Preview participantId={id} />
}

export default ParticipantCardPage

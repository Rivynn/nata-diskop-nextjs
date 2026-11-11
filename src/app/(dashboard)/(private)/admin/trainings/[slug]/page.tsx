import { notFound } from 'next/navigation'

import { getTrainingDetail } from '@/app/server/actions'

import TrainingDetailsView from '@/views/admin/trainings/details'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const TrainingDetailsPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const training = await getTrainingDetail(slug)

  if (!training) {
    notFound()
  }

  return <TrainingDetailsView data={training} />
}

export default TrainingDetailsPage

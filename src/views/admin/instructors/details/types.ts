import type { ThemeColor } from '@core/types'

export type InstructorStatus = 'active' | 'inactive'

export type InstructorExpertise = {
  title: string
  color: ThemeColor
}

export type InstructorParticipant = {
  name: string
  avatar: string
}

export type InstructorCardType = {
  id: number
  name: string
  username: string
  avatar: string
  position: string
  description: string

  rating: number
  totalReviews: number
  totalTrainings: number
  totalParticipants: number

  status: InstructorStatus

  expertise: InstructorExpertise[]

  participants: InstructorParticipant[]
}


export type ParticipantsType = {
  id: number
  participantCode: string

  // Personal Information
  fullName: string
  nik: string
  gender: 'male' | 'female'
  birthPlace: string
  birthDate: string
  avatar?: string

  // Contact Information
  email: string
  phone: string
  address: string

  // Education & Employment
  education: string
  occupation: string
  institution?: string

  // Account Verification
  verificationStatus: 'pending' | 'verified' | 'rejected'
  accountStatus: 'active' | 'inactive' | 'suspended'
  verifiedAt?: string
  verificationNotes?: string

  // Additional Information
  notes?: string

  // Timestamps
  createdAt: string
  updatedAt: string
}

export type ParticipantVerificationStatus =
  ParticipantsType['verificationStatus']

export type ParticipantAccountStatus =
  ParticipantsType['accountStatus']

export type ParticipantFormType = Omit<
  ParticipantsType,
  'id' | 'participantCode' | 'createdAt' | 'updatedAt'
>

export type ParticipantsTypeWithAction = ParticipantsType & {
  action?: string
}

// Training Registration
export type TrainingRegistrationType = {
  id: number
  registrationCode: string

  // Relations
  participantId: number
  trainingId: string

  // Registration Information
  batch: string
  registrationStatus: 'pending' | 'approved' | 'rejected' | 'cancelled'
  registeredAt: string

  // Training Progress
  trainingStatus: 'not_started' | 'ongoing' | 'completed'
  resultStatus: 'not_assessed' | 'passed' | 'failed'

  // Additional Information
  notes?: string

  // Timestamps
  createdAt: string
  updatedAt: string
}

export type TrainingRegistrationFormType = Omit<
  TrainingRegistrationType,
  'id' | 'registrationCode' | 'createdAt' | 'updatedAt'
>

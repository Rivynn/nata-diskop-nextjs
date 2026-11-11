
import type { ParticipantsType } from './participantTypes'

// ---------------------------------------------------------
// Registration Status
// ---------------------------------------------------------

export type RegistrationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'waitlisted'

export type RegistrationDocumentStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

export type RegistrationActionType =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'waitlisted'
  | 'document_approved'
  | 'document_rejected'
  | 'note_added'
  | 'status_changed'

// ---------------------------------------------------------
// Registration Document
// ---------------------------------------------------------

export type RegistrationDocumentType = {
  id: number
  documentType: string
  documentName: string
  fileName: string
  fileUrl: string

  verificationStatus: RegistrationDocumentStatus
  verificationNotes?: string

  uploadedAt: string
  reviewedAt?: string
  reviewedBy?: number
}

// ---------------------------------------------------------
// Registration History
// ---------------------------------------------------------

export type RegistrationHistoryType = {
  id: number
  action: RegistrationActionType

  previousStatus?: RegistrationStatus
  newStatus?: RegistrationStatus

  description: string
  notes?: string

  changedBy: number
  changedByName: string
  changedAt: string
}

// ---------------------------------------------------------
// Training Registration
// ---------------------------------------------------------

export type TrainingRegistrationType = {
  id: number
  registrationCode: string

  participantId: number
  trainingId: string

  registrationStatus: RegistrationStatus

  registeredAt: string
  reviewedAt?: string
  reviewedBy?: number
  reviewedByName?: string

  rejectionReason?: string
  adminNotes?: string

  documents: RegistrationDocumentType[]
  history: RegistrationHistoryType[]

  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------
// Registration Form
// ---------------------------------------------------------

export type TrainingRegistrationFormType = {
  participantId: number
  trainingId: string
  documents: RegistrationDocumentType[]
  adminNotes?: string
}

// ---------------------------------------------------------
// Registration Action Payloads
// ---------------------------------------------------------

export type RegistrationActor = {
  id: number
  name: string
}

export type RegistrationDecisionPayload = {
  registrationId: number
  actor: RegistrationActor
  notes?: string
}

export type RegistrationRejectPayload = RegistrationDecisionPayload & {
  reason: string
}

export type RegistrationDocumentReviewPayload = {
  registrationId: number
  documentId: number
  actor: RegistrationActor
  notes?: string
}

// ---------------------------------------------------------
// Extended Table Data
// ---------------------------------------------------------

export type TrainingRegistrationTableType =
  TrainingRegistrationType & {
  participant?: ParticipantsType
  trainingName?: string
  trainingBatch?: string
  action?: string
}

// ---------------------------------------------------------
// Filter
// ---------------------------------------------------------

export type RegistrationFilterType = {
  search: string
  trainingId: string
  registrationStatus: RegistrationStatus | ''
  dateFrom: string
  dateTo: string
}

// ---------------------------------------------------------
// Summary
// ---------------------------------------------------------

export type RegistrationSummaryType = {
  total: number
  pending: number
  approved: number
  rejected: number
  cancelled: number
  waitlisted: number
}

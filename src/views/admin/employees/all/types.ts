export type EmployeeType = 'internal' | 'contract' | 'internship'

export type EmployeeStatus = 'Aktif' | 'Nonaktif' | 'Menunggu Aktivasi'

export type EmploymentStatus = 'active' | 'completed' | 'upcoming'

export type EmployeeDocumentType =
  | 'Identitas'
  | 'Pendidikan'
  | 'Kepegawaian'
  | 'Sertifikasi'
  | 'Lainnya'

export type EmployeeDocumentStatus = 'verified' | 'pending' | 'rejected'

export type EmployeeActivityType =
  | 'login'
  | 'logout'
  | 'profile'
  | 'employment'
  | 'document'
  | 'security'
  | 'account'

export type EmployeeRecord = {
  // Identitas sistem
  id: number | string
  employeeId?: string | null
  username?: string | null
  name?: string | null
  avatar?: string | null

  // Informasi kepegawaian
  nip?: string | null
  nik?: string | null
  position?: string | null
  employeeType?: EmployeeType | null
  status?: EmployeeStatus | null
  employmentStartDate?: string | null
  employmentEndDate?: string | null

  // Data pribadi
  birthPlace?: string | null
  birthDate?: string | null
  gender?: 'Laki-laki' | 'Perempuan' | null
  religion?: string | null
  maritalStatus?: 'Belum Menikah' | 'Menikah' | 'Cerai' | null
  nationality?: string | null

  // Informasi kontak
  email?: string | null
  phone?: string | null
  address?: string | null
  village?: string | null
  district?: string | null
  city?: string | null
  province?: string | null
  postalCode?: string | null

  // Pendidikan
  education?: string | null
  institution?: string | null
  graduationYear?: number | null
  fieldOfStudy?: string | null

  // Informasi tambahan
  employeeNumber?: string | null
  departmentId?: number | string | null
  departmentName?: string | null
  supervisorId?: number | string | null
  supervisorName?: string | null
  notes?: string | null

  // Informasi akun
  emailVerifiedAt?: string | null
  lastLoginAt?: string | null
  passwordChangedAt?: string | null

  // Metadata
  createdAt?: string | null
  updatedAt?: string | null
}

export type EmploymentHistory = {
  id: number | string
  employeeId: number | string
  employeeType: EmployeeType
  organization: string
  department?: string | null
  position: string
  startDate: string
  endDate?: string | null
  status: EmploymentStatus
  description?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type EmployeeDocument = {
  id: number | string
  employeeId: number | string
  name: string
  type: EmployeeDocumentType
  fileName: string
  filePath?: string | null
  mimeType?: string | null
  fileSize: number
  uploadedAt: string
  uploadedBy?: number | string | null
  status: EmployeeDocumentStatus
  verifiedAt?: string | null
  verifiedBy?: number | string | null
  rejectionReason?: string | null
  sensitive?: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export type EmployeeActivity = {
  id: number | string
  employeeId: number | string
  title: string
  description: string
  module: string
  type: EmployeeActivityType
  createdAt: string
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown> | null
}

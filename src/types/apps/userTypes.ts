// @ts-ignore
import type { ThemeColor } from '@mui/material'

export type UserRole = 'admin' | 'pegawai' | 'peserta' | 'pelatih' | 'mitra'

export type UserStatus = 'active' | 'pending'

export type UserProfile =
  | {
  type: 'admin'
  isPrimary: boolean
  position: string
  department: string
  lastLoginAt: string | null
}
  | {
  type: 'pegawai'
  nik: string
  nip: string
  department: string
  position: string
  employmentType: 'pns' | 'pppk' | 'honorer' | 'kontrak'
  joinedAt: string
}
  | {
  type: 'peserta'
  nik: string
  nickname: string
  birthPlace: string
  birthDate: string
  gender: 'male' | 'female'
  address: string
  education: string
  institution: string
  major: string
  graduationYear: number | null
  employmentStatus: 'pelajar' | 'mahasiswa' | 'bekerja' | 'wirausaha' | 'belum_bekerja'
  occupation: string | null
  companyName: string | null
}
  | {
  type: 'pelatih'
  nik: string | null
  birthPlace: string
  birthDate: string
  gender: 'male' | 'female'
  address: string
  education: string
  institution: string
  expertise: string[]
  specialization: string
  certification: string[]
  experienceYears: number
  organization: string | null
  position: string | null
  bio: string
}
  | {
  type: 'mitra'
  companyType: 'pt' | 'cv' | 'koperasi' | 'umkm' | 'yayasan' | 'instansi'
  companyName: string
  companyNpwp: string
  businessField: string
  companyAddress: string
  website: string | null
  picName: string
  picPosition: string
  picEmail: string
  picPhone: string
  employeeCount: number
  cooperationStatus: 'active' | 'pending'
}

export type UsersType = {
  id: number

  // Account
  username: string
  email: string
  phone: string
  password?: string

  // Identity
  fullName: string
  avatar: string
  avatarColor?: ThemeColor

  // Access
  role: UserRole
  status: UserStatus

  // Verification
  emailVerifiedAt: string | null
  phoneVerifiedAt?: string | null

  // System
  lastLoginAt?: string | null
  createdAt: string
  updatedAt?: string

  // Role-specific data
  profile: UserProfile
}

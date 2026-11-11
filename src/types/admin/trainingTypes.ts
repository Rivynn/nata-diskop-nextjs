/* =========================================================
 * TRAINING TYPES — DISKOP KOTA BANJARBARU
 * ========================================================= */

/**
 * Status lifecycle program pelatihan.
 */
export type TrainingStatus =
  | 'draft'
  | 'published'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

/**
 * Sasaran peserta berdasarkan kondisi pekerjaan.
 */
export type TrainingEmploymentTarget =
  | 'unemployed'
  | 'job-seeker'
  | 'employed'
  | 'entrepreneur'
  | 'student'
  | 'general'

/**
 * Tingkat kesulitan pelatihan.
 */
export type TrainingLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'

/**
 * Format penyelenggaraan pelatihan.
 */
export type TrainingFormat =
  | 'online'
  | 'offline'
  | 'hybrid'

/**
 * Informasi pelatih atau narasumber.
 */
export type TrainingSpeaker = {
  id: string
  name: string
  position: string
  organization: string
  avatar: string | null
  bio: string
  expertise: string[]
}

/**
 * Informasi pendaftaran peserta.
 */
export type TrainingRegistration = {
  isOpen: boolean
  openAt: string
  closeAt: string
  quota: number
  registered: number
  waitingList: boolean
}

/**
 * Informasi jadwal dan lokasi pelatihan.
 */
export type TrainingSchedule = {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone: string
  durationHours: number
  format: TrainingFormat
  venue: string | null
  address: string | null
  meetingUrl: string | null
}

/**
 * Sasaran dan persyaratan calon peserta.
 */
export type TrainingTarget = {
  employment: TrainingEmploymentTarget[]
  education: string[]
  ageMin: number | null
  ageMax: number | null
  description: string
  requirements: string[]
}

/**
 * Informasi kolaborasi dengan perusahaan atau lembaga mitra.
 */
export type TrainingPartner = {
  isCollaborative: boolean
  companyName: string | null
  companyLogo: string | null
  companyWebsite: string | null
  collaborationType: string | null
  description: string | null
}

/**
 * Satu modul atau materi kurikulum.
 */
export type TrainingCurriculumItem = {
  title: string
  description: string
  durationHours: number
}

/**
 * Informasi sertifikat pelatihan.
 */
export type TrainingCertificate = {
  available: boolean
  issuer: string | null
  requirements: string[]
}

/**
 * Data utama program pelatihan.
 */
export type TrainingRecord = {
  // Identitas program
  id: string
  code: string
  slug: string

  // Informasi utama
  title: string
  shortDescription: string
  description: string
  cover: string | null
  category: string
  labels: string[]
  level: TrainingLevel
  status: TrainingStatus

  // Pendaftaran
  registration: TrainingRegistration

  // Jadwal dan lokasi
  schedule: TrainingSchedule

  // Pelatih
  speakers: TrainingSpeaker[]

  // Sasaran peserta
  target: TrainingTarget

  // Mitra penyelenggaraan
  partner: TrainingPartner

  // Materi pembelajaran
  curriculum: TrainingCurriculumItem[]

  // Hasil pembelajaran
  skills: string[]
  outcomes: string[]
  careerOpportunities: string[]

  // Sertifikat
  certificate: TrainingCertificate

  // Publikasi dan audit
  featured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Data untuk form membuat atau mengedit program.
 * ID, slug, dan timestamp dapat ditentukan oleh sistem.
 */
export type TrainingFormData = Omit<
  TrainingRecord,
  'id' | 'slug' | 'publishedAt' | 'createdAt' | 'updatedAt'
>

/**
 * Parameter untuk mengambil daftar program.
 */
export type GetTrainingDataParams = {
  search?: string
  category?: string
  status?: TrainingStatus
  featured?: boolean
}

/**
 * Ringkasan jumlah peserta dan kapasitas.
 */
export type TrainingEnrollmentSummary = {
  quota: number
  registered: number
  availableSeats: number
  occupancyPercentage: number
  isFull: boolean
}

/**
 * Label status pendaftaran untuk kebutuhan UI.
 */
export type TrainingRegistrationStatus =
  | 'not-published'
  | 'upcoming'
  | 'open'
  | 'closed'
  | 'full'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

/**
 * Hasil pemetaan status pendaftaran.
 */
export type TrainingRegistrationStatusInfo = {
  status: TrainingRegistrationStatus
  label: string
  color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
}

/**
 * Hasil penghitungan kapasitas peserta.
 */
export const getTrainingEnrollmentSummary = (
  registration: TrainingRegistration
): TrainingEnrollmentSummary => {
  const quota = Math.max(0, registration.quota)
  const registered = Math.max(0, registration.registered)
  const availableSeats =
    quota > 0 ? Math.max(0, quota - registered) : Number.POSITIVE_INFINITY

  const occupancyPercentage =
    quota > 0
      ? Math.min(100, Math.round((registered / quota) * 100))
      : 0

  return {
    quota,
    registered,
    availableSeats,
    occupancyPercentage,
    isFull: quota > 0 && registered >= quota
  }
}

/**
 * Memetakan status pendaftaran berdasarkan status program,
 * waktu pembukaan/penutupan, dan kuota.
 */
export const getTrainingRegistrationStatus = (
  training: Pick<TrainingRecord, 'status' | 'registration'>
): TrainingRegistrationStatusInfo => {
  const { status, registration } = training
  const now = Date.now()

  if (status === 'draft') {
    return {
      status: 'not-published',
      label: 'Belum Dipublikasikan',
      color: 'secondary'
    }
  }

  if (status === 'cancelled') {
    return {
      status: 'cancelled',
      label: 'Dibatalkan',
      color: 'error'
    }
  }

  if (status === 'completed') {
    return {
      status: 'completed',
      label: 'Pelatihan Selesai',
      color: 'secondary'
    }
  }

  if (status === 'ongoing') {
    return {
      status: 'ongoing',
      label: 'Pelatihan Berlangsung',
      color: 'info'
    }
  }

  if (!registration.isOpen) {
    return {
      status: 'closed',
      label: 'Pendaftaran Ditutup',
      color: 'warning'
    }
  }

  const openAt = Date.parse(registration.openAt)
  const closeAt = Date.parse(registration.closeAt)

  if (registration.openAt && !Number.isNaN(openAt) && now < openAt) {
    return {
      status: 'upcoming',
      label: 'Belum Dibuka',
      color: 'secondary'
    }
  }

  if (registration.closeAt && !Number.isNaN(closeAt) && now > closeAt) {
    return {
      status: 'closed',
      label: 'Pendaftaran Ditutup',
      color: 'warning'
    }
  }

  if (
    registration.quota > 0 &&
    registration.registered >= registration.quota
  ) {
    return {
      status: 'full',
      label: 'Kuota Penuh',
      color: 'error'
    }
  }

  return {
    status: 'open',
    label: 'Pendaftaran Dibuka',
    color: 'success'
  }
}

/**
 * Label level pelatihan untuk tampilan bahasa Indonesia.
 */
export const trainingLevelLabels: Record<TrainingLevel, string> = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjutan'
}

/**
 * Label format pelatihan.
 */
export const trainingFormatLabels: Record<TrainingFormat, string> = {
  online: 'Online',
  offline: 'Tatap Muka',
  hybrid: 'Hybrid'
}

/**
 * Label status program.
 */
export const trainingStatusLabels: Record<TrainingStatus, string> = {
  draft: 'Draft',
  published: 'Dipublikasikan',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan'
}

/**
 * Label sasaran peserta.
 */
export const trainingEmploymentTargetLabels: Record<
  TrainingEmploymentTarget,
  string
> = {
  unemployed: 'Belum Bekerja',
  'job-seeker': 'Pencari Kerja',
  employed: 'Sudah Bekerja',
  entrepreneur: 'Wirausaha',
  student: 'Pelajar/Mahasiswa',
  general: 'Umum'
}

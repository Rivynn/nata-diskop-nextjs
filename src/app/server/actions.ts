/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

// Data Imports
import { db as eCommerceData } from '@/fake-db/apps/ecommerce'
import { db as academyData } from '@/fake-db/apps/academy'
import { db as vehicleData } from '@/fake-db/apps/logistics'
import { db as invoiceData } from '@/fake-db/apps/invoice'
import { db as userData } from '@/fake-db/apps/userList'
import { db as permissionData } from '@/fake-db/apps/permissions'
import { db as profileData } from '@/fake-db/pages/userProfile'
import { db as faqData } from '@/fake-db/pages/faq'
import { db as pricingData } from '@/fake-db/pages/pricing'
import { db as statisticsData } from '@/fake-db/pages/widgetExamples'

import type { InstructorCardType } from '@/views/admin/instructors/details/types'
import type { EmployeeRecord } from '@/views/admin/employees/all/types'
import type { TrainingRecord } from '@/types/admin/trainingTypes'
import type { ParticipantsType } from '@/types/apps/participantTypes'
import type { TrainingRegistrationTableType } from '@/types/apps/registrationTypes'

type TrainingSeed = Pick<
  TrainingRecord,
  | 'id'
  | 'slug'
  | 'title'
  | 'shortDescription'
  | 'description'
  | 'category'
  | 'level'
  | 'status'
  | 'skills'
  | 'outcomes'
  | 'careerOpportunities'
> & {
  coverIndex: number
  startDate: string
  endDate: string
  quota: number
  registered: number
  speakerName: string
  speakerPosition: string
  expertise: string[]
  requirements: string[]
  featured?: boolean
  format?: TrainingRecord['schedule']['format']
  employment?: TrainingRecord['target']['employment']
  collaborative?: boolean
}




export const getRegistrationData = async (): Promise<TrainingRegistrationTableType[]> => {
  const participants: ParticipantsType[] = [
    {
      id: 1,
      participantCode: 'PST-2026-001',
      fullName: 'Ahmad Fauzi',
      nik: '6371010101010001',
      gender: 'male',
      birthPlace: 'Banjarbaru',
      birthDate: '2000-01-01',
      avatar: '/images/avatars/7.png',
      email: 'ahmad@example.com',
      phone: '081234567890',
      address: 'Banjarbaru, Kalimantan Selatan',
      education: 'SMA',
      occupation: 'Belum Bekerja',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-01T08:00:00',
      updatedAt: '2026-10-01T08:00:00'
    },
    {
      id: 2,
      participantCode: 'PST-2026-002',
      fullName: 'Siti Rahmawati',
      nik: '6371020202020002',
      gender: 'female',
      birthPlace: 'Martapura',
      birthDate: '2001-05-12',
      avatar: '/images/avatars/8.png',
      email: 'siti@example.com',
      phone: '081234567891',
      address: 'Martapura, Kabupaten Banjar',
      education: 'D3',
      occupation: 'Wirausaha',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-02T09:00:00',
      updatedAt: '2026-10-02T09:00:00'
    },
    {
      id: 3,
      participantCode: 'PST-2026-003',
      fullName: 'Muhammad Rizky',
      nik: '6371030303030003',
      gender: 'male',
      birthPlace: 'Banjarmasin',
      birthDate: '1999-08-20',
      avatar: '/images/avatars/9.png',
      email: 'rizky@example.com',
      phone: '081234567892',
      address: 'Banjarmasin, Kalimantan Selatan',
      education: 'S1',
      occupation: 'Mahasiswa',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-03T10:00:00',
      updatedAt: '2026-10-03T10:00:00'
    },
    {
      id: 4,
      participantCode: 'PST-2026-004',
      fullName: 'Nurul Hidayah',
      nik: '6371040404040004',
      gender: 'female',
      birthPlace: 'Banjarbaru',
      birthDate: '2002-02-15',
      avatar: '/images/avatars/10.png',
      email: 'nurul@example.com',
      phone: '081234567893',
      address: 'Landasan Ulin, Banjarbaru',
      education: 'SMK',
      occupation: 'Belum Bekerja',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-04T11:00:00',
      updatedAt: '2026-10-04T11:00:00'
    },
    {
      id: 5,
      participantCode: 'PST-2026-005',
      fullName: 'Budi Santoso',
      nik: '6371050505050005',
      gender: 'male',
      birthPlace: 'Pelaihari',
      birthDate: '1998-11-10',
      avatar: '/images/avatars/11.png',
      email: 'budi@example.com',
      phone: '081234567894',
      address: 'Pelaihari, Tanah Laut',
      education: 'SMA',
      occupation: 'Karyawan Swasta',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-05T08:30:00',
      updatedAt: '2026-10-05T08:30:00'
    },
    {
      id: 6,
      participantCode: 'PST-2026-006',
      fullName: 'Dewi Anggraini',
      nik: '6371060606060006',
      gender: 'female',
      birthPlace: 'Kandangan',
      birthDate: '2000-07-22',
      avatar: '/images/avatars/12.png',
      email: 'dewi@example.com',
      phone: '081234567895',
      address: 'Kandangan, Hulu Sungai Selatan',
      education: 'D3',
      occupation: 'Belum Bekerja',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-06T09:15:00',
      updatedAt: '2026-10-06T09:15:00'
    },
    {
      id: 7,
      participantCode: 'PST-2026-007',
      fullName: 'Andi Pratama',
      nik: '6371070707070007',
      gender: 'male',
      birthPlace: 'Kotabaru',
      birthDate: '1997-03-18',
      avatar: '/images/avatars/13.png',
      email: 'andi@example.com',
      phone: '081234567896',
      address: 'Kotabaru, Kalimantan Selatan',
      education: 'S1',
      occupation: 'Freelancer',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-07T10:30:00',
      updatedAt: '2026-10-07T10:30:00'
    },
    {
      id: 8,
      participantCode: 'PST-2026-008',
      fullName: 'Rina Marlina',
      nik: '6371080808080008',
      gender: 'female',
      birthPlace: 'Amuntai',
      birthDate: '2001-12-05',
      avatar: '/images/avatars/14.png',
      email: 'rina@example.com',
      phone: '081234567897',
      address: 'Amuntai, Hulu Sungai Utara',
      education: 'SMK',
      occupation: 'Belum Bekerja',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-08T13:00:00',
      updatedAt: '2026-10-08T13:00:00'
    },
    {
      id: 9,
      participantCode: 'PST-2026-009',
      fullName: 'Fajar Maulana',
      nik: '6371090909090009',
      gender: 'male',
      birthPlace: 'Barabai',
      birthDate: '1999-09-09',
      avatar: '/images/avatars/15.png',
      email: 'fajar@example.com',
      phone: '081234567898',
      address: 'Barabai, Hulu Sungai Tengah',
      education: 'SMA',
      occupation: 'Wirausaha',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-09T14:00:00',
      updatedAt: '2026-10-09T14:00:00'
    },
    {
      id: 10,
      participantCode: 'PST-2026-010',
      fullName: 'Maya Putri',
      nik: '6371101010100010',
      gender: 'female',
      birthPlace: 'Banjarbaru',
      birthDate: '2002-06-14',
      avatar: '/images/avatars/16.png',
      email: 'maya@example.com',
      phone: '081234567899',
      address: 'Cempaka, Banjarbaru',
      education: 'S1',
      occupation: 'Mahasiswa',
      verificationStatus: 'verified',
      accountStatus: 'active',
      createdAt: '2026-10-10T15:00:00',
      updatedAt: '2026-10-10T15:00:00'
    }
  ]

  const registrationData: TrainingRegistrationTableType[] = [
    // 1. Pending
    {
      id: 1,
      registrationCode: 'REG-2026-001',
      participantId: 1,
      trainingId: 'TRN-2026-001',
      registrationStatus: 'pending',
      registeredAt: '2026-11-01T08:30:00',
      adminNotes: '',
      documents: [
        {
          id: 1,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-ahmad.pdf',
          fileUrl: '/documents/ktp-ahmad.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-01T08:30:00'
        },
        {
          id: 2,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-ahmad.pdf',
          fileUrl: '/documents/ijazah-ahmad.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-01T08:30:00'
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 1,
          changedByName: 'Ahmad Fauzi',
          changedAt: '2026-11-01T08:30:00'
        }
      ],
      participant: participants[0],
      trainingName: 'Pelatihan Digital Marketing',
      trainingBatch: 'Batch 1 - 2026',
      createdAt: '2026-11-01T08:30:00',
      updatedAt: '2026-11-01T08:30:00'
    },

    // 2. Approved
    {
      id: 2,
      registrationCode: 'REG-2026-002',
      participantId: 2,
      trainingId: 'TRN-2026-002',
      registrationStatus: 'approved',
      registeredAt: '2026-11-01T09:15:00',
      reviewedAt: '2026-11-02T10:00:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      adminNotes: 'Dokumen lengkap dan memenuhi persyaratan.',
      documents: [
        {
          id: 3,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-siti.pdf',
          fileUrl: '/documents/ktp-siti.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-01T09:15:00',
          reviewedAt: '2026-11-02T09:30:00',
          reviewedBy: 1
        },
        {
          id: 4,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-siti.pdf',
          fileUrl: '/documents/ijazah-siti.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-01T09:15:00',
          reviewedAt: '2026-11-02T09:30:00',
          reviewedBy: 1
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 2,
          changedByName: 'Siti Rahmawati',
          changedAt: '2026-11-01T09:15:00'
        },
        {
          id: 2,
          action: 'document_approved',
          description: 'Dokumen persyaratan telah diperiksa dan disetujui',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-02T09:30:00'
        },
        {
          id: 3,
          action: 'approved',
          previousStatus: 'pending',
          newStatus: 'approved',
          description: 'Pendaftaran disetujui oleh administrator',
          notes: 'Dokumen lengkap dan memenuhi persyaratan.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-02T10:00:00'
        }
      ],
      participant: participants[1],
      trainingName: 'Pelatihan Komputer dan Administrasi Perkantoran',
      trainingBatch: 'Batch 1 - 2026',
      createdAt: '2026-11-01T09:15:00',
      updatedAt: '2026-11-02T10:00:00'
    },

    // 3. Rejected
    {
      id: 3,
      registrationCode: 'REG-2026-003',
      participantId: 3,
      trainingId: 'TRN-2026-001',
      registrationStatus: 'rejected',
      registeredAt: '2026-11-02T08:00:00',
      reviewedAt: '2026-11-03T11:00:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      rejectionReason: 'Dokumen ijazah tidak terbaca. Silakan unggah ulang dokumen yang jelas.',
      adminNotes: 'Peserta perlu memperbaiki dokumen ijazah.',
      documents: [
        {
          id: 5,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-rizky.pdf',
          fileUrl: '/documents/ktp-rizky.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-02T08:00:00',
          reviewedAt: '2026-11-03T10:00:00',
          reviewedBy: 1
        },
        {
          id: 6,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-rizky.pdf',
          fileUrl: '/documents/ijazah-rizky.pdf',
          verificationStatus: 'rejected',
          verificationNotes: 'File tidak terbaca.',
          uploadedAt: '2026-11-02T08:00:00',
          reviewedAt: '2026-11-03T10:30:00',
          reviewedBy: 1
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 3,
          changedByName: 'Muhammad Rizky',
          changedAt: '2026-11-02T08:00:00'
        },
        {
          id: 2,
          action: 'document_rejected',
          description: 'Dokumen ijazah ditolak karena tidak terbaca',
          notes: 'Silakan unggah ulang dokumen yang lebih jelas.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-03T10:30:00'
        },
        {
          id: 3,
          action: 'rejected',
          previousStatus: 'pending',
          newStatus: 'rejected',
          description: 'Pendaftaran ditolak oleh administrator',
          notes: 'Dokumen ijazah tidak terbaca.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-03T11:00:00'
        }
      ],
      participant: participants[2],
      trainingName: 'Pelatihan Digital Marketing',
      trainingBatch: 'Batch 1 - 2026',
      createdAt: '2026-11-02T08:00:00',
      updatedAt: '2026-11-03T11:00:00'
    },

    // 4. Waitlisted
    {
      id: 4,
      registrationCode: 'REG-2026-004',
      participantId: 4,
      trainingId: 'TRN-2026-003',
      registrationStatus: 'waitlisted',
      registeredAt: '2026-11-03T09:00:00',
      reviewedAt: '2026-11-04T08:30:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      adminNotes: 'Peserta masuk daftar tunggu karena kuota sementara penuh.',
      documents: [
        {
          id: 7,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-nurul.pdf',
          fileUrl: '/documents/ktp-nurul.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-03T09:00:00',
          reviewedAt: '2026-11-04T08:00:00',
          reviewedBy: 1
        },
        {
          id: 8,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-nurul.pdf',
          fileUrl: '/documents/ijazah-nurul.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-03T09:00:00',
          reviewedAt: '2026-11-04T08:00:00',
          reviewedBy: 1
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 4,
          changedByName: 'Nurul Hidayah',
          changedAt: '2026-11-03T09:00:00'
        },
        {
          id: 2,
          action: 'waitlisted',
          previousStatus: 'pending',
          newStatus: 'waitlisted',
          description: 'Pendaftaran dipindahkan ke daftar tunggu',
          notes: 'Kuota sementara penuh.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-04T08:30:00'
        }
      ],
      participant: participants[3],
      trainingName: 'Pelatihan Desain Grafis',
      trainingBatch: 'Batch 1 - 2026',
      createdAt: '2026-11-03T09:00:00',
      updatedAt: '2026-11-04T08:30:00'
    },

    // 5. Pending
    {
      id: 5,
      registrationCode: 'REG-2026-005',
      participantId: 5,
      trainingId: 'TRN-2026-004',
      registrationStatus: 'pending',
      registeredAt: '2026-11-04T10:15:00',
      adminNotes: 'Menunggu pemeriksaan dokumen.',
      documents: [
        {
          id: 9,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-budi.pdf',
          fileUrl: '/documents/ktp-budi.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-04T10:15:00'
        },
        {
          id: 10,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-budi.pdf',
          fileUrl: '/documents/ijazah-budi.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-04T10:15:00'
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 5,
          changedByName: 'Budi Santoso',
          changedAt: '2026-11-04T10:15:00'
        },
        {
          id: 2,
          action: 'note_added',
          description: 'Administrator menambahkan catatan internal',
          notes: 'Menunggu pemeriksaan dokumen.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-04T11:00:00'
        }
      ],
      participant: participants[4],
      trainingName: 'Pelatihan Kewirausahaan',
      trainingBatch: 'Batch 1 - 2026',
      createdAt: '2026-11-04T10:15:00',
      updatedAt: '2026-11-04T11:00:00'
    },

    // 6. Approved
    {
      id: 6,
      registrationCode: 'REG-2026-006',
      participantId: 6,
      trainingId: 'TRN-2026-005',
      registrationStatus: 'approved',
      registeredAt: '2026-11-05T08:45:00',
      reviewedAt: '2026-11-06T09:00:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      adminNotes: 'Seluruh persyaratan telah terpenuhi.',
      documents: [
        {
          id: 11,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-dewi.pdf',
          fileUrl: '/documents/ktp-dewi.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-05T08:45:00',
          reviewedAt: '2026-11-06T08:30:00',
          reviewedBy: 1
        },
        {
          id: 12,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-dewi.pdf',
          fileUrl: '/documents/ijazah-dewi.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-05T08:45:00',
          reviewedAt: '2026-11-06T08:30:00',
          reviewedBy: 1
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 6,
          changedByName: 'Dewi Anggraini',
          changedAt: '2026-11-05T08:45:00'
        },
        {
          id: 2,
          action: 'approved',
          previousStatus: 'pending',
          newStatus: 'approved',
          description: 'Pendaftaran disetujui oleh administrator',
          notes: 'Seluruh persyaratan telah terpenuhi.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-06T09:00:00'
        }
      ],
      participant: participants[5],
      trainingName: 'Pelatihan Administrasi Perkantoran',
      trainingBatch: 'Batch 2 - 2026',
      createdAt: '2026-11-05T08:45:00',
      updatedAt: '2026-11-06T09:00:00'
    },

    // 7. Cancelled
    {
      id: 7,
      registrationCode: 'REG-2026-007',
      participantId: 7,
      trainingId: 'TRN-2026-001',
      registrationStatus: 'cancelled',
      registeredAt: '2026-11-06T10:00:00',
      reviewedAt: '2026-11-07T14:00:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      adminNotes: 'Dibatalkan atas permintaan peserta.',
      documents: [
        {
          id: 13,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-andi.pdf',
          fileUrl: '/documents/ktp-andi.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-06T10:00:00'
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 7,
          changedByName: 'Andi Pratama',
          changedAt: '2026-11-06T10:00:00'
        },
        {
          id: 2,
          action: 'cancelled',
          previousStatus: 'pending',
          newStatus: 'cancelled',
          description: 'Pendaftaran dibatalkan',
          notes: 'Peserta mengajukan pembatalan karena ada keperluan pribadi.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-07T14:00:00'
        }
      ],
      participant: participants[6],
      trainingName: 'Pelatihan Digital Marketing',
      trainingBatch: 'Batch 2 - 2026',
      createdAt: '2026-11-06T10:00:00',
      updatedAt: '2026-11-07T14:00:00'
    },

    // 8. Pending
    {
      id: 8,
      registrationCode: 'REG-2026-008',
      participantId: 8,
      trainingId: 'TRN-2026-003',
      registrationStatus: 'pending',
      registeredAt: '2026-11-07T09:30:00',
      adminNotes: '',
      documents: [
        {
          id: 14,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-rina.pdf',
          fileUrl: '/documents/ktp-rina.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-07T09:30:00'
        },
        {
          id: 15,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-rina.pdf',
          fileUrl: '/documents/ijazah-rina.pdf',
          verificationStatus: 'pending',
          uploadedAt: '2026-11-07T09:30:00'
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 8,
          changedByName: 'Rina Marlina',
          changedAt: '2026-11-07T09:30:00'
        }
      ],
      participant: participants[7],
      trainingName: 'Pelatihan Desain Grafis',
      trainingBatch: 'Batch 2 - 2026',
      createdAt: '2026-11-07T09:30:00',
      updatedAt: '2026-11-07T09:30:00'
    },

    // 9. Approved
    {
      id: 9,
      registrationCode: 'REG-2026-009',
      participantId: 9,
      trainingId: 'TRN-2026-004',
      registrationStatus: 'approved',
      registeredAt: '2026-11-08T08:00:00',
      reviewedAt: '2026-11-08T15:00:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      adminNotes: 'Pendaftaran telah disetujui.',
      documents: [
        {
          id: 16,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-fajar.pdf',
          fileUrl: '/documents/ktp-fajar.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-08T08:00:00',
          reviewedAt: '2026-11-08T14:00:00',
          reviewedBy: 1
        },
        {
          id: 17,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-fajar.pdf',
          fileUrl: '/documents/ijazah-fajar.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-08T08:00:00',
          reviewedAt: '2026-11-08T14:00:00',
          reviewedBy: 1
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 9,
          changedByName: 'Fajar Maulana',
          changedAt: '2026-11-08T08:00:00'
        },
        {
          id: 2,
          action: 'approved',
          previousStatus: 'pending',
          newStatus: 'approved',
          description: 'Pendaftaran disetujui oleh administrator',
          notes: 'Pendaftaran telah memenuhi persyaratan.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-08T15:00:00'
        }
      ],
      participant: participants[8],
      trainingName: 'Pelatihan Kewirausahaan',
      trainingBatch: 'Batch 2 - 2026',
      createdAt: '2026-11-08T08:00:00',
      updatedAt: '2026-11-08T15:00:00'
    },

    // 10. Waitlisted
    {
      id: 10,
      registrationCode: 'REG-2026-010',
      participantId: 10,
      trainingId: 'TRN-2026-005',
      registrationStatus: 'waitlisted',
      registeredAt: '2026-11-09T10:30:00',
      reviewedAt: '2026-11-10T08:30:00',
      reviewedBy: 1,
      reviewedByName: 'Administrator',
      adminNotes: 'Menunggu ketersediaan kuota pelatihan.',
      documents: [
        {
          id: 18,
          documentType: 'KTP',
          documentName: 'Kartu Tanda Penduduk',
          fileName: 'ktp-maya.pdf',
          fileUrl: '/documents/ktp-maya.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-09T10:30:00',
          reviewedAt: '2026-11-10T08:00:00',
          reviewedBy: 1
        },
        {
          id: 19,
          documentType: 'Ijazah',
          documentName: 'Ijazah Terakhir',
          fileName: 'ijazah-maya.pdf',
          fileUrl: '/documents/ijazah-maya.pdf',
          verificationStatus: 'approved',
          uploadedAt: '2026-11-09T10:30:00',
          reviewedAt: '2026-11-10T08:00:00',
          reviewedBy: 1
        }
      ],
      history: [
        {
          id: 1,
          action: 'submitted',
          description: 'Peserta mengirimkan pendaftaran',
          changedBy: 10,
          changedByName: 'Maya Putri',
          changedAt: '2026-11-09T10:30:00'
        },
        {
          id: 2,
          action: 'waitlisted',
          previousStatus: 'pending',
          newStatus: 'waitlisted',
          description: 'Pendaftaran dimasukkan ke daftar tunggu',
          notes: 'Menunggu ketersediaan kuota pelatihan.',
          changedBy: 1,
          changedByName: 'Administrator',
          changedAt: '2026-11-10T08:30:00'
        }
      ],
      participant: participants[9],
      trainingName: 'Pelatihan Administrasi Perkantoran',
      trainingBatch: 'Batch 2 - 2026',
      createdAt: '2026-11-09T10:30:00',
      updatedAt: '2026-11-10T08:30:00'
    }
  ]

  return registrationData
}


const participantData: ParticipantsType[] = [
  {
    id: 1,
    participantCode: 'PRT-2026-001',
    fullName: 'Muhammad Rizky',
    nik: '6371011505010001',
    gender: 'male',
    birthPlace: 'Banjarbaru',
    birthDate: '2001-05-15',
    avatar: '/images/avatars/7.png',
    email: 'rizky@example.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Panglima Batur, Banjarbaru',
    education: 'S1',
    occupation: 'Mahasiswa',
    institution: 'Universitas Lambung Mangkurat',
    verificationStatus: 'verified',
    accountStatus: 'active',
    verifiedAt: '2026-10-05T09:00:00+08:00',
    verificationNotes: '',
    notes: 'Profil peserta telah diverifikasi.',
    createdAt: '2026-10-02T08:30:00+08:00',
    updatedAt: '2026-10-05T09:00:00+08:00'
  },
  {
    id: 2,
    participantCode: 'PRT-2026-002',
    fullName: 'Aulia Putri',
    nik: '6371024508020002',
    gender: 'female',
    birthPlace: 'Banjarmasin',
    birthDate: '2002-08-05',
    avatar: '/images/avatars/10.png',
    email: 'aulia@example.com',
    phone: '+62 813 4567 8901',
    address: 'Jl. Ahmad Yani, Banjarbaru',
    education: 'S1',
    occupation: 'Mahasiswa',
    institution: 'Universitas Islam Kalimantan',
    verificationStatus: 'pending',
    accountStatus: 'active',
    verificationNotes: '',
    notes: 'Menunggu pemeriksaan dokumen identitas.',
    createdAt: '2026-10-03T09:00:00+08:00',
    updatedAt: '2026-10-03T09:00:00+08:00'
  },
  {
    id: 3,
    participantCode: 'PRT-2026-003',
    fullName: 'Fajar Hidayat',
    nik: '6371031203990003',
    gender: 'male',
    birthPlace: 'Martapura',
    birthDate: '1999-03-12',
    avatar: '/images/avatars/8.png',
    email: 'fajar@example.com',
    phone: '+62 812 9876 5432',
    address: 'Jl. Sekumpul, Martapura',
    education: 'SMA/SMK',
    occupation: 'Wirausaha',
    institution: 'Usaha Mandiri',
    verificationStatus: 'verified',
    accountStatus: 'active',
    verifiedAt: '2026-10-06T10:00:00+08:00',
    verificationNotes: '',
    notes: 'Pelaku UMKM bidang kuliner.',
    createdAt: '2026-10-04T10:00:00+08:00',
    updatedAt: '2026-10-06T10:00:00+08:00'
  },
  {
    id: 4,
    participantCode: 'PRT-2026-004',
    fullName: 'Nadia Putri',
    nik: '6371042206010004',
    gender: 'female',
    birthPlace: 'Banjarbaru',
    birthDate: '2001-06-22',
    avatar: '/images/avatars/11.png',
    email: 'nadia@example.com',
    phone: '+62 813 1111 2222',
    address: 'Jl. RO Ulin, Banjarbaru',
    education: 'D3',
    occupation: 'Pencari Kerja',
    institution: 'Politeknik Negeri Banjarmasin',
    verificationStatus: 'pending',
    accountStatus: 'active',
    verificationNotes: '',
    notes: 'Dokumen pendaftaran sedang diperiksa.',
    createdAt: '2026-10-05T11:00:00+08:00',
    updatedAt: '2026-10-05T11:00:00+08:00'
  },
  {
    id: 5,
    participantCode: 'PRT-2026-005',
    fullName: 'Dimas Pratama',
    nik: '6371051001980005',
    gender: 'male',
    birthPlace: 'Banjarmasin',
    birthDate: '1998-01-10',
    avatar: '/images/avatars/9.png',
    email: 'dimas@example.com',
    phone: '+62 812 2222 3333',
    address: 'Jl. Veteran, Banjarmasin',
    education: 'S1',
    occupation: 'Karyawan Swasta',
    institution: 'Perusahaan Swasta',
    verificationStatus: 'verified',
    accountStatus: 'active',
    verifiedAt: '2026-10-08T09:00:00+08:00',
    verificationNotes: '',
    notes: '',
    createdAt: '2026-10-06T08:30:00+08:00',
    updatedAt: '2026-10-08T09:00:00+08:00'
  },
  {
    id: 6,
    participantCode: 'PRT-2026-006',
    fullName: 'Siti Rahmawati',
    nik: '6371061805000006',
    gender: 'female',
    birthPlace: 'Banjarbaru',
    birthDate: '2000-05-18',
    avatar: '/images/avatars/12.png',
    email: 'siti@example.com',
    phone: '+62 813 3333 4444',
    address: 'Jl. A. Yani Km. 35, Banjarbaru',
    education: 'S1',
    occupation: 'Wirausaha',
    institution: 'Usaha Mandiri',
    verificationStatus: 'rejected',
    accountStatus: 'active',
    verificationNotes: 'Dokumen identitas belum memenuhi persyaratan.',
    notes: 'Peserta diminta mengunggah ulang dokumen.',
    createdAt: '2026-10-07T13:00:00+08:00',
    updatedAt: '2026-10-08T09:00:00+08:00'
  },
  {
    id: 7,
    participantCode: 'PRT-2026-007',
    fullName: 'Arif Maulana',
    nik: '6371072502990007',
    gender: 'male',
    birthPlace: 'Pelaihari',
    birthDate: '1999-02-25',
    avatar: '/images/avatars/13.png',
    email: 'arif@example.com',
    phone: '+62 812 4444 5555',
    address: 'Jl. Trikora, Banjarbaru',
    education: 'S1',
    occupation: 'Pencari Kerja',
    institution: 'Universitas Lambung Mangkurat',
    verificationStatus: 'verified',
    accountStatus: 'active',
    verifiedAt: '2026-10-10T09:30:00+08:00',
    verificationNotes: '',
    notes: '',
    createdAt: '2026-10-09T09:30:00+08:00',
    updatedAt: '2026-10-10T09:30:00+08:00'
  },
  {
    id: 8,
    participantCode: 'PRT-2026-008',
    fullName: 'Maya Anindita',
    nik: '6371081403000008',
    gender: 'female',
    birthPlace: 'Banjarbaru',
    birthDate: '2000-03-14',
    avatar: '/images/avatars/14.png',
    email: 'maya@example.com',
    phone: '+62 813 5555 6666',
    address: 'Jl. Mistar Cokrokusumo, Banjarbaru',
    education: 'D3',
    occupation: 'Freelancer',
    institution: 'Politeknik Negeri Banjarmasin',
    verificationStatus: 'verified',
    accountStatus: 'inactive',
    verifiedAt: '2026-10-12T14:00:00+08:00',
    verificationNotes: '',
    notes: 'Akun sementara dinonaktifkan.',
    createdAt: '2026-10-10T10:00:00+08:00',
    updatedAt: '2026-10-15T14:00:00+08:00'
  },
  {
    id: 9,
    participantCode: 'PRT-2026-009',
    fullName: 'Bima Prakoso',
    nik: '6371090901970009',
    gender: 'male',
    birthPlace: 'Banjarbaru',
    birthDate: '1997-01-09',
    avatar: '/images/avatars/15.png',
    email: 'bima@example.com',
    phone: '+62 812 6666 7777',
    address: 'Jl. Karang Anyar, Banjarbaru',
    education: 'SMA/SMK',
    occupation: 'Wirausaha',
    institution: 'Usaha Mandiri',
    verificationStatus: 'pending',
    accountStatus: 'active',
    verificationNotes: '',
    notes: 'Menunggu pemeriksaan data identitas.',
    createdAt: '2026-10-11T14:00:00+08:00',
    updatedAt: '2026-10-11T14:00:00+08:00'
  },
  {
    id: 10,
    participantCode: 'PRT-2026-010',
    fullName: 'Intan Permata',
    nik: '6371101204020010',
    gender: 'female',
    birthPlace: 'Martapura',
    birthDate: '2002-04-12',
    avatar: '/images/avatars/16.png',
    email: 'intan@example.com',
    phone: '+62 813 7777 8888',
    address: 'Jl. Menteri Empat, Martapura',
    education: 'S1',
    occupation: 'Mahasiswa',
    institution: 'Universitas Lambung Mangkurat',
    verificationStatus: 'verified',
    accountStatus: 'active',
    verifiedAt: '2026-10-14T08:00:00+08:00',
    verificationNotes: '',
    notes: '',
    createdAt: '2026-10-12T08:00:00+08:00',
    updatedAt: '2026-10-14T08:00:00+08:00'
  }
]


// Server Action
export const getParticipantData = async () => {
  return participantData
}

const createTraining = (seed: TrainingSeed): TrainingRecord => {
  const published = seed.status !== 'draft'
  const collaborative = seed.collaborative ?? false

  return {
    id: seed.id,
    code: seed.id,
    slug: seed.slug,
    title: seed.title,
    shortDescription: seed.shortDescription,
    description: seed.description,
    cover: `/images/front-pages/landing-page/training-${seed.coverIndex}.jpg`,
    category: seed.category,
    labels: seed.featured ? ['Unggulan', 'Program DISKOP'] : ['Program DISKOP'],
    level: seed.level,
    status: seed.status,

    registration: {
      isOpen: seed.status === 'published',
      openAt: '2026-10-01T08:00:00+08:00',
      closeAt: '2026-11-30T23:59:00+08:00',
      quota: seed.quota,
      registered: seed.registered,
      waitingList: seed.quota > 0 && seed.registered >= seed.quota
    },

    schedule: {
      startDate: seed.startDate,
      endDate: seed.endDate,
      startTime: '08:30',
      endTime: '15:30',
      timezone: 'Asia/Makassar',
      durationHours: 18,
      format: seed.format ?? 'offline',
      venue: seed.format === 'online' ? null : 'Pusat Pelatihan DISKOP',
      address: seed.format === 'online' ? null : 'Banjarbaru, Kalimantan Selatan',
      meetingUrl: seed.format === 'online' ? 'https://example.com/meeting' : null
    },

    speakers: [
      {
        id: `SPK-${seed.id}`,
        name: seed.speakerName,
        position: seed.speakerPosition,
        organization: 'Tim Pelatihan DISKOP',
        avatar: '/images/avatars/1.png',
        bio: `Profil dummy narasumber untuk program ${seed.title}.`,
        expertise: seed.expertise
      }
    ],

    target: {
      employment: seed.employment ?? ['unemployed', 'job-seeker', 'student'],
      education: ['SMA/SMK', 'D3', 'S1'],
      ageMin: 17,
      ageMax: null,
      description: `Program pelatihan bidang ${seed.category.toLowerCase()} untuk masyarakat Banjarbaru dan sekitarnya.`,
      requirements: seed.requirements
    },

    partner: {
      isCollaborative: collaborative,
      companyName: collaborative ? 'Mitra Industri (Dummy)' : null,
      companyLogo: null,
      companyWebsite: null,
      collaborationType: collaborative ? 'Kolaborasi pelatihan' : null,
      description: collaborative ? 'Informasi mitra masih berupa data dummy.' : null
    },

    curriculum: [
      {
        title: 'Pengenalan Materi',
        description: `Memahami konsep dasar ${seed.category.toLowerCase()}.`,
        durationHours: 4
      },
      {
        title: 'Praktik dan Studi Kasus',
        description: `Praktik penerapan materi ${seed.title}.`,
        durationHours: 8
      },
      {
        title: 'Evaluasi dan Proyek',
        description: 'Menyelesaikan latihan dan evaluasi akhir.',
        durationHours: 6
      }
    ],

    skills: seed.skills,
    outcomes: seed.outcomes,
    careerOpportunities: seed.careerOpportunities,

    certificate: {
      available: true,
      issuer: 'Penyelenggara Pelatihan DISKOP',
      requirements: [
        'Mengikuti minimal 80% sesi pelatihan.',
        'Menyelesaikan tugas praktik.',
        'Memenuhi ketentuan evaluasi akhir.'
      ]
    },

    featured: seed.featured ?? false,
    publishedAt: published ? '2026-10-01T08:00:00+08:00' : null,
    createdAt: '2026-09-25T09:00:00+08:00',
    updatedAt: '2026-10-10T14:00:00+08:00'
  }
}

const trainingData: TrainingRecord[] = [
  {
    ...createTraining({
      id: 'TRN-2026-001',
      slug: 'digital-marketing-umkm',
      title: 'Digital Marketing untuk UMKM',
      shortDescription: 'Strategi pemasaran digital untuk memperluas jangkauan pasar dan meningkatkan penjualan.',
      description: 'Pelatihan konten, media sosial, marketplace, dan evaluasi kampanye pemasaran digital.',
      category: 'Digitalisasi',
      level: 'beginner',
      status: 'published',
      coverIndex: 1,
      startDate: '2026-11-02',
      endDate: '2026-11-04',
      quota: 40,
      registered: 28,
      speakerName: 'Ahmad Fauzan',
      speakerPosition: 'Pelatih Teknologi & Digital',
      expertise: ['Digital Marketing', 'Social Media', 'Content Strategy'],
      skills: ['Digital Marketing', 'Social Media', 'Content Planning'],
      outcomes: ['Menyusun strategi pemasaran digital', 'Membuat kalender konten'],
      careerOpportunities: ['Digital Marketing Staff', 'Content Creator', 'Wirausaha Digital'],
      requirements: ['Memiliki smartphone atau laptop', 'Bersedia mengikuti seluruh sesi'],
      featured: true,
      employment: ['unemployed', 'job-seeker', 'entrepreneur', 'student']
    }),
    curriculum: [
      { title: 'Dasar Pemasaran Digital', description: 'Memahami kanal dan strategi pemasaran.', durationHours: 4 },
      { title: 'Konten Media Sosial', description: 'Menyusun kalender dan materi konten.', durationHours: 6 },
      { title: 'Marketplace', description: 'Mengoptimalkan pemasaran produk.', durationHours: 8 }
    ]
  },

  createTraining({
    id: 'TRN-2026-002',
    slug: 'web-development-fundamental',
    title: 'Web Development Fundamental',
    shortDescription: 'Belajar membangun website responsif dengan HTML, CSS, JavaScript, dan Git.',
    description: 'Pelatihan dasar pengembangan web untuk membangun portofolio dan memulai karier teknologi.',
    category: 'Teknologi Informasi',
    level: 'beginner',
    status: 'published',
    coverIndex: 2,
    startDate: '2026-11-09',
    endDate: '2026-11-13',
    quota: 30,
    registered: 19,
    speakerName: 'Rizky Pratama',
    speakerPosition: 'Web Developer',
    expertise: ['HTML', 'CSS', 'JavaScript', 'Git'],
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    outcomes: ['Membangun website responsif', 'Menggunakan Git'],
    careerOpportunities: ['Junior Web Developer', 'Frontend Developer'],
    requirements: ['Mampu menggunakan komputer', 'Membawa laptop'],
    featured: true
  }),

  createTraining({
    id: 'TRN-2026-003',
    slug: 'kesiapan-kerja-digital-office',
    title: 'Kesiapan Kerja dan Digital Office',
    shortDescription: 'Tingkatkan keterampilan administrasi digital dan komunikasi profesional.',
    description: 'Pelatihan dokumen digital, kolaborasi daring, pembuatan CV, dan simulasi wawancara.',
    category: 'Kesiapan Kerja',
    level: 'beginner',
    status: 'draft',
    coverIndex: 3,
    startDate: '2026-11-16',
    endDate: '2026-11-18',
    quota: 35,
    registered: 0,
    speakerName: 'Nadia Putri',
    speakerPosition: 'Fasilitator Pengembangan Karier',
    expertise: ['Digital Office', 'Komunikasi', 'Career Preparation'],
    skills: ['Digital Office', 'Spreadsheet', 'CV Writing'],
    outcomes: ['Membuat CV profesional', 'Mengelola dokumen digital'],
    careerOpportunities: ['Staf Administrasi', 'Data Entry', 'Office Support'],
    requirements: ['Memiliki email aktif', 'Menguasai komputer dasar']
  }),

  createTraining({
    id: 'TRN-2026-004',
    slug: 'digital-transformation-industry',
    title: 'Digital Transformation for Industry',
    shortDescription: 'Pelajari otomasi dan transformasi digital melalui studi kasus industri.',
    description: 'Pengenalan otomasi proses, data operasional, dan solusi digital untuk industri.',
    category: 'Industri dan Teknologi',
    level: 'intermediate',
    status: 'published',
    coverIndex: 4,
    startDate: '2026-11-19',
    endDate: '2026-11-21',
    quota: 25,
    registered: 15,
    speakerName: 'Dimas Saputra',
    speakerPosition: 'Praktisi Teknologi Industri',
    expertise: ['Digital Transformation', 'Automation', 'Operational Data'],
    skills: ['Process Analysis', 'Automation', 'Data Literacy'],
    outcomes: ['Mengidentifikasi peluang otomasi', 'Menyusun solusi digital'],
    careerOpportunities: ['IT Support', 'Junior System Analyst'],
    requirements: ['Memiliki minat pada teknologi industri'],
    featured: true,
    collaborative: true,
    employment: ['job-seeker', 'employed', 'student']
  }),

  createTraining({
    id: 'TRN-2026-005',
    slug: 'desain-grafis-promosi-usaha',
    title: 'Desain Grafis untuk Promosi Usaha',
    shortDescription: 'Buat materi promosi menarik untuk bisnis dan UMKM.',
    description: 'Pelatihan komposisi visual, tipografi, warna, dan desain media sosial.',
    category: 'Kewirausahaan',
    level: 'beginner',
    status: 'published',
    coverIndex: 5,
    startDate: '2026-11-23',
    endDate: '2026-11-25',
    quota: 30,
    registered: 24,
    speakerName: 'Maya Anindita',
    speakerPosition: 'Desainer Grafis',
    expertise: ['Graphic Design', 'Branding', 'Visual Content'],
    skills: ['Desain Grafis', 'Branding', 'Social Media Design'],
    outcomes: ['Membuat desain promosi', 'Menerapkan identitas visual'],
    careerOpportunities: ['Graphic Designer', 'Content Creator', 'Freelance Designer'],
    requirements: ['Membawa smartphone atau laptop'],
    employment: ['unemployed', 'entrepreneur', 'student', 'general']
  }),

  createTraining({
    id: 'TRN-2026-006',
    slug: 'pengelolaan-keuangan-umkm',
    title: 'Pengelolaan Keuangan UMKM',
    shortDescription: 'Pelajari pencatatan transaksi, arus kas, dan laporan keuangan usaha.',
    description: 'Praktik pengelolaan keuangan sederhana untuk pelaku usaha kecil.',
    category: 'Kewirausahaan',
    level: 'beginner',
    status: 'published',
    coverIndex: 6,
    startDate: '2026-11-26',
    endDate: '2026-11-28',
    quota: 40,
    registered: 40,
    speakerName: 'Fajar Hidayat',
    speakerPosition: 'Konsultan Keuangan UMKM',
    expertise: ['Pembukuan', 'Cash Flow', 'Financial Planning'],
    skills: ['Pembukuan', 'Arus Kas', 'Laporan Keuangan'],
    outcomes: ['Mencatat transaksi', 'Menyusun laporan sederhana'],
    careerOpportunities: ['Staf Keuangan', 'Admin Keuangan', 'Wirausaha'],
    requirements: ['Memiliki minat pada pengelolaan usaha'],
    employment: ['entrepreneur', 'employed', 'job-seeker', 'general']
  }),

  createTraining({
    id: 'TRN-2026-007',
    slug: 'cybersecurity-awareness',
    title: 'Cybersecurity Awareness',
    shortDescription: 'Kenali phishing, keamanan akun, dan perlindungan data pribadi.',
    description: 'Pelatihan kesadaran keamanan digital untuk masyarakat dan pekerja.',
    category: 'Teknologi Informasi',
    level: 'beginner',
    status: 'published',
    coverIndex: 1,
    startDate: '2026-12-01',
    endDate: '2026-12-02',
    quota: 35,
    registered: 12,
    speakerName: 'Arif Maulana',
    speakerPosition: 'Instruktur Keamanan Informasi',
    expertise: ['Cybersecurity Awareness', 'Data Protection'],
    skills: ['Keamanan Akun', 'Phishing Awareness', 'Perlindungan Data'],
    outcomes: ['Mengenali phishing', 'Menerapkan keamanan akun'],
    careerOpportunities: ['IT Support', 'Helpdesk', 'Junior Security Analyst'],
    requirements: ['Memiliki perangkat digital'],
    format: 'online'
  }),

  createTraining({
    id: 'TRN-2026-008',
    slug: 'data-analysis-spreadsheet',
    title: 'Data Analysis dengan Spreadsheet',
    shortDescription: 'Olah data untuk menghasilkan laporan dan insight sederhana.',
    description: 'Pelatihan formula, pengolahan data, tabel, grafik, dan laporan.',
    category: 'Teknologi Informasi',
    level: 'intermediate',
    status: 'published',
    coverIndex: 2,
    startDate: '2026-12-03',
    endDate: '2026-12-05',
    quota: 30,
    registered: 17,
    speakerName: 'Siti Rahmawati',
    speakerPosition: 'Data Analyst',
    expertise: ['Data Analysis', 'Spreadsheet', 'Data Visualization'],
    skills: ['Spreadsheet', 'Data Cleaning', 'Data Visualization'],
    outcomes: ['Membersihkan data', 'Membuat laporan analisis'],
    careerOpportunities: ['Data Entry', 'Reporting Staff', 'Junior Data Analyst'],
    requirements: ['Menguasai komputer dasar', 'Membawa laptop']
  }),

  createTraining({
    id: 'TRN-2026-009',
    slug: 'public-speaking-profesional',
    title: 'Public Speaking dan Komunikasi Profesional',
    shortDescription: 'Bangun kepercayaan diri untuk presentasi dan komunikasi kerja.',
    description: 'Latihan menyampaikan pesan, membuat presentasi, dan berbicara profesional.',
    category: 'Kesiapan Kerja',
    level: 'beginner',
    status: 'draft',
    coverIndex: 3,
    startDate: '2026-12-07',
    endDate: '2026-12-08',
    quota: 25,
    registered: 0,
    speakerName: 'Intan Permata',
    speakerPosition: 'Fasilitator Komunikasi',
    expertise: ['Public Speaking', 'Presentation', 'Communication'],
    skills: ['Presentasi', 'Komunikasi', 'Kepercayaan Diri'],
    outcomes: ['Menyampaikan presentasi terstruktur'],
    careerOpportunities: ['Customer Service', 'Public Relations'],
    requirements: ['Bersedia melakukan presentasi singkat']
  }),

  createTraining({
    id: 'TRN-2026-010',
    slug: 'fotografi-produk-umkm',
    title: 'Fotografi Produk untuk UMKM',
    shortDescription: 'Tingkatkan kualitas foto produk dengan pencahayaan dan komposisi.',
    description: 'Praktik fotografi produk untuk katalog, marketplace, dan media sosial.',
    category: 'Digitalisasi',
    level: 'beginner',
    status: 'published',
    coverIndex: 4,
    startDate: '2026-12-09',
    endDate: '2026-12-11',
    quota: 30,
    registered: 21,
    speakerName: 'Bima Prakoso',
    speakerPosition: 'Fotografer Produk',
    expertise: ['Product Photography', 'Lighting', 'Photo Editing'],
    skills: ['Fotografi Produk', 'Komposisi', 'Editing Foto'],
    outcomes: ['Menghasilkan foto produk', 'Menyiapkan katalog digital'],
    careerOpportunities: ['Product Photographer', 'Content Creator'],
    requirements: ['Membawa smartphone atau kamera', 'Membawa sampel produk']
  }),

  createTraining({
    id: 'TRN-2026-011',
    slug: 'dasar-cloud-computing',
    title: 'Dasar Cloud Computing',
    shortDescription: 'Kenali layanan cloud, deployment, dan infrastruktur komputasi.',
    description: 'Pengenalan model layanan cloud, deployment, dan keamanan dasar.',
    category: 'Teknologi Informasi',
    level: 'intermediate',
    status: 'published',
    coverIndex: 5,
    startDate: '2026-12-14',
    endDate: '2026-12-16',
    quota: 25,
    registered: 8,
    speakerName: 'Yoga Firmansyah',
    speakerPosition: 'Cloud Infrastructure Engineer',
    expertise: ['Cloud Computing', 'Infrastructure', 'Deployment'],
    skills: ['Cloud Fundamentals', 'Deployment', 'Infrastructure'],
    outcomes: ['Memahami model cloud', 'Menjelaskan deployment dasar'],
    careerOpportunities: ['IT Support', 'Cloud Support Associate'],
    requirements: ['Menguasai penggunaan komputer', 'Memiliki email aktif']
  }),

  createTraining({
    id: 'TRN-2026-012',
    slug: 'kewirausahaan-validasi-ide-bisnis',
    title: 'Kewirausahaan dan Validasi Ide Bisnis',
    shortDescription: 'Uji ide usaha dan susun model bisnis awal.',
    description: 'Pelatihan validasi kebutuhan pelanggan, proposisi nilai, dan rencana bisnis.',
    category: 'Kewirausahaan',
    level: 'beginner',
    status: 'completed',
    coverIndex: 6,
    startDate: '2026-09-15',
    endDate: '2026-09-17',
    quota: 30,
    registered: 30,
    speakerName: 'Dewi Kartika',
    speakerPosition: 'Pendamping Kewirausahaan',
    expertise: ['Business Model', 'Customer Discovery', 'Entrepreneurship'],
    skills: ['Business Planning', 'Customer Research', 'Value Proposition'],
    outcomes: ['Menyusun model bisnis', 'Memvalidasi ide usaha'],
    careerOpportunities: ['Wirausaha', 'Business Development'],
    requirements: ['Memiliki ide usaha atau minat berwirausaha'],
    employment: ['entrepreneur', 'unemployed', 'student', 'general']
  })
]

export const getTrainingData = async () => ({
  trainings: trainingData
})



// Detail data berdasarkan ID atau slug
export const getTrainingDetail = async (identifier: string) => {
  const training = trainingData.find(
    item => item.id === identifier || item.slug === identifier
  )

  return training ?? null
}

const instructorData: InstructorCardType[] = [
  {
    id: 1,
    name: 'Ahmad Fauzan',
    username: '@ahmad.fauzan',
    avatar: '/images/avatars/1.png',
    position: 'Pelatih Teknologi & Digital',
    description:
      'Pelatih dengan fokus pada pengembangan kompetensi digital, pemrograman, pengembangan aplikasi web, dan transformasi teknologi.',
    rating: 4.9,
    totalReviews: 128,
    totalTrainings: 24,
    totalParticipants: 386,
    status: 'active',
    expertise: [
      {
        title: 'Programming',
        color: 'primary'
      },
      {
        title: 'Laravel',
        color: 'success'
      },
      {
        title: 'Web Development',
        color: 'info'
      },
      {
        title: 'Database',
        color: 'warning'
      }
    ],
    participants: [
      {
        name: 'Muhammad Rizki',
        avatar: '/images/avatars/7.png'
      },
      {
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/8.png'
      },
      {
        name: 'Dimas Pratama',
        avatar: '/images/avatars/9.png'
      }
    ]
  },

  {
    id: 2,
    name: 'Siti Rahma',
    username: '@siti.rahma',
    avatar: '/images/avatars/2.png',
    position: 'Pelatih Kewirausahaan',
    description:
      'Berfokus pada pengembangan kewirausahaan, pengelolaan usaha, strategi bisnis, dan pengembangan kapasitas pelaku UMKM.',
    rating: 4.8,
    totalReviews: 96,
    totalTrainings: 18,
    totalParticipants: 312,
    status: 'active',
    expertise: [
      {
        title: 'Kewirausahaan',
        color: 'success'
      },
      {
        title: 'UMKM',
        color: 'warning'
      },
      {
        title: 'Business Planning',
        color: 'primary'
      },
      {
        title: 'Manajemen',
        color: 'info'
      }
    ],
    participants: [
      {
        name: 'Aulia Putri',
        avatar: '/images/avatars/10.png'
      },
      {
        name: 'Nanda Saputra',
        avatar: '/images/avatars/11.png'
      },
      {
        name: 'Rina Amelia',
        avatar: '/images/avatars/12.png'
      }
    ]
  }
]

export const getInstructorData = async () => {
  return instructorData
}



const employeeData: EmployeeRecord[] = [
  {
    id: 1,
    employeeId: 'PGW-0001',
    name: 'Ahmad Fauzan',
    username: 'ahmad.fauzan',
    email: 'ahmad.fauzan@example.com',
    phone: '+62 812 3456 7890',
    avatar: '/images/avatars/1.png',
    nip: '199001012020011001',
    nik: '6371010101900001',
    position: 'Administrator Pelatihan',
    employeeType: 'internal',
    status: 'Aktif',
    employmentStartDate: '2020-01-01',
    employmentEndDate: null,

    birthPlace: 'Banjarmasin',
    birthDate: '1990-01-01',
    gender: 'Laki-laki',
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: 'Jl. Ahmad Yani',
    village: null,
    district: null,
    city: 'Banjarmasin',
    province: 'Kalimantan Selatan',
    postalCode: null,

    education: 'S1',
    institution: 'Universitas Lambung Mangkurat',
    graduationYear: null,
    fieldOfStudy: 'Administrasi Publik',

    employeeNumber: 'EMP-0001',
    departmentId: 1,
    departmentName: 'Bidang Pelatihan',
    supervisorId: null,
    supervisorName: null,
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: '2026-10-04T09:12:00+08:00',
    passwordChangedAt: null,

    createdAt: '2020-01-01T08:00:00+08:00',
    updatedAt: '2026-10-04T09:26:00+08:00'
  },
  {
    id: 2,
    employeeId: 'PGW-0002',
    name: 'Siti Rahma',
    username: 'siti.rahma',
    email: 'siti.rahma@example.com',
    phone: '+62 813 4567 8901',
    avatar: '/images/avatars/2.png',
    nip: '199202022021012002',
    nik: '6371020202920002',
    position: 'Staf Administrasi',
    employeeType: 'internal',
    status: 'Aktif',
    employmentStartDate: '2021-01-01',
    employmentEndDate: null,

    birthPlace: 'Banjarbaru',
    birthDate: '1992-02-02',
    gender: 'Perempuan',
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: 'Jl. Panglima Batur',
    village: null,
    district: null,
    city: 'Banjarbaru',
    province: 'Kalimantan Selatan',
    postalCode: null,

    education: 'S1',
    institution: 'Universitas Islam Kalimantan',
    graduationYear: null,
    fieldOfStudy: 'Administrasi',

    employeeNumber: 'EMP-0002',
    departmentId: 2,
    departmentName: 'Bagian Administrasi',
    supervisorId: 1,
    supervisorName: 'Ahmad Fauzan',
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2021-01-01T08:00:00+08:00',
    updatedAt: '2026-10-03T10:00:00+08:00'
  },
  {
    id: 21,
    employeeId: 'KTR-0021',
    name: 'Rizky Kurniawan',
    username: 'rizky.kurniawan',
    email: 'rizky.kurniawan@example.com',
    phone: '+62 812 3456 7890',
    avatar: null,
    nip: null,
    nik: null,
    position: 'Tenaga Administrasi',
    employeeType: 'contract',
    status: 'Aktif',
    employmentStartDate: '2026-01-01',
    employmentEndDate: '2026-12-31',

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: 'S1',
    institution: 'Universitas Lambung Mangkurat',
    graduationYear: null,
    fieldOfStudy: null,

    employeeNumber: 'EMP-0021',
    departmentId: 2,
    departmentName: 'Bagian Administrasi',
    supervisorId: 1,
    supervisorName: 'Ahmad Fauzan',
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-01-01T08:00:00+08:00',
    updatedAt: '2026-10-01T08:00:00+08:00'
  },
  {
    id: 22,
    employeeId: 'KTR-0022',
    name: 'Melati Safitri',
    username: 'melati.safitri',
    email: 'melati.safitri@example.com',
    phone: '+62 813 9876 5432',
    avatar: null,
    nip: null,
    nik: null,
    position: 'Tenaga Pendukung Pelatihan',
    employeeType: 'contract',
    status: 'Aktif',
    employmentStartDate: '2025-11-01',
    employmentEndDate: '2026-10-31',

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: 'D3',
    institution: 'Politeknik Negeri Banjarmasin',
    graduationYear: null,
    fieldOfStudy: null,

    employeeNumber: 'EMP-0022',
    departmentId: 1,
    departmentName: 'Bidang Pelatihan',
    supervisorId: 1,
    supervisorName: 'Ahmad Fauzan',
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2025-11-01T08:00:00+08:00',
    updatedAt: '2026-10-01T08:00:00+08:00'
  },
  {
    id: 23,
    employeeId: 'KTR-0023',
    name: 'Doni Saputra',
    username: 'doni.saputra',
    email: 'doni.saputra@example.com',
    phone: null,
    avatar: null,
    nip: null,
    nik: null,
    position: 'Staf Dukungan Teknis',
    employeeType: 'contract',
    status: 'Aktif',
    employmentStartDate: '2026-06-01',
    employmentEndDate: '2026-12-01',

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: 'SMK',
    institution: null,
    graduationYear: null,
    fieldOfStudy: 'Teknologi Informasi',

    employeeNumber: 'EMP-0023',
    departmentId: 3,
    departmentName: 'Bagian Teknologi Informasi',
    supervisorId: null,
    supervisorName: null,
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-06-01T08:00:00+08:00',
    updatedAt: '2026-10-01T08:00:00+08:00'
  },
  {
    id: 24,
    employeeId: 'MAG-0024',
    name: 'Citra Maharani',
    username: 'citra.maharani',
    email: 'citra.maharani@example.com',
    phone: '+62 812 7654 3210',
    avatar: null,
    nip: null,
    nik: null,
    position: 'Peserta Magang Administrasi',
    employeeType: 'internship',
    status: 'Aktif',
    employmentStartDate: '2026-10-01',
    employmentEndDate: '2026-12-31',

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: 'S1',
    institution: 'Universitas Islam Kalimantan',
    graduationYear: null,
    fieldOfStudy: 'Administrasi',

    employeeNumber: 'EMP-0024',
    departmentId: 2,
    departmentName: 'Bagian Administrasi',
    supervisorId: 2,
    supervisorName: 'Siti Rahma',
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-10-01T08:00:00+08:00',
    updatedAt: '2026-10-01T08:00:00+08:00'
  },
  {
    id: 25,
    employeeId: 'MAG-0025',
    name: 'Bagas Pratama',
    username: 'bagas.pratama',
    email: 'bagas.pratama@example.com',
    phone: '+62 813 2468 1357',
    avatar: null,
    nip: null,
    nik: null,
    position: 'Peserta Magang Teknologi Informasi',
    employeeType: 'internship',
    status: 'Aktif',
    employmentStartDate: '2026-09-01',
    employmentEndDate: '2026-11-30',

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: 'S1',
    institution: 'Universitas Lambung Mangkurat',
    graduationYear: null,
    fieldOfStudy: 'Teknologi Informasi',

    employeeNumber: 'EMP-0025',
    departmentId: 3,
    departmentName: 'Bagian Teknologi Informasi',
    supervisorId: null,
    supervisorName: null,
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-09-01T08:00:00+08:00',
    updatedAt: '2026-10-01T08:00:00+08:00'
  },
  {
    id: 26,
    employeeId: 'MAG-0026',
    name: 'Nabila Putri',
    username: 'nabila.putri',
    email: 'nabila.putri@example.com',
    phone: null,
    avatar: null,
    nip: null,
    nik: null,
    position: 'Peserta Magang Komunikasi',
    employeeType: 'internship',
    status: 'Nonaktif',
    employmentStartDate: '2026-08-01',
    employmentEndDate: '2026-10-01',

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: 'D3',
    institution: 'Politeknik Negeri Banjarmasin',
    graduationYear: null,
    fieldOfStudy: 'Komunikasi',

    employeeNumber: 'EMP-0026',
    departmentId: 4,
    departmentName: 'Bagian Komunikasi',
    supervisorId: null,
    supervisorName: null,
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-08-01T08:00:00+08:00',
    updatedAt: '2026-10-01T08:00:00+08:00'
  },
  {
    id: 27,
    employeeId: 'KTR-0027',
    name: 'Aditya Prakoso',
    username: 'aditya.prakoso',
    email: 'aditya.prakoso@example.com',
    phone: '+62 812 1111 2222',
    avatar: null,
    nip: null,
    nik: null,
    position: 'Tenaga Pendukung',
    employeeType: 'contract',
    status: 'Menunggu Aktivasi',
    employmentStartDate: null,
    employmentEndDate: null,

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: null,
    institution: null,
    graduationYear: null,
    fieldOfStudy: null,

    employeeNumber: 'EMP-0027',
    departmentId: null,
    departmentName: null,
    supervisorId: null,
    supervisorName: null,
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-10-10T08:00:00+08:00',
    updatedAt: '2026-10-10T08:00:00+08:00'
  },
  {
    id: 28,
    employeeId: 'MAG-0028',
    name: 'Salsa Aprilia',
    username: 'salsa.aprilia',
    email: null,
    phone: null,
    avatar: null,
    nip: null,
    nik: null,
    position: null,
    employeeType: 'internship',
    status: 'Menunggu Aktivasi',
    employmentStartDate: null,
    employmentEndDate: null,

    birthPlace: null,
    birthDate: null,
    gender: null,
    religion: null,
    maritalStatus: null,
    nationality: 'Indonesia',

    address: null,
    village: null,
    district: null,
    city: null,
    province: null,
    postalCode: null,

    education: null,
    institution: null,
    graduationYear: null,
    fieldOfStudy: null,

    employeeNumber: 'EMP-0028',
    departmentId: null,
    departmentName: null,
    supervisorId: null,
    supervisorName: null,
    notes: null,

    emailVerifiedAt: null,
    lastLoginAt: null,
    passwordChangedAt: null,

    createdAt: '2026-10-10T08:00:00+08:00',
    updatedAt: '2026-10-10T08:00:00+08:00'
  }
]

// Server Actions
export const getEmployeeData = async () => {
  return {
    employees: employeeData
  }
}

export const getEcommerceData = async () => {
  return eCommerceData
}

export const getAcademyData = async () => {
  return academyData
}

export const getLogisticsData = async () => {
  return vehicleData
}

export const getInvoiceData = async () => {
  return invoiceData
}

export const getUserData = async () => {
  return userData
}

export const getPermissionsData = async () => {
  return permissionData
}

export const getProfileData = async () => {
  return profileData
}

export const getFaqData = async () => {
  return faqData
}

export const getPricingData = async () => {
  return pricingData
}

export const getStatisticsData = async () => {
  return statisticsData
}

'use client'

import { useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

import type { TrainingRecord } from '@/types/admin/trainingTypes'

type Props = {
  data?: TrainingRecord
}

type ApplicantStatus = 'pending' | 'approved' | 'rejected' | 'waiting' | 'revision'
type DocumentStatus = 'pending' | 'verified' | 'invalid' | 'missing'
type AttendanceStatus = 'registered' | 'confirmed' | 'attended' | 'absent'

type ApplicantDocument = {
  id: string
  name: string
  description: string
  fileName: string
  status: DocumentStatus
}

type Applicant = {
  id: string
  avatar: string
  name: string
  nik: string
  birthPlace: string
  birthDate: string
  gender: string
  email: string
  phone: string
  address: string
  education: string
  employmentStatus: string
  occupation: string
  organization: string
  motivation: string
  goals: string
  registeredAt: string
  status: ApplicantStatus
  reviewer: string
  reviewedAt: string
  decisionNote: string
  documents: ApplicantDocument[]
}

type Participant = {
  id: string
  applicantId: string
  avatar: string
  name: string
  email: string
  phone: string
  occupation: string
  organization: string
  approvedAt: string
  reviewer: string
  attendance: AttendanceStatus
}

const statusConfig: Record<ApplicantStatus, {
  label: string
  color: 'warning' | 'success' | 'error' | 'info'
}> = {
  pending: { label: 'Menunggu keputusan', color: 'warning' },
  approved: { label: 'Lolos seleksi', color: 'success' },
  rejected: { label: 'Ditolak', color: 'error' },
  waiting: { label: 'Daftar tunggu', color: 'info' },
  revision: { label: 'Perlu perbaikan', color: 'warning' }
}

const documentConfig: Record<DocumentStatus, {
  label: string
  color: 'warning' | 'success' | 'error' | 'info'
}> = {
  pending: { label: 'Belum diperiksa', color: 'info' },
  verified: { label: 'Terverifikasi', color: 'success' },
  invalid: { label: 'Tidak valid', color: 'error' },
  missing: { label: 'Belum diunggah', color: 'warning' }
}

const attendanceConfig: Record<AttendanceStatus, {
  label: string
  color: 'info' | 'success' | 'warning' | 'error'
}> = {
  registered: { label: 'Terdaftar', color: 'info' },
  confirmed: { label: 'Terkonfirmasi', color: 'success' },
  attended: { label: 'Hadir', color: 'success' },
  absent: { label: 'Tidak hadir', color: 'error' }
}

const makeDocuments = (incomplete = false): ApplicantDocument[] => [
  {
    id: 'ktp',
    name: 'Kartu Tanda Penduduk',
    description: 'Validasi identitas dan data kependudukan',
    fileName: 'KTP_pendaftar.pdf',
    status: 'pending'
  },
  {
    id: 'profile',
    name: 'Profil pendaftar',
    description: 'Informasi pribadi, kontak, dan pekerjaan',
    fileName: 'Profil_pendaftar.pdf',
    status: 'pending'
  },
  {
    id: 'statement',
    name: 'Surat pernyataan',
    description: 'Pernyataan kesediaan mengikuti pelatihan',
    fileName: incomplete ? 'Belum diunggah' : 'Surat_pernyataan.pdf',
    status: incomplete ? 'missing' : 'pending'
  },
  {
    id: 'supporting',
    name: 'Dokumen pendukung',
    description: 'Bukti pekerjaan atau usaha jika dipersyaratkan',
    fileName: 'Dokumen_pendukung.pdf',
    status: 'pending'
  }
]

const initialApplicants: Applicant[] = [
  {
    id: 'REG-2026-001',
    avatar: 'https://i.pravatar.cc/160?img=12',
    name: 'Aditya Pratama',
    nik: '6372011504990001',
    birthPlace: 'Banjarbaru',
    birthDate: '1999-04-15',
    gender: 'Laki-laki',
    email: 'aditya@example.com',
    phone: '081234567801',
    address: 'Banjarbaru, Kalimantan Selatan',
    education: 'S1',
    employmentStatus: 'Wirausaha',
    occupation: 'Pemilik usaha kuliner',
    organization: 'UMKM Aditya Food',
    motivation: 'Ingin memperluas pasar dan meningkatkan penjualan melalui pemasaran digital.',
    goals: 'Menerapkan strategi pemasaran digital untuk meningkatkan jangkauan pelanggan.',
    registeredAt: '2026-10-01',
    status: 'approved',
    reviewer: 'Siti Rahmawati',
    reviewedAt: '2026-10-02',
    decisionNote: 'Data sesuai dan persyaratan administrasi telah diperiksa.',
    documents: makeDocuments().map(doc => ({ ...doc, status: 'verified' }))
  },
  {
    id: 'REG-2026-002',
    avatar: 'https://i.pravatar.cc/160?img=47',
    name: 'Nadia Putri',
    nik: '6372022201050002',
    birthPlace: 'Banjarmasin',
    birthDate: '2005-01-22',
    gender: 'Perempuan',
    email: 'nadia@example.com',
    phone: '081234567802',
    address: 'Banjarbaru, Kalimantan Selatan',
    education: 'SMK',
    employmentStatus: 'Belum bekerja',
    occupation: 'Pencari kerja',
    organization: '-',
    motivation: 'Ingin memperoleh keterampilan pemasaran digital sebagai bekal memasuki dunia kerja.',
    goals: 'Membangun portofolio pemasaran digital dan meningkatkan kompetensi profesional.',
    registeredAt: '2026-10-02',
    status: 'pending',
    reviewer: '',
    reviewedAt: '',
    decisionNote: '',
    documents: makeDocuments()
  },
  {
    id: 'REG-2026-003',
    avatar: 'https://i.pravatar.cc/160?img=11',
    name: 'Rizky Ramadhan',
    nik: '6372031201980003',
    birthPlace: 'Martapura',
    birthDate: '1998-01-12',
    gender: 'Laki-laki',
    email: 'rizky@example.com',
    phone: '081234567803',
    address: 'Martapura, Kalimantan Selatan',
    education: 'S1',
    employmentStatus: 'Bekerja',
    occupation: 'Staf administrasi',
    organization: 'Dinas Koperasi dan UKM',
    motivation: 'Meningkatkan kemampuan promosi digital untuk mendukung pendampingan UMKM.',
    goals: 'Menerapkan strategi digital dalam program pendampingan usaha.',
    registeredAt: '2026-10-03',
    status: 'approved',
    reviewer: 'Siti Rahmawati',
    reviewedAt: '2026-10-04',
    decisionNote: 'Persyaratan administrasi terpenuhi.',
    documents: makeDocuments().map(doc => ({ ...doc, status: 'verified' }))
  },
  {
    id: 'REG-2026-004',
    avatar: 'https://i.pravatar.cc/160?img=44',
    name: 'Siti Rahmawati',
    nik: '6372041202000004',
    birthPlace: 'Banjarbaru',
    birthDate: '2000-02-12',
    gender: 'Perempuan',
    email: 'siti@example.com',
    phone: '081234567804',
    address: 'Landasan Ulin, Banjarbaru',
    education: 'SMA',
    employmentStatus: 'Wirausaha',
    occupation: 'Pemilik usaha kerajinan',
    organization: 'Kerajinan Siti',
    motivation: 'Ingin memasarkan produk kerajinan ke luar daerah.',
    goals: 'Membuka kanal pemasaran digital dan meningkatkan penjualan.',
    registeredAt: '2026-10-04',
    status: 'pending',
    reviewer: '',
    reviewedAt: '',
    decisionNote: '',
    documents: makeDocuments(true)
  },
  {
    id: 'REG-2026-005',
    avatar: 'https://i.pravatar.cc/160?img=13',
    name: 'Muhammad Fajar',
    nik: '6372050301970005',
    birthPlace: 'Banjarmasin',
    birthDate: '1997-01-03',
    gender: 'Laki-laki',
    email: 'fajar@example.com',
    phone: '081234567805',
    address: 'Banjarmasin, Kalimantan Selatan',
    education: 'S1',
    employmentStatus: 'Bekerja',
    occupation: 'Staf pemasaran',
    organization: 'Koperasi Sejahtera',
    motivation: 'Memperdalam strategi pemasaran dan analisis performa kampanye.',
    goals: 'Mengoptimalkan promosi produk koperasi melalui media digital.',
    registeredAt: '2026-10-05',
    status: 'waiting',
    reviewer: 'Siti Rahmawati',
    reviewedAt: '2026-10-06',
    decisionNote: 'Memenuhi persyaratan dan masuk daftar tunggu karena kuota.',
    documents: makeDocuments().map(doc => ({ ...doc, status: 'verified' }))
  },
  {
    id: 'REG-2026-006',
    avatar: 'https://i.pravatar.cc/160?img=49',
    name: 'Dewi Anggraini',
    nik: '6372060901960006',
    birthPlace: 'Banjarbaru',
    birthDate: '1996-01-09',
    gender: 'Perempuan',
    email: 'dewi@example.com',
    phone: '081234567806',
    address: 'Banjarbaru, Kalimantan Selatan',
    education: 'D3',
    employmentStatus: 'Bekerja',
    occupation: 'Pengelola koperasi',
    organization: 'Koperasi Sejahtera',
    motivation: 'Meningkatkan efektivitas promosi koperasi.',
    goals: 'Membuat strategi promosi yang terukur.',
    registeredAt: '2026-10-06',
    status: 'rejected',
    reviewer: 'Budi Santoso',
    reviewedAt: '2026-10-07',
    decisionNote: 'Data identitas pada formulir tidak sesuai dengan dokumen yang diunggah.',
    documents: makeDocuments().map(doc => ({ ...doc, status: 'verified' }))
  },
  {
    id: 'REG-2026-007',
    avatar: 'https://i.pravatar.cc/160?img=14',
    name: 'Andi Saputra',
    nik: '6372071102010007',
    birthPlace: 'Martapura',
    birthDate: '2001-02-11',
    gender: 'Laki-laki',
    email: 'andi@example.com',
    phone: '081234567807',
    address: 'Martapura, Kalimantan Selatan',
    education: 'SMA',
    employmentStatus: 'Belum bekerja',
    occupation: 'Pencari kerja',
    organization: '-',
    motivation: 'Mempelajari pemasaran digital untuk meningkatkan peluang kerja.',
    goals: 'Membangun portofolio digital marketing.',
    registeredAt: '2026-10-07',
    status: 'pending',
    reviewer: '',
    reviewedAt: '',
    decisionNote: '',
    documents: makeDocuments()
  },
  {
    id: 'REG-2026-008',
    avatar: 'https://i.pravatar.cc/160?img=45',
    name: 'Putri Amelia',
    nik: '6372081402990008',
    birthPlace: 'Banjarbaru',
    birthDate: '1999-02-14',
    gender: 'Perempuan',
    email: 'putri@example.com',
    phone: '081234567808',
    address: 'Banjarbaru, Kalimantan Selatan',
    education: 'S1',
    employmentStatus: 'Wirausaha',
    occupation: 'Pemilik toko daring',
    organization: 'Putri Store',
    motivation: 'Memperluas pasar toko daring melalui strategi pemasaran.',
    goals: 'Meningkatkan jangkauan dan konversi penjualan.',
    registeredAt: '2026-10-08',
    status: 'approved',
    reviewer: 'Budi Santoso',
    reviewedAt: '2026-10-09',
    decisionNote: 'Profil dan persyaratan administrasi telah diverifikasi.',
    documents: makeDocuments().map(doc => ({ ...doc, status: 'verified' }))
  },
  {
    id: 'REG-2026-009',
    avatar: 'https://i.pravatar.cc/160?img=15',
    name: 'Fauzan Akbar',
    nik: '6372090101980009',
    birthPlace: 'Banjarmasin',
    birthDate: '1998-01-01',
    gender: 'Laki-laki',
    email: 'fauzan@example.com',
    phone: '081234567809',
    address: 'Banjarbaru, Kalimantan Selatan',
    education: 'SMA',
    employmentStatus: 'Wirausaha',
    occupation: 'Pemilik usaha minuman',
    organization: 'Fauzan Beverage',
    motivation: 'Belajar membuat promosi yang lebih terarah.',
    goals: 'Mengembangkan penjualan melalui media sosial.',
    registeredAt: '2026-10-09',
    status: 'pending',
    reviewer: '',
    reviewedAt: '',
    decisionNote: '',
    documents: makeDocuments()
  },
  {
    id: 'REG-2026-010',
    avatar: 'https://i.pravatar.cc/160?img=46',
    name: 'Maya Safitri',
    nik: '6372101202970010',
    birthPlace: 'Banjarbaru',
    birthDate: '1997-02-12',
    gender: 'Perempuan',
    email: 'maya@example.com',
    phone: '081234567810',
    address: 'Banjarbaru, Kalimantan Selatan',
    education: 'D3',
    employmentStatus: 'Bekerja',
    occupation: 'Pengelola koperasi',
    organization: 'Koperasi Mandiri',
    motivation: 'Mengembangkan strategi pemasaran digital untuk produk anggota koperasi.',
    goals: 'Meningkatkan pemasaran produk anggota melalui kanal digital.',
    registeredAt: '2026-10-10',
    status: 'waiting',
    reviewer: 'Budi Santoso',
    reviewedAt: '2026-10-10',
    decisionNote: 'Memenuhi persyaratan dan masuk daftar tunggu sesuai kapasitas program.',
    documents: makeDocuments().map(doc => ({ ...doc, status: 'verified' }))
  }
]

const initialParticipants: Participant[] = initialApplicants
  .filter(item => item.status === 'approved')
  .map((item, index) => ({
    id: `PST-2026-${String(index + 1).padStart(3, '0')}`,
    applicantId: item.id,
    avatar: item.avatar,
    name: item.name,
    email: item.email,
    phone: item.phone,
    occupation: item.occupation,
    organization: item.organization,
    approvedAt: item.reviewedAt,
    reviewer: item.reviewer,
    attendance: index === 1 ? 'registered' : 'confirmed'
  }))

const formatDate = (value: string) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`))
}

const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return 0

  const birth = new Date(`${dateOfBirth}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--
  }

  return age
}

const StatCard = ({
                    label,
                    value,
                    hint,
                    icon,
                    color
                  }: {
  label: string
  value: number
  hint: string
  icon: string
  color: string
}) => (
  <Card variant='outlined' className='h-full transition-shadow hover:shadow-sm'>
    <CardContent className='flex items-start justify-between gap-3 p-5'>
      <Box className='min-w-0'>
        <Typography variant='body2' color='text.secondary'>{label}</Typography>
        <Typography variant='h4' className='mt-2 font-semibold tracking-tight'>{value}</Typography>
        <Typography variant='caption' color='text.secondary' className='mt-1 block'>{hint}</Typography>
      </Box>
      <Box className={`flex bs-12 is-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <i className={`${icon} text-[26px]`} />
      </Box>
    </CardContent>
  </Card>
)

const ActionIcon = ({
                      title,
                      icon,
                      onClick,
                      color = 'default',
                      disabled = false
                    }: {
  title: string
  icon: string
  onClick: () => void
  color?: 'default' | 'primary' | 'success' | 'error' | 'warning'
  disabled?: boolean
}) => (
  <Tooltip title={title} arrow>
    <span>
      <IconButton
        size='small'
        color={color}
        disabled={disabled}
        onClick={onClick}
        aria-label={title}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          width: 34,
          height: 34
        }}
      >
        <i className={`${icon} text-[19px]`} />
      </IconButton>
    </span>
  </Tooltip>
)

const Field = ({
                 label,
                 value,
                 icon
               }: {
  label: string
  value: string
  icon?: string
}) => (
  <Box className='min-w-0'>
    <Typography variant='caption' color='text.secondary'>{label}</Typography>
    <Box className='mt-1 flex items-start gap-2'>
      {icon && <i className={`${icon} mt-0.5 text-[18px] text-textSecondary`} />}
      <Typography variant='body2' className='break-words font-medium'>{value || '—'}</Typography>
    </Box>
  </Box>
)

const ParticipantsTab = ({ data }: Props) => {
  const title = data?.title || 'Digital Marketing untuk Pengembangan UMKM'
  const slug = data?.slug || data?.id || 'digital-marketing-umkm'

  const [workspace, setWorkspace] = useState<'applications' | 'participants'>('applications')
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [participantSearch, setParticipantSearch] = useState('')
  const [participantFilter, setParticipantFilter] = useState('all')
  const [participantPage, setParticipantPage] = useState(0)
  const [participantRows, setParticipantRows] = useState(5)

  const [profile, setProfile] = useState<Applicant | null>(null)
  const [editProfile, setEditProfile] = useState(false)
  const [decision, setDecision] = useState<'reject' | 'revision' | 'waiting' | null>(null)
  const [decisionNote, setDecisionNote] = useState('')
  const [reviewer, setReviewer] = useState('Siti Rahmawati')
  const [error, setError] = useState('')
  const [participantProfile, setParticipantProfile] = useState<Participant | null>(null)
  const [editForm, setEditForm] = useState<Applicant | null>(null)

  const stats = useMemo(() => ({
    total: applicants.length,
    pending: applicants.filter(item => item.status === 'pending').length,
    incomplete: applicants.filter(item =>
      item.documents.some(doc => doc.status === 'missing' || doc.status === 'invalid')
    ).length,
    approved: applicants.filter(item => item.status === 'approved').length
  }), [applicants])

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applicants.filter(item => {
      const matches =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.occupation.toLowerCase().includes(query)

      return matches && (filter === 'all' || item.status === filter)
    })
  }, [applicants, search, filter])

  const filteredParticipants = useMemo(() => {
    const query = participantSearch.trim().toLowerCase()

    return participants.filter(item => {
      const matches =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.occupation.toLowerCase().includes(query)

      return matches && (participantFilter === 'all' || item.attendance === participantFilter)
    })
  }, [participants, participantSearch, participantFilter])

  const visibleApplicants = filteredApplicants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const visibleParticipants = filteredParticipants.slice(participantPage * participantRows, participantPage * participantRows + participantRows)

  const openProfile = (item: Applicant, edit = false) => {
    setProfile(item)
    setEditForm({ ...item, documents: item.documents.map(doc => ({ ...doc })) })
    setEditProfile(edit)
    setReviewer(item.reviewer || 'Siti Rahmawati')
    setDecisionNote(item.decisionNote || '')
    setDecision(null)
    setError('')
  }

  const updateDocument = (id: string, status: DocumentStatus) => {
    if (!editForm) return

    setEditForm(current => current ? {
      ...current,
      documents: current.documents.map(doc => doc.id === id ? { ...doc, status } : doc)
    } : current)
  }

  const syncParticipantProfile = (updated: Applicant) => {
    setParticipants(current => current.map(item =>
      item.applicantId === updated.id
        ? {
          ...item,
          avatar: updated.avatar,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          occupation: updated.occupation,
          organization: updated.organization
        }
        : item
    ))
  }

  const saveProfile = () => {
    if (!editForm) return

    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      setError('Nama, email, dan nomor telepon wajib diisi.')
      return
    }

    setApplicants(current => current.map(item => item.id === editForm.id ? editForm : item))
    syncParticipantProfile(editForm)
    setProfile(editForm)
    setEditProfile(false)
    setError('')
  }

  const applyDecision = (status: Exclude<ApplicantStatus, 'pending'>) => {
    if (!profile || !editForm) return

    if (!reviewer.trim()) {
      setError('Nama pegawai yang mengambil keputusan wajib diisi.')
      return
    }

    if (status === 'approved' && editForm.documents.some(doc => doc.status !== 'verified')) {
      setError('Verifikasi semua dokumen sebelum meloloskan pendaftar.')
      return
    }

    if (status !== 'approved' && !decisionNote.trim()) {
      setError('Catatan keputusan wajib diisi.')
      return
    }

    const today = new Date().toISOString().slice(0, 10)

    const updated: Applicant = {
      ...editForm,
      status,
      reviewer: reviewer.trim(),
      reviewedAt: today,
      decisionNote: decisionNote.trim()
    }

    setApplicants(current => current.map(item => item.id === updated.id ? updated : item))

    if (status === 'approved') {
      setParticipants(current => {
        const existing = current.find(item => item.applicantId === updated.id)

        if (existing) {
          return current.map(item =>
            item.applicantId === updated.id
              ? {
                ...item,
                avatar: updated.avatar,
                name: updated.name,
                email: updated.email,
                phone: updated.phone,
                occupation: updated.occupation,
                organization: updated.organization,
                approvedAt: today,
                reviewer: reviewer.trim()
              }
              : item
          )
        }

        return [...current, {
          id: `PST-2026-${String(current.length + 1).padStart(3, '0')}`,
          applicantId: updated.id,
          avatar: updated.avatar,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          occupation: updated.occupation,
          organization: updated.organization,
          approvedAt: today,
          reviewer: reviewer.trim(),
          attendance: 'registered'
        }]
      })
    }

    setProfile(null)
    setEditForm(null)
    setDecision(null)
    setError('')
  }

  const exportCsv = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csv = [headers, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const exportApplications = () => exportCsv(
    ['ID', 'Nama', 'NIK', 'Email', 'Telepon', 'Status pekerjaan', 'Pekerjaan', 'Organisasi', 'Tanggal daftar', 'Status', 'Reviewer', 'Tanggal keputusan', 'Catatan'],
    filteredApplicants.map(item => [
      item.id, item.name, item.nik, item.email, item.phone, item.employmentStatus,
      item.occupation, item.organization, item.registeredAt, statusConfig[item.status].label,
      item.reviewer, item.reviewedAt, item.decisionNote
    ]),
    `pendaftaran-${slug}.csv`
  )

  const exportParticipants = () => exportCsv(
    ['ID Peserta', 'ID Pendaftaran', 'Nama', 'Email', 'Telepon', 'Pekerjaan', 'Organisasi', 'Tanggal lolos', 'Reviewer', 'Status'],
    filteredParticipants.map(item => [
      item.id, item.applicantId, item.name, item.email, item.phone, item.occupation,
      item.organization, item.approvedAt, item.reviewer, attendanceConfig[item.attendance].label
    ]),
    `peserta-${slug}.csv`
  )

  const renderStatus = (status: ApplicantStatus) => (
    <Chip size='small' variant='tonal' color={statusConfig[status].color} label={statusConfig[status].label} />
  )

  const documentProgress = (item: Applicant) => {
    const verified = item.documents.filter(doc => doc.status === 'verified').length

    return {
      verified,
      total: item.documents.length,
      percentage: item.documents.length ? Math.round((verified / item.documents.length) * 100) : 0,
      issues: item.documents.filter(doc => doc.status === 'missing' || doc.status === 'invalid').length
    }
  }

  return (
    <Box className='flex flex-col gap-5'>
      <Box>
        <Typography variant='h5' className='font-semibold'>Pendaftaran & Peserta</Typography>
        <Typography variant='body2' color='text.secondary' className='mt-1'>
          Verifikasi administrasi dan kelola peserta program {title}.
        </Typography>
      </Box>

      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Pendaftar masuk' value={stats.total} hint='Seluruh permohonan' icon='tabler-users' color='bg-primary/10 text-primary' />
        <StatCard label='Menunggu keputusan' value={stats.pending} hint='Perlu ditindaklanjuti' icon='tabler-clipboard-check' color='bg-warning/10 text-warning' />
        <StatCard label='Berkas bermasalah' value={stats.incomplete} hint='Belum lengkap atau tidak valid' icon='tabler-file-alert' color='bg-error/10 text-error' />
        <StatCard label='Lolos seleksi' value={stats.approved} hint='Sudah menjadi peserta' icon='tabler-user-check' color='bg-success/10 text-success' />
      </Box>

      <Card>
        <Box className='border-b px-4 pt-2'>
          <Tabs
            value={workspace}
            onChange={(_, value: 'applications' | 'participants') => setWorkspace(value)}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
          >
            <Tab
              value='applications'
              icon={<i className='tabler-file-text text-lg' />}
              iconPosition='start'
              label={<Box className='flex items-center gap-2'>Pendaftaran <Chip size='small' label={applicants.length} /></Box>}
            />
            <Tab
              value='participants'
              icon={<i className='tabler-users text-lg' />}
              iconPosition='start'
              label={<Box className='flex items-center gap-2'>Peserta Terdaftar <Chip size='small' label={participants.length} /></Box>}
            />
          </Tabs>
        </Box>

        {workspace === 'applications' && (
          <CardContent className='flex flex-col gap-5 p-5'>
            <Box className='flex flex-wrap items-start justify-between gap-3'>
              <Box>
                <Typography variant='h6' className='font-semibold'>Seleksi Pendaftaran</Typography>
                <Typography variant='body2' color='text.secondary' className='mt-1'>
                  Periksa profil, verifikasi dokumen, dan tentukan keputusan seleksi.
                </Typography>
              </Box>
              <Button variant='outlined' startIcon={<i className='tabler-download text-lg' />} onClick={exportApplications}>
                Ekspor data
              </Button>
            </Box>

            <Alert severity='info' icon={<i className='tabler-shield-check text-xl' />}>
              Pendaftar menjadi peserta setelah seluruh dokumen terverifikasi dan admin menyetujui seleksi.
            </Alert>

            <Box className='flex flex-col gap-3 md:flex-row md:items-center'>
              <TextField
                fullWidth
                size='small'
                placeholder='Cari nama, email, pekerjaan, atau ID...'
                value={search}
                onChange={event => {
                  setSearch(event.target.value)
                  setPage(0)
                }}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position='start'><i className='tabler-search text-lg' /></InputAdornment>
                  }
                }}
              />
              <Select
                size='small'
                value={filter}
                onChange={event => {
                  setFilter(event.target.value)
                  setPage(0)
                }}
                className='min-w-[190px]'
                aria-label='Filter keputusan'
              >
                <MenuItem value='all'>Semua keputusan</MenuItem>
                <MenuItem value='pending'>Menunggu keputusan</MenuItem>
                <MenuItem value='approved'>Lolos seleksi</MenuItem>
                <MenuItem value='revision'>Perlu perbaikan</MenuItem>
                <MenuItem value='waiting'>Daftar tunggu</MenuItem>
                <MenuItem value='rejected'>Ditolak</MenuItem>
              </Select>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Pendaftar</TableCell>
                    <TableCell>Profil</TableCell>
                    <TableCell>Kelengkapan</TableCell>
                    <TableCell>Keputusan</TableCell>
                    <TableCell>Reviewer</TableCell>
                    <TableCell align='right'>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleApplicants.map(item => {
                    const progress = documentProgress(item)

                    return (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ minWidth: 225 }}>
                          <Box className='flex items-center gap-3'>
                            <Avatar src={item.avatar} alt={item.name} sx={{ width: 44, height: 44 }} />
                            <Box className='min-w-0'>
                              <Typography variant='body2' className='font-semibold'>{item.name}</Typography>
                              <Typography variant='caption' color='text.secondary' className='block'>{item.email}</Typography>
                              <Typography variant='caption' color='text.disabled'>{item.id}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 155 }}>
                          <Typography variant='body2'>{calculateAge(item.birthDate)} tahun · {item.education}</Typography>
                          <Chip
                            size='small'
                            variant='tonal'
                            color={item.employmentStatus === 'Belum bekerja' ? 'warning' : 'info'}
                            label={item.employmentStatus}
                            className='mt-1'
                          />
                          <Typography variant='caption' color='text.secondary' className='block mt-1'>{item.occupation}</Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 140 }}>
                          <Box className='flex flex-col gap-2'>
                            <Box className='flex items-center justify-between gap-2'>
                              <Typography variant='body2'>{progress.verified}/{progress.total} dokumen</Typography>
                              <Typography variant='caption' color='text.secondary'>{progress.percentage}%</Typography>
                            </Box>
                            <LinearProgress
                              variant='determinate'
                              value={progress.percentage}
                              color={progress.percentage === 100 ? 'success' : 'primary'}
                              sx={{ height: 5, borderRadius: 4 }}
                            />
                            {progress.issues > 0 && (
                              <Typography variant='caption' color='warning.main'>{progress.issues} perlu diperbaiki</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 165 }}>
                          {renderStatus(item.status)}
                          {(item.status === 'rejected' || item.status === 'revision' || item.status === 'waiting') && item.decisionNote && (
                            <Typography
                              variant='caption'
                              color={item.status === 'rejected' ? 'error.main' : 'text.secondary'}
                              className='mt-1 block'
                              sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', maxWidth: 200 }}
                            >
                              {item.status === 'rejected' ? 'Alasan: ' : 'Catatan: '}{item.decisionNote}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: 140 }}>
                          <Typography variant='body2'>{item.reviewer || 'Belum diputuskan'}</Typography>
                          <Typography variant='caption' color='text.secondary'>{formatDate(item.reviewedAt)}</Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Box className='flex justify-end gap-1'>
                            <ActionIcon title='Lihat profil lengkap' icon='tabler-eye' onClick={() => openProfile(item)} />
                            <ActionIcon title='Edit profil pendaftar' icon='tabler-edit' onClick={() => openProfile(item, true)} />
                            <ActionIcon title='Loloskan seleksi' icon='tabler-check' color='success' disabled={item.status === 'approved'} onClick={() => openProfile(item)} />
                            <ActionIcon title='Tindakan seleksi' icon='tabler-dots-vertical' onClick={() => openProfile(item)} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {visibleApplicants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box className='flex flex-col items-center gap-2 py-12 text-center'>
                          <i className='tabler-search text-4xl text-textSecondary' />
                          <Typography className='font-semibold'>Pendaftar tidak ditemukan</Typography>
                          <Typography variant='body2' color='text.secondary'>Coba ubah kata kunci atau filter.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component='div'
              count={filteredApplicants.length}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={event => {
                setRowsPerPage(Number(event.target.value))
                setPage(0)
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage='Baris per halaman'
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
            />
          </CardContent>
        )}

        {workspace === 'participants' && (
          <CardContent className='flex flex-col gap-5 p-5'>
            <Box className='flex flex-wrap items-start justify-between gap-3'>
              <Box>
                <Typography variant='h6' className='font-semibold'>Peserta Terdaftar</Typography>
                <Typography variant='body2' color='text.secondary' className='mt-1'>
                  Peserta yang telah lolos seleksi dan dapat dikelola oleh admin.
                </Typography>
              </Box>
              <Button variant='outlined' startIcon={<i className='tabler-download text-lg' />} onClick={exportParticipants}>
                Ekspor peserta
              </Button>
            </Box>

            <Box className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
              {[
                {
                  label: 'Total peserta',
                  value: participants.length,
                  icon: 'tabler-users',
                  tone: 'bg-primary/10 text-primary'
                },
                {
                  label: 'Terkonfirmasi',
                  value: participants.filter(item => item.attendance === 'confirmed').length,
                  icon: 'tabler-circle-check',
                  tone: 'bg-success/10 text-success'
                },
                {
                  label: 'Belum konfirmasi',
                  value: participants.filter(item => item.attendance === 'registered').length,
                  icon: 'tabler-clock',
                  tone: 'bg-warning/10 text-warning'
                }
              ].map(item => (
                <Box key={item.label} className='flex items-center gap-3 rounded-xl border p-4'>
                  <Box className={`flex bs-11 is-11 items-center justify-center rounded-lg ${item.tone}`}>
                    <i className={`${item.icon} text-[22px]`} />
                  </Box>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>{item.label}</Typography>
                    <Typography variant='h5' className='font-semibold'>{item.value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider />

            <Box className='flex flex-col gap-3 md:flex-row md:items-center'>
              <TextField
                fullWidth
                size='small'
                placeholder='Cari nama, email, pekerjaan, atau ID peserta...'
                value={participantSearch}
                onChange={event => {
                  setParticipantSearch(event.target.value)
                  setParticipantPage(0)
                }}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position='start'><i className='tabler-search text-lg' /></InputAdornment>
                  }
                }}
              />
              <Select
                size='small'
                value={participantFilter}
                onChange={event => {
                  setParticipantFilter(event.target.value)
                  setParticipantPage(0)
                }}
                className='min-w-[190px]'
                aria-label='Filter status keikutsertaan'
              >
                <MenuItem value='all'>Semua status</MenuItem>
                <MenuItem value='registered'>Terdaftar</MenuItem>
                <MenuItem value='confirmed'>Terkonfirmasi</MenuItem>
                <MenuItem value='attended'>Hadir</MenuItem>
                <MenuItem value='absent'>Tidak hadir</MenuItem>
              </Select>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Peserta</TableCell>
                    <TableCell>Profil pekerjaan</TableCell>
                    <TableCell>Tanggal lolos</TableCell>
                    <TableCell>Disetujui oleh</TableCell>
                    <TableCell>Keikutsertaan</TableCell>
                    <TableCell align='right'>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleParticipants.map(item => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ minWidth: 230 }}>
                        <Box className='flex items-center gap-3'>
                          <Avatar src={item.avatar} alt={item.name} sx={{ width: 44, height: 44 }} />
                          <Box className='min-w-0'>
                            <Typography variant='body2' className='font-semibold'>{item.name}</Typography>
                            <Typography variant='caption' color='text.secondary' className='block'>{item.email}</Typography>
                            <Typography variant='caption' color='text.disabled'>{item.id}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{item.occupation}</Typography>
                        <Typography variant='caption' color='text.secondary'>{item.organization}</Typography>
                      </TableCell>
                      <TableCell>{formatDate(item.approvedAt)}</TableCell>
                      <TableCell>{item.reviewer}</TableCell>
                      <TableCell>
                        <Select
                          size='small'
                          variant='standard'
                          disableUnderline
                          value={item.attendance}
                          onChange={event => {
                            const attendance = event.target.value as AttendanceStatus
                            setParticipants(current => current.map(row =>
                              row.id === item.id ? { ...row, attendance } : row
                            ))
                          }}
                          renderValue={value => (
                            <Chip
                              size='small'
                              variant='tonal'
                              color={attendanceConfig[value as AttendanceStatus].color}
                              label={attendanceConfig[value as AttendanceStatus].label}
                            />
                          )}
                          aria-label={`Status keikutsertaan ${item.name}`}
                        >
                          <MenuItem value='registered'>Terdaftar</MenuItem>
                          <MenuItem value='confirmed'>Terkonfirmasi</MenuItem>
                          <MenuItem value='attended'>Hadir</MenuItem>
                          <MenuItem value='absent'>Tidak hadir</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align='right'>
                        <Box className='flex justify-end gap-1'>
                          <ActionIcon
                            title='Lihat profil peserta'
                            icon='tabler-eye'
                            onClick={() => setParticipantProfile(item)}
                          />
                          <ActionIcon
                            title='Edit profil peserta'
                            icon='tabler-edit'
                            onClick={() => {
                              const applicant = applicants.find(row => row.id === item.applicantId)
                              if (applicant) openProfile(applicant, true)
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleParticipants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box className='flex flex-col items-center gap-2 py-12 text-center'>
                          <i className='tabler-users text-4xl text-textSecondary' />
                          <Typography className='font-semibold'>Peserta tidak ditemukan</Typography>
                          <Typography variant='body2' color='text.secondary'>Coba ubah kata kunci atau filter.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component='div'
              count={filteredParticipants.length}
              page={participantPage}
              onPageChange={(_, nextPage) => setParticipantPage(nextPage)}
              rowsPerPage={participantRows}
              onRowsPerPageChange={event => {
                setParticipantRows(Number(event.target.value))
                setParticipantPage(0)
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage='Baris per halaman'
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
            />
          </CardContent>
        )}
      </Card>

      <Alert severity='info' icon={<i className='tabler-info-circle text-xl' />}>
        Data demo: profil, avatar, dan dokumen masih dummy. Perubahan belum tersimpan permanen ke database.
      </Alert>

      <Dialog
        open={Boolean(profile && editForm)}
        onClose={() => {
          setProfile(null)
          setEditForm(null)
          setEditProfile(false)
          setDecision(null)
          setError('')
        }}
        fullWidth
        maxWidth='md'
      >
        {profile && editForm && (
          <>
            <DialogTitle className='flex items-center justify-between gap-3'>
              <Box>
                <Typography variant='h6' className='font-semibold'>
                  {editProfile ? 'Edit Profil Pendaftar' : 'Detail Profil Pendaftar'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {profile.id} · Terdaftar {formatDate(profile.registeredAt)}
                </Typography>
              </Box>
              <Box className='flex gap-1'>
                {!editProfile && (
                  <Tooltip title='Edit profil'>
                    <IconButton onClick={() => setEditProfile(true)}>
                      <i className='tabler-edit' />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title='Tutup'>
                  <IconButton onClick={() => setProfile(null)}>
                    <i className='tabler-x' />
                  </IconButton>
                </Tooltip>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Box className='flex flex-col gap-5'>
                {error && <Alert severity='warning'>{error}</Alert>}

                <Card variant='outlined'>
                  <CardContent className='flex flex-wrap items-center gap-4 p-4'>
                    <Avatar src={editForm.avatar} alt={editForm.name} sx={{ width: 76, height: 76 }} />
                    <Box className='min-w-0 flex-1'>
                      <Typography variant='h5' className='font-semibold'>{editForm.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>{editForm.email}</Typography>
                      <Box className='mt-2 flex flex-wrap gap-2'>
                        <Chip size='small' variant='tonal' label={`${calculateAge(editForm.birthDate)} tahun`} />
                        <Chip size='small' variant='tonal' label={editForm.education} />
                        {renderStatus(editForm.status)}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Box>
                  <Typography variant='subtitle1' className='mb-3 font-semibold'>
                    <i className='tabler-user-circle mr-2 align-middle text-lg' />
                    Identitas pribadi
                  </Typography>
                  <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {editProfile ? (
                      <>
                        <TextField size='small' label='Nama lengkap' value={editForm.name} onChange={event => setEditForm({ ...editForm, name: event.target.value })} required />
                        <TextField size='small' label='NIK' value={editForm.nik} onChange={event => setEditForm({ ...editForm, nik: event.target.value })} />
                        <TextField size='small' label='Tempat lahir' value={editForm.birthPlace} onChange={event => setEditForm({ ...editForm, birthPlace: event.target.value })} />
                        <TextField size='small' label='Tanggal lahir' type='date' value={editForm.birthDate} onChange={event => setEditForm({ ...editForm, birthDate: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField select size='small' label='Jenis kelamin' value={editForm.gender} onChange={event => setEditForm({ ...editForm, gender: event.target.value })}>
                          <MenuItem value='Laki-laki'>Laki-laki</MenuItem>
                          <MenuItem value='Perempuan'>Perempuan</MenuItem>
                        </TextField>
                        <TextField size='small' label='URL avatar' value={editForm.avatar} onChange={event => setEditForm({ ...editForm, avatar: event.target.value })} />
                      </>
                    ) : (
                      <>
                        <Field label='NIK' value={editForm.nik} icon='tabler-id' />
                        <Field label='Tempat, tanggal lahir' value={`${editForm.birthPlace}, ${formatDate(editForm.birthDate)}`} icon='tabler-calendar' />
                        <Field label='Jenis kelamin' value={editForm.gender} icon='tabler-user' />
                        <Field label='Usia' value={`${calculateAge(editForm.birthDate)} tahun`} icon='tabler-calendar' />
                      </>
                    )}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='subtitle1' className='mb-3 font-semibold'>
                    <i className='tabler-address-book mr-2 align-middle text-lg' />
                    Kontak & domisili
                  </Typography>
                  <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {editProfile ? (
                      <>
                        <TextField size='small' label='Email' type='email' value={editForm.email} onChange={event => setEditForm({ ...editForm, email: event.target.value })} required />
                        <TextField size='small' label='Nomor telepon / WhatsApp' value={editForm.phone} onChange={event => setEditForm({ ...editForm, phone: event.target.value })} required />
                        <TextField size='small' label='Alamat domisili' multiline minRows={2} value={editForm.address} onChange={event => setEditForm({ ...editForm, address: event.target.value })} className='sm:col-span-2' />
                      </>
                    ) : (
                      <>
                        <Field label='Email' value={editForm.email} icon='tabler-mail' />
                        <Field label='Nomor telepon' value={editForm.phone} icon='tabler-phone' />
                        <Field label='Alamat domisili' value={editForm.address} icon='tabler-map-pin' />
                        <Field label='Pendidikan terakhir' value={editForm.education} icon='tabler-school' />
                      </>
                    )}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='subtitle1' className='mb-3 font-semibold'>
                    <i className='tabler-briefcase mr-2 align-middle text-lg' />
                    Status pekerjaan
                  </Typography>
                  <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {editProfile ? (
                      <>
                        <TextField select size='small' label='Status pekerjaan' value={editForm.employmentStatus} onChange={event => setEditForm({ ...editForm, employmentStatus: event.target.value })}>
                          <MenuItem value='Bekerja'>Sudah bekerja</MenuItem>
                          <MenuItem value='Belum bekerja'>Belum bekerja</MenuItem>
                          <MenuItem value='Wirausaha'>Wirausaha</MenuItem>
                        </TextField>
                        <TextField size='small' label='Pendidikan terakhir' value={editForm.education} onChange={event => setEditForm({ ...editForm, education: event.target.value })} />
                        <TextField size='small' label='Pekerjaan saat ini' value={editForm.occupation} onChange={event => setEditForm({ ...editForm, occupation: event.target.value })} />
                        <TextField size='small' label='Perusahaan / nama usaha' value={editForm.organization} onChange={event => setEditForm({ ...editForm, organization: event.target.value })} />
                      </>
                    ) : (
                      <>
                        <Field label='Status pekerjaan' value={editForm.employmentStatus} icon='tabler-user-check' />
                        <Field label='Pekerjaan saat ini' value={editForm.occupation} icon='tabler-briefcase' />
                        <Field label='Perusahaan / usaha' value={editForm.organization} icon='tabler-building' />
                        <Field label='Pendidikan terakhir' value={editForm.education} icon='tabler-school' />
                      </>
                    )}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='subtitle1' className='mb-3 font-semibold'>
                    <i className='tabler-target mr-2 align-middle text-lg' />
                    Motivasi & tujuan
                  </Typography>
                  <Box className='flex flex-col gap-3'>
                    {editProfile ? (
                      <>
                        <TextField label='Motivasi mengikuti pelatihan' multiline minRows={3} value={editForm.motivation} onChange={event => setEditForm({ ...editForm, motivation: event.target.value })} />
                        <TextField label='Tujuan setelah pelatihan' multiline minRows={3} value={editForm.goals} onChange={event => setEditForm({ ...editForm, goals: event.target.value })} />
                      </>
                    ) : (
                      <>
                        <Box className='rounded-xl bg-actionHover p-4'>
                          <Typography variant='caption' color='text.secondary'>Motivasi mengikuti pelatihan</Typography>
                          <Typography variant='body2' className='mt-1'>{editForm.motivation}</Typography>
                        </Box>
                        <Box className='rounded-xl bg-actionHover p-4'>
                          <Typography variant='caption' color='text.secondary'>Tujuan setelah pelatihan</Typography>
                          <Typography variant='body2' className='mt-1'>{editForm.goals}</Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Box className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                    <Box>
                      <Typography variant='subtitle1' className='font-semibold'>
                        <i className='tabler-files mr-2 align-middle text-lg' />
                        Dokumen persyaratan
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>Periksa setiap berkas secara manual.</Typography>
                    </Box>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={editForm.documents.every(doc => doc.status === 'verified') ? 'success' : 'warning'}
                      label={`${editForm.documents.filter(doc => doc.status === 'verified').length}/${editForm.documents.length} terverifikasi`}
                    />
                  </Box>
                  <Box className='flex flex-col gap-3'>
                    {editForm.documents.map(doc => (
                      <Box key={doc.id} className='flex flex-wrap items-center gap-3 rounded-xl border p-3'>
                        <Avatar variant='rounded' className='bg-actionHover'>
                          <i className='tabler-file-text text-xl' />
                        </Avatar>
                        <Box className='min-w-0 flex-1'>
                          <Typography variant='body2' className='font-medium'>{doc.name}</Typography>
                          <Typography variant='caption' color='text.secondary' className='block'>{doc.description}</Typography>
                          <Typography variant='caption' color='text.disabled' className='block'>{doc.fileName}</Typography>
                        </Box>
                        <Chip size='small' variant='tonal' color={documentConfig[doc.status].color} label={documentConfig[doc.status].label} />
                        {editProfile ? (
                          <Select
                            size='small'
                            value={doc.status}
                            onChange={event => updateDocument(doc.id, event.target.value as DocumentStatus)}
                            sx={{ minWidth: 155 }}
                            aria-label={`Status ${doc.name}`}
                          >
                            <MenuItem value='pending'>Belum diperiksa</MenuItem>
                            <MenuItem value='verified'>Terverifikasi</MenuItem>
                            <MenuItem value='invalid'>Tidak valid</MenuItem>
                            <MenuItem value='missing'>Belum diunggah</MenuItem>
                          </Select>
                        ) : (
                          <Tooltip title='Tandai terverifikasi'>
                            <span>
                              <IconButton
                                size='small'
                                color='success'
                                disabled={doc.status === 'verified'}
                                onClick={() => updateDocument(doc.id, 'verified')}
                              >
                                <i className='tabler-check text-lg' />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {!editProfile && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant='subtitle1' className='mb-3 font-semibold'>
                        <i className='tabler-history mr-2 align-middle text-lg' />
                        Riwayat keputusan
                      </Typography>
                      <Box className='rounded-xl border p-4'>
                        <Box className='flex items-start gap-3'>
                          <Avatar src={editForm.reviewer === 'Budi Santoso' ? 'https://i.pravatar.cc/100?img=60' : 'https://i.pravatar.cc/100?img=44'} />
                          <Box className='min-w-0 flex-1'>
                            <Typography variant='body2' className='font-semibold'>
                              {editForm.reviewer || 'Belum ada keputusan'}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>{formatDate(editForm.reviewedAt)}</Typography>
                            {editForm.decisionNote && <Typography variant='body2' className='mt-2'>{editForm.decisionNote}</Typography>}
                          </Box>
                          {renderStatus(editForm.status)}
                        </Box>
                      </Box>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant='subtitle1' className='mb-3 font-semibold'>Tindakan seleksi</Typography>
                      <TextField
                        select
                        fullWidth
                        size='small'
                        label='Pegawai yang mengambil keputusan'
                        value={reviewer}
                        onChange={event => setReviewer(event.target.value)}
                      >
                        <MenuItem value='Siti Rahmawati'>Siti Rahmawati — Admin Pelatihan</MenuItem>
                        <MenuItem value='Budi Santoso'>Budi Santoso — Verifikator</MenuItem>
                        <MenuItem value='Ahmad Hidayat'>Ahmad Hidayat — Administrator</MenuItem>
                      </TextField>
                    </Box>

                    {decision && (
                      <Box className='rounded-xl border p-4'>
                        <Typography variant='subtitle2' className='mb-2 font-semibold'>
                          {decision === 'reject' ? 'Alasan penolakan' : decision === 'revision' ? 'Catatan perbaikan' : 'Catatan daftar tunggu'}
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          size='small'
                          value={decisionNote}
                          onChange={event => setDecisionNote(event.target.value)}
                          placeholder='Tuliskan alasan dan tindak lanjut yang jelas...'
                        />
                        <Box className='mt-3 flex justify-end gap-2'>
                          <Button color='inherit' onClick={() => setDecision(null)}>Batal</Button>
                          <Button
                            color={decision === 'reject' ? 'error' : 'primary'}
                            variant='contained'
                            onClick={() => applyDecision(
                              decision === 'reject' ? 'rejected' :
                                decision === 'revision' ? 'revision' : 'waiting'
                            )}
                          >
                            Simpan keputusan
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </DialogContent>

            <DialogActions className='flex flex-wrap justify-between gap-2 p-4'>
              <Button color='inherit' onClick={() => {
                setProfile(null)
                setEditForm(null)
                setEditProfile(false)
                setDecision(null)
                setError('')
              }}>
                Tutup
              </Button>

              <Box className='flex flex-wrap gap-2'>
                {editProfile ? (
                  <>
                    <Button color='inherit' onClick={() => {
                      setEditProfile(false)
                      setEditForm(profile)
                      setError('')
                    }}>
                      Batal
                    </Button>
                    <Button variant='contained' startIcon={<i className='tabler-device-floppy text-lg' />} onClick={saveProfile}>
                      Simpan profil
                    </Button>
                  </>
                ) : !decision && profile.status !== 'approved' ? (
                  <>
                    <Button
                      variant='outlined'
                      color='warning'
                      startIcon={<i className='tabler-refresh text-lg' />}
                      onClick={() => {
                        setDecision('revision')
                        setDecisionNote('')
                        setError('')
                      }}
                    >
                      Minta perbaikan
                    </Button>
                    <Button
                      variant='outlined'
                      color='error'
                      startIcon={<i className='tabler-x text-lg' />}
                      onClick={() => {
                        setDecision('reject')
                        setDecisionNote('')
                        setError('')
                      }}
                    >
                      Tolak
                    </Button>
                    <Button
                      variant='outlined'
                      color='inherit'
                      onClick={() => {
                        setDecision('waiting')
                        setDecisionNote('')
                        setError('')
                      }}
                    >
                      Daftar tunggu
                    </Button>
                    <Button
                      variant='contained'
                      startIcon={<i className='tabler-user-check text-lg' />}
                      onClick={() => applyDecision('approved')}
                    >
                      Loloskan
                    </Button>
                  </>
                ) : null}
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={Boolean(participantProfile)}
        onClose={() => setParticipantProfile(null)}
        fullWidth
        maxWidth='sm'
      >
        {participantProfile && (
          <>
            <DialogTitle className='flex items-center justify-between'>
              <Box>
                <Typography variant='h6' className='font-semibold'>Profil Peserta</Typography>
                <Typography variant='body2' color='text.secondary'>{participantProfile.id}</Typography>
              </Box>
              <IconButton onClick={() => setParticipantProfile(null)}>
                <i className='tabler-x' />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box className='flex items-center gap-4'>
                <Avatar src={participantProfile.avatar} alt={participantProfile.name} sx={{ width: 68, height: 68 }} />
                <Box>
                  <Typography variant='h6' className='font-semibold'>{participantProfile.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>{participantProfile.email}</Typography>
                  <Chip size='small' variant='tonal' color='success' label='Lolos seleksi' className='mt-2' />
                </Box>
              </Box>
              <Divider className='my-4' />
              <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Field label='Nomor telepon' value={participantProfile.phone} icon='tabler-phone' />
                <Field label='Pekerjaan' value={participantProfile.occupation} icon='tabler-briefcase' />
                <Field label='Perusahaan / usaha' value={participantProfile.organization} icon='tabler-building' />
                <Field label='Tanggal lolos' value={formatDate(participantProfile.approvedAt)} icon='tabler-calendar' />
                <Field label='Disetujui oleh' value={participantProfile.reviewer} icon='tabler-shield-check' />
                <Field label='ID pendaftaran' value={participantProfile.applicantId} icon='tabler-id' />
              </Box>
            </DialogContent>
            <DialogActions className='flex justify-between p-4'>
              <Button onClick={() => setParticipantProfile(null)}>Tutup</Button>
              <Button
                variant='contained'
                startIcon={<i className='tabler-edit text-lg' />}
                onClick={() => {
                  const applicant = applicants.find(row => row.id === participantProfile.applicantId)
                  if (applicant) openProfile(applicant, true)
                  setParticipantProfile(null)
                }}
              >
                Edit profil peserta
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default ParticipantsTab

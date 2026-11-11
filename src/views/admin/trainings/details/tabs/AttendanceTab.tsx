'use client'

import { useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
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
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
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

import type { TrainingRecord } from '@/types/admin/trainingTypes'

type AttendanceTabProps = {
  data: TrainingRecord
}

type AttendanceStatus = 'present' | 'late' | 'excused' | 'absent'
type SessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
type ActorRole = 'Peserta' | 'Pelatih' | 'Admin'

type Actor = {
  name: string
  role: ActorRole
  avatar: string
}

type Attachment = {
  name: string
  url: string
  type: string
}

type AuditLog = {
  id: string
  actor: Actor
  action: string
  description: string
  timestamp: string
}

type TrainingSession = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  status: SessionStatus
}

type AttendanceRecord = {
  id: string
  participantId: string
  name: string
  email: string
  institution: string
  avatar: string
  sessionId: string
  checkIn: string | null
  status: AttendanceStatus
  method: 'self' | 'face-recognition' | 'qr-code' | 'manual'
  recordedBy: Actor
  recordedAt: string
  excuseReason: string
  attachment: Attachment | null
  excuseVerified: boolean
  excuseVerifiedBy: Actor | null
  excuseVerifiedAt: string | null
  notes: string
  auditLogs: AuditLog[]
}

type SessionForm = {
  date: string
  startTime: string
  endTime: string
  location: string
}

const adminActor: Actor = {
  name: 'Rizky Pratama',
  role: 'Admin',
  avatar: 'https://i.pravatar.cc/150?img=12'
}

const trainerActor: Actor = {
  name: 'Andi Saputra',
  role: 'Pelatih',
  avatar: 'https://i.pravatar.cc/150?img=11'
}

const trainerActor2: Actor = {
  name: 'Siti Rahmawati',
  role: 'Pelatih',
  avatar: 'https://i.pravatar.cc/150?img=47'
}

const initialSessions: TrainingSession[] = [
  {
    id: 'SES-001',
    title: 'Pembukaan dan Pengenalan Program',
    date: '2026-10-20',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Aula Utama',
    status: 'scheduled'
  },
  {
    id: 'SES-002',
    title: 'Materi Dasar dan Konsep',
    date: '2026-10-20',
    startTime: '10:15',
    endTime: '12:00',
    location: 'Ruang Pelatihan A',
    status: 'scheduled'
  },
  {
    id: 'SES-003',
    title: 'Praktik dan Simulasi',
    date: '2026-10-21',
    startTime: '08:00',
    endTime: '12:00',
    location: 'Laboratorium Komputer',
    status: 'scheduled'
  },
  {
    id: 'SES-004',
    title: 'Evaluasi dan Penutupan',
    date: '2026-10-22',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Aula Utama',
    status: 'scheduled'
  }
]

const makeRecord = (
  id: string,
  participantId: string,
  name: string,
  email: string,
  institution: string,
  sessionId: string,
  checkIn: string | null,
  status: AttendanceStatus,
  method: AttendanceRecord['method'],
  recorder: Actor,
  recordedAt: string,
  extra: Partial<AttendanceRecord> = {}
): AttendanceRecord => ({
  id,
  participantId,
  name,
  email,
  institution,
  avatar: `https://i.pravatar.cc/150?u=${participantId}`,
  sessionId,
    checkIn,
    status,
    method,
    recordedBy: recorder,
  recordedAt,
  excuseReason: '',
  attachment: null,
  excuseVerified: false,
  excuseVerifiedBy: null,
  excuseVerifiedAt: null,
  notes: '',
  auditLogs: [],
...extra
})

const initialAttendance: AttendanceRecord[] = [
  makeRecord(
    'ATT-001', 'REG-001', 'Aditya Pratama', 'aditya@example.com',
    'Universitas Lambung Mangkurat', 'SES-001', '07:52', 'present',
    'face-recognition',
    { name: 'Aditya Pratama', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=13' },
    '2026-10-20T07:52:10'
  ),
  makeRecord(
    'ATT-002', 'REG-002', 'Nadia Putri', 'nadia@example.com',
    'SMK Negeri 1 Banjarbaru', 'SES-001', '08:12', 'late',
    'face-recognition',
    { name: 'Nadia Putri', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=44' },
    '2026-10-20T08:12:05'
  ),
  makeRecord(
    'ATT-003', 'REG-003', 'Rizky Ramadhan', 'rizky@example.com',
    'Dinas Koperasi dan UKM', 'SES-001', null, 'absent',
    'manual', trainerActor, '2026-10-20T10:05:00'
  ),
  makeRecord(
    'ATT-004', 'REG-004', 'Siti Rahmawati', 'siti@example.com',
    'UMKM Banjarbaru', 'SES-001', null, 'excused',
    'self',
    { name: 'Siti Rahmawati', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=47' },
    '2026-10-20T06:45:00',
    {
      excuseReason: 'Sakit dan perlu beristirahat di rumah.',
      attachment: {
        name: 'surat-keterangan-sakit.pdf',
        url: '#dummy-attachment',
        type: 'application/pdf'
      },
      notes: 'Surat pendukung telah diperiksa.',
      excuseVerified: true,
      excuseVerifiedBy: adminActor,
      excuseVerifiedAt: '2026-10-20T07:15:00'
    }
  ),
  makeRecord(
    'ATT-005', 'REG-005', 'Muhammad Fajar', 'fajar@example.com',
    'Universitas Islam Kalimantan', 'SES-001', '07:58', 'present',
    'manual', trainerActor, '2026-10-20T08:02:00'
  ),
  makeRecord(
    'ATT-006', 'REG-006', 'Dewi Anggraini', 'dewi@example.com',
    'Koperasi Sejahtera', 'SES-001', '08:03', 'present',
    'face-recognition',
    { name: 'Dewi Anggraini', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=49' },
    '2026-10-20T08:03:06'
  ),
  makeRecord(
    'ATT-007', 'REG-007', 'Andi Saputra', 'andi@example.com',
    'Pelaku UMKM', 'SES-001', null, 'absent',
    'manual', trainerActor, '2026-10-20T10:05:00'
  ),
  makeRecord(
    'ATT-008', 'REG-008', 'Putri Amelia', 'putri@example.com',
    'Universitas Lambung Mangkurat', 'SES-001', '07:55', 'present',
    'face-recognition',
    { name: 'Putri Amelia', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=45' },
    '2026-10-20T07:55:08'
  ),
  makeRecord(
    'ATT-009', 'REG-001', 'Aditya Pratama', 'aditya@example.com',
    'Universitas Lambung Mangkurat', 'SES-002', '10:10', 'present',
    'face-recognition',
    { name: 'Aditya Pratama', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=13' },
    '2026-10-20T10:10:10'
  ),
  makeRecord(
    'ATT-010', 'REG-002', 'Nadia Putri', 'nadia@example.com',
    'SMK Negeri 1 Banjarbaru', 'SES-002', '10:22', 'late',
    'manual', trainerActor, '2026-10-20T10:25:00'
  ),
  makeRecord(
    'ATT-011', 'REG-003', 'Rizky Ramadhan', 'rizky@example.com',
    'Dinas Koperasi dan UKM', 'SES-002', null, 'absent',
    'manual', trainerActor, '2026-10-20T12:05:00'
  ),
  makeRecord(
    'ATT-012', 'REG-004', 'Siti Rahmawati', 'siti@example.com',
    'UMKM Banjarbaru', 'SES-002', '10:08', 'present',
    'qr-code',
    { name: 'Siti Rahmawati', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=47' },
    '2026-10-20T10:08:03'
  ),
  makeRecord(
    'ATT-013', 'REG-005', 'Muhammad Fajar', 'fajar@example.com',
    'Universitas Islam Kalimantan', 'SES-003', '07:54', 'present',
    'face-recognition',
    { name: 'Muhammad Fajar', role: 'Peserta', avatar: 'https://i.pravatar.cc/150?img=15' },
    '2026-10-21T07:54:05'
  ),
  makeRecord(
    'ATT-014', 'REG-006', 'Dewi Anggraini', 'dewi@example.com',
    'Koperasi Sejahtera', 'SES-003', null, 'absent',
    'manual', trainerActor2, '2026-10-21T12:05:00'
  ),
  makeRecord(
    'ATT-015', 'REG-007', 'Andi Saputra', 'andi@example.com',
    'Pelaku UMKM', 'SES-003', '07:59', 'present',
    'manual', trainerActor2, '2026-10-21T08:00:00'
  )
]

const statusConfig: Record<
  AttendanceStatus,
  { label: string; color: 'success' | 'warning' | 'info' | 'error' }
> = {
  present: { label: 'Hadir', color: 'success' },
  late: { label: 'Terlambat', color: 'warning' },
  excused: { label: 'Izin', color: 'info' },
  absent: { label: 'Belum hadir', color: 'error' }
}

const sessionStatusConfig: Record<
  SessionStatus,
  { label: string; color: 'success' | 'warning' | 'info' | 'error' | 'default' }
> = {
  scheduled: { label: 'Terjadwal', color: 'info' },
  ongoing: { label: 'Berlangsung', color: 'success' },
  completed: { label: 'Selesai', color: 'default' },
  cancelled: { label: 'Dibatalkan', color: 'error' }
}

const methodLabels: Record<AttendanceRecord['method'], string> = {
  self: 'Mandiri oleh peserta',
  'face-recognition': 'Face recognition',
  'qr-code': 'QR code',
  manual: 'Manual oleh pelatih'
}

const formatDate = (value: string) => {
  if (!value) return 'Tanggal belum ditentukan'

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const formatDateTime = (value: string | null) => {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

const toLocalInput = (value: string | null) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return local.toISOString().slice(0, 16)
}

const AttendanceTab = ({ data }: AttendanceTabProps) => {
  const [sessions, setSessions] = useState<TrainingSession[]>(initialSessions)
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendance)

  const [selectedSession, setSelectedSession] = useState('SES-001')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [detailRecord, setDetailRecord] = useState<AttendanceRecord | null>(null)
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null)
  const [auditRecord, setAuditRecord] = useState<AttendanceRecord | null>(null)

  const [editStatus, setEditStatus] = useState<AttendanceStatus>('present')
  const [editMethod, setEditMethod] = useState<AttendanceRecord['method']>('manual')
  const [editCheckIn, setEditCheckIn] = useState('')
  const [editExcuseReason, setEditExcuseReason] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editReason, setEditReason] = useState('')
  const [editVerified, setEditVerified] = useState(false)
  const [editAttachment, setEditAttachment] = useState<Attachment | null>(null)
  const [removeAttachment, setRemoveAttachment] = useState(false)
  const [editError, setEditError] = useState('')

  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [sessionForm, setSessionForm] = useState<SessionForm>({
    date: '',
    startTime: '',
    endTime: '',
    location: ''
  })
  const [sessionReason, setSessionReason] = useState('')
  const [sessionError, setSessionError] = useState('')
  const [scheduleLogs, setScheduleLogs] = useState<
    { id: string; actor: Actor; description: string; timestamp: string }[]
  >([])

  const activeSession = sessions.find(session => session.id === selectedSession)

  const sessionRecords = useMemo(
    () => records.filter(record => record.sessionId === selectedSession),
    [records, selectedSession]
  )

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return sessionRecords.filter(record => {
      const matchesSearch =
        !keyword ||
        record.name.toLowerCase().includes(keyword) ||
        record.email.toLowerCase().includes(keyword) ||
        record.institution.toLowerCase().includes(keyword) ||
        record.participantId.toLowerCase().includes(keyword) ||
        record.recordedBy.name.toLowerCase().includes(keyword)

      return matchesSearch && (statusFilter === 'all' || record.status === statusFilter)
    })
  }, [sessionRecords, search, statusFilter])

  const stats = useMemo(
    () => ({
      total: sessionRecords.length,
      present: sessionRecords.filter(record => record.status === 'present').length,
      late: sessionRecords.filter(record => record.status === 'late').length,
      excused: sessionRecords.filter(record => record.status === 'excused').length,
      absent: sessionRecords.filter(record => record.status === 'absent').length
    }),
    [sessionRecords]
  )

  const attendanceRate = stats.total
    ? Math.round(((stats.present + stats.late) / stats.total) * 100)
    : 0

  const pageRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort((a, b) =>
        `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`)
      ),
    [sessions]
  )

  const openEditRecord = (record: AttendanceRecord) => {
    setEditRecord(record)
    setEditStatus(record.status)
    setEditMethod('manual')
    setEditCheckIn(record.checkIn ? `${record.checkIn}` : '')
    setEditExcuseReason(record.excuseReason)
    setEditNotes(record.notes)
    setEditReason('')
    setEditVerified(record.excuseVerified)
    setEditAttachment(record.attachment)
    setRemoveAttachment(false)
    setEditError('')
  }

  const saveRecordCorrection = () => {
    if (!editRecord) return

    if (!editReason.trim()) {
      setEditError('Alasan koreksi wajib diisi.')
      return
    }

    if (editStatus === 'excused' && !editExcuseReason.trim()) {
      setEditError('Alasan izin wajib diisi.')
      return
    }

    if (
      (editStatus === 'present' || editStatus === 'late') &&
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(editCheckIn)
    ) {
      setEditError('Masukkan jam check-in yang valid.')
      return
    }

    const now = new Date().toISOString()
    const verified = editStatus === 'excused' && editVerified

    const audit: AuditLog = {
      id: `LOG-${Date.now()}`,
      actor: adminActor,
      action: 'Koreksi absensi',
      description:
        `Status ${statusConfig[editRecord.status].label} → ${statusConfig[editStatus].label}. ` +
        `Metode: ${methodLabels[editMethod]}. Alasan: ${editReason.trim()}`,
      timestamp: now
    }

    const updated: AttendanceRecord = {
      ...editRecord,
      status: editStatus,
      method: editMethod,
      checkIn:
        editStatus === 'present' || editStatus === 'late'
          ? editCheckIn
          : null,
      recordedBy: adminActor,
      recordedAt: now,
      excuseReason: editStatus === 'excused' ? editExcuseReason.trim() : '',
      attachment:
        editStatus !== 'excused' || removeAttachment ? null : editAttachment,
      excuseVerified: verified,
      excuseVerifiedBy: verified ? adminActor : null,
      excuseVerifiedAt: verified ? now : null,
      notes: editNotes.trim(),
      auditLogs: [...editRecord.auditLogs, audit]
    }

    setRecords(current =>
      current.map(record => record.id === updated.id ? updated : record)
    )
    setEditRecord(null)
  }

  const changeStatus = (record: AttendanceRecord, status: AttendanceStatus) => {
    openEditRecord(record)
    setEditStatus(status)
  }

  const openSessionEditor = () => {
    if (!activeSession) return

    setSessionForm({
      date: activeSession.date,
      startTime: activeSession.startTime,
      endTime: activeSession.endTime,
      location: activeSession.location
    })
    setSessionReason('')
    setSessionError('')
    setSessionDialogOpen(true)
  }

  const saveSession = () => {
    if (!activeSession) return

    if (!sessionForm.date || !sessionForm.startTime || !sessionForm.endTime) {
      setSessionError('Tanggal dan waktu sesi wajib diisi.')
      return
    }

    if (sessionForm.endTime <= sessionForm.startTime) {
      setSessionError('Jam selesai harus setelah jam mulai.')
      return
    }

    if (!sessionReason.trim()) {
      setSessionError('Alasan perubahan jadwal wajib diisi.')
      return
    }

    const now = new Date().toISOString()
    const previous = activeSession

    setSessions(current =>
      current.map(session =>
        session.id === previous.id
          ? {
            ...session,
            date: sessionForm.date,
            startTime: sessionForm.startTime,
            endTime: sessionForm.endTime,
            location: sessionForm.location.trim()
          }
          : session
      )
    )

    setScheduleLogs(current => [
      ...current,
      {
        id: `SCHLOG-${Date.now()}`,
        actor: adminActor,
        description:
          `${previous.title}: ${formatDate(previous.date)} ${previous.startTime}–${previous.endTime} ` +
          `menjadi ${formatDate(sessionForm.date)} ${sessionForm.startTime}–${sessionForm.endTime}. ` +
          `Alasan: ${sessionReason.trim()}`,
        timestamp: now
      }
    ])

    setSessionDialogOpen(false)
  }

  const toggleVerification = (record: AttendanceRecord) => {
    if (record.status !== 'excused') return

    const now = new Date().toISOString()
    const verified = !record.excuseVerified

    const updated: AttendanceRecord = {
      ...record,
      excuseVerified: verified,
      excuseVerifiedBy: verified ? adminActor : null,
      excuseVerifiedAt: verified ? now : null,
      recordedBy: adminActor,
      recordedAt: now,
      auditLogs: [
        ...record.auditLogs,
        {
          id: `LOG-${Date.now()}`,
          actor: adminActor,
          action: verified ? 'Verifikasi izin' : 'Pembatalan verifikasi izin',
          description: verified
            ? 'Admin menyetujui keterangan izin.'
            : 'Admin membatalkan verifikasi izin.',
          timestamp: now
        }
      ]
    }

    setRecords(current =>
      current.map(item => item.id === updated.id ? updated : item)
    )
    setDetailRecord(updated)
  }

  const handleAttachment = (file: File | null) => {
    if (!file) return

    setEditAttachment({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type || 'application/octet-stream'
    })
    setRemoveAttachment(false)
  }

  const exportCsv = () => {
    const headers = [
      'ID Peserta',
      'Nama',
      'Email',
      'Instansi',
      'Sesi',
      'Tanggal Jadwal',
      'Jam Mulai',
      'Jam Selesai',
      'Jam Check-in',
      'Status',
      'Metode',
      'Dicatat Oleh',
      'Peran Pencatat',
      'Waktu Pencatatan',
      'Alasan Izin',
      'Verifikasi Izin',
      'Lampiran',
      'Catatan'
    ]

    const escapeCsv = (value: string | null | undefined) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`

    const rows = filteredRecords.map(record => {
      const session = sessions.find(item => item.id === record.sessionId)

      return [
        record.participantId,
        record.name,
        record.email,
        record.institution,
        session?.title ?? '-',
        session?.date ?? '-',
        session?.startTime ?? '-',
        session?.endTime ?? '-',
        record.checkIn ?? '-',
        statusConfig[record.status].label,
        methodLabels[record.method],
        record.recordedBy.name,
        record.recordedBy.role,
        formatDateTime(record.recordedAt),
        record.excuseReason,
        record.status === 'excused'
          ? record.excuseVerified ? 'Terverifikasi' : 'Belum diverifikasi'
          : '',
        record.attachment?.name ?? '',
        record.notes
      ]
    })

    const csv = [headers, ...rows]
      .map(row => row.map(escapeCsv).join(','))
      .join('\r\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    })

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = `absensi-${data.slug || data.id}-${selectedSession}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const sessionStatus = activeSession
    ? sessionStatusConfig[activeSession.status]
    : null

  return (
    <Box className='flex flex-col gap-5'>
      {/* HEADER */}

      <Box className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <Box className='min-w-0'>
          <Box className='mb-1 flex items-center gap-2'>
            <i className='tabler-calendar-check text-lg text-primary' />
            <Typography variant='caption' color='text.secondary'>
              MANAJEMEN PELATIHAN
            </Typography>
          </Box>

          <Typography variant='h5' className='font-semibold'>
            Absensi Peserta
          </Typography>

          <Typography variant='body2' color='text.secondary' className='mt-1'>
            Kelola dan koreksi kehadiran peserta
            {data.title ? ` pada ${data.title}` : ''}.
          </Typography>
        </Box>

        <Button
          variant='outlined'
          startIcon={<i className='tabler-download' />}
          onClick={exportCsv}
          disabled={!activeSession || filteredRecords.length === 0}
        >
          Ekspor CSV
        </Button>
      </Box>

      {/* SESSION SELECTOR - NO EXTRA SESSION TABLE */}

      <Card>
        <CardContent className='flex flex-col gap-4 p-4 sm:p-5'>
          <Box className='flex flex-wrap items-center justify-between gap-3'>
            <Box>
              <Typography variant='h6' className='font-semibold'>
                Jadwal Pelatihan
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Pilih sesi untuk menampilkan rekap absensinya.
              </Typography>
            </Box>

            <Chip
              size='small'
              variant='tonal'
              color='primary'
              icon={<i className='tabler-calendar-event' />}
              label={`${sessions.length} jadwal`}
            />
          </Box>

          <TextField
            select
            fullWidth
            label='Pilih jadwal'
            value={activeSession ? selectedSession : ''}
            onChange={event => {
              setSelectedSession(event.target.value)
              setPage(0)
              setSearch('')
              setStatusFilter('all')
            }}
          >
            {sortedSessions.map(session => (
              <MenuItem key={session.id} value={session.id}>
                {formatDate(session.date)} · {session.startTime} · {session.title}
                {session.status === 'cancelled' ? ' (Dibatalkan)' : ''}
              </MenuItem>
            ))}
          </TextField>

          {activeSession && (
            <Box className='rounded-xl border border-divider p-4'>
              <Box className='flex flex-col gap-4 sm:flex-row sm:items-start'>
                <Avatar
                  variant='rounded'
                  className='bs-12 is-12 bg-primaryLight text-primary'
                >
                  <i className='tabler-calendar-time text-2xl' />
                </Avatar>

                <Box className='min-w-0 flex-1'>
                  <Box className='flex flex-wrap items-center gap-2'>
                    <Typography variant='subtitle1' className='font-semibold'>
                      {activeSession.title}
                    </Typography>

                    {sessionStatus && (
                      <Chip
                        size='small'
                        variant='tonal'
                        color={sessionStatus.color}
                        label={sessionStatus.label}
                      />
                    )}
                  </Box>

                  <Box className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                    <SessionInfo
                      icon='tabler-calendar'
                      label='Tanggal'
                      value={formatDate(activeSession.date)}
                    />
                    <SessionInfo
                      icon='tabler-clock'
                      label='Waktu'
                      value={`${activeSession.startTime}–${activeSession.endTime}`}
                    />
                    <SessionInfo
                      icon='tabler-map-pin'
                      label='Lokasi'
                      value={activeSession.location || 'Belum ditentukan'}
                    />
                  </Box>
                </Box>

                <Tooltip title='Koreksi jadwal'>
                  <IconButton
                    aria-label='Koreksi jadwal'
                    onClick={openSessionEditor}
                  >
                    <i className='tabler-calendar-edit text-lg' />
                  </IconButton>
                </Tooltip>
              </Box>

              {activeSession.status === 'cancelled' && (
                <Box className='mt-4 rounded-lg border border-error/30 bg-error/5 p-3'>
                  <Typography variant='body2' color='error'>
                    Jadwal ini dibatalkan. Riwayat absensi tetap tersedia.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {activeSession && (
        <>
          {/* STATISTICS */}

          <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {[
              {
                label: 'Hadir',
                value: stats.present,
                icon: 'tabler-user-check',
                color: 'success'
              },
              {
                label: 'Terlambat',
                value: stats.late,
                icon: 'tabler-clock-exclamation',
                color: 'warning'
              },
              {
                label: 'Izin',
                value: stats.excused,
                icon: 'tabler-clipboard-check',
                color: 'info'
              },
              {
                label: 'Belum hadir',
                value: stats.absent,
                icon: 'tabler-user-x',
                color: 'error'
              }
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className='flex items-center justify-between gap-3 p-5'>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      {stat.label}
                    </Typography>
                    <Typography variant='h4' className='mt-2 font-semibold'>
                      {stat.value}
                    </Typography>
                  </Box>

                  <Avatar
                    variant='rounded'
                    className={`bs-11 is-11 bg-${stat.color}Light text-${stat.color}`}
                  >
                    <i className={`${stat.icon} text-2xl`} />
                  </Avatar>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* ATTENDANCE RATE */}

          <Card>
            <CardContent className='flex flex-col gap-3 p-5'>
              <Box className='flex flex-wrap items-center justify-between gap-3'>
                <Box>
                  <Typography variant='h6' className='font-semibold'>
                    Tingkat Kehadiran
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Persentase peserta yang hadir atau terlambat.
                  </Typography>
                </Box>

                <Typography variant='h4' className='font-semibold'>
                  {attendanceRate}%
                </Typography>
              </Box>

              <LinearProgress
                variant='determinate'
                value={attendanceRate}
                className='h-2 rounded-full'
                color={attendanceRate >= 80 ? 'success' : 'primary'}
              />

              <Typography variant='caption' color='text.secondary'>
                {stats.present + stats.late} dari {stats.total} peserta tercatat hadir.
              </Typography>
            </CardContent>
          </Card>

          {/* COMPACT ADMIN ATTENDANCE TABLE */}

          <Card>
            <CardContent className='flex flex-col gap-4 p-4 sm:p-5'>
              <Box>
                <Typography variant='h6' className='font-semibold'>
                  Rekap Kehadiran
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Identitas, status, metode, pencatat, dan keterangan dalam satu tampilan.
                </Typography>
              </Box>

              <Box className='flex flex-col gap-3 md:flex-row'>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Cari nama, email, ID, atau pencatat...'
                  value={search}
                  onChange={event => {
                    setSearch(event.target.value)
                    setPage(0)
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-search text-xl' />
                        </InputAdornment>
                      ),
                      endAdornment: search ? (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            aria-label='Hapus pencarian'
                            onClick={() => setSearch('')}
                          >
                            <i className='tabler-x' />
                          </IconButton>
                        </InputAdornment>
                      ) : undefined
                    }
                  }}
                />

                <TextField
                  select
                  size='small'
                  value={statusFilter}
                  onChange={event => {
                    setStatusFilter(event.target.value)
                    setPage(0)
                  }}
                  className='min-w-[180px]'
                  label='Status kehadiran'
                >
                  <MenuItem value='all'>Semua status</MenuItem>
                  <MenuItem value='present'>Hadir</MenuItem>
                  <MenuItem value='late'>Terlambat</MenuItem>
                  <MenuItem value='excused'>Izin</MenuItem>
                  <MenuItem value='absent'>Belum hadir</MenuItem>
                </TextField>
              </Box>

              <Divider />

              <TableContainer>
                <Table sx={{ minWidth: 1050 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Peserta</TableCell>
                      <TableCell>Kehadiran</TableCell>
                      <TableCell>Pencatatan</TableCell>
                      <TableCell>Keterangan</TableCell>
                      <TableCell align='right'>Aksi</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {pageRecords.map(record => {
                      const status = statusConfig[record.status]

                      return (
                        <TableRow key={record.id} hover>
                          {/* PARTICIPANT */}

                          <TableCell>
                            <Box className='flex items-center gap-3'>
                              <Avatar
                                src={record.avatar}
                                alt={record.name}
                                className='bs-10 is-10'
                              >
                                {record.name.charAt(0)}
                              </Avatar>

                              <Box className='min-w-0'>
                                <Typography variant='body2' className='font-medium'>
                                  {record.name}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                  className='block'
                                >
                                  {record.participantId} · {record.institution}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                  className='block'
                                >
                                  {record.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          {/* STATUS + CHECK-IN */}

                          <TableCell>
                            <Box className='flex flex-col items-start gap-1.5'>
                              <Chip
                                label={status.label}
                                color={status.color}
                                size='small'
                                variant='tonal'
                              />
                              <Typography variant='body2' className='font-medium'>
                                <i className='tabler-clock mr-1 align-middle text-base text-textSecondary' />
                                {record.checkIn ?? 'Belum check-in'}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* METHOD + RECORDER + TIMESTAMP */}

                          <TableCell>
                            <Box className='flex min-w-[190px] flex-col gap-1'>
                              <Typography variant='body2' className='font-medium'>
                                <i
                                  className={`${
                                    record.method === 'face-recognition'
                                      ? 'tabler-scan'
                                      : record.method === 'qr-code'
                                        ? 'tabler-qrcode'
                                        : record.method === 'self'
                                          ? 'tabler-user-check'
                                          : 'tabler-user-cog'
                                  } mr-1 align-middle text-base text-primary`}
                                />
                                {methodLabels[record.method]}
                              </Typography>

                              <Box className='flex items-center gap-2'>
                                <Avatar
                                  src={record.recordedBy.avatar}
                                  sx={{ width: 22, height: 22 }}
                                />
                                <Typography variant='caption' color='text.secondary'>
                                  {record.recordedBy.name} · {record.recordedBy.role}
                                </Typography>
                              </Box>

                              <Typography variant='caption' color='text.secondary'>
                                <i className='tabler-clock-hour-4 mr-1 align-middle' />
                                Dicatat {formatDateTime(record.recordedAt)}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* EXCUSE + OPTIONAL ATTACHMENT */}

                          <TableCell>
                            {record.status === 'excused' ? (
                              <Box className='flex min-w-[160px] flex-col items-start gap-1'>
                                <Typography variant='body2'>
                                  {record.excuseReason || 'Alasan belum diisi'}
                                </Typography>

                                {record.attachment ? (
                                  <Tooltip title={record.attachment.name}>
                                    <Chip
                                      size='small'
                                      variant='outlined'
                                      icon={<i className='tabler-paperclip' />}
                                      label='Ada lampiran'
                                    />
                                  </Tooltip>
                                ) : (
                                  <Typography variant='caption' color='text.secondary'>
                                    Tanpa lampiran
                                  </Typography>
                                )}

                                <Chip
                                  size='small'
                                  variant='tonal'
                                  color={record.excuseVerified ? 'success' : 'warning'}
                                  label={record.excuseVerified ? 'Terverifikasi' : 'Belum diverifikasi'}
                                />
                              </Box>
                            ) : (
                              <Typography variant='body2' color='text.secondary'>
                                {record.notes || '—'}
                              </Typography>
                            )}
                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell align='right'>
                            <Box className='flex justify-end gap-1'>
                              <Tooltip title='Detail absensi'>
                                <IconButton
                                  size='small'
                                  onClick={() => setDetailRecord(record)}
                                >
                                  <i className='tabler-eye text-lg' />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title='Koreksi absensi'>
                                <IconButton
                                  size='small'
                                  color='primary'
                                  disabled={activeSession.status === 'cancelled'}
                                  onClick={() => openEditRecord(record)}
                                >
                                  <i className='tabler-edit text-lg' />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title='Riwayat perubahan'>
                                <IconButton
                                  size='small'
                                  onClick={() => setAuditRecord(record)}
                                >
                                  <i className='tabler-history text-lg' />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}

                    {pageRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Box className='flex flex-col items-center gap-2 py-10 text-center'>
                            <i className='tabler-user-search text-4xl text-textSecondary' />
                            <Typography variant='body1' className='font-medium'>
                              Data absensi tidak ditemukan
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              Coba ubah kata kunci atau filter status.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component='div'
                count={filteredRecords.length}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={event => {
                  setRowsPerPage(Number(event.target.value))
                  setPage(0)
                }}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Baris per halaman'
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} dari ${count}`
                }
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* SESSION CORRECTION DIALOG */}

      <Dialog
        open={sessionDialogOpen}
        onClose={() => setSessionDialogOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle className='flex items-start gap-3 pb-3'>
          <Avatar variant='rounded' className='bs-11 is-11 bg-primaryLight text-primary'>
            <i className='tabler-calendar-edit text-xl' />
          </Avatar>

          <Box className='min-w-0 flex-1'>
            <Typography variant='h6' className='font-semibold'>
              Koreksi Jadwal
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Ubah waktu atau lokasi sesi yang dipilih.
            </Typography>
          </Box>

          <IconButton
            size='small'
            aria-label='Tutup dialog'
            onClick={() => setSessionDialogOpen(false)}
          >
            <i className='tabler-x text-xl' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box className='flex flex-col gap-4 pt-4'>
            <TextField
              label='Tanggal'
              type='date'
              value={sessionForm.date}
              onChange={event =>
                setSessionForm(current => ({ ...current, date: event.target.value }))
              }
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              required
            />

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <TextField
                label='Jam mulai'
                type='time'
                value={sessionForm.startTime}
                onChange={event =>
                  setSessionForm(current => ({ ...current, startTime: event.target.value }))
                }
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                required
              />

              <TextField
                label='Jam selesai'
                type='time'
                value={sessionForm.endTime}
                onChange={event =>
                  setSessionForm(current => ({ ...current, endTime: event.target.value }))
                }
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                required
              />
            </Box>

            <TextField
              label='Lokasi'
              value={sessionForm.location}
              onChange={event =>
                setSessionForm(current => ({ ...current, location: event.target.value }))
              }
              fullWidth
            />

            <TextField
              label='Alasan perubahan'
              value={sessionReason}
              onChange={event => {
                setSessionReason(event.target.value)
                setSessionError('')
              }}
              multiline
              minRows={2}
              required
              error={Boolean(sessionError)}
              helperText={sessionError || 'Wajib diisi untuk riwayat perubahan.'}
            />

            <Box className='rounded-lg border border-info/30 bg-info/5 p-3'>
              <Typography variant='body2' color='info.main'>
                ID sesi tidak berubah. Semua catatan absensi tetap terhubung ke sesi ini.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions className='flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row'>
          <Button
            onClick={() => setSessionDialogOpen(false)}
            color='secondary'
            variant='outlined'
            startIcon={<i className='tabler-x' />}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={saveSession}
            startIcon={<i className='tabler-device-floppy' />}
          >
            Simpan perubahan
          </Button>
        </DialogActions>
      </Dialog>

      {/* ATTENDANCE DETAIL DIALOG */}

      <Dialog
        open={Boolean(detailRecord)}
        onClose={() => setDetailRecord(null)}
        fullWidth
        maxWidth='sm'
      >
        {detailRecord && (
          <>
            <DialogTitle className='flex items-start justify-between gap-3'>
              <Box>
                <Typography variant='h6' className='font-semibold'>
                  Detail Absensi
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {detailRecord.id} · {detailRecord.participantId}
                </Typography>
              </Box>
              <IconButton size='small' onClick={() => setDetailRecord(null)}>
                <i className='tabler-x text-xl' />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Box className='flex flex-col gap-4'>
                <Box className='flex items-center gap-3'>
                  <Avatar src={detailRecord.avatar} sx={{ width: 52, height: 52 }}>
                    {detailRecord.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle1' className='font-semibold'>
                      {detailRecord.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {detailRecord.email}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {detailRecord.institution}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <InfoGrid
                  items={[
                    ['Status', statusConfig[detailRecord.status].label],
                    ['Jam check-in', detailRecord.checkIn ?? 'Tidak ada check-in'],
                    ['Metode', methodLabels[detailRecord.method]],
                    ['Pencatat terakhir', `${detailRecord.recordedBy.name} · ${detailRecord.recordedBy.role}`],
                    ['Waktu pencatatan', formatDateTime(detailRecord.recordedAt)],
                    ['Alasan izin', detailRecord.status === 'excused' ? detailRecord.excuseReason || 'Belum ada alasan' : '—'],
                    ['Verifikasi izin', detailRecord.status === 'excused' ? detailRecord.excuseVerified ? `Terverifikasi oleh ${detailRecord.excuseVerifiedBy?.name ?? 'Admin'}` : 'Belum diverifikasi' : '—'],
                    ['Waktu verifikasi', formatDateTime(detailRecord.excuseVerifiedAt)],
                    ['Catatan', detailRecord.notes || '—']
                  ]}
                />

                {detailRecord.attachment && (
                  <Box className='rounded-lg border border-divider p-3'>
                    <Typography variant='body2' className='mb-2 font-medium'>
                      Lampiran izin
                    </Typography>
                    <Box className='flex items-center gap-2'>
                      <i className='tabler-paperclip text-lg text-primary' />
                      <Typography variant='body2' className='flex-1 break-all'>
                        {detailRecord.attachment.name}
                      </Typography>
                      {detailRecord.attachment.url !== '#dummy-attachment' && (
                        <Button
                          size='small'
                          onClick={() => window.open(detailRecord.attachment!.url, '_blank')}
                        >
                          Lihat
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}

                {detailRecord.status === 'excused' && (
                  <Button
                    variant='outlined'
                    color={detailRecord.excuseVerified ? 'warning' : 'success'}
                    startIcon={
                      <i className={detailRecord.excuseVerified ? 'tabler-shield-x' : 'tabler-shield-check'} />
                    }
                    onClick={() => toggleVerification(detailRecord)}
                  >
                    {detailRecord.excuseVerified ? 'Batalkan verifikasi' : 'Verifikasi izin'}
                  </Button>
                )}
              </Box>
            </DialogContent>

            <DialogActions>
              <Button
                startIcon={<i className='tabler-history' />}
                onClick={() => {
                  setAuditRecord(detailRecord)
                  setDetailRecord(null)
                }}
              >
                Riwayat
              </Button>
              <Button
                variant='contained'
                startIcon={<i className='tabler-edit' />}
                disabled={activeSession?.status === 'cancelled'}
                onClick={() => {
                  openEditRecord(detailRecord)
                  setDetailRecord(null)
                }}
              >
                Koreksi
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ATTENDANCE CORRECTION DIALOG */}

      <Dialog
        open={Boolean(editRecord)}
        onClose={() => setEditRecord(null)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle className='flex items-start gap-3'>
          <Avatar variant='rounded' className='bs-11 is-11 bg-primaryLight text-primary'>
            <i className='tabler-edit text-xl' />
          </Avatar>
          <Box className='flex-1'>
            <Typography variant='h6' className='font-semibold'>
              Koreksi Absensi
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {editRecord?.name} · {editRecord?.participantId}
            </Typography>
          </Box>
          <IconButton size='small' onClick={() => setEditRecord(null)}>
            <i className='tabler-x text-xl' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box className='flex flex-col gap-4 pt-4'>
            <TextField
              select
              fullWidth
              label='Status kehadiran'
              value={editStatus}
              onChange={event => {
                setEditStatus(event.target.value as AttendanceStatus)
                setEditError('')
              }}
            >
              <MenuItem value='present'>Hadir</MenuItem>
              <MenuItem value='late'>Terlambat</MenuItem>
              <MenuItem value='excused'>Izin</MenuItem>
              <MenuItem value='absent'>Belum hadir</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label='Metode pencatatan'
              value={editMethod}
              onChange={event => setEditMethod(event.target.value as AttendanceRecord['method'])}
            >
              <MenuItem value='self'>Mandiri oleh peserta</MenuItem>
              <MenuItem value='face-recognition'>Face recognition</MenuItem>
              <MenuItem value='qr-code'>QR code</MenuItem>
              <MenuItem value='manual'>Manual oleh pelatih / admin</MenuItem>
            </TextField>

            {(editStatus === 'present' || editStatus === 'late') && (
              <TextField
                fullWidth
                label='Jam check-in sebenarnya'
                type='time'
                value={editCheckIn}
                onChange={event => setEditCheckIn(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText='Bukan waktu admin melakukan koreksi.'
              />
            )}

            {editStatus === 'excused' && (
              <>
                <TextField
                  fullWidth
                  label='Alasan izin'
                  required
                  multiline
                  minRows={2}
                  value={editExcuseReason}
                  onChange={event => setEditExcuseReason(event.target.value)}
                  placeholder='Contoh: sakit atau keperluan keluarga.'
                />

                <Box>
                  <Typography variant='body2' className='mb-2 font-medium'>
                    Lampiran pendukung (opsional)
                  </Typography>

                  <Button
                    component='label'
                    variant='outlined'
                    startIcon={<i className='tabler-paperclip' />}
                  >
                    Pilih file
                    <input
                      hidden
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
                      onChange={event => handleAttachment(event.target.files?.[0] ?? null)}
                    />
                  </Button>

                  {editAttachment && !removeAttachment && (
                    <Box className='mt-2 flex items-center gap-2'>
                      <i className='tabler-file-description text-lg' />
                      <Typography variant='body2' className='flex-1 break-all'>
                        {editAttachment.name}
                      </Typography>
                      <IconButton size='small' color='error' onClick={() => setRemoveAttachment(true)}>
                        <i className='tabler-trash' />
                      </IconButton>
                    </Box>
                  )}

                  <Typography variant='caption' color='text.secondary' display='block' className='mt-1'>
                    Surat izin tidak wajib dilampirkan.
                  </Typography>
                </Box>

                <TextField
                  select
                  fullWidth
                  label='Verifikasi izin'
                  value={editVerified ? 'yes' : 'no'}
                  onChange={event => setEditVerified(event.target.value === 'yes')}
                >
                  <MenuItem value='no'>Belum diverifikasi</MenuItem>
                  <MenuItem value='yes'>Terverifikasi oleh admin</MenuItem>
                </TextField>
              </>
            )}

            <TextField
              fullWidth
              multiline
              minRows={2}
              label='Catatan'
              value={editNotes}
              onChange={event => setEditNotes(event.target.value)}
              placeholder='Catatan tambahan (opsional)'
            />

            <TextField
              fullWidth
              multiline
              minRows={2}
              label='Alasan koreksi'
              required
              value={editReason}
              onChange={event => {
                setEditReason(event.target.value)
                setEditError('')
              }}
              error={Boolean(editError)}
              helperText={editError || 'Wajib diisi agar perubahan dapat ditelusuri.'}
            />

            <Box className='rounded-lg border border-divider p-3'>
              <Typography variant='caption' color='text.secondary'>
                Dicatat oleh
              </Typography>
              <Box className='mt-2 flex items-center gap-2'>
                <Avatar src={adminActor.avatar} sx={{ width: 32, height: 32 }} />
                <Box>
                  <Typography variant='body2' className='font-medium'>
                    {adminActor.name}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Admin · waktu koreksi otomatis
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions className='px-6 py-4'>
          <Button color='secondary' onClick={() => setEditRecord(null)}>
            Batal
          </Button>
          <Button
            variant='contained'
            startIcon={<i className='tabler-device-floppy' />}
            onClick={saveRecordCorrection}
          >
            Simpan koreksi
          </Button>
        </DialogActions>
      </Dialog>

      {/* AUDIT LOG DIALOG */}

      <Dialog
        open={Boolean(auditRecord)}
        onClose={() => setAuditRecord(null)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle className='flex items-center justify-between gap-3'>
          <Box>
            <Typography variant='h6' className='font-semibold'>
              Riwayat Perubahan
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {auditRecord?.id} · {auditRecord?.name}
            </Typography>
          </Box>
          <IconButton size='small' onClick={() => setAuditRecord(null)}>
            <i className='tabler-x text-xl' />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {!auditRecord?.auditLogs.length ? (
            <Box className='flex flex-col items-center gap-2 py-8 text-center'>
              <i className='tabler-history text-4xl text-textSecondary' />
              <Typography variant='body1' className='font-medium'>
                Belum ada riwayat perubahan
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Koreksi berikutnya akan tercatat di sini.
              </Typography>
            </Box>
          ) : (
            <Box className='flex flex-col'>
              {auditRecord.auditLogs.slice().reverse().map((log, index) => (
                <Box key={log.id}>
                  <Box className='flex gap-3 py-3'>
                    <Avatar src={log.actor.avatar} sx={{ width: 36, height: 36 }} />
                    <Box className='min-w-0 flex-1'>
                      <Typography variant='body2' className='font-semibold'>
                        {log.action}
                      </Typography>
                      <Typography variant='body2' color='text.secondary' className='mt-1'>
                        {log.description}
                      </Typography>
                      <Typography variant='caption' display='block' className='mt-1'>
                        {log.actor.name} · {log.actor.role}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatDateTime(log.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                  {index < auditRecord.auditLogs.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAuditRecord(null)}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* SCHEDULE AUDIT SUMMARY */}

      {scheduleLogs.length > 0 && (
        <Card>
          <CardContent className='flex flex-col gap-3 p-4 sm:p-5'>
            <Typography variant='h6' className='font-semibold'>
              Riwayat Koreksi Jadwal
            </Typography>
            {scheduleLogs.slice().reverse().map(log => (
              <Box key={log.id} className='flex items-start gap-3'>
                <Avatar src={log.actor.avatar} sx={{ width: 32, height: 32 }} />
                <Box className='min-w-0 flex-1'>
                  <Typography variant='body2' className='font-medium'>
                    {log.actor.name} · {log.actor.role}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {log.description}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {formatDateTime(log.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Box className='flex items-start gap-2 rounded-xl border border-info/20 bg-infoLight p-4'>
        <i className='tabler-info-circle mt-0.5 text-xl text-info' />
        <Box>
          <Typography variant='body2' className='font-medium'>
            Mode demonstrasi
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Data absensi, pencatat, dan audit trail masih dummy. Perubahan jadwal
            dan koreksi hanya tersimpan di state halaman sampai halaman dimuat ulang.
            Lampiran file juga masih menggunakan URL sementara browser.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

type SessionInfoProps = {
  icon: string
  label: string
  value: string
}

const SessionInfo = ({ icon, label, value }: SessionInfoProps) => (
  <Box className='flex min-w-0 items-start gap-2'>
    <i className={`${icon} mt-0.5 shrink-0 text-lg text-textSecondary`} />
    <Box className='min-w-0'>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body2' className='break-words font-medium'>
        {value}
      </Typography>
    </Box>
  </Box>
)

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <Box className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
      {items.map(([label, value]) => (
        <Box key={label} className='min-w-0'>
          <Typography variant='caption' color='text.secondary' className='block'>
            {label}
          </Typography>
          <Typography variant='body2' className='break-words font-medium'>
            {value || '—'}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default AttendanceTab

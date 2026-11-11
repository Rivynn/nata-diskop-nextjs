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
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import type { TrainingRecord } from '@/types/admin/trainingTypes'

type Props = {
  data?: TrainingRecord
}

type EmploymentStatus = 'working' | 'looking' | 'not_looking' | 'not_submitted'
type SessionStatus = 'scheduled' | 'open' | 'closed'

type Participant = {
  id: string
  avatar: string
  name: string
  email: string
  phone: string
  training: string
  completedAt: string
}

type MonitoringResponse = {
  participantId: string
  employmentStatus: EmploymentStatus
  jobTitle: string
  company: string
  employmentType: string
  jobSearchDuration: string
  obstacles: string[]
  otherObstacle: string
  notes: string
  submittedAt: string
  needsFollowUp: boolean
  followUpNote: string
}

type MonitoringSession = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: SessionStatus
  createdAt: string
  responses: MonitoringResponse[]
}

const employmentConfig: Record<
  EmploymentStatus,
  {
    label: string
    color: 'success' | 'warning' | 'info' | 'default'
  }
> = {
  working: { label: 'Sudah bekerja', color: 'success' },
  looking: { label: 'Belum bekerja', color: 'warning' },
  not_looking: { label: 'Belum mencari kerja', color: 'info' },
  not_submitted: { label: 'Belum mengisi', color: 'default' }
}

const sessionConfig: Record<
  SessionStatus,
  {
    label: string
    color: 'success' | 'info' | 'default'
  }
> = {
  open: { label: 'Sedang dibuka', color: 'success' },
  scheduled: { label: 'Terjadwal', color: 'info' },
  closed: { label: 'Ditutup', color: 'default' }
}

const obstacleOptions = [
  'Kurang pengalaman kerja',
  'Portofolio belum memadai',
  'Kurang keterampilan teknis',
  'Kesulitan wawancara',
  'Lowongan pekerjaan terbatas',
  'Persyaratan pendidikan',
  'Lokasi pekerjaan terlalu jauh',
  'Kendala biaya transportasi',
  'Kendala pribadi atau keluarga',
  'Kendala lainnya'
]

const initialParticipants: Participant[] = [
  {
    id: 'PST-2026-001',
    avatar: 'https://i.pravatar.cc/160?img=12',
    name: 'Aditya Pratama',
    email: 'aditya@example.com',
    phone: '081234567801',
    training: 'Web Development',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-002',
    avatar: 'https://i.pravatar.cc/160?img=47',
    name: 'Nadia Putri',
    email: 'nadia@example.com',
    phone: '081234567802',
    training: 'Digital Marketing',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-003',
    avatar: 'https://i.pravatar.cc/160?img=11',
    name: 'Rizky Ramadhan',
    email: 'rizky@example.com',
    phone: '081234567803',
    training: 'Web Development',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-004',
    avatar: 'https://i.pravatar.cc/160?img=44',
    name: 'Siti Rahmawati',
    email: 'siti@example.com',
    phone: '081234567804',
    training: 'Digital Marketing',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-005',
    avatar: 'https://i.pravatar.cc/160?img=13',
    name: 'Muhammad Fajar',
    email: 'fajar@example.com',
    phone: '081234567805',
    training: 'Web Development',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-006',
    avatar: 'https://i.pravatar.cc/160?img=49',
    name: 'Dewi Anggraini',
    email: 'dewi@example.com',
    phone: '081234567806',
    training: 'Administrasi Perkantoran',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-007',
    avatar: 'https://i.pravatar.cc/160?img=45',
    name: 'Putri Amelia',
    email: 'putri@example.com',
    phone: '081234567807',
    training: 'Digital Marketing',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-008',
    avatar: 'https://i.pravatar.cc/160?img=14',
    name: 'Andi Saputra',
    email: 'andi@example.com',
    phone: '081234567808',
    training: 'Web Development',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-009',
    avatar: 'https://i.pravatar.cc/160?img=15',
    name: 'Fauzan Akbar',
    email: 'fauzan@example.com',
    phone: '081234567809',
    training: 'Administrasi Perkantoran',
    completedAt: '2026-01-12'
  },
  {
    id: 'PST-2026-010',
    avatar: 'https://i.pravatar.cc/160?img=46',
    name: 'Maya Safitri',
    email: 'maya@example.com',
    phone: '081234567810',
    training: 'Digital Marketing',
    completedAt: '2026-01-12'
  }
]

const createResponse = (
  participantId: string,
  values: Partial<MonitoringResponse> = {}
): MonitoringResponse => ({
  participantId,
  employmentStatus: 'not_submitted',
  jobTitle: '',
  company: '',
  employmentType: '',
  jobSearchDuration: '',
  obstacles: [],
  otherObstacle: '',
  notes: '',
  submittedAt: '',
  needsFollowUp: false,
  followUpNote: '',
  ...values
})

const initialSessions: MonitoringSession[] = [
  {
    id: 'MON-2026-001',
    title: 'Monitoring Alumni Gelombang 1',
    description: 'Pendataan status pekerjaan dan kendala alumni setelah pelatihan.',
    startDate: '2026-10-10',
    endDate: '2026-10-31',
    status: 'open',
    createdAt: '2026-10-01',
    responses: [
      createResponse('PST-2026-001', {
        employmentStatus: 'working',
        jobTitle: 'Junior Web Developer',
        company: 'PT Digital Nusantara',
        employmentType: 'Full-time',
        notes: 'Mendapatkan pekerjaan sekitar dua bulan setelah pelatihan.',
        submittedAt: '2026-10-11'
      }),
      createResponse('PST-2026-002', {
        employmentStatus: 'looking',
        jobSearchDuration: '1–3 bulan',
        obstacles: ['Kurang pengalaman kerja', 'Portofolio belum memadai'],
        notes: 'Sudah melamar ke beberapa perusahaan, tetapi belum mendapat panggilan.',
        submittedAt: '2026-10-11',
        needsFollowUp: true,
        followUpNote: 'Perlu pendampingan membangun portofolio.'
      }),
      createResponse('PST-2026-003', {
        employmentStatus: 'looking',
        jobSearchDuration: 'Lebih dari 3 bulan',
        obstacles: ['Kesulitan wawancara', 'Lowongan pekerjaan terbatas'],
        notes: 'Membutuhkan latihan wawancara.',
        submittedAt: '2026-10-12',
        needsFollowUp: true,
        followUpNote: 'Disarankan mengikuti persiapan wawancara.'
      }),
      createResponse('PST-2026-004', {
        employmentStatus: 'working',
        jobTitle: 'Digital Marketing Staff',
        company: 'CV Kreatif Mandiri',
        employmentType: 'Contract',
        notes: 'Bekerja di bidang sesuai kompetensi pelatihan.',
        submittedAt: '2026-10-12'
      }),
      createResponse('PST-2026-006', {
        employmentStatus: 'not_looking',
        obstacles: ['Kendala pribadi atau keluarga'],
        notes: 'Belum aktif mencari pekerjaan saat ini.',
        submittedAt: '2026-10-13',
        needsFollowUp: true,
        followUpNote: 'Tanyakan kembali kesiapan mencari kerja.'
      }),
      createResponse('PST-2026-007', {
        employmentStatus: 'working',
        jobTitle: 'Social Media Specialist',
        company: 'PT Media Kreatif',
        employmentType: 'Full-time',
        submittedAt: '2026-10-13'
      })
    ]
  }
]

const formatDate = (value: string) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`))
}

const todayString = () => new Date().toISOString().slice(0, 10)

const StatCard = ({
  label,
  value,
  hint,
  icon,
  color
}: {
  label: string
  value: number | string
  hint: string
  icon: string
  color: string
}) => (
  <Card variant='outlined' className='h-full transition-shadow hover:shadow-sm'>
    <CardContent className='flex items-start justify-between gap-3 p-5'>
      <Box className='min-w-0'>
        <Typography variant='body2' color='text.secondary'>
          {label}
        </Typography>
        <Typography variant='h4' className='mt-2 font-semibold tracking-tight'>
          {value}
        </Typography>
        <Typography variant='caption' color='text.secondary' className='mt-1 block'>
          {hint}
        </Typography>
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
  color = 'default'
}: {
  title: string
  icon: string
  onClick: () => void
  color?: 'default' | 'primary' | 'success' | 'error' | 'warning'
}) => (
  <Tooltip title={title} arrow>
    <span>
      <IconButton
        size='small'
        color={color}
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
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Box className='mt-1 flex items-start gap-2'>
      {icon && <i className={`${icon} mt-0.5 text-[18px] text-textSecondary`} />}
      <Typography variant='body2' className='break-words font-medium'>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
)

const PostTrainingTab = ({ data }: Props) => {
  const title = data?.title || 'Program Pelatihan'
  const slug = data?.slug || data?.id || 'pasca-pelatihan'

  const [participants] = useState<Participant[]>(initialParticipants)
  const [sessions, setSessions] = useState<MonitoringSession[]>(initialSessions)
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessions[0].id)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [profileId, setProfileId] = useState<string | null>(null)
  const [followUpNote, setFollowUpNote] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  })

  const selectedSession =
    sessions.find(item => item.id === selectedSessionId) ?? null

  const sessionResponses = selectedSession?.responses ?? []

  const rows = useMemo(
    () =>
      participants.map(participant => ({
        participant,
        response:
          sessionResponses.find(item => item.participantId === participant.id) ??
          createResponse(participant.id)
      })),
    [participants, sessionResponses]
  )

  const selectedProfile = profileId
    ? rows.find(item => item.participant.id === profileId) ?? null
    : null

  const stats = useMemo(() => {
    const submitted = sessionResponses.filter(
      item => item.employmentStatus !== 'not_submitted'
    )
    const working = submitted.filter(item => item.employmentStatus === 'working')
    const looking = submitted.filter(item => item.employmentStatus === 'looking')
    const followUp = sessionResponses.filter(item => item.needsFollowUp)

    return {
      total: participants.length,
      submitted: submitted.length,
      working: working.length,
      looking: looking.length,
      notLooking: submitted.filter(item => item.employmentStatus === 'not_looking').length,
      notSubmitted: participants.length - submitted.length,
      followUp: followUp.length,
      employmentRate: submitted.length
        ? Math.round((working.length / submitted.length) * 100)
        : 0
    }
  }, [participants.length, sessionResponses])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rows.filter(({ participant, response }) => {
      const matchesSearch =
        !query ||
        participant.name.toLowerCase().includes(query) ||
        participant.email.toLowerCase().includes(query) ||
        participant.id.toLowerCase().includes(query) ||
        participant.training.toLowerCase().includes(query) ||
        response.company.toLowerCase().includes(query) ||
        response.jobTitle.toLowerCase().includes(query) ||
        response.obstacles.some(item => item.toLowerCase().includes(query)) ||
        response.otherObstacle.toLowerCase().includes(query)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'follow_up' && response.needsFollowUp) ||
        response.employmentStatus === filter

      return matchesSearch && matchesFilter
    })
  }, [rows, search, filter])

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const updateSelectedSession = (
    updater: (session: MonitoringSession) => MonitoringSession
  ) => {
    setSessions(current =>
      current.map(session =>
        session.id === selectedSessionId ? updater(session) : session
      )
    )
  }

  const updateResponse = (
    participantId: string,
    updater: (response: MonitoringResponse) => MonitoringResponse
  ) => {
    updateSelectedSession(session => {
      const existing = session.responses.find(
        item => item.participantId === participantId
      )

      const currentResponse = existing ?? createResponse(participantId)
      const nextResponse = updater(currentResponse)

      const responses = existing
        ? session.responses.map(item =>
            item.participantId === participantId ? nextResponse : item
          )
        : [...session.responses, nextResponse]

      return { ...session, responses }
    })
  }

  const exportCsv = () => {
    const csvRows = filteredRows.map(({ participant, response }) => [
      selectedSession?.title ?? '',
      participant.id,
      participant.name,
      participant.email,
      participant.phone,
      participant.training,
      participant.completedAt,
      employmentConfig[response.employmentStatus].label,
      response.jobTitle,
      response.company,
      response.employmentType,
      response.jobSearchDuration,
      [...response.obstacles, response.otherObstacle].filter(Boolean).join('; '),
      response.notes,
      response.needsFollowUp ? 'Ya' : 'Tidak',
      response.followUpNote,
      response.submittedAt
    ])

    const headers = [
      'Sesi Monitoring',
      'ID Peserta',
      'Nama',
      'Email',
      'Telepon',
      'Pelatihan',
      'Tanggal Selesai',
      'Status Pekerjaan',
      'Posisi',
      'Perusahaan',
      'Jenis Pekerjaan',
      'Lama Mencari Kerja',
      'Kendala',
      'Catatan',
      'Perlu Tindak Lanjut',
      'Catatan Tindak Lanjut',
      'Tanggal Pengisian'
    ]

    const csv = [headers, ...csvRows]
      .map(row =>
        row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')
)
.join('\n')

const url = URL.createObjectURL(
  new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
)
const anchor = document.createElement('a')

anchor.href = url
anchor.download = `monitoring-${slug}-${selectedSession?.id ?? 'data'}.csv`
document.body.appendChild(anchor)
anchor.click()
anchor.remove()
URL.revokeObjectURL(url)
}

const createSession = () => {
  if (
    !sessionForm.title.trim() ||
    !sessionForm.startDate ||
    !sessionForm.endDate ||
    sessionForm.startDate < todayString() ||
    sessionForm.endDate < sessionForm.startDate
  ) {
    return
  }

  const today = todayString()
  const status: SessionStatus =
    sessionForm.startDate > today ? 'scheduled' : 'open'

  const newSession: MonitoringSession = {
    id: `MON-${new Date().getFullYear()}-${String(sessions.length + 1).padStart(3, '0')}`,
    title: sessionForm.title.trim(),
    description: sessionForm.description.trim(),
    startDate: sessionForm.startDate,
    endDate: sessionForm.endDate,
    status,
    createdAt: today,
    responses: []
  }

  setSessions(current => [newSession, ...current])
  setSelectedSessionId(newSession.id)
  setSearch('')
  setFilter('all')
  setPage(0)
  setSessionForm({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  })
  setCreateDialogOpen(false)
}

const toggleSession = () => {
  if (!selectedSession) return

  const today = todayString()

  if (
    selectedSession.status !== 'open' &&
    selectedSession.startDate > today
  ) {
    return
  }

  const nextStatus: SessionStatus =
    selectedSession.status === 'open' ? 'closed' : 'open'

  setSessions(current =>
    current.map(item =>
      item.id === selectedSession.id
        ? { ...item, status: nextStatus }
        : item
    )
  )
}

const renderEmploymentStatus = (status: EmploymentStatus) => (
  <Chip
    size='small'
    variant='tonal'
    color={employmentConfig[status].color}
    label={employmentConfig[status].label}
  />
)

const renderSessionStatus = (status: SessionStatus) => (
  <Chip
    size='small'
    variant='tonal'
    color={sessionConfig[status].color}
    label={sessionConfig[status].label}
  />
)

return (
  <Box className='flex flex-col gap-5'>
    {/* Header */}
    <Box className='flex flex-wrap items-start justify-between gap-3'>
      <Box>
        <Typography variant='h5' className='font-semibold'>
          Pasca Pelatihan
        </Typography>
        <Typography variant='body2' color='text.secondary' className='mt-1'>
          Pantau status pekerjaan alumni program {title} dan identifikasi
          kendala yang membutuhkan tindak lanjut.
        </Typography>
      </Box>

      <Button
        variant='contained'
        startIcon={<i className='tabler-plus text-lg' />}
        onClick={() => setCreateDialogOpen(true)}
      >
        Buat Sesi Monitoring
      </Button>
    </Box>

    <Alert severity='info' icon={<i className='tabler-info-circle text-xl' />}>
      Pilih sesi untuk melihat data khusus periode tersebut. Setiap sesi
      menyimpan responsnya sendiri, sehingga data monitoring sebelumnya tidak
      tercampur dengan sesi yang baru.
    </Alert>

    {/* Session selector */}
    <Card variant='outlined'>
      <CardContent className='flex flex-col gap-4 p-5'>
        <Box className='flex flex-wrap items-start justify-between gap-3'>
          <Box>
            <Typography variant='h6' className='font-semibold'>
              Sesi Monitoring
            </Typography>
            <Typography variant='body2' color='text.secondary' className='mt-1'>
              Pilih periode monitoring yang ingin dikelola.
            </Typography>
          </Box>

          {selectedSession && renderSessionStatus(selectedSession.status)}
        </Box>

        <Box className='grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end'>
          <Box>
            <Typography variant='caption' color='text.secondary' className='mb-1 block'>
              Sesi yang dipilih
            </Typography>
            <Select
              fullWidth
              size='small'
              value={selectedSessionId}
              onChange={event => {
                setSelectedSessionId(event.target.value)
                setSearch('')
                setFilter('all')
                setPage(0)
                setProfileId(null)
              }}
              displayEmpty
              aria-label='Pilih sesi monitoring'
            >
              {sessions.map(session => (
                <MenuItem key={session.id} value={session.id}>
                  {session.title} — {sessionConfig[session.status].label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box className='flex flex-wrap gap-2'>
            <Button
              variant='outlined'
              color={selectedSession?.status === 'open' ? 'warning' : 'success'}
              disabled={
                !selectedSession ||
                (selectedSession.status !== 'open' &&
                  selectedSession.startDate > todayString())
              }
              startIcon={
                <i
                  className={
                    selectedSession?.status === 'open'
                      ? 'tabler-lock'
                      : 'tabler-lock-open'
                  }
                />
              }
              onClick={toggleSession}
            >
              {selectedSession?.status === 'open' ? 'Tutup Sesi' : 'Buka Sesi'}
            </Button>

            <Button
              variant='contained'
              startIcon={<i className='tabler-calendar-plus text-lg' />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Tambah Sesi
            </Button>
          </Box>
        </Box>

        {selectedSession && (
          <>
            <Divider />

            <Box className='flex flex-wrap items-start justify-between gap-3'>
              <Box className='min-w-0 flex-1'>
                <Typography variant='subtitle1' className='font-semibold'>
                  {selectedSession.title}
                </Typography>
                <Typography variant='body2' color='text.secondary' className='mt-1'>
                  {selectedSession.description || 'Tidak ada deskripsi sesi.'}
                </Typography>
                <Typography variant='caption' color='text.secondary' className='mt-2 block'>
                  <i className='tabler-calendar-event mr-1 align-middle' />
                  {formatDate(selectedSession.startDate)} – {formatDate(selectedSession.endDate)}
                </Typography>
              </Box>

              <Box className='min-w-[180px]'>
                <Box className='mb-1 flex justify-between gap-2'>
                  <Typography variant='caption' color='text.secondary'>
                    Respons masuk
                  </Typography>
                  <Typography variant='caption' className='font-medium'>
                    {stats.submitted}/{stats.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={stats.total ? (stats.submitted / stats.total) * 100 : 0}
                  sx={{ height: 7, borderRadius: 4 }}
                />
              </Box>
            </Box>

            {selectedSession.status === 'closed' && (
              <Alert severity='warning'>
                Sesi ini telah ditutup. Buka kembali sesi jika ingin melanjutkan
                pengelolaan data monitoring.
              </Alert>
            )}

            {selectedSession.status === 'scheduled' && (
              <Alert severity='info'>
                Sesi ini belum dibuka. Sesi dapat dibuka ketika tanggal mulai
                sudah tiba.
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>

    {/* Statistics for selected session only */}
    <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <StatCard
        label='Total alumni'
        value={stats.total}
        hint='Peserta dalam program pelatihan'
        icon='tabler-users'
        color='bg-primary/10 text-primary'
      />
      <StatCard
        label='Sudah bekerja'
        value={stats.working}
        hint={`${stats.employmentRate}% dari respons masuk`}
        icon='tabler-briefcase'
        color='bg-success/10 text-success'
      />
      <StatCard
        label='Belum bekerja'
        value={stats.looking}
        hint='Masih mencari pekerjaan'
        icon='tabler-search'
        color='bg-warning/10 text-warning'
      />
      <StatCard
        label='Perlu tindak lanjut'
        value={stats.followUp}
        hint={`${stats.notSubmitted} belum mengisi sesi ini`}
        icon='tabler-message-circle'
        color='bg-error/10 text-error'
      />
    </Box>

    {/* Alumni table */}
    <Card>
      <CardContent className='flex flex-col gap-5 p-5'>
        <Box className='flex flex-wrap items-start justify-between gap-3'>
          <Box>
            <Typography variant='h6' className='font-semibold'>
              Data Alumni
            </Typography>
            <Typography variant='body2' color='text.secondary' className='mt-1'>
              Respons khusus sesi: {selectedSession?.title ?? 'Belum ada sesi'}.
            </Typography>
          </Box>

          <Button
            variant='outlined'
            startIcon={<i className='tabler-download text-lg' />}
            onClick={exportCsv}
            disabled={!selectedSession}
          >
            Ekspor data
          </Button>
        </Box>

        <Box className='flex flex-col gap-3 md:flex-row md:items-center'>
          <TextField
            fullWidth
            size='small'
            placeholder='Cari nama, email, ID, pekerjaan, atau kendala...'
            value={search}
            onChange={event => {
              setSearch(event.target.value)
              setPage(0)
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-lg' />
                  </InputAdornment>
                )
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
            aria-label='Filter status pekerjaan'
          >
            <MenuItem value='all'>Semua status</MenuItem>
            <MenuItem value='working'>Sudah bekerja</MenuItem>
            <MenuItem value='looking'>Belum bekerja</MenuItem>
            <MenuItem value='not_looking'>Belum mencari kerja</MenuItem>
            <MenuItem value='not_submitted'>Belum mengisi</MenuItem>
            <MenuItem value='follow_up'>Perlu tindak lanjut</MenuItem>
          </Select>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow>
                <TableCell>Alumni</TableCell>
                <TableCell>Status pekerjaan</TableCell>
                <TableCell>Informasi pekerjaan</TableCell>
                <TableCell>Kendala</TableCell>
                <TableCell>Terakhir mengisi</TableCell>
                <TableCell align='right'>Aksi</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleRows.map(({ participant, response }) => (
                <TableRow key={participant.id} hover>
                  <TableCell sx={{ minWidth: 230 }}>
                    <Box className='flex items-center gap-3'>
                      <Avatar
                        src={participant.avatar}
                        alt={participant.name}
                        sx={{ width: 44, height: 44 }}
                      />
                      <Box className='min-w-0'>
                        <Typography variant='body2' className='font-semibold'>
                          {participant.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' className='block'>
                          {participant.email}
                        </Typography>
                        <Typography variant='caption' color='text.disabled'>
                          {participant.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ minWidth: 155 }}>
                    {renderEmploymentStatus(response.employmentStatus)}
                    {response.needsFollowUp && (
                      <Typography variant='caption' color='warning.main' className='mt-1 block'>
                        Perlu tindak lanjut
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ minWidth: 180 }}>
                    {response.employmentStatus === 'working' ? (
                      <>
                        <Typography variant='body2' className='font-medium'>
                          {response.jobTitle || 'Posisi belum dicatat'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' className='block'>
                          {response.company || 'Perusahaan belum dicatat'}
                        </Typography>
                        {response.employmentType && (
                          <Typography variant='caption' color='text.secondary' className='block'>
                            {response.employmentType}
                          </Typography>
                        )}
                      </>
                    ) : response.employmentStatus === 'looking' ? (
                      <Typography variant='body2'>
                        {response.jobSearchDuration || 'Sedang mencari kerja'}
                      </Typography>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ minWidth: 180, maxWidth: 230 }}>
                    {response.obstacles.length > 0 || response.otherObstacle ? (
                      <Box className='flex flex-wrap gap-1'>
                        {response.obstacles.slice(0, 2).map(obstacle => (
                          <Chip key={obstacle} size='small' variant='outlined' label={obstacle} />
                        ))}
                        {response.otherObstacle && (
                          <Chip size='small' variant='outlined' label={response.otherObstacle} />
                        )}
                        {response.obstacles.length > 2 && (
                          <Chip size='small' label={`+${response.obstacles.length - 2}`} />
                        )}
                      </Box>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        {response.employmentStatus === 'working' ? 'Tidak ada kendala' : '—'}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ minWidth: 130 }}>
                    {formatDate(response.submittedAt)}
                  </TableCell>

                  <TableCell align='right'>
                    <Box className='flex justify-end gap-1'>
                      <ActionIcon
                        title='Lihat detail alumni'
                        icon='tabler-eye'
                        onClick={() => {
                          setProfileId(participant.id)
                          setFollowUpNote(response.followUpNote)
                        }}
                      />
                      <ActionIcon
                        title={
                          response.needsFollowUp
                            ? 'Batalkan tindak lanjut'
                            : 'Tandai tindak lanjut'
                        }
                        icon={response.needsFollowUp ? 'tabler-user-check' : 'tabler-message-circle'}
                        color={response.needsFollowUp ? 'success' : 'warning'}
                        onClick={() => {
                          if (response.needsFollowUp) {
                            updateResponse(participant.id, current => ({
                              ...current,
                              needsFollowUp: false,
                              followUpNote: ''
                            }))
                          } else {
                            setProfileId(participant.id)
                            setFollowUpNote(response.followUpNote)
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box className='flex flex-col items-center gap-2 py-12 text-center'>
                      <i className='tabler-search text-4xl text-textSecondary' />
                      <Typography className='font-semibold'>
                        Alumni tidak ditemukan
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Coba ubah kata kunci atau filter pencarian.
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
          count={filteredRows.length}
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
    </Card>

    <Alert severity='info' icon={<i className='tabler-database text-xl' />}>
      Data masih dummy. Setiap sesi memiliki daftar respons terpisah di frontend.
      Perubahan belum disimpan ke database dan belum dikirim ke akun peserta.
    </Alert>

    {/* Participant detail */}
    <Dialog
      open={Boolean(selectedProfile)}
      onClose={() => setProfileId(null)}
      fullWidth
      maxWidth='md'
    >
      {selectedProfile && (
        <>
          <DialogTitle className='flex items-center justify-between gap-3'>
            <Box className='flex min-w-0 items-center gap-3'>
              <Avatar
                src={selectedProfile.participant.avatar}
                alt={selectedProfile.participant.name}
                sx={{ width: 58, height: 58 }}
              />
              <Box className='min-w-0'>
                <Typography variant='h6' className='font-semibold'>
                  {selectedProfile.participant.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {selectedProfile.participant.id} · {selectedProfile.participant.email}
                </Typography>
                <Box className='mt-2'>
                  {renderEmploymentStatus(selectedProfile.response.employmentStatus)}
                </Box>
              </Box>
            </Box>
            <IconButton onClick={() => setProfileId(null)}>
              <i className='tabler-x' />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Box className='flex flex-col gap-5'>
              <Alert severity='info'>
                Data ini berasal dari sesi <strong>{selectedSession?.title}</strong>.
                Respons pada sesi lain tidak ditampilkan di sini.
              </Alert>

              <Box>
                <Typography variant='subtitle1' className='mb-3 font-semibold'>
                  Informasi alumni
                </Typography>
                <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <Field label='Nama lengkap' value={selectedProfile.participant.name} icon='tabler-user' />
                  <Field label='Email' value={selectedProfile.participant.email} icon='tabler-mail' />
                  <Field label='Nomor telepon' value={selectedProfile.participant.phone} icon='tabler-phone' />
                  <Field label='Program pelatihan' value={selectedProfile.participant.training} icon='tabler-school' />
                  <Field label='Selesai pelatihan' value={formatDate(selectedProfile.participant.completedAt)} icon='tabler-calendar' />
                  <Field label='Tanggal mengisi' value={formatDate(selectedProfile.response.submittedAt)} icon='tabler-calendar-check' />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant='subtitle1' className='mb-3 font-semibold'>
                  Status pekerjaan
                </Typography>

                {selectedProfile.response.employmentStatus === 'working' ? (
                  <Box className='grid grid-cols-1 gap-4 rounded-xl border p-4 sm:grid-cols-2'>
                    <Field label='Posisi' value={selectedProfile.response.jobTitle} icon='tabler-id-badge' />
                    <Field label='Perusahaan' value={selectedProfile.response.company} icon='tabler-building' />
                    <Field label='Jenis pekerjaan' value={selectedProfile.response.employmentType} icon='tabler-file-description' />
                  </Box>
                ) : selectedProfile.response.employmentStatus === 'looking' ? (
                  <Box className='rounded-xl border p-4'>
                    <Field label='Lama mencari kerja' value={selectedProfile.response.jobSearchDuration} icon='tabler-clock' />
                  </Box>
                ) : selectedProfile.response.employmentStatus === 'not_looking' ? (
                  <Alert severity='info'>
                    Alumni belum aktif mencari pekerjaan pada sesi ini.
                  </Alert>
                ) : (
                  <Alert severity='warning'>
                    Alumni belum mengisi monitoring pada sesi ini.
                  </Alert>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant='subtitle1' className='mb-3 font-semibold'>
                  Kendala yang dihadapi
                </Typography>

                {selectedProfile.response.obstacles.length > 0 ||
                selectedProfile.response.otherObstacle ? (
                  <Box className='flex flex-wrap gap-2'>
                    {selectedProfile.response.obstacles.map(obstacle => (
                      <Chip key={obstacle} label={obstacle} variant='outlined' color='warning' />
                    ))}
                    {selectedProfile.response.otherObstacle && (
                      <Chip label={selectedProfile.response.otherObstacle} variant='outlined' color='warning' />
                    )}
                  </Box>
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    Belum ada kendala yang dicatat.
                  </Typography>
                )}
              </Box>

              <Box className='rounded-xl bg-actionHover p-4'>
                <Typography variant='subtitle2' className='font-semibold'>
                  Catatan alumni
                </Typography>
                <Typography variant='body2' color='text.secondary' className='mt-2'>
                  {selectedProfile.response.notes || 'Belum ada catatan dari alumni.'}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant='subtitle1' className='mb-2 font-semibold'>
                  Tindak lanjut admin
                </Typography>

                {selectedProfile.response.needsFollowUp ? (
                  <Alert severity='warning' className='mb-3'>
                    <Typography variant='body2' className='font-semibold'>
                      Alumni perlu ditindaklanjuti.
                    </Typography>
                    {selectedProfile.response.followUpNote && (
                      <Typography variant='body2' className='mt-1'>
                        {selectedProfile.response.followUpNote}
                      </Typography>
                    )}
                  </Alert>
                ) : (
                  <Typography variant='body2' color='text.secondary' className='mb-3'>
                    Tandai alumni jika membutuhkan pendampingan.
                  </Typography>
                )}

                {!selectedProfile.response.needsFollowUp && (
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size='small'
                    label='Catatan tindak lanjut'
                    placeholder='Contoh: Hubungi alumni untuk pendampingan wawancara...'
                    value={followUpNote}
                    onChange={event => setFollowUpNote(event.target.value)}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions className='flex flex-wrap justify-between gap-2 p-4'>
            {selectedProfile.response.needsFollowUp ? (
              <Button
                color='warning'
                startIcon={<i className='tabler-user-minus text-lg' />}
                onClick={() => {
                  updateResponse(selectedProfile.participant.id, current => ({
                    ...current,
                    needsFollowUp: false,
                    followUpNote: ''
                  }))
                  setProfileId(null)
                }}
              >
                Batalkan tindak lanjut
              </Button>
            ) : (
              <Button
                variant='contained'
                startIcon={<i className='tabler-user-check text-lg' />}
                disabled={selectedSession?.status !== 'open'}
                onClick={() => {
                  updateResponse(selectedProfile.participant.id, current => ({
                    ...current,
                    needsFollowUp: true,
                    followUpNote: followUpNote.trim()
                  }))
                  setProfileId(null)
                }}
              >
                Tandai tindak lanjut
              </Button>
            )}

            <Button color='inherit' onClick={() => setProfileId(null)}>
              Tutup
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>

    {/* Create another instance of the same monitoring session */}
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle className='flex items-start gap-3'>
        <Avatar variant='rounded' className='bg-primary/10 text-primary' sx={{ width: 44, height: 44 }}>
          <i className='tabler-calendar-plus text-2xl' />
        </Avatar>
        <Box>
          <Typography variant='h6' className='font-semibold'>
            Tambah Sesi Monitoring
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Buat periode monitoring baru untuk alumni.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box className='flex flex-col gap-4 pt-1'>
          <TextField
            fullWidth
            required
            label='Nama sesi'
            placeholder='Contoh: Monitoring Alumni 6 Bulan'
            value={sessionForm.title}
            onChange={event =>
              setSessionForm(current => ({ ...current, title: event.target.value }))
            }
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label='Deskripsi'
            placeholder='Tujuan atau fokus pendataan alumni...'
            value={sessionForm.description}
            onChange={event =>
              setSessionForm(current => ({ ...current, description: event.target.value }))
            }
          />

          <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <TextField
              fullWidth
              required
              type='date'
              label='Tanggal mulai'
              value={sessionForm.startDate}
              onChange={event =>
                setSessionForm(current => ({ ...current, startDate: event.target.value }))
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: todayString() }
              }}
            />

            <TextField
              fullWidth
              required
              type='date'
              label='Tanggal berakhir'
              value={sessionForm.endDate}
              onChange={event =>
                setSessionForm(current => ({ ...current, endDate: event.target.value }))
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: sessionForm.startDate || todayString() }
              }}
            />
          </Box>

          <Alert severity='info'>
            Sesi baru memiliki respons sendiri. Data dari sesi sebelumnya tetap
            tersimpan dan bisa dilihat dengan memilih sesi tersebut di filter.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions className='p-4'>
        <Button color='inherit' onClick={() => setCreateDialogOpen(false)}>
          Batal
        </Button>
        <Button
          variant='contained'
          startIcon={<i className='tabler-check text-lg' />}
          disabled={
            !sessionForm.title.trim() ||
            !sessionForm.startDate ||
            !sessionForm.endDate ||
            sessionForm.startDate < todayString() ||
            sessionForm.endDate < sessionForm.startDate
          }
          onClick={createSession}
        >
          Buat Sesi
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
)
}

export default PostTrainingTab

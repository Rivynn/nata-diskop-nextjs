'use client'

import { useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import type { TrainingRecord } from '@/types/admin/trainingTypes'

type AssessmentTabProps = {
  data: TrainingRecord
}

type AssessmentStatus = 'passed' | 'failed' | 'incomplete'

type GradeLetter = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E'

type GradeRule = {
  grade: GradeLetter
  min: number
  max: number
}

type AssessmentRecord = {
  id: string
  name: string
  email: string
  institution: string
  avatar: string
  attendance: number
  theoryScore: number | null
  practiceScore: number | null
  finalScore: number | null
  status: AssessmentStatus
  manualStatus?: AssessmentStatus | null
  correctionReason?: string
  updatedAt?: string
  history: AssessmentHistory[]
}

type AssessmentHistory = {
  id: string
  actor: string
  action: string
  reason: string
  before: string
  after: string
  timestamp: string
}

type AssessmentPolicy = {
  passingScore: number
  attendanceMinimum: number
  theoryWeight: number
  practiceWeight: number
  gradeRules: GradeRule[]
}

const DEFAULT_GRADE_RULES: GradeRule[] = [
  { grade: 'A', min: 90, max: 100 },
  { grade: 'B+', min: 85, max: 89 },
  { grade: 'B', min: 80, max: 84 },
  { grade: 'C+', min: 75, max: 79 },
  { grade: 'C', min: 70, max: 74 },
  { grade: 'D', min: 60, max: 69 },
  { grade: 'E', min: 0, max: 59 }
]

const DEFAULT_POLICY: AssessmentPolicy = {
  passingScore: 75,
  attendanceMinimum: 80,
  theoryWeight: 40,
  practiceWeight: 60,
  gradeRules: DEFAULT_GRADE_RULES
}

const initialAssessments: AssessmentRecord[] = [
  {
    id: 'REG-001',
    name: 'Aditya Pratama',
    email: 'aditya@example.com',
    institution: 'Universitas Lambung Mangkurat',
    avatar: 'https://i.pravatar.cc/150?img=12',
    attendance: 100,
    theoryScore: 88,
    practiceScore: 92,
    finalScore: 90,
    status: 'passed',
    history: []
  },
  {
    id: 'REG-002',
    name: 'Nadia Putri',
    email: 'nadia@example.com',
    institution: 'SMK Negeri 1 Banjarbaru',
    avatar: 'https://i.pravatar.cc/150?img=47',
    attendance: 100,
    theoryScore: 82,
    practiceScore: 85,
    finalScore: 84,
    status: 'passed',
    history: []
  },
  {
    id: 'REG-003',
    name: 'Rizky Ramadhan',
    email: 'rizky@example.com',
    institution: 'Dinas Koperasi dan UKM',
    avatar: 'https://i.pravatar.cc/150?img=13',
    attendance: 75,
    theoryScore: 70,
    practiceScore: 72,
    finalScore: 71,
    status: 'failed',
    history: []
  },
  {
    id: 'REG-004',
    name: 'Siti Rahmawati',
    email: 'siti@example.com',
    institution: 'UMKM Banjarbaru',
    avatar: 'https://i.pravatar.cc/150?img=44',
    attendance: 100,
    theoryScore: 90,
    practiceScore: 86,
    finalScore: 88,
    status: 'passed',
    history: []
  },
  {
    id: 'REG-005',
    name: 'Muhammad Fajar',
    email: 'fajar@example.com',
    institution: 'Universitas Islam Kalimantan',
    avatar: 'https://i.pravatar.cc/150?img=14',
    attendance: 50,
    theoryScore: null,
    practiceScore: null,
    finalScore: null,
    status: 'incomplete',
    history: []
  },
  {
    id: 'REG-006',
    name: 'Dewi Anggraini',
    email: 'dewi@example.com',
    institution: 'Koperasi Sejahtera',
    avatar: 'https://i.pravatar.cc/150?img=45',
    attendance: 100,
    theoryScore: 78,
    practiceScore: 80,
    finalScore: 79,
    status: 'passed',
    history: []
  },
  {
    id: 'REG-007',
    name: 'Andi Saputra',
    email: 'andi@example.com',
    institution: 'Pelaku UMKM',
    avatar: 'https://i.pravatar.cc/150?img=15',
    attendance: 50,
    theoryScore: null,
    practiceScore: null,
    finalScore: null,
    status: 'incomplete',
    history: []
  },
  {
    id: 'REG-008',
    name: 'Putri Amelia',
    email: 'putri@example.com',
    institution: 'Universitas Lambung Mangkurat',
    avatar: 'https://i.pravatar.cc/150?img=48',
    attendance: 100,
    theoryScore: 65,
    practiceScore: 70,
    finalScore: 68,
    status: 'failed',
    history: []
  }
]

const statusConfig: Record<
  AssessmentStatus,
  { label: string; color: 'success' | 'error' | 'warning' }
> = {
  passed: { label: 'Lulus', color: 'success' },
  failed: { label: 'Belum lulus', color: 'error' },
  incomplete: { label: 'Belum lengkap', color: 'warning' }
}

const gradeColors: Record<
  GradeLetter,
  'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary'
> = {
  A: 'success',
  'B+': 'success',
  B: 'info',
  'C+': 'primary',
  C: 'warning',
  D: 'error',
  E: 'error'
}

const calculateFinalScore = (
  theoryScore: number | null,
  practiceScore: number | null,
  policy: AssessmentPolicy
): number | null => {
  if (theoryScore === null || practiceScore === null) return null

  return Math.round(
    theoryScore * (policy.theoryWeight / 100) +
      practiceScore * (policy.practiceWeight / 100)
  )
}

const getGrade = (
  score: number | null,
  rules: GradeRule[]
): GradeLetter | null => {
  if (score === null) return null

  const rule = rules.find(item => score >= item.min && score <= item.max)

  return rule?.grade ?? null
}

const getAssessmentStatus = (
  attendance: number,
  finalScore: number | null,
  policy: AssessmentPolicy
): AssessmentStatus => {
  if (finalScore === null) return 'incomplete'

  return finalScore >= policy.passingScore &&
    attendance >= policy.attendanceMinimum
    ? 'passed'
    : 'failed'
}

const formatDateTime = (value?: string) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

const createHistory = (
  action: string,
  reason: string,
  before: string,
  after: string
): AssessmentHistory => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  actor: 'Admin',
  action,
  reason,
  before,
  after,
  timestamp: new Date().toISOString()
})

const AssessmentTab = ({ data }: AssessmentTabProps) => {
  const [records, setRecords] = useState<AssessmentRecord[]>(initialAssessments)
  const [policy, setPolicy] = useState<AssessmentPolicy>(DEFAULT_POLICY)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null)
  const [historyRecord, setHistoryRecord] = useState<AssessmentRecord | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [theoryInput, setTheoryInput] = useState('')
  const [practiceInput, setPracticeInput] = useState('')
  const [attendanceInput, setAttendanceInput] = useState('')
  const [manualStatus, setManualStatus] = useState<'auto' | AssessmentStatus>('auto')
  const [correctionReason, setCorrectionReason] = useState('')
  const [scoreError, setScoreError] = useState('')

  const [policyDraft, setPolicyDraft] = useState<AssessmentPolicy>(DEFAULT_POLICY)
  const [policyError, setPolicyError] = useState('')

  const stats = useMemo(() => {
    const passed = records.filter(item => item.status === 'passed').length
    const failed = records.filter(item => item.status === 'failed').length
    const incomplete = records.filter(item => item.status === 'incomplete').length

    const scores = records
      .map(item => item.finalScore)
      .filter((score): score is number => score !== null)

    const average = scores.length
      ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
      : 0

    return {
      total: records.length,
      passed,
      failed,
      incomplete,
      average
    }
  }, [records])

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return records.filter(record => {
      const matchesSearch =
        !keyword ||
        record.name.toLowerCase().includes(keyword) ||
        record.email.toLowerCase().includes(keyword) ||
        record.institution.toLowerCase().includes(keyword) ||
        record.id.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === 'all' || record.status === statusFilter

      const grade = getGrade(record.finalScore, policy.gradeRules)
      const matchesGrade = gradeFilter === 'all' || grade === gradeFilter

      return matchesSearch && matchesStatus && matchesGrade
    })
  }, [records, search, statusFilter, gradeFilter, policy.gradeRules])

  const pageRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const openScoreDialog = (record: AssessmentRecord) => {
    setSelectedRecord(record)
    setTheoryInput(record.theoryScore === null ? '' : String(record.theoryScore))
    setPracticeInput(record.practiceScore === null ? '' : String(record.practiceScore))
    setAttendanceInput(String(record.attendance))
    setManualStatus(record.manualStatus ?? 'auto')
    setCorrectionReason('')
    setScoreError('')
  }

  const saveScores = () => {
    if (!selectedRecord) return

    const theory = Number(theoryInput)
    const practice = Number(practiceInput)
    const attendance = Number(attendanceInput)

    if (
      theoryInput.trim() === '' ||
      practiceInput.trim() === '' ||
      !Number.isFinite(theory) ||
      !Number.isFinite(practice) ||
      theory < 0 ||
      theory > 100 ||
      practice < 0 ||
      practice > 100
    ) {
      setScoreError('Nilai teori dan praktik wajib diisi antara 0–100.')
      return
    }

    if (
      attendanceInput.trim() === '' ||
      !Number.isFinite(attendance) ||
      attendance < 0 ||
      attendance > 100
    ) {
      setScoreError('Persentase kehadiran harus diisi antara 0–100.')
      return
    }

    const finalScore = calculateFinalScore(theory, practice, policy)
    const automaticStatus = getAssessmentStatus(attendance, finalScore, policy)
    const nextStatus = manualStatus === 'auto' ? automaticStatus : manualStatus
    const nextGrade = getGrade(finalScore, policy.gradeRules)

    const before =
      `Teori ${selectedRecord.theoryScore ?? '-'}, ` +
      `praktik ${selectedRecord.practiceScore ?? '-'}, ` +
      `nilai akhir ${selectedRecord.finalScore ?? '-'}, ` +
      `nilai huruf ${getGrade(selectedRecord.finalScore, policy.gradeRules) ?? '-'}, ` +
      `kehadiran ${selectedRecord.attendance}%, ` +
      `status ${statusConfig[selectedRecord.status].label}`

    const after =
      `Teori ${theory}, praktik ${practice}, ` +
      `nilai akhir ${finalScore ?? '-'}, nilai huruf ${nextGrade ?? '-'}, ` +
      `kehadiran ${attendance}%, status ${statusConfig[nextStatus].label}`

    const changed =
      theory !== selectedRecord.theoryScore ||
      practice !== selectedRecord.practiceScore ||
      attendance !== selectedRecord.attendance ||
      nextStatus !== selectedRecord.status

    if (changed && !correctionReason.trim()) {
      setScoreError('Alasan input atau koreksi wajib diisi.')
      return
    }

    setRecords(current =>
      current.map(record =>
        record.id === selectedRecord.id
          ? {
              ...record,
              theoryScore: theory,
              practiceScore: practice,
              attendance,
              finalScore,
              status: nextStatus,
              manualStatus: manualStatus === 'auto' ? null : manualStatus,
              correctionReason: correctionReason.trim(),
              updatedAt: new Date().toISOString(),
              history:
                changed || !record.updatedAt
                  ? [
                      ...record.history,
                      createHistory(
                        record.updatedAt ? 'Koreksi data penilaian' : 'Input nilai',
                        correctionReason.trim() || 'Input nilai awal.',
                        before,
                        after
                      )
                    ]
                  : record.history
            }
          : record
      )
    )

    setSelectedRecord(null)
  }

  const openSettings = () => {
    setPolicyDraft({
      ...policy,
      gradeRules: policy.gradeRules.map(rule => ({ ...rule }))
    })
    setPolicyError('')
    setSettingsOpen(true)
  }

  const updateGradeRule = (
    grade: GradeLetter,
    field: 'min' | 'max',
    value: number
  ) => {
    setPolicyDraft(current => ({
      ...current,
      gradeRules: current.gradeRules.map(rule =>
        rule.grade === grade ? { ...rule, [field]: value } : rule
      )
    }))
    setPolicyError('')
  }

  const validateGradeRules = (rules: GradeRule[]) => {
    const sorted = [...rules].sort((a, b) => a.min - b.min)

    if (sorted.some(rule =>
      !Number.isFinite(rule.min) ||
      !Number.isFinite(rule.max) ||
      rule.min < 0 ||
      rule.max > 100 ||
      rule.min > rule.max
    )) {
      return 'Rentang setiap nilai huruf harus berada di antara 0–100 dan nilai minimum tidak boleh melebihi maksimum.'
    }

    if (sorted[0].min !== 0 || sorted[sorted.length - 1].max !== 100) {
      return 'Rentang nilai harus mencakup seluruh nilai 0–100.'
    }

    for (let index = 1; index < sorted.length; index++) {
      if (sorted[index].min !== sorted[index - 1].max + 1) {
        return 'Rentang nilai tidak boleh tumpang tindih atau memiliki celah. Gunakan batas angka bulat yang berurutan.'
      }
    }

    return ''
  }

  const savePolicy = () => {
    const {
      passingScore,
      attendanceMinimum,
      theoryWeight,
      practiceWeight,
      gradeRules
    } = policyDraft

    if (
      !Number.isFinite(passingScore) ||
      !Number.isFinite(attendanceMinimum) ||
      !Number.isFinite(theoryWeight) ||
      !Number.isFinite(practiceWeight) ||
      passingScore < 0 ||
      passingScore > 100 ||
      attendanceMinimum < 0 ||
      attendanceMinimum > 100 ||
      theoryWeight < 0 ||
      theoryWeight > 100 ||
      practiceWeight < 0 ||
      practiceWeight > 100
    ) {
      setPolicyError('Semua nilai dan bobot harus berada pada rentang 0–100.')
      return
    }

    if (theoryWeight + practiceWeight !== 100) {
      setPolicyError('Total bobot teori dan praktik harus tepat 100%.')
      return
    }

    const gradeError = validateGradeRules(gradeRules)

    if (gradeError) {
      setPolicyError(gradeError)
      return
    }

    setPolicy(policyDraft)

    setRecords(current =>
      current.map(record => {
        const finalScore = calculateFinalScore(
          record.theoryScore,
          record.practiceScore,
          policyDraft
        )

        const automaticStatus = getAssessmentStatus(
          record.attendance,
          finalScore,
          policyDraft
        )

        return {
          ...record,
          finalScore,
          status: record.manualStatus ?? automaticStatus
        }
      })
    )

    setSettingsOpen(false)
  }

  const exportCsv = () => {
    const headers = [
      'ID Peserta',
      'Nama',
      'Email',
      'Instansi',
      'Kehadiran (%)',
      'Nilai Teori',
      'Nilai Praktik',
      'Nilai Akhir',
      'Nilai Huruf',
      'Status Kelulusan',
      'Alasan Koreksi Terakhir'
    ]

    const rows = filteredRecords.map(record => [
      record.id,
      record.name,
      record.email,
      record.institution,
      record.attendance,
      record.theoryScore ?? '-',
      record.practiceScore ?? '-',
      record.finalScore ?? '-',
      getGrade(record.finalScore, policy.gradeRules) ?? '-',
      statusConfig[record.status].label,
      record.correctionReason ?? '-'
    ])

    const csv = [headers, ...rows]
      .map(row =>
        row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
)
.join('\r\n')

const blob = new Blob(['\uFEFF' + csv], {
  type: 'text/csv;charset=utf-8;'
})

const url = URL.createObjectURL(blob)
const anchor = document.createElement('a')

anchor.href = url
anchor.download = `penilaian-${data.slug || data.id}.csv`
anchor.click()

URL.revokeObjectURL(url)
}

return (
  <Box className='flex flex-col gap-5'>
    {/* HEADER */}

    <Box className='flex flex-wrap items-center justify-between gap-3'>
      <Box>
        <Typography variant='h5' className='font-semibold'>
          Penilaian Peserta
        </Typography>
        <Typography variant='body2' color='text.secondary' className='mt-1'>
          Kelola nilai, evaluasi kompetensi, dan kelulusan peserta {data.title}.
        </Typography>
      </Box>

      <Box className='flex flex-wrap gap-2'>
        <Button
          variant='outlined'
          startIcon={<i className='tabler-settings text-lg' />}
          onClick={openSettings}
        >
          Pengaturan Nilai
        </Button>

        <Button
          variant='contained'
          startIcon={<i className='tabler-download text-lg' />}
          onClick={exportCsv}
        >
          Ekspor Nilai
        </Button>
      </Box>
    </Box>

    {/* STATISTICS */}

    <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {[
        {
          label: 'Rata-rata nilai',
          value: stats.average,
          icon: 'tabler-chart-bar',
          color: 'primary'
        },
        {
          label: 'Peserta lulus',
          value: stats.passed,
          icon: 'tabler-circle-check',
          color: 'success'
        },
        {
          label: 'Belum lulus',
          value: stats.failed,
          icon: 'tabler-circle-x',
          color: 'error'
        },
        {
          label: 'Nilai belum lengkap',
          value: stats.incomplete,
          icon: 'tabler-file-alert',
          color: 'warning'
        }
      ].map(item => (
        <Card key={item.label}>
          <CardContent className='flex items-center justify-between gap-3 p-5'>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                {item.label}
              </Typography>
              <Typography variant='h4' className='mt-2 font-semibold'>
                {item.value}
              </Typography>
            </Box>

            <Avatar
              variant='rounded'
              className={`bs-11 is-11 bg-${item.color}Light text-${item.color}`}
            >
              <i className={`${item.icon} text-2xl`} />
            </Avatar>
          </CardContent>
        </Card>
      ))}
    </Box>

    {/* POLICY SUMMARY */}

    <Card>
      <CardContent className='flex flex-wrap items-center justify-between gap-4 p-5'>
        <Box className='flex items-center gap-3'>
          <Avatar variant='rounded' className='bs-12 is-12 bg-primaryLight text-primary'>
            <i className='tabler-shield-check text-2xl' />
          </Avatar>

          <Box>
            <Typography variant='subtitle1' className='font-semibold'>
              Standar penilaian
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Teori {policy.theoryWeight}% · Praktik {policy.practiceWeight}%
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Nilai huruf dan kelulusan mengikuti rentang serta batas yang ditetapkan admin.
            </Typography>
          </Box>
        </Box>

        <Box className='flex flex-wrap gap-2'>
          <Chip
            label={`Nilai minimum ${policy.passingScore}`}
            color='primary'
            variant='tonal'
          />
          <Chip
            label={`Kehadiran minimum ${policy.attendanceMinimum}%`}
            variant='outlined'
          />
        </Box>
      </CardContent>
    </Card>

    {/* TABLE */}

    <Card>
      <CardContent className='flex flex-col gap-5 p-5'>
        <Box>
          <Typography variant='h6' className='font-semibold'>
            Rekap Nilai Peserta
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Nilai huruf dihitung otomatis berdasarkan rentang yang dikonfigurasi.
          </Typography>
        </Box>

        <Box className='flex flex-col gap-3 md:flex-row'>
          <TextField
            fullWidth
            size='small'
            placeholder='Cari nama, email, instansi, atau ID...'
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
                )
              }
            }}
          />

          <Select
            size='small'
            value={statusFilter}
            onChange={event => {
              setStatusFilter(event.target.value)
              setPage(0)
            }}
            className='min-w-[180px]'
            aria-label='Filter status kelulusan'
          >
            <MenuItem value='all'>Semua status</MenuItem>
            <MenuItem value='passed'>Lulus</MenuItem>
            <MenuItem value='failed'>Belum lulus</MenuItem>
            <MenuItem value='incomplete'>Belum lengkap</MenuItem>
          </Select>

          <Select
            size='small'
            value={gradeFilter}
            onChange={event => {
              setGradeFilter(event.target.value)
              setPage(0)
            }}
            className='min-w-[140px]'
            aria-label='Filter nilai huruf'
          >
            <MenuItem value='all'>Semua nilai</MenuItem>
            {DEFAULT_GRADE_RULES.map(rule => (
              <MenuItem key={rule.grade} value={rule.grade}>
                Nilai {rule.grade}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Peserta</TableCell>
                <TableCell align='center'>Kehadiran</TableCell>
                <TableCell align='center'>Teori</TableCell>
                <TableCell align='center'>Praktik</TableCell>
                <TableCell align='center'>Nilai akhir</TableCell>
                <TableCell align='center'>Nilai huruf</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Aksi</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageRecords.map(record => {
                const status = statusConfig[record.status]
                const grade = getGrade(record.finalScore, policy.gradeRules)

                return (
                  <TableRow key={record.id} hover>
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
                          <Typography variant='caption' color='text.secondary' display='block'>
                            {record.id}
                          </Typography>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            className='block max-w-[220px] truncate'
                          >
                            {record.institution}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align='center'>
                      <Box className='flex flex-col items-center gap-1'>
                        <Typography variant='body2' className='font-medium'>
                          {record.attendance}%
                        </Typography>
                        <LinearProgress
                          variant='determinate'
                          value={record.attendance}
                          className='h-1 w-16 rounded-full'
                          color={
                            record.attendance >= policy.attendanceMinimum
                              ? 'success'
                              : 'warning'
                          }
                        />
                      </Box>
                    </TableCell>

                    <TableCell align='center'>
                      {record.theoryScore ?? '—'}
                    </TableCell>

                    <TableCell align='center'>
                      {record.practiceScore ?? '—'}
                    </TableCell>

                    <TableCell align='center'>
                      <Typography
                        variant='body2'
                        className='font-semibold'
                        color={
                          record.finalScore === null
                            ? 'text.secondary'
                            : record.finalScore >= policy.passingScore
                              ? 'success.main'
                              : 'error.main'
                        }
                      >
                        {record.finalScore ?? '—'}
                      </Typography>
                    </TableCell>

                    <TableCell align='center'>
                      {grade ? (
                        <Chip
                          label={grade}
                          color={gradeColors[grade]}
                          size='small'
                          variant='tonal'
                          className='min-w-12 font-semibold'
                        />
                      ) : (
                        <Typography color='text.secondary'>—</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size='small'
                        variant='tonal'
                      />
                    </TableCell>

                    <TableCell align='right'>
                      <Box className='flex justify-end gap-1'>
                        <Tooltip title='Riwayat penilaian'>
                          <IconButton
                            size='small'
                            onClick={() => setHistoryRecord(record)}
                          >
                            <i className='tabler-history text-lg' />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title='Input atau koreksi nilai'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => openScoreDialog(record)}
                          >
                            <i className='tabler-edit text-lg' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}

              {pageRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box className='flex flex-col items-center gap-2 py-10 text-center'>
                      <i className='tabler-file-search text-4xl text-textDisabled' />
                      <Typography variant='body1' className='font-medium'>
                        Data penilaian tidak ditemukan
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Ubah pencarian atau filter nilai.
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
            `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
          }
        />
      </CardContent>
    </Card>

    {/* SCORE EDIT DIALOG */}

    <Dialog
      open={Boolean(selectedRecord)}
      onClose={() => setSelectedRecord(null)}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        <Typography variant='h6' className='font-semibold'>
          Input / Koreksi Penilaian
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Nilai akhir, nilai huruf, dan kelulusan dihitung berdasarkan standar aktif.
        </Typography>
      </DialogTitle>

      <DialogContent>
        {selectedRecord && (
          <Box className='flex flex-col gap-4 pt-2'>
            <Box className='flex items-center gap-3 rounded-xl bg-actionHover p-3'>
              <Avatar src={selectedRecord.avatar}>
                {selectedRecord.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant='body2' className='font-semibold'>
                  {selectedRecord.name}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {selectedRecord.id} · {selectedRecord.institution}
                </Typography>
              </Box>
            </Box>

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <TextField
                label='Nilai teori'
                type='number'
                value={theoryInput}
                onChange={event => setTheoryInput(event.target.value)}
                slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
                fullWidth
                required
              />

              <TextField
                label='Nilai praktik'
                type='number'
                value={practiceInput}
                onChange={event => setPracticeInput(event.target.value)}
                slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
                fullWidth
                required
              />
            </Box>

            <TextField
              label='Kehadiran (%)'
              type='number'
              value={attendanceInput}
              onChange={event => setAttendanceInput(event.target.value)}
              slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
              fullWidth
              required
              helperText='Digunakan sebagai salah satu syarat kelulusan.'
            />

            <Box className='rounded-xl border p-4'>
              <Typography variant='caption' color='text.secondary'>
                Pratinjau hasil penilaian
              </Typography>

              {(() => {
                const validTheory =
                  theoryInput.trim() !== '' &&
                  Number.isFinite(Number(theoryInput)) &&
                  Number(theoryInput) >= 0 &&
                  Number(theoryInput) <= 100

                const validPractice =
                  practiceInput.trim() !== '' &&
                  Number.isFinite(Number(practiceInput)) &&
                  Number(practiceInput) >= 0 &&
                  Number(practiceInput) <= 100

                const finalScore =
                  validTheory && validPractice
                    ? calculateFinalScore(
                      Number(theoryInput),
                      Number(practiceInput),
                      policy
                    )
                    : null

                const grade = getGrade(finalScore, policy.gradeRules)

                const attendanceValid =
                  attendanceInput.trim() !== '' &&
                  Number.isFinite(Number(attendanceInput)) &&
                  Number(attendanceInput) >= 0 &&
                  Number(attendanceInput) <= 100

                const status =
                  attendanceValid && finalScore !== null
                    ? getAssessmentStatus(Number(attendanceInput), finalScore, policy)
                    : 'incomplete'

                return (
                  <>
                    <Box className='mt-3 grid grid-cols-3 gap-3'>
                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Nilai akhir
                        </Typography>
                        <Typography variant='h4' className='font-semibold'>
                          {finalScore ?? '—'}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Nilai huruf
                        </Typography>
                        <Box className='mt-1'>
                          {grade ? (
                            <Chip
                              label={grade}
                              color={gradeColors[grade]}
                              variant='tonal'
                            />
                          ) : (
                            <Typography variant='h5'>—</Typography>
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Kelulusan
                        </Typography>
                        <Box className='mt-1'>
                          <Chip
                            size='small'
                            label={statusConfig[status].label}
                            color={statusConfig[status].color}
                            variant='tonal'
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant='caption' color='text.secondary' className='mt-3 block'>
                      Teori {policy.theoryWeight}% + Praktik {policy.practiceWeight}%.
                      Nilai huruf mengikuti rentang yang ditentukan admin.
                    </Typography>
                  </>
                )
              })()}
            </Box>

            <TextField
              select
              fullWidth
              label='Status kelulusan'
              value={manualStatus}
              onChange={event =>
                setManualStatus(event.target.value as 'auto' | AssessmentStatus)
              }
              helperText='Disarankan menggunakan perhitungan otomatis.'
            >
              <MenuItem value='auto'>Otomatis berdasarkan standar</MenuItem>
              <MenuItem value='passed'>Tetapkan lulus</MenuItem>
              <MenuItem value='failed'>Tetapkan belum lulus</MenuItem>
              <MenuItem value='incomplete'>Tetapkan belum lengkap</MenuItem>
            </TextField>

            {manualStatus !== 'auto' && (
              <Box className='flex items-start gap-2 rounded-lg bg-warningLight p-3'>
                <i className='tabler-alert-triangle mt-0.5 text-lg text-warning' />
                <Typography variant='caption' color='text.secondary'>
                  Status manual mengesampingkan hasil otomatis. Cantumkan alasan
                  yang jelas agar keputusan dapat ditelusuri.
                </Typography>
              </Box>
            )}

            <TextField
              label='Alasan input / koreksi'
              value={correctionReason}
              onChange={event => {
                setCorrectionReason(event.target.value)
                setScoreError('')
              }}
              fullWidth
              multiline
              minRows={2}
              required
              placeholder='Contoh: perbaikan nilai berdasarkan hasil evaluasi resmi.'
              error={Boolean(scoreError)}
              helperText={scoreError || 'Wajib diisi saat menyimpan input atau perubahan nilai.'}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions className='px-6 pb-5'>
        <Button onClick={() => setSelectedRecord(null)} color='secondary'>
          Batal
        </Button>
        <Button
          variant='contained'
          startIcon={<i className='tabler-device-floppy text-lg' />}
          onClick={saveScores}
        >
          Simpan perubahan
        </Button>
      </DialogActions>
    </Dialog>

    {/* POLICY SETTINGS DIALOG */}

    <Dialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>
        <Box className='flex items-start gap-3'>
          <Avatar variant='rounded' className='bg-primaryLight text-primary'>
            <i className='tabler-settings-2 text-xl' />
          </Avatar>
          <Box>
            <Typography variant='h6' className='font-semibold'>
              Pengaturan Standar Nilai
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Atur bobot, syarat kelulusan, dan rentang nilai huruf untuk {data.title}.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className='flex flex-col gap-5 pt-2'>
          <Typography variant='subtitle1' className='font-semibold'>
            Standar kelulusan
          </Typography>

          <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <TextField
              label='Nilai minimum lulus'
              type='number'
              value={policyDraft.passingScore}
              onChange={event =>
                setPolicyDraft(current => ({
                  ...current,
                  passingScore: Number(event.target.value)
                }))
              }
              slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
              helperText='Rentang nilai 0–100'
              fullWidth
            />

            <TextField
              label='Kehadiran minimum (%)'
              type='number'
              value={policyDraft.attendanceMinimum}
              onChange={event =>
                setPolicyDraft(current => ({
                  ...current,
                  attendanceMinimum: Number(event.target.value)
                }))
              }
              slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
              helperText='Syarat kehadiran untuk lulus'
              fullWidth
            />
          </Box>

          <Divider />

          <Typography variant='subtitle1' className='font-semibold'>
            Komposisi nilai akhir
          </Typography>

          <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <TextField
              label='Bobot teori (%)'
              type='number'
              value={policyDraft.theoryWeight}
              onChange={event =>
                setPolicyDraft(current => ({
                  ...current,
                  theoryWeight: Number(event.target.value)
                }))
              }
              slotProps={{ htmlInput: { min: 0, max: 100, step: 5 } }}
              fullWidth
            />

            <TextField
              label='Bobot praktik (%)'
              type='number'
              value={policyDraft.practiceWeight}
              onChange={event =>
                setPolicyDraft(current => ({
                  ...current,
                  practiceWeight: Number(event.target.value)
                }))
              }
              slotProps={{ htmlInput: { min: 0, max: 100, step: 5 } }}
              fullWidth
            />
          </Box>

          <Box className='rounded-xl border p-4'>
            <Box className='mb-2 flex items-center justify-between'>
              <Typography variant='body2' color='text.secondary'>
                Total bobot
              </Typography>
              <Typography
                variant='subtitle1'
                className='font-semibold'
                color={
                  policyDraft.theoryWeight + policyDraft.practiceWeight === 100
                    ? 'success.main'
                    : 'error.main'
                }
              >
                {policyDraft.theoryWeight + policyDraft.practiceWeight}%
              </Typography>
            </Box>

            <LinearProgress
              variant='determinate'
              value={Math.min(
                100,
                Math.max(0, policyDraft.theoryWeight + policyDraft.practiceWeight)
              )}
              color={
                policyDraft.theoryWeight + policyDraft.practiceWeight === 100
                  ? 'success'
                  : 'error'
              }
              className='h-2 rounded-full'
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant='subtitle1' className='font-semibold'>
              Konversi nilai huruf
            </Typography>
            <Typography variant='body2' color='text.secondary' className='mt-1'>
              Rentang dapat diubah sesuai kebijakan penyelenggara. Nilai huruf
              dihitung otomatis dari nilai akhir.
            </Typography>
          </Box>

          <Box className='flex flex-col gap-2'>
            {policyDraft.gradeRules.map((rule, index) => (
              <Box
                key={rule.grade}
                className='grid grid-cols-[64px_1fr_1fr] items-center gap-3 rounded-lg border p-3'
              >
                <Chip
                  label={rule.grade}
                  color={gradeColors[rule.grade]}
                  variant='tonal'
                  className='font-semibold'
                />

                <TextField
                  label='Nilai minimum'
                  type='number'
                  size='small'
                  value={rule.min}
                  onChange={event =>
                    updateGradeRule(rule.grade, 'min', Number(event.target.value))
                  }
                  slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
                  fullWidth
                />

                <TextField
                  label='Nilai maksimum'
                  type='number'
                  size='small'
                  value={rule.max}
                  onChange={event =>
                    updateGradeRule(rule.grade, 'max', Number(event.target.value))
                  }
                  slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
                  fullWidth
                />
              </Box>
            ))}
          </Box>

          <Box className='rounded-xl bg-infoLight p-3'>
            <Box className='flex items-start gap-2'>
              <i className='tabler-info-circle mt-0.5 text-lg text-info' />
              <Box>
                <Typography variant='body2' className='font-medium'>
                  Contoh standar awal
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  A: 90–100 · B+: 85–89 · B: 80–84 · C+: 75–79 ·
                  C: 70–74 · D: 60–69 · E: 0–59.
                  Batas lulus awal adalah 75 dengan kehadiran minimal 80%.
                  Sesuaikan dengan ketentuan pelatihan yang berlaku.
                </Typography>
              </Box>
            </Box>
          </Box>

          {policyError && (
            <Typography variant='body2' color='error'>
              {policyError}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions className='px-6 pb-5'>
        <Button
          color='secondary'
          onClick={() => setSettingsOpen(false)}
        >
          Batal
        </Button>

        <Button
          variant='contained'
          startIcon={<i className='tabler-check text-lg' />}
          onClick={savePolicy}
        >
          Simpan standar
        </Button>
      </DialogActions>
    </Dialog>

    {/* AUDIT HISTORY DIALOG */}

    <Dialog
      open={Boolean(historyRecord)}
      onClose={() => setHistoryRecord(null)}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        <Typography variant='h6' className='font-semibold'>
          Riwayat Penilaian
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {historyRecord?.name} · {historyRecord?.id}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {!historyRecord?.history.length ? (
          <Box className='flex flex-col items-center gap-2 py-8 text-center'>
            <i className='tabler-history text-4xl text-textDisabled' />
            <Typography variant='body1' className='font-medium'>
              Belum ada riwayat perubahan
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Riwayat akan muncul setelah nilai atau data dikoreksi.
            </Typography>
          </Box>
        ) : (
          <Box className='flex flex-col gap-4'>
            {[...historyRecord.history].reverse().map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider className='mb-4' />}

                <Box className='flex items-start gap-3'>
                  <Avatar
                    variant='rounded'
                    className='bg-primaryLight text-primary'
                  >
                    <i className='tabler-history text-lg' />
                  </Avatar>

                  <Box className='min-w-0 flex-1'>
                    <Typography variant='body2' className='font-semibold'>
                      {item.action}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {item.actor} · {formatDateTime(item.timestamp)}
                    </Typography>

                    <Box className='mt-2 rounded-lg bg-actionHover p-3'>
                      <Typography variant='caption' color='text.secondary'>
                        Sebelum
                      </Typography>
                      <Typography variant='body2'>{item.before}</Typography>

                      <Typography variant='caption' color='text.secondary' className='mt-2 block'>
                        Sesudah
                      </Typography>
                      <Typography variant='body2'>{item.after}</Typography>
                    </Box>

                    <Typography variant='body2' className='mt-2'>
                      <span className='font-medium'>Alasan:</span> {item.reason}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions className='px-6 py-3'>
        <Button onClick={() => setHistoryRecord(null)}>Tutup</Button>
      </DialogActions>
    </Dialog>

    <Box className='flex items-start gap-2 rounded-xl border border-info/20 bg-infoLight p-4'>
      <i className='tabler-info-circle mt-0.5 text-xl text-info' />
      <Box>
        <Typography variant='body2' className='font-medium'>
          Data demonstrasi
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          Data peserta, pengaturan standar, dan riwayat masih disimpan di state lokal.
          Untuk produksi, simpan kebijakan nilai per pelatihan di backend dan
          validasi hak akses admin di server.
        </Typography>
      </Box>
    </Box>
  </Box>
)
}

export default AssessmentTab

'use client'

import { useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
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

// ============================================================
// TRAINING CONFIG
// ============================================================

const TRAINING = {
  code: 'TRN-2026-010',
  title: 'Fotografi Produk untuk UMKM',
  organizer: 'Dinas Koperasi dan UKM Kota Banjarbaru'
}

// ============================================================
// TYPES
// ============================================================

type ActivityCategory =
  | 'training'
  | 'material'
  | 'schedule'
  | 'assessment'
  | 'attendance'
  | 'system'

type ActivityLevel = 'success' | 'info' | 'warning' | 'error'

type ActivityLog = {
  id: string
  action: string
  description: string
  category: ActivityCategory
  level: ActivityLevel
  actor: string
  role: string
  createdAt: string
  ipAddress: string
  module: string
  changes?: {
    field: string
    before: string
    after: string
  }[]
}

// ============================================================
// HARDCODED DATA
// ============================================================

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-026',
    action: 'Informasi pelatihan diperbarui',
    description:
      'Administrator memperbarui deskripsi dan informasi penyelenggaraan pelatihan.',
    category: 'training',
    level: 'success',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-11T15:42:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Informasi Pelatihan',
    changes: [
      {
        field: 'Deskripsi',
        before: 'Pelatihan fotografi dasar',
        after: 'Pelatihan fotografi produk untuk UMKM'
      },
      {
        field: 'Penyelenggara',
        before: 'Dinas Koperasi',
        after: 'Dinas Koperasi dan UKM Kota Banjarbaru'
      }
    ]
  },
  {
    id: 'LOG-025',
    action: 'Materi pembelajaran diperbarui',
    description:
      'Instruktur memperbarui materi teknik pencahayaan produk.',
    category: 'material',
    level: 'success',
    actor: 'Budi Santoso',
    role: 'Instruktur',
    createdAt: '2026-10-11T14:18:00+08:00',
    ipAddress: '192.168.1.24',
    module: 'Materi Pembelajaran',
    changes: [
      {
        field: 'Nama materi',
        before: 'Dasar Pencahayaan',
        after: 'Teknik Pencahayaan Produk'
      }
    ]
  },
  {
    id: 'LOG-024',
    action: 'Jadwal sesi diubah',
    description:
      'Jadwal sesi praktik fotografi disesuaikan oleh administrator.',
    category: 'schedule',
    level: 'warning',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-11T11:30:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Jadwal Pelatihan',
    changes: [
      {
        field: 'Waktu mulai',
        before: '13.00 WITA',
        after: '14.00 WITA'
      },
      {
        field: 'Durasi',
        before: '90 menit',
        after: '120 menit'
      }
    ]
  },
  {
    id: 'LOG-023',
    action: 'Konfigurasi penilaian diperbarui',
    description:
      'Pengaturan penilaian akhir pelatihan berhasil disimpan.',
    category: 'assessment',
    level: 'success',
    actor: 'Budi Santoso',
    role: 'Instruktur',
    createdAt: '2026-10-11T10:05:00+08:00',
    ipAddress: '192.168.1.24',
    module: 'Penilaian',
    changes: [
      {
        field: 'Batas kelulusan',
        before: '70',
        after: '75'
      },
      {
        field: 'Bobot praktik',
        before: '40%',
        after: '50%'
      }
    ]
  },
  {
    id: 'LOG-022',
    action: 'Presensi berhasil disinkronkan',
    description:
      'Data kehadiran sesi praktik berhasil disinkronkan ke sistem pelatihan.',
    category: 'attendance',
    level: 'info',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-11T09:20:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Presensi',
    changes: [
      {
        field: 'Status sinkronisasi',
        before: 'Menunggu',
        after: 'Berhasil'
      }
    ]
  },
  {
    id: 'LOG-021',
    action: 'Status pelatihan diubah',
    description:
      'Status pelatihan diubah menjadi sedang berlangsung.',
    category: 'training',
    level: 'success',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-10T08:00:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Informasi Pelatihan',
    changes: [
      {
        field: 'Status',
        before: 'Persiapan',
        after: 'Berlangsung'
      }
    ]
  },
  {
    id: 'LOG-020',
    action: 'Materi baru ditambahkan',
    description:
      'Materi komposisi foto produk ditambahkan ke modul pembelajaran.',
    category: 'material',
    level: 'success',
    actor: 'Budi Santoso',
    role: 'Instruktur',
    createdAt: '2026-10-09T15:15:00+08:00',
    ipAddress: '192.168.1.24',
    module: 'Materi Pembelajaran',
    changes: [
      {
        field: 'Nama materi',
        before: '-',
        after: 'Komposisi Foto Produk'
      },
      {
        field: 'Jenis aktivitas',
        before: '-',
        after: 'Penambahan materi'
      }
    ]
  },
  {
    id: 'LOG-019',
    action: 'Evaluasi pembelajaran diperbarui',
    description:
      'Pertanyaan evaluasi mengenai dasar fotografi produk diperbarui.',
    category: 'assessment',
    level: 'info',
    actor: 'Budi Santoso',
    role: 'Instruktur',
    createdAt: '2026-10-09T13:40:00+08:00',
    ipAddress: '192.168.1.24',
    module: 'Evaluasi',
    changes: [
      {
        field: 'Bagian',
        before: 'Dasar fotografi',
        after: 'Dasar dan praktik fotografi'
      }
    ]
  },
  {
    id: 'LOG-018',
    action: 'Jadwal sesi ditambahkan',
    description:
      'Sesi praktik pengambilan gambar produk ditambahkan ke jadwal pelatihan.',
    category: 'schedule',
    level: 'success',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-09T10:25:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Jadwal Pelatihan',
    changes: [
      {
        field: 'Nama sesi',
        before: '-',
        after: 'Praktik Pengambilan Gambar'
      },
      {
        field: 'Durasi',
        before: '-',
        after: '120 menit'
      }
    ]
  },
  {
    id: 'LOG-017',
    action: 'Sinkronisasi presensi selesai',
    description:
      'Sistem menyelesaikan sinkronisasi data kehadiran tanpa kendala.',
    category: 'attendance',
    level: 'success',
    actor: 'Sistem',
    role: 'System',
    createdAt: '2026-10-09T09:00:00+08:00',
    ipAddress: '127.0.0.1',
    module: 'Presensi',
    changes: [
      {
        field: 'Proses',
        before: 'Berjalan',
        after: 'Selesai'
      }
    ]
  },
  {
    id: 'LOG-016',
    action: 'Pengaturan pelatihan diakses',
    description:
      'Administrator membuka pengaturan untuk memeriksa konfigurasi pelatihan.',
    category: 'system',
    level: 'info',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-08T16:20:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Pengaturan',
    changes: []
  },
  {
    id: 'LOG-015',
    action: 'Pelatihan dibuat',
    description:
      'Informasi awal pelatihan berhasil dibuat pada sistem.',
    category: 'training',
    level: 'success',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-07T08:00:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Informasi Pelatihan',
    changes: [
      {
        field: 'Nama pelatihan',
        before: '-',
        after: TRAINING.title
      },
      {
        field: 'Kode pelatihan',
        before: '-',
        after: TRAINING.code
      },
      {
        field: 'Status',
        before: '-',
        after: 'Persiapan'
      }
    ]
  },
  {
    id: 'LOG-014',
    action: 'Validasi jadwal gagal',
    description:
      'Sistem mendeteksi konflik waktu. Perubahan jadwal tidak diterapkan.',
    category: 'schedule',
    level: 'error',
    actor: 'Admin Pelatihan',
    role: 'Administrator',
    createdAt: '2026-10-07T07:45:00+08:00',
    ipAddress: '192.168.1.10',
    module: 'Jadwal Pelatihan',
    changes: [
      {
        field: 'Hasil validasi',
        before: 'Pemeriksaan',
        after: 'Konflik waktu ditemukan'
      }
    ]
  }
]

// ============================================================
// HELPERS
// ============================================================

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Makassar'
  }).format(date)
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar'
  }).format(date)
}

function formatTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Makassar'
  }).format(date)
}

function getCategoryLabel(category: ActivityCategory) {
  const labels: Record<ActivityCategory, string> = {
    training: 'Pelatihan',
    material: 'Materi',
    schedule: 'Jadwal',
    assessment: 'Penilaian',
    attendance: 'Presensi',
    system: 'Sistem'
  }

  return labels[category]
}

function getCategoryIcon(category: ActivityCategory) {
  const icons: Record<ActivityCategory, string> = {
    training: 'tabler-book',
    material: 'tabler-files',
    schedule: 'tabler-calendar-event',
    assessment: 'tabler-clipboard-check',
    attendance: 'tabler-calendar-check',
    system: 'tabler-settings'
  }

  return icons[category]
}

function getLevelLabel(level: ActivityLevel) {
  const labels: Record<ActivityLevel, string> = {
    success: 'Berhasil',
    info: 'Informasi',
    warning: 'Perubahan',
    error: 'Gagal'
  }

  return labels[level]
}

function getLevelColor(level: ActivityLevel) {
  const colors: Record<
    ActivityLevel,
    'success' | 'info' | 'warning' | 'error'
  > = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  }

  return colors[level]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function exportLogs(logs: ActivityLog[]) {
  const headers = [
    'ID',
    'Tanggal',
    'Aktivitas',
    'Deskripsi',
    'Kategori',
    'Status',
    'Pelaksana',
    'Peran',
    'Modul',
    'IP Address'
  ]

  const rows = logs.map(log => [
    log.id,
    formatDateTime(log.createdAt),
    log.action,
    log.description,
    getCategoryLabel(log.category),
    getLevelLabel(log.level),
    log.actor,
    log.role,
    log.module,
    log.ipAddress
  ])

  const escapeCsv = (value: string) =>
    `"${value.replace(/"/g, '""')}"`

  const content = [headers, ...rows]
    .map(row => row.map(value => escapeCsv(String(value))).join(','))
    .join('\r\n')

  const blob = new Blob(['\uFEFF' + content], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `${TRAINING.code.toLowerCase()}-activity-log.csv`

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TrainingActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [period, setPeriod] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase()
    const now = new Date()

    return logs
      .filter(log => {
        const searchable = [
          log.id,
          log.action,
          log.description,
          log.actor,
          log.role,
          log.ipAddress,
          log.module
        ]
          .join(' ')
          .toLowerCase()

        const matchesSearch = !query || searchable.includes(query)

        const matchesCategory =
          category === 'all' || log.category === category

        const matchesStatus = status === 'all' || log.level === status

        const logDate = new Date(log.createdAt)
        let matchesPeriod = true

        if (period === 'today') {
          const today = new Date()

          matchesPeriod =
            logDate.getFullYear() === today.getFullYear() &&
            logDate.getMonth() === today.getMonth() &&
            logDate.getDate() === today.getDate()
        }

        if (period === '7days') {
          const startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)

          matchesPeriod = logDate >= startDate && logDate <= now
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesPeriod
        )
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
  }, [logs, search, category, status, period])

  const statistics = useMemo(
    () => ({
      total: logs.length,
      success: logs.filter(log => log.level === 'success').length,
      changes: logs.filter(log => log.level === 'warning').length,
      errors: logs.filter(log => log.level === 'error').length
    }),
    [logs]
  )

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setStatus('all')
    setPeriod('all')
    setPage(0)
    setExpandedId(null)
  }

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value)
    setPage(0)
    setExpandedId(null)
  }

  // Demo action agar tampilan bisa diuji tanpa backend.
  const addDemoLog = () => {
    const newLog: ActivityLog = {
      id: `LOG-${String(Date.now()).slice(-6)}`,
      action: 'Log aktivitas dibuka',
      description:
        'Administrator membuka halaman audit log untuk memeriksa riwayat aktivitas pelatihan.',
      category: 'system',
      level: 'info',
      actor: 'Admin Pelatihan',
      role: 'Administrator',
      createdAt: new Date().toISOString(),
      ipAddress: '192.168.1.10',
      module: 'Log Aktivitas',
      changes: []
    }

    setLogs(current => [newLog, ...current])
    setPage(0)
    setExpandedId(newLog.id)
  }

  return (
    <Box className='flex flex-col gap-5'>
      {/* HEADER */}

      <Box className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <Box className='min-w-0'>
          <Box className='mb-2 flex items-center gap-2'>
            <i className='tabler-history text-lg text-primary' />

            <Typography variant='caption' color='text.secondary'>
              MANAJEMEN PELATIHAN
            </Typography>
          </Box>

          <Typography variant='h5' className='font-semibold'>
            Log Aktivitas
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className='mt-1'
          >
            Pantau riwayat perubahan dan tindakan administratif pelatihan.
          </Typography>

          <Box className='mt-3 flex flex-wrap items-center gap-2'>
            <Chip
              size='small'
              variant='outlined'
              label={TRAINING.code}
            />

            <Typography variant='body2' className='font-medium'>
              {TRAINING.title}
            </Typography>
          </Box>
        </Box>

        <Box className='flex flex-wrap gap-2'>
          <Button
            variant='outlined'
            startIcon={<i className='tabler-refresh' />}
            onClick={resetFilters}
          >
            Reset
          </Button>

          <Button
            variant='contained'
            startIcon={<i className='tabler-file-export' />}
            onClick={() => exportLogs(filteredLogs)}
          >
            Ekspor CSV
          </Button>
        </Box>
      </Box>

      {/* COMPACT SUMMARY */}

      <Box className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
        {[
          {
            label: 'Total aktivitas',
            value: statistics.total,
            icon: 'tabler-activity',
            color: 'primary'
          },
          {
            label: 'Berhasil',
            value: statistics.success,
            icon: 'tabler-circle-check',
            color: 'success'
          },
          {
            label: 'Perubahan',
            value: statistics.changes,
            icon: 'tabler-alert-triangle',
            color: 'warning'
          },
          {
            label: 'Gagal',
            value: statistics.errors,
            icon: 'tabler-circle-x',
            color: 'error'
          }
        ].map(item => (
          <Card key={item.label}>
            <CardContent className='flex items-center gap-3 p-4'>
              <Avatar
                variant='rounded'
                className={`bs-10 is-10 bg-${item.color}Light text-${item.color}`}
              >
                <i className={`${item.icon} text-xl`} />
              </Avatar>

              <Box className='min-w-0'>
                <Typography
                  variant='h5'
                  className='font-semibold leading-tight'
                >
                  {item.value}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mt-1 block'
                >
                  {item.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* TABLE AND FILTERS */}

      <Card>
        <CardContent className='p-0'>
          {/* TABLE HEADER */}

          <Box className='flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-5'>
            <Box>
              <Typography variant='h6' className='font-semibold'>
                Riwayat Aktivitas Pelatihan
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Klik satu baris untuk melihat detail perubahan.
              </Typography>
            </Box>

            <Chip
              size='small'
              variant='outlined'
              icon={<i className='tabler-list-details text-sm' />}
              label={`${filteredLogs.length} aktivitas`}
            />
          </Box>

          <Divider />

          {/* FILTERS */}

          <Box className='grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_160px_160px] sm:p-5'>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari aktivitas, pengguna, ID...'
              value={search}
              onChange={event =>
                updateFilter(setSearch, event.target.value)
              }
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

            <TextField
              select
              fullWidth
              size='small'
              label='Kategori'
              value={category}
              onChange={event =>
                updateFilter(setCategory, event.target.value)
              }
            >
              <MenuItem value='all'>Semua kategori</MenuItem>
              <MenuItem value='training'>Pelatihan</MenuItem>
              <MenuItem value='material'>Materi</MenuItem>
              <MenuItem value='schedule'>Jadwal</MenuItem>
              <MenuItem value='assessment'>Penilaian</MenuItem>
              <MenuItem value='attendance'>Presensi</MenuItem>
              <MenuItem value='system'>Sistem</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              size='small'
              label='Status'
              value={status}
              onChange={event =>
                updateFilter(setStatus, event.target.value)
              }
            >
              <MenuItem value='all'>Semua status</MenuItem>
              <MenuItem value='success'>Berhasil</MenuItem>
              <MenuItem value='info'>Informasi</MenuItem>
              <MenuItem value='warning'>Perubahan</MenuItem>
              <MenuItem value='error'>Gagal</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              size='small'
              label='Periode'
              value={period}
              onChange={event =>
                updateFilter(setPeriod, event.target.value)
              }
            >
              <MenuItem value='all'>Semua waktu</MenuItem>
              <MenuItem value='today'>Hari ini</MenuItem>
              <MenuItem value='7days'>7 hari terakhir</MenuItem>
            </TextField>
          </Box>

          {/* TABLE */}

          <TableContainer className='overflow-x-auto'>
            <Table size='small' className='min-w-[850px]'>
              <TableHead>
                <TableRow>
                  <TableCell width={46} />

                  <TableCell width={155}>
                    Waktu
                  </TableCell>

                  <TableCell>
                    Aktivitas
                  </TableCell>

                  <TableCell width={135}>
                    Kategori
                  </TableCell>

                  <TableCell width={185}>
                    Pelaksana
                  </TableCell>

                  <TableCell width={125}>
                    Status
                  </TableCell>

                  <TableCell align='right' width={65}>
                    Detail
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedLogs.map(log => {
                  const expanded = expandedId === log.id

                  return (
                    <>
                      <TableRow
                        key={log.id}
                        hover
                        onClick={() =>
                          setExpandedId(expanded ? null : log.id)
                        }
                        sx={{
                          cursor: 'pointer',
                          '& > td': {
                            borderBottom: expanded ? 0 : undefined,
                            py: 1.75
                          },
                          ...(expanded && {
                            bgcolor: 'action.hover'
                          })
                        }}
                      >
                        <TableCell>
                          <Tooltip title={log.id}>
                            <Avatar
                              variant='rounded'
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: 2
                              }}
                              className={`${
                                log.level === 'success'
                                  ? 'bg-successLight text-success'
                                  : log.level === 'warning'
                                    ? 'bg-warningLight text-warning'
                                    : log.level === 'error'
                                      ? 'bg-errorLight text-error'
                                      : 'bg-infoLight text-info'
                              }`}
                            >
                              <i
                                className={`${getCategoryIcon(log.category)} text-lg`}
                              />
                            </Avatar>
                          </Tooltip>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant='body2'
                            className='whitespace-nowrap font-medium'
                          >
                            {formatDate(log.createdAt)}
                          </Typography>

                          <Typography
                            variant='caption'
                            color='text.secondary'
                          >
                            {formatTime(log.createdAt)} WITA
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box className='min-w-[230px]'>
                            <Typography
                              variant='body2'
                              className='font-medium'
                            >
                              {log.action}
                            </Typography>

                            <Typography
                              variant='caption'
                              color='text.secondary'
                              className='mt-1 block'
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {log.description}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size='small'
                            variant='outlined'
                            icon={
                              <i
                                className={`${getCategoryIcon(log.category)} text-sm`}
                              />
                            }
                            label={getCategoryLabel(log.category)}
                          />
                        </TableCell>

                        <TableCell>
                          <Box className='flex items-center gap-2'>
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                fontSize: 11
                              }}
                              className='bg-actionHover text-textPrimary'
                            >
                              {getInitials(log.actor)}
                            </Avatar>

                            <Box className='min-w-0'>
                              <Typography
                                variant='body2'
                                className='truncate font-medium'
                              >
                                {log.actor}
                              </Typography>

                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                {log.role}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size='small'
                            variant='tonal'
                            color={getLevelColor(log.level)}
                            label={getLevelLabel(log.level)}
                          />
                        </TableCell>

                        <TableCell align='right'>
                          <Tooltip
                            title={
                              expanded
                                ? 'Tutup detail'
                                : 'Lihat detail'
                            }
                          >
                            <Button
                              size='small'
                              color='secondary'
                              onClick={event => {
                                event.stopPropagation()
                                setExpandedId(expanded ? null : log.id)
                              }}
                              sx={{
                                minWidth: 34,
                                px: 1
                              }}
                            >
                              <i
                                className={`${
                                  expanded
                                    ? 'tabler-chevron-up'
                                    : 'tabler-chevron-down'
                                } text-lg`}
                              />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>

                      {/* INLINE DETAIL ROW — NO MODAL */}

                      <TableRow key={`${log.id}-detail`}>
                        <TableCell
                          colSpan={7}
                          sx={{
                            p: 0,
                            borderBottom: expanded ? undefined : 0
                          }}
                        >
                          <Collapse
                            in={expanded}
                            timeout='auto'
                            unmountOnExit
                          >
                            <Box className='border-t border-divider bg-actionHover p-4 sm:p-5'>
                              <Box className='flex flex-col gap-4'>
                                {/* DETAIL HEADER */}

                                <Box className='flex flex-col justify-between gap-3 sm:flex-row sm:items-start'>
                                  <Box className='flex items-start gap-3'>
                                    <Avatar
                                      variant='rounded'
                                      className='bs-11 is-11 bg-background text-primary'
                                    >
                                      <i className='tabler-file-search text-xl' />
                                    </Avatar>

                                    <Box className='min-w-0'>
                                      <Typography
                                        variant='subtitle1'
                                        className='font-semibold'
                                      >
                                        Detail aktivitas
                                      </Typography>

                                      <Typography
                                        variant='body2'
                                        color='text.secondary'
                                      >
                                        {log.action}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Chip
                                    size='small'
                                    variant='outlined'
                                    label={log.id}
                                  />
                                </Box>

                                {/* DESCRIPTION */}

                                <Box className='rounded-lg border border-divider bg-background p-3 sm:p-4'>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    className='mb-1 block'
                                  >
                                    DESKRIPSI AKTIVITAS
                                  </Typography>

                                  <Typography
                                    variant='body2'
                                    className='leading-relaxed'
                                  >
                                    {log.description}
                                  </Typography>
                                </Box>

                                {/* METADATA GRID */}

                                <Box className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                                  {[
                                    {
                                      label: 'Tanggal dan waktu',
                                      value: `${formatDateTime(log.createdAt)} WITA`,
                                      icon: 'tabler-clock'
                                    },
                                    {
                                      label: 'Pelaksana',
                                      value: log.actor,
                                      icon: 'tabler-user'
                                    },
                                    {
                                      label: 'Peran pengguna',
                                      value: log.role,
                                      icon: 'tabler-shield'
                                    },
                                    {
                                      label: 'Modul',
                                      value: log.module,
                                      icon: 'tabler-apps'
                                    },
                                    {
                                      label: 'Kategori',
                                      value: getCategoryLabel(log.category),
                                      icon: 'tabler-category'
                                    },
                                    {
                                      label: 'Status',
                                      value: getLevelLabel(log.level),
                                      icon: 'tabler-activity'
                                    },
                                    {
                                      label: 'Alamat IP',
                                      value: log.ipAddress,
                                      icon: 'tabler-network'
                                    },
                                    {
                                      label: 'Kode pelatihan',
                                      value: TRAINING.code,
                                      icon: 'tabler-book'
                                    }
                                  ].map(item => (
                                    <Box
                                      key={item.label}
                                      className='rounded-lg border border-divider bg-background p-3'
                                    >
                                      <Box className='mb-2 flex items-center gap-2'>
                                        <i
                                          className={`${item.icon} text-base text-textSecondary`}
                                        />

                                        <Typography
                                          variant='caption'
                                          color='text.secondary'
                                        >
                                          {item.label}
                                        </Typography>
                                      </Box>

                                      <Typography
                                        variant='body2'
                                        className='break-words font-medium'
                                      >
                                        {item.value}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>

                                {/* CHANGE HISTORY */}

                                <Box className='rounded-lg border border-divider bg-background'>
                                  <Box className='flex items-center justify-between gap-3 p-3 sm:px-4'>
                                    <Box>
                                      <Typography
                                        variant='subtitle2'
                                        className='font-semibold'
                                      >
                                        Rincian perubahan
                                      </Typography>

                                      <Typography
                                        variant='caption'
                                        color='text.secondary'
                                      >
                                        Perbandingan nilai sebelum dan sesudah.
                                      </Typography>
                                    </Box>

                                    <Chip
                                      size='small'
                                      variant='outlined'
                                      label={`${log.changes?.length ?? 0} perubahan`}
                                    />
                                  </Box>

                                  <Divider />

                                  {log.changes && log.changes.length > 0 ? (
                                    <TableContainer>
                                      <Table size='small'>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>
                                              Field
                                            </TableCell>

                                            <TableCell>
                                              Sebelum
                                            </TableCell>

                                            <TableCell>
                                              Sesudah
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>

                                        <TableBody>
                                          {log.changes.map((change, index) => (
                                            <TableRow key={`${change.field}-${index}`}>
                                              <TableCell>
                                                <Typography
                                                  variant='body2'
                                                  className='font-medium'
                                                >
                                                  {change.field}
                                                </Typography>
                                              </TableCell>

                                              <TableCell>
                                                <Typography
                                                  variant='body2'
                                                  color='text.secondary'
                                                >
                                                  {change.before}
                                                </Typography>
                                              </TableCell>

                                              <TableCell>
                                                <Typography
                                                  variant='body2'
                                                  className='font-medium'
                                                >
                                                  {change.after}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  ) : (
                                    <Box className='p-4'>
                                      <Typography
                                        variant='body2'
                                        color='text.secondary'
                                      >
                                        Tidak ada rincian perubahan field untuk
                                        aktivitas ini.
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>

                                {/* FOOTER */}

                                <Box className='flex flex-wrap items-center justify-between gap-3'>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    className='flex items-center gap-1'
                                  >
                                    <i className='tabler-shield-check text-base' />
                                    ID aktivitas: {log.id}
                                  </Typography>

                                  <Button
                                    size='small'
                                    variant='text'
                                    endIcon={<i className='tabler-chevron-up' />}
                                    onClick={() => setExpandedId(null)}
                                  >
                                    Tutup detail
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                })}

                {paginatedLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box className='flex flex-col items-center gap-2 py-12 text-center'>
                        <Avatar
                          variant='rounded'
                          className='bs-14 is-14 bg-actionHover text-textSecondary'
                        >
                          <i className='tabler-search-off text-2xl' />
                        </Avatar>

                        <Typography variant='subtitle1' className='font-semibold'>
                          Aktivitas tidak ditemukan
                        </Typography>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                        >
                          Coba ubah kata kunci atau filter yang digunakan.
                        </Typography>

                        <Button
                          size='small'
                          variant='outlined'
                          onClick={resetFilters}
                        >
                          Reset filter
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <Divider />

          <TablePagination
            component='div'
            count={filteredLogs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, nextPage) => {
              setPage(nextPage)
              setExpandedId(null)
            }}
            onRowsPerPageChange={event => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
              setExpandedId(null)
            }}
            rowsPerPageOptions={[5, 8, 10, 25]}
            labelRowsPerPage='Baris per halaman'
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} dari ${count}`
            }
          />
        </CardContent>
      </Card>

      {/* FOOTNOTE */}

      <Box className='flex items-start gap-3 rounded-lg border border-divider p-3 sm:p-4'>
        <i className='tabler-info-circle mt-0.5 text-lg text-textSecondary' />

        <Box className='min-w-0'>
          <Typography variant='body2' className='font-medium'>
            Informasi audit log
          </Typography>

          <Typography
            variant='caption'
            color='text.secondary'
            className='mt-1 block leading-relaxed'
          >
            Data saat ini berupa dummy dan disimpan sementara di state halaman.
            Untuk penggunaan produksi, pencatatan aktivitas perlu dilakukan di
            backend agar riwayat tetap tersedia setelah halaman dimuat ulang.
          </Typography>

          <Button
            size='small'
            variant='text'
            className='mt-2'
            startIcon={<i className='tabler-plus' />}
            onClick={addDemoLog}
          >
            Tambah log demo
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

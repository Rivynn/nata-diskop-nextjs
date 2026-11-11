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
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import type { TrainingRecord } from '@/types/admin/trainingTypes'

type SessionsTabProps = {
  data: TrainingRecord
}

type SessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'

type TrainingSession = {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  instructor: string
  status: SessionStatus
}

const initialSessions: TrainingSession[] = [
  {
    id: 'SES-001',
    title: 'Pembukaan dan Pengenalan Program',
    description:
      'Orientasi peserta, pengenalan instruktur, penyampaian tujuan, dan alur pelaksanaan pelatihan.',
    date: '2026-10-20',
    startTime: '08:00',
    endTime: '09:00',
    location: 'Ruang Pelatihan Utama',
    instructor: 'Aditya Pratama',
    status: 'scheduled'
  },
  {
    id: 'SES-002',
    title: 'Fundamental Digital Marketing',
    description:
      'Memahami konsep pemasaran digital, perilaku konsumen, dan kanal pemasaran untuk UMKM.',
    date: '2026-10-20',
    startTime: '09:15',
    endTime: '12:00',
    location: 'Ruang Pelatihan Utama',
    instructor: 'Nadia Putri',
    status: 'scheduled'
  },
  {
    id: 'SES-003',
    title: 'Strategi Branding dan Konten',
    description:
      'Menyusun identitas merek dan merancang strategi konten yang relevan untuk media sosial.',
    date: '2026-10-20',
    startTime: '13:00',
    endTime: '15:30',
    location: 'Ruang Pelatihan Utama',
    instructor: 'Nadia Putri',
    status: 'scheduled'
  },
  {
    id: 'SES-004',
    title: 'Praktik Pembuatan Konten Promosi',
    description:
      'Praktik membuat materi promosi dan menyusun konten visual untuk kebutuhan bisnis.',
    date: '2026-10-21',
    startTime: '08:00',
    endTime: '12:00',
    location: 'Laboratorium Komputer',
    instructor: 'Aditya Pratama',
    status: 'scheduled'
  },
  {
    id: 'SES-005',
    title: 'Marketplace dan Strategi Penjualan',
    description:
      'Mengenal pengelolaan marketplace, optimasi produk, dan strategi meningkatkan penjualan online.',
    date: '2026-10-21',
    startTime: '13:00',
    endTime: '15:30',
    location: 'Laboratorium Komputer',
    instructor: 'Nadia Putri',
    status: 'scheduled'
  },
  {
    id: 'SES-006',
    title: 'Evaluasi, Presentasi, dan Penutupan',
    description:
      'Presentasi hasil praktik, evaluasi pembelajaran, umpan balik, dan penutupan program.',
    date: '2026-10-22',
    startTime: '08:00',
    endTime: '12:00',
    location: 'Ruang Pelatihan Utama',
    instructor: 'Aditya Pratama',
    status: 'scheduled'
  }
]

const statusConfig: Record<
  SessionStatus,
  {
    label: string
    color: 'info' | 'success' | 'warning' | 'error'
    icon: string
  }
> = {
  scheduled: {
    label: 'Terjadwal',
    color: 'info',
    icon: 'tabler-calendar-event'
  },
  ongoing: {
    label: 'Berlangsung',
    color: 'warning',
    icon: 'tabler-player-play'
  },
  completed: {
    label: 'Selesai',
    color: 'success',
    icon: 'tabler-circle-check'
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'error',
    icon: 'tabler-calendar-x'
  }
}

const emptyForm = {
  title: '',
  description: '',
  date: '',
  startTime: '08:00',
  endTime: '09:00',
  location: '',
  instructor: '',
  status: 'scheduled' as SessionStatus
}

const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) => {
  if (!value) return 'Belum ditentukan'

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return 'Belum ditentukan'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  }).format(date)
}

const getDateKey = (value: string) => value || 'undated'

const getDuration = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const minutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute)

  if (minutes <= 0) return '0 menit'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!hours) return `${remainingMinutes} menit`
  if (!remainingMinutes) return `${hours} jam`

  return `${hours} jam ${remainingMinutes} menit`
}

const getTotalMinutes = (session: TrainingSession) => {
  const [startHour, startMinute] = session.startTime.split(':').map(Number)
  const [endHour, endMinute] = session.endTime.split(':').map(Number)

  return Math.max(
    0,
    endHour * 60 + endMinute - (startHour * 60 + startMinute)
  )
}

const SessionsTab = ({ data }: SessionsTabProps) => {
  const [sessions, setSessions] = useState<TrainingSession[]>(initialSessions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formError, setFormError] = useState('')

  const stats = useMemo(
    () => ({
      total: sessions.length,
      scheduled: sessions.filter(item => item.status === 'scheduled').length,
      ongoing: sessions.filter(item => item.status === 'ongoing').length,
      completed: sessions.filter(item => item.status === 'completed').length,
      cancelled: sessions.filter(item => item.status === 'cancelled').length
    }),
    [sessions]
  )

  const totalDuration = useMemo(
    () =>
      sessions.reduce(
        (total, session) => total + getTotalMinutes(session),
        0
      ),
    [sessions]
  )

  const groupedSessions = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = sessions
      .filter(session => {
        const matchesSearch =
          !keyword ||
          session.title.toLowerCase().includes(keyword) ||
          session.description.toLowerCase().includes(keyword) ||
          session.instructor.toLowerCase().includes(keyword) ||
          session.location.toLowerCase().includes(keyword) ||
          session.id.toLowerCase().includes(keyword)

        const matchesStatus =
          statusFilter === 'all' || session.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(
          `${b.date} ${b.startTime}`
        )
      )

    const groups = new Map<string, TrainingSession[]>()

    filtered.forEach(session => {
      const key = getDateKey(session.date)
      const existing = groups.get(key) ?? []

      existing.push(session)
      groups.set(key, existing)
    })

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      items
    }))
  }, [sessions, search, statusFilter])

  const filteredCount = groupedSessions.reduce(
    (total, group) => total + group.items.length,
    0
  )

  const openCreateDialog = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormError('')
    setDialogOpen(true)
  }

  const openEditDialog = (session: TrainingSession) => {
    setEditingId(session.id)
    setForm({
      title: session.title,
      description: session.description,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      location: session.location,
      instructor: session.instructor,
      status: session.status
    })
    setFormError('')
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
    setFormError('')
  }

  const updateField = <K extends keyof typeof emptyForm>(
    field: K,
    value: (typeof emptyForm)[K]
  ) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  const handleSubmit = () => {
    if (
      !form.title.trim() ||
      !form.date ||
      !form.startTime ||
      !form.endTime
    ) {
      setFormError(
        'Judul, tanggal, jam mulai, dan jam selesai wajib diisi.'
      )
      return
    }

    if (form.endTime <= form.startTime) {
      setFormError('Jam selesai harus lebih akhir daripada jam mulai.')
      return
    }

    const normalizedForm = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      instructor: form.instructor.trim(),
      location: form.location.trim()
    }

    if (editingId) {
      setSessions(current =>
        current.map(session =>
          session.id === editingId
            ? { ...session, ...normalizedForm }
            : session
        )
      )
    } else {
      const newSession: TrainingSession = {
        id: `SES-${String(Date.now()).slice(-6)}`,
        ...normalizedForm
      }

      setSessions(current => [...current, newSession])
    }

    closeDialog()
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus sesi pelatihan ini?'
    )

    if (confirmed) {
      setSessions(current => current.filter(session => session.id !== id))
    }
  }

  const summaryCards = [
    {
      label: 'Total sesi',
      value: stats.total,
      icon: 'tabler-calendar-event',
      color: 'primary',
      detail: 'Seluruh agenda'
    },
    {
      label: 'Terjadwal',
      value: stats.scheduled,
      icon: 'tabler-calendar-check',
      color: 'info',
      detail: 'Menunggu pelaksanaan'
    },
    {
      label: 'Berlangsung',
      value: stats.ongoing,
      icon: 'tabler-player-play',
      color: 'warning',
      detail: 'Sedang berjalan'
    },
    {
      label: 'Selesai',
      value: stats.completed,
      icon: 'tabler-circle-check',
      color: 'success',
      detail: 'Telah terlaksana'
    }
  ]

  return (
    <Box className='flex flex-col gap-5'>
      {/* Header */}
      <Box className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <Box className='min-w-0'>
          <Box className='mb-1 flex items-center gap-2 text-sm text-textSecondary'>
            <i className='tabler-calendar-event text-lg' />
            <Typography variant='caption' color='text.secondary'>
              MANAJEMEN PELATIHAN
            </Typography>
          </Box>

          <Typography variant='h5' className='font-semibold'>
            Jadwal & Sesi
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className='mt-1'
          >
            Kelola agenda, waktu, lokasi, dan instruktur pelatihan.
          </Typography>
        </Box>

        <Button
          variant='contained'
          onClick={openCreateDialog}
          startIcon={<i className='tabler-plus' />}
          className='shrink-0'
        >
          Tambah sesi
        </Button>
      </Box>

      {/* Statistics */}
      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {summaryCards.map(stat => (
          <Card
            key={stat.label}
            className='h-full transition-shadow hover:shadow-md'
          >
            <CardContent className='flex items-start justify-between gap-3 p-5'>
              <Box className='min-w-0'>
                <Typography variant='body2' color='text.secondary'>
                  {stat.label}
                </Typography>

                <Typography
                  variant='h4'
                  className='mt-2 font-semibold tracking-tight'
                >
                  {stat.value.toString().padStart(2, '0')}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mt-1 block'
                >
                  {stat.detail}
                </Typography>
              </Box>

              <Avatar
                variant='rounded'
                className={`bs-12 is-12 bg-${stat.color}Light text-${stat.color}`}
              >
                <i className={`${stat.icon} text-2xl`} />
              </Avatar>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Training schedule overview */}
      <Card>
        <CardContent className='p-5'>
          <Box className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <Box className='flex min-w-0 items-start gap-4'>
              <Avatar
                variant='rounded'
                className='bs-14 is-14 shrink-0 bg-primaryLight text-primary'
              >
                <i className='tabler-calendar-stats text-3xl' />
              </Avatar>

              <Box className='min-w-0 flex-1'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mb-1 block'
                >
                  PROGRAM PELATIHAN
                </Typography>

                <Typography
                  variant='h6'
                  className='break-words font-semibold'
                >
                  {data.title || 'Program pelatihan'}
                </Typography>

                <Box className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2'>
                  <Box className='flex items-center gap-2'>
                    <i className='tabler-calendar text-base text-textSecondary' />
                    <Typography variant='body2' color='text.secondary'>
                      {formatDate(data.schedule?.startDate ?? '', {
                        day: 'numeric',
                        month: 'short'
                      })}
                      {' – '}
                      {formatDate(data.schedule?.endDate ?? '', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Box>

                  <Box className='flex items-center gap-2'>
                    <i className='tabler-map-pin text-base text-textSecondary' />
                    <Typography variant='body2' color='text.secondary'>
                      {data.schedule?.format === 'online'
                        ? 'Online'
                        : data.schedule?.format === 'hybrid'
                          ? 'Hybrid'
                          : 'Tatap muka'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider className='lg:hidden' />

            <Box className='grid grid-cols-2 gap-5 lg:min-w-[250px]'>
              <Box>
                <Box className='mb-1 flex items-center gap-2'>
                  <i className='tabler-clock-hour-4 text-lg text-textSecondary' />
                  <Typography variant='caption' color='text.secondary'>
                    Total durasi
                  </Typography>
                </Box>

                <Typography variant='h6' className='font-semibold'>
                  {Math.floor(totalDuration / 60) > 0
                    ? `${Math.floor(totalDuration / 60)} jam`
                    : `${totalDuration} menit`}
                </Typography>
              </Box>

              <Box>
                <Box className='mb-1 flex items-center gap-2'>
                  <i className='tabler-list-check text-lg text-textSecondary' />
                  <Typography variant='caption' color='text.secondary'>
                    Total agenda
                  </Typography>
                </Box>

                <Typography variant='h6' className='font-semibold'>
                  {stats.total} sesi
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Agenda */}
      <Card>
        <CardContent className='p-4 sm:p-5'>
          <Box className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <Box>
              <Typography variant='h6' className='font-semibold'>
                Agenda pelatihan
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='mt-1'
              >
                Susunan kegiatan berdasarkan tanggal dan waktu pelaksanaan.
              </Typography>
            </Box>

            <Chip
              size='small'
              variant='tonal'
              color='primary'
              icon={<i className='tabler-calendar-time text-base' />}
              label={`${filteredCount} sesi`}
            />
          </Box>

          {/* Search and filters */}
          <Box className='mb-5 flex flex-col gap-3 sm:flex-row'>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari sesi, instruktur, lokasi...'
              value={search}
              onChange={event => setSearch(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search text-xl text-textSecondary' />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        aria-label='Hapus pencarian'
                        onClick={() => setSearch('')}
                      >
                        <i className='tabler-x text-lg' />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined
                }
              }}
            />

            <TextField
              select
              size='small'
              label='Status sesi'
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
              className='sm:min-w-[190px]'
            >
              <MenuItem value='all'>Semua status</MenuItem>
              <MenuItem value='scheduled'>Terjadwal</MenuItem>
              <MenuItem value='ongoing'>Berlangsung</MenuItem>
              <MenuItem value='completed'>Selesai</MenuItem>
              <MenuItem value='cancelled'>Dibatalkan</MenuItem>
            </TextField>
          </Box>

          <Divider className='mb-5' />

          {/* Grouped schedule timeline */}
          {groupedSessions.length > 0 ? (
            <Box className='flex flex-col gap-7'>
              {groupedSessions.map((group, groupIndex) => {
                const date = group.date === 'undated'
                  ? null
                  : new Date(`${group.date}T00:00:00`)

                const weekday = date
                  ? new Intl.DateTimeFormat('id-ID', {
                      weekday: 'long'
                    }).format(date)
                  : 'Tanggal belum ditentukan'

                const dayNumber = date
                  ? new Intl.DateTimeFormat('id-ID', {
                      day: '2-digit'
                    }).format(date)
                  : '—'

                const monthYear = date
                  ? new Intl.DateTimeFormat('id-ID', {
                      month: 'short',
                      year: 'numeric'
                    }).format(date)
                  : ''

                const dayDuration = group.items.reduce(
                  (total, session) => total + getTotalMinutes(session),
                  0
                )

                return (
                  <Box key={group.date}>
                    {/* Date heading */}
                    <Box className='mb-4 flex items-center gap-3'>
                      <Box className='flex min-w-[64px] flex-col items-center justify-center rounded-xl border border-primary/20 bg-primaryLight px-3 py-2'>
                        <Typography
                          variant='h5'
                          className='font-bold leading-none text-primary'
                        >
                          {dayNumber}
                        </Typography>

                        <Typography
                          variant='caption'
                          className='mt-1 font-semibold uppercase text-primary'
                        >
                          {date
                            ? new Intl.DateTimeFormat('id-ID', {
                                month: 'short'
                              }).format(date)
                            : '—'}
                        </Typography>
                      </Box>

                      <Box className='min-w-0 flex-1'>
                        <Typography
                          variant='subtitle1'
                          className='font-semibold capitalize'
                        >
                          {weekday}
                        </Typography>

                        <Typography variant='caption' color='text.secondary'>
                          {monthYear}
                          {date ? ' · ' : ''}
                          {group.items.length} sesi
                          {' · '}
                          {Math.floor(dayDuration / 60) > 0
                            ? `${Math.floor(dayDuration / 60)} jam`
                            : `${dayDuration} menit`}
                        </Typography>
                      </Box>

                      {groupIndex === 0 && (
                        <Chip
                          size='small'
                          variant='outlined'
                          color='secondary'
                          label='Agenda'
                          className='hidden sm:flex'
                        />
                      )}
                    </Box>

                    {/* Sessions on this date */}
                    <Box className='ml-2 flex flex-col gap-3 border-l-2 border-divider pl-4 sm:ml-8 sm:pl-6'>
                      {group.items.map((session, sessionIndex) => {
                        const status = statusConfig[session.status]

                        return (
                          <Box
                            key={session.id}
                            className='relative min-w-0 rounded-xl border border-divider bg-backgroundPaper transition-all duration-200 hover:border-primary/40 hover:shadow-sm'
                          >
                            {/* Timeline node */}
                            <Box className='absolute -left-[25px] top-6 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-backgroundPaper sm:-left-[33px]'>
                              <Box className='h-1 w-1 rounded-full bg-primary' />
                            </Box>

                            <Box className='flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start'>
                              {/* Time column */}
                              <Box className='flex shrink-0 items-start gap-3 lg:w-[145px] lg:flex-col lg:gap-1'>
                                <Box className='flex items-center gap-2'>
                                  <i className='tabler-clock-hour-4 text-lg text-primary' />
                                  <Typography
                                    variant='subtitle2'
                                    className='font-bold'
                                  >
                                    {session.startTime}
                                  </Typography>
                                </Box>

                                <Box className='flex items-center gap-2 lg:pl-7'>
                                  <i className='tabler-arrow-down text-sm text-textSecondary' />
                                  <Typography
                                    variant='body2'
                                    color='text.secondary'
                                  >
                                    {session.endTime}
                                  </Typography>
                                </Box>

                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                  className='lg:pl-7'
                                >
                                  {getDuration(
                                    session.startTime,
                                    session.endTime
                                  )}
                                </Typography>
                              </Box>

                              <Divider
                                orientation='vertical'
                                flexItem
                                className='hidden lg:block'
                              />

                              {/* Session information */}
                              <Box className='min-w-0 flex-1'>
                                <Box className='mb-2 flex flex-wrap items-center gap-2'>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    className='font-semibold'
                                  >
                                    {session.id}
                                  </Typography>

                                  <Chip
                                    size='small'
                                    color={status.color}
                                    variant='tonal'
                                    icon={
                                      <i className={`${status.icon} text-sm`} />
                                    }
                                    label={status.label}
                                  />
                                </Box>

                                <Typography
                                  variant='subtitle1'
                                  className='break-words font-semibold leading-snug'
                                >
                                  {session.title}
                                </Typography>

                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                  className='mt-2 leading-relaxed'
                                >
                                  {session.description ||
                                    'Belum ada deskripsi untuk sesi ini.'}
                                </Typography>

                                <Box className='mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-5'>
                                  <Box className='flex min-w-0 items-center gap-2'>
                                    <i className='tabler-user-circle text-lg text-textSecondary' />

                                    <Box className='min-w-0'>
                                      <Typography
                                        variant='caption'
                                        color='text.secondary'
                                        className='block'
                                      >
                                        Instruktur
                                      </Typography>

                                      <Typography
                                        variant='body2'
                                        className='break-words font-medium'
                                      >
                                        {session.instructor ||
                                          'Belum ditentukan'}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box className='flex min-w-0 items-center gap-2'>
                                    <i className='tabler-map-pin text-lg text-textSecondary' />

                                    <Box className='min-w-0'>
                                      <Typography
                                        variant='caption'
                                        color='text.secondary'
                                        className='block'
                                      >
                                        Lokasi
                                      </Typography>

                                      <Typography
                                        variant='body2'
                                        className='break-words font-medium'
                                      >
                                        {session.location ||
                                          'Belum ditentukan'}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Actions */}
                              <Box className='flex shrink-0 items-center justify-between gap-2 border-t border-divider pt-3 lg:border-0 lg:pt-0'>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                  className='lg:hidden'
                                >
                                  Sesi {String(sessionIndex + 1).padStart(2, '0')}
                                </Typography>

                                <Box className='flex items-center gap-1'>
                                  <Tooltip title='Edit sesi'>
                                    <IconButton
                                      size='small'
                                      aria-label={`Edit ${session.title}`}
                                      onClick={() => openEditDialog(session)}
                                    >
                                      <i className='tabler-edit text-lg' />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title='Hapus sesi'>
                                    <IconButton
                                      size='small'
                                      color='error'
                                      aria-label={`Hapus ${session.title}`}
                                      onClick={() => handleDelete(session.id)}
                                    >
                                      <i className='tabler-trash text-lg' />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          ) : (
            <Box className='flex flex-col items-center justify-center py-14 text-center'>
              <Avatar
                variant='rounded'
                className='mb-4 bs-16 is-16 bg-actionHover text-textSecondary'
              >
                <i className='tabler-calendar-off text-3xl' />
              </Avatar>

              <Typography variant='h6' className='font-semibold'>
                Agenda tidak ditemukan
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='mt-1 max-w-sm'
              >
                Tidak ada sesi yang cocok dengan pencarian atau filter yang
                dipilih.
              </Typography>

              <Box className='mt-4 flex flex-wrap justify-center gap-2'>
                {(search || statusFilter !== 'all') && (
                  <Button
                    size='small'
                    variant='outlined'
                    color='secondary'
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('all')
                    }}
                    startIcon={<i className='tabler-refresh' />}
                  >
                    Reset filter
                  </Button>
                )}

                <Button
                  size='small'
                  variant='contained'
                  onClick={openCreateDialog}
                  startIcon={<i className='tabler-plus' />}
                >
                  Tambah sesi
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create / edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle className='flex items-start gap-3 pb-2'>
          <Avatar
            variant='rounded'
            className='bs-10 is-10 bg-primaryLight text-primary'
          >
            <i
              className={`${
  editingId ? 'tabler-edit' : 'tabler-calendar-plus'
} text-xl`}
            />
          </Avatar>

          <Box className='min-w-0 flex-1'>
            <Typography variant='h6' className='font-semibold'>
              {editingId ? 'Edit sesi pelatihan' : 'Tambah sesi pelatihan'}
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Lengkapi informasi agenda dan waktu pelaksanaan.
            </Typography>
          </Box>

          <IconButton
            size='small'
            aria-label='Tutup dialog'
            onClick={closeDialog}
          >
            <i className='tabler-x text-xl' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box className='flex flex-col gap-4 pt-4'>
            <TextField
              label='Judul sesi'
              placeholder='Contoh: Fundamental Digital Marketing'
              value={form.title}
              onChange={event => updateField('title', event.target.value)}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label='Deskripsi sesi'
              placeholder='Jelaskan materi atau kegiatan yang akan dilakukan...'
              value={form.description}
              onChange={event =>
                updateField('description', event.target.value)
              }
              fullWidth
              multiline
              rows={3}
            />

            <Divider />

            <Typography
              variant='subtitle2'
              className='flex items-center gap-2 font-semibold'
            >
              <i className='tabler-calendar-time text-lg text-primary' />
              Waktu pelaksanaan
            </Typography>

            <TextField
              label='Tanggal sesi'
              type='date'
              value={form.date}
              onChange={event => updateField('date', event.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <TextField
                label='Jam mulai'
                type='time'
                value={form.startTime}
                onChange={event =>
                  updateField('startTime', event.target.value)
                }
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                label='Jam selesai'
                type='time'
                value={form.endTime}
                onChange={event =>
                  updateField('endTime', event.target.value)
                }
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Divider />

            <Typography
              variant='subtitle2'
              className='flex items-center gap-2 font-semibold'
            >
              <i className='tabler-map-pin text-lg text-primary' />
              Detail pelaksanaan
            </Typography>

            <TextField
              label='Instruktur'
              placeholder='Nama instruktur'
              value={form.instructor}
              onChange={event =>
                updateField('instructor', event.target.value)
              }
              fullWidth
            />

            <TextField
              label='Lokasi / ruang / tautan'
              placeholder='Contoh: Ruang Pelatihan Utama'
              value={form.location}
              onChange={event =>
                updateField('location', event.target.value)
              }
              fullWidth
            />

            <TextField
              select
              label='Status sesi'
              value={form.status}
              onChange={event =>
                updateField('status', event.target.value as SessionStatus)
              }
              fullWidth
            >
              <MenuItem value='scheduled'>Terjadwal</MenuItem>
              <MenuItem value='ongoing'>Berlangsung</MenuItem>
              <MenuItem value='completed'>Selesai</MenuItem>
              <MenuItem value='cancelled'>Dibatalkan</MenuItem>
            </TextField>

            {formError && (
              <Box className='flex items-start gap-2 rounded-lg border border-error/30 bg-error/5 p-3'>
                <i className='tabler-alert-circle mt-0.5 text-lg text-error' />

                <Typography variant='body2' color='error'>
                  {formError}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions className='flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row'>
          <Button
            onClick={closeDialog}
            color='secondary'
            variant='outlined'
            startIcon={<i className='tabler-x' />}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={handleSubmit}
            startIcon={
              <i className={editingId ? 'tabler-device-floppy' : 'tabler-plus'} />
            }
          >
            {editingId ? 'Simpan perubahan' : 'Tambah sesi'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SessionsTab

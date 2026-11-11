
'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import { toast } from 'react-toastify'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@core/components/mui/TextField'

type TrainingMaterial = {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
}

type TrainingSession = {
  id: string
  title: string
  description: string
  date: Date | null
  location: string
  materials: TrainingMaterial[]
}

type ScheduleRegistrationForm = {
  registrationStart: Date | null
  registrationEnd: Date | null
  quota: string
  minParticipants: string
  sessions: TrainingSession[]
}

type ReviewMaterial = Omit<TrainingMaterial, 'id'> & {
  id: string
  durationMinutes: number
}

type ReviewSession = Omit<TrainingSession, 'date' | 'materials'> & {
  date: string | null
  materials: ReviewMaterial[]
}

export type ScheduleRegistrationData = {
  registrationStart: string | null
  registrationEnd: string | null
  quota: number
  minParticipants: number
  sessions: ReviewSession[]
}

type StepScheduleRegistrationProps = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: any[]
  trainingStartDate?: string
  trainingEndDate?: string
  initialData?: Partial<ScheduleRegistrationData>
  onDataChange?: (data: ScheduleRegistrationData) => void
}

type FormErrors = Record<string, string>

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const createMaterial = (): TrainingMaterial => ({
  id: createId(),
  title: '',
  description: '',
  startTime: '08:00',
  endTime: '09:00'
})

const createSession = (index: number): TrainingSession => ({
  id: createId(),
  title: `Sesi ${index + 1}`,
  description: '',
  date: null,
  location: '',
  materials: [createMaterial()]
})

const parseLocalDate = (value?: string | null): Date | null => {
  if (!value) return null

  const parts = value.split('T')[0].split('-').map(Number)

  if (parts.length !== 3 || parts.some(Number.isNaN)) return null

  const [year, month, day] = parts

  return new Date(year, month - 1, day)
}

const toLocalDateString = (date: Date | null): string | null => {
  if (!date) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const formatDate = (date: Date | null) => {
  if (!date) return 'Belum ditentukan'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const getDurationMinutes = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return 0

  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  if ([startHour, startMinute, endHour, endMinute].some(Number.isNaN)) {
    return 0
  }

  return endHour * 60 + endMinute - (startHour * 60 + startMinute)
}

const formatDuration = (minutes: number) => {
  if (minutes <= 0) return '0 menit'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} menit`
  if (remainingMinutes === 0) return `${hours} jam`

  return `${hours} jam ${remainingMinutes} menit`
}

const hydrateForm = (
  initialData?: Partial<ScheduleRegistrationData>
): ScheduleRegistrationForm => {
  if (!initialData) {
    return {
      registrationStart: null,
      registrationEnd: null,
      quota: '30',
      minParticipants: '1',
      sessions: [createSession(0)]
    }
  }

  const sessions = (initialData.sessions ?? []).map((session, index) => ({
    id: session.id || createId(),
    title: session.title || `Sesi ${index + 1}`,
    description: session.description || '',
    date: parseLocalDate(session.date),
    location: session.location || '',
    materials: (session.materials ?? []).map(material => ({
      id: material.id || createId(),
      title: material.title || '',
      description: material.description || '',
      startTime: material.startTime || '08:00',
      endTime: material.endTime || '09:00'
    }))
  }))

  return {
    registrationStart: parseLocalDate(initialData.registrationStart),
    registrationEnd: parseLocalDate(initialData.registrationEnd),
    quota: String(initialData.quota ?? 30),
    minParticipants: String(initialData.minParticipants ?? 1),
    sessions: sessions.length
      ? sessions
      : [createSession(0)]
  }
}

const StepScheduleRegistration = ({
                                    handleNext,
                                    handlePrev,
                                    trainingStartDate,
                                    trainingEndDate,
                                    initialData,
                                    onDataChange
                                  }: StepScheduleRegistrationProps) => {
  const [form, setForm] = useState<ScheduleRegistrationForm>(() =>
    hydrateForm(initialData)
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trainingStart = useMemo(
    () => parseLocalDate(trainingStartDate),
    [trainingStartDate]
  )

  const trainingEnd = useMemo(
    () => parseLocalDate(trainingEndDate),
    [trainingEndDate]
  )

  const totalMaterials = form.sessions.reduce(
    (total, session) => total + session.materials.length,
    0
  )

  const totalDuration = form.sessions.reduce(
    (total, session) =>
      total +
      session.materials.reduce(
        (minutes, material) =>
          minutes +
          Math.max(
            0,
            getDurationMinutes(material.startTime, material.endTime)
          ),
        0
      ),
    0
  )

  /*
   * Kirim data ke wizard induk setiap kali form berubah.
   * Tanggal dikirim sebagai YYYY-MM-DD agar bisa dibaca StepReview.
   */
  useEffect(() => {
    if (!onDataChange) return

    onDataChange({
      registrationStart: toLocalDateString(form.registrationStart),
      registrationEnd: toLocalDateString(form.registrationEnd),
      quota: Number(form.quota) || 0,
      minParticipants: Number(form.minParticipants) || 0,
      sessions: form.sessions.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        date: toLocalDateString(session.date),
        location: session.location,
        materials: session.materials.map(material => ({
          ...material,
          durationMinutes: Math.max(
            0,
            getDurationMinutes(material.startTime, material.endTime)
          )
        }))
      }))
    })
  }, [form, onDataChange])

  const updateForm = <K extends keyof ScheduleRegistrationForm>(
    key: K,
    value: ScheduleRegistrationForm[K]
  ) => {
    setForm(previous => ({ ...previous, [key]: value }))

    setErrors(previous => {
      const next = { ...previous }

      delete next[key]

      if (key === 'quota' || key === 'minParticipants') {
        delete next.quota
        delete next.minParticipants
      }

      return next
    })
  }

  const updateSession = (
    sessionId: string,
    key: keyof Omit<TrainingSession, 'id' | 'materials'>,
    value: string | Date | null
  ) => {
    setForm(previous => ({
      ...previous,
      sessions: previous.sessions.map(session =>
        session.id === sessionId
          ? { ...session, [key]: value }
          : session
      )
    }))

    setErrors(previous => {
      const next = { ...previous }

      delete next[`session-${sessionId}-${key}`]

      return next
    })
  }

  const updateMaterial = (
    sessionId: string,
    materialId: string,
    key: keyof Omit<TrainingMaterial, 'id'>,
    value: string
  ) => {
    setForm(previous => ({
      ...previous,
      sessions: previous.sessions.map(session =>
        session.id === sessionId
          ? {
            ...session,
            materials: session.materials.map(material =>
              material.id === materialId
                ? { ...material, [key]: value }
                : material
            )
          }
          : session
      )
    }))

    setErrors(previous => {
      const next = { ...previous }

      delete next[`material-${materialId}-${key}`]
      delete next[`material-${materialId}-time`]

      return next
    })
  }

  const addSession = () => {
    setForm(previous => ({
      ...previous,
      sessions: [
        ...previous.sessions,
        createSession(previous.sessions.length)
      ]
    }))
  }

  const removeSession = (sessionId: string) => {
    if (form.sessions.length <= 1) {
      toast.error('Minimal harus ada satu sesi pelatihan.')
      return
    }

    setForm(previous => ({
      ...previous,
      sessions: previous.sessions
        .filter(session => session.id !== sessionId)
        .map((session, index) => ({
          ...session,
          title: session.title.startsWith('Sesi ')
            ? `Sesi ${index + 1}`
            : session.title
        }))
    }))

    setErrors(previous => {
      const next = { ...previous }

      Object.keys(next).forEach(key => {
        if (key.includes(sessionId)) delete next[key]
      })

      return next
    })
  }

  const addMaterial = (sessionId: string) => {
    setForm(previous => ({
      ...previous,
      sessions: previous.sessions.map(session =>
        session.id === sessionId
          ? {
            ...session,
            materials: [...session.materials, createMaterial()]
          }
          : session
      )
    }))
  }

  const removeMaterial = (sessionId: string, materialId: string) => {
    const session = form.sessions.find(item => item.id === sessionId)

    if (!session || session.materials.length <= 1) {
      toast.error('Minimal setiap sesi memiliki satu materi.')
      return
    }

    setForm(previous => ({
      ...previous,
      sessions: previous.sessions.map(item =>
        item.id === sessionId
          ? {
            ...item,
            materials: item.materials.filter(
              material => material.id !== materialId
            )
          }
          : item
      )
    }))

    setErrors(previous => {
      const next = { ...previous }

      Object.keys(next).forEach(key => {
        if (key.includes(materialId)) delete next[key]
      })

      return next
    })
  }

  const validate = () => {
    const nextErrors: FormErrors = {}
    const today = startOfDay(new Date())

    const quota = Number(form.quota)
    const minParticipants = Number(form.minParticipants)

    if (!form.registrationStart) {
      nextErrors.registrationStart = 'Tanggal mulai pendaftaran wajib diisi.'
    } else if (startOfDay(form.registrationStart) < today) {
      nextErrors.registrationStart =
        'Tanggal pendaftaran tidak boleh di masa lalu.'
    }

    if (!form.registrationEnd) {
      nextErrors.registrationEnd = 'Tanggal akhir pendaftaran wajib diisi.'
    } else if (
      form.registrationStart &&
      startOfDay(form.registrationEnd) <
      startOfDay(form.registrationStart)
    ) {
      nextErrors.registrationEnd =
        'Tanggal akhir harus sama dengan atau setelah tanggal mulai.'
    }

    if (!form.quota || !Number.isInteger(quota) || quota < 1) {
      nextErrors.quota = 'Kuota harus berupa bilangan bulat minimal 1.'
    }

    if (
      !form.minParticipants ||
      !Number.isInteger(minParticipants) ||
      minParticipants < 1
    ) {
      nextErrors.minParticipants =
        'Minimal peserta harus berupa bilangan bulat minimal 1.'
    } else if (
      Number.isInteger(quota) &&
      quota >= 1 &&
      minParticipants > quota
    ) {
      nextErrors.minParticipants =
        'Minimal peserta tidak boleh melebihi kuota.'
    }

    if (form.sessions.length === 0) {
      nextErrors.sessions = 'Tambahkan minimal satu sesi pelatihan.'
    }

    if (trainingStart && trainingEnd && trainingStart > trainingEnd) {
      nextErrors.trainingPeriod =
        'Periksa kembali tanggal mulai dan akhir pelatihan pada langkah sebelumnya.'
    }

    form.sessions.forEach((session, sessionIndex) => {
      const sessionLabel = session.title.trim() || `Sesi ${sessionIndex + 1}`

      if (!session.title.trim()) {
        nextErrors[`session-${session.id}-title`] =
          'Judul sesi wajib diisi.'
      }

      if (!session.description.trim()) {
        nextErrors[`session-${session.id}-description`] =
          'Deskripsi atau keterangan sesi wajib diisi.'
      }

      if (!session.date) {
        nextErrors[`session-${session.id}-date`] =
          'Tanggal sesi wajib diisi.'
      } else {
        const sessionDay = startOfDay(session.date)

        if (trainingStart && sessionDay < startOfDay(trainingStart)) {
          nextErrors[`session-${session.id}-date`] =
            'Tanggal sesi tidak boleh sebelum tanggal mulai pelatihan.'
        }

        if (trainingEnd && sessionDay > startOfDay(trainingEnd)) {
          nextErrors[`session-${session.id}-date`] =
            'Tanggal sesi tidak boleh setelah tanggal akhir pelatihan.'
        }

        if (
          form.registrationEnd &&
          sessionDay < startOfDay(form.registrationEnd)
        ) {
          nextErrors[`session-${session.id}-date`] =
            'Tanggal sesi tidak boleh sebelum pendaftaran berakhir.'
        }
      }

      if (!session.location.trim()) {
        nextErrors[`session-${session.id}-location`] =
          'Lokasi sesi wajib diisi.'
      }

      if (session.materials.length === 0) {
        nextErrors[`session-${session.id}-materials`] =
          'Tambahkan minimal satu materi.'
      }

      session.materials.forEach((material, materialIndex) => {
        if (!material.title.trim()) {
          nextErrors[`material-${material.id}-title`] =
            `Judul materi ${materialIndex + 1} pada ${sessionLabel} wajib diisi.`
        }

        if (!material.startTime || !material.endTime) {
          nextErrors[`material-${material.id}-time`] =
            'Jam mulai dan jam selesai wajib diisi.'
          return
        }

        const duration = getDurationMinutes(
          material.startTime,
          material.endTime
        )

        if (duration <= 0) {
          nextErrors[`material-${material.id}-time`] =
            'Jam selesai harus setelah jam mulai.'
        }
      })

      // Materi dalam satu sesi tidak boleh memiliki waktu yang bertabrakan.
      for (let i = 0; i < session.materials.length; i++) {
        for (let j = i + 1; j < session.materials.length; j++) {
          const first = session.materials[i]
          const second = session.materials[j]

          if (
            !first.startTime ||
            !first.endTime ||
            !second.startTime ||
            !second.endTime
          ) {
            continue
          }

          if (
            first.startTime < second.endTime &&
            second.startTime < first.endTime
          ) {
            nextErrors[`material-${second.id}-time`] =
              'Jadwal materi bertabrakan dengan materi lain dalam sesi ini.'
          }
        }
      }
    })

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Periksa kembali data yang belum valid.')
      return
    }

    setIsSubmitting(true)

    try {
      onDataChange?.({
        registrationStart: toLocalDateString(form.registrationStart),
        registrationEnd: toLocalDateString(form.registrationEnd),
        quota: Number(form.quota),
        minParticipants: Number(form.minParticipants),
        sessions: form.sessions.map((session, sessionIndex) => ({
          id: session.id,
          order: sessionIndex + 1,
          title: session.title.trim(),
          description: session.description.trim(),
          date: toLocalDateString(session.date),
          location: session.location.trim(),
          materials: session.materials.map((material, materialIndex) => ({
            ...material,
            order: materialIndex + 1,
            title: material.title.trim(),
            description: material.description.trim(),
            durationMinutes: getDurationMinutes(
              material.startTime,
              material.endTime
            )
          }))
        }))
      })

      handleNext()
    } catch (error) {
      console.error(error)
      toast.error('Terjadi kesalahan saat memvalidasi jadwal.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const datePickerMin = (date: Date | null) =>
    date ? startOfDay(date) : undefined

  return (
    <Stack spacing={5}>
      {/* Header */}
      <Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent='space-between'
          spacing={2}
        >
          <Box>
            <Typography variant='h4' fontWeight={700}>
              Pendaftaran & Jadwal
            </Typography>
            <Typography color='text.secondary' sx={{ mt: 1 }}>
              Atur periode pendaftaran, kapasitas peserta, sesi, dan rincian
              materi pelatihan.
            </Typography>
          </Box>

          <Chip
            icon={<i className='tabler-calendar-time' />}
            label={`${form.sessions.length} Sesi`}
            color='primary'
            variant='tonal'
          />
        </Stack>
      </Box>

      {/* Registration */}
      <Card variant='outlined'>
        <CardContent>
          <Stack spacing={4}>
            <Stack direction='row' alignItems='center' spacing={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                  flexShrink: 0
                }}
              >
                <i className='tabler-clipboard-list' style={{ fontSize: 24 }} />
              </Box>

              <Box>
                <Typography variant='h6' fontWeight={700}>
                  Pengaturan Pendaftaran
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Tentukan periode pendaftaran dan kapasitas peserta.
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  md: 'repeat(2, minmax(0, 1fr))'
                },
                gap: 3
              }}
            >
              <AppReactDatepicker
                selected={form.registrationStart}
                onChange={(date: Date | null) =>
                  updateForm('registrationStart', date)
                }
                minDate={new Date()}
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                customInput={
                  <CustomTextField
                    fullWidth
                    label='Mulai Pendaftaran'
                    placeholder='Pilih tanggal mulai'
                    required
                    error={Boolean(errors.registrationStart)}
                    helperText={errors.registrationStart}
                    InputProps={{
                      startAdornment: (
                        <i
                          className='tabler-calendar'
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                      )
                    }}
                  />
                }
              />

              <AppReactDatepicker
                selected={form.registrationEnd}
                onChange={(date: Date | null) =>
                  updateForm('registrationEnd', date)
                }
                minDate={
                  datePickerMin(form.registrationStart) ?? new Date()
                }
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                customInput={
                  <CustomTextField
                    fullWidth
                    label='Akhir Pendaftaran'
                    placeholder='Pilih tanggal akhir'
                    required
                    error={Boolean(errors.registrationEnd)}
                    helperText={errors.registrationEnd}
                    InputProps={{
                      startAdornment: (
                        <i
                          className='tabler-calendar-check'
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                      )
                    }}
                  />
                }
              />

              <TextField
                fullWidth
                required
                type='number'
                label='Kuota Peserta'
                value={form.quota}
                onChange={event => updateForm('quota', event.target.value)}
                error={Boolean(errors.quota)}
                helperText={
                  errors.quota ||
                  'Jumlah maksimal peserta yang dapat diterima.'
                }
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />

              <TextField
                fullWidth
                required
                type='number'
                label='Minimal Peserta'
                value={form.minParticipants}
                onChange={event =>
                  updateForm('minParticipants', event.target.value)
                }
                error={Boolean(errors.minParticipants)}
                helperText={
                  errors.minParticipants ||
                  'Default 1 peserta. Tidak boleh melebihi kuota.'
                }
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Session schedule */}
      <Card variant='outlined'>
        <CardContent>
          <Stack spacing={4}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent='space-between'
              spacing={2}
            >
              <Stack direction='row' alignItems='center' spacing={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    flexShrink: 0
                  }}
                >
                  <i
                    className='tabler-calendar-event'
                    style={{ fontSize: 24 }}
                  />
                </Box>

                <Box>
                  <Typography variant='h6' fontWeight={700}>
                    Jadwal Sesi Pelatihan
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Setiap sesi dapat memiliki beberapa materi dengan jam
                    masing-masing.
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={addSession}
              >
                Tambah Sesi
              </Button>
            </Stack>

            <Divider />

            {errors.sessions && (
              <Alert severity='error'>{errors.sessions}</Alert>
            )}

            {errors.trainingPeriod && (
              <Alert severity='error'>{errors.trainingPeriod}</Alert>
            )}

            {form.sessions.map((session, sessionIndex) => {
              const sessionDuration = session.materials.reduce(
                (total, material) =>
                  total +
                  Math.max(
                    0,
                    getDurationMinutes(material.startTime, material.endTime)
                  ),
                0
              )

              return (
                <Box
                  key={session.id}
                  sx={{
                    border: theme => `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  {/* Session header */}
                  <Box
                    sx={{
                      px: { xs: 3, md: 4 },
                      py: 3,
                      bgcolor: 'action.hover'
                    }}
                  >
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='space-between'
                      spacing={2}
                    >
                      <Stack direction='row' alignItems='center' spacing={2}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {String(sessionIndex + 1).padStart(2, '0')}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={700}>
                            {session.title || `Sesi ${sessionIndex + 1}`}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {session.materials.length} materi ·{' '}
                            {formatDuration(sessionDuration)}
                          </Typography>
                        </Box>
                      </Stack>

                      <IconButton
                        color='error'
                        onClick={() => removeSession(session.id)}
                        aria-label='Hapus sesi'
                        title='Hapus sesi'
                        disabled={form.sessions.length <= 1}
                      >
                        <i className='tabler-trash' />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={4}>
                      {/* Session information */}
                      <Box>
                        <Typography
                          variant='subtitle1'
                          fontWeight={700}
                          sx={{ mb: 3 }}
                        >
                          Informasi Sesi
                        </Typography>

                        <Stack spacing={3}>
                          <TextField
                            fullWidth
                            required
                            label='Judul Sesi'
                            placeholder='Contoh: Sesi 1 — Pengenalan Dasar Pemrograman'
                            value={session.title}
                            onChange={event =>
                              updateSession(
                                session.id,
                                'title',
                                event.target.value
                              )
                            }
                            error={Boolean(
                              errors[`session-${session.id}-title`]
                            )}
                            helperText={errors[`session-${session.id}-title`]}
                          />

                          <TextField
                            fullWidth
                            required
                            multiline
                            minRows={3}
                            label='Deskripsi / Keterangan Sesi'
                            placeholder='Jelaskan tujuan sesi, gambaran kegiatan, dan hal yang akan dipelajari peserta.'
                            value={session.description}
                            onChange={event =>
                              updateSession(
                                session.id,
                                'description',
                                event.target.value
                              )
                            }
                            error={Boolean(
                              errors[`session-${session.id}-description`]
                            )}
                            helperText={
                              errors[`session-${session.id}-description`] ||
                              'Berikan gambaran singkat tentang keseluruhan sesi.'
                            }
                          />

                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: 'minmax(0, 1fr)',
                                md: 'repeat(2, minmax(0, 1fr))'
                              },
                              gap: 3
                            }}
                          >
                            <AppReactDatepicker
                              selected={session.date}
                              onChange={(date: Date | null) =>
                                updateSession(session.id, 'date', date)
                              }
                              minDate={
                                datePickerMin(form.registrationEnd) ??
                                datePickerMin(trainingStart) ??
                                new Date()
                              }
                              maxDate={datePickerMin(trainingEnd)}
                              dateFormat='dd/MM/yyyy'
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode='select'
                              customInput={
                                <CustomTextField
                                  fullWidth
                                  required
                                  label='Tanggal Sesi'
                                  placeholder='Pilih tanggal sesi'
                                  error={Boolean(
                                    errors[`session-${session.id}-date`]
                                  )}
                                  helperText={
                                    errors[`session-${session.id}-date`]
                                  }
                                />
                              }
                            />

                            <TextField
                              fullWidth
                              required
                              label='Lokasi Sesi'
                              placeholder='Contoh: Laboratorium Komputer'
                              value={session.location}
                              onChange={event =>
                                updateSession(
                                  session.id,
                                  'location',
                                  event.target.value
                                )
                              }
                              error={Boolean(
                                errors[`session-${session.id}-location`]
                              )}
                              helperText={
                                errors[`session-${session.id}-location`]
                              }
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <i
                                      className='tabler-map-pin'
                                      style={{
                                        marginRight: 8,
                                        fontSize: 20
                                      }}
                                    />
                                  )
                                }
                              }}
                            />
                          </Box>
                        </Stack>
                      </Box>

                      <Divider />

                      {/* Materials */}
                      <Box>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          justifyContent='space-between'
                          spacing={2}
                          sx={{ mb: 3 }}
                        >
                          <Box>
                            <Typography
                              variant='subtitle1'
                              fontWeight={700}
                            >
                              Rincian Materi
                            </Typography>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                            >
                              Atur pembagian materi dan jam pelaksanaannya
                              dalam sesi ini.
                            </Typography>
                          </Box>

                          <Button
                            variant='outlined'
                            startIcon={<i className='tabler-plus' />}
                            onClick={() => addMaterial(session.id)}
                          >
                            Tambah Materi
                          </Button>
                        </Stack>

                        {errors[`session-${session.id}-materials`] && (
                          <Alert severity='error' sx={{ mb: 2 }}>
                            {errors[`session-${session.id}-materials`]}
                          </Alert>
                        )}

                        <Stack spacing={3}>
                          {session.materials.map((material, materialIndex) => (
                            <Box
                              key={material.id}
                              sx={{
                                p: { xs: 2, md: 3 },
                                borderRadius: 2,
                                border: theme =>
                                  `1px solid ${theme.palette.divider}`
                              }}
                            >
                              <Stack spacing={3}>
                                <Stack
                                  direction='row'
                                  alignItems='center'
                                  justifyContent='space-between'
                                  spacing={2}
                                >
                                  <Stack
                                    direction='row'
                                    alignItems='center'
                                    spacing={1.5}
                                  >
                                    <Chip
                                      size='small'
                                      label={`Materi ${materialIndex + 1}`}
                                      color='primary'
                                      variant='tonal'
                                    />
                                    <Typography
                                      variant='body2'
                                      color='text.secondary'
                                    >
                                      {formatDuration(
                                        Math.max(
                                          0,
                                          getDurationMinutes(
                                            material.startTime,
                                            material.endTime
                                          )
                                        )
                                      )}
                                    </Typography>
                                  </Stack>

                                  <IconButton
                                    size='small'
                                    color='error'
                                    onClick={() =>
                                      removeMaterial(session.id, material.id)
                                    }
                                    aria-label='Hapus materi'
                                    title='Hapus materi'
                                    disabled={session.materials.length <= 1}
                                  >
                                    <i className='tabler-trash' />
                                  </IconButton>
                                </Stack>

                                <TextField
                                  fullWidth
                                  required
                                  label='Nama / Judul Materi'
                                  placeholder='Contoh: Pengenalan HTML dan struktur dokumen'
                                  value={material.title}
                                  onChange={event =>
                                    updateMaterial(
                                      session.id,
                                      material.id,
                                      'title',
                                      event.target.value
                                    )
                                  }
                                  error={Boolean(
                                    errors[`material-${material.id}-title`]
                                  )}
                                  helperText={
                                    errors[`material-${material.id}-title`]
                                  }
                                />

                                <TextField
                                  fullWidth
                                  multiline
                                  minRows={2}
                                  label='Deskripsi Materi'
                                  placeholder='Jelaskan pokok bahasan atau aktivitas pada materi ini (opsional).'
                                  value={material.description}
                                  onChange={event =>
                                    updateMaterial(
                                      session.id,
                                      material.id,
                                      'description',
                                      event.target.value
                                    )
                                  }
                                />

                                <Box
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                      xs: 'minmax(0, 1fr)',
                                      sm: 'repeat(2, minmax(0, 1fr))'
                                    },
                                    gap: 3
                                  }}
                                >
                                  <TextField
                                    fullWidth
                                    required
                                    type='time'
                                    label='Jam Mulai'
                                    value={material.startTime}
                                    onChange={event =>
                                      updateMaterial(
                                        session.id,
                                        material.id,
                                        'startTime',
                                        event.target.value
                                      )
                                    }
                                    error={Boolean(
                                      errors[`material-${material.id}-time`]
                                    )}
                                    helperText={
                                      errors[`material-${material.id}-time`]
                                    }
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                  />

                                  <TextField
                                    fullWidth
                                    required
                                    type='time'
                                    label='Jam Selesai'
                                    value={material.endTime}
                                    onChange={event =>
                                      updateMaterial(
                                        session.id,
                                        material.id,
                                        'endTime',
                                        event.target.value
                                      )
                                    }
                                    error={Boolean(
                                      errors[`material-${material.id}-time`]
                                    )}
                                    helperText={
                                      errors[`material-${material.id}-time`]
                                    }
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                  />
                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              )
            })}

            {/* Schedule summary */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: theme => `1px solid ${theme.palette.divider}`,
                bgcolor: 'action.hover'
              }}
            >
              <Typography variant='subtitle1' fontWeight={700} sx={{ mb: 2 }}>
                Ringkasan Jadwal
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))'
                  },
                  gap: 3
                }}
              >
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Jumlah Sesi
                  </Typography>
                  <Typography variant='h5' fontWeight={700}>
                    {form.sessions.length}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Total Materi
                  </Typography>
                  <Typography variant='h5' fontWeight={700}>
                    {totalMaterials}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Total Durasi
                  </Typography>
                  <Typography variant='h5' fontWeight={700}>
                    {formatDuration(totalDuration)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Kuota Peserta
                  </Typography>
                  <Typography variant='h5' fontWeight={700}>
                    {form.quota || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={2}
      >
        <Button
          variant='tonal'
          color='secondary'
          onClick={handlePrev}
          startIcon={<i className='tabler-arrow-left' />}
        >
          Sebelumnya
        </Button>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={isSubmitting}
          endIcon={<i className='tabler-arrow-right' />}
        >
          {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default StepScheduleRegistration

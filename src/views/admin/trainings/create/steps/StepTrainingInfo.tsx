'use client'

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'

import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'

import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type InstructorRole = 'head' | 'instructor'

type Instructor = {
  id: number
  name: string
  email: string
  avatar: string
}

type SelectedInstructor = Instructor & {
  role: InstructorRole
}

type Partner = {
  id: number
  name: string
}

type PointItem = {
  id: string
  value: string
}

type TrainingForm = {
  title: string
  slug: string
  category: string
  level: string
  method: string
  shortDescription: string
  competencies: string[]
  tags: string[]
  targetAudience: string
  benefits: PointItem[]
  requirements: PointItem[]
}

type WizardStepProps = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle?: string }[]
  initialData?: Record<string, unknown>
  onDataChange?: (data: Record<string, unknown>) => void
}

const categories = [
  'Teknologi Informasi',
  'Administrasi Pemerintahan',
  'Kewirausahaan',
  'Manajemen',
  'Keuangan',
  'Pengembangan Diri',
  'Pelayanan Publik',
  'Lainnya'
]

const levels = [
  { value: 'beginner', label: 'Pemula' },
  { value: 'intermediate', label: 'Menengah' },
  { value: 'advanced', label: 'Lanjutan' }
]

const methods = [
  { value: 'offline', label: 'Tatap Muka', icon: 'tabler-users' },
  { value: 'online', label: 'Daring', icon: 'tabler-device-laptop' },
  { value: 'hybrid', label: 'Hybrid', icon: 'tabler-devices' }
]

const competencyOptions = [
  'Komunikasi Efektif',
  'Kepemimpinan',
  'Manajemen Waktu',
  'Analisis Data',
  'Microsoft Excel',
  'Pengolahan Data',
  'Pemrograman Web',
  'Pengelolaan Basis Data',
  'Keamanan Informasi',
  'Pelayanan Publik',
  'Administrasi Perkantoran',
  'Penyusunan Laporan',
  'Digital Marketing',
  'Manajemen Keuangan',
  'Pemecahan Masalah'
]

const availableTags = [
  'Pemula',
  'Menengah',
  'Lanjutan',
  'ASN',
  'Digital',
  'Teknologi',
  'Produktivitas',
  'Sertifikasi',
  'Offline',
  'Online',
  'Hybrid',
  'Gratis'
]

const instructors: Instructor[] = [
  {
    id: 1,
    name: 'Andi Pratama',
    email: 'andi.pratama@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@example.com',
    avatar: 'https://i.pravatar.cc/150?img=47'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    avatar: 'https://i.pravatar.cc/150?img=13'
  },
  {
    id: 4,
    name: 'Dewi Anggraini',
    email: 'dewi.anggraini@example.com',
    avatar: 'https://i.pravatar.cc/150?img=44'
  }
]

const partners: Partner[] = [
  { id: 1, name: 'Diskop UKM Kota Banjarbaru' },
  { id: 2, name: 'Pemerintah Kota Banjarbaru' },
  { id: 3, name: 'Dinas Komunikasi dan Informatika' },
  { id: 4, name: 'Badan Pengembangan Sumber Daya Manusia' }
]

const createPoint = (): PointItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  value: ''
})

const initialForm: TrainingForm = {
  title: '',
  slug: '',
  category: '',
  level: '',
  method: '',
  shortDescription: '',
  competencies: [],
  tags: [],
  targetAudience: '',
  benefits: [createPoint()],
  requirements: [createPoint()]
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const parseDate = (value: unknown): Date | null => {
  if (!value) return null

  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? null : date
}

const parsePoints = (value: unknown, prefix: string): PointItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return [{ ...createPoint(), id: `${prefix}-initial` }]
  }

  return value.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `${prefix}-${index}`,
        value: item
      }
    }

    const record = item as Record<string, unknown>

    return {
      id: String(record.id ?? `${prefix}-${index}`),
      value: String(record.value ?? '')
    }
  })
}

const RequiredLabel = ({ children }: { children: ReactNode }) => (
  <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
    {children}
    <Box component='span' sx={{ color: 'error.main', fontWeight: 700 }}>
      *
    </Box>
  </Box>
)

const SectionHeading = ({
                          icon,
                          title,
                          description
                        }: {
  icon: string
  title: string
  description?: string
}) => (
  <Stack direction='row' spacing={2} alignItems='flex-start' sx={{ mb: 4 }}>
    <Box
      sx={{
        width: 42,
        height: 42,
        flexShrink: 0,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        color: 'primary.main'
      }}
    >
      <i className={icon} style={{ fontSize: 23 }} />
    </Box>

    <Box>
      <Typography variant='h6'>{title}</Typography>

      {description && (
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  </Stack>
)

const StepTrainingInfo = ({
                            activeStep,
                            handleNext,
                            handlePrev,
                            steps,
                            initialData,
                            onDataChange
                          }: WizardStepProps) => {
  const [form, setForm] = useState<TrainingForm>(() => ({
    ...initialForm,
    title: String(initialData?.title ?? ''),
    slug: String(initialData?.slug ?? ''),
    category: String(initialData?.category ?? ''),
    level: String(initialData?.level ?? ''),
    method: String(initialData?.method ?? ''),
    shortDescription: String(initialData?.shortDescription ?? ''),
    competencies: Array.isArray(initialData?.competencies)
      ? initialData.competencies.map(String)
      : [],
    tags: Array.isArray(initialData?.tags)
      ? initialData.tags.map(String)
      : [],
    targetAudience: String(initialData?.targetAudience ?? ''),
    benefits: parsePoints(initialData?.benefits, 'benefit'),
    requirements: parsePoints(initialData?.requirements, 'requirement')
  }))

  const [selectedInstructors, setSelectedInstructors] = useState<SelectedInstructor[]>(() => {
    if (!Array.isArray(initialData?.instructors)) return []

    return initialData.instructors.flatMap(item => {
      const record = item as Record<string, unknown>
      const instructor = instructors.find(option => option.id === Number(record.id))

      if (!instructor) return []

      return [{
        ...instructor,
        role: record.role === 'head' ? 'head' as const : 'instructor' as const
      }]
    })
  })

  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(() => {
    const partnerId = Number(initialData?.partnerId)

    return partners.find(partner => partner.id === partnerId) ?? null
  })

  const [startDate, setStartDate] = useState<Date | null>(() =>
    parseDate(initialData?.startDate)
  )

  const [endDate, setEndDate] = useState<Date | null>(() =>
    parseDate(initialData?.endDate)
  )

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialData?.slug)
  )

  const [submitted, setSubmitted] = useState(false)

  const updateField = <K extends keyof TrainingForm>(
    field: K,
    value: TrainingForm[K]
  ) => {
    setForm(previous => ({
      ...previous,
      [field]: value
    }))
  }

  const handleTitleChange = (value: string) => {
    setForm(previous => ({
      ...previous,
      title: value,
      slug: slugManuallyEdited ? previous.slug : slugify(value)
    }))
  }

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    updateField('slug', slugify(value))
  }

  const handleInstructorSelection = (_: unknown, values: Instructor[]) => {
    setSelectedInstructors(previous => {
      const previousHead = previous.find(item => item.role === 'head')

      const next: SelectedInstructor[] = values.map(instructor => {
        const existing = previous.find(item => item.id === instructor.id)

        return {
          ...instructor,
          role: existing?.role ?? 'instructor'
        }
      })

      if (previousHead && next.some(item => item.id === previousHead.id)) {
        return next.map(item => ({
          ...item,
          role: item.id === previousHead.id ? 'head' : 'instructor'
        }))
      }

      if (next.length > 0 && !next.some(item => item.role === 'head')) {
        next[0].role = 'head'
      }

      return next
    })
  }

  const handleInstructorRoleChange = (
    id: number,
    event: SelectChangeEvent<InstructorRole>
  ) => {
    const role = event.target.value as InstructorRole

    setSelectedInstructors(previous =>
      previous.map(item => ({
        ...item,
        role:
          role === 'head'
            ? item.id === id
              ? 'head'
              : 'instructor'
            : item.id === id
              ? 'instructor'
              : item.role
      }))
    )
  }

  const updatePoint = (
    field: 'benefits' | 'requirements',
    id: string,
    value: string
  ) => {
    setForm(previous => ({
      ...previous,
      [field]: previous[field].map(item =>
        item.id === id ? { ...item, value } : item
      )
    }))
  }

  const addPoint = (field: 'benefits' | 'requirements') => {
    setForm(previous => ({
      ...previous,
      [field]: [...previous[field], createPoint()]
    }))
  }

  const removePoint = (field: 'benefits' | 'requirements', id: string) => {
    setForm(previous => {
      const remaining = previous[field].filter(item => item.id !== id)

      return {
        ...previous,
        [field]: remaining.length > 0 ? remaining : [createPoint()]
      }
    })
  }

  const errors = {
    title: !form.title.trim(),
    slug: !form.slug.trim(),
    category: !form.category,
    level: !form.level,
    method: !form.method,
    shortDescription: !form.shortDescription.trim(),
    competencies: form.competencies.length === 0,
    targetAudience: !form.targetAudience.trim(),
    instructors: selectedInstructors.length === 0,
    headInstructor: selectedInstructors.filter(item => item.role === 'head').length !== 1,
    startDate: !startDate,
    endDate: !endDate,
    dateOrder: Boolean(startDate && endDate && endDate < startDate),
    benefits: form.benefits.every(item => !item.value.trim()),
    requirements: form.requirements.every(item => !item.value.trim())
  }

  const hasErrors = Object.values(errors).some(Boolean)

  /*
   * Sinkronisasi data ke parent setiap kali form berubah.
   * Data ini akan tersedia di wizardData.trainingInfo pada StepReview.
   */
  useEffect(() => {
    const payload: Record<string, unknown> = {
      ...form,
      benefits: form.benefits.map(item => item.value.trim()).filter(Boolean),
      requirements: form.requirements.map(item => item.value.trim()).filter(Boolean),
      startDate: startDate?.toISOString() ?? '',
      endDate: endDate?.toISOString() ?? '',
      instructors: selectedInstructors.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        avatar: item.avatar,
        role: item.role
      })),
      partnerId: selectedPartner?.id ?? null,
      partnerName: selectedPartner?.name ?? ''
    }

    onDataChange?.(payload)
  }, [
    form,
    selectedInstructors,
    selectedPartner,
    startDate,
    endDate,
    onDataChange
  ])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    if (hasErrors) return

    const payload: Record<string, unknown> = {
      ...form,
      benefits: form.benefits.map(item => item.value.trim()).filter(Boolean),
      requirements: form.requirements.map(item => item.value.trim()).filter(Boolean),
      startDate: startDate?.toISOString() ?? '',
      endDate: endDate?.toISOString() ?? '',
      instructors: selectedInstructors.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        avatar: item.avatar,
        role: item.role
      })),
      partnerId: selectedPartner?.id ?? null,
      partnerName: selectedPartner?.name ?? ''
    }

    onDataChange?.(payload)
    handleNext()
  }

  return (
    <Box component='form' onSubmit={handleSubmit} noValidate>
      <Stack spacing={6}>
        {submitted && hasErrors && (
          <Alert severity='error' icon={<i className='tabler-alert-circle' />}>
            Periksa kembali kolom wajib dan pastikan tanggal selesai tidak lebih awal dari tanggal mulai.
          </Alert>
        )}

        {/* Informasi dasar */}
        <Box>
          <SectionHeading
            icon='tabler-file-description'
            title='Informasi Dasar'
            description='Tentukan identitas dan gambaran umum program pelatihan.'
          />

          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                required
                label={<RequiredLabel>Nama Pelatihan</RequiredLabel>}
                placeholder='Contoh: Pelatihan Digitalisasi Administrasi'
                value={form.title}
                onChange={event => handleTitleChange(event.target.value)}
                error={submitted && errors.title}
                helperText={
                  submitted && errors.title
                    ? 'Nama pelatihan wajib diisi.'
                    : 'Gunakan nama yang jelas dan mudah dipahami peserta.'
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                required
                label={<RequiredLabel>Slug URL</RequiredLabel>}
                placeholder='pelatihan-digitalisasi-administrasi'
                value={form.slug}
                onChange={event => handleSlugChange(event.target.value)}
                error={submitted && errors.slug}
                helperText={
                  submitted && errors.slug
                    ? 'Slug wajib diisi.'
                    : 'Terisi otomatis dari nama pelatihan dan tetap dapat diedit.'
                }
                InputProps={{
                  startAdornment: (
                    <Typography
                      variant='body2'
                      color='text.disabled'
                      sx={{ mr: 1, whiteSpace: 'nowrap' }}
                    >
                      /training/
                    </Typography>
                  )
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                fullWidth
                required
                label={<RequiredLabel>Kategori Pelatihan</RequiredLabel>}
                value={form.category}
                onChange={event => updateField('category', event.target.value)}
                error={submitted && errors.category}
                helperText={submitted && errors.category ? 'Pilih kategori pelatihan.' : ''}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                fullWidth
                required
                label={<RequiredLabel>Tingkat Pelatihan</RequiredLabel>}
                value={form.level}
                onChange={event => updateField('level', event.target.value)}
                error={submitted && errors.level}
                helperText={submitted && errors.level ? 'Pilih tingkat pelatihan.' : ''}
              >
                {levels.map(level => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                fullWidth
                required
                label={<RequiredLabel>Metode Pelatihan</RequiredLabel>}
                value={form.method}
                onChange={event => updateField('method', event.target.value)}
                error={submitted && errors.method}
                helperText={submitted && errors.method ? 'Pilih metode pelatihan.' : ''}
              >
                {methods.map(method => (
                  <MenuItem key={method.value} value={method.value}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <i className={method.icon} style={{ fontSize: 20 }} />
                      <Typography>{method.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                multiline
                minRows={3}
                required
                label={<RequiredLabel>Deskripsi Singkat</RequiredLabel>}
                placeholder='Jelaskan secara singkat tujuan, materi utama, dan gambaran pelatihan ini...'
                value={form.shortDescription}
                onChange={event => updateField('shortDescription', event.target.value)}
                error={submitted && errors.shortDescription}
                helperText={
                  submitted && errors.shortDescription
                    ? 'Deskripsi singkat wajib diisi.'
                    : `${form.shortDescription.length} karakter`
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Kompetensi */}
        <Box>
          <SectionHeading
            icon='tabler-target-arrow'
            title='Kompetensi yang Dipelajari'
            description='Pilih kemampuan yang diharapkan dikuasai peserta setelah menyelesaikan pelatihan.'
          />

          <Autocomplete
            multiple
            freeSolo
            options={competencyOptions}
            value={form.competencies}
            onChange={(_, values) =>
              updateField(
                'competencies',
                values.map(value => value.trim()).filter(Boolean)
              )
            }
            renderInput={params => (
              <CustomTextField
                {...params}
                fullWidth
                required
                label={<RequiredLabel>Kompetensi</RequiredLabel>}
                placeholder={form.competencies.length ? '' : 'Pilih atau ketik kompetensi...'}
                error={submitted && errors.competencies}
                helperText={
                  submitted && errors.competencies
                    ? 'Tambahkan minimal satu kompetensi.'
                    : 'Bisa memilih beberapa kompetensi atau mengetik kompetensi baru.'
                }
              />
            )}
            renderTags={(values, getTagProps) =>
              values.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={`${option}-${index}`}
                  label={option}
                  color='primary'
                  variant='tonal'
                  size='small'
                />
              ))
            }
          />
        </Box>

        <Divider />

        {/* Periode pelatihan */}
        <Box>
          <SectionHeading
            icon='tabler-calendar-event'
            title='Periode Pelatihan'
            description='Tanggal pelaksanaan keseluruhan pelatihan, bukan periode pendaftaran.'
          />

          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <AppReactDatepicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText='Pilih tanggal mulai'
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                customInput={
                  <CustomTextField
                    fullWidth
                    required
                    label={<RequiredLabel>Tanggal Mulai Pelatihan</RequiredLabel>}
                    error={submitted && errors.startDate}
                    helperText={submitted && errors.startDate ? 'Tanggal mulai wajib diisi.' : ''}
                    InputProps={{
                      endAdornment: <i className='tabler-calendar-event' style={{ fontSize: 20 }} />
                    }}
                  />
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <AppReactDatepicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                minDate={startDate ?? undefined}
                placeholderText='Pilih tanggal selesai'
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                customInput={
                  <CustomTextField
                    fullWidth
                    required
                    label={<RequiredLabel>Tanggal Selesai Pelatihan</RequiredLabel>}
                    error={submitted && (errors.endDate || errors.dateOrder)}
                    helperText={
                      submitted && errors.endDate
                        ? 'Tanggal selesai wajib diisi.'
                        : submitted && errors.dateOrder
                          ? 'Tanggal selesai tidak boleh sebelum tanggal mulai.'
                          : ''
                    }
                    InputProps={{
                      endAdornment: <i className='tabler-calendar-check' style={{ fontSize: 20 }} />
                    }}
                  />
                }
              />
            </Grid>

            {startDate && endDate && endDate >= startDate && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='info' icon={<i className='tabler-calendar-stats' />}>
                  <Typography variant='body2'>
                    Rentang pelatihan:{' '}
                    <strong>
                      {Math.floor(
                        (
                          new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() -
                          new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()
                        ) / 86400000
                      ) + 1}{' '}
                      hari kalender
                    </strong>
                    . Total jam pembelajaran akan dihitung dari jadwal sesi pada langkah berikutnya.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider />

        {/* Target peserta */}
        <Box>
          <SectionHeading
            icon='tabler-users'
            title='Target dan Persyaratan Peserta'
            description='Tentukan sasaran peserta dan persyaratan untuk mengikuti pelatihan.'
          />

          <Stack spacing={4}>
            <CustomTextField
              fullWidth
              required
              multiline
              minRows={2}
              label={<RequiredLabel>Target Peserta</RequiredLabel>}
              placeholder='Contoh: ASN di lingkungan Pemerintah Kota Banjarbaru...'
              value={form.targetAudience}
              onChange={event => updateField('targetAudience', event.target.value)}
              error={submitted && errors.targetAudience}
              helperText={submitted && errors.targetAudience ? 'Target peserta wajib diisi.' : ''}
            />

            <Box>
              <Typography variant='subtitle1' sx={{ mb: 1 }}>
                <RequiredLabel>Persyaratan Peserta</RequiredLabel>
              </Typography>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Tambahkan persyaratan satu per satu agar mudah dibaca calon peserta.
              </Typography>

              <Stack spacing={2}>
                {form.requirements.map((item, index) => (
                  <Stack key={item.id} direction='row' spacing={2} alignItems='flex-start'>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.5,
                        bgcolor: 'action.hover',
                        mt: 1
                      }}
                    >
                      <Typography variant='body2' fontWeight={600}>
                        {index + 1}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <CustomTextField
                        fullWidth
                        placeholder='Contoh: Terdaftar sebagai ASN aktif...'
                        value={item.value}
                        onChange={event => updatePoint('requirements', item.id, event.target.value)}
                        error={submitted && errors.requirements && !item.value.trim()}
                      />
                    </Box>

                    <IconButton
                      aria-label='Hapus persyaratan'
                      color='error'
                      onClick={() => removePoint('requirements', item.id)}
                      disabled={form.requirements.length === 1}
                      sx={{ mt: 0.5 }}
                    >
                      <i className='tabler-trash' />
                    </IconButton>
                  </Stack>
                ))}

                <Box>
                  <Button
                    variant='tonal'
                    color='primary'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => addPoint('requirements')}
                  >
                    Tambah Persyaratan
                  </Button>
                </Box>

                {submitted && errors.requirements && (
                  <Typography variant='caption' color='error'>
                    Isi minimal satu persyaratan peserta.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Manfaat */}
        <Box>
          <SectionHeading
            icon='tabler-rosette'
            title='Manfaat Pelatihan'
            description='Tuliskan manfaat atau hasil yang diperoleh peserta setelah mengikuti program.'
          />

          <Stack spacing={2}>
            {form.benefits.map((item, index) => (
              <Stack key={item.id} direction='row' spacing={2} alignItems='flex-start'>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    mt: 1
                  }}
                >
                  <i className='tabler-check' style={{ fontSize: 20 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <CustomTextField
                    fullWidth
                    placeholder={`Contoh manfaat ${index + 1}: Meningkatkan kemampuan kerja...`}
                    value={item.value}
                    onChange={event => updatePoint('benefits', item.id, event.target.value)}
                    error={submitted && errors.benefits && !item.value.trim()}
                  />
                </Box>

                <IconButton
                  aria-label='Hapus manfaat'
                  color='error'
                  onClick={() => removePoint('benefits', item.id)}
                  disabled={form.benefits.length === 1}
                  sx={{ mt: 0.5 }}
                >
                  <i className='tabler-trash' />
                </IconButton>
              </Stack>
            ))}

            <Box>
              <Button
                variant='tonal'
                color='primary'
                startIcon={<i className='tabler-plus' />}
                onClick={() => addPoint('benefits')}
              >
                Tambah Manfaat
              </Button>
            </Box>

            {submitted && errors.benefits && (
              <Typography variant='caption' color='error'>
                Isi minimal satu manfaat pelatihan.
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Instruktur */}
        <Box>
          <SectionHeading
            icon='tabler-user-star'
            title='Instruktur Pelatihan'
            description='Pilih satu atau beberapa instruktur dan tetapkan tepat satu Head Instructor.'
          />

          <Stack spacing={3}>
            <Autocomplete
              multiple
              options={instructors}
              value={selectedInstructors}
              onChange={handleInstructorSelection}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={option.id}>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Avatar src={option.avatar} alt={option.name} />

                    <Box>
                      <Typography variant='body2' fontWeight={600}>
                        {option.name}
                      </Typography>

                      <Typography variant='caption' color='text.secondary'>
                        {option.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  fullWidth
                  label={<RequiredLabel>Pilih Instruktur</RequiredLabel>}
                  placeholder={selectedInstructors.length ? '' : 'Cari nama instruktur...'}
                  error={submitted && errors.instructors}
                  helperText={
                    submitted && errors.instructors
                      ? 'Pilih minimal satu instruktur.'
                      : 'Cari instruktur berdasarkan nama.'
                  }
                />
              )}
              renderTags={() => null}
            />

            {selectedInstructors.length > 0 && (
              <Stack spacing={2}>
                {selectedInstructors.map(instructor => (
                  <Box
                    key={instructor.id}
                    sx={{
                      p: 3,
                      border: theme => `1px solid ${theme.palette.divider}`,
                      borderRadius: 2
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={3}
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                      <Stack direction='row' spacing={2} alignItems='center' sx={{ flex: 1 }}>
                        <Avatar
                          src={instructor.avatar}
                          alt={instructor.name}
                          sx={{ width: 48, height: 48 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant='subtitle2'>
                            {instructor.name}
                          </Typography>

                          <Typography variant='body2' color='text.secondary'>
                            {instructor.email}
                          </Typography>

                          {instructor.role === 'head' && (
                            <Chip
                              size='small'
                              color='primary'
                              variant='tonal'
                              label='Head Instructor'
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Box>
                      </Stack>

                      <FormControl size='small' sx={{ minWidth: { xs: '100%', sm: 190 } }}>
                        <InputLabel id={`instructor-role-${instructor.id}`}>
                          Peran Instruktur
                        </InputLabel>

                        <Select
                          labelId={`instructor-role-${instructor.id}`}
                          label='Peran Instruktur'
                          value={instructor.role}
                          onChange={event => handleInstructorRoleChange(instructor.id, event)}
                        >
                          <MenuItem value='head'>Head Instructor</MenuItem>
                          <MenuItem value='instructor'>Instruktur</MenuItem>
                        </Select>
                      </FormControl>

                      <IconButton
                        aria-label='Hapus instruktur'
                        color='error'
                        onClick={() => {
                          setSelectedInstructors(previous => {
                            const remaining = previous.filter(
                              item => item.id !== instructor.id
                            )

                            if (
                              remaining.length > 0 &&
                              !remaining.some(item => item.role === 'head')
                            ) {
                              remaining[0].role = 'head'
                            }

                            return [...remaining]
                          })
                        }}
                      >
                        <i className='tabler-x' />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}

            {submitted && errors.headInstructor && (
              <Alert severity='warning'>
                Harus ada tepat satu Head Instructor. Jika perannya diubah, Head Instructor sebelumnya otomatis menjadi instruktur biasa.
              </Alert>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Mitra */}
        <Box>
          <SectionHeading
            icon='tabler-building-community'
            title='Mitra Kerja Sama'
            description='Pilih instansi atau mitra yang bekerja sama dalam pelaksanaan pelatihan.'
          />

          <Autocomplete
            options={partners}
            value={selectedPartner}
            onChange={(_, value) => setSelectedPartner(value)}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <CustomTextField
                {...params}
                fullWidth
                label='Mitra Kerja Sama'
                placeholder='Pilih mitra (opsional)'
                helperText='Daftar ini masih menggunakan data contoh dan nantinya diambil dari database.'
              />
            )}
          />
        </Box>

        <Divider />

        {/* Tag */}
        <Box>
          <SectionHeading
            icon='tabler-tags'
            title='Tag Pelatihan'
            description='Tambahkan kata kunci untuk membantu peserta menemukan pelatihan ini.'
          />

          <Autocomplete
            multiple
            freeSolo
            options={availableTags}
            value={form.tags}
            onChange={(_, values) =>
              updateField(
                'tags',
                [...new Set(values.map(value => value.trim()).filter(Boolean))]
              )
            }
            renderInput={params => (
              <CustomTextField
                {...params}
                fullWidth
                label='Tag'
                placeholder={form.tags.length ? '' : 'Pilih atau ketik tag...'}
                helperText='Contoh: ASN, Pemula, Digital. Tekan Enter untuk menambahkan tag baru.'
              />
            )}
            renderTags={(values, getTagProps) =>
              values.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={`${option}-${index}`}
                  label={option}
                  size='small'
                  variant='tonal'
                />
              ))
            }
          />
        </Box>

        <Divider />

        {/* Navigasi */}
        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          justifyContent='space-between'
          spacing={3}
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={handlePrev}
            disabled={activeStep === 0}
            startIcon={
              <DirectionalIcon
                ltrIconClass='tabler-arrow-left'
                rtlIconClass='tabler-arrow-right'
              />
            }
          >
            Sebelumnya
          </Button>

          <Button
            type='submit'
            variant='contained'
            endIcon={
              <DirectionalIcon
                ltrIconClass='tabler-arrow-right'
                rtlIconClass='tabler-arrow-left'
              />
            }
          >
            Simpan & Lanjutkan
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default StepTrainingInfo

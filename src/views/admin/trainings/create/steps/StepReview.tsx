
'use client'

import { useState, type ReactNode } from 'react'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid2'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material/styles'

import DirectionalIcon from '@components/DirectionalIcon'

type StepData = Record<string, unknown>

type TrainingData = {
  trainingInfo: StepData
  media: StepData
  scheduleRegistration: StepData
  assessment: StepData
}

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  handleGoToStep?: (step: number) => void
  steps: { title: string; subtitle: string }[]
  data?: TrainingData
}

const labels: Record<string, string> = {
  title: 'Nama pelatihan',
  name: 'Nama pelatihan',
  slug: 'Slug URL',
  category: 'Kategori',
  level: 'Tingkat pelatihan',
  method: 'Metode pelaksanaan',
  shortDescription: 'Deskripsi singkat',
  description: 'Deskripsi',
  competencies: 'Kompetensi yang dipelajari',
  tags: 'Tag pelatihan',
  targetAudience: 'Target peserta',
  benefits: 'Manfaat pelatihan',
  requirements: 'Persyaratan peserta',
  instructors: 'Instruktur',
  partnerName: 'Mitra kerja sama',
  partnerId: 'ID mitra',
  startDate: 'Tanggal mulai',
  endDate: 'Tanggal selesai',
  cover: 'Cover pelatihan',
  banner: 'Banner promosi',
  bannerShortDescription: 'Deskripsi singkat banner',
  promotionDescription: 'Deskripsi promosi',
  isPublished: 'Status publikasi',
  isFeatured: 'Pelatihan unggulan',
  published: 'Status publikasi',
  featured: 'Pelatihan unggulan',
  registrationStart: 'Mulai pendaftaran',
  registrationEnd: 'Akhir pendaftaran',
  registrationStartDate: 'Mulai pendaftaran',
  registrationEndDate: 'Akhir pendaftaran',
  quota: 'Kuota peserta',
  capacity: 'Kuota peserta',
  minParticipants: 'Minimal peserta',
  waitingListEnabled: 'Daftar tunggu',
  sessions: 'Sesi pelatihan',
  trainingSessions: 'Sesi pelatihan',
  schedules: 'Jadwal pelatihan',
  date: 'Tanggal',
  location: 'Lokasi',
  materials: 'Materi pelatihan',
  materialTitle: 'Judul materi',
  startTime: 'Waktu mulai',
  endTime: 'Waktu selesai',
  durationMinutes: 'Durasi',
  enabled: 'Penilaian aktif',
  passingScore: 'Nilai kelulusan',
  gradeRanges: 'Rentang nilai',
  certificateEnabled: 'Sertifikat aktif',
  certificateNote: 'Catatan sertifikat',
  min: 'Nilai minimum',
  max: 'Nilai maksimum',
  label: 'Predikat',
  note: 'Catatan'
}

const hiddenKeys = new Set([
  'id',
  'file',
  'fileObject',
  'rawFile',
  'objectUrl',
  'temporaryUrl',
  'preview',
  'url',
  'order',
  'avatar'
])

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0

  return false
}

const labelOf = (key: string) =>
  labels[key] ??
  key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase())

const valueOf = (value: unknown): string => {
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak'
  if (typeof value === 'string' || typeof value === 'number') return String(value)

  return ''
}

const getImageUrl = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return /^(https?:\/\/|\/|blob:|data:image\/)/i.test(value) ? value : null
  }

  if (!isObject(value)) return null

  for (const key of [
    'preview',
    'url',
    'src',
    'imageUrl',
    'bannerUrl',
    'coverUrl'
  ]) {
    const candidate = value[key]

    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate
    }
  }

  return null
}

const getFileName = (value: unknown): string => {
  if (typeof value === 'string') return ''

  if (isObject(value)) {
    if (typeof value.name === 'string') return value.name
    if (typeof value.fileName === 'string') return value.fileName
    if (typeof value.filename === 'string') return value.filename
  }

  return ''
}

const formatDate = (value: unknown): string => {
  if (typeof value !== 'string' || !value) return '-'

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatDuration = (value: unknown): string => {
  const minutes = Number(value)

  if (!Number.isFinite(minutes) || minutes <= 0) return '-'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours && remainingMinutes) {
    return `${hours} jam ${remainingMinutes} menit`
  }

  if (hours) return `${hours} jam`

  return `${remainingMinutes} menit`
}

const getSessions = (data: StepData) => {
  const candidates = [data.sessions, data.trainingSessions, data.schedules]

  return candidates.find(Array.isArray) as unknown[] | undefined
}

const getMaterials = (session: Record<string, unknown>) => {
  const candidates = [
    session.materials,
    session.topics,
    session.learningMaterials
  ]

  return (candidates.find(Array.isArray) as unknown[] | undefined) ?? []
}

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
                         title,
                         subtitle,
                         icon,
                         onEdit
                       }: {
  title: string
  subtitle: string
  icon: string
  onEdit?: () => void
}) => (
  <Stack
    direction="row"
    alignItems="flex-start"
    justifyContent="space-between"
    spacing={2}
    sx={{ mb: 3 }}
  >
    <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 2,
          bgcolor: 'action.hover',
          color: 'primary.main'
        }}
      >
        <i className={icon} style={{ fontSize: 21 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Stack>

    {onEdit && (
      <Button
        size="small"
        variant="tonal"
        startIcon={<i className="tabler-edit" />}
        onClick={onEdit}
        sx={{ flexShrink: 0 }}
      >
        Ubah
      </Button>
    )}
  </Stack>
)

/* =========================================================
   GENERIC FIELD
========================================================= */

const InfoField = ({
                     label,
                     value
                   }: {
  label: string
  value: unknown
}) => {
  if (isEmpty(value)) return null

  if (typeof value === 'boolean') {
    return (
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>

        <Box>
          <Chip
            size="small"
            variant="tonal"
            color={value ? 'success' : 'default'}
            label={value ? 'Ya' : 'Tidak'}
          />
        </Box>
      </Stack>
    )
  }

  if (Array.isArray(value)) {
    const primitiveItems = value.every(
      item =>
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean'
    )

    return (
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>

        {primitiveItems ? (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {value.map((item, index) => (
              <Chip
                key={`${String(item)}-${index}`}
                size="small"
                variant="outlined"
                label={valueOf(item)}
              />
            ))}
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {value.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2 }}
              >
                {isObject(item) ? (
                  <Stack spacing={1.5}>
                    {Object.entries(item)
                      .filter(
                        ([key, nested]) =>
                          !hiddenKeys.has(key) && !isEmpty(nested)
                      )
                      .map(([key, nested]) => (
                        <InfoField
                          key={key}
                          label={labelOf(key)}
                          value={nested}
                        />
                      ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">{valueOf(item)}</Typography>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    )
  }

  if (isObject(value)) {
    const imageUrl = getImageUrl(value)

    if (imageUrl) {
      return (
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>

          <Box
            component="img"
            src={imageUrl}
            alt={label}
            sx={{
              width: '100%',
              maxWidth: 420,
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              borderRadius: 2,
              border: theme => `1px solid ${theme.palette.divider}`
            }}
          />

          {getFileName(value) && (
            <Typography variant="caption" color="text.secondary">
              {getFileName(value)}
            </Typography>
          )}
        </Stack>
      )
    }

    const entries = Object.entries(value).filter(
      ([key, nested]) => !hiddenKeys.has(key) && !isEmpty(nested)
    )

    if (!entries.length) {
      const fileName = getFileName(value)

      return fileName ? (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2">{fileName}</Typography>
        </Stack>
      ) : null
    }

    return (
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {entries.map(([key, nested]) => (
          <InfoField key={key} label={labelOf(key)} value={nested} />
        ))}
      </Stack>
    )
  }

  return (
    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={500}
        sx={{
          overflowWrap: 'anywhere',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7
        }}
      >
        {valueOf(value)}
      </Typography>
    </Stack>
  )
}

const GenericInfoGrid = ({ data }: { data: StepData }) => {
  const entries = Object.entries(data).filter(
    ([key, value]) => !hiddenKeys.has(key) && !isEmpty(value)
  )

  if (!entries.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        Belum ada data pada bagian ini.
      </Typography>
    )
  }

  return (
    <Grid container spacing={3}>
      {entries.map(([key, value]) => {
        const wide = [
          'description',
          'promotionDescription',
          'requirements',
          'competencies',
          'sessions',
          'gradeRanges'
        ].includes(key)

        return (
          <Grid key={key} size={{ xs: 12, md: wide ? 12 : 6 }}>
            <InfoField label={labelOf(key)} value={value} />
          </Grid>
        )
      })}
    </Grid>
  )
}

/* =========================================================
   TRAINING IDENTITY SUMMARY
========================================================= */

const TrainingInfoSummary = ({ data }: { data: StepData }) => {
  const competencies = Array.isArray(data.competencies)
    ? data.competencies
    : []

  const tags = Array.isArray(data.tags) ? data.tags : []
  const benefits = Array.isArray(data.benefits) ? data.benefits : []
  const requirements = Array.isArray(data.requirements)
    ? data.requirements
    : []

  const instructors = Array.isArray(data.instructors)
    ? data.instructors.filter(isObject)
    : []

  const levelLabels: Record<string, string> = {
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Lanjutan'
  }

  const methodLabels: Record<string, string> = {
    offline: 'Tatap Muka',
    online: 'Daring',
    hybrid: 'Hybrid'
  }

  const FieldBlock = ({
                        label,
                        children
                      }: {
    label: string
    children: ReactNode
  }) => (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )

  const DateCard = ({
                      label,
                      value,
                      icon
                    }: {
    label: string
    value: unknown
    icon: string
  }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        height: '100%',
        minWidth: 0
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          bgcolor: 'action.hover',
          color: 'primary.main'
        }}
      >
        <i className={icon} style={{ fontSize: 21 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>

        <Typography variant="body2" fontWeight={600}>
          {formatDate(value)}
        </Typography>
      </Box>
    </Paper>
  )

  const hasIdentity =
    Object.entries(data).some(
      ([key, value]) =>
        ![
          'benefits',
          'requirements',
          'competencies',
          'tags',
          'instructors',
          'startDate',
          'endDate',
          'partnerId',
          'partnerName'
        ].includes(key) &&
        !hiddenKeys.has(key) &&
        !isEmpty(value)
    ) ||
    competencies.length > 0 ||
    tags.length > 0 ||
    benefits.length > 0 ||
    requirements.length > 0 ||
    instructors.length > 0

  if (!hasIdentity) {
    return (
      <Alert severity="info">
        Belum ada identitas pelatihan. Silakan lengkapi langkah Informasi Program.
      </Alert>
    )
  }

  return (
    <Stack spacing={3}>
      {/* Judul program */}
      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ overflowWrap: 'anywhere', lineHeight: 1.4, mb: 2 }}
        >
          {valueOf(data.title ?? data.name) || 'Nama pelatihan belum diisi'}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          {!isEmpty(data.category) && (
            <Chip
              icon={<i className="tabler-category" />}
              label={valueOf(data.category)}
              color="primary"
              variant="tonal"
              size="small"
            />
          )}

          {!isEmpty(data.level) && (
            <Chip
              icon={<i className="tabler-signal" />}
              label={levelLabels[valueOf(data.level)] ?? valueOf(data.level)}
              variant="outlined"
              size="small"
            />
          )}

          {!isEmpty(data.method) && (
            <Chip
              icon={<i className="tabler-devices" />}
              label={methodLabels[valueOf(data.method)] ?? valueOf(data.method)}
              variant="outlined"
              size="small"
            />
          )}
        </Stack>

        {!isEmpty(data.slug) && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1.5, overflowWrap: 'anywhere' }}
          >
            URL: /training/{valueOf(data.slug)}
          </Typography>
        )}
      </Box>

      {/* Deskripsi */}
      {!isEmpty(data.shortDescription ?? data.description) && (
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
            borderLeft: theme => `3px solid ${theme.palette.primary.main}`
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Deskripsi Pelatihan
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
          >
            {valueOf(data.shortDescription ?? data.description)}
          </Typography>
        </Box>
      )}

      {/* Kompetensi */}
      {competencies.length > 0 && (
        <FieldBlock label="Kompetensi yang Dipelajari">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {competencies.map((item, index) => (
              <Chip
                key={`${String(item)}-${index}`}
                label={valueOf(item)}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </FieldBlock>
      )}

      {/* Tag */}
      {tags.length > 0 && (
        <FieldBlock label="Tag Pelatihan">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tags.map((item, index) => (
              <Chip
                key={`${String(item)}-${index}`}
                label={valueOf(item)}
                size="small"
                color="primary"
                variant="tonal"
              />
            ))}
          </Stack>
        </FieldBlock>
      )}

      {/* Target peserta */}
      {!isEmpty(data.targetAudience) && (
        <FieldBlock label="Target Peserta">
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            {valueOf(data.targetAudience)}
          </Typography>
        </FieldBlock>
      )}

      {/* Manfaat */}
      {benefits.length > 0 && (
        <FieldBlock label="Manfaat Pelatihan">
          <Stack spacing={1.5}>
            {benefits.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
              >
                <Box sx={{ color: 'success.main', mt: 0.25 }}>
                  <i className="tabler-circle-check" />
                </Box>

                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                  {valueOf(item)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </FieldBlock>
      )}

      {/* Persyaratan */}
      {requirements.length > 0 && (
        <FieldBlock label="Persyaratan Peserta">
          <Stack spacing={1.5}>
            {requirements.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 22 }}
                >
                  {index + 1}.
                </Typography>

                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                  {valueOf(item)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </FieldBlock>
      )}

      {/* Periode */}
      {(!isEmpty(data.startDate) || !isEmpty(data.endDate)) && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Periode Pelatihan
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateCard
                label="Tanggal Mulai"
                value={data.startDate}
                icon="tabler-calendar-event"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DateCard
                label="Tanggal Selesai"
                value={data.endDate}
                icon="tabler-calendar-check"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Instruktur */}
      {instructors.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Tim Instruktur
          </Typography>

          <Stack spacing={1.5}>
            {instructors.map((instructor, index) => {
              const isHead = instructor.role === 'head'

              return (
                <Paper
                  key={String(instructor.id ?? index)}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    minWidth: 0
                  }}
                >
                  <Avatar
                    src={valueOf(instructor.avatar) || undefined}
                    alt={valueOf(instructor.name) || 'Instruktur'}
                    sx={{ width: 48, height: 48, flexShrink: 0 }}
                  >
                    <i className="tabler-user" />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {valueOf(instructor.name) || 'Instruktur'}
                    </Typography>

                    {!isEmpty(instructor.email) && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: 'anywhere', mt: 0.25 }}
                      >
                        {valueOf(instructor.email)}
                      </Typography>
                    )}
                  </Box>

                  <Chip
                    size="small"
                    variant="tonal"
                    color={isHead ? 'primary' : 'default'}
                    label={isHead ? 'Head Instructor' : 'Instruktur'}
                    sx={{ flexShrink: 0 }}
                  />
                </Paper>
              )
            })}
          </Stack>
        </Box>
      )}

      {/* Mitra */}
      {!isEmpty(data.partnerName) && (
        <FieldBlock label="Mitra Kerja Sama">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'action.hover',
                borderRadius: 1.5
              }}
            >
              <i className="tabler-building-community" />
            </Box>

            <Typography variant="body2" fontWeight={500}>
              {valueOf(data.partnerName)}
            </Typography>
          </Stack>
        </FieldBlock>
      )}
    </Stack>
  )
}

/* =========================================================
   MEDIA SUMMARY
========================================================= */

const MediaSummary = ({ data }: { data: StepData }) => {
  const cover = data.cover ?? data.coverImage
  const banner = data.banner ?? data.bannerImage

  const promotion = isObject(data.promotion) ? data.promotion : data

  const coverUrl = getImageUrl(cover)
  const bannerUrl = getImageUrl(banner)

  const coverName = getFileName(cover)
  const bannerName = getFileName(banner)

  const description =
    promotion.bannerShortDescription ??
    promotion.shortDescription ??
    promotion.bannerDescription

  const promotionDescription =
    promotion.promotionDescription ?? promotion.description

  const published = promotion.isPublished ?? promotion.published
  const featured = promotion.isFeatured ?? promotion.featured

  const hasData =
    !isEmpty(cover) ||
    !isEmpty(banner) ||
    !isEmpty(description) ||
    !isEmpty(promotionDescription) ||
    typeof published === 'boolean' ||
    typeof featured === 'boolean'

  if (!hasData) {
    return <GenericInfoGrid data={data} />
  }

  const ImagePanel = ({
                        title,
                        url,
                        name
                      }: {
    title: string
    url: string | null
    name: string
  }) => (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>

      {url ? (
        <Box
          component="img"
          src={url}
          alt={title}
          sx={{
            display: 'block',
            width: '100%',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            borderRadius: 2,
            border: theme => `1px solid ${theme.palette.divider}`
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16 / 9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            bgcolor: 'action.hover',
            border: theme => `1px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            color: 'text.secondary'
          }}
        >
          <i className="tabler-photo-off" style={{ fontSize: 30 }} />
          <Typography variant="body2">
            {name || 'Belum ada gambar'}
          </Typography>
        </Box>
      )}

      {name && url && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, overflowWrap: 'anywhere' }}
        >
          {name}
        </Typography>
      )}
    </Box>
  )

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ImagePanel title="Cover pelatihan" url={coverUrl} name={coverName} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ImagePanel title="Banner promosi" url={bannerUrl} name={bannerName} />
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={3}>
        {!isEmpty(description) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="Deskripsi singkat banner" value={description} />
          </Grid>
        )}

        {!isEmpty(promotionDescription) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="Deskripsi promosi" value={promotionDescription} />
          </Grid>
        )}

        {typeof published === 'boolean' && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField label="Status publikasi" value={published} />
          </Grid>
        )}

        {typeof featured === 'boolean' && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField label="Pelatihan unggulan" value={featured} />
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}

/* =========================================================
   SCHEDULE SUMMARY
========================================================= */

const ScheduleSummary = ({ data }: { data: StepData }) => {
  const sessions = getSessions(data)

  const registrationStart =
    data.registrationStart ?? data.registrationStartDate

  const registrationEnd =
    data.registrationEnd ?? data.registrationEndDate

  const quota = data.quota ?? data.capacity
  const minParticipants = data.minParticipants

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {[
          {
            label: 'Mulai pendaftaran',
            value: formatDate(registrationStart),
            icon: 'tabler-calendar-plus'
          },
          {
            label: 'Akhir pendaftaran',
            value: formatDate(registrationEnd),
            icon: 'tabler-calendar-check'
          },
          {
            label: 'Kuota peserta',
            value: isEmpty(quota) ? '-' : `${valueOf(quota)} peserta`,
            icon: 'tabler-users'
          },
          {
            label: 'Minimal peserta',
            value: isEmpty(minParticipants)
              ? '-'
              : `${valueOf(minParticipants)} peserta`,
            icon: 'tabler-user-check'
          }
        ].map(item => (
          <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 1.5,
                  bgcolor: 'action.hover',
                  color: 'primary.main'
                }}
              >
                <i className={item.icon} style={{ fontSize: 20 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>

                <Typography variant="body2" fontWeight={600}>
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {!isEmpty(data.requirements) && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Persyaratan peserta
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            {Array.isArray(data.requirements) ? (
              <Stack spacing={1}>
                {data.requirements.map((item, index) => (
                  <Typography key={index} variant="body2">
                    {index + 1}. {valueOf(item)}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {valueOf(data.requirements)}
              </Typography>
            )}
          </Paper>
        </Box>
      )}

      <Divider />

      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Sesi pelatihan
          </Typography>

          <Chip
            size="small"
            variant="tonal"
            label={`${sessions?.length ?? 0} sesi`}
          />
        </Stack>

        {!sessions?.length ? (
          <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}
          >
            <i className="tabler-calendar-off" style={{ fontSize: 28 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Belum ada sesi pelatihan.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {sessions.map((item, index) => {
              const session = isObject(item) ? item : {}
              const materials = getMaterials(session)

              const sessionTitle =
                session.title ?? session.name ?? `Sesi ${index + 1}`

              return (
                <Paper
                  key={String(session.id ?? index)}
                  variant="outlined"
                  sx={{ borderRadius: 2, overflow: 'hidden' }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {String(sessionTitle)}
                      </Typography>

                      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<i className="tabler-calendar-event" />}
                          label={formatDate(session.date ?? session.startDate)}
                        />

                        {!isEmpty(session.location) && (
                          <Chip
                            size="small"
                            variant="outlined"
                            icon={<i className="tabler-map-pin" />}
                            label={valueOf(session.location)}
                          />
                        )}
                      </Stack>
                    </Box>

                    <Chip
                      size="small"
                      variant="tonal"
                      label={`${materials.length} materi`}
                    />
                  </Box>

                  {!isEmpty(session.description) && (
                    <Box sx={{ px: 2, pt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {valueOf(session.description)}
                      </Typography>
                    </Box>
                  )}

                  {materials.length > 0 && (
                    <Box sx={{ p: 2, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                        Rincian materi
                      </Typography>

                      <Box
                        sx={{
                          width: '100%',
                          overflowX: 'auto',
                          border: theme => `1px solid ${theme.palette.divider}`,
                          borderRadius: 1.5
                        }}
                      >
                        <Box
                          component="table"
                          sx={{
                            width: '100%',
                            minWidth: 420,
                            borderCollapse: 'collapse',
                            '& th': {
                              bgcolor: 'action.hover',
                              color: 'text.secondary',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              textAlign: 'left',
                              whiteSpace: 'nowrap'
                            },
                            '& th, & td': {
                              px: 2,
                              py: 1.5,
                              borderBottom: theme =>
                                `1px solid ${theme.palette.divider}`
                            },
                            '& tbody tr:last-child td': { borderBottom: 0 }
                          }}
                        >
                          <thead>
                          <tr>
                            <Box component="th">Materi</Box>
                            <Box component="th">Mulai</Box>
                            <Box component="th">Selesai</Box>
                            <Box component="th">Durasi</Box>
                          </tr>
                          </thead>

                          <tbody>
                          {materials.map((materialItem, materialIndex) => {
                            const material = isObject(materialItem)
                              ? materialItem
                              : {}

                            const title =
                              material.title ??
                              material.name ??
                              material.materialTitle ??
                              `Materi ${materialIndex + 1}`

                            const start = material.startTime ?? material.start
                            const end = material.endTime ?? material.end

                            let duration = material.durationMinutes

                            if (
                              isEmpty(duration) &&
                              typeof start === 'string' &&
                              typeof end === 'string'
                            ) {
                              const [startHour, startMinute] =
                                start.split(':').map(Number)

                              const [endHour, endMinute] =
                                end.split(':').map(Number)

                              const startTotal = startHour * 60 + startMinute
                              const endTotal = endHour * 60 + endMinute

                              if (
                                Number.isFinite(startTotal) &&
                                Number.isFinite(endTotal) &&
                                endTotal >= startTotal
                              ) {
                                duration = endTotal - startTotal
                              }
                            }

                            return (
                              <tr key={String(material.id ?? materialIndex)}>
                                <Box component="td" sx={{ minWidth: 150 }}>
                                  <Typography variant="body2" fontWeight={500}>
                                    {String(title)}
                                  </Typography>

                                  {!isEmpty(material.description) && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {valueOf(material.description)}
                                    </Typography>
                                  )}
                                </Box>

                                <Box component="td">
                                  <Typography variant="body2">
                                    {isEmpty(start) ? '-' : valueOf(start)}
                                  </Typography>
                                </Box>

                                <Box component="td">
                                  <Typography variant="body2">
                                    {isEmpty(end) ? '-' : valueOf(end)}
                                  </Typography>
                                </Box>

                                <Box component="td">
                                  <Typography variant="body2" fontWeight={500}>
                                    {formatDuration(duration)}
                                  </Typography>
                                </Box>
                              </tr>
                            )
                          })}
                          </tbody>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Paper>
              )
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

/* =========================================================
   ASSESSMENT SUMMARY
========================================================= */

const AssessmentSummary = ({ data }: { data: StepData }) => {
  const entries = Object.entries(data).filter(
    ([key, value]) => !hiddenKeys.has(key) && !isEmpty(value)
  )

  const gradeRanges = data.gradeRanges
  const otherEntries = entries.filter(([key]) => key !== 'gradeRanges')

  return (
    <Stack spacing={3}>
      {otherEntries.length > 0 && (
        <GenericInfoGrid data={Object.fromEntries(otherEntries)} />
      )}

      {Array.isArray(gradeRanges) && gradeRanges.length > 0 && (
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
            Rentang nilai
          </Typography>

          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              border: theme => `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <Box
              component="table"
              sx={{
                width: '100%',
                minWidth: 360,
                borderCollapse: 'collapse',
                '& th': {
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  bgcolor: 'action.hover'
                },
                '& th, & td': {
                  px: 2,
                  py: 1.5,
                  borderBottom: theme =>
                    `1px solid ${theme.palette.divider}`
                },
                '& tbody tr:last-child td': { borderBottom: 0 }
              }}
            >
              <thead>
              <tr>
                <Box component="th">Predikat</Box>
                <Box component="th">Nilai minimum</Box>
                <Box component="th">Nilai maksimum</Box>
              </tr>
              </thead>

              <tbody>
              {[...gradeRanges]
                .filter(isObject)
                .sort((a, b) => Number(b.min ?? 0) - Number(a.min ?? 0))
                .map((range, index) => (
                  <tr key={String(range.id ?? `${range.label}-${index}`)}>
                    <Box component="td">
                      <Chip
                        size="small"
                        variant="tonal"
                        color={index === 0 ? 'success' : 'default'}
                        label={String(range.label ?? '-')}
                      />
                    </Box>

                    <Box component="td">
                      <Typography variant="body2">
                        {String(range.min ?? '-')}
                      </Typography>
                    </Box>

                    <Box component="td">
                      <Typography variant="body2">
                        {String(range.max ?? '-')}
                      </Typography>
                    </Box>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </Box>
      )}

      {!entries.length && (!Array.isArray(gradeRanges) || !gradeRanges.length) && (
        <Typography variant="body2" color="text.secondary">
          Belum ada data penilaian dan sertifikat.
        </Typography>
      )}
    </Stack>
  )
}

/* =========================================================
   MAIN REVIEW
========================================================= */

const StepReview = ({
                      activeStep,
                      handleNext,
                      handlePrev,
                      handleGoToStep,
                      steps,
                      data
                    }: Props) => {
  const theme = useTheme()
  const [confirmed, setConfirmed] = useState(false)

  const trainingInfo = data?.trainingInfo ?? {}
  const media = data?.media ?? {}
  const scheduleRegistration = data?.scheduleRegistration ?? {}
  const assessment = data?.assessment ?? {}

  const sections = [
    {
      title: 'Informasi Program',
      subtitle: 'Identitas, kategori, kompetensi, dan instruktur',
      icon: 'tabler-file-text',
      step: 0,
      data: trainingInfo,
      content: <TrainingInfoSummary data={trainingInfo} />
    },
    {
      title: 'Cover & Promosi',
      subtitle: 'Cover, banner, dan pengaturan publikasi',
      icon: 'tabler-photo',
      step: 1,
      data: media,
      content: <MediaSummary data={media} />
    },
    {
      title: 'Jadwal & Pendaftaran',
      subtitle: 'Periode pendaftaran, kuota, sesi, dan materi',
      icon: 'tabler-calendar-event',
      step: 2,
      data: scheduleRegistration,
      content: <ScheduleSummary data={scheduleRegistration} />
    },
    {
      title: 'Penilaian & Sertifikat',
      subtitle: 'Nilai kelulusan dan konfigurasi sertifikat',
      icon: 'tabler-chart-bar',
      step: 3,
      data: assessment,
      content: <AssessmentSummary data={assessment} />
    }
  ]

  return (
    <Grid container spacing={{ xs: 3, lg: 4 }}>
      {/* Main content */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Periksa Kembali
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Pastikan seluruh informasi program pelatihan sudah benar sebelum melanjutkan.
        </Typography>

        <Alert
          severity="info"
          icon={<i className="tabler-info-circle" />}
          sx={{ mb: 3 }}
        >
          Kamu masih bisa mengubah bagian mana pun sebelum program dikonfirmasi.
        </Alert>

        <Stack spacing={3}>
          {sections.map(section => (
            <Paper
              key={section.title}
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2.5,
                minWidth: 0
              }}
            >
              <SectionHeader
                title={section.title}
                subtitle={section.subtitle}
                icon={section.icon}
                onEdit={
                  handleGoToStep
                    ? () => {
                      setConfirmed(false)
                      handleGoToStep(section.step)
                    }
                    : undefined
                }
              />

              {section.content}
            </Paper>
          ))}
        </Stack>

        <Paper
          variant="outlined"
          sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 2.5 }}
        >
          <FormControlLabel
            sx={{ m: 0, alignItems: 'flex-start' }}
            control={
              <Switch
                checked={confirmed}
                onChange={event => setConfirmed(event.target.checked)}
                sx={{ mr: 1 }}
              />
            }
            label={
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Saya telah memeriksa informasi pelatihan.
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Pastikan informasi, jadwal, rentang nilai, dan pengaturan sertifikat sudah sesuai.
                </Typography>
              </Box>
            }
          />
        </Paper>
      </Grid>

      {/* Sidebar */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Box sx={{ position: { lg: 'sticky' }, top: 24 }}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 2.5,
              bgcolor: 'action.hover',
              textAlign: 'center'
            }}
          >
            <Box
              component="img"
              src="/images/illustrations/characters/6.png"
              alt="Ilustrasi pemeriksaan program pelatihan"
              sx={{
                display: 'block',
                width: '100%',
                maxWidth: 260,
                height: 220,
                objectFit: 'contain',
                mx: 'auto',
                transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'
              }}
            />

            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
              Satu Langkah Lagi!
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Periksa setiap bagian sebelum program siap dipublikasikan.
            </Typography>

            <Divider sx={{ mb: 2.5 }} />

            <Stack spacing={2} sx={{ textAlign: 'left' }}>
              {sections.map(section => {
                const filled = Object.entries(section.data).some(
                  ([key, value]) => !hiddenKeys.has(key) && !isEmpty(value)
                )

                return (
                  <Stack
                    key={section.title}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: theme =>
                          `1px solid ${theme.palette.divider}`,
                        color: filled ? 'success.main' : 'text.secondary'
                      }}
                    >
                      <i
                        className={filled ? 'tabler-check' : section.icon}
                        style={{ fontSize: 20 }}
                      />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {section.title}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {filled ? 'Data telah diisi' : 'Belum ada data'}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      variant="tonal"
                      color={filled ? 'success' : 'default'}
                      label={filled ? 'Terisi' : 'Kosong'}
                    />
                  </Stack>
                )
              })}
            </Stack>
          </Paper>
        </Box>
      </Grid>

      {/* Footer navigation */}
      <Grid size={{ xs: 12 }}>
        <Divider sx={{ mb: 3 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Button
            variant="tonal"
            color="secondary"
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={
              <DirectionalIcon
                ltrIconClass="tabler-arrow-left"
                rtlIconClass="tabler-arrow-right"
              />
            }
          >
            Sebelumnya
          </Button>

          <Button
            variant="contained"
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            disabled={!confirmed}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className="tabler-check" />
              ) : (
                <DirectionalIcon
                  ltrIconClass="tabler-arrow-right"
                  rtlIconClass="tabler-arrow-left"
                />
              )
            }
          >
            {activeStep === steps.length - 1 ? 'Konfirmasi' : 'Selanjutnya'}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default StepReview

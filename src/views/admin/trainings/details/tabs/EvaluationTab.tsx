'use client'

import { useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'

import type { TrainingRecord } from '@/types/admin/trainingTypes'

type EvaluationTabProps = {
  data: TrainingRecord
}

type ReviewSource = 'participant' | 'internal'

type EvaluationStatus = 'submitted' | 'pending'

type EvaluationRecord = {
  id: string
  source: ReviewSource
  name: string
  institution: string
  avatar: string
  submittedAt: string
  overall: number
  material: number
  facility: number
  organization: number
  relevance: number
  comment: string
  status: EvaluationStatus
}

const initialEvaluations: EvaluationRecord[] = [
  {
    id: 'EVL-001',
    source: 'participant',
    name: 'Aditya Pratama',
    institution: 'Universitas Lambung Mangkurat',
    avatar: 'https://i.pravatar.cc/150?img=12',
    submittedAt: '2026-10-20',
    overall: 5,
    material: 5,
    facility: 4,
    organization: 5,
    relevance: 5,
    comment:
      'Program sangat bermanfaat. Materi relevan dengan kebutuhan peserta dan pelaksanaan acara berjalan dengan baik.',
    status: 'submitted'
  },
  {
    id: 'EVL-002',
    source: 'participant',
    name: 'Nadia Putri',
    institution: 'SMK Negeri 1 Banjarbaru',
    avatar: 'https://i.pravatar.cc/150?img=44',
    submittedAt: '2026-10-20',
    overall: 4,
    material: 4,
    facility: 3,
    organization: 4,
    relevance: 5,
    comment:
      'Pelatihannya menarik. Semoga fasilitas ruangan ditingkatkan dan waktu praktik bisa diperpanjang.',
    status: 'submitted'
  },
  {
    id: 'EVL-003',
    source: 'participant',
    name: 'Rizky Ramadhan',
    institution: 'Dinas Koperasi dan UKM',
    avatar: 'https://i.pravatar.cc/150?img=14',
    submittedAt: '2026-10-21',
    overall: 4,
    material: 4,
    facility: 4,
    organization: 4,
    relevance: 5,
    comment:
      'Program relevan untuk pekerjaan. Akan lebih baik jika modul dan materi dapat diakses kembali setelah acara.',
    status: 'submitted'
  },
  {
    id: 'EVL-004',
    source: 'participant',
    name: 'Siti Rahmawati',
    institution: 'UMKM Banjarbaru',
    avatar: 'https://i.pravatar.cc/150?img=47',
    submittedAt: '2026-10-21',
    overall: 5,
    material: 5,
    facility: 5,
    organization: 5,
    relevance: 5,
    comment:
      'Penyelenggaraan sangat baik. Materi mudah diterapkan dan kegiatan berjalan sesuai harapan.',
    status: 'submitted'
  },
  {
    id: 'EVL-005',
    source: 'participant',
    name: 'Muhammad Fajar',
    institution: 'Universitas Islam Kalimantan',
    avatar: 'https://i.pravatar.cc/150?img=15',
    submittedAt: '',
    overall: 0,
    material: 0,
    facility: 0,
    organization: 0,
    relevance: 0,
    comment: '',
    status: 'pending'
  },
  {
    id: 'EVL-006',
    source: 'participant',
    name: 'Dewi Anggraini',
    institution: 'Koperasi Sejahtera',
    avatar: 'https://i.pravatar.cc/150?img=49',
    submittedAt: '2026-10-22',
    overall: 4,
    material: 5,
    facility: 3,
    organization: 4,
    relevance: 4,
    comment:
      'Materi bagus. Fasilitas ruangan dan koneksi internet masih perlu ditingkatkan.',
    status: 'submitted'
  },
  {
    id: 'EVL-007',
    source: 'participant',
    name: 'Andi Saputra',
    institution: 'Pelaku UMKM',
    avatar: 'https://i.pravatar.cc/150?img=11',
    submittedAt: '',
    overall: 0,
    material: 0,
    facility: 0,
    organization: 0,
    relevance: 0,
    comment: '',
    status: 'pending'
  },
  {
    id: 'EVL-008',
    source: 'internal',
    name: 'Rizky Pratama',
    institution: 'Admin Program',
    avatar: 'https://i.pravatar.cc/150?img=13',
    submittedAt: '2026-10-22',
    overall: 4,
    material: 4,
    facility: 3,
    organization: 4,
    relevance: 5,
    comment:
      'Secara umum program berjalan baik. Perlu peningkatan kesiapan perangkat, koneksi internet, dan pengecekan fasilitas sebelum acara dimulai.',
    status: 'submitted'
  },
  {
    id: 'EVL-009',
    source: 'internal',
    name: 'Siti Rahma',
    institution: 'Pegawai Penyelenggara',
    avatar: 'https://i.pravatar.cc/150?img=45',
    submittedAt: '2026-10-22',
    overall: 4,
    material: 5,
    facility: 4,
    organization: 3,
    relevance: 5,
    comment:
      'Konten program sudah sesuai tujuan. Koordinasi registrasi dan pengaturan waktu antaragenda perlu dibuat lebih efisien.',
    status: 'submitted'
  },
  {
    id: 'EVL-010',
    source: 'internal',
    name: 'Andi Saputra',
    institution: 'Koordinator Kegiatan',
    avatar: 'https://i.pravatar.cc/150?img=68',
    submittedAt: '',
    overall: 0,
    material: 0,
    facility: 0,
    organization: 0,
    relevance: 0,
    comment: '',
    status: 'pending'
  }
]

const aspects = [
  {
    key: 'material',
    label: 'Kualitas materi',
    icon: 'tabler-book-2'
  },
  {
    key: 'facility',
    label: 'Fasilitas dan sarana',
    icon: 'tabler-building'
  },
  {
    key: 'organization',
    label: 'Penyelenggaraan acara',
    icon: 'tabler-calendar-check'
  },
  {
    key: 'relevance',
    label: 'Relevansi program',
    icon: 'tabler-target-arrow'
  }
] as const

const formatDate = (value: string) => {
  if (!value) return 'Belum mengisi'

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const EvaluationTab = ({ data }: EvaluationTabProps) => {
  const [evaluations, setEvaluations] = useState(initialEvaluations)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<EvaluationRecord | null>(null)

  const participantReviews = evaluations.filter(
    item => item.source === 'participant'
  )

  const internalReviews = evaluations.filter(
    item => item.source === 'internal'
  )

  const getSummary = (items: EvaluationRecord[]) => {
    const submitted = items.filter(item => item.status === 'submitted')
    const pending = items.filter(item => item.status === 'pending')

    const average = (
      key: 'overall' | 'material' | 'facility' | 'organization' | 'relevance'
    ) => {
      if (!submitted.length) return 0

      return Number(
        (
          submitted.reduce((sum, item) => sum + item[key], 0) /
          submitted.length
        ).toFixed(1)
      )
    }

    return {
      submitted,
      pending,
      average,
      overall: average('overall'),
      responseRate: items.length
        ? Math.round((submitted.length / items.length) * 100)
        : 0
    }
  }

  const participantSummary = getSummary(participantReviews)
  const internalSummary = getSummary(internalReviews)
  const allSummary = getSummary(evaluations)

  const filteredEvaluations = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return evaluations.filter(item => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.institution.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.comment.toLowerCase().includes(keyword)

      const matchesSource =
        sourceFilter === 'all' || item.source === sourceFilter

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesSource && matchesStatus
    })
  }, [evaluations, search, sourceFilter, statusFilter])

  const exportCsv = () => {
    const headers = [
      'ID',
      'Sumber Review',
      'Nama Reviewer',
      'Instansi',
      'Tanggal Evaluasi',
      'Rating Keseluruhan',
      'Materi',
      'Fasilitas',
      'Penyelenggaraan',
      'Relevansi',
      'Catatan Review',
      'Status'
    ]

    const rows = filteredEvaluations.map(item => [
      item.id,
      item.source === 'participant' ? 'Peserta' : 'Admin/Pegawai',
      item.name,
      item.institution,
      item.submittedAt || '-',
      item.overall || '-',
      item.material || '-',
      item.facility || '-',
      item.organization || '-',
      item.relevance || '-',
      item.comment || '-',
      item.status === 'submitted' ? 'Sudah mengisi' : 'Belum mengisi'
    ])

    const escapeCsv = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`

const csv = [headers, ...rows]
  .map(row => row.map(escapeCsv).join(','))
  .join('\r\n')

const blob = new Blob(['\uFEFF' + csv], {
  type: 'text/csv;charset=utf-8;'
})

const url = URL.createObjectURL(blob)
const anchor = document.createElement('a')

anchor.href = url
anchor.download = `evaluasi-${data.slug || data.id}.csv`
anchor.click()

URL.revokeObjectURL(url)
}

const renderReviewSummary = (
  title: string,
  description: string,
  summary: ReturnType<typeof getSummary>,
  icon: string,
  color: 'primary' | 'success'
) => (
  <Card>
    <CardContent className='flex flex-col gap-4 p-5'>
      <Box className='flex items-start justify-between gap-3'>
        <Box>
          <Typography variant='h6' className='font-semibold'>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary' className='mt-1'>
            {description}
          </Typography>
        </Box>

        <Avatar
          variant='rounded'
          className={`bs-12 is-12 ${color === 'primary' ? 'bg-primaryLight text-primary' : 'bg-successLight text-success'}`}
        >
          <i className={`${icon} text-2xl`} />
        </Avatar>
      </Box>

      <Divider />

      <Box className='flex items-center gap-4'>
        <Box>
          <Typography variant='h3' className='font-semibold'>
            {summary.overall.toFixed(1)}
            <Typography component='span' variant='body1' color='text.secondary'>
              {' '}/ 5
            </Typography>
          </Typography>

          <Rating
            value={summary.overall}
            precision={0.1}
            readOnly
            size='small'
          />
        </Box>

        <Box className='min-w-0 flex-1'>
          <Typography variant='body2' className='font-medium'>
            {summary.overall >= 4.5
              ? 'Sangat baik'
              : summary.overall >= 4
                ? 'Baik'
                : summary.overall >= 3
                  ? 'Cukup'
                  : summary.submitted.length
                    ? 'Perlu evaluasi'
                    : 'Belum tersedia'}
          </Typography>

          <Typography variant='caption' color='text.secondary'>
            {summary.submitted.length} review masuk
          </Typography>
        </Box>
      </Box>

      <Box>
        <Box className='mb-2 flex items-center justify-between gap-2'>
          <Typography variant='body2' color='text.secondary'>
            Tingkat respons
          </Typography>
          <Typography variant='body2' className='font-semibold'>
            {summary.responseRate}%
          </Typography>
        </Box>

        <LinearProgress
          variant='determinate'
          value={summary.responseRate}
          color={color}
          className='h-2 rounded-full'
        />

        <Typography variant='caption' color='text.secondary' className='mt-2 block'>
          {summary.submitted.length} sudah mengisi · {summary.pending.length} belum mengisi
        </Typography>
      </Box>
    </CardContent>
  </Card>
)

return (
  <Box className='flex flex-col gap-5'>
    {/* HEADER */}

    <Box className='flex flex-wrap items-center justify-between gap-3'>
      <Box>
        <Typography variant='h5' className='font-semibold'>
          Evaluasi Program
        </Typography>

        <Typography variant='body2' color='text.secondary' className='mt-1'>
          Review peserta dan evaluasi internal penyelenggaraan {data.title}.
        </Typography>
      </Box>

      <Button
        variant='outlined'
        startIcon={<i className='tabler-download text-lg' />}
        onClick={exportCsv}
      >
        Ekspor evaluasi
      </Button>
    </Box>

    {/* OVERALL SUMMARY */}

    <Box className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <Card>
        <CardContent className='flex items-center gap-4 p-5'>
          <Avatar
            variant='rounded'
            className='bs-14 is-14 bg-warningLight text-warning'
          >
            <i className='tabler-star text-3xl' />
          </Avatar>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              Rating gabungan
            </Typography>

            <Typography variant='h4' className='font-semibold'>
              {allSummary.overall.toFixed(1)}
              <Typography component='span' variant='body2' color='text.secondary'>
                {' '}/ 5
              </Typography>
            </Typography>

            <Rating
              value={allSummary.overall}
              precision={0.1}
              readOnly
              size='small'
            />

            <Typography variant='caption' color='text.secondary' className='block'>
              {allSummary.submitted.length} review masuk
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='flex items-center gap-4 p-5'>
          <Avatar
            variant='rounded'
            className='bs-14 is-14 bg-primaryLight text-primary'
          >
            <i className='tabler-message-circle text-3xl' />
          </Avatar>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              Review peserta
            </Typography>

            <Typography variant='h4' className='font-semibold'>
              {participantSummary.submitted.length}
              <Typography component='span' variant='body2' color='text.secondary'>
                {' '}/ {participantReviews.length}
              </Typography>
            </Typography>

            <Typography variant='caption' color='text.secondary'>
              Rating {participantSummary.overall.toFixed(1)} / 5
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='flex items-center gap-4 p-5'>
          <Avatar
            variant='rounded'
            className='bs-14 is-14 bg-successLight text-success'
          >
            <i className='tabler-clipboard-check text-3xl' />
          </Avatar>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              Evaluasi internal
            </Typography>

            <Typography variant='h4' className='font-semibold'>
              {internalSummary.submitted.length}
              <Typography component='span' variant='body2' color='text.secondary'>
                {' '}/ {internalReviews.length}
              </Typography>
            </Typography>

            <Typography variant='caption' color='text.secondary'>
              Rating {internalSummary.overall.toFixed(1)} / 5
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>

    {/* SEPARATED REVIEW SOURCES */}

    <Box className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {renderReviewSummary(
        'Review Peserta',
        'Kepuasan dan pengalaman peserta terhadap program.',
        participantSummary,
        'tabler-users',
        'primary'
      )}

      {renderReviewSummary(
        'Evaluasi Admin / Pegawai',
        'Penilaian internal terhadap pelaksanaan kegiatan.',
        internalSummary,
        'tabler-clipboard-check',
        'success'
      )}
    </Box>

    {/* ASPECT ANALYSIS */}

    <Box className='grid grid-cols-1 items-start gap-5 xl:grid-cols-2'>
      {[{
        title: 'Aspek Penilaian Peserta',
        summary: participantSummary
      }, {
        title: 'Aspek Evaluasi Internal',
        summary: internalSummary
      }].map(group => (
        <Card key={group.title}>
          <CardContent className='flex flex-col gap-5 p-5'>
            <Box>
              <Typography variant='h6' className='font-semibold'>
                {group.title}
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Penilaian berfokus pada program dan penyelenggaraan acara.
              </Typography>
            </Box>

            {aspects.map(aspect => {
              const score = group.summary.average(aspect.key)

              return (
                <Box key={aspect.key} className='flex flex-col gap-2'>
                  <Box className='flex items-center justify-between gap-3'>
                    <Box className='flex items-center gap-2'>
                      <i className={`${aspect.icon} text-lg text-textSecondary`} />
                      <Typography variant='body2'>
                        {aspect.label}
                      </Typography>
                    </Box>

                    <Box className='flex items-center gap-2'>
                      <Rating
                        value={score}
                        precision={0.1}
                        readOnly
                        size='small'
                      />

                      <Typography variant='body2' className='font-semibold'>
                        {score.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant='determinate'
                    value={(score / 5) * 100}
                    className='h-2 rounded-full'
                    color={score >= 4 ? 'success' : 'primary'}
                  />
                </Box>
              )
            })}

            {!group.summary.submitted.length && (
              <Typography variant='caption' color='text.secondary'>
                Belum ada review untuk dihitung.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>

    {/* REVIEW LIST */}

    <Card>
      <CardContent className='flex flex-col gap-5 p-5'>
        <Box className='flex flex-wrap items-center justify-between gap-3'>
          <Box>
            <Typography variant='h6' className='font-semibold'>
              Catatan dan Review
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Catatan peserta dan evaluasi internal ditampilkan terpisah berdasarkan sumbernya.
            </Typography>
          </Box>

          <Chip
            label={`${filteredEvaluations.length} data`}
            color='primary'
            variant='tonal'
          />
        </Box>

        <Box className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <TextField
            fullWidth
            size='small'
            placeholder='Cari nama, instansi, atau komentar...'
            value={search}
            onChange={event => setSearch(event.target.value)}
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

          <TextField
            select
            fullWidth
            size='small'
            label='Sumber review'
            value={sourceFilter}
            onChange={event => setSourceFilter(event.target.value)}
          >
            <MenuItem value='all'>Semua sumber</MenuItem>
            <MenuItem value='participant'>Peserta</MenuItem>
            <MenuItem value='internal'>Admin / Pegawai</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size='small'
            label='Status evaluasi'
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value)}
          >
            <MenuItem value='all'>Semua status</MenuItem>
            <MenuItem value='submitted'>Sudah mengisi</MenuItem>
            <MenuItem value='pending'>Belum mengisi</MenuItem>
          </TextField>
        </Box>

        <Divider />

        {filteredEvaluations.length ? (
          <Box className='flex flex-col gap-3'>
            {filteredEvaluations.map(item => (
              <Box
                key={item.id}
                className='flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start'
              >
                <Avatar
                  src={item.avatar}
                  alt={item.name}
                  className='bs-11 is-11'
                >
                  {item.name.charAt(0)}
                </Avatar>

                <Box className='min-w-0 flex-1'>
                  <Box className='flex flex-wrap items-center gap-2'>
                    <Typography variant='subtitle1' className='font-semibold'>
                      {item.name}
                    </Typography>

                    <Chip
                      size='small'
                      variant='tonal'
                      color={item.source === 'participant' ? 'primary' : 'success'}
                      icon={
                        <i className={
                          item.source === 'participant'
                            ? 'tabler-user text-sm'
                            : 'tabler-shield-check text-sm'
                        } />
                      }
                      label={
                        item.source === 'participant'
                          ? 'Review Peserta'
                          : 'Admin / Pegawai'
                      }
                    />

                    <Chip
                      size='small'
                      variant='tonal'
                      color={item.status === 'submitted' ? 'success' : 'warning'}
                      label={item.status === 'submitted' ? 'Sudah mengisi' : 'Belum mengisi'}
                    />
                  </Box>

                  <Typography variant='caption' color='text.secondary'>
                    {item.institution}
                    {item.submittedAt ? ` · ${formatDate(item.submittedAt)}` : ''}
                  </Typography>

                  {item.status === 'submitted' ? (
                    <>
                      <Box className='mt-2 flex items-center gap-2'>
                        <Rating value={item.overall} readOnly size='small' />

                        <Typography variant='body2' className='font-semibold'>
                          {item.overall}/5
                        </Typography>
                      </Box>

                      <Typography variant='body2' className='mt-2 leading-relaxed'>
                        {item.comment || 'Tidak ada catatan tertulis.'}
                      </Typography>

                      <Box className='mt-3 flex flex-wrap gap-2'>
                        {aspects.map(aspect => (
                          <Chip
                            key={aspect.key}
                            size='small'
                            variant='outlined'
                            label={`${aspect.label}: ${item[aspect.key]}/5`}
                          />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant='body2' color='text.secondary' className='mt-2'>
                      Evaluasi belum dikirim.
                    </Typography>
                  )}
                </Box>

                <Box className='flex items-center gap-1'>
                  {item.status === 'submitted' && (
                    <Button
                      size='small'
                      variant='outlined'
                      startIcon={<i className='tabler-eye text-lg' />}
                      onClick={() => setSelectedEvaluation(item)}
                    >
                      Detail
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className='py-10 text-center'>
            <i className='tabler-message-search text-4xl text-textDisabled' />

            <Typography variant='body1' className='mt-2 font-medium'>
              Review tidak ditemukan
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Coba ubah kata kunci atau filter.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>

    {/* REVIEW DETAIL */}

    <Dialog
      open={Boolean(selectedEvaluation)}
      onClose={() => setSelectedEvaluation(null)}
      fullWidth
      maxWidth='sm'
    >
      {selectedEvaluation && (
        <>
          <DialogContent>
            <Box className='flex flex-col gap-5 pt-2'>
              <Box className='flex items-center gap-3'>
                <Avatar
                  src={selectedEvaluation.avatar}
                  alt={selectedEvaluation.name}
                  className='bs-14 is-14'
                />

                <Box className='min-w-0'>
                  <Typography variant='h6' className='font-semibold'>
                    {selectedEvaluation.name}
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    {selectedEvaluation.institution}
                  </Typography>

                  <Chip
                    className='mt-1'
                    size='small'
                    variant='tonal'
                    color={selectedEvaluation.source === 'participant' ? 'primary' : 'success'}
                    label={
                      selectedEvaluation.source === 'participant'
                        ? 'Review Peserta'
                        : 'Evaluasi Admin / Pegawai'
                    }
                  />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Rating keseluruhan
                </Typography>

                <Box className='mt-1 flex items-center gap-2'>
                  <Rating value={selectedEvaluation.overall} readOnly size='large' />

                  <Typography variant='h6' className='font-semibold'>
                    {selectedEvaluation.overall}/5
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {aspects.map(aspect => (
                <Box
                  key={aspect.key}
                  className='flex items-center justify-between gap-3'
                >
                  <Box className='flex items-center gap-2'>
                    <i className={`${aspect.icon} text-lg text-textSecondary`} />
                    <Typography variant='body2'>
                      {aspect.label}
                    </Typography>
                  </Box>

                  <Box className='flex items-center gap-2'>
                    <Rating
                      value={selectedEvaluation[aspect.key]}
                      readOnly
                      size='small'
                    />

                    <Typography variant='body2' className='font-semibold'>
                      {selectedEvaluation[aspect.key]}/5
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Box className='rounded-xl bg-actionHover p-4'>
                <Typography variant='body2' className='font-semibold'>
                  {selectedEvaluation.source === 'participant'
                    ? 'Catatan peserta'
                    : 'Catatan internal penyelenggara'}
                </Typography>

                <Typography variant='body2' color='text.secondary' className='mt-2 leading-relaxed'>
                  {selectedEvaluation.comment || 'Tidak ada catatan.'}
                </Typography>
              </Box>

              <Typography variant='caption' color='text.secondary'>
                Dikirim pada {formatDate(selectedEvaluation.submittedAt)}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions className='px-6 pb-5'>
            <Button onClick={() => setSelectedEvaluation(null)}>
              Tutup
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>

    <Box className='flex items-start gap-2 rounded-xl border border-info/20 bg-infoLight p-4'>
      <i className='tabler-info-circle mt-0.5 text-xl text-info' />

      <Box>
        <Typography variant='body2' className='font-medium'>
          Data demonstrasi
        </Typography>

        <Typography variant='caption' color='text.secondary'>
          Data review masih berupa dummy. Pada implementasi backend, review peserta dan
          evaluasi internal perlu disimpan dengan sumber, identitas reviewer, waktu
          pengisian, serta hak akses yang berbeda.
        </Typography>
      </Box>
    </Box>
  </Box>
)
}

export default EvaluationTab

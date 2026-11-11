'use client'

// React Imports
import { useEffect, useMemo, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Skeleton from '@mui/material/Skeleton'
import Radio from '@mui/material/Radio'

// Style Imports
import styles from './styles.module.css'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Training = {
  id: number
  title: string
  slug: string
  category: string
  date: string
  time: string
  location: string
  mode: string
  duration: string
  level: string
  trainer: string
  trainerRole: string
  organizer: string
  status: string
  quota: number
  registered: number
  certificate: boolean
  description: string
  image: string
}

// -----------------------------------------------------------------------------
// Dummy Data
// -----------------------------------------------------------------------------

const baseTrainings: Training[] = [
  {
    id: 1,
    title: 'Digital Marketing untuk UMKM',
    slug: 'digital-marketing-untuk-umkm',
    category: 'Digital',
    date: '12 Okt 2026',
    time: '09.00–15.00 WITA',
    location: 'Banjarbaru',
    mode: 'Offline',
    duration: '1 Hari',
    level: 'Pemula',
    trainer: 'Andi Pratama, S.E.',
    trainerRole: 'Praktisi Digital Marketing',
    organizer: 'DISKOP Kota Banjarbaru',
    status: 'Pendaftaran Dibuka',
    quota: 30,
    registered: 24,
    certificate: true,
    description:
      'Pelatihan praktis untuk memahami strategi pemasaran digital, membangun kehadiran online, dan meningkatkan jangkauan bisnis UMKM.',
    image: '/images/front-pages/landing-page/training-1.jpg'
  },
  {
    id: 2,
    title: 'Pengembangan Kewirausahaan',
    slug: 'pengembangan-kewirausahaan',
    category: 'Kewirausahaan',
    date: '18 Okt 2026',
    time: '08.30–16.00 WITA',
    location: 'Banjarbaru',
    mode: 'Offline',
    duration: '2 Hari',
    level: 'Pemula',
    trainer: 'Siti Rahmawati, M.M.',
    trainerRole: 'Konsultan Kewirausahaan',
    organizer: 'DISKOP Kota Banjarbaru',
    status: 'Segera Dibuka',
    quota: 25,
    registered: 18,
    certificate: true,
    description:
      'Membangun fondasi kewirausahaan mulai dari pengembangan ide, validasi usaha, pengelolaan bisnis, hingga strategi pertumbuhan.',
    image: '/images/front-pages/landing-page/training-2.jpg'
  },
  {
    id: 3,
    title: 'Manajemen dan Kepemimpinan',
    slug: 'manajemen-dan-kepemimpinan',
    category: 'Manajemen',
    date: '24 Okt 2026',
    time: '09.00–15.30 WITA',
    location: 'Banjarbaru',
    mode: 'Offline',
    duration: '1 Hari',
    level: 'Menengah',
    trainer: 'Budi Santoso, M.P.A.',
    trainerRole: 'Manajemen & Leadership',
    organizer: 'DISKOP Kota Banjarbaru',
    status: 'Pendaftaran Dibuka',
    quota: 30,
    registered: 21,
    certificate: true,
    description:
      'Mengembangkan kemampuan memimpin tim, komunikasi, pengambilan keputusan, dan pengelolaan kinerja secara efektif.',
    image: '/images/front-pages/landing-page/training-3.jpg'
  },
  {
    id: 4,
    title: 'Kompetensi Digital Tenaga Kerja',
    slug: 'kompetensi-digital-tenaga-kerja',
    category: 'Digital',
    date: '30 Okt 2026',
    time: '08.30–16.00 WITA',
    location: 'Banjarbaru',
    mode: 'Hybrid',
    duration: '2 Hari',
    level: 'Menengah',
    trainer: 'Rizky Maulana, S.Kom.',
    trainerRole: 'Digital Transformation',
    organizer: 'DISKOP Kota Banjarbaru',
    status: 'Pendaftaran Dibuka',
    quota: 40,
    registered: 32,
    certificate: true,
    description:
      'Meningkatkan kemampuan digital tenaga kerja agar lebih siap menghadapi kebutuhan dan perubahan dunia kerja.',
    image: '/images/front-pages/landing-page/training-4.jpg'
  },
  {
    id: 5,
    title: 'Produktivitas dan Budaya Kerja',
    slug: 'produktivitas-dan-budaya-kerja',
    category: 'Industri',
    date: '5 Nov 2026',
    time: '09.00–15.00 WITA',
    location: 'Banjarbaru',
    mode: 'Offline',
    duration: '1 Hari',
    level: 'Pemula',
    trainer: 'Dewi Lestari, M.M.',
    trainerRole: 'Human Capital Specialist',
    organizer: 'DISKOP Kota Banjarbaru',
    status: 'Segera Dibuka',
    quota: 30,
    registered: 12,
    certificate: true,
    description:
      'Membangun budaya kerja produktif melalui pengelolaan waktu, kolaborasi, disiplin, dan peningkatan kualitas kerja.',
    image: ''
  },
  {
    id: 6,
    title: 'Pengelolaan Usaha Berkelanjutan',
    slug: 'pengelolaan-usaha-berkelanjutan',
    category: 'Kewirausahaan',
    date: '12 Nov 2026',
    time: '08.30–15.30 WITA',
    location: 'Banjarbaru',
    mode: 'Online',
    duration: '3 Hari',
    level: 'Menengah',
    trainer: 'Fajar Nugraha, S.E.',
    trainerRole: 'Business Development',
    organizer: 'DISKOP Kota Banjarbaru',
    status: 'Pendaftaran Dibuka',
    quota: 50,
    registered: 34,
    certificate: true,
    description:
      'Mengenalkan strategi pengelolaan usaha berkelanjutan dengan fokus pada efisiensi, inovasi, dan peluang pengembangan bisnis.',
    image: ''
  }
]

const trainings: Training[] = [
  ...baseTrainings,
  ...Array.from({ length: 24 }, (_, index) => {
    const id = index + 7

    const categories = [
      'Digital',
      'Kewirausahaan',
      'Manajemen',
      'Industri'
    ]

    const modes = ['Offline', 'Online', 'Hybrid']
    const levels = ['Pemula', 'Menengah', 'Lanjutan']
    const durations = ['1 Hari', '2 Hari', '3 Hari', '5 Hari']

    const category = categories[index % categories.length]

    return {
      id,
      title: `Program Pelatihan ${category} Kompetensi ${id}`,
      slug: `program-pelatihan-${category.toLowerCase()}-${id}`,
      category,
      date: `${15 + (index % 12)} Nov 2026`,
      time:
        index % 2 === 0
          ? '09.00–15.00 WITA'
          : '08.30–16.00 WITA',
      location: 'Banjarbaru',
      mode: modes[index % modes.length],
      duration: durations[index % durations.length],
      level: levels[index % levels.length],
      trainer: `Trainer Profesional ${id}`,
      trainerRole: 'Instruktur Pelatihan',
      organizer: 'DISKOP Kota Banjarbaru',
      status:
        index % 4 === 0
          ? 'Segera Dibuka'
          : 'Pendaftaran Dibuka',
      quota: 25 + (index % 4) * 5,
      registered: 10 + (index % 15),
      certificate: index % 5 !== 0,
      description:
        'Program pelatihan untuk meningkatkan kompetensi, keterampilan, dan kesiapan peserta dalam menghadapi kebutuhan dunia kerja.',
      image: ''
    }
  })
]

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const categories = [
  'Digital',
  'Kewirausahaan',
  'Manajemen',
  'Industri'
]

const modes = ['Offline', 'Online', 'Hybrid']

const levels = ['Pemula', 'Menengah', 'Lanjutan']

const durations = ['1–2 Hari', '3–5 Hari', '> 5 Hari']

const statuses = [
  'Pendaftaran Dibuka',
  'Segera Dibuka'
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const TrainingsPage = () => {
  const searchParams = useSearchParams()

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const [visibleCount, setVisibleCount] = useState(6)
  const [loadingMore, setLoadingMore] = useState(false)

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([])

  const [selectedModes, setSelectedModes] =
    useState<string[]>([])

  const [selectedLevels, setSelectedLevels] =
    useState<string[]>([])

  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>([])

  const [certificateOnly, setCertificateOnly] =
    useState(false)

  const [duration, setDuration] = useState('')

  const search = searchParams.get('search') ?? ''

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredTrainings = useMemo(() => {
    const query = search.toLowerCase().trim()

    return trainings.filter(training => {
      const matchesSearch =
        !query ||
        training.title.toLowerCase().includes(query) ||
        training.category.toLowerCase().includes(query) ||
        training.description.toLowerCase().includes(query) ||
        training.trainer.toLowerCase().includes(query)

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(training.category)

      const matchesMode =
        selectedModes.length === 0 ||
        selectedModes.includes(training.mode)

      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.includes(training.level)

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(training.status)

      const matchesCertificate =
        !certificateOnly || training.certificate

      let matchesDuration = true

      if (duration === '1–2 Hari') {
        matchesDuration =
          training.duration === '1 Hari' ||
          training.duration === '2 Hari'
      }

      if (duration === '3–5 Hari') {
        matchesDuration =
          training.duration === '3 Hari' ||
          training.duration === '5 Hari'
      }

      if (duration === '> 5 Hari') {
        matchesDuration = false
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesLevel &&
        matchesStatus &&
        matchesCertificate &&
        matchesDuration
      )
    })
  }, [
    search,
    selectedCategories,
    selectedModes,
    selectedLevels,
    selectedStatuses,
    certificateOnly,
    duration
  ])

  // ---------------------------------------------------------------------------
  // Lazy Loading
  // ---------------------------------------------------------------------------

  const visibleTrainings = filteredTrainings.slice(
    0,
    visibleCount
  )

  const hasMore =
    visibleCount < filteredTrainings.length

  useEffect(() => {
    setVisibleCount(6)
  }, [
    search,
    selectedCategories,
    selectedModes,
    selectedLevels,
    selectedStatuses,
    certificateOnly,
    duration
  ])

  useEffect(() => {
    const target = loadMoreRef.current

    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (
          !entries[0].isIntersecting ||
          loadingMore
        ) {
          return
        }

        setLoadingMore(true)

        setTimeout(() => {
          setVisibleCount(current =>
            Math.min(
              current + 6,
              filteredTrainings.length
            )
          )

          setLoadingMore(false)
        }, 350)
      },
      {
        rootMargin: '600px 0px'
      }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [
    hasMore,
    loadingMore,
    filteredTrainings.length
  ])

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const toggleValue = (
    value: string,
    current: string[],
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    setter(
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    )
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedModes.length +
    selectedLevels.length +
    selectedStatuses.length +
    (certificateOnly ? 1 : 0) +
    (duration ? 1 : 0)

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedModes([])
    setSelectedLevels([])
    setSelectedStatuses([])
    setCertificateOnly(false)
    setDuration('')
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className='min-bs-full bg-backgroundDefault'>
      {/* ================================================================
          CATALOG
      ================================================================ */}
      <section>
        <div className='mx-auto flex w-full max-w-[1240px] gap-7 px-5 py-8 sm:px-6 lg:px-8'>
          {/* ============================================================
              FILTER SIDEBAR
          ============================================================ */}
          <aside
            className={`${styles.trainingFilterSidebar} hidden lg:block`}
          >
            <div className={styles.trainingFilter}>
              {/* Category */}
              <div
                className={
                  styles.trainingFilterSection
                }
              >
                <div
                  className={
                    styles.trainingFilterTitle
                  }
                >
                  Kategori
                </div>

                <div
                  className={
                    styles.trainingFilterOptions
                  }
                >
                  {categories.map(category => (
                    <label
                      key={category}
                      className={
                        styles.trainingFilterOption
                      }
                    >
                      <Checkbox
                        size='small'
                        checked={selectedCategories.includes(
                          category
                        )}
                        onChange={() =>
                          toggleValue(
                            category,
                            selectedCategories,
                            setSelectedCategories
                          )
                        }
                      />

                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div
                className={
                  styles.trainingFilterSection
                }
              >
                <div
                  className={
                    styles.trainingFilterTitle
                  }
                >
                  Status
                </div>

                <div
                  className={
                    styles.trainingFilterOptions
                  }
                >
                  {statuses.map(status => (
                    <label
                      key={status}
                      className={
                        styles.trainingFilterOption
                      }
                    >
                      <Checkbox
                        size='small'
                        checked={selectedStatuses.includes(
                          status
                        )}
                        onChange={() =>
                          toggleValue(
                            status,
                            selectedStatuses,
                            setSelectedStatuses
                          )
                        }
                      />

                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Method */}
              <div
                className={
                  styles.trainingFilterSection
                }
              >
                <div
                  className={
                    styles.trainingFilterTitle
                  }
                >
                  Metode
                </div>

                <div
                  className={
                    styles.trainingFilterOptions
                  }
                >
                  {modes.map(mode => (
                    <label
                      key={mode}
                      className={
                        styles.trainingFilterOption
                      }
                    >
                      <Checkbox
                        size='small'
                        checked={selectedModes.includes(
                          mode
                        )}
                        onChange={() =>
                          toggleValue(
                            mode,
                            selectedModes,
                            setSelectedModes
                          )
                        }
                      />

                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div
                className={
                  styles.trainingFilterSection
                }
              >
                <div
                  className={
                    styles.trainingFilterTitle
                  }
                >
                  Tingkat
                </div>

                <div
                  className={
                    styles.trainingFilterOptions
                  }
                >
                  {levels.map(level => (
                    <label
                      key={level}
                      className={
                        styles.trainingFilterOption
                      }
                    >
                      <Checkbox
                        size='small'
                        checked={selectedLevels.includes(
                          level
                        )}
                        onChange={() =>
                          toggleValue(
                            level,
                            selectedLevels,
                            setSelectedLevels
                          )
                        }
                      />

                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div
                className={
                  styles.trainingFilterSection
                }
              >
                <div
                  className={
                    styles.trainingFilterTitle
                  }
                >
                  Durasi
                </div>

                <div
                  className={
                    styles.trainingFilterOptions
                  }
                >
                  {durations.map(item => (
                    <label
                      key={item}
                      className={
                        styles.trainingFilterOption
                      }
                    >
                      <Radio
                        size='small'
                        checked={duration === item}
                        onChange={() =>
                          setDuration(item)
                        }
                      />

                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certificate */}
              <div
                className={`${styles.trainingFilterSection} ${styles.trainingFilterLast}`}
              >
                <label
                  className={
                    styles.trainingFilterOption
                  }
                >
                  <Checkbox
                    size='small'
                    checked={certificateOnly}
                    onChange={event =>
                      setCertificateOnly(
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    <strong>Sertifikat</strong>
                    <small>
                      Tersedia
                    </small>
                  </span>
                </label>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <button
                  type='button'
                  onClick={resetFilters}
                  className={
                    styles.trainingFilterReset
                  }
                >
                  <i className='tabler-refresh text-[14px]' />
                  Reset semua filter
                </button>
              )}
            </div>
          </aside>

          {/* ============================================================
              RESULTS
          ============================================================ */}
          <main className='min-w-0 flex-1'>
            {/* Toolbar */}
            <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
              <div>
                <Typography
                  variant='h5'
                  className='font-semibold'
                >
                  {search
                    ? `Hasil untuk "${search}"`
                    : 'Semua Pelatihan'}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='mt-1'
                >
                  {filteredTrainings.length} program
                  tersedia
                </Typography>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={
                    <i className='tabler-adjustments-horizontal' />
                  }
                  className='lg:hidden'
                >
                  Filter
                </Button>

                <Button
                  variant='outlined'
                  size='small'
                  startIcon={
                    <i className='tabler-arrows-sort' />
                  }
                >
                  Terbaru
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className='mb-5 flex flex-wrap items-center gap-2'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Filter:
                </Typography>

                {[
                  ...selectedCategories,
                  ...selectedModes,
                  ...selectedLevels,
                  ...selectedStatuses,
                  ...(duration ? [duration] : []),
                  ...(certificateOnly
                    ? ['Bersertifikat']
                    : [])
                ].map(filter => (
                  <Chip
                    key={filter}
                    label={filter}
                    size='small'
                    color='primary'
                    variant='tonal'
                    onDelete={() => {
                      if (
                        selectedCategories.includes(
                          filter
                        )
                      ) {
                        toggleValue(
                          filter,
                          selectedCategories,
                          setSelectedCategories
                        )
                      }

                      if (
                        selectedModes.includes(
                          filter
                        )
                      ) {
                        toggleValue(
                          filter,
                          selectedModes,
                          setSelectedModes
                        )
                      }

                      if (
                        selectedLevels.includes(
                          filter
                        )
                      ) {
                        toggleValue(
                          filter,
                          selectedLevels,
                          setSelectedLevels
                        )
                      }

                      if (
                        selectedStatuses.includes(
                          filter
                        )
                      ) {
                        toggleValue(
                          filter,
                          selectedStatuses,
                          setSelectedStatuses
                        )
                      }

                      if (duration === filter) {
                        setDuration('')
                      }

                      if (
                        filter === 'Bersertifikat'
                      ) {
                        setCertificateOnly(false)
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {filteredTrainings.length === 0 ? (
              <Card
                elevation={0}
                className='rounded-[16px] border border-divider'
              >
                <div className='flex flex-col items-center justify-center px-6 py-16 text-center'>
                  <div className='flex items-center justify-center bs-[64px] is-[64px] rounded-[16px] bg-primary/5 text-primary'>
                    <i className='tabler-search-off text-[28px]' />
                  </div>

                  <Typography
                    variant='h6'
                    className='mt-4 font-semibold'
                  >
                    Pelatihan tidak ditemukan
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className='mt-1 max-is-[420px]'
                  >
                    Coba ubah kata kunci atau
                    sesuaikan filter untuk menemukan
                    program pelatihan lainnya.
                  </Typography>

                  <Button
                    variant='outlined'
                    className='mt-5'
                    onClick={resetFilters}
                  >
                    Reset Filter
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Training Grid */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {visibleTrainings.map(
                    training => {
                      const remaining =
                        training.quota -
                        training.registered

                      const percentage = Math.min(
                        Math.round(
                          (training.registered /
                            training.quota) *
                          100
                        ),
                        100
                      )

                      return (
                        <Card
                          key={training.id}
                          elevation={0}
                          className='group flex h-full flex-col overflow-hidden rounded-[16px] border border-divider transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]'
                        >
                          {/* Image */}
                          <div className='relative bs-[190px] overflow-hidden bg-backgroundDefault'>
                            {training.image ? (
                              <img
                                src={training.image}
                                alt={
                                  training.title
                                }
                                className='block bs-full is-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                              />
                            ) : (
                              <div className='relative flex bs-full is-full items-center justify-center bg-primary/5'>
                                <div className='absolute -start-12 -top-12 bs-[180px] is-[180px] rounded-full bg-primary/10' />

                                <div className='absolute -end-12 -bottom-20 bs-[180px] is-[180px] rounded-full bg-primary/5' />

                                <div className='relative flex bs-[60px] is-[60px] items-center justify-center rounded-[15px] bg-backgroundPaper text-primary shadow-sm'>
                                  <i className='tabler-book-2 text-[27px]' />
                                </div>
                              </div>
                            )}

                            <div className='absolute inset-x-0 top-0 flex items-center justify-between p-3'>
                              <Chip
                                label={
                                  training.category
                                }
                                size='small'
                                color='primary'
                                variant='filled'
                              />

                              <Chip
                                label={
                                  training.status
                                }
                                size='small'
                                color={
                                  training.status ===
                                  'Pendaftaran Dibuka'
                                    ? 'success'
                                    : 'warning'
                                }
                                variant='filled'
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <CardContent className='flex flex-1 flex-col p-5'>
                            {/* Meta */}
                            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                              <span className='flex items-center gap-1.5 text-[11px] text-textSecondary'>
                                <i className='tabler-calendar-event text-[15px]' />
                                {training.date}
                              </span>

                              <span className='flex items-center gap-1.5 text-[11px] text-textSecondary'>
                                <i className='tabler-clock text-[15px]' />
                                {training.time}
                              </span>
                            </div>

                            {/* Title */}
                            <Typography
                              variant='h6'
                              className='mt-3 line-clamp-2 min-bs-[50px] font-semibold leading-[24px]'
                            >
                              {
                                training.title
                              }
                            </Typography>

                            {/* Description */}
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              className='mt-2 line-clamp-2 min-bs-[40px] leading-[20px]'
                            >
                              {
                                training.description
                              }
                            </Typography>

                            {/* Information */}
                            <div className='mt-4 grid grid-cols-2 gap-2'>
                              <div className='rounded-[9px] bg-backgroundDefault px-3 py-2.5'>
                                <div className='flex items-center gap-1.5'>
                                  <i className='tabler-map-pin text-[15px] text-primary' />

                                  <span className='text-[10px] text-textSecondary'>
                                    Lokasi
                                  </span>
                                </div>

                                <p className='mt-1 truncate text-[11px] font-medium'>
                                  {
                                    training.location
                                  }
                                </p>
                              </div>

                              <div className='rounded-[9px] bg-backgroundDefault px-3 py-2.5'>
                                <div className='flex items-center gap-1.5'>
                                  <i className='tabler-video text-[15px] text-primary' />

                                  <span className='text-[10px] text-textSecondary'>
                                    Metode
                                  </span>
                                </div>

                                <p className='mt-1 text-[11px] font-medium'>
                                  {
                                    training.mode
                                  }
                                </p>
                              </div>

                              <div className='rounded-[9px] bg-backgroundDefault px-3 py-2.5'>
                                <div className='flex items-center gap-1.5'>
                                  <i className='tabler-hourglass text-[15px] text-primary' />

                                  <span className='text-[10px] text-textSecondary'>
                                    Durasi
                                  </span>
                                </div>

                                <p className='mt-1 text-[11px] font-medium'>
                                  {
                                    training.duration
                                  }
                                </p>
                              </div>

                              <div className='rounded-[9px] bg-backgroundDefault px-3 py-2.5'>
                                <div className='flex items-center gap-1.5'>
                                  <i className='tabler-chart-bar text-[15px] text-primary' />

                                  <span className='text-[10px] text-textSecondary'>
                                    Tingkat
                                  </span>
                                </div>

                                <p className='mt-1 text-[11px] font-medium'>
                                  {
                                    training.level
                                  }
                                </p>
                              </div>
                            </div>

                            {/* Trainer */}
                            <div className='mt-4 flex items-center gap-2.5'>
                              <Avatar
                                className='bs-[34px] is-[34px]'
                                sx={{
                                  bgcolor:
                                    'primary.main',
                                  color:
                                    'primary.contrastText'
                                }}
                              >
                                <i className='tabler-user text-[17px]' />
                              </Avatar>

                              <div className='min-is-0 flex-1'>
                                <p className='truncate text-[12px] font-semibold'>
                                  {
                                    training.trainer
                                  }
                                </p>

                                <p className='truncate text-[10px] text-textSecondary'>
                                  {
                                    training.trainerRole
                                  }
                                </p>
                              </div>

                              {training.certificate && (
                                <Chip
                                  icon={
                                    <i className='tabler-certificate text-[14px]' />
                                  }
                                  label='Sertifikat'
                                  size='small'
                                  color='success'
                                  variant='tonal'
                                  className='shrink-0'
                                />
                              )}
                            </div>

                            {/* Quota */}
                            <div className='mt-4'>
                              <div className='mb-1.5 flex items-center justify-between'>
                                <span className='text-[10px] text-textSecondary'>
                                  Kuota peserta
                                </span>

                                <span className='text-[10px] font-medium'>
                                  {
                                    training.registered
                                  }
                                  /
                                  {
                                    training.quota
                                  }
                                </span>
                              </div>

                              <div className='bs-[5px] overflow-hidden rounded-full bg-actionHover'>
                                <div
                                  className='bs-full rounded-full bg-primary transition-all'
                                  style={{
                                    width: `${percentage}%`
                                  }}
                                />
                              </div>

                              <p className='mt-1 text-[10px] text-textDisabled'>
                                {remaining >
                                0
                                  ? `${remaining} slot tersisa`
                                  : 'Kuota penuh'}
                              </p>
                            </div>

                            {/* Organizer */}
                            <div className='mt-4 flex items-center gap-2 border-bs border-divider pt-3'>
                              <i className='tabler-building-community text-[17px] text-textSecondary' />

                              <span className='truncate text-[10px] text-textSecondary'>
                                {
                                  training.organizer
                                }
                              </span>
                            </div>

                            {/* Actions */}
                            <div className='mt-5 grid grid-cols-[1fr_1.2fr] gap-2'>
                              <Button
                                component={
                                  Link
                                }
                                href={`/trainings/${training.slug}`}
                                variant='outlined'
                                color='primary'
                                size='small'
                                endIcon={
                                  <i className='tabler-arrow-up-right' />
                                }
                              >
                                Detail
                              </Button>

                              <Button
                                component={
                                  Link
                                }
                                href={`/trainings/${training.slug}/register`}
                                variant='contained'
                                color='primary'
                                size='small'
                                disabled={
                                  training.status !==
                                  'Pendaftaran Dibuka'
                                }
                                startIcon={
                                  <i className='tabler-user-plus' />
                                }
                              >
                                {training.status ===
                                'Pendaftaran Dibuka'
                                  ? 'Daftar Pelatihan'
                                  : 'Segera Dibuka'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    }
                  )}
                </div>

                {/* Lazy Loading */}
                {hasMore && (
                  <div
                    ref={loadMoreRef}
                    className='py-10'
                  >
                    {loadingMore ? (
                      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {[1, 2].map(
                          item => (
                            <Card
                              key={item}
                              elevation={0}
                              className='overflow-hidden rounded-[16px] border border-divider'
                            >
                              <Skeleton
                                variant='rectangular'
                                className='bs-[190px]'
                              />

                              <div className='flex flex-col gap-3 p-5'>
                                <Skeleton width='35%' />
                                <Skeleton width='85%' />
                                <Skeleton width='100%' />
                                <Skeleton width='90%' />

                                <Skeleton
                                  variant='rounded'
                                  height={70}
                                />

                                <Skeleton
                                  width='100%'
                                  height={36}
                                />
                              </div>
                            </Card>
                          )
                        )}
                      </div>
                    ) : (
                      <div className='flex justify-center'>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                        >
                          Memuat pelatihan
                          lainnya...
                        </Typography>
                      </div>
                    )}
                  </div>
                )}

                {!hasMore && (
                  <div className='flex justify-center py-12'>
                    <div className='text-center'>
                      <div className='mx-auto flex items-center justify-center bs-[40px] is-[40px] rounded-full bg-actionHover text-textSecondary'>
                        <i className='tabler-check text-[20px]' />
                      </div>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        className='mt-2'
                      >
                        Semua pelatihan
                        telah ditampilkan.
                      </Typography>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>
    </div>
  )
}

export default TrainingsPage

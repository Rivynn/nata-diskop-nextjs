// React Imports
import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import LinearProgress from '@mui/material/LinearProgress'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'

// Type Imports
import type { TrainingRecord, TrainingStatus } from '@/app/server/actions'
import type { ThemeColor } from '@core/types'

type Props = {
  trainingData?: TrainingRecord[]
  searchValue: string
}

const PAGE_SIZE = 6

const statusConfig: Record<
  TrainingStatus,
  { label: string; color: ThemeColor }
> = {
  draft: { label: 'Draft', color: 'secondary' },
  published: { label: 'Dipublikasikan', color: 'success' },
  ongoing: { label: 'Berlangsung', color: 'info' },
  completed: { label: 'Selesai', color: 'warning' },
  cancelled: { label: 'Dibatalkan', color: 'error' }
}

const categoryColors: Record<string, ThemeColor> = {
  Digitalisasi: 'primary',
  'Teknologi Informasi': 'info',
  'Kesiapan Kerja': 'success',
  'Industri dan Teknologi': 'warning',
  Manajemen: 'secondary',
  Kewirausahaan: 'error'
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Belum ditentukan'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Belum ditentukan'

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getInitials = (name?: string | null) => {
  if (!name?.trim()) return '?'

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

const Trainings = ({ trainingData = [], searchValue }: Props) => {
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [registrationFilter, setRegistrationFilter] = useState('All')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [failedCovers, setFailedCovers] = useState<string[]>([])
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [selectedTraining, setSelectedTraining] =
    useState<TrainingRecord | null>(null)

  const categories = useMemo(
    () => [
      ...new Set(
        trainingData
          .map(item => item.category)
          .filter((value): value is string => Boolean(value))
      )
    ],
    [trainingData]
  )

  const getRegistrationStatus = (item: TrainingRecord) => {
    const registration = item.registration
    const now = Date.now()
    const opensAt = registration?.openAt
      ? new Date(registration.openAt).getTime()
      : null
    const closesAt = registration?.closeAt
      ? new Date(registration.closeAt).getTime()
      : null
    const quota = registration?.quota ?? 0
    const registered = registration?.registered ?? 0

    if (item.status === 'draft') {
      return { label: 'Belum Dipublikasikan', color: 'secondary' as const }
    }

    if (item.status === 'cancelled') {
      return { label: 'Dibatalkan', color: 'error' as const }
    }

    if (item.status === 'completed') {
      return { label: 'Pendaftaran Berakhir', color: 'secondary' as const }
    }

    if (item.status === 'ongoing') {
      return { label: 'Pelatihan Berjalan', color: 'info' as const }
    }

    if (registration?.isOpen === false) {
      return { label: 'Pendaftaran Ditutup', color: 'warning' as const }
    }

    if (opensAt !== null && !Number.isNaN(opensAt) && now < opensAt) {
      return { label: 'Belum Dibuka', color: 'secondary' as const }
    }

    if (closesAt !== null && !Number.isNaN(closesAt) && now > closesAt) {
      return { label: 'Pendaftaran Ditutup', color: 'warning' as const }
    }

    if (quota > 0 && registered >= quota) {
      return { label: 'Kuota Penuh', color: 'error' as const }
    }

    return { label: 'Pendaftaran Dibuka', color: 'success' as const }
  }

  const filteredTrainings = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return trainingData.filter(item => {
      const speakers = item.speakers ?? []
      const skills = item.skills ?? []

      const matchesSearch =
        !query ||
        (item.title ?? '').toLowerCase().includes(query) ||
        (item.code ?? '').toLowerCase().includes(query) ||
        (item.category ?? '').toLowerCase().includes(query) ||
        (item.shortDescription ?? '').toLowerCase().includes(query) ||
        speakers.some(speaker =>
          (speaker.name ?? '').toLowerCase().includes(query)
        ) ||
        skills.some(skill => skill.toLowerCase().includes(query)) ||
        (item.partner?.companyName ?? '').toLowerCase().includes(query)

      const matchesCategory =
        category === 'All' || item.category === category

      const matchesStatus = status === 'All' || item.status === status

      const matchesCompletion =
        !hideCompleted || item.status !== 'completed'

      const matchesFeatured = !featuredOnly || item.featured

      const registrationStatus = getRegistrationStatus(item)

      const matchesRegistration =
        registrationFilter === 'All' ||
        (registrationFilter === 'open' &&
          registrationStatus.label === 'Pendaftaran Dibuka') ||
        (registrationFilter === 'closed' &&
          ['Pendaftaran Ditutup', 'Pendaftaran Berakhir'].includes(
            registrationStatus.label
          )) ||
        (registrationFilter === 'upcoming' &&
          registrationStatus.label === 'Belum Dibuka') ||
        (registrationFilter === 'full' &&
          registrationStatus.label === 'Kuota Penuh')

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesCompletion &&
        matchesFeatured &&
        matchesRegistration
      )
    })
  }, [
    trainingData,
    searchValue,
    category,
    status,
    registrationFilter,
    hideCompleted,
    featuredOnly
  ])

  const pageCount = Math.max(
    1,
    Math.ceil(filteredTrainings.length / PAGE_SIZE)
  )

  useEffect(() => {
    setActivePage(1)
  }, [
    searchValue,
    category,
    status,
    registrationFilter,
    hideCompleted,
    featuredOnly
  ])

  useEffect(() => {
    if (activePage > pageCount) {
      setActivePage(pageCount)
    }
  }, [activePage, pageCount])

  const paginatedTrainings = filteredTrainings.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE
  )

  const openActionMenu = (
    event: MouseEvent<HTMLElement>,
    item: TrainingRecord
  ) => {
    setMenuAnchor(event.currentTarget)
    setSelectedTraining(item)
  }

  const closeActionMenu = () => {
    setMenuAnchor(null)
    setSelectedTraining(null)
  }

  const markCoverFailed = (id: string) => {
    setFailedCovers(previous =>
      previous.includes(id) ? previous : [...previous, id]
    )
  }

  const resetFilters = () => {
    setCategory('All')
    setStatus('All')
    setRegistrationFilter('All')
    setHideCompleted(false)
    setFeaturedOnly(false)
  }

  return (
    <div className='flex flex-col gap-5'>
      {/* Filters */}
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <Typography variant='h6'>Filter Pelatihan</Typography>

            <Button
              variant='text'
              color='secondary'
              size='small'
              startIcon={<i className='tabler-filter-off' />}
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>

          <Grid container spacing={3} alignItems='center'>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth size='small'>
                <Select
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Filter kategori' }}
                >
                  <MenuItem value='All'>Semua kategori</MenuItem>
                  {categories.map(value => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth size='small'>
                <Select
                  value={status}
                  onChange={event => setStatus(event.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Filter status program' }}
                >
                  <MenuItem value='All'>Semua status program</MenuItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <MenuItem key={value} value={value}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <FormControl fullWidth size='small'>
                <Select
                  value={registrationFilter}
                  onChange={event => setRegistrationFilter(event.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Filter pendaftaran' }}
                >
                  <MenuItem value='All'>Semua status pendaftaran</MenuItem>
                  <MenuItem value='open'>Pendaftaran dibuka</MenuItem>
                  <MenuItem value='upcoming'>Belum dibuka</MenuItem>
                  <MenuItem value='closed'>Pendaftaran ditutup</MenuItem>
                  <MenuItem value='full'>Kuota penuh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider />

          <div className='flex flex-wrap items-center gap-x-5 gap-y-1'>
            <FormControlLabel
              control={
                <Switch
                  size='small'
                  checked={featuredOnly}
                  onChange={event => setFeaturedOnly(event.target.checked)}
                />
              }
              label='Unggulan saja'
            />

            <FormControlLabel
              control={
                <Switch
                  size='small'
                  checked={hideCompleted}
                  onChange={event => setHideCompleted(event.target.checked)}
                />
              }
              label='Sembunyikan pelatihan selesai'
            />
          </div>
        </CardContent>
      </Card>

      {/* Training cards */}
      {paginatedTrainings.length > 0 ? (
        <Grid container spacing={4}>
          {paginatedTrainings.map(item => {
            const registration = getRegistrationStatus(item)
            const statusInfo = statusConfig[item.status]
            const categoryColor = categoryColors[item.category] ?? 'primary'
            const quota = item.registration?.quota ?? 0
            const registered = item.registration?.registered ?? 0
            const occupancy =
              quota > 0 ? Math.min((registered / quota) * 100, 100) : 0
            const speakers = item.speakers ?? []
            const skills = item.skills ?? []
            const firstSpeaker = speakers[0]
            const requirements = item.target?.requirements ?? []
            const hasCover =
              Boolean(item.cover) && !failedCovers.includes(item.id)

            const speakerWithRating = firstSpeaker as
              | (NonNullable<typeof firstSpeaker> & {
              rating?: number | null
              reviewCount?: number | null
            })
              | undefined

            const speakerRating = speakerWithRating?.rating
            const speakerReviewCount = speakerWithRating?.reviewCount

            return (
              <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={item.id}>
                <Card className='flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg'>
                  <div className='relative aspect-[16/9] overflow-hidden'>
                    <Link
                      href={`/admin/trainings/${item.id}`}
                      className='absolute inset-0 block'
                    >
                      {hasCover ? (
                        <img
                          src={item.cover!}
                          alt={item.title || 'Cover pelatihan'}
                          className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
                          onError={() => markCoverFailed(item.id)}
                        />
                      ) : (
                        <div className='relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--mui-palette-primary-lightOpacity),var(--mui-palette-info-lightOpacity),var(--mui-palette-background-paper))]'>
                          <div className='absolute -end-10 -top-12 bs-48 is-48 rounded-full border-[20px] border-primary/10' />
                          <div className='absolute -bottom-16 -start-8 bs-44 is-44 rounded-full bg-info/10' />

                          <div className='relative z-[1] flex flex-col items-center gap-2 text-center'>
                            <Avatar
                              variant='rounded'
                              className='bs-14 is-14'
                              sx={{
                                bgcolor: 'var(--mui-palette-background-paper)',
                                color: 'var(--mui-palette-primary-main)',
                                boxShadow: 2
                              }}
                            >
                              <i className='tabler-school text-3xl' />
                            </Avatar>
                            <Typography variant='caption' fontWeight={700}>
                              {item.category || 'Program Pelatihan'}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {item.code || 'PROGRAM DISKOP'}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </Link>

                    <div className='absolute start-3 top-3 flex flex-wrap gap-2'>
                      <Chip
                        size='small'
                        label={statusInfo?.label ?? 'Status tidak tersedia'}
                        color={statusInfo?.color ?? 'secondary'}
                        sx={{ boxShadow: 1 }}
                      />

                      {item.featured && (
                        <Chip
                          size='small'
                          icon={<i className='tabler-star-filled' />}
                          label='Unggulan'
                          sx={{
                            bgcolor: '#fff3cd',
                            color: '#946200',
                            '& .MuiChip-icon': { color: '#d69e00' }
                          }}
                        />
                      )}
                    </div>

                    <div className='absolute end-3 top-3'>
                      <Tooltip title='Aksi admin'>
                        <IconButton
                          size='small'
                          aria-label={`Aksi ${item.title}`}
                          onClick={event => openActionMenu(event, item)}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.95)',
                            color: '#374151',
                            boxShadow: 1,
                            '&:hover': { bgcolor: '#fff' }
                          }}
                        >
                          <i className='tabler-dots-vertical' />
                        </IconButton>
                      </Tooltip>
                    </div>

                    <div className='pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10'>
                      <Typography variant='caption' sx={{ color: '#fff' }}>
                        {item.code || 'Kode belum ditentukan'}
                      </Typography>
                      <Typography variant='body2' fontWeight={700} sx={{ color: '#fff' }}>
                        {item.schedule?.format === 'online'
                          ? 'Online'
                          : item.schedule?.format === 'hybrid'
                            ? 'Hybrid'
                            : 'Tatap Muka'}
                      </Typography>
                    </div>
                  </div>

                  <CardContent className='flex flex-1 flex-col gap-4'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={categoryColor}
                        label={item.category || 'Tanpa kategori'}
                      />
                      <Typography variant='caption' color='text.secondary'>
                        {item.level || 'Level belum ditentukan'}
                      </Typography>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Typography
                        variant='h6'
                        component={Link}
                        href={`/admin/trainings/${item.id}`}
                        className='line-clamp-2 hover:text-primary'
                      >
                        {item.title || 'Pelatihan tanpa judul'}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        className='line-clamp-3 min-h-[4.2rem]'
                      >
                        {item.shortDescription ||
                          'Deskripsi belum dilengkapi. Lengkapi informasi melalui menu edit.'}
                      </Typography>
                    </div>

                    {/* Schedule */}
                    <div className='flex items-start gap-3 rounded-lg bg-actionHover p-3'>
                      <Avatar
                        variant='rounded'
                        className='bs-9 is-9'
                        sx={{
                          bgcolor: 'var(--mui-palette-background-paper)',
                          color: 'var(--mui-palette-primary-main)'
                        }}
                      >
                        <i className='tabler-calendar-event text-lg' />
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <Typography variant='body2' fontWeight={600}>
                          Jadwal Pelatihan
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(item.schedule?.startDate)} –{' '}
                          {formatDate(item.schedule?.endDate)}
                        </Typography>
                      </div>
                    </div>

                    {/* Instructors */}
                    <div>
                      <Typography
                        variant='overline'
                        color='text.secondary'
                        className='mb-2 block'
                      >
                        PELATIH / NARASUMBER
                      </Typography>

                      {speakers.length > 0 ? (
                        <div className='flex items-center gap-3'>
                          <AvatarGroup
                            max={3}
                            sx={{
                              '& .MuiAvatar-root': {
                                width: 38,
                                height: 38,
                                fontSize: '0.8rem'
                              }
                            }}
                          >
                            {speakers.map(speaker => (
                              <Avatar
                                key={speaker.id}
                                src={speaker.avatar || undefined}
                                alt={speaker.name || 'Pelatih'}
                              >
                                {getInitials(speaker.name)}
                              </Avatar>
                            ))}
                          </AvatarGroup>

                          <div className='min-w-0 flex-1'>
                            <Typography
                              variant='body2'
                              fontWeight={600}
                              className='line-clamp-1'
                            >
                              {firstSpeaker?.name || 'Nama belum tersedia'}
                              {speakers.length > 1
                                ? ` +${speakers.length - 1}`
                                : ''}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              className='line-clamp-1'
                            >
                              {firstSpeaker?.position ||
                                firstSpeaker?.organization ||
                                'Profil pelatih belum dilengkapi'}
                            </Typography>

                            {typeof speakerRating === 'number' &&
                              speakerRating >= 0 &&
                              speakerRating <= 5 && (
                                <div className='mt-1 flex items-center gap-1'>
                                  <i className='tabler-star-filled text-warning' />
                                  <Typography variant='caption' fontWeight={600}>
                                    {speakerRating.toFixed(1)}
                                  </Typography>
                                  {typeof speakerReviewCount === 'number' &&
                                    speakerReviewCount > 0 && (
                                      <Typography variant='caption' color='text.secondary'>
                                        ({speakerReviewCount} ulasan)
                                      </Typography>
                                    )}
                                </div>
                              )}
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center gap-3 rounded-lg border border-dashed p-3'>
                          <Avatar className='bs-9 is-9'>
                            <i className='tabler-user-plus' />
                          </Avatar>
                          <div>
                            <Typography variant='body2' fontWeight={600}>
                              Pelatih belum ditentukan
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              Tambahkan pemateri melalui Edit Program
                            </Typography>
                          </div>
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* Registration */}
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex items-start gap-2'>
                          <i className='tabler-user-check mt-0.5 text-lg text-textSecondary' />
                          <div>
                            <Typography variant='body2' fontWeight={600}>
                              Pendaftaran Peserta
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {item.registration?.openAt
                                ? `${formatDate(item.registration.openAt)} – ${formatDate(item.registration.closeAt)}`
                                : 'Jadwal belum dilengkapi'}
                            </Typography>
                          </div>
                        </div>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={registration.color}
                          label={registration.label}
                        />
                      </div>

                      <div className='flex items-center justify-between gap-2'>
                        <Typography variant='caption' color='text.secondary'>
                          Kapasitas peserta
                        </Typography>
                        <Typography variant='body2' fontWeight={600}>
                          {registered} / {quota > 0 ? quota : '∞'}
                        </Typography>
                      </div>

                      <LinearProgress
                        variant='determinate'
                        value={occupancy}
                        color={occupancy >= 100 ? 'warning' : 'primary'}
                        className='bs-2'
                      />

                      <div className='flex flex-wrap gap-2'>
                        <Chip
                          size='small'
                          variant='outlined'
                          icon={<i className='tabler-clipboard-check' />}
                          label={
                            item.registration?.isOpen
                              ? 'Pendaftaran aktif'
                              : 'Pendaftaran nonaktif'
                          }
                        />
                        <Chip
                          size='small'
                          variant='outlined'
                          icon={<i className='tabler-users' />}
                          label={
                            item.registration?.waitingList
                              ? 'Waiting list tersedia'
                              : 'Tanpa waiting list'
                          }
                        />
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 flex items-center justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                          <i className='tabler-list-check text-lg text-textSecondary' />
                          <Typography variant='body2' fontWeight={600}>
                            Persyaratan Peserta
                          </Typography>
                        </div>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={requirements.length > 0 ? 'success' : 'warning'}
                          label={
                            requirements.length > 0
                              ? `${requirements.length} syarat`
                              : 'Belum diatur'
                          }
                        />
                      </div>

                      {requirements.length > 0 ? (
                        <div className='flex flex-col gap-2'>
                          {requirements.slice(0, 2).map((requirement, index) => (
                            <div
                              key={`${item.id}-requirement-${index}`}
                              className='flex items-start gap-2'
                            >
                              <i className='tabler-circle-check mt-0.5 text-sm text-success' />
                              <Typography variant='caption' color='text.secondary'>
                                {requirement}
                              </Typography>
                            </div>
                          ))}
                          {requirements.length > 2 && (
                            <Typography variant='caption' color='text.secondary'>
                              +{requirements.length - 2} persyaratan lainnya
                            </Typography>
                          )}
                        </div>
                      ) : (
                        <Typography variant='caption' color='text.secondary'>
                          Persyaratan belum diisi. Lengkapi sebelum publikasi.
                        </Typography>
                      )}
                    </div>

                    {/* Certificate and partner */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='rounded-lg border p-3'>
                        <div className='mb-2 flex items-center gap-2'>
                          <i className='tabler-certificate text-lg text-textSecondary' />
                          <Typography variant='caption' color='text.secondary'>
                            Sertifikat
                          </Typography>
                        </div>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={item.certificate?.available ? 'success' : 'warning'}
                          label={
                            item.certificate?.available
                              ? 'Disediakan'
                              : 'Belum diatur'
                          }
                        />
                      </div>

                      <div className='rounded-lg border p-3'>
                        <div className='mb-2 flex items-center gap-2'>
                          <i className='tabler-building-community text-lg text-textSecondary' />
                          <Typography variant='caption' color='text.secondary'>
                            Mitra
                          </Typography>
                        </div>
                        <Typography
                          variant='body2'
                          fontWeight={600}
                          className='line-clamp-2'
                        >
                          {item.partner?.isCollaborative
                            ? item.partner.companyName || 'Mitra belum diisi'
                            : 'Mandiri'}
                        </Typography>
                      </div>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className='flex flex-wrap gap-1.5'>
                        {skills.slice(0, 3).map(skill => (
                          <Chip
                            key={skill}
                            size='small'
                            variant='outlined'
                            label={skill}
                          />
                        ))}
                        {skills.length > 3 && (
                          <Tooltip title={skills.slice(3).join(', ')}>
                            <Chip
                              size='small'
                              variant='outlined'
                              label={`+${skills.length - 3}`}
                            />
                          </Tooltip>
                        )}
                      </div>
                    )}

                    {/* Card actions */}
                    <div className='mt-auto flex flex-col gap-2 pt-2'>
                      <Button
                        component={Link}
                        href={`/admin/trainings/${item.id}`}
                        fullWidth
                        variant='contained'
                        size='small'
                        startIcon={<i className='tabler-eye' />}
                        endIcon={<i className='tabler-arrow-up-right' />}
                      >
                        Detail Pelatihan
                      </Button>

                      <Button
                        component={Link}
                        href={`/admin/trainings/${item.id}/edit`}
                        fullWidth
                        variant='tonal'
                        size='small'
                        startIcon={<i className='tabler-edit' />}
                      >
                        Edit Program
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center gap-3 px-6 py-12 text-center'>
            <Avatar
              variant='rounded'
              className='bs-14 is-14'
              sx={{
                bgcolor: 'var(--mui-palette-primary-lightOpacity)',
                color: 'var(--mui-palette-primary-main)'
              }}
            >
              <i className='tabler-school-off text-3xl' />
            </Avatar>

            <Typography variant='h6'>
              {trainingData.length === 0
                ? 'Belum Ada Program Pelatihan'
                : 'Program Tidak Ditemukan'}
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              {trainingData.length === 0
                ? 'Program yang ditambahkan akan muncul di sini.'
                : 'Coba ubah filter atau reset untuk menampilkan seluruh program.'}
            </Typography>

            {trainingData.length > 0 && (
              <Button
                variant='tonal'
                size='small'
                onClick={resetFilters}
                startIcon={<i className='tabler-filter-off' />}
              >
                Reset filter
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination in its own white card */}
      <Card>
        <CardContent className='flex flex-wrap items-center justify-between gap-4'>
          <Typography variant='body2' color='text.secondary'>
            Menampilkan{' '}
            {filteredTrainings.length === 0
              ? 0
              : (activePage - 1) * PAGE_SIZE + 1}
            {' '}–{Math.min(activePage * PAGE_SIZE, filteredTrainings.length)}
            {' '}dari {filteredTrainings.length} pelatihan
          </Typography>

          <Pagination
            count={pageCount}
            page={activePage}
            onChange={(_, page) => setActivePage(page)}
            showFirstButton
            showLastButton
            shape='rounded'
            variant='tonal'
            color='primary'
            siblingCount={1}
            boundaryCount={1}
          />
        </CardContent>
      </Card>

      {/* Admin actions menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeActionMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          component={Link}
          href={
            selectedTraining
              ? `/admin/trainings/${selectedTraining.id}/edit`
              : '/admin/trainings'
          }
          onClick={closeActionMenu}
        >
          <ListItemIcon>
            <i className='tabler-edit text-lg' />
          </ListItemIcon>
          <ListItemText primary='Edit program' />
        </MenuItem>

        <MenuItem
          component={Link}
          href={
            selectedTraining
              ? `/admin/trainings/${selectedTraining.id}/participants/create`
              : '/admin/trainings'
          }
          onClick={closeActionMenu}
        >
          <ListItemIcon>
            <i className='tabler-user-plus text-lg' />
          </ListItemIcon>
          <ListItemText
            primary='Tambah peserta manual'
            secondary='Daftarkan peserta melalui admin'
          />
        </MenuItem>

        <MenuItem
          component={Link}
          href={
            selectedTraining
              ? `/admin/trainings/${selectedTraining.id}`
              : '/admin/trainings'
          }
          onClick={closeActionMenu}
        >
          <ListItemIcon>
            <i className='tabler-users text-lg' />
          </ListItemIcon>
          <ListItemText primary='Kelola peserta & absensi' />
        </MenuItem>

        <MenuItem
          component={Link}
          href={
            selectedTraining
              ? `/admin/trainings/${selectedTraining.id}`
              : '/admin/trainings'
          }
          onClick={closeActionMenu}
        >
          <ListItemIcon>
            <i className='tabler-certificate text-lg' />
          </ListItemIcon>
          <ListItemText primary='Progres & sertifikat' />
        </MenuItem>

        <Divider />

        <MenuItem
          component={Link}
          href={
            selectedTraining
              ? `/admin/trainings/${selectedTraining.id}/edit`
              : '/admin/trainings'
          }
          onClick={closeActionMenu}
        >
          <ListItemIcon>
            <i className='tabler-settings text-lg' />
          </ListItemIcon>
          <ListItemText
            primary='Pengaturan publikasi'
            secondary='Status, unggulan, dan pendaftaran'
          />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Trainings

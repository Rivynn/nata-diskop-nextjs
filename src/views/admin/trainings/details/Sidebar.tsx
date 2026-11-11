'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import type { TrainingRecord } from '@/types/admin/trainingTypes'
import {
  trainingFormatLabels,
  trainingLevelLabels,
  trainingStatusLabels,
  getTrainingEnrollmentSummary,
  getTrainingRegistrationStatus
} from '@/types/admin/trainingTypes'

type SidebarProps = {
  data: TrainingRecord
}

type SpeakerRating = {
  rating?: number | null
  reviewCount?: number | null
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Belum ditentukan'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Belum ditentukan'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const SectionHeading = ({
                          icon,
                          title,
                          trailing
                        }: {
  icon: string
  title: string
  trailing?: ReactNode
}) => (
  <div className='flex items-center justify-between gap-3'>
    <div className='flex min-w-0 items-center gap-2.5'>
      <i className={`${icon} text-xl text-primary`} />
      <Typography variant='subtitle1' className='font-semibold'>
        {title}
      </Typography>
    </div>

    {trailing}
  </div>
)

const DetailRow = ({
                     icon,
                     label,
                     children
                   }: {
  icon: string
  label: string
  children: ReactNode
}) => (
  <div className='flex items-start gap-3'>
    <i className={`${icon} mt-0.5 text-lg text-textSecondary`} />

    <div className='flex min-w-0 flex-1 flex-col gap-1'>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>

      <div className='text-sm font-medium'>{children}</div>
    </div>
  </div>
)

const RatingStars = ({
                       rating,
                       reviewCount
                     }: {
  rating?: number | null
  reviewCount?: number | null
}) => {
  if (rating == null) {
    return (
      <Typography variant='caption' color='text.secondary'>
        Belum ada rating
      </Typography>
    )
  }

  const safeRating = Math.max(0, Math.min(5, rating))

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      <div className='flex items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map(star => (
          <i
            key={star}
            className={`tabler-star text-sm ${
              star <= Math.round(safeRating)
                ? 'text-warning'
                : 'text-textDisabled'
            }`}
          />
        ))}
      </div>

      <Typography variant='caption' className='font-semibold'>
        {safeRating.toFixed(1)}
      </Typography>

      {reviewCount != null && (
        <Typography variant='caption' color='text.secondary'>
          {reviewCount.toLocaleString('id-ID')} ulasan
        </Typography>
      )}
    </div>
  )
}

const Sidebar = ({ data }: SidebarProps) => {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug ?? data.slug

  const enrollment = useMemo(
    () => getTrainingEnrollmentSummary(data),
    [data]
  )

  const registrationStatus = useMemo(
    () => getTrainingRegistrationStatus(data),
    [data]
  )

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [publicationStatus, setPublicationStatus] = useState(data.status)
  const [registrationOpen, setRegistrationOpen] = useState(
    data.registration.isOpen
  )

  const menuOpen = Boolean(menuAnchor)
  const schedule = data.schedule
  const partner = data.partner
  const certificate = data.certificate
  const speakers = data.speakers ?? []
  const skills = data.skills ?? []
  const outcomes = data.outcomes ?? []

  const progress =
    enrollment.quota > 0
      ? Math.min((enrollment.registered / enrollment.quota) * 100, 100)
      : 0

  const remaining = Math.max(
    enrollment.quota - enrollment.registered,
    0
  )

  const publicationLabel =
    trainingStatusLabels[publicationStatus] ?? publicationStatus

  const closeMenu = () => setMenuAnchor(null)

  const editTraining = () => {
    closeMenu()
    router.push(`/admin/trainings/${slug}/edit`)
  }

  const navigateTo = (path: string) => {
    closeMenu()
    router.push(path)
  }

  return (
    <aside className='flex min-w-0 flex-col'>
      <div className='overflow-hidden rounded-xl border border-divider bg-background shadow-sm'>
        {/* Cover */}
        <div className='relative h-52 overflow-hidden bg-actionHover'>
          {data.cover ? (
            <img
              src={data.cover}
              alt={data.title}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full items-center justify-center bg-primaryLight'>
              <i className='tabler-school text-6xl text-primary' />
            </div>
          )}

          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10' />

          <div className='absolute left-4 top-4'>
            <Chip
              size='small'
              label={publicationLabel}
              color={publicationStatus === 'published' ? 'success' : 'default'}
              className='bg-background/95'
            />
          </div>

          <div className='absolute inset-x-4 bottom-4'>
            <Typography
              variant='caption'
              className='font-semibold uppercase tracking-wider text-white/80'
            >
              {data.category}
            </Typography>

            <Typography variant='h5' className='mt-1 font-bold text-white'>
              {data.title}
            </Typography>

            <Typography variant='body2' className='mt-1 text-white/80'>
              {data.code}
            </Typography>
          </div>
        </div>

        <div className='flex flex-col gap-5 p-5'>
          {/* Description */}
          <Typography variant='body2' color='text.secondary'>
            {data.shortDescription ||
              data.description ||
              'Deskripsi pelatihan belum tersedia.'}
          </Typography>

          <div className='flex flex-wrap gap-2'>
            <Chip
              size='small'
              variant='tonal'
              icon={<i className='tabler-signal' />}
              label={trainingLevelLabels[data.level] ?? data.level}
            />

            <Chip
              size='small'
              variant='tonal'
              icon={<i className='tabler-device-laptop' />}
              label={trainingFormatLabels[schedule.format] ?? schedule.format}
            />

            <Chip
              size='small'
              variant='tonal'
              icon={<i className='tabler-certificate' />}
              label={certificate.available ? 'Bersertifikat' : 'Tanpa sertifikat'}
            />
          </div>

          <Divider />

          {/* Registration */}
          <div className='flex flex-col gap-3'>
            <SectionHeading
              icon='tabler-users'
              title='Pendaftaran'
              trailing={
                <Chip
                  size='small'
                  variant='tonal'
                  color={
                    registrationOpen
                      ? registrationStatus.color ?? 'success'
                      : 'default'
                  }
                  label={registrationOpen ? 'Dibuka' : 'Ditutup'}
                />
              }
            />

            <div className='flex items-end justify-between gap-3'>
              <div>
                <Typography variant='h4' className='font-bold leading-tight'>
                  {enrollment.registered}
                  <Typography component='span' variant='body1' color='text.secondary'>
                    {' '}/ {enrollment.quota || '∞'}
                  </Typography>
                </Typography>

                <Typography variant='caption' color='text.secondary'>
                  Peserta terdaftar
                </Typography>
              </div>

              <Typography variant='body2' className='font-semibold text-primary'>
                {Math.round(progress)}%
              </Typography>
            </div>

            <LinearProgress
              variant='determinate'
              value={progress}
              color={progress >= 100 ? 'warning' : 'primary'}
              className='bs-2 rounded-full'
            />

            <div className='flex items-center justify-between gap-2'>
              <Typography variant='caption' color='text.secondary'>
                {enrollment.quota > 0
                  ? `${remaining} kuota tersisa`
                  : 'Kuota tidak dibatasi'}
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                {data.registration.waitingList} daftar tunggu
              </Typography>
            </div>

            {data.registration.closeAt && (
              <DetailRow icon='tabler-calendar-time' label='Batas pendaftaran'>
                {formatDate(data.registration.closeAt)}
              </DetailRow>
            )}
          </div>

          <Divider />

          {/* Schedule without fixed duration */}
          <div className='flex flex-col gap-4'>
            <SectionHeading
              icon='tabler-calendar-event'
              title='Periode & Jadwal'
            />

            <DetailRow icon='tabler-calendar' label='Periode pelatihan'>
              {formatDate(schedule.startDate)}
              <span className='mx-1 text-textSecondary'>—</span>
              {formatDate(schedule.endDate)}
            </DetailRow>

            <DetailRow icon='tabler-clock' label='Jam pelaksanaan'>
              {schedule.startTime || 'Belum ditentukan'}
              {' – '}
              {schedule.endTime || 'Belum ditentukan'}
              {schedule.timezone ? ` ${schedule.timezone}` : ''}
            </DetailRow>

            <DetailRow icon='tabler-map-pin' label='Lokasi'>
              {schedule.venue || 'Belum ditentukan'}

              {schedule.address && (
                <Typography
                  component='span'
                  display='block'
                  variant='body2'
                  color='text.secondary'
                  className='mt-1'
                >
                  {schedule.address}
                </Typography>
              )}

              {schedule.meetingUrl && (
                <Typography
                  component='a'
                  href={schedule.meetingUrl}
                  target='_blank'
                  rel='noreferrer'
                  variant='body2'
                  color='primary'
                  className='mt-1 inline-flex items-center gap-1'
                >
                  Buka tautan pertemuan
                  <i className='tabler-external-link' />
                </Typography>
              )}
            </DetailRow>
          </div>

          <Divider />

          {/* Instructors */}
          <div className='flex flex-col gap-4'>
            <SectionHeading
              icon='tabler-presentation'
              title='Instruktur'
              trailing={
                <Typography variant='caption' color='text.secondary'>
                  {speakers.length} orang
                </Typography>
              }
            />

            {speakers.length > 0 ? (
              speakers.map((speaker, index) => {
                const ratingData = speaker as typeof speaker & SpeakerRating

                return (
                  <div
                    key={speaker.id || `speaker-${index}`}
                    className='flex items-start gap-3'
                  >
                    <Avatar
                      src={speaker.avatar || undefined}
                      alt={speaker.name}
                      className='bs-12 is-12 shrink-0'
                    >
                      {speaker.name?.charAt(0)}
                    </Avatar>

                    <div className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='body2' className='font-semibold'>
                        {speaker.name}
                      </Typography>

                      <Typography variant='caption' color='text.secondary'>
                        {speaker.position || 'Instruktur Pelatihan'}
                      </Typography>

                      {speaker.organization && (
                        <Typography variant='caption' color='text.secondary'>
                          {speaker.organization}
                        </Typography>
                      )}

                      <RatingStars
                        rating={ratingData.rating}
                        reviewCount={ratingData.reviewCount}
                      />

                      {speaker.expertise?.length > 0 && (
                        <div className='mt-1 flex flex-wrap gap-1'>
                          {speaker.expertise.slice(0, 3).map(skill => (
                            <Chip
                              key={skill}
                              size='small'
                              variant='outlined'
                              label={skill}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <Typography variant='body2' color='text.secondary'>
                Belum ada instruktur yang ditambahkan.
              </Typography>
            )}
          </div>

          <Divider />

          {/* Advantages */}
          <div className='flex flex-col gap-3'>
            <SectionHeading
              icon='tabler-sparkles'
              title='Keunggulan Pelatihan'
            />

            {outcomes.length > 0 ? (
              outcomes.slice(0, 4).map((outcome, index) => (
                <div
                  key={`${outcome}-${index}`}
                  className='flex items-start gap-2'
                >
                  <i className='tabler-circle-check mt-0.5 text-lg text-success' />
                  <Typography variant='body2' color='text.secondary'>
                    {outcome}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant='body2' color='text.secondary'>
                Keunggulan pelatihan belum ditambahkan.
              </Typography>
            )}

            {skills.length > 0 && (
              <>
                <Typography variant='body2' className='mt-1 font-semibold'>
                  Kompetensi yang dipelajari
                </Typography>

                <div className='flex flex-wrap gap-2'>
                  {skills.map(skill => (
                    <Chip
                      key={skill}
                      size='small'
                      variant='outlined'
                      label={skill}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Persyaratan Peserta */}
          <Divider />

          <div className='flex flex-col gap-3'>
            <SectionHeading
              icon='tabler-clipboard-list'
              title='Persyaratan Peserta'
              trailing={
                <Chip
                  size='small'
                  variant='tonal'
                  label={`${data.target.requirements.length} persyaratan`}
                />
              }
            />

            {data.target.requirements.length > 0 ? (
              <div className='flex flex-col gap-3'>
                {data.target.requirements.map((requirement, index) => (
                  <div
                    key={`${requirement}-${index}`}
                    className='flex items-start gap-3'
                  >
                    <div className='flex bs-7 is-7 shrink-0 items-center justify-center rounded-full bg-primaryLight text-primary'>
                      <i className='tabler-check text-sm' />
                    </div>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      className='flex-1'
                    >
                      {requirement}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : (
              <div className='rounded-lg border border-dashed border-divider p-4 text-center'>
                <i className='tabler-clipboard-list text-2xl text-textDisabled' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='mt-2'
                >
                  Persyaratan peserta belum ditambahkan.
                </Typography>
              </div>
            )}
          </div>

          {/* Certificate */}
          <Divider />

          <div className='flex flex-col gap-3'>
            <SectionHeading icon='tabler-award' title='Sertifikat' />

            <div className='flex items-center gap-3 rounded-lg bg-actionHover p-3'>
              <Avatar
                variant='rounded'
                className='bs-11 is-11 bg-primaryLight text-primary'
              >
                <i className='tabler-certificate text-2xl' />
              </Avatar>

              <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <Typography variant='body2' className='font-semibold'>
                  {certificate.available
                    ? 'Sertifikat tersedia'
                    : 'Sertifikat tidak tersedia'}
                </Typography>

                <Typography variant='caption' color='text.secondary'>
                  {certificate.issuer || 'Penerbit belum ditentukan'}
                </Typography>
              </div>
            </div>
          </div>

          {/* Partner */}
          {partner.isCollaborative && (
            <>
              <Divider />

              <div className='flex flex-col gap-3'>
                <SectionHeading
                  icon='tabler-building-community'
                  title='Mitra Pelatihan'
                />

                <div className='flex items-center gap-3'>
                  <Avatar
                    src={partner.companyLogo || undefined}
                    variant='rounded'
                    className='bs-11 is-11'
                  >
                    <i className='tabler-building-community text-xl' />
                  </Avatar>

                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <Typography variant='body2' className='font-semibold'>
                      {partner.companyName || 'Mitra belum ditentukan'}
                    </Typography>

                    <Typography variant='caption' color='text.secondary'>
                      {partner.collaborationType || 'Mitra kolaborasi'}
                    </Typography>
                  </div>
                </div>

                {partner.description && (
                  <Typography variant='body2' color='text.secondary'>
                    {partner.description}
                  </Typography>
                )}

                {partner.companyWebsite && (
                  <Button
                    component='a'
                    href={partner.companyWebsite}
                    target='_blank'
                    rel='noreferrer'
                    variant='outlined'
                    fullWidth
                    startIcon={<i className='tabler-external-link' />}
                  >
                    Kunjungi Website Mitra
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Bottom actions */}
          <Divider />

          <div className='flex flex-col gap-2'>
            <Button
              fullWidth
              variant='contained'
              onClick={editTraining}
              startIcon={<i className='tabler-edit' />}
            >
              Edit Pelatihan
            </Button>

            <Button
              fullWidth
              variant='outlined'
              color='secondary'
              onClick={event => setMenuAnchor(event.currentTarget)}
              endIcon={<i className='tabler-chevron-down' />}
              startIcon={<i className='tabler-settings-2' />}
            >
              Aksi Lainnya
            </Button>

            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={closeMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem onClick={() => navigateTo(`/admin/trainings/${slug}/participants/create`)}>
                <i className='tabler-user-plus me-2 text-lg' />
                Tambah peserta manual
              </MenuItem>

              <MenuItem onClick={() => navigateTo(`/admin/trainings/${slug}/edit?section=advantages`)}>
                <i className='tabler-sparkles me-2 text-lg' />
                Ubah keunggulan pelatihan
              </MenuItem>

              <MenuItem onClick={() => navigateTo(`/admin/trainings/${slug}/edit?section=instructors`)}>
                <i className='tabler-presentation me-2 text-lg' />
                Kelola instruktur
              </MenuItem>

              <MenuItem onClick={() => navigateTo(`/admin/trainings/${slug}/edit?section=materials`)}>
                <i className='tabler-book-2 me-2 text-lg' />
                Kelola materi pelatihan
              </MenuItem>

              <MenuItem onClick={() => navigateTo(`/admin/trainings/${slug}/edit?section=certificate`)}>
                <i className='tabler-certificate me-2 text-lg' />
                Pengaturan sertifikat
              </MenuItem>

              <MenuItem onClick={() => navigateTo(`/admin/trainings/${slug}/edit?section=partner`)}>
                <i className='tabler-building-community me-2 text-lg' />
                Kelola mitra
              </MenuItem>

              <Divider />

              {publicationStatus === 'published' ? (
                <MenuItem
                  onClick={() => {
                    setPublicationStatus('draft' as typeof data.status)
                    closeMenu()
                  }}
                >
                  <i className='tabler-file-pencil me-2 text-lg' />
                  Ubah menjadi draft
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    setPublicationStatus('published' as typeof data.status)
                    closeMenu()
                  }}
                >
                  <i className='tabler-world-upload me-2 text-lg' />
                  Publikasikan pelatihan
                </MenuItem>
              )}

              {registrationOpen ? (
                <MenuItem
                  onClick={() => {
                    setRegistrationOpen(false)
                    closeMenu()
                  }}
                >
                  <i className='tabler-lock me-2 text-lg' />
                  Tutup pendaftaran
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    setRegistrationOpen(true)
                    closeMenu()
                  }}
                >
                  <i className='tabler-lock-open me-2 text-lg' />
                  Buka pendaftaran
                </MenuItem>
              )}

              <Divider />

              <MenuItem
                component={Link}
                href='/admin/trainings'
                onClick={closeMenu}
              >
                <i className='tabler-arrow-left me-2 text-lg' />
                Kembali ke daftar
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

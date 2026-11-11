'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import CustomAvatar from '@core/components/mui/Avatar'

import type { TrainingRecord } from '@/types/admin/trainingTypes'
import {
  trainingLevelLabels,
  trainingFormatLabels,
  trainingEmploymentTargetLabels,
  trainingStatusLabels
} from '@/types/admin/trainingTypes'

const Details = ({ data }: { data: TrainingRecord }) => {
  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const schedule = data.schedule
  const certificate = data.certificate
  const target = data.target

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

  const formatList = (values?: string[]) =>
    values?.length ? values.join(', ') : 'Belum ditentukan'

  return (
    <Card>
      {/* Header */}
      <CardContent className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Chip
              label={data.category || 'Pelatihan'}
              variant='tonal'
              size='small'
              color='primary'
            />
            <Chip
              label={trainingStatusLabels[data.status] ?? data.status}
              variant='tonal'
              size='small'
              color={data.status === 'published' ? 'success' : 'default'}
            />
            {data.featured && (
              <Chip
                label='Pelatihan Pilihan'
                variant='tonal'
                size='small'
                color='warning'
                icon={<i className='tabler-star-filled text-sm' />}
              />
            )}
          </div>

          <Typography variant='h4' className='font-semibold'>
            {data.title}
          </Typography>

          <Typography color='text.secondary'>
            Kode pelatihan: <span className='font-medium text-textPrimary'>{data.code}</span>
          </Typography>

          {data.shortDescription && (
            <Typography color='text.secondary'>
              {data.shortDescription}
            </Typography>
          )}
        </div>
      </CardContent>

      <CardContent className='!pt-0'>
        <div className='rounded border'>
          {/* Cover */}
          <div className='mli-2 mbs-2 overflow-hidden rounded'>
            {data.cover ? (
              <img
                src={data.cover}
                alt={`Sampul ${data.title}`}
                className={`is-full ${smallScreen ? 'bs-[220px]' : 'bs-[420px]'} object-cover bg-backgroundPaper`}
              />
            ) : (
              <div
                className={`flex flex-col items-center justify-center gap-3 ${smallScreen ? 'bs-[220px]' : 'bs-[420px]'} bg-action-hover`}
              >
                <i className='tabler-school text-6xl text-textDisabled' />
                <Typography color='text.secondary'>
                  Sampul pelatihan belum tersedia
                </Typography>
              </div>
            )}
          </div>

          <div className='flex flex-col gap-6 p-5'>
            {/* Description */}
            <section className='flex flex-col gap-3'>
              <Typography variant='h5'>Tentang Pelatihan</Typography>
              <Typography className='whitespace-pre-line'>
                {data.description || data.shortDescription || 'Deskripsi pelatihan belum tersedia.'}
              </Typography>
            </section>

            <Divider />

            {/* Training Information */}
            <section className='flex flex-col gap-4'>
              <Typography variant='h5'>Informasi Pelatihan</Typography>

              <div className='grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2'>
                <InfoItem
                  icon='tabler-chart-bar'
                  label='Tingkat'
                  value={trainingLevelLabels[data.level] ?? data.level}
                />
                <InfoItem
                  icon='tabler-device-laptop'
                  label='Format'
                  value={trainingFormatLabels[schedule.format] ?? schedule.format}
                />
                <InfoItem
                  icon='tabler-calendar-event'
                  label='Tanggal mulai'
                  value={formatDate(schedule.startDate)}
                />
                <InfoItem
                  icon='tabler-calendar-check'
                  label='Tanggal selesai'
                  value={formatDate(schedule.endDate)}
                />
                <InfoItem
                  icon='tabler-clock'
                  label='Waktu'
                  value={`${schedule.startTime || '-'} - ${schedule.endTime || '-'}`}
                />
                <InfoItem
                  icon='tabler-hourglass'
                  label='Durasi'
                  value={schedule.durationHours ? `${schedule.durationHours} jam` : 'Belum ditentukan'}
                />
                <InfoItem
                  icon='tabler-map-pin'
                  label='Lokasi'
                  value={
                    schedule.format === 'online'
                      ? 'Online'
                      : schedule.venue || 'Belum ditentukan'
                  }
                />
                <InfoItem
                  icon='tabler-world'
                  label='Zona waktu'
                  value={schedule.timezone || 'Waktu lokal'}
                />
              </div>

              {schedule.address && (
                <div className='flex items-start gap-3'>
                  <i className='tabler-map-pin mt-1 text-xl text-textSecondary' />
                  <div className='flex flex-col gap-1'>
                    <Typography fontWeight={500}>Alamat</Typography>
                    <Typography color='text.secondary'>{schedule.address}</Typography>
                  </div>
                </div>
              )}

              {schedule.meetingUrl && (
                <div className='flex items-start gap-3'>
                  <i className='tabler-link mt-1 text-xl text-textSecondary' />
                  <div className='flex min-w-0 flex-col gap-1'>
                    <Typography fontWeight={500}>Tautan pertemuan</Typography>
                    <Typography
                      component='a'
                      href={schedule.meetingUrl}
                      target='_blank'
                      rel='noreferrer'
                      color='primary'
                      className='break-all'
                    >
                      {schedule.meetingUrl}
                    </Typography>
                  </div>
                </div>
              )}
            </section>

            <Divider />

            {/* Curriculum */}
            <section className='flex flex-col gap-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <Typography variant='h5'>Kurikulum Pelatihan</Typography>
                <Chip
                  size='small'
                  variant='tonal'
                  label={`${data.curriculum.length} materi`}
                />
              </div>

              {data.curriculum.length > 0 ? (
                <List component='div' className='flex flex-col gap-3 p-0'>
                  {data.curriculum.map((item, index) => (
                    <ListItem
                      key={`${item.title}-${index}`}
                      className='items-start gap-3 rounded border p-3'
                    >
                      <CustomAvatar
                        skin='light'
                        color='primary'
                        size={38}
                        variant='rounded'
                      >
                        <Typography fontWeight={600}>{index + 1}</Typography>
                      </CustomAvatar>

                      <div className='flex min-w-0 flex-1 flex-col gap-1'>
                        <Typography fontWeight={600}>{item.title}</Typography>
                        {item.description && (
                          <Typography variant='body2' color='text.secondary'>
                            {item.description}
                          </Typography>
                        )}
                      </div>

                      {item.durationHours > 0 && (
                        <Chip
                          size='small'
                          variant='tonal'
                          label={`${item.durationHours} jam`}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyMessage message='Kurikulum belum ditambahkan.' />
              )}
            </section>

            <Divider />

            {/* Skills and Outcomes */}
            <section className='flex flex-col gap-4'>
              <Typography variant='h5'>Kompetensi yang Dipelajari</Typography>

              {data.skills.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {data.skills.map((skill, index) => (
                    <Chip
                      key={`${skill}-${index}`}
                      label={skill}
                      variant='outlined'
                      size='small'
                    />
                  ))}
                </div>
              ) : (
                <EmptyMessage message='Kompetensi belum ditentukan.' />
              )}

              <Typography variant='h6' className='mt-2'>
                Hasil Pembelajaran
              </Typography>

              {data.outcomes.length > 0 ? (
                <List component='div' className='flex flex-col gap-2 p-0'>
                  {data.outcomes.map((outcome, index) => (
                    <ListItem key={`${outcome}-${index}`} className='items-start gap-2 p-0'>
                      <i className='tabler-circle-check mt-0.5 text-lg text-success' />
                      <Typography>{outcome}</Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyMessage message='Hasil pembelajaran belum ditentukan.' />
              )}
            </section>

            <Divider />

            {/* Target Participants */}
            <section className='flex flex-col gap-4'>
              <Typography variant='h5'>Target Peserta</Typography>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Typography variant='body2' color='text.secondary'>
                    Sasaran pekerjaan
                  </Typography>
                  <div className='flex flex-wrap gap-2'>
                    {target.employment.length > 0 ? (
                      target.employment.map((employment, index) => (
                        <Chip
                          key={`${employment}-${index}`}
                          size='small'
                          variant='tonal'
                          label={
                            trainingEmploymentTargetLabels[employment] ?? employment
                          }
                        />
                      ))
                    ) : (
                      <Typography variant='body2'>Belum ditentukan</Typography>
                    )}
                  </div>
                </div>

                <InfoItem
                  icon='tabler-school'
                  label='Pendidikan'
                  value={formatList(target.education)}
                />

                <InfoItem
                  icon='tabler-users'
                  label='Rentang usia'
                  value={
                    target.ageMin || target.ageMax
                      ? `${target.ageMin || 0} - ${target.ageMax || 'Tanpa batas'} tahun`
                      : 'Tidak ditentukan'
                  }
                />
              </div>

              {target.description && (
                <Typography color='text.secondary'>
                  {target.description}
                </Typography>
              )}

              <Typography variant='h6'>Persyaratan Peserta</Typography>

              {target.requirements.length > 0 ? (
                <List component='div' className='flex flex-col gap-2 p-0'>
                  {target.requirements.map((requirement, index) => (
                    <ListItem
                      key={`${requirement}-${index}`}
                      className='items-start gap-2 p-0'
                    >
                      <i className='tabler-check mt-0.5 text-lg text-textSecondary' />
                      <Typography>{requirement}</Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyMessage message='Persyaratan khusus tidak dicantumkan.' />
              )}
            </section>

            <Divider />

            {/* Speakers */}
            <section className='flex flex-col gap-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <Typography variant='h5'>Narasumber dan Instruktur</Typography>
                <Chip
                  size='small'
                  variant='tonal'
                  label={`${data.speakers.length} narasumber`}
                />
              </div>

              {data.speakers.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {data.speakers.map(speaker => (
                    <div
                      key={speaker.id}
                      className='flex items-start gap-3 rounded border p-4'
                    >
                      <CustomAvatar
                        src={speaker.avatar || undefined}
                        skin='light-static'
                        color='primary'
                        size={48}
                      >
                        {!speaker.avatar && (
                          <i className='tabler-user text-xl' />
                        )}
                      </CustomAvatar>

                      <div className='flex min-w-0 flex-col gap-1'>
                        <Typography fontWeight={600}>{speaker.name}</Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {speaker.position || 'Instruktur'}
                        </Typography>
                        {speaker.organization && (
                          <Typography variant='body2'>
                            {speaker.organization}
                          </Typography>
                        )}
                        {speaker.bio && (
                          <Typography variant='body2' color='text.secondary'>
                            {speaker.bio}
                          </Typography>
                        )}
                        {speaker.expertise.length > 0 && (
                          <div className='mt-1 flex flex-wrap gap-1'>
                            {speaker.expertise.map((expertise, index) => (
                              <Chip
                                key={`${expertise}-${index}`}
                                size='small'
                                label={expertise}
                                variant='outlined'
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyMessage message='Narasumber belum ditentukan.' />
              )}
            </section>

            <Divider />

            {/* Career Opportunities */}
            <section className='flex flex-col gap-4'>
              <Typography variant='h5'>Peluang Karier</Typography>

              {data.careerOpportunities.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {data.careerOpportunities.map((career, index) => (
                    <Chip
                      key={`${career}-${index}`}
                      label={career}
                      variant='tonal'
                      color='success'
                      size='small'
                    />
                  ))}
                </div>
              ) : (
                <EmptyMessage message='Informasi peluang karier belum tersedia.' />
              )}
            </section>

            <Divider />

            {/* Certificate */}
            <section className='flex items-start gap-3'>
              <CustomAvatar
                skin='light'
                color={certificate.available ? 'success' : 'secondary'}
                size={44}
                variant='rounded'
              >
                <i className='tabler-certificate text-2xl' />
              </CustomAvatar>

              <div className='flex min-w-0 flex-col gap-2'>
                <Typography variant='h5'>Sertifikat Pelatihan</Typography>
                <Typography color='text.secondary'>
                  {certificate.available
                    ? `Sertifikat tersedia${certificate.issuer ? ` dari ${certificate.issuer}` : ''}.`
                    : 'Sertifikat tidak tersedia untuk pelatihan ini.'}
                </Typography>

                {certificate.available && certificate.requirements.length > 0 && (
                  <List component='div' className='flex flex-col gap-2 p-0'>
                    {certificate.requirements.map((requirement, index) => (
                      <ListItem
                        key={`${requirement}-${index}`}
                        className='items-start gap-2 p-0'
                      >
                        <i className='tabler-check mt-0.5 text-lg text-success' />
                        <Typography variant='body2'>{requirement}</Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const InfoItem = ({
                    icon,
                    label,
                    value
                  }: {
  icon: string
  label: string
  value: string
}) => (
  <div className='flex items-start gap-3'>
    <i className={`${icon} mt-0.5 text-xl text-textSecondary`} />
    <div className='flex min-w-0 flex-col gap-1'>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
      <Typography fontWeight={500} className='break-words'>
        {value}
      </Typography>
    </div>
  </div>
)

const EmptyMessage = ({ message }: { message: string }) => (
  <Typography variant='body2' color='text.secondary'>
    {message}
  </Typography>
)

export default Details

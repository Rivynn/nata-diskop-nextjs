'use client'

import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
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
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

export type ApplicantStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'waiting'
  | 'revision'

export type DocumentStatus =
  | 'pending'
  | 'verified'
  | 'invalid'
  | 'missing'

export type ApplicantDocument = {
  id: string
  name: string
  description: string
  fileName: string
  status: DocumentStatus
}

export type Applicant = {
  id: string
  avatar: string
  name: string
  nik: string
  birthPlace: string
  birthDate: string
  gender: string
  email: string
  phone: string
  address: string
  education: string
  employmentStatus: string
  occupation: string
  organization: string
  motivation: string
  goals: string
  registeredAt: string
  status: ApplicantStatus
  reviewer: string
  reviewedAt: string
  decisionNote: string
  documents: ApplicantDocument[]
}

export type ReviewDecision = 'reject' | 'revision' | 'waiting' | null

type Props = {
  open: boolean
  profile: Applicant | null
  editForm: Applicant | null
  editProfile: boolean
  decision: ReviewDecision
  decisionNote: string
  reviewer: string
  error: string

  onClose: () => void
  onSetEditProfile: (value: boolean) => void
  onSetEditForm: (value: Applicant | null) => void
  onSetDecision: (value: ReviewDecision) => void
  onSetDecisionNote: (value: string) => void
  onSetReviewer: (value: string) => void
  onUpdateDocument: (id: string, status: DocumentStatus) => void
  onSaveProfile: () => void
  onApplyDecision: (status: Exclude<ApplicantStatus, 'pending'>) => void
}

const statusConfig: Record<
  ApplicantStatus,
  {
    label: string
    color: 'warning' | 'success' | 'error' | 'info'
  }
> = {
  pending: { label: 'Menunggu keputusan', color: 'warning' },
  approved: { label: 'Lolos seleksi', color: 'success' },
  rejected: { label: 'Ditolak', color: 'error' },
  waiting: { label: 'Daftar tunggu', color: 'info' },
  revision: { label: 'Perlu perbaikan', color: 'warning' }
}

const documentConfig: Record<
  DocumentStatus,
  {
    label: string
    color: 'warning' | 'success' | 'error' | 'info'
  }
> = {
  pending: { label: 'Belum diperiksa', color: 'info' },
  verified: { label: 'Terverifikasi', color: 'success' },
  invalid: { label: 'Tidak valid', color: 'error' },
  missing: { label: 'Belum diunggah', color: 'warning' }
}

const formatDate = (value: string) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`))
}

const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return 0

  const birth = new Date(`${dateOfBirth}T00:00:00`)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate())
  ) {
    age--
  }

  return age
}

const Field = ({
                 label,
                 value,
                 icon
               }: {
  label: string
  value: string
  icon?: string
}) => (
  <Box className='min-w-0'>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>

    <Box className='mt-1 flex items-start gap-2'>
      {icon && (
        <i className={`${icon} mt-0.5 text-[18px] text-textSecondary`} />
      )}

      <Typography variant='body2' className='break-words font-medium'>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
)

const renderStatus = (status: ApplicantStatus) => (
  <Chip
    size='small'
    variant='tonal'
    color={statusConfig[status].color}
    label={statusConfig[status].label}
  />
)

const ApplicantReviewDialog = ({
                                 open,
                                 profile,
                                 editForm,
                                 editProfile,
                                 decision,
                                 decisionNote,
                                 reviewer,
                                 error,
                                 onClose,
                                 onSetEditProfile,
                                 onSetEditForm,
                                 onSetDecision,
                                 onSetDecisionNote,
                                 onSetReviewer,
                                 onUpdateDocument,
                                 onSaveProfile,
                                 onApplyDecision
                               }: Props) => {
  if (!profile || !editForm) return null

  const updateField = <K extends keyof Applicant>(
    key: K,
    value: Applicant[K]
  ) => {
    onSetEditForm({
      ...editForm,
      [key]: value
    })
  }

  const closeDecision = () => {
    onSetDecision(null)
    onSetDecisionNote('')
  }

  const handleClose = () => {
    closeDecision()
    onSetEditProfile(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle className='flex items-center justify-between gap-3'>
        <Box>
          <Typography variant='h6' className='font-semibold'>
            {editProfile ? 'Edit Profil Pendaftar' : 'Review Pendaftaran'}
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            {profile.id} · Terdaftar {formatDate(profile.registeredAt)}
          </Typography>
        </Box>

        <Box className='flex gap-1'>
          {!editProfile && (
            <Tooltip title='Edit profil'>
              <IconButton onClick={() => onSetEditProfile(true)}>
                <i className='tabler-edit' />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title='Tutup'>
            <IconButton onClick={handleClose}>
              <i className='tabler-x' />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box className='flex flex-col gap-5'>
          {error && <Alert severity='warning'>{error}</Alert>}

          <Card variant='outlined'>
            <CardContent className='flex flex-wrap items-center gap-4 p-4'>
              <Avatar
                src={editForm.avatar}
                alt={editForm.name}
                sx={{ width: 76, height: 76 }}
              />

              <Box className='min-w-0 flex-1'>
                <Typography variant='h5' className='font-semibold'>
                  {editForm.name}
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  {editForm.email}
                </Typography>

                <Box className='mt-2 flex flex-wrap gap-2'>
                  <Chip
                    size='small'
                    variant='tonal'
                    label={`${calculateAge(editForm.birthDate)} tahun`}
                  />

                  <Chip
                    size='small'
                    variant='tonal'
                    label={editForm.education}
                  />

                  {renderStatus(editForm.status)}
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box>
            <Typography variant='subtitle1' className='mb-3 font-semibold'>
              <i className='tabler-user-circle mr-2 align-middle text-lg' />
              Identitas pribadi
            </Typography>

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {editProfile ? (
                <>
                  <TextField
                    size='small'
                    label='Nama lengkap'
                    value={editForm.name}
                    onChange={event => updateField('name', event.target.value)}
                    required
                  />

                  <TextField
                    size='small'
                    label='NIK'
                    value={editForm.nik}
                    onChange={event => updateField('nik', event.target.value)}
                  />

                  <TextField
                    size='small'
                    label='Tempat lahir'
                    value={editForm.birthPlace}
                    onChange={event =>
                      updateField('birthPlace', event.target.value)
                    }
                  />

                  <TextField
                    size='small'
                    label='Tanggal lahir'
                    type='date'
                    value={editForm.birthDate}
                    onChange={event =>
                      updateField('birthDate', event.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <TextField
                    select
                    size='small'
                    label='Jenis kelamin'
                    value={editForm.gender}
                    onChange={event => updateField('gender', event.target.value)}
                  >
                    <MenuItem value='Laki-laki'>Laki-laki</MenuItem>
                    <MenuItem value='Perempuan'>Perempuan</MenuItem>
                  </TextField>

                  <TextField
                    size='small'
                    label='URL avatar'
                    value={editForm.avatar}
                    onChange={event => updateField('avatar', event.target.value)}
                  />
                </>
              ) : (
                <>
                  <Field label='NIK' value={editForm.nik} icon='tabler-id' />
                  <Field
                    label='Tempat, tanggal lahir'
                    value={`${editForm.birthPlace}, ${formatDate(editForm.birthDate)}`}
                    icon='tabler-calendar'
                  />
                  <Field
                    label='Jenis kelamin'
                    value={editForm.gender}
                    icon='tabler-user'
                  />
                  <Field
                    label='Usia'
                    value={`${calculateAge(editForm.birthDate)} tahun`}
                    icon='tabler-calendar'
                  />
                </>
              )}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant='subtitle1' className='mb-3 font-semibold'>
              <i className='tabler-address-book mr-2 align-middle text-lg' />
              Kontak & domisili
            </Typography>

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {editProfile ? (
                <>
                  <TextField
                    size='small'
                    label='Email'
                    type='email'
                    value={editForm.email}
                    onChange={event => updateField('email', event.target.value)}
                    required
                  />

                  <TextField
                    size='small'
                    label='Nomor telepon / WhatsApp'
                    value={editForm.phone}
                    onChange={event => updateField('phone', event.target.value)}
                    required
                  />

                  <TextField
                    size='small'
                    label='Alamat domisili'
                    multiline
                    minRows={2}
                    value={editForm.address}
                    onChange={event => updateField('address', event.target.value)}
                    className='sm:col-span-2'
                  />
                </>
              ) : (
                <>
                  <Field label='Email' value={editForm.email} icon='tabler-mail' />
                  <Field
                    label='Nomor telepon'
                    value={editForm.phone}
                    icon='tabler-phone'
                  />
                  <Field
                    label='Alamat domisili'
                    value={editForm.address}
                    icon='tabler-map-pin'
                  />
                  <Field
                    label='Pendidikan terakhir'
                    value={editForm.education}
                    icon='tabler-school'
                  />
                </>
              )}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant='subtitle1' className='mb-3 font-semibold'>
              <i className='tabler-briefcase mr-2 align-middle text-lg' />
              Status pekerjaan
            </Typography>

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {editProfile ? (
                <>
                  <TextField
                    select
                    size='small'
                    label='Status pekerjaan'
                    value={editForm.employmentStatus}
                    onChange={event =>
                      updateField('employmentStatus', event.target.value)
                    }
                  >
                    <MenuItem value='Bekerja'>Sudah bekerja</MenuItem>
                    <MenuItem value='Belum bekerja'>Belum bekerja</MenuItem>
                    <MenuItem value='Wirausaha'>Wirausaha</MenuItem>
                  </TextField>

                  <TextField
                    size='small'
                    label='Pendidikan terakhir'
                    value={editForm.education}
                    onChange={event =>
                      updateField('education', event.target.value)
                    }
                  />

                  <TextField
                    size='small'
                    label='Pekerjaan saat ini'
                    value={editForm.occupation}
                    onChange={event =>
                      updateField('occupation', event.target.value)
                    }
                  />

                  <TextField
                    size='small'
                    label='Perusahaan / nama usaha'
                    value={editForm.organization}
                    onChange={event =>
                      updateField('organization', event.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <Field
                    label='Status pekerjaan'
                    value={editForm.employmentStatus}
                    icon='tabler-user-check'
                  />
                  <Field
                    label='Pekerjaan saat ini'
                    value={editForm.occupation}
                    icon='tabler-briefcase'
                  />
                  <Field
                    label='Perusahaan / usaha'
                    value={editForm.organization}
                    icon='tabler-building'
                  />
                  <Field
                    label='Pendidikan terakhir'
                    value={editForm.education}
                    icon='tabler-school'
                  />
                </>
              )}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant='subtitle1' className='mb-3 font-semibold'>
              <i className='tabler-target mr-2 align-middle text-lg' />
              Motivasi & tujuan
            </Typography>

            <Box className='flex flex-col gap-3'>
              {editProfile ? (
                <>
                  <TextField
                    label='Motivasi mengikuti pelatihan'
                    multiline
                    minRows={3}
                    value={editForm.motivation}
                    onChange={event =>
                      updateField('motivation', event.target.value)
                    }
                  />

                  <TextField
                    label='Tujuan setelah pelatihan'
                    multiline
                    minRows={3}
                    value={editForm.goals}
                    onChange={event => updateField('goals', event.target.value)}
                  />
                </>
              ) : (
                <>
                  <Box className='rounded-xl bg-actionHover p-4'>
                    <Typography variant='caption' color='text.secondary'>
                      Motivasi mengikuti pelatihan
                    </Typography>
                    <Typography variant='body2' className='mt-1'>
                      {editForm.motivation || '—'}
                    </Typography>
                  </Box>

                  <Box className='rounded-xl bg-actionHover p-4'>
                    <Typography variant='caption' color='text.secondary'>
                      Tujuan setelah pelatihan
                    </Typography>
                    <Typography variant='body2' className='mt-1'>
                      {editForm.goals || '—'}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Box className='mb-3 flex flex-wrap items-center justify-between gap-2'>
              <Box>
                <Typography variant='subtitle1' className='font-semibold'>
                  <i className='tabler-files mr-2 align-middle text-lg' />
                  Dokumen persyaratan
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  Periksa setiap berkas secara manual.
                </Typography>
              </Box>

              <Chip
                size='small'
                variant='tonal'
                color={
                  editForm.documents.every(doc => doc.status === 'verified')
                    ? 'success'
                    : 'warning'
                }
                label={`${editForm.documents.filter(doc => doc.status === 'verified').length}/${editForm.documents.length} terverifikasi`}
              />
            </Box>

            <Box className='flex flex-col gap-3'>
              {editForm.documents.map(doc => (
                <Box
                  key={doc.id}
                  className='flex flex-wrap items-center gap-3 rounded-xl border p-3'
                >
                  <Avatar variant='rounded' className='bg-actionHover'>
                    <i className='tabler-file-text text-xl' />
                  </Avatar>

                  <Box className='min-w-0 flex-1'>
                    <Typography variant='body2' className='font-medium'>
                      {doc.name}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                      className='block'
                    >
                      {doc.description}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.disabled'
                      className='block'
                    >
                      {doc.fileName}
                    </Typography>
                  </Box>

                  <Chip
                    size='small'
                    variant='tonal'
                    color={documentConfig[doc.status].color}
                    label={documentConfig[doc.status].label}
                  />

                  {editProfile ? (
                    <Select
                      size='small'
                      value={doc.status}
                      onChange={event =>
                        onUpdateDocument(
                          doc.id,
                          event.target.value as DocumentStatus
                        )
                      }
                      sx={{ minWidth: 155 }}
                      aria-label={`Status ${doc.name}`}
                    >
                      <MenuItem value='pending'>Belum diperiksa</MenuItem>
                      <MenuItem value='verified'>Terverifikasi</MenuItem>
                      <MenuItem value='invalid'>Tidak valid</MenuItem>
                      <MenuItem value='missing'>Belum diunggah</MenuItem>
                    </Select>
                  ) : (
                    <Tooltip title='Tandai terverifikasi'>
                      <span>
                        <IconButton
                          size='small'
                          color='success'
                          disabled={doc.status === 'verified'}
                          onClick={() => onUpdateDocument(doc.id, 'verified')}
                        >
                          <i className='tabler-check text-lg' />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {!editProfile && (
            <>
              <Divider />

              <Box>
                <Typography variant='subtitle1' className='mb-3 font-semibold'>
                  <i className='tabler-history mr-2 align-middle text-lg' />
                  Riwayat keputusan
                </Typography>

                <Box className='rounded-xl border p-4'>
                  <Box className='flex items-start gap-3'>
                    <Avatar
                      src={
                        editForm.reviewer === 'Budi Santoso'
                          ? 'https://i.pravatar.cc/100?img=60'
                          : 'https://i.pravatar.cc/100?img=44'
                      }
                    />

                    <Box className='min-w-0 flex-1'>
                      <Typography variant='body2' className='font-semibold'>
                        {editForm.reviewer || 'Belum ada keputusan'}
                      </Typography>

                      <Typography variant='caption' color='text.secondary'>
                        {formatDate(editForm.reviewedAt)}
                      </Typography>

                      {editForm.decisionNote && (
                        <Typography variant='body2' className='mt-2'>
                          {editForm.decisionNote}
                        </Typography>
                      )}
                    </Box>

                    {renderStatus(editForm.status)}
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant='subtitle1' className='mb-3 font-semibold'>
                  Tindakan seleksi
                </Typography>

                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Pegawai yang mengambil keputusan'
                  value={reviewer}
                  onChange={event => onSetReviewer(event.target.value)}
                >
                  <MenuItem value='Siti Rahmawati'>
                    Siti Rahmawati — Admin Pelatihan
                  </MenuItem>
                  <MenuItem value='Budi Santoso'>
                    Budi Santoso — Verifikator
                  </MenuItem>
                  <MenuItem value='Ahmad Hidayat'>
                    Ahmad Hidayat — Administrator
                  </MenuItem>
                </TextField>
              </Box>

              {decision && (
                <Box className='rounded-xl border p-4'>
                  <Typography variant='subtitle2' className='mb-2 font-semibold'>
                    {decision === 'reject'
                      ? 'Alasan penolakan'
                      : decision === 'revision'
                        ? 'Catatan perbaikan'
                        : 'Catatan daftar tunggu'}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size='small'
                    value={decisionNote}
                    onChange={event => onSetDecisionNote(event.target.value)}
                    placeholder='Tuliskan alasan dan tindak lanjut yang jelas...'
                  />

                  <Box className='mt-3 flex justify-end gap-2'>
                    <Button color='inherit' onClick={closeDecision}>
                      Batal
                    </Button>

                    <Button
                      color={decision === 'reject' ? 'error' : 'primary'}
                      variant='contained'
                      onClick={() =>
                        onApplyDecision(
                          decision === 'reject'
                            ? 'rejected'
                            : decision === 'revision'
                              ? 'revision'
                              : 'waiting'
                        )
                      }
                    >
                      Simpan keputusan
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions className='flex flex-wrap justify-between gap-2 p-4'>
        <Button color='inherit' onClick={handleClose}>
          Tutup
        </Button>

        <Box className='flex flex-wrap gap-2'>
          {editProfile ? (
            <>
              <Button
                color='inherit'
                onClick={() => {
                  onSetEditProfile(false)
                  onSetEditForm({
                    ...profile,
                    documents: profile.documents.map(doc => ({ ...doc }))
                  })
                }}
              >
                Batal
              </Button>

              <Button
                variant='contained'
                startIcon={<i className='tabler-device-floppy text-lg' />}
                onClick={onSaveProfile}
              >
                Simpan profil
              </Button>
            </>
          ) : !decision && profile.status !== 'approved' ? (
            <>
              <Button
                variant='outlined'
                color='warning'
                startIcon={<i className='tabler-refresh text-lg' />}
                onClick={() => {
                  onSetDecision('revision')
                  onSetDecisionNote('')
                }}
              >
                Minta perbaikan
              </Button>

              <Button
                variant='outlined'
                color='error'
                startIcon={<i className='tabler-x text-lg' />}
                onClick={() => {
                  onSetDecision('reject')
                  onSetDecisionNote('')
                }}
              >
                Tolak
              </Button>

              <Button
                variant='outlined'
                color='inherit'
                onClick={() => {
                  onSetDecision('waiting')
                  onSetDecisionNote('')
                }}
              >
                Daftar tunggu
              </Button>

              <Button
                variant='contained'
                startIcon={<i className='tabler-user-check text-lg' />}
                onClick={() => onApplyDecision('approved')}
              >
                Loloskan
              </Button>
            </>
          ) : null}
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ApplicantReviewDialog

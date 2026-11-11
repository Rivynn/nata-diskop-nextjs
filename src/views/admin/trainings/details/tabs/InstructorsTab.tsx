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
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import type {
  TrainingRecord,
  TrainingSpeaker
} from '@/types/admin/trainingTypes'

type Instructor = TrainingSpeaker & {
  isHead?: boolean
}

type InstructorsTabProps = {
  data: TrainingRecord
}

const demoInstructors: Instructor[] = [
  {
    id: 'INS-001',
    name: 'Aditya Pratama',
    position: 'Senior Trainer',
    organization: 'Digital Learning Center',
    avatar: '',
    bio: 'Berpengalaman dalam pengembangan kompetensi digital dan pendampingan peserta pelatihan.',
    expertise: ['Digitalisasi', 'Public Speaking', 'Leadership'],
    isHead: true
  },
  {
    id: 'INS-002',
    name: 'Nadia Putri',
    position: 'Business Consultant',
    organization: 'UMKM Growth Hub',
    avatar: '',
    bio: 'Berfokus pada pengembangan usaha, strategi bisnis, dan pengelolaan UMKM.',
    expertise: ['Business Development', 'UMKM', 'Marketing'],
    isHead: false
  }
]

const emptyInstructorForm = {
  name: '',
  position: '',
  organization: '',
  avatar: '',
  bio: '',
  expertise: '',
  isHead: false
}

const InstructorsTab = ({ data }: InstructorsTabProps) => {
  const initialInstructors = useMemo<Instructor[]>(() => {
    const source = data.speakers?.length
      ? data.speakers
      : demoInstructors

    const hasHead = source.some(instructor => instructor.isHead)

    return source.map((instructor, index) => ({
      ...instructor,
      isHead: hasHead
        ? Boolean(instructor.isHead)
        : index === 0
    }))
  }, [data.speakers])

  const [instructors, setInstructors] =
    useState<Instructor[]>(initialInstructors)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInstructorId, setEditingInstructorId] =
    useState<string | null>(null)

  const [instructorForm, setInstructorForm] =
    useState({ ...emptyInstructorForm })

  const [instructorError, setInstructorError] = useState('')
  const [instructorSearch, setInstructorSearch] = useState('')

  const headInstructor = instructors.find(instructor => instructor.isHead)

  const filteredInstructors = useMemo(() => {
    const keyword = instructorSearch.trim().toLowerCase()

    const result = instructors.filter(instructor =>
      [
        instructor.name,
        instructor.position ?? '',
        instructor.organization ?? '',
        instructor.bio ?? '',
        ...(instructor.expertise ?? [])
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    )

    // Head instruktur selalu tampil paling atas.
    return result.sort(
      (a, b) => Number(Boolean(b.isHead)) - Number(Boolean(a.isHead))
    )
  }, [instructors, instructorSearch])

  const openCreateInstructor = () => {
    setEditingInstructorId(null)
    setInstructorForm({
      ...emptyInstructorForm,
      isHead: instructors.length === 0
    })
    setInstructorError('')
    setDialogOpen(true)
  }

  const openEditInstructor = (instructor: Instructor) => {
    setEditingInstructorId(instructor.id)

    setInstructorForm({
      name: instructor.name,
      position: instructor.position ?? '',
      organization: instructor.organization ?? '',
      avatar: instructor.avatar ?? '',
      bio: instructor.bio ?? '',
      expertise: instructor.expertise?.join(', ') ?? '',
      isHead: Boolean(instructor.isHead)
    })

    setInstructorError('')
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingInstructorId(null)
    setInstructorError('')
  }

  const saveInstructor = () => {
    if (!instructorForm.name.trim()) {
      setInstructorError('Nama instruktur wajib diisi.')
      return
    }

    const expertise = instructorForm.expertise
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    const instructorData = {
      name: instructorForm.name.trim(),
      position: instructorForm.position.trim(),
      organization: instructorForm.organization.trim(),
      avatar: instructorForm.avatar.trim(),
      bio: instructorForm.bio.trim(),
      expertise
    }

    if (editingInstructorId) {
      setInstructors(current => {
        const editingInstructor = current.find(
          item => item.id === editingInstructorId
        )

        const shouldBeHead = instructorForm.isHead

        return current.map(item => {
          if (item.id === editingInstructorId) {
            return {
              ...item,
              ...instructorData,
              isHead: shouldBeHead || !current.some(i => i.isHead)
            }
          }

          // Hanya boleh ada satu head instruktur.
          if (shouldBeHead) {
            return { ...item, isHead: false }
          }

          // Kalau head lama diedit sebagai instruktur tambahan,
          // jangan biarkan posisi head kosong.
          if (
            editingInstructor?.isHead &&
            !shouldBeHead
          ) {
            return { ...item, isHead: true }
          }

          return item
        })
      })
    } else {
      const newInstructor: Instructor = {
        id: `INS-${Date.now()}`,
        ...instructorData,
        isHead: instructors.length === 0 || instructorForm.isHead
      }

      setInstructors(current => {
        if (newInstructor.isHead) {
          return [
            ...current.map(item => ({ ...item, isHead: false })),
            newInstructor
          ]
        }

        return [...current, newInstructor]
      })
    }

    closeDialog()
  }

  const deleteInstructor = (id: string) => {
    const instructor = instructors.find(item => item.id === id)

    if (!instructor) return

    if (instructor.isHead) {
      const replacementExists = instructors.some(
        item => item.id !== id
      )

      if (replacementExists) {
        setInstructorError('')
        setEditingInstructorId(id)
        setInstructorForm({
          name: instructor.name,
          position: instructor.position ?? '',
          organization: instructor.organization ?? '',
          avatar: instructor.avatar ?? '',
          bio: instructor.bio ?? '',
          expertise: instructor.expertise?.join(', ') ?? '',
          isHead: true
        })

        // Buka dialog edit agar head bisa dipindahkan
        // sebelum instruktur utama dihapus.
        setDialogOpen(true)
        setInstructorError(
          'Tetapkan instruktur lain sebagai Head Instruktur terlebih dahulu sebelum menghapus instruktur utama.'
        )
        return
      }

      window.alert(
        'Head Instruktur tidak dapat dihapus jika belum ada pengganti.'
      )
      return
    }

    if (!window.confirm(`Hapus ${instructor.name} dari daftar instruktur?`)) {
      return
    }

    setInstructors(current =>
      current.filter(item => item.id !== id)
    )
  }

  const assignHeadInstructor = (id: string) => {
    setInstructors(current =>
      current.map(instructor => ({
        ...instructor,
        isHead: instructor.id === id
      }))
    )
  }

  const summaryCards = [
    {
      label: 'Total instruktur',
      value: instructors.length,
      description: 'Pengajar terdaftar',
      icon: 'tabler-users',
      color: 'primary'
    },
    {
      label: 'Head instruktur',
      value: headInstructor ? 1 : 0,
      description: headInstructor?.name ?? 'Belum ditetapkan',
      icon: 'tabler-user-star',
      color: 'warning'
    },
    {
      label: 'Instruktur tambahan',
      value: instructors.filter(item => !item.isHead).length,
      description: 'Anggota pendukung pelatihan',
      icon: 'tabler-user-plus',
      color: 'info'
    }
  ]

  return (
    <Box className='flex flex-col gap-5'>
      {/* Header */}
      <Box className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <Box className='min-w-0'>
          <Box className='mb-1 flex items-center gap-2'>
            <i className='tabler-users text-lg text-primary' />

            <Typography variant='caption' color='text.secondary'>
              MANAJEMEN PELATIHAN
            </Typography>
          </Box>

          <Typography variant='h5' className='font-semibold'>
            Tim Instruktur
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className='mt-1'
          >
            Atur instruktur utama dan instruktur tambahan dalam program
            pelatihan.
          </Typography>

          {data.title && (
            <Box className='mt-3 flex items-center gap-2'>
              <i className='tabler-school text-base text-primary' />

              <Typography variant='body2' className='font-medium'>
                {data.title}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          variant='contained'
          startIcon={<i className='tabler-user-plus' />}
          onClick={openCreateInstructor}
        >
          Tambah instruktur
        </Button>
      </Box>

      {/* Summary */}
      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {summaryCards.map(item => (
          <Card
            key={item.label}
            className='h-full transition-shadow hover:shadow-md'
          >
            <CardContent className='flex items-start justify-between gap-3 p-5'>
              <Box className='min-w-0'>
                <Typography variant='body2' color='text.secondary'>
                  {item.label}
                </Typography>

                <Typography
                  variant='h4'
                  className='mt-2 font-semibold tracking-tight'
                >
                  {item.value}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mt-1 block break-words'
                >
                  {item.description}
                </Typography>
              </Box>

              <Avatar
                variant='rounded'
                className={`bs-12 is-12 bg-${item.color}Light text-${item.color}`}
              >
                <i className={`${item.icon} text-2xl`} />
              </Avatar>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Head instructor highlight */}
      {headInstructor && (
        <Card className='overflow-hidden border border-warning/30'>
          <Box className='h-1 bg-warning' />

          <CardContent className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5'>
            <Avatar
              src={headInstructor.avatar || undefined}
              alt={headInstructor.name}
              className='bs-16 is-16 shrink-0'
              sx={{
                bgcolor: 'var(--mui-palette-warning-lightOpacity)',
                color: 'var(--mui-palette-warning-main)',
                fontWeight: 700,
                fontSize: '1.5rem'
              }}
            >
              {headInstructor.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box className='min-w-0 flex-1'>
              <Box className='mb-1 flex flex-wrap items-center gap-2'>
                <Typography variant='h6' className='font-semibold'>
                  {headInstructor.name}
                </Typography>

                <Chip
                  size='small'
                  color='warning'
                  variant='tonal'
                  icon={<i className='tabler-crown text-sm' />}
                  label='Head Instruktur'
                />
              </Box>

              <Typography variant='body2' color='text.secondary'>
                {headInstructor.position || 'Instruktur utama'}
                {headInstructor.organization
                  ? ` • ${headInstructor.organization}`
                  : ''}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='mt-2 leading-relaxed'
              >
                {headInstructor.bio ||
                  'Bertanggung jawab sebagai instruktur utama dalam pelatihan ini.'}
              </Typography>
            </Box>

            <Button
              variant='outlined'
              color='secondary'
              startIcon={<i className='tabler-edit' />}
              onClick={() => openEditInstructor(headInstructor)}
            >
              Edit head
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructor list */}
      <Card>
        <CardContent className='flex flex-col gap-4 p-4 sm:p-5'>
          <Box className='flex flex-wrap items-center justify-between gap-3'>
            <Box>
              <Typography variant='h6' className='font-semibold'>
                Daftar Instruktur
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                {instructors.length} instruktur terdaftar
              </Typography>
            </Box>

            <Chip
              size='small'
              variant='tonal'
              color={headInstructor ? 'success' : 'error'}
              icon={
                <i
                  className={
                    headInstructor
                      ? 'tabler-check text-sm'
                      : 'tabler-alert-circle text-sm'
                  }
                />
              }
              label={
                headInstructor
                  ? 'Head instruktur sudah ditetapkan'
                  : 'Head instruktur belum ditetapkan'
              }
            />
          </Box>

          <TextField
            size='small'
            fullWidth
            placeholder='Cari nama, keahlian, atau instansi...'
            value={instructorSearch}
            onChange={event => setInstructorSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-lg text-textSecondary' />
                  </InputAdornment>
                ),
                endAdornment: instructorSearch ? (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      aria-label='Hapus pencarian'
                      onClick={() => setInstructorSearch('')}
                    >
                      <i className='tabler-x' />
                    </IconButton>
                  </InputAdornment>
                ) : undefined
              }
            }}
          />

          <Divider />

          {filteredInstructors.length > 0 ? (
            <Box className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {filteredInstructors.map(instructor => (
                <Box
                  key={instructor.id}
                  className={`min-w-0 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${
  instructor.isHead
    ? 'border-warning/50 bg-warning/5'
    : 'border-divider hover:border-primary/40'
}`}
                >
                  <Box className='flex items-start gap-3'>
                    <Avatar
                      src={instructor.avatar || undefined}
                      alt={instructor.name}
                      className='bs-12 is-12 shrink-0'
                      sx={{
                        bgcolor: instructor.isHead
                          ? 'var(--mui-palette-warning-lightOpacity)'
                          : 'var(--mui-palette-primary-lightOpacity)',
                        color: instructor.isHead
                          ? 'var(--mui-palette-warning-main)'
                          : 'var(--mui-palette-primary-main)',
                        fontWeight: 700
                      }}
                    >
                      {instructor.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box className='min-w-0 flex-1'>
                      <Box className='flex flex-wrap items-center gap-1.5'>
                        <Typography
                          variant='subtitle1'
                          className='break-words font-semibold'
                        >
                          {instructor.name}
                        </Typography>

                        {instructor.isHead && (
                          <Chip
                            size='small'
                            color='warning'
                            variant='tonal'
                            icon={<i className='tabler-crown text-xs' />}
                            label='Head'
                          />
                        )}
                      </Box>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        className='mt-0.5'
                      >
                        {instructor.position || 'Instruktur'}
                      </Typography>

                      <Box className='mt-2 flex items-start gap-2'>
                        <i className='tabler-building-community mt-0.5 shrink-0 text-base text-textSecondary' />

                        <Typography
                          variant='caption'
                          color='text.secondary'
                          className='break-words'
                        >
                          {instructor.organization || 'Instansi belum diisi'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className='flex shrink-0 items-center'>
                      <Tooltip title='Edit instruktur'>
                        <IconButton
                          size='small'
                          aria-label={`Edit ${instructor.name}`}
                          onClick={() => openEditInstructor(instructor)}
                        >
                          <i className='tabler-edit text-lg' />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Hapus instruktur'>
                        <IconButton
                          size='small'
                          color='error'
                          aria-label={`Hapus ${instructor.name}`}
                          onClick={() => deleteInstructor(instructor.id)}
                        >
                          <i className='tabler-trash text-lg' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {instructor.bio && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      className='mt-4 leading-relaxed'
                    >
                      {instructor.bio}
                    </Typography>
                  )}

                  {instructor.expertise?.length > 0 && (
                    <>
                      <Divider className='my-3' />

                      <Typography
                        variant='caption'
                        color='text.secondary'
                        className='mb-2 block font-medium'
                      >
                        BIDANG KEAHLIAN
                      </Typography>

                      <Box className='flex flex-wrap gap-1.5'>
                        {instructor.expertise.map(skill => (
                          <Chip
                            key={skill}
                            label={skill}
                            size='small'
                            variant='tonal'
                            color='primary'
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  {!instructor.isHead && (
                    <Box className='mt-4 border-t border-divider pt-3'>
                      <Button
                        size='small'
                        variant='outlined'
                        color='secondary'
                        fullWidth
                        startIcon={<i className='tabler-crown' />}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Jadikan ${instructor.name} sebagai Head Instruktur?`
                            )
                          ) {
                            assignHeadInstructor(instructor.id)
                          }
                        }}
                      >
                        Jadikan Head Instruktur
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box className='flex flex-col items-center justify-center rounded-xl border border-dashed border-divider px-4 py-12 text-center'>
              <Avatar
                variant='rounded'
                className='mb-3 bs-14 is-14 bg-actionHover text-textSecondary'
              >
                <i className='tabler-user-search text-3xl' />
              </Avatar>

              <Typography variant='subtitle1' className='font-semibold'>
                {instructors.length
                  ? 'Instruktur tidak ditemukan'
                  : 'Belum ada instruktur'}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='mt-1 max-w-xs leading-relaxed'
              >
                {instructors.length
                  ? 'Coba gunakan kata kunci pencarian yang berbeda.'
                  : 'Tambahkan instruktur untuk menetapkan tim pengajar pelatihan.'}
              </Typography>

              {!instructors.length && (
                <Button
                  variant='contained'
                  size='small'
                  className='mt-4'
                  startIcon={<i className='tabler-user-plus' />}
                  onClick={openCreateInstructor}
                >
                  Tambah instruktur
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Instructor dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle className='flex items-start gap-3 pb-3'>
          <Avatar
            variant='rounded'
            className='bs-11 is-11 bg-primaryLight text-primary'
          >
            <i
              className={`${
  editingInstructorId
    ? 'tabler-user-edit'
    : 'tabler-user-plus'
} text-xl`}
            />
          </Avatar>

          <Box className='min-w-0 flex-1'>
            <Typography variant='h6' className='font-semibold'>
              {editingInstructorId
                ? 'Edit instruktur'
                : 'Tambah instruktur'}
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Lengkapi profil dan tetapkan peran instruktur.
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
            <Typography
              variant='subtitle2'
              className='flex items-center gap-2 font-semibold'
            >
              <i className='tabler-user-circle text-lg text-primary' />
              Informasi instruktur
            </Typography>

            <TextField
              label='Nama lengkap'
              placeholder='Masukkan nama instruktur'
              value={instructorForm.name}
              onChange={event =>
                setInstructorForm(current => ({
                  ...current,
                  name: event.target.value
                }))
              }
              required
              fullWidth
              autoFocus
            />

            <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <TextField
                label='Jabatan / posisi'
                placeholder='Contoh: Senior Trainer'
                value={instructorForm.position}
                onChange={event =>
                  setInstructorForm(current => ({
                    ...current,
                    position: event.target.value
                  }))
                }
                fullWidth
              />

              <TextField
                label='Instansi / organisasi'
                placeholder='Nama organisasi'
                value={instructorForm.organization}
                onChange={event =>
                  setInstructorForm(current => ({
                    ...current,
                    organization: event.target.value
                  }))
                }
                fullWidth
              />
            </Box>

            <TextField
              label='URL foto profil'
              placeholder='https://example.com/avatar.jpg'
              value={instructorForm.avatar}
              onChange={event =>
                setInstructorForm(current => ({
                  ...current,
                  avatar: event.target.value
                }))
              }
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-photo text-lg' />
                    </InputAdornment>
                  )
                }
              }}
            />

            <TextField
              label='Biografi singkat'
              placeholder='Pengalaman, latar belakang, atau fokus keahlian...'
              value={instructorForm.bio}
              onChange={event =>
                setInstructorForm(current => ({
                  ...current,
                  bio: event.target.value
                }))
              }
              multiline
              rows={3}
              fullWidth
            />

            <Divider />

            <Typography
              variant='subtitle2'
              className='flex items-center gap-2 font-semibold'
            >
              <i className='tabler-certificate text-lg text-primary' />
              Bidang keahlian
            </Typography>

            <TextField
              label='Keahlian instruktur'
              placeholder='Digital Marketing, Leadership, UMKM'
              value={instructorForm.expertise}
              onChange={event =>
                setInstructorForm(current => ({
                  ...current,
                  expertise: event.target.value
                }))
              }
              helperText='Pisahkan setiap keahlian dengan koma.'
              fullWidth
            />

            <Divider />

            <Box className='rounded-xl border border-divider p-4'>
              <Box className='flex items-start gap-3'>
                <Avatar
                  variant='rounded'
                  className={`bs-10 is-10 ${
  instructorForm.isHead
    ? 'bg-warningLight text-warning'
    : 'bg-actionHover text-textSecondary'
}`}
                >
                  <i className='tabler-crown text-xl' />
                </Avatar>

                <Box className='min-w-0 flex-1'>
                  <Typography variant='subtitle2' className='font-semibold'>
                    Head Instruktur
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className='mt-1 leading-relaxed'
                  >
                    Instruktur utama yang bertanggung jawab memimpin tim
                    pengajar. Setiap pelatihan wajib memiliki satu Head
                    Instruktur.
                  </Typography>

                  <Box className='mt-3 flex flex-wrap gap-2'>
                    <Button
                      size='small'
                      variant={instructorForm.isHead ? 'contained' : 'outlined'}
                      color='warning'
                      startIcon={
                        <i
                          className={
                            instructorForm.isHead
                              ? 'tabler-check'
                              : 'tabler-crown'
                          }
                        />
                      }
                      onClick={() =>
                        setInstructorForm(current => ({
                          ...current,
                          isHead: !current.isHead
                        }))
                      }
                    >
                      {instructorForm.isHead
                        ? 'Head Instruktur'
                        : 'Jadikan Head'}
                    </Button>

                    <Chip
                      size='small'
                      variant='tonal'
                      color={instructorForm.isHead ? 'warning' : 'default'}
                      label={
                        instructorForm.isHead
                          ? 'Instruktur utama'
                          : 'Instruktur tambahan'
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {instructorError && (
              <Box className='flex items-start gap-2 rounded-lg border border-error/30 bg-error/5 p-3'>
                <i className='tabler-alert-circle mt-0.5 text-lg text-error' />

                <Typography variant='body2' color='error'>
                  {instructorError}
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
            onClick={saveInstructor}
            startIcon={
              <i
                className={
                  editingInstructorId
                    ? 'tabler-device-floppy'
                    : 'tabler-user-plus'
                }
              />
            }
          >
            {editingInstructorId
              ? 'Simpan perubahan'
              : 'Tambah instruktur'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default InstructorsTab


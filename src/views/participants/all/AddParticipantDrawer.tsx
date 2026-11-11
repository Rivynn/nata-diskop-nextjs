
'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'

// Type Imports
import type {
  ParticipantsType,
  ParticipantFormType
} from '@/types/apps/participantTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

type Props = {
  open: boolean
  handleClose: () => void
  participantData?: ParticipantsType[]
  setData: (data: ParticipantsType[]) => void
  participant?: ParticipantsType | null
}

// ---------------------------------------------------------
// Initial Values
// ---------------------------------------------------------

const defaultValues: ParticipantFormType = {
  fullName: '',
  nik: '',
  gender: 'male',
  birthPlace: '',
  birthDate: '',
  avatar: '',

  email: '',
  phone: '',
  address: '',

  education: '',
  occupation: '',
  institution: '',

  verificationStatus: 'pending',
  accountStatus: 'active',
  verifiedAt: undefined,
  verificationNotes: '',

  notes: ''
}

// ---------------------------------------------------------
// Styles
// ---------------------------------------------------------

const requiredFieldSx = {
  '& .MuiFormLabel-asterisk': {
    color: 'var(--mui-palette-error-main)'
  }
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const generateParticipantCode = (
  participantData?: ParticipantsType[]
) => {
  const nextId =
    (participantData ?? []).length > 0
      ? Math.max(...(participantData ?? []).map(item => item.id)) + 1
      : 1

  return `PRT-${String(nextId).padStart(6, '0')}`
}

const generateParticipantId = (
  participantData?: ParticipantsType[]
) => {
  return (participantData ?? []).length > 0
    ? Math.max(...(participantData ?? []).map(item => item.id)) + 1
    : 1
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const AddParticipantDrawer = (props: Props) => {
  const {
    open,
    handleClose,
    participantData,
    setData,
    participant = null
  } = props

  const isEditMode = Boolean(participant)

  // -------------------------------------------------------
  // Form
  // -------------------------------------------------------

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<ParticipantFormType>({
    defaultValues,
    mode: 'onTouched'
  })

  // -------------------------------------------------------
  // Populate Form
  // -------------------------------------------------------

  useEffect(() => {
    if (!open) return

    if (participant) {
      resetForm({
        fullName: participant.fullName ?? '',
        nik: participant.nik ?? '',
        gender: participant.gender ?? 'male',
        birthPlace: participant.birthPlace ?? '',
        birthDate: participant.birthDate ?? '',
        avatar: participant.avatar ?? '',

        email: participant.email ?? '',
        phone: participant.phone ?? '',
        address: participant.address ?? '',

        education: participant.education ?? '',
        occupation: participant.occupation ?? '',
        institution: participant.institution ?? '',

        verificationStatus: participant.verificationStatus,
        accountStatus: participant.accountStatus,
        verifiedAt: participant.verifiedAt,
        verificationNotes: participant.verificationNotes ?? '',

        notes: participant.notes ?? ''
      })

      return
    }

    resetForm(defaultValues)
  }, [open, participant, resetForm])

  // -------------------------------------------------------
  // Reset
  // -------------------------------------------------------

  const handleReset = () => {
    resetForm(defaultValues)
    handleClose()
  }

  // -------------------------------------------------------
  // Submit
  // -------------------------------------------------------

  const onSubmit = (formData: ParticipantFormType) => {
    const now = new Date().toISOString()

    // -----------------------------------------------------
    // EDIT
    // -----------------------------------------------------

    if (participant) {
      const updatedParticipant: ParticipantsType = {
        ...participant,
        ...formData,

        fullName: formData.fullName.trim(),
        nik: formData.nik.trim(),
        birthPlace: formData.birthPlace.trim(),

        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),

        education: formData.education.trim(),
        occupation: formData.occupation.trim(),
        institution: formData.institution?.trim() ?? '',

        notes: formData.notes?.trim() ?? '',
        verificationNotes: formData.verificationNotes?.trim() ?? '',

        updatedAt: now
      }

      const updatedData = (participantData ?? []).map(item =>
        item.id === participant.id ? updatedParticipant : item
      )

      setData(updatedData)
      handleReset()

      return
    }

    // -----------------------------------------------------
    // CREATE
    // -----------------------------------------------------

    const nextId = generateParticipantId(participantData)

    const newParticipant: ParticipantsType = {
      id: nextId,
      participantCode: generateParticipantCode(participantData),

      ...formData,

      fullName: formData.fullName.trim(),
      nik: formData.nik.trim(),
      birthPlace: formData.birthPlace.trim(),

      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),

      education: formData.education.trim(),
      occupation: formData.occupation.trim(),
      institution: formData.institution?.trim() ?? '',

      notes: formData.notes?.trim() ?? '',
      verificationNotes: formData.verificationNotes?.trim() ?? '',

      // Default status for newly created participants
      verificationStatus: 'pending',
      accountStatus: 'active',
      verifiedAt: undefined,

      avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,

      createdAt: now,
      updatedAt: now
    }

    setData([
      ...(participantData ?? []),
      newParticipant
    ])

    handleReset()
  }

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: {
            xs: 320,
            sm: 480
          }
        }
      }}
    >
      {/* Header */}

      <div className='flex items-center justify-between plb-5 pli-6'>
        <div className='flex flex-col'>
          <Typography variant='h5'>
            {isEditMode ? 'Edit Peserta' : 'Tambah Peserta'}
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            {isEditMode
              ? 'Perbarui informasi profil peserta'
              : 'Tambahkan data peserta baru ke dalam sistem'}
          </Typography>
        </div>

        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>

      <Divider />

      {/* Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 p-6'
        noValidate
      >
        {/* ================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>
            Informasi Pribadi
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Informasi identitas peserta.
          </Typography>
        </div>

        {/* Full Name */}

        <Controller
          name='fullName'
          control={control}
          rules={{
            required: 'Nama lengkap wajib diisi.',
            minLength: {
              value: 3,
              message: 'Nama minimal 3 karakter.'
            }
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              label='Nama Lengkap'
              placeholder='Contoh: Ahmad Fauzan'
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* NIK */}

        <Controller
          name='nik'
          control={control}
          rules={{
            required: 'NIK wajib diisi.',
            pattern: {
              value: /^\d{16}$/,
              message: 'NIK harus terdiri dari 16 digit.'
            }
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              label='NIK'
              placeholder='Masukkan 16 digit NIK'
              slotProps={{
                htmlInput: {
                  maxLength: 16,
                  inputMode: 'numeric'
                }
              }}
              error={Boolean(errors.nik)}
              helperText={errors.nik?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* Gender */}

        <Controller
          name='gender'
          control={control}
          rules={{
            required: 'Jenis kelamin wajib dipilih.'
          }}
          render={({ field }) => (
            <CustomTextField
              select
              fullWidth
              required
              label='Jenis Kelamin'
              {...field}
              error={Boolean(errors.gender)}
              helperText={errors.gender?.message}
              sx={requiredFieldSx}
            >
              <MenuItem value='male'>Laki-laki</MenuItem>
              <MenuItem value='female'>Perempuan</MenuItem>
            </CustomTextField>
          )}
        />

        {/* Birth Place */}

        <Controller
          name='birthPlace'
          control={control}
          rules={{
            required: 'Tempat lahir wajib diisi.'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              label='Tempat Lahir'
              placeholder='Contoh: Banjarbaru'
              error={Boolean(errors.birthPlace)}
              helperText={errors.birthPlace?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* Birth Date */}

        <Controller
          name='birthDate'
          control={control}
          rules={{
            required: 'Tanggal lahir wajib diisi.'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              type='date'
              label='Tanggal Lahir'
              error={Boolean(errors.birthDate)}
              helperText={errors.birthDate?.message}
              sx={requiredFieldSx}
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
            />
          )}
        />

        {/* ================================================
            CONTACT INFORMATION
        ================================================= */}

        <Divider />

        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>
            Informasi Kontak
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Informasi yang dapat digunakan untuk menghubungi peserta.
          </Typography>
        </div>

        {/* Email */}

        <Controller
          name='email'
          control={control}
          rules={{
            required: 'Email wajib diisi.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format email tidak valid.'
            }
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              type='email'
              label='Email'
              placeholder='nama@email.com'
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* Phone */}

        <Controller
          name='phone'
          control={control}
          rules={{
            required: 'Nomor HP wajib diisi.',
            pattern: {
              value: /^(?:\+?62|0)?8\d{8,11}$/,
              message: 'Format nomor HP tidak valid.'
            }
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              label='Nomor HP'
              placeholder='08xxxxxxxxxx'
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* Address */}

        <Controller
          name='address'
          control={control}
          rules={{
            required: 'Alamat wajib diisi.'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              multiline
              rows={3}
              label='Alamat Lengkap'
              placeholder='Masukkan alamat lengkap peserta'
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* ================================================
            EDUCATION & EMPLOYMENT
        ================================================= */}

        <Divider />

        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>
            Pendidikan & Pekerjaan
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Informasi latar belakang pendidikan dan pekerjaan peserta.
          </Typography>
        </div>

        {/* Education */}

        <Controller
          name='education'
          control={control}
          rules={{
            required: 'Pendidikan terakhir wajib dipilih.'
          }}
          render={({ field }) => (
            <CustomTextField
              select
              fullWidth
              required
              label='Pendidikan Terakhir'
              {...field}
              error={Boolean(errors.education)}
              helperText={errors.education?.message}
              sx={requiredFieldSx}
            >
              <MenuItem value='SD'>SD / Sederajat</MenuItem>
              <MenuItem value='SMP'>SMP / Sederajat</MenuItem>
              <MenuItem value='SMA'>SMA / Sederajat</MenuItem>
              <MenuItem value='SMK'>SMK</MenuItem>
              <MenuItem value='D1'>Diploma I</MenuItem>
              <MenuItem value='D2'>Diploma II</MenuItem>
              <MenuItem value='D3'>Diploma III</MenuItem>
              <MenuItem value='D4'>Diploma IV</MenuItem>
              <MenuItem value='S1'>Sarjana (S1)</MenuItem>
              <MenuItem value='S2'>Magister (S2)</MenuItem>
              <MenuItem value='S3'>Doktor (S3)</MenuItem>
            </CustomTextField>
          )}
        />

        {/* Occupation */}

        <Controller
          name='occupation'
          control={control}
          rules={{
            required: 'Pekerjaan wajib diisi.'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              required
              label='Pekerjaan'
              placeholder='Contoh: Wiraswasta'
              error={Boolean(errors.occupation)}
              helperText={errors.occupation?.message}
              sx={requiredFieldSx}
            />
          )}
        />

        {/* Institution */}

        <Controller
          name='institution'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Instansi / Perusahaan'
              placeholder='Nama instansi atau perusahaan'
              helperText='Opsional'
            />
          )}
        />

        {/* ================================================
            ADDITIONAL INFORMATION
        ================================================= */}

        <Divider />

        <div className='flex flex-col gap-1'>
          <Typography variant='h6'>
            Informasi Tambahan
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Catatan tambahan mengenai peserta.
          </Typography>
        </div>

        {/* Notes */}

        <Controller
          name='notes'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              multiline
              rows={3}
              label='Catatan'
              placeholder='Tambahkan catatan jika diperlukan'
              helperText='Opsional'
            />
          )}
        />

        {/* ================================================
            FORM ACTION
        ================================================= */}

        <Divider />

        <div className='flex items-center gap-4 pt-2'>
          <Button
            variant='contained'
            type='submit'
            startIcon={
              <i
                className={
                  isEditMode
                    ? 'tabler-device-floppy'
                    : 'tabler-user-plus'
                }
              />
            }
          >
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Peserta'}
          </Button>

          <Button
            variant='tonal'
            color='error'
            type='button'
            onClick={handleReset}
          >
            Batal
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

export default AddParticipantDrawer

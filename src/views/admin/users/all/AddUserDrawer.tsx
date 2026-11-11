'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Types Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

type Props = {
  open: boolean
  handleClose: () => void
  userData?: UsersType[]
  setData: (data: UsersType[]) => void

  // Jika ada = edit
  // Jika kosong = tambah
  user?: UsersType | null
}

type FormValidateType = {
  fullName: string
  username: string
  email: string
  phone: string
  role: string
  status: string
  password: string
}

// ---------------------------------------------------------
// Initial Values
// ---------------------------------------------------------

const defaultValues: FormValidateType = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  role: '',
  status: 'active',
  password: ''
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

/**
 * Value internal:
 * 85136373842
 *
 * Display:
 * +62 8513 6373 842
 */
const normalizePhone = (value: string) => {
  let digits = value.replace(/\D/g, '')

  // Kalau paste +62 / 62
  if (digits.startsWith('62')) {
    digits = digits.slice(2)
  }

  // Kalau paste 08...
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  // Hanya nomor Indonesia yang diawali 8
  if (digits && !digits.startsWith('8')) {
    return ''
  }

  // Maksimal 12 digit setelah 8
  return digits.slice(0, 12)
}

const formatPhone = (value: string) => {
  const digits = normalizePhone(value)

  if (!digits) {
    return ''
  }

  const groups: string[] = []

  // 4 digit pertama
  groups.push(digits.slice(0, 4))

  // 4 digit berikutnya
  if (digits.length > 4) {
    groups.push(digits.slice(4, 8))
  }

  // Sisanya
  if (digits.length > 8) {
    groups.push(digits.slice(8, 12))
  }

  return groups.join(' ')
}

const generatePassword = (length = 14) => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'
  const numbers = '23456789'
  const symbols = '!@#$%^&*'

  const allCharacters =
    uppercase +
    lowercase +
    numbers +
    symbols

  const getRandomCharacter = (characters: string) => {
    return characters[
      Math.floor(
        Math.random() * characters.length
      )
      ]
  }

  let password =
    getRandomCharacter(uppercase) +
    getRandomCharacter(lowercase) +
    getRandomCharacter(numbers) +
    getRandomCharacter(symbols)

  while (password.length < length) {
    password += getRandomCharacter(
      allCharacters
    )
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const AddUserDrawer = (props: Props) => {
  const {
    open,
    handleClose,
    userData,
    setData,
    user = null
  } = props

  const isEditMode = Boolean(user)

  // -------------------------------------------------------
  // States
  // -------------------------------------------------------

  const [showPassword, setShowPassword] =
    useState(false)

  const [passwordCopied, setPasswordCopied] =
    useState(false)

  // -------------------------------------------------------
  // Form
  // -------------------------------------------------------

  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues,
    mode: 'onTouched'
  })

  // -------------------------------------------------------
  // Populate Form
  // -------------------------------------------------------

  useEffect(() => {
    if (!open) {
      return
    }

    if (user) {
      resetForm({
        fullName: user.fullName ?? '',
        username: user.username ?? '',
        email: user.email ?? '',

        // Data disimpan tanpa +62
        phone: normalizePhone(
          user.phone ?? ''
        ),

        role: user.role ?? '',

        status:
          user.status === 'active'
            ? 'active'
            : 'pending',

        password: ''
      })

      setShowPassword(false)
      setPasswordCopied(false)

      return
    }

    resetForm(defaultValues)

    setShowPassword(false)
    setPasswordCopied(false)
  }, [
    open,
    user,
    resetForm
  ])

  // -------------------------------------------------------
  // Reset
  // -------------------------------------------------------

  const handleReset = () => {
    resetForm(defaultValues)
    setShowPassword(false)
    setPasswordCopied(false)
    handleClose()
  }

  // -------------------------------------------------------
  // Generate Password
  // -------------------------------------------------------

  const handleGeneratePassword = () => {
    const password =
      generatePassword(14)

    setValue(
      'password',
      password,
      {
        shouldDirty: true,
        shouldValidate: true
      }
    )

    setShowPassword(true)
    setPasswordCopied(false)
  }

  // -------------------------------------------------------
  // Copy Password
  // -------------------------------------------------------

  const handleCopyPassword = async (
    password: string
  ) => {
    if (!password) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        password
      )

      setPasswordCopied(true)

      setTimeout(() => {
        setPasswordCopied(false)
      }, 2000)
    } catch {
      setPasswordCopied(false)
    }
  }

  // -------------------------------------------------------
  // Submit
  // -------------------------------------------------------

  const onSubmit = (
    formData: FormValidateType
  ) => {
    // -----------------------------------------------------
    // EDIT
    // -----------------------------------------------------

    if (user) {
      const updatedUser: UsersType = {
        ...user,

        fullName:
          formData.fullName.trim(),

        username:
          formData.username.trim(),

        email:
          formData.email.trim(),

        // Simpan tanpa +62
        phone:
          normalizePhone(
            formData.phone
          ),

        role: formData.role,

        status:
          formData.status === 'active'
            ? 'active'
            : 'pending'
      }

      const updatedData =
        (userData ?? []).map(item =>
          item.id === user.id
            ? updatedUser
            : item
        )

      setData(updatedData)

      handleReset()

      return
    }

    // -----------------------------------------------------
    // CREATE
    // -----------------------------------------------------

    const nextId =
      (userData?.length ?? 0) > 0
        ? Math.max(
        ...(userData ?? []).map(
          item => item.id
        )
      ) + 1
        : 1

    const newUser: UsersType = {
      id: nextId,

      avatar: `/images/avatars/${
        Math.floor(
          Math.random() * 8
        ) + 1
      }.png`,

      fullName:
        formData.fullName.trim(),

      username:
        formData.username.trim(),

      email:
        formData.email.trim(),

      phone:
        normalizePhone(
          formData.phone
        ),

      role: formData.role,

      status:
        formData.status === 'active'
          ? 'active'
          : 'pending',

      // Email verification bukan syarat
      // akun aktif.
      emailVerifiedAt: null,

      createdAt:
        new Date().toISOString()
    }

    setData([
      ...(userData ?? []),
      newUser
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
            xs: 300,
            sm: 400
          }
        }
      }}
    >
      {/* Header */}
      <div className='flex items-center justify-between plb-5 pli-6'>
        <div className='flex flex-col'>
          <Typography variant='h5'>
            {isEditMode
              ? 'Edit Pengguna'
              : 'Tambah Pengguna'}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
          >
            {isEditMode
              ? 'Perbarui informasi akun pengguna'
              : 'Buat akun pengguna baru'}
          </Typography>
        </div>

        <IconButton
          size='small'
          onClick={handleReset}
        >
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>

      <Divider />

      {/* Form */}
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-6 p-6'
          noValidate
        >
          {/* ============================================
              NAMA LENGKAP
          ============================================ */}
          <Controller
            name='fullName'
            control={control}
            rules={{
              required:
                'Nama lengkap wajib diisi.',
              minLength: {
                value: 3,
                message:
                  'Nama lengkap minimal 3 karakter.'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                required
                label='Nama Lengkap'
                placeholder='Contoh: Ahmad Fauzan'
                error={Boolean(
                  errors.fullName
                )}
                helperText={
                  errors.fullName?.message
                }
                sx={requiredFieldSx}
              />
            )}
          />

          {/* ============================================
              USERNAME
          ============================================ */}
          <Controller
            name='username'
            control={control}
            rules={{
              required:
                'Username wajib diisi.',
              minLength: {
                value: 4,
                message:
                  'Username minimal 4 karakter.'
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9._-]+$/,
                message:
                  'Username hanya boleh berisi huruf, angka, titik, underscore, dan tanda hubung.'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                required
                label='Username'
                placeholder='contoh.username'
                error={Boolean(
                  errors.username
                )}
                helperText={
                  errors.username?.message
                }
                sx={requiredFieldSx}
              />
            )}
          />

          {/* ============================================
              EMAIL
          ============================================ */}
          <Controller
            name='email'
            control={control}
            rules={{
              required:
                'Email wajib diisi.',
              pattern: {
                value:
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:
                  'Format email tidak valid.'
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
                error={Boolean(
                  errors.email
                )}
                helperText={
                  errors.email?.message
                }
                sx={requiredFieldSx}
              />
            )}
          />

          {/* ============================================
              NOMOR HP
          ============================================ */}
          <Controller
            name='phone'
            control={control}
            rules={{
              required:
                'Nomor HP wajib diisi.',
              validate: value => {
                const phone =
                  normalizePhone(value)

                if (!phone) {
                  return 'Nomor HP wajib diisi.'
                }

                if (
                  !/^8\d{9,11}$/.test(
                    phone
                  )
                ) {
                  return 'Nomor HP harus diawali 8 dan terdiri dari 10–12 digit.'
                }

                return true
              }
            }}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                required
                label='Nomor HP'
                placeholder='8513 6373 842'
                value={formatPhone(
                  field.value
                )}
                onChange={event => {
                  const raw =
                    normalizePhone(
                      event.target.value
                    )

                  field.onChange(raw)
                }}
                error={Boolean(
                  errors.phone
                )}
                helperText={
                  errors.phone?.message ??
                  'Masukkan nomor HP tanpa 0. Contoh: 8513 6373 842'
                }
                sx={requiredFieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <span className='text-textSecondary font-medium'>
                          +62
                        </span>
                      </InputAdornment>
                    )
                  }
                }}
              />
            )}
          />

          {/* ============================================
              ROLE
          ============================================ */}
          <Controller
            name='role'
            control={control}
            rules={{
              required:
                'Role wajib dipilih.'
            }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                required
                id='select-role'
                label='Role'
                {...field}
                error={Boolean(
                  errors.role
                )}
                helperText={
                  errors.role?.message
                }
                sx={requiredFieldSx}
              >
                <MenuItem value=''>
                  Pilih Role
                </MenuItem>

                <MenuItem value='admin'>
                  Administrator
                </MenuItem>

                <MenuItem value='pegawai'>
                  Pegawai
                </MenuItem>

                <MenuItem value='pelatih'>
                  Pelatih
                </MenuItem>

                <MenuItem value='peserta'>
                  Peserta
                </MenuItem>

                <MenuItem value='mitra'>
                  Mitra
                </MenuItem>
              </CustomTextField>
            )}
          />

          {/* ============================================
              STATUS AKUN
          ============================================ */}
          <Controller
            name='status'
            control={control}
            rules={{
              required:
                'Status akun wajib dipilih.'
            }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                required
                id='select-status'
                label='Status Akun'
                {...field}
                error={Boolean(
                  errors.status
                )}
                helperText={
                  errors.status?.message
                }
                sx={requiredFieldSx}
              >
                <MenuItem value='active'>
                  Aktif
                </MenuItem>

                <MenuItem value='pending'>
                  Menunggu
                </MenuItem>
              </CustomTextField>
            )}
          />

          {/* ============================================
              PASSWORD
          ============================================ */}
          <Controller
            name='password'
            control={control}
            rules={
              isEditMode
                ? {
                  minLength: {
                    value: 8,
                    message:
                      'Password minimal 8 karakter.'
                  }
                }
                : {
                  required:
                    'Password wajib diisi.',
                  minLength: {
                    value: 8,
                    message:
                      'Password minimal 8 karakter.'
                  }
                }
            }
            render={({ field }) => (
              <div className='flex flex-col gap-2'>
                <CustomTextField
                  {...field}
                  fullWidth
                  required={!isEditMode}
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  label={
                    isEditMode
                      ? 'Password Baru'
                      : 'Password'
                  }
                  placeholder={
                    isEditMode
                      ? 'Kosongkan jika tidak diubah'
                      : 'Minimal 8 karakter'
                  }
                  error={Boolean(
                    errors.password
                  )}
                  helperText={
                    errors.password?.message ??
                    (isEditMode
                      ? 'Kosongkan jika password tidak ingin diubah.'
                      : 'Minimal 8 karakter.')
                  }
                  sx={requiredFieldSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip
                            title={
                              showPassword
                                ? 'Sembunyikan password'
                                : 'Tampilkan password'
                            }
                          >
                            <IconButton
                              size='small'
                              edge='end'
                              type='button'
                              onClick={() =>
                                setShowPassword(
                                  previous =>
                                    !previous
                                )
                              }
                            >
                              <i
                                className={
                                  showPassword
                                    ? 'tabler-eye-off'
                                    : 'tabler-eye'
                                }
                              />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }
                  }}
                />

                {/* Password Actions */}
                <div className='flex flex-wrap items-center gap-2'>
                  <Button
                    type='button'
                    size='small'
                    variant='tonal'
                    color='primary'
                    startIcon={
                      <i className='tabler-wand' />
                    }
                    onClick={
                      handleGeneratePassword
                    }
                  >
                    Generate Password
                  </Button>

                  {field.value && (
                    <Button
                      type='button'
                      size='small'
                      variant='tonal'
                      color={
                        passwordCopied
                          ? 'success'
                          : 'secondary'
                      }
                      startIcon={
                        <i
                          className={
                            passwordCopied
                              ? 'tabler-check'
                              : 'tabler-copy'
                          }
                        />
                      }
                      onClick={() =>
                        handleCopyPassword(
                          field.value
                        )
                      }
                    >
                      {passwordCopied
                        ? 'Tersalin'
                        : 'Copy'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          />

          {/* ============================================
              FORM ACTION
          ============================================ */}
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
              {isEditMode
                ? 'Simpan Perubahan'
                : 'Tambah Pengguna'}
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
      </div>
    </Drawer>
  )
}

export default AddUserDrawer

'use client'

import { useRef, useState, ChangeEvent } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

import CustomTextField from '@core/components/mui/TextField'

import ProfileImageCropDialog from './ProfileImageCropDialog'

import styles from './InstructorAccount.module.css'

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

type UsernameStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'

const DEFAULT_AVATAR =
  '/images/avatars/tasya-pp.png'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024

const InstructorAccount = ({
                             mode
                           }: Props) => {
  const fileInputRef =
    useRef<HTMLInputElement>(null)

  /* =========================================================
     AVATAR
  ========================================================= */

  const [avatarSrc, setAvatarSrc] =
    useState(DEFAULT_AVATAR)

  const [originalAvatarSrc, setOriginalAvatarSrc] =
    useState(DEFAULT_AVATAR)

  const [cropOpen, setCropOpen] =
    useState(false)

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null)

  /* =========================================================
     ACCOUNT
  ========================================================= */

  const [username, setUsername] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>('idle')

  const [usernameError, setUsernameError] =
    useState('')

  /* =========================================================
     PASSWORD
  ========================================================= */

  const [password, setPassword] =
    useState('')

  const [
    passwordConfirmation,
    setPasswordConfirmation
  ] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation
  ] = useState(false)

  /* =========================================================
     AVATAR HANDLERS
  ========================================================= */

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (
      ![
        'image/jpeg',
        'image/png',
        'image/webp'
      ].includes(file.type)
    ) {
      alert(
        'Format foto harus JPG, PNG, atau WebP.'
      )

      event.target.value = ''

      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert(
        'Ukuran foto maksimal 3 MB.'
      )

      event.target.value = ''

      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      if (typeof result !== 'string') return

      setSelectedImage(result)
      setCropOpen(true)
    }

    reader.readAsDataURL(file)

    event.target.value = ''
  }

  const handleCropComplete = (
    image: string
  ) => {
    setAvatarSrc(image)
    setCropOpen(false)
    setSelectedImage(null)
  }

  const handleCropClose = () => {
    setCropOpen(false)
    setSelectedImage(null)
  }

  const handleResetAvatar = () => {
    setAvatarSrc(originalAvatarSrc)
  }

  /* =========================================================
     USERNAME
  ========================================================= */

  const handleUsernameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const cleanUsername =
      event.target.value
        .toLowerCase()
        .replace(/\s/g, '')
        .replace(/[^a-z0-9._]/g, '')

    setUsername(cleanUsername)

    // Username berubah, hasil pengecekan sebelumnya
    // tidak lagi dianggap valid.
    setUsernameStatus('idle')
    setUsernameError('')
  }

  const checkUsernameAvailability =
    async () => {
      const cleanUsername =
        username.trim()

      /* -----------------------------------------
         VALIDATION
      ----------------------------------------- */

      if (!cleanUsername) {
        setUsernameError(
          'Username wajib diisi.'
        )

        setUsernameStatus('unavailable')

        return
      }

      if (cleanUsername.length < 4) {
        setUsernameError(
          'Username minimal 4 karakter.'
        )

        setUsernameStatus('unavailable')

        return
      }

      if (cleanUsername.length > 20) {
        setUsernameError(
          'Username maksimal 20 karakter.'
        )

        setUsernameStatus('unavailable')

        return
      }

      if (
        !/^[a-z0-9._]+$/.test(
          cleanUsername
        )
      ) {
        setUsernameError(
          'Username hanya boleh berisi huruf kecil, angka, titik, dan underscore.'
        )

        setUsernameStatus('unavailable')

        return
      }

      setUsernameError('')
      setUsernameStatus('checking')

      /* -----------------------------------------
         DUMMY CHECK

         Nanti ganti bagian ini dengan request
         ke API / Server Action Prisma.
         ----------------------------------------- */

      await new Promise(resolve =>
        setTimeout(resolve, 900)
      )

      const unavailableUsernames = [
        'admin',
        'administrator',
        'diskop',
        'pelatih',
        'instruktur',
        'natasya_deviana',
        'ahmad.fauzan',
        'siti.rahma'
      ]

      const isAvailable =
        !unavailableUsernames.includes(
          cleanUsername
        )

      if (isAvailable) {
        setUsernameStatus('available')
        setUsernameError('')

        return
      }

      setUsernameStatus('unavailable')

      setUsernameError(
        'Username sudah digunakan. Silakan pilih username lain.'
      )
    }

  /* =========================================================
     PASSWORD STRENGTH
  ========================================================= */

  const getPasswordStrength = () => {
    if (!password) return 0

    let strength = 0

    if (password.length >= 8)
      strength++

    if (/[A-Z]/.test(password))
      strength++

    if (/[a-z]/.test(password))
      strength++

    if (/\d/.test(password))
      strength++

    if (/[^A-Za-z0-9]/.test(password))
      strength++

    return strength
  }

  const passwordStrength =
    getPasswordStrength()

  const passwordStrengthLabel =
    passwordStrength <= 1
      ? 'Lemah'
      : passwordStrength === 2
        ? 'Cukup'
        : passwordStrength === 3
          ? 'Baik'
          : 'Kuat'

  const passwordMatch =
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation

  const passwordMismatch =
    passwordConfirmation.length > 0 &&
    password !== passwordConfirmation

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <div className={styles.accountWrapper}>

        {/* =====================================================
            CREATE INFO
        ====================================================== */}

        {mode === 'create' && (
          <Alert
            severity='info'
            icon={
              <i className='tabler-info-circle' />
            }
            className={styles.accountAlert}
          >
            Akun pelatih akan digunakan untuk
            masuk ke sistem DISKOP. Pastikan
            username dan email yang digunakan
            belum terdaftar.
          </Alert>
        )}

        <Card className={styles.accountCard}>

          {/* ===================================================
              PROFILE PHOTO
          ==================================================== */}

          <CardContent
            className={styles.avatarSection}
          >
            <div
              className={
                styles.avatarPreviewWrapper
              }
            >
              <div
                className={styles.avatarGlow}
              />

              <img
                src={avatarSrc}
                alt='Foto profil pelatih'
                className={styles.avatarPreview}
              />

              <button
                type='button'
                className={
                  styles.avatarEditButton
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
                aria-label='Ganti foto profil'
              >
                <i className='tabler-camera' />
              </button>
            </div>

            <div
              className={styles.avatarContent}
            >
              <div
                className={
                  styles.avatarTitleRow
                }
              >
                <Typography
                  variant='h6'
                  className={styles.avatarTitle}
                >
                  Foto Profil
                </Typography>

                <Chip
                  size='small'
                  label='Pribadi'
                  icon={
                    <i className='tabler-lock text-sm' />
                  }
                  variant='tonal'
                  color='secondary'
                />
              </div>

              <Typography
                variant='body2'
                color='text.secondary'
                className={
                  styles.avatarDescription
                }
              >
                Gunakan foto yang jelas dan mudah
                dikenali. Foto ini akan digunakan
                sebagai identitas pelatih di sistem
                DISKOP.
              </Typography>

              <div
                className={
                  styles.avatarActions
                }
              >
                <Button
                  variant='contained'
                  startIcon={
                    <i className='tabler-upload' />
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Ganti Foto
                </Button>

                <Button
                  variant='tonal'
                  color='secondary'
                  startIcon={
                    <i className='tabler-refresh' />
                  }
                  onClick={
                    handleResetAvatar
                  }
                  disabled={
                    avatarSrc ===
                    originalAvatarSrc
                  }
                >
                  Reset
                </Button>

                <input
                  ref={fileInputRef}
                  hidden
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  onChange={
                    handleAvatarChange
                  }
                />
              </div>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                JPG, PNG, atau WebP · Maksimal
                3 MB · Rasio 1:1
              </Typography>
            </div>
          </CardContent>

          <Divider />

          {/* ===================================================
              ACCOUNT FIELDS
          ==================================================== */}

          <CardContent>
            <Grid container spacing={5}>

              {/* =================================================
                  USERNAME
              ================================================== */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >
                <Typography
                  component='label'
                  className={styles.fieldLabel}
                >
                  Username{' '}
                  <span
                    className={
                      styles.requiredMark
                    }
                  >
                    *
                  </span>
                </Typography>

                <div
                  className={
                    styles.usernameRow
                  }
                >
                  <div
                    className={
                      styles.usernameInputWrapper
                    }
                  >
                    <CustomTextField
                      fullWidth
                      value={username}
                      error={
                        usernameStatus ===
                        'unavailable' &&
                        Boolean(
                          usernameError
                        )
                      }
                      placeholder='contoh: ahmad.fauzan'
                      onChange={
                        handleUsernameChange
                      }
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='tabler-at' />
                            </InputAdornment>
                          ),

                          endAdornment:
                            usernameStatus ===
                            'available' ? (
                              <InputAdornment position='end'>
                                <span
                                  className={
                                    styles.successIndicator
                                  }
                                >
                                  <i className='tabler-check' />
                                </span>
                              </InputAdornment>
                            ) : usernameStatus ===
                            'unavailable' ? (
                              <InputAdornment position='end'>
                                <span
                                  className={
                                    styles.errorIndicator
                                  }
                                >
                                  <i className='tabler-x' />
                                </span>
                              </InputAdornment>
                            ) : undefined
                        }
                      }}
                    />
                  </div>

                  <Button
                    variant='tonal'
                    color={
                      usernameStatus ===
                      'available'
                        ? 'success'
                        : 'primary'
                    }
                    className={
                      usernameStatus ===
                      'checking'
                        ? `${styles.checkUsernameButton} ${styles.checkingButton}`
                        : styles.checkUsernameButton
                    }
                    disabled={
                      usernameStatus ===
                      'checking' ||
                      !username.trim()
                    }
                    onClick={
                      checkUsernameAvailability
                    }
                  >
                    {usernameStatus ===
                    'checking' ? (
                      <>
                        <CircularProgress
                          size={15}
                          color='inherit'
                        />

                        <span>
                          Mengecek
                        </span>
                      </>
                    ) : usernameStatus ===
                    'available' ? (
                      <>
                        <i className='tabler-circle-check' />

                        <span>
                          Tersedia
                        </span>
                      </>
                    ) : (
                      <>
                        <i className='tabler-scan' />

                        <span>
                          Cek Username
                        </span>
                      </>
                    )}
                  </Button>
                </div>

                {usernameError ? (
                  <Typography
                    className={
                      styles.errorText
                    }
                  >
                    <i className='tabler-alert-circle' />

                    <span>
                      {usernameError}
                    </span>
                  </Typography>
                ) : usernameStatus ===
                'available' ? (
                  <Typography
                    className={
                      styles.successText
                    }
                  >
                    <i className='tabler-circle-check' />

                    <span>
                      Username tersedia dan
                      dapat digunakan.
                    </span>
                  </Typography>
                ) : (
                  <Typography
                    className={
                      styles.helperText
                    }
                  >
                    4–20 karakter · huruf kecil ·
                    angka · titik atau underscore
                  </Typography>
                )}
              </Grid>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >
                <Typography
                  component='label'
                  className={styles.fieldLabel}
                >
                  Email
                </Typography>

                <CustomTextField
                  fullWidth
                  type='email'
                  value={email}
                  placeholder='nama@example.com'
                  onChange={event =>
                    setEmail(
                      event.target.value
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-mail' />
                        </InputAdornment>
                      )
                    }
                  }}
                />

                <Typography
                  className={
                    styles.helperText
                  }
                >
                  Digunakan untuk komunikasi dan
                  pemulihan akun.
                </Typography>
              </Grid>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >
                <Typography
                  component='label'
                  className={styles.fieldLabel}
                >
                  Kata Sandi{' '}
                  {mode === 'create' && (
                    <span
                      className={
                        styles.requiredMark
                      }
                    >
                      *
                    </span>
                  )}
                </Typography>

                <CustomTextField
                  fullWidth
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  placeholder={
                    mode === 'edit'
                      ? 'Kosongkan jika tidak diubah'
                      : 'Masukkan kata sandi'
                  }
                  helperText={
                    mode === 'edit'
                      ? 'Kosongkan jika kata sandi tidak ingin diubah.'
                      : 'Minimal 8 karakter.'
                  }
                  onChange={event =>
                    setPassword(
                      event.target.value
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-lock' />
                        </InputAdornment>
                      ),

                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            size='small'
                            onClick={() =>
                              setShowPassword(
                                prev =>
                                  !prev
                              )
                            }
                            onMouseDown={event =>
                              event.preventDefault()
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
                        </InputAdornment>
                      )
                    }
                  }}
                />

                {password && (
                  <>
                    <div
                      className={
                        styles.passwordStrength
                      }
                    >
                      <div
                        className={
                          styles.passwordStrengthBars
                        }
                      >
                        {[1, 2, 3, 4, 5].map(
                          level => (
                            <span
                              key={level}
                              className={
                                styles.passwordStrengthBar
                              }
                            >
                              <span
                                className={
                                  styles.passwordStrengthFill
                                }
                                style={{
                                  width:
                                    passwordStrength >=
                                    level
                                      ? '100%'
                                      : '0%',
                                  backgroundColor:
                                    passwordStrength <=
                                    1
                                      ? 'var(--mui-palette-error-main)'
                                      : passwordStrength ===
                                      2
                                        ? 'var(--mui-palette-warning-main)'
                                        : passwordStrength ===
                                        3
                                          ? 'var(--mui-palette-info-main)'
                                          : 'var(--mui-palette-success-main)'
                                }}
                              />
                            </span>
                          )
                        )}
                      </div>

                      <Typography
                        variant='caption'
                        color='text.secondary'
                      >
                        {
                          passwordStrengthLabel
                        }
                      </Typography>
                    </div>

                    <div
                      className={
                        styles.passwordRequirements
                      }
                    >
                      <Typography
                        variant='caption'
                        color={
                          password.length >=
                          8
                            ? 'success.main'
                            : 'text.secondary'
                        }
                        className={
                          styles.passwordRequirement
                        }
                      >
                        <i
                          className={
                            password.length >=
                            8
                              ? 'tabler-check'
                              : 'tabler-circle'
                          }
                        />
                        8+ karakter
                      </Typography>

                      <Typography
                        variant='caption'
                        color={
                          /[A-Z]/.test(
                            password
                          )
                            ? 'success.main'
                            : 'text.secondary'
                        }
                        className={
                          styles.passwordRequirement
                        }
                      >
                        <i
                          className={
                            /[A-Z]/.test(
                              password
                            )
                              ? 'tabler-check'
                              : 'tabler-circle'
                          }
                        />
                        Huruf besar
                      </Typography>

                      <Typography
                        variant='caption'
                        color={
                          /\d/.test(
                            password
                          )
                            ? 'success.main'
                            : 'text.secondary'
                        }
                        className={
                          styles.passwordRequirement
                        }
                      >
                        <i
                          className={
                            /\d/.test(
                              password
                            )
                              ? 'tabler-check'
                              : 'tabler-circle'
                          }
                        />
                        Angka
                      </Typography>
                    </div>
                  </>
                )}
              </Grid>

              {/* =================================================
                  CONFIRM PASSWORD
              ================================================== */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >
                <Typography
                  component='label'
                  className={styles.fieldLabel}
                >
                  Konfirmasi Kata Sandi{' '}
                  {mode === 'create' && (
                    <span
                      className={
                        styles.requiredMark
                      }
                    >
                      *
                    </span>
                  )}
                </Typography>

                <CustomTextField
                  fullWidth
                  type={
                    showPasswordConfirmation
                      ? 'text'
                      : 'password'
                  }
                  value={
                    passwordConfirmation
                  }
                  placeholder='Ulangi kata sandi'
                  error={passwordMismatch}
                  helperText={
                    passwordMismatch
                      ? 'Konfirmasi kata sandi tidak cocok.'
                      : 'Masukkan kembali kata sandi yang sama.'
                  }
                  onChange={event =>
                    setPasswordConfirmation(
                      event.target.value
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-lock-check' />
                        </InputAdornment>
                      ),

                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            size='small'
                            onClick={() =>
                              setShowPasswordConfirmation(
                                prev =>
                                  !prev
                              )
                            }
                            onMouseDown={event =>
                              event.preventDefault()
                            }
                          >
                            <i
                              className={
                                showPasswordConfirmation
                                  ? 'tabler-eye-off'
                                  : 'tabler-eye'
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />

                {passwordMatch && (
                  <div
                    className={
                      styles.passwordMatch
                    }
                  >
                    <i className='tabler-circle-check text-success' />

                    <Typography
                      variant='caption'
                      color='success.main'
                    >
                      Kata sandi cocok
                    </Typography>
                  </div>
                )}
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </div>

      {/* =======================================================
          CROP DIALOG
      ======================================================== */}

      <ProfileImageCropDialog
        open={cropOpen}
        image={selectedImage}
        onClose={handleCropClose}
        onComplete={handleCropComplete}
      />
    </>
  )
}

export default InstructorAccount

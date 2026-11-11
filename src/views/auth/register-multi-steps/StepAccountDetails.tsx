'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { RegisterFormData } from '@/types/register'

// Style Imports
import styles from './styles.module.css'

type UsernameStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'

type FormErrors = {
  username?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

type AccountFormData = RegisterFormData['account']

type StepAccountDetailsProps = {
  value: AccountFormData
  onChange: (data: Partial<AccountFormData>) => void
  handleNext: () => void
}

const RequiredLabel = ({
                         children
                       }: {
  children: string
}) => (
  <span>
    {children}{' '}
    <span className={styles.requiredMark}>*</span>
  </span>
)

/**
 * Format nomor HP yang disimpan tanpa prefix negara.
 *
 * Input:
 * 85136373842
 *
 * Output:
 * 8513 6373 842
 */
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 12)

  if (digits.length <= 4) {
    return digits
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`
  }

  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`
}

const StepAccountDetails = ({
                              value,
                              onChange,
                              handleNext
                            }: StepAccountDetailsProps) => {
  // =========================================================
  // Local UI States
  // =========================================================

  /**
   * State yang bersifat UI saja tetap lokal.
   *
   * Jangan dipindahkan ke RegisterMultiSteps karena state ini
   * tidak termasuk data registrasi.
   */

    // Password Visibility
  const [isPasswordShown, setIsPasswordShown] =
      useState(false)

  const [
    isConfirmPasswordShown,
    setIsConfirmPasswordShown
  ] = useState(false)

  // Username Availability
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>('idle')

  // Validation
  const [errors, setErrors] =
    useState<FormErrors>({})

  const [shake, setShake] = useState(false)

  // =========================================================
  // Password Strength
  // =========================================================

  const passwordStrength = useMemo(() => {
    let score = 0

    if (value.password.length >= 8) {
      score++
    }

    if (/[A-Z]/.test(value.password)) {
      score++
    }

    if (
      /[a-z]/.test(value.password) &&
      /\d/.test(value.password)
    ) {
      score++
    }

    if (/[^A-Za-z0-9]/.test(value.password)) {
      score++
    }

    return score
  }, [value.password])

  const passwordStrengthLabel = useMemo(() => {
    if (!value.password) {
      return ''
    }

    if (passwordStrength <= 1) {
      return 'Lemah'
    }

    if (passwordStrength === 2) {
      return 'Cukup'
    }

    if (passwordStrength === 3) {
      return 'Kuat'
    }

    return 'Sangat kuat'
  }, [value.password, passwordStrength])

  // =========================================================
  // Helpers
  // =========================================================

  const clearError = (
    field: keyof FormErrors
  ) => {
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }))
  }

  // =========================================================
  // Username
  // =========================================================

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const username = event.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/[^a-z0-9._]/g, '')

    onChange({
      username
    })

    // Username berubah = hasil pengecekan sebelumnya
    // sudah tidak valid lagi.
    setUsernameStatus('idle')

    clearError('username')
  }

  // =========================================================
  // Phone
  // =========================================================

  const handlePhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let phone = event.target.value.replace(
      /\D/g,
      ''
    )

    /*
     * User cukup mengetik:
     *
     * 85136373842
     *
     * Tapi kita juga toleransi kalau user paste:
     *
     * 085136373842
     * 6285136373842
     */

    // Remove Indonesian local prefix
    if (phone.startsWith('0')) {
      phone = phone.slice(1)
    }

    // Remove country prefix
    if (phone.startsWith('62')) {
      phone = phone.slice(2)
    }

    // Setelah prefix dibuang, nomor Indonesia
    // harus dimulai dengan angka 8.
    if (phone && !phone.startsWith('8')) {
      return
    }

    // Maksimal 12 digit setelah angka 8.
    phone = phone.slice(0, 12)

    onChange({
      phone
    })

    clearError('phone')
  }

  // =========================================================
  // Username Availability
  // =========================================================

  const checkUsernameAvailability =
    async () => {
      const cleanUsername =
        value.username.trim()

      if (!cleanUsername) {
        setErrors(prev => ({
          ...prev,
          username:
            'Username wajib diisi.'
        }))

        return
      }

      if (cleanUsername.length < 4) {
        setErrors(prev => ({
          ...prev,
          username:
            'Username minimal 4 karakter.'
        }))

        return
      }

      if (
        !/^[a-z0-9._]+$/.test(
          cleanUsername
        )
      ) {
        setErrors(prev => ({
          ...prev,
          username:
            'Username hanya boleh berisi huruf kecil, angka, titik, dan underscore.'
        }))

        return
      }

      clearError('username')

      setUsernameStatus('checking')

      /*
       * TODO:
       * Ganti bagian ini dengan API sebenarnya.
       *
       * Contoh:
       *
       * const response = await fetch(
       *   `/api/auth/check-username?username=${encodeURIComponent(cleanUsername)}`
       * )
       *
       * const data = await response.json()
       */

      await new Promise(resolve =>
        setTimeout(resolve, 900)
      )

      // Dummy data sementara.
      const unavailableUsernames = [
        'admin',
        'administrator',
        'diskop',
        'peserta',
        'natasya_deviana'
      ]

      const available =
        !unavailableUsernames.includes(
          cleanUsername
        )

      if (available) {
        setUsernameStatus('available')

        return
      }

      setUsernameStatus(
        'unavailable'
      )

      setErrors(prev => ({
        ...prev,
        username:
          'Username sudah digunakan. Silakan pilih username lain.'
      }))
    }

  // =========================================================
  // Validation
  // =========================================================

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Username
    if (!value.username.trim()) {
      newErrors.username =
        'Username wajib diisi.'
    } else if (value.username.length < 4) {
      newErrors.username =
        'Username minimal 4 karakter.'
    } else if (
      usernameStatus !== 'available'
    ) {
      newErrors.username =
        'Silakan cek ketersediaan username terlebih dahulu.'
    }

    // Email
    if (!value.email.trim()) {
      newErrors.email =
        'Email wajib diisi.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value.email
      )
    ) {
      newErrors.email =
        'Format email tidak valid.'
    }

    // Phone
    if (!value.phone) {
      newErrors.phone =
        'Nomor HP wajib diisi.'
    } else if (
      !/^8\d{9,11}$/.test(value.phone)
    ) {
      newErrors.phone =
        'Masukkan nomor HP yang valid, contoh 8513 6373 842.'
    }

    // Password
    if (!value.password) {
      newErrors.password =
        'Password wajib diisi.'
    } else if (value.password.length < 8) {
      newErrors.password =
        'Password minimal 8 karakter.'
    }

    // Confirm Password
    if (!value.passwordConfirmation) {
      newErrors.confirmPassword =
        'Konfirmasi password wajib diisi.'
    } else if (
      value.passwordConfirmation !==
      value.password
    ) {
      newErrors.confirmPassword =
        'Konfirmasi password tidak sama.'
    }

    setErrors(newErrors)

    return (
      Object.keys(newErrors).length === 0
    )
  }

  // =========================================================
  // Submit
  // =========================================================

  const handleSubmit = () => {
    if (!validateForm()) {
      setShake(false)

      requestAnimationFrame(() => {
        setShake(true)

        window.setTimeout(() => {
          setShake(false)
        }, 500)
      })

      return
    }

    handleNext()
  }

  const passwordMatch =
    Boolean(value.passwordConfirmation) &&
    value.password ===
    value.passwordConfirmation

  // =========================================================
  // Render
  // =========================================================

  return (
    <div
      className={
        shake
          ? `${styles.formWrapper} ${styles.formShake}`
          : styles.formWrapper
      }
    >
      {/* ==================================================
          HEADING
          ================================================== */}

      <div className={styles.stepHeading}>
        <div className={styles.stepHeadingIcon}>
          <span className={styles.iconAura} />

          <i className='tabler-user-plus' />
        </div>

        <div className={styles.headingText}>
          <Typography
            variant='h4'
            className={styles.stepTitle}
          >
            Buat Akun DISKOP
          </Typography>

          <Typography
            color='text.secondary'
            className={
              styles.stepDescription
            }
          >
            Siapkan akun Anda untuk mengakses
            seluruh layanan dan program
            pelatihan DISKOP.
          </Typography>
        </div>
      </div>

      <Grid container spacing={5}>
        {/* ==================================================
            USERNAME
            ================================================== */}

        <Grid
          size={{ xs: 12 }}
          className={styles.fieldItem}
        >
          <div className={styles.fieldHeader}>
            <Typography
              component='label'
              className={styles.fieldLabel}
            >
              <RequiredLabel>
                Username
              </RequiredLabel>
            </Typography>

            <div
              className={
                usernameStatus ===
                'available'
                  ? styles.availableStatus
                  : usernameStatus ===
                  'checking'
                    ? styles.checkingStatus
                    : styles.statusPlaceholder
              }
            >
              {usernameStatus ===
                'available' && (
                  <>
                    <i className='tabler-circle-check-filled' />
                    Username tersedia
                  </>
                )}

              {usernameStatus ===
                'checking' && (
                  <>
                  <span
                    className={
                      styles.statusPulse
                    }
                  />

                    Memeriksa...
                  </>
                )}
            </div>
          </div>

          <div className={styles.usernameRow}>
            <div className={styles.inputShell}>
              <CustomTextField
                fullWidth
                value={value.username}
                error={Boolean(
                  errors.username
                )}
                placeholder='contoh: rizkifirdaus'
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
                !value.username.trim()
              }
              onClick={
                checkUsernameAvailability
              }
            >
              {usernameStatus ===
              'checking' ? (
                <>
                  <CircularProgress
                    size={16}
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

          {errors.username ? (
            <Typography
              className={
                styles.errorText
              }
            >
              <i className='tabler-alert-circle' />

              <span>
                {errors.username}
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

        {/* ==================================================
            EMAIL
            ================================================== */}

        <Grid
          size={{ xs: 12, sm: 6 }}
          className={styles.fieldItem}
        >
          <Typography
            component='label'
            className={styles.fieldLabel}
          >
            <RequiredLabel>
              Email
            </RequiredLabel>
          </Typography>

          <CustomTextField
            fullWidth
            type='email'
            value={value.email}
            error={Boolean(
              errors.email
            )}
            placeholder='nama@email.com'
            onChange={event => {
              onChange({
                email:
                event.target.value
              })

              clearError('email')
            }}
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

          {errors.email ? (
            <Typography
              className={
                styles.errorText
              }
            >
              <i className='tabler-alert-circle' />

              <span>
                {errors.email}
              </span>
            </Typography>
          ) : (
            <Typography
              className={
                styles.helperText
              }
            >
              Gunakan email yang masih aktif.
            </Typography>
          )}
        </Grid>

        {/* ==================================================
            PHONE
            ================================================== */}

        <Grid
          size={{ xs: 12, sm: 6 }}
          className={styles.fieldItem}
        >
          <Typography
            component='label'
            className={styles.fieldLabel}
          >
            <RequiredLabel>
              Nomor HP
            </RequiredLabel>
          </Typography>

          <CustomTextField
            fullWidth
            value={formatPhoneNumber(
              value.phone
            )}
            error={Boolean(
              errors.phone
            )}
            placeholder='8513 6373 842'
            inputMode='numeric'
            onChange={
              handlePhoneChange
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <span
                      className={
                        styles.indonesiaPrefix
                      }
                    >
                      +62
                    </span>
                  </InputAdornment>
                )
              }
            }}
          />

          {errors.phone ? (
            <Typography
              className={
                styles.errorText
              }
            >
              <i className='tabler-alert-circle' />

              <span>
                {errors.phone}
              </span>
            </Typography>
          ) : (
            <Typography
              className={
                styles.helperText
              }
            >
              Masukkan nomor HP tanpa 0.
              Contoh: 8513 6373 842
            </Typography>
          )}
        </Grid>

        {/* ==================================================
            PASSWORD
            ================================================== */}

        <Grid
          size={{ xs: 12, sm: 6 }}
          className={styles.fieldItem}
        >
          <Typography
            component='label'
            className={styles.fieldLabel}
          >
            <RequiredLabel>
              Password
            </RequiredLabel>
          </Typography>

          <CustomTextField
            fullWidth
            value={value.password}
            error={Boolean(
              errors.password
            )}
            placeholder='••••••••••••'
            type={
              isPasswordShown
                ? 'text'
                : 'password'
            }
            onChange={event => {
              onChange({
                password:
                event.target.value
              })

              clearError('password')

              if (
                value.passwordConfirmation
              ) {
                clearError(
                  'confirmPassword'
                )
              }
            }}
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
                      className={
                        styles.passwordToggle
                      }
                      onClick={() =>
                        setIsPasswordShown(
                          prev => !prev
                        )
                      }
                      onMouseDown={event =>
                        event.preventDefault()
                      }
                    >
                      <i
                        className={
                          isPasswordShown
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

          {errors.password ? (
            <Typography
              className={
                styles.errorText
              }
            >
              <i className='tabler-alert-circle' />

              <span>
                {errors.password}
              </span>
            </Typography>
          ) : value.password ? (
            <div
              className={
                styles.passwordStrength
              }
            >
              <div
                className={
                  styles.strengthInfo
                }
              >
                <div
                  className={
                    styles.strengthBars
                  }
                >
                  {[1, 2, 3, 4].map(
                    item => (
                      <span
                        key={item}
                        className={
                          item <=
                          passwordStrength
                            ? styles.strengthBarActive
                            : styles.strengthBar
                        }
                      />
                    )
                  )}
                </div>

                <span
                  className={
                    styles.strengthLabel
                  }
                >
                  {
                    passwordStrengthLabel
                  }
                </span>
              </div>
            </div>
          ) : (
            <Typography
              className={
                styles.helperText
              }
            >
              Minimal 8 karakter.
            </Typography>
          )}
        </Grid>

        {/* ==================================================
            CONFIRM PASSWORD
            ================================================== */}

        <Grid
          size={{ xs: 12, sm: 6 }}
          className={styles.fieldItem}
        >
          <Typography
            component='label'
            className={styles.fieldLabel}
          >
            <RequiredLabel>
              Konfirmasi Password
            </RequiredLabel>
          </Typography>

          <CustomTextField
            fullWidth
            value={
              value.passwordConfirmation
            }
            error={Boolean(
              errors.confirmPassword
            )}
            placeholder='••••••••••••'
            type={
              isConfirmPasswordShown
                ? 'text'
                : 'password'
            }
            onChange={event => {
              onChange({
                passwordConfirmation:
                event.target.value
              })

              clearError(
                'confirmPassword'
              )
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-lock-check' />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position='end'>
                    {passwordMatch && (
                      <span
                        className={
                          styles.successIndicator
                        }
                      >
                        <i className='tabler-check' />
                      </span>
                    )}

                    <IconButton
                      edge='end'
                      size='small'
                      className={
                        styles.passwordToggle
                      }
                      onClick={() =>
                        setIsConfirmPasswordShown(
                          prev => !prev
                        )
                      }
                      onMouseDown={event =>
                        event.preventDefault()
                      }
                    >
                      <i
                        className={
                          isConfirmPasswordShown
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

          {errors.confirmPassword ? (
            <Typography
              className={
                styles.errorText
              }
            >
              <i className='tabler-alert-circle' />

              <span>
                {errors.confirmPassword}
              </span>
            </Typography>
          ) : passwordMatch ? (
            <Typography
              className={
                styles.matchSuccess
              }
            >
              <i className='tabler-circle-check-filled' />

              Password cocok
            </Typography>
          ) : (
            <Typography
              className={
                styles.helperText
              }
            >
              Masukkan password yang sama.
            </Typography>
          )}
        </Grid>

        {/* ==================================================
            ACTION
            ================================================== */}

        <Grid
          size={{ xs: 12 }}
          className={styles.actionItem}
        >
          <div
            className={
              styles.accountFooter
            }
          >
            <div
              className={
                styles.securityNote
              }
            >
              <div
                className={
                  styles.securityIcon
                }
              >
                <i className='tabler-shield-lock' />
              </div>

              <div>
                <Typography
                  variant='body2'
                  className={
                    styles.securityTitle
                  }
                >
                  Data Anda terlindungi
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Informasi akun digunakan
                  untuk akses layanan DISKOP.
                </Typography>
              </div>
            </div>

            <Button
              variant='contained'
              size='large'
              onClick={handleSubmit}
              className={
                styles.nextButton
              }
              endIcon={
                <DirectionalIcon
                  ltrIconClass='tabler-arrow-right'
                  rtlIconClass='tabler-arrow-left'
                />
              }
            >
              Lanjutkan
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default StepAccountDetails

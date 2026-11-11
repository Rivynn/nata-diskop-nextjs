'use client'

import { useEffect, useMemo, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'

import type { UsersType } from '@/types/apps/userTypes'

import CustomTextField from '@core/components/mui/TextField'

import styles from './ChangePasswordDialog.module.css'

type Props = {
  open: boolean
  user: UsersType | null
  onClose: () => void
  onSubmit: (password: string) => void
}

const generatePassword = () => {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

const ChangePasswordDialog = ({
                                open,
                                user,
                                onClose,
                                onSubmit
                              }: Props) => {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] =
    useState(false)

  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    if (!open) return

    setPassword('')
    setPasswordConfirmation('')
    setShowPassword(false)
    setShowConfirmation(false)
    setGenerated(false)
  }, [open, user])

  const passwordStrength = useMemo(() => {
    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (!password) {
      return {
        score: 0,
        label: 'Belum diisi'
      }
    }

    if (score <= 2) {
      return {
        score,
        label: 'Lemah'
      }
    }

    if (score <= 4) {
      return {
        score,
        label: 'Sedang'
      }
    }

    return {
      score,
      label: 'Kuat'
    }
  }, [password])

  const isPasswordValid =
    password.length >= 8 &&
    password === passwordConfirmation

  const isConfirmationMismatch =
    passwordConfirmation.length > 0 &&
    password !== passwordConfirmation

  const handleGenerate = () => {
    const generatedPassword = generatePassword()

    setPassword(generatedPassword)
    setPasswordConfirmation(generatedPassword)

    setShowPassword(true)
    setShowConfirmation(true)
    setGenerated(true)
  }

  const handleSubmit = () => {
    if (!isPasswordValid) return

    onSubmit(password)
  }

  const handleClose = () => {
    setPassword('')
    setPasswordConfirmation('')
    setShowPassword(false)
    setShowConfirmation(false)
    setGenerated(false)

    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      className={styles.changePasswordDialog}
      slotProps={{
        paper: {
          className: styles.changePasswordPaper
        }
      }}
    >
      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <div className={styles.changePasswordAccent} />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <DialogTitle className={styles.changePasswordHeader}>
        <div className={styles.changePasswordHeaderContent}>
          <div className={styles.changePasswordHeaderLeft}>
            <div className={styles.changePasswordHeaderIcon}>
              <i className='tabler-lock' />
            </div>

            <div className={styles.changePasswordHeaderText}>
              <div className={styles.changePasswordEyebrow}>
                KEAMANAN AKUN
              </div>

              <Typography
                variant='h5'
                className={styles.changePasswordTitle}
              >
                Ubah Password
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className={styles.changePasswordSubtitle}
              >
                Atur password baru untuk menjaga keamanan
                akun pengguna.
              </Typography>
            </div>
          </div>

          <IconButton
            onClick={handleClose}
            className={styles.changePasswordCloseButton}
            aria-label='Tutup'
          >
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <Divider />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DialogContent className={styles.changePasswordContent}>
        {user && (
          <div className={styles.changePasswordContentInner}>
            {/* =================================================
                USER IDENTITY
            ================================================= */}

            <div className={styles.changePasswordUserCard}>
              <div className={styles.changePasswordUserGlow} />

              <div className={styles.changePasswordUserAvatar}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                  />
                ) : (
                  <i className='tabler-user' />
                )}

                <span
                  className={
                    styles.changePasswordUserOnline
                  }
                />
              </div>

              <div className={styles.changePasswordUserInfo}>
                <Typography
                  variant='subtitle1'
                  className={styles.changePasswordUserName}
                >
                  {user.fullName}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={styles.changePasswordUsername}
                >
                  @{user.username}
                </Typography>
              </div>

              <div className={styles.changePasswordSecurityBadge}>
                <i className='tabler-shield-check' />

                <span>
                  Akun terlindungi
                </span>
              </div>
            </div>

            {/* =================================================
                PASSWORD SECTION
            ================================================= */}

            <div className={styles.changePasswordSection}>
              <div className={styles.changePasswordSectionHeader}>
                <div>
                  <Typography
                    variant='h6'
                    className={
                      styles.changePasswordSectionTitle
                    }
                  >
                    Password Baru
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className={
                      styles.changePasswordSectionSubtitle
                    }
                  >
                    Gunakan kombinasi password yang kuat
                    dan sulit ditebak.
                  </Typography>
                </div>

                <div
                  className={
                    styles.changePasswordSecurityIcon
                  }
                >
                  <i className='tabler-key' />
                </div>
              </div>

              {/* =================================================
                  PASSWORD INPUT
              ================================================= */}

              <div className={styles.changePasswordFieldGroup}>
                <CustomTextField
                  fullWidth
                  label='Password Baru'
                  placeholder='Masukkan password baru'
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value)
                    setGenerated(false)
                  }}
                  helperText='Minimal 8 karakter'
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() =>
                              setShowPassword(
                                previous =>
                                  !previous
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

                {/* Password Strength */}
                {password.length > 0 && (
                  <div
                    className={
                      styles.changePasswordStrength
                    }
                  >
                    <div
                      className={
                        styles.changePasswordStrengthHeader
                      }
                    >
                      <span>
                        Kekuatan password
                      </span>

                      <strong
                        className={
                          styles[
                            `changePasswordStrengthLabel${
                              passwordStrength.label
                            }`
                            ]
                        }
                      >
                        {passwordStrength.label}
                      </strong>
                    </div>

                    <div
                      className={
                        styles.changePasswordStrengthBars
                      }
                    >
                      {Array.from(
                        { length: 6 },
                        (_, index) => (
                          <span
                            key={index}
                            className={
                              index <
                              passwordStrength.score
                                ? styles.changePasswordStrengthBarActive
                                : styles.changePasswordStrengthBar
                            }
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* =================================================
                    CONFIRMATION
                ================================================= */}

                <CustomTextField
                  fullWidth
                  label='Konfirmasi Password'
                  placeholder='Masukkan ulang password'
                  type={
                    showConfirmation
                      ? 'text'
                      : 'password'
                  }
                  value={passwordConfirmation}
                  onChange={event =>
                    setPasswordConfirmation(
                      event.target.value
                    )
                  }
                  error={isConfirmationMismatch}
                  helperText={
                    isConfirmationMismatch
                      ? 'Konfirmasi password tidak cocok'
                      : 'Masukkan password yang sama'
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() =>
                              setShowConfirmation(
                                previous =>
                                  !previous
                              )
                            }
                            onMouseDown={event =>
                              event.preventDefault()
                            }
                          >
                            <i
                              className={
                                showConfirmation
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
              </div>
            </div>

            {/* =================================================
                GENERATOR
            ================================================= */}

            <div
              className={
                styles.changePasswordGenerator
              }
            >
              <div
                className={
                  styles.changePasswordGeneratorIcon
                }
              >
                <i className='tabler-wand' />
              </div>

              <div
                className={
                  styles.changePasswordGeneratorContent
                }
              >
                <Typography
                  variant='body2'
                  className={
                    styles.changePasswordGeneratorTitle
                  }
                >
                  Generate password aman
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className={
                    styles.changePasswordGeneratorDescription
                  }
                >
                  Buat password acak secara otomatis
                  dengan kombinasi karakter yang lebih
                  sulit ditebak.
                </Typography>

                {generated && (
                  <span
                    className={
                      styles.changePasswordGenerated
                    }
                  >
                    <i className='tabler-check' />
                    Password berhasil dibuat
                  </span>
                )}
              </div>

              <Button
                variant='tonal'
                size='small'
                onClick={handleGenerate}
                className={
                  styles.changePasswordGenerateButton
                }
                startIcon={
                  <i className='tabler-refresh' />
                }
              >
                Generate
              </Button>
            </div>

            {/* =================================================
                SECURITY NOTICE
            ================================================= */}

            <div
              className={
                styles.changePasswordNotice
              }
            >
              <div
                className={
                  styles.changePasswordNoticeIcon
                }
              >
                <i className='tabler-shield-lock' />
              </div>

              <div
                className={
                  styles.changePasswordNoticeContent
                }
              >
                <Typography
                  variant='body2'
                  className={
                    styles.changePasswordNoticeTitle
                  }
                >
                  Informasi keamanan
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className={
                    styles.changePasswordNoticeText
                  }
                >
                  Setelah password diubah, pengguna akan
                  menggunakan password baru pada login
                  berikutnya.
                </Typography>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Divider />

      <DialogActions
        className={styles.changePasswordFooter}
      >
        <div className={styles.changePasswordFooterHint}>
          <i className='tabler-lock-check' />

          <span>
            Password akan diproses secara aman.
          </span>
        </div>

        <div className={styles.changePasswordFooterActions}>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
            className={
              styles.changePasswordCancelButton
            }
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!isPasswordValid}
            className={
              styles.changePasswordSubmitButton
            }
            startIcon={
              <i className='tabler-device-floppy' />
            }
          >
            Simpan Password
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialog

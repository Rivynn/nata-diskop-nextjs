'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useImageVariant } from '@core/hooks/useImageVariant'

// Styles
import styles from './styles.module.css'

const Login = ({ mode }: { mode: SystemMode }) => {
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [identifierError, setIdentifierError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formError, setFormError] = useState(false)

  const lightIllustration =
    '/images/illustrations/auth/login-diskop.png'

  const darkIllustration =
    '/images/illustrations/auth/v2-login-dark.png'

  const illustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration
  )

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    let hasError = false

    // ================================================================
    // IDENTIFIER VALIDATION
    // ================================================================

    if (!identifier.trim()) {
      setIdentifierError(
        'Username, email, atau NIP wajib diisi.'
      )

      hasError = true
    } else {
      setIdentifierError('')
    }

    // ================================================================
    // PASSWORD VALIDATION
    // ================================================================

    if (!password.trim()) {
      setPasswordError(
        'Password wajib diisi.'
      )

      hasError = true
    } else {
      setPasswordError('')
    }

    // ================================================================
    // STOP SUBMIT
    // ================================================================

    if (hasError) {
      setFormError(true)

      window.setTimeout(() => {
        setFormError(false)
      }, 650)

      return
    }

    // ================================================================
    // LOGIN
    // ================================================================

    setFormError(false)
    setLoading(true)

    // TODO:
    // Ganti dengan authentication API sebenarnya.

    window.setTimeout(() => {
      setLoading(false)

      router.push('/dashboard')
    }, 1600)
  }

  const handleIdentifierChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value

    setIdentifier(value)

    // Clear error ketika user mulai memperbaiki input
    if (identifierError && value.trim()) {
      setIdentifierError('')
    }
  }

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value

    setPassword(value)

    // Clear error ketika user mulai mengetik password
    if (passwordError && value.trim()) {
      setPasswordError('')
    }
  }

  const handleGoogleLogin = () => {
    if (googleLoading) return

    setGoogleLoading(true)

    // TODO:
    // Integrate Google OAuth.
    // Google login ditujukan untuk akun peserta.

    window.setTimeout(() => {
      setGoogleLoading(false)

      console.log('Google participant login')
    }, 1800)
  }

  const handlePasswordVisibility = () => {
    setIsPasswordShown(current => !current)
  }

  return (
    <div
      className={`${styles.page} ${
        settings.skin === 'bordered'
          ? styles.bordered
          : ''
      }`}
    >
      {/* ================================================================
          LEFT BRAND EXPERIENCE
      ================================================================ */}

      {!hidden && (
        <section className={styles.visualPanel}>
          {/* Atmospheric background */}
          <div className={styles.visualGlowOne} />
          <div className={styles.visualGlowTwo} />
          <div className={styles.visualGrid} />

          {/* Floating particles */}
          <span
            className={`${styles.particle} ${styles.particleOne}`}
          />

          <span
            className={`${styles.particle} ${styles.particleTwo}`}
          />

          <span
            className={`${styles.particle} ${styles.particleThree}`}
          />

          <span
            className={`${styles.particle} ${styles.particleFour}`}
          />

          <div className={styles.visualInner}>
            {/* Brand */}
            <Link
              href='/'
              className={styles.brand}
            >
              <Logo />
            </Link>

            {/* Hero copy */}
            <div className={styles.visualCopy}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowDot} />

                <span>
                  PLATFORM PENGEMBANGAN KOMPETENSI
                </span>
              </div>

              <Typography
                component='h1'
                className={styles.visualTitle}
              >
                Kembangkan kompetensi,
                <br />

                <span>
                  buka peluang baru.
                </span>
              </Typography>

              <Typography
                className={styles.visualDescription}
              >
                Temukan pelatihan yang relevan, tingkatkan
                keterampilan, dan persiapkan diri untuk
                peluang yang lebih baik bersama DISKOP.
              </Typography>
            </div>

            {/* Illustration stage */}
            <div className={styles.illustrationStage}>
              <div className={styles.illustrationGlow} />

              <div className={styles.illustrationRing} />

              <img
                src={illustration}
                alt='Platform pelatihan DISKOP'
                className={styles.illustration}
              />

              {/* Floating certificate */}
              <div
                className={`${styles.floatingCard} ${styles.certificateCard}`}
              >
                <div className={styles.floatingIcon}>
                  <i className='tabler-certificate' />
                </div>

                <div className={styles.floatingContent}>
                  <span>Sertifikat resmi</span>
                  <small>Bukti kompetensi Anda</small>
                </div>

                <div className={styles.floatingCheck}>
                  <i className='tabler-check' />
                </div>
              </div>

              {/* Floating training */}
              <div
                className={`${styles.floatingCard} ${styles.trainingCard}`}
              >
                <div className={styles.floatingIcon}>
                  <i className='tabler-school' />
                </div>

                <div className={styles.floatingContent}>
                  <span>Pelatihan tersedia</span>
                  <small>Belajar sesuai kebutuhan</small>
                </div>
              </div>

              {/* Platform status */}
              <div className={styles.statusPill}>
                <span className={styles.statusPulse} />

                <span>
                  Platform aktif
                </span>
              </div>
            </div>

            {/* Trust row */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}>
                  <i className='tabler-shield-check' />
                </div>

                <div>
                  <span>Terpercaya</span>
                  <small>Platform resmi</small>
                </div>
              </div>

              <div className={styles.trustDivider} />

              <div className={styles.trustItem}>
                <div className={styles.trustIcon}>
                  <i className='tabler-certificate' />
                </div>

                <div>
                  <span>Terukur</span>
                  <small>Kompetensi & sertifikat</small>
                </div>
              </div>

              <div className={styles.trustDivider} />

              <div className={styles.trustItem}>
                <div className={styles.trustIcon}>
                  <i className='tabler-building-community' />
                </div>

                <div>
                  <span>Terhubung</span>
                  <small>Dengan dunia kerja</small>
                </div>
              </div>
            </div>

            {/* Institutional footer */}
            <div className={styles.institution}>
              <span className={styles.institutionLine} />

              <span>
                Pemerintah Kota Banjarbaru
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          LOGIN PANEL
      ================================================================ */}

      <section
        className={`${styles.loginPanel} ${
          settings.skin === 'bordered'
            ? styles.loginPanelBordered
            : ''
        }`}
      >
        <div className={styles.loginInner}>
          {/* Mobile logo */}
          <div className={styles.mobileBrand}>
            <Link href='/'>
              <Logo />
            </Link>
          </div>

          {/* Top navigation */}
          <div className={styles.topNavigation}>
            <Link
              href='/'
              className={styles.backLink}
            >
              <span className={styles.backIcon}>
                <i className='tabler-arrow-left' />
              </span>

              <span>
                Kembali ke beranda
              </span>
            </Link>
          </div>

          {/* Login heading */}
          <div className={styles.loginHeader}>
            <div className={styles.loginBadge}>
              <span className={styles.loginBadgeIcon}>
                <i className='tabler-lock' />
              </span>

              <span>
                Akses akun
              </span>
            </div>

            <Typography
              component='h2'
              className={styles.loginTitle}
            >
              Selamat datang kembali.
            </Typography>

            <Typography
              className={styles.loginDescription}
            >
              Masuk untuk melanjutkan perjalanan
              pengembangan kompetensi Anda.
            </Typography>
          </div>

          {/* ============================================================
              LOGIN FORM
          ============================================================ */}

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}
            className={styles.form}
          >
            {/* ==========================================================
                IDENTIFIER
            ========================================================== */}

            <div className={styles.fieldGroup}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Username, Email, atau NIP'
                placeholder='Masukkan username, email, atau NIP'
                value={identifier}
                onChange={handleIdentifierChange}
                error={Boolean(identifierError)}
                helperText={identifierError}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-user text-[19px]' />
                      </InputAdornment>
                    )
                  }
                }}
              />

              {!identifierError && (
                <span className={styles.fieldHint}>
                  Gunakan akun yang terdaftar di DISKOP.
                </span>
              )}
            </div>

            {/* ==========================================================
                PASSWORD
            ========================================================== */}

            <div className={styles.fieldGroup}>
              <CustomTextField
                fullWidth
                label='Password'
                placeholder='Masukkan password'
                value={password}
                onChange={handlePasswordChange}
                type={
                  isPasswordShown
                    ? 'text'
                    : 'password'
                }
                error={Boolean(passwordError)}
                helperText={passwordError}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-lock text-[19px]' />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={
                            handlePasswordVisibility
                          }
                          onMouseDown={event =>
                            event.preventDefault()
                          }
                          className={
                            styles.passwordButton
                          }
                          aria-label={
                            isPasswordShown
                              ? 'Sembunyikan password'
                              : 'Tampilkan password'
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
            </div>

            {/* Options */}
            <div className={styles.formOptions}>
              <FormControlLabel
                control={
                  <Checkbox
                    size='small'
                    checked={rememberMe}
                    onChange={event =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />
                }
                label={
                  <span className={styles.rememberLabel}>
                    Ingat saya
                  </span>
                }
              />

              <Typography
                component={Link}
                href='/auth/forgot-password'
                className={styles.forgotLink}
              >
                Lupa password?
              </Typography>
            </div>

            {/* ==========================================================
                PREMIUM LOGIN BUTTON
            ========================================================== */}

            <Button
              fullWidth
              variant='contained'
              type='submit'
              className={`${styles.loginButton} ${
                loading
                  ? styles.loginButtonLoading
                  : ''
              } ${
                formError
                  ? styles.loginButtonError
                  : ''
              }`}
            >
              <span className={styles.loginButtonContent}>
                {loading ? (
                  <>
                    <span className={styles.loginOrbit}>
                      <span />
                      <span />
                      <span />
                    </span>

                    <span>
                      Menyiapkan ruang belajar...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Masuk ke Akun
                    </span>

                    <span className={styles.loginArrow}>
                      <i className='tabler-arrow-right' />
                    </span>
                  </>
                )}
              </span>

              <span
                className={styles.loginButtonSweep}
              />

              <span
                className={styles.loginButtonGlow}
              />
            </Button>

            {/* Divider */}
            <div className={styles.divider}>
              <Divider className='is-full' />

              <span>atau</span>

              <Divider className='is-full' />
            </div>

            {/* ==========================================================
                GOOGLE PARTICIPANT LOGIN
            ========================================================== */}

            <Button
              fullWidth
              variant='outlined'
              onClick={handleGoogleLogin}
              className={`${styles.googleButton} ${
                googleLoading
                  ? styles.googleButtonLoading
                  : ''
              }`}
            >
              <span
                className={styles.googleButtonInner}
              >
                <span className={styles.googleLogo}>
                  <span
                    className={styles.googleLogoG}
                  >
                    G
                  </span>
                </span>

                <span
                  className={styles.googleButtonText}
                >
                  <strong>
                    {googleLoading
                      ? 'Menghubungkan akun...'
                      : 'Lanjutkan dengan Google'}
                  </strong>

                  <small>
                    {googleLoading
                      ? 'Membuka autentikasi peserta'
                      : 'Akses cepat untuk peserta DISKOP'}
                  </small>
                </span>

                <span
                  className={styles.googleArrow}
                >
                  {googleLoading ? (
                    <span
                      className={
                        styles.googleSpinner
                      }
                    />
                  ) : (
                    <i className='tabler-arrow-up-right' />
                  )}
                </span>
              </span>

              <span className={styles.googleSweep} />
            </Button>

            {/* Google information */}
            <div className={styles.googleInfo}>
              <div className={styles.googleInfoIcon}>
                <i className='tabler-info-circle' />
              </div>

              <div>
                <span>
                  Login dengan Google
                </span>

                <small>
                  Tersedia khusus untuk peserta yang
                  telah memiliki akun DISKOP.
                </small>
              </div>
            </div>

            {/* ==========================================================
                REGISTER PARTICIPANT
            ========================================================== */}

            <div className={styles.registerBox}>
              <div className={styles.registerAccent} />

              <div className={styles.registerIcon}>
                <i className='tabler-sparkles' />
              </div>

              <div className={styles.registerContent}>
                <Typography
                  className={styles.registerText}
                >
                  Belum memiliki akun?
                </Typography>

                <Typography
                  className={styles.registerSubtext}
                >
                  Daftar dan mulai membangun
                  kompetensi Anda.
                </Typography>
              </div>

              <Typography
                component={Link}
                href='/auth/register'
                className={styles.registerButton}
              >
                <span>
                  Daftar Peserta
                </span>

                <span
                  className={styles.registerArrow}
                >
                  <i className='tabler-arrow-up-right' />
                </span>
              </Typography>
            </div>
          </form>

          {/* Footer */}
          <div className={styles.loginFooter}>
            <span>
              © {new Date().getFullYear()} DISKOP
            </span>

            <span className={styles.footerDot} />

            <span>
              Pemerintah Kota Banjarbaru
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login

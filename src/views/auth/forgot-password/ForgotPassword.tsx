'use client'

import { useState } from 'react'
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AuthIllustrationWrapper from '../AuthIllustrationWrapper'

// Style Imports
import styles from './styles.module.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(false)

    window.requestAnimationFrame(() => {
      setShake(true)

      window.setTimeout(() => {
        setShake(false)
      }, 550)
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = email.trim()

    if (!value) {
      setEmailError('Email wajib diisi.')
      triggerShake()

      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(value)) {
      setEmailError('Masukkan alamat email yang valid.')
      triggerShake()

      return
    }

    setEmailError('')
    setIsLoading(true)

    window.setTimeout(() => {
      setIsLoading(false)
    }, 1800)
  }

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value

    setEmail(value)

    if (emailError) {
      setEmailError('')
    }
  }

  return (
    <AuthIllustrationWrapper>
      <Card
        className={`${styles.card} ${
          shake ? styles.shake : ''
        } flex flex-col sm:is-[450px]`}
      >
        <div className={styles.cardTopLine} />

        <CardContent className={`${styles.content} sm:!p-12`}>
          {/* Logo */}
          <Link
            href='/'
            className={`${styles.logo} flex justify-center mbe-6`}
          >
            <Logo />
          </Link>

          {/* Header */}
          <div
            className={`${styles.header} flex flex-col gap-1 mbe-6`}
          >
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowIcon}>
                <i className='tabler-lock-access' />
              </span>

              <span>PEMULIHAN AKUN</span>
            </div>

            <Typography
              variant='h4'
              className={styles.title}
            >
              Lupa Password? 🔒
            </Typography>

            <Typography className={styles.description}>
              Masukkan email Anda dan kami akan mengirimkan
              instruksi untuk mengatur ulang password.
            </Typography>
          </div>

          {/* Form */}
          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}
            className={`${styles.form} flex flex-col gap-6`}
          >
            <div
              className={`${styles.fieldWrapper} ${
                emailError ? styles.fieldError : ''
              }`}
            >
              <CustomTextField
                autoFocus
                fullWidth
                type='email'
                label='Email'
                placeholder='Masukkan email Anda'
                value={email}
                onChange={handleEmailChange}
                error={Boolean(emailError)}
                helperText={emailError}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-mail text-[20px]' />
                      </InputAdornment>
                    )
                  }
                }}
              />

              {!emailError && (
                <div className={styles.fieldHint}>
                  <i className='tabler-shield-check' />
                  <span>
                    Email Anda tetap aman dan terlindungi.
                  </span>
                </div>
              )}
            </div>

            {/* Button */}
            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={isLoading}
              className={`${styles.button} ${
                isLoading ? styles.buttonLoading : ''
              }`}
            >
              <span className={styles.buttonShine} />

              {isLoading ? (
                <span className={styles.loadingContent}>
                  <span className={styles.loader}>
                    <span />
                    <span />
                    <span />
                  </span>

                  <span>Mengirim instruksi...</span>
                </span>
              ) : (
                <span className={styles.buttonContent}>
                  <span>Kirim Link Reset</span>

                  <span className={styles.buttonArrow}>
                    <i className='tabler-arrow-up-right' />
                  </span>
                </span>
              )}
            </Button>

            {/* Back to login */}
            <Typography
              className={`${styles.back} flex justify-center items-center`}
              color='primary.main'
            >
              <Link
                href='/auth/login'
                className={`${styles.backLink} flex items-center gap-1.5`}
              >
                <span className={styles.backIcon}>
                  <i className='tabler-arrow-left' />
                </span>

                <span>Kembali ke login</span>
              </Link>
            </Typography>
          </form>

          {/* Security */}
          <div className={styles.securityCard}>
            <div className={styles.securityIcon}>
              <i className='tabler-shield-lock' />
            </div>

            <div className={styles.securityContent}>
              <span className={styles.securityTitle}>
                Privasi tetap terjaga
              </span>

              <span className={styles.securityDescription}>
                DISKOP tidak akan pernah meminta password
                Anda melalui email.
              </span>
            </div>

            <span className={styles.securityStatus} />
          </div>

          {/* Footer */}
          <Typography
            variant='body2'
            color='text.secondary'
            className={`${styles.footer} text-center mt-6`}
          >
            © {new Date().getFullYear()} DISKOP
            <span className={styles.footerDivider}>·</span>
            Pemerintah Kota Banjarbaru
          </Typography>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default ForgotPassword

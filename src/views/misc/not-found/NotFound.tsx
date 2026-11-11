'use client'

// React Imports
import { useRef } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Style Imports
import styles from './styles.module.css'

// Styled Components
const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 320,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: 0,
  pointerEvents: 'none'
})

const NotFound = ({ mode }: { mode: SystemMode }) => {
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const navigatingRef = useRef(false)

  const miscBackground = useImageVariant(
    mode,
    lightImg,
    darkImg
  )

  const handleGoBack = () => {
    if (navigatingRef.current) return

    navigatingRef.current = true

    if (window.history.length > 1) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <div className={styles.page}>
      {/* Very subtle background atmosphere */}
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <main className={styles.container}>
        {/* Brand */}
        <Link
          href='/'
          className={styles.logo}
          aria-label='Kembali ke beranda DISKOP'
        >
          <Logo />
        </Link>

        {/* 404 */}
        <div className={styles.errorNumber}>
          <span>4</span>

          <span className={styles.errorZero}>
            <span className={styles.errorZeroInner}>
              <i className='tabler-search-off' />
            </span>
          </span>

          <span>4</span>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <Typography
            component='h1'
            className={styles.title}
          >
            Halaman tidak ditemukan
          </Typography>

          <Typography className={styles.description}>
            Maaf, halaman yang Anda cari tidak tersedia
            atau mungkin telah dipindahkan.
          </Typography>

          <Button
            onClick={handleGoBack}
            variant='contained'
            className={styles.homeButton}
          >
            <span className={styles.buttonShine} />

            <span className={styles.buttonContent}>
              <i className='tabler-arrow-left' />

              <span>Kembali ke Halaman Sebelumnya</span>

              <i
                className={`${styles.buttonArrow} tabler-arrow-up-right`}
              />
            </span>
          </Button>
        </div>

        {/* Illustration */}
        <div className={styles.illustrationArea}>
          <div className={styles.illustrationGlow} />

          <img
            src='/images/illustrations/characters/1.png'
            alt='Halaman tidak ditemukan'
            className={styles.illustration}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>
            © {new Date().getFullYear()} DISKOP
          </span>

          <span className={styles.footerDot} />

          <span>
            Pemerintah Kota Banjarbaru
          </span>
        </div>
      </main>

      {!hidden && (
        <MaskImg
          alt=''
          src={miscBackground}
          className={classnames(styles.mask, {
            'scale-x-[-1]': theme.direction === 'rtl'
          })}
        />
      )}
    </div>
  )
}

export default NotFound

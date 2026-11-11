'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

type Props = {
  mode: Mode
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

type WrapperProps = {
  children: React.ReactNode
  isBelowLgScreen: boolean
  className?: string
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

const Wrapper = (props: WrapperProps) => {
  const {
    children,
    isBelowLgScreen,
    className,
    isDrawerOpen,
    setIsDrawerOpen
  } = props

  if (isBelowLgScreen) {
    return (
      <Drawer
        variant='temporary'
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: ['100%', 300]
          }
        }}
        className={classnames('p-5', className)}
      >
        <div className='p-4 flex flex-col gap-x-3'>
          <IconButton
            onClick={() => setIsDrawerOpen(false)}
            className='absolute inline-end-4 block-start-2'
            aria-label='Tutup menu'
          >
            <i className='tabler-x' />
          </IconButton>

          {children}
        </div>
      </Drawer>
    )
  }

  return (
    <div
      className={classnames(
        'flex items-center flex-wrap gap-x-4 gap-y-3',
        className
      )}
    >
      {children}
    </div>
  )
}

const FrontMenu = (props: Props) => {
  const {
    isDrawerOpen,
    setIsDrawerOpen
  } = props

  const pathname = usePathname()

  const isBelowLgScreen = useMediaQuery(
    (theme: Theme) => theme.breakpoints.down('lg')
  )

  const { intersections } = useIntersection()

  useEffect(() => {
    if (!isBelowLgScreen && isDrawerOpen) {
      setIsDrawerOpen(false)
    }
  }, [isBelowLgScreen, isDrawerOpen, setIsDrawerOpen])

  // ============================================
  // Landing Page State
  // ============================================

  const isHomePage = pathname === '/'

  const isFeaturedTrainingActive =
    Boolean(intersections['featured-training'])

  const isPromotionActive =
    Boolean(intersections.promotion)

  const isHowItWorksActive =
    Boolean(intersections['how-it-works'])

  const isFaqActive =
    Boolean(intersections.faq)

  const isContactActive =
    Boolean(intersections['contact-us'])

  const isLandingSectionActive =
    isFeaturedTrainingActive ||
    isPromotionActive ||
    isHowItWorksActive ||
    isFaqActive ||
    isContactActive

  /**
   * Beranda aktif ketika:
   *
   * 1. Sedang berada di `/`
   * 2. Tidak sedang berada di section landing lainnya
   *
   * Jadi ketika pertama kali membuka `/`,
   * Beranda otomatis aktif.
   */
  const isHomeActive =
    isHomePage &&
    !isLandingSectionActive

  // ============================================
  // Training Page State
  // ============================================

  const isTrainingsPage =
    pathname === '/trainings' ||
    pathname.startsWith('/trainings/')

  return (
    <Wrapper
      isBelowLgScreen={isBelowLgScreen}
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
    >
      {/* ============================================
          BERANDA
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/'
        className={classnames(
          'font-medium plb-3 pli-1.5 hover:text-primary',
          {
            'text-primary': isHomeActive
          }
        )}
      >
        Beranda
      </Typography>

      {/* ============================================
          PELATIHAN
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/trainings'
        className={classnames(
          'font-medium plb-3 pli-1.5 hover:text-primary',
          {
            'text-primary': isTrainingsPage
          }
        )}
      >
        Pelatihan
      </Typography>

      {/* ============================================
          PROGRAM
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/#promotion'
        className={classnames(
          'font-medium plb-3 pli-1.5 hover:text-primary',
          {
            'text-primary':
              isHomePage && isPromotionActive
          }
        )}
      >
        Program
      </Typography>

      {/* ============================================
          CARA KERJA
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/#how-it-works'
        className={classnames(
          'font-medium plb-3 pli-1.5 hover:text-primary',
          {
            'text-primary':
              isHomePage && isHowItWorksActive
          }
        )}
      >
        Cara Kerja
      </Typography>

      {/* ============================================
          FAQ
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/#faq'
        className={classnames(
          'font-medium plb-3 pli-1.5 hover:text-primary',
          {
            'text-primary':
              isHomePage && isFaqActive
          }
        )}
      >
        FAQ
      </Typography>

      {/* ============================================
          KONTAK
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/#contact-us'
        className={classnames(
          'font-medium plb-3 pli-1.5 hover:text-primary',
          {
            'text-primary':
              isHomePage && isContactActive
          }
        )}
      >
        Kontak
      </Typography>

      {/* ============================================
          DASHBOARD
          ============================================ */}
      <Typography
        color='text.primary'
        component={Link}
        href='/dashboard'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
      >
        Dashboard
      </Typography>
    </Wrapper>
  )
}

export default FrontMenu

'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Stepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import type { StepProps } from '@mui/material/Step'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { RegisterFormData } from '@/types/register'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import StepperWrapper from '@core/styles/stepper'

// Step Components
import StepAccountDetails from './StepAccountDetails'
import StepPersonalInfo from './StepPersonalInfo'
import StepProfile from './StepProfile'
import StepPurpose from './StepPurpose'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Style Imports
import styles from './styles.module.css'

// Styled Components
const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 250,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: 0,
  pointerEvents: 'none'
})

// Steps
const steps = [
  {
    title: 'Akun',
    icon: 'tabler-user-plus',
    subtitle: 'Buat akun DISKOP'
  },
  {
    title: 'Biodata',
    icon: 'tabler-id',
    subtitle: 'Data pribadi'
  },
  {
    title: 'Profil',
    icon: 'tabler-user',
    subtitle: 'Profil peserta'
  },
  {
    title: 'Tujuan',
    icon: 'tabler-target-arrow',
    subtitle: 'Minat & tujuan'
  }
]

// Styled Step
const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  paddingInline: theme.spacing(5),
  paddingBlock: theme.spacing(1),
  position: 'relative',

  '& + i': {
    color: 'var(--mui-palette-divider)',
    transition: 'color 400ms ease'
  },

  '&:first-of-type': {
    paddingInlineStart: 0
  },

  '&:last-of-type': {
    paddingInlineEnd: 0
  },

  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },

  '& .step-title': {
    transition: 'color 300ms ease, transform 300ms ease'
  },

  '& .step-subtitle': {
    transition: 'color 300ms ease'
  },

  '&.Mui-completed .step-title, &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  },

  '&.Mui-completed + i': {
    color: 'var(--mui-palette-primary-main)'
  },

  [theme.breakpoints.down('md')]: {
    padding: 0,

    ':not(:last-of-type)': {
      marginBlockEnd: theme.spacing(4)
    }
  }
}))

// Step Content
const getStepContent = (
  step: number,
  formData: RegisterFormData,
  updateForm: <T extends keyof RegisterFormData>(
    section: T,
    data: Partial<RegisterFormData[T]>
  ) => void,
  handleNext: () => void,
  handlePrev: () => void,
  animationKey: number,
  direction: 'next' | 'prev'
) => {
  let content = null

  switch (step) {
    case 0:
      content = (
        <StepAccountDetails
          value={formData.account}
          onChange={data => updateForm('account', data)}
          handleNext={handleNext}
        />
      )
      break

    case 1:
      content = (
        <StepPersonalInfo
          value={formData.personal}
          onChange={data => updateForm('personal', data)}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      )
      break

    case 2:
      content = (
        <StepProfile
          value={formData.profile}
          onChange={data => updateForm('profile', data)}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      )
      break

    case 3:
      content = (
        <StepPurpose
          value={formData.purpose}
          onChange={data => updateForm('purpose', data)}
          handlePrev={handlePrev}
        />
      )
      break

    default:
      content = null
  }

  return (
    <div
      key={animationKey}
      className={classnames(
        styles.stepContent,
        direction === 'next'
          ? styles.stepNext
          : styles.stepPrev
      )}
    >
      {content}
    </div>
  )
}

const RegisterMultiSteps = ({
                              mode
                            }: {
  mode: SystemMode
}) => {
  // =========================================================
  // States
  // =========================================================

  const [activeStep, setActiveStep] = useState(0)

  const [direction, setDirection] =
    useState<'next' | 'prev'>('next')

  const [animationKey, setAnimationKey] = useState(0)

  /**
   * Semua data registrasi disimpan di parent.
   *
   * Dengan cara ini:
   * - pindah step tidak menghapus data
   * - kembali ke step sebelumnya tetap mempertahankan input
   * - setiap Step menjadi controlled component
   * - data siap dikirim saat registrasi selesai
   */
  const [formData, setFormData] = useState<RegisterFormData>({
    account: {
      username: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: ''
    },

    personal: {
      nik: '',
      fullName: '',
      birthPlace: '',
      birthDate: null,
      gender: ''
    },

    profile: {
      provinceCode: '',
      regencyCode: '',
      districtCode: '',
      villageCode: '',

      fullAddress: '',
      postalCode: '',

      education: '',
      institution: '',
      major: '',
      graduationYear: '',

      employmentStatus: '',
      companyName: '',
      position: '',
      businessName: '',
      businessField: ''
    },

    purpose: {
      interest: '',
      purpose: '',
      motivation: ''
    }
  })

  // =========================================================
  // Update Form
  // =========================================================

  const updateForm = <T extends keyof RegisterFormData>(
    section: T,
    data: Partial<RegisterFormData[T]>
  ) => {
    setFormData(prev => ({
      ...prev,

      [section]: {
        ...prev[section],
        ...data
      }
    }))
  }

  // =========================================================
  // Images
  // =========================================================

  const darkImg =
    '/images/pages/auth-reg-multi-mask-dark.png'

  const lightImg =
    '/images/pages/auth-reg-multi-mask-light.png'

  // =========================================================
  // Hooks
  // =========================================================

  const { settings } = useSettings()
  const theme = useTheme()

  const isSmallScreen = useMediaQuery(
    theme.breakpoints.down('md')
  )

  const authBackground = useImageVariant(
    mode,
    lightImg,
    darkImg
  )

  // =========================================================
  // Handle Stepper
  // =========================================================

  const handleNext = () => {
    if (activeStep >= steps.length - 1) {
      return
    }

    setDirection('next')

    requestAnimationFrame(() => {
      setActiveStep(prev => prev + 1)
      setAnimationKey(prev => prev + 1)
    })
  }

  const handlePrev = () => {
    if (activeStep <= 0) {
      return
    }

    setDirection('prev')

    requestAnimationFrame(() => {
      setActiveStep(prev => prev - 1)
      setAnimationKey(prev => prev + 1)
    })
  }

  // =========================================================
  // Progress
  // =========================================================

  const progress =
    ((activeStep + 1) / steps.length) * 100

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className={styles.page}>
      {/* Ambient Background */}
      <div className={styles.ambientGlow} />
      <div className={styles.ambientGlowSecondary} />

      {/* =====================================================
          LEFT CONTENT
          ===================================================== */}

      <div
        className={classnames(
          styles.illustrationPanel,
          {
            'border-ie':
              settings.skin === 'bordered'
          }
        )}
      >
        <div className={styles.illustrationGrid} />

        <div className={styles.illustrationContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />

            <span>
              PENDAFTARAN PESERTA DISKOP
            </span>
          </div>

          <Typography
            component='h1'
            className={styles.heroTitle}
          >
            Tingkatkan kompetensi.
            <br />
            <span>Bangun masa depan.</span>
          </Typography>

          <Typography
            className={styles.heroDescription}
          >
            Lengkapi data Anda untuk menjadi peserta
            DISKOP dan akses berbagai program
            pelatihan yang tersedia.
          </Typography>

          {/* Progress */}
          <div className={styles.progressWrapper}>
            <div className={styles.progressHeader}>
              <span>
                Langkah {activeStep + 1} dari{' '}
                {steps.length}
              </span>

              <span>
                {Math.round(progress)}%
              </span>
            </div>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${progress}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Decorative Mask */}
        {!isSmallScreen && (
          <MaskImg
            alt=''
            src={authBackground}
            className={classnames(
              styles.mask,
              {
                'scale-x-[-1]':
                  theme.direction === 'rtl'
              }
            )}
          />
        )}
      </div>

      {/* =====================================================
          RIGHT CONTENT
          ===================================================== */}

      <div className={styles.formPanel}>
        <div className={styles.formGlow} />

        {/* Logo */}
        <Link
          href='/'
          aria-label='Kembali ke beranda DISKOP'
          className={styles.logo}
        >
          <Logo />
        </Link>

        <div className={styles.formContainer}>
          {/* Mobile Heading */}
          <div className={styles.mobileHeading}>
            <Typography
              component='div'
              className={styles.mobileEyebrow}
            >
              PENDAFTARAN PESERTA
            </Typography>

            <Typography
              component='h1'
              className={styles.mobileTitle}
            >
              Daftar sebagai Peserta DISKOP
            </Typography>
          </div>

          {/* =================================================
              Stepper
              ================================================= */}

          <StepperWrapper
            className={styles.stepperWrapper}
          >
            <Stepper
              activeStep={activeStep}
              connector={
                !isSmallScreen ? (
                  <DirectionalIcon
                    ltrIconClass='tabler-chevron-right'
                    rtlIconClass='tabler-chevron-left'
                    className={styles.connector}
                  />
                ) : null
              }
              className={styles.stepper}
            >
              {steps.map((step, index) => {
                const isActive =
                  activeStep === index

                const isCompleted =
                  activeStep > index

                return (
                  <Step
                    key={step.title}
                    className={classnames({
                      [styles.activeStep]:
                      isActive,

                      [styles.completedStep]:
                      isCompleted
                    })}
                  >
                    <StepLabel>
                      <div className='step-label'>
                        <CustomAvatar
                          variant='rounded'
                          skin={
                            isActive
                              ? 'filled'
                              : 'light'
                          }
                          {...((isActive ||
                            isCompleted) && {
                            color: 'primary'
                          })}
                          {...(isActive && {
                            className:
                              'shadow-primarySm'
                          })}
                          size={38}
                        >
                          {isCompleted ? (
                            <i className='tabler-check text-[20px]' />
                          ) : (
                            <i
                              className={classnames(
                                step.icon,
                                'text-[21px]'
                              )}
                            />
                          )}
                        </CustomAvatar>

                        <div>
                          <Typography className='step-title'>
                            {step.title}
                          </Typography>

                          <Typography
                            className='step-subtitle'
                            color='text.secondary'
                          >
                            {step.subtitle}
                          </Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>

            {/* =================================================
                Step Content
                ================================================= */}

            {getStepContent(
              activeStep,
              formData,
              updateForm,
              handleNext,
              handlePrev,
              animationKey,
              direction
            )}
          </StepperWrapper>
        </div>

        {/* =====================================================
            Footer
            ===================================================== */}

        <div className={styles.footer}>
          <Typography
            variant='body2'
            color='text.secondary'
          >
            Sudah memiliki akun?{' '}
            <Link
              href='/auth/login'
              className={styles.loginLink}
            >
              Masuk
            </Link>
          </Typography>

          <Typography
            variant='caption'
            color='text.disabled'
          >
            © {new Date().getFullYear()} DISKOP ·
            Pemerintah Kota Banjarbaru
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default RegisterMultiSteps

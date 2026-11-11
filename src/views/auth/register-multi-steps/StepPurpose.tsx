'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'

import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'

import type { RegisterFormData } from '@/types/register'

import styles from './styles.module.css'

/* =========================================================
   TYPES
   ========================================================= */

type PurposeFormData = RegisterFormData['purpose']

type StepPurposeProps = {
  value: PurposeFormData
  onChange: (data: Partial<PurposeFormData>) => void
  handlePrev: () => void
  handleNext?: () => void
}

type PurposeErrors = {
  interest?: string
  purpose?: string
  motivation?: string
}

/* =========================================================
   COMPONENT
   ========================================================= */

const StepPurpose = ({
                       value,
                       onChange,
                       handlePrev,
                       handleNext
                     }: StepPurposeProps) => {
  /* =======================================================
     LOCAL UI STATE
     ======================================================= */

  /**
   * Data form tidak disimpan di sini.
   *
   * value.interest
   * value.purpose
   * value.motivation
   *
   * semuanya berasal dari RegisterMultiSteps.
   */

  const [errors, setErrors] =
    useState<PurposeErrors>({})

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  /* =======================================================
     CONSTANTS
     ======================================================= */

  const MAX_MOTIVATION_LENGTH = 500

  /* =======================================================
     ERROR
     ======================================================= */

  const clearError = (
    field: keyof PurposeErrors
  ) => {
    setErrors(prev => {
      if (!prev[field]) {
        return prev
      }

      const next = { ...prev }

      delete next[field]

      return next
    })
  }

  /* =======================================================
     VALIDATION
     ======================================================= */

  const validateForm = () => {
    const newErrors: PurposeErrors = {}

    if (!value.interest) {
      newErrors.interest =
        'Bidang yang diminati wajib dipilih.'
    }

    if (!value.purpose) {
      newErrors.purpose =
        'Tujuan mengikuti pelatihan wajib dipilih.'
    }

    if (!value.motivation.trim()) {
      newErrors.motivation =
        'Motivasi mengikuti pelatihan wajib diisi.'
    } else if (
      value.motivation.trim().length < 20
    ) {
      newErrors.motivation =
        'Motivasi minimal terdiri dari 20 karakter.'
    } else if (
      value.motivation.length >
      MAX_MOTIVATION_LENGTH
    ) {
      newErrors.motivation =
        'Motivasi tidak boleh lebih dari 500 karakter.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  /* =======================================================
     SUBMIT
     ======================================================= */

  const handleSubmit = () => {
    if (isSubmitting) {
      return
    }

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    /*
     * Untuk sementara:
     * lanjut ke handler parent apabila tersedia.
     *
     * Nanti bagian ini bisa diganti dengan:
     * - API registration
     * - server action
     * - submit registration
     * - redirect ke success page
     */

    if (handleNext) {
      handleNext()

      setTimeout(() => {
        setIsSubmitting(false)
      }, 500)

      return
    }

    setTimeout(() => {
      setIsSubmitting(false)
    }, 800)
  }

  /* =======================================================
     MOTIVATION CHANGE
     ======================================================= */

  const handleMotivationChange = (
    motivation: string
  ) => {
    const limitedValue =
      motivation.slice(
        0,
        MAX_MOTIVATION_LENGTH
      )

    onChange({
      motivation: limitedValue
    })

    if (limitedValue.trim()) {
      clearError('motivation')
    }
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className={
        styles.purposeStepWrapper
      }
    >
      {/* =================================================
          HEADER
          ================================================= */}

      <div
        className={
          styles.purposeStepHeader
        }
      >
        <div
          className={
            styles.purposeStepHeaderIcon
          }
        >
          <i className='tabler-target-arrow' />
        </div>

        <div
          className={
            styles.purposeStepHeaderContent
          }
        >
          <Typography
            variant='h4'
            className={
              styles.purposeStepTitle
            }
          >
            Tujuan & Minat
          </Typography>

          <Typography
            color='text.secondary'
            className={
              styles.purposeStepSubtitle
            }
          >
            Ceritakan bidang yang ingin Anda
            kembangkan dan tujuan mengikuti
            program pelatihan.
          </Typography>
        </div>
      </div>

      {/* =================================================
          INFO CARD
          ================================================= */}

      <div
        className={
          styles.purposeInfoCard
        }
      >
        <div
          className={
            styles.purposeInfoIcon
          }
        >
          <i className='tabler-sparkles' />
        </div>

        <div
          className={
            styles.purposeInfoContent
          }
        >
          <Typography
            variant='body2'
            className={
              styles.purposeInfoTitle
            }
          >
            Bantu kami memahami kebutuhan Anda
          </Typography>

          <Typography
            variant='caption'
            color='text.secondary'
          >
            Informasi ini digunakan untuk
            membantu menyesuaikan rekomendasi
            pelatihan dengan kebutuhan dan
            tujuan pengembangan Anda.
          </Typography>
        </div>
      </div>

      {/* =================================================
          FORM
          ================================================= */}

      <Grid container spacing={5}>
        {/* =================================================
            INTEREST
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.purposeFieldWrapper
            }
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Bidang yang Diminati{' '}
                  <span
                    className={
                      styles.purposeRequired
                    }
                  >
                    *
                  </span>
                </>
              }
              value={value.interest}
              error={Boolean(
                errors.interest
              )}
              onChange={event => {
                const interest =
                  event.target.value

                onChange({
                  interest
                })

                if (interest) {
                  clearError('interest')
                }
              }}
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                Pilih bidang yang diminati
              </MenuItem>

              <MenuItem value='technology'>
                <i className='tabler-code' />

                <span className='mis-2'>
                  Teknologi Informasi
                </span>
              </MenuItem>

              <MenuItem value='digital'>
                <i className='tabler-device-desktop' />

                <span className='mis-2'>
                  Digital
                </span>
              </MenuItem>

              <MenuItem value='entrepreneurship'>
                <i className='tabler-briefcase' />

                <span className='mis-2'>
                  Kewirausahaan
                </span>
              </MenuItem>

              <MenuItem value='management'>
                <i className='tabler-users' />

                <span className='mis-2'>
                  Manajemen
                </span>
              </MenuItem>

              <MenuItem value='industry'>
                <i className='tabler-building-factory' />

                <span className='mis-2'>
                  Industri
                </span>
              </MenuItem>

              <MenuItem value='administration'>
                <i className='tabler-file-description' />

                <span className='mis-2'>
                  Administrasi
                </span>
              </MenuItem>

              <MenuItem value='finance'>
                <i className='tabler-wallet' />

                <span className='mis-2'>
                  Keuangan
                </span>
              </MenuItem>
            </CustomTextField>

            {errors.interest ? (
              <div
                className={
                  styles.purposeFieldError
                }
              >
                <i className='tabler-alert-circle' />

                <span>
                  {errors.interest}
                </span>
              </div>
            ) : value.interest ? (
              <div
                className={
                  styles.purposeFieldSuccess
                }
              >
                <i className='tabler-circle-check' />

                <span>
                  Bidang minat berhasil dipilih.
                </span>
              </div>
            ) : (
              <div
                className={
                  styles.purposeFieldHelper
                }
              >
                Pilih bidang utama yang ingin
                Anda kembangkan.
              </div>
            )}
          </div>
        </Grid>

        {/* =================================================
            PURPOSE
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.purposeFieldWrapper
            }
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Tujuan Mengikuti Pelatihan{' '}
                  <span
                    className={
                      styles.purposeRequired
                    }
                  >
                    *
                  </span>
                </>
              }
              value={value.purpose}
              error={Boolean(
                errors.purpose
              )}
              onChange={event => {
                const purpose =
                  event.target.value

                onChange({
                  purpose
                })

                if (purpose) {
                  clearError('purpose')
                }
              }}
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                Pilih tujuan mengikuti pelatihan
              </MenuItem>

              <MenuItem value='competency'>
                Meningkatkan kompetensi
              </MenuItem>

              <MenuItem value='job'>
                Mencari pekerjaan
              </MenuItem>

              <MenuItem value='career'>
                Meningkatkan peluang karier
              </MenuItem>

              <MenuItem value='current-job'>
                Mendukung pekerjaan saat ini
              </MenuItem>

              <MenuItem value='business'>
                Membuka usaha
              </MenuItem>

              <MenuItem value='business-development'>
                Mengembangkan usaha
              </MenuItem>

              <MenuItem value='certification'>
                Mendapatkan sertifikasi
              </MenuItem>

              <MenuItem value='other'>
                Lainnya
              </MenuItem>
            </CustomTextField>

            {errors.purpose ? (
              <div
                className={
                  styles.purposeFieldError
                }
              >
                <i className='tabler-alert-circle' />

                <span>
                  {errors.purpose}
                </span>
              </div>
            ) : value.purpose ? (
              <div
                className={
                  styles.purposeFieldSuccess
                }
              >
                <i className='tabler-circle-check' />

                <span>
                  Tujuan pelatihan berhasil dipilih.
                </span>
              </div>
            ) : (
              <div
                className={
                  styles.purposeFieldHelper
                }
              >
                Pilih tujuan utama Anda mengikuti
                program pelatihan.
              </div>
            )}
          </div>
        </Grid>

        {/* =================================================
            MOTIVATION
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.purposeFieldWrapper
            }
          >
            <CustomTextField
              fullWidth
              multiline
              minRows={5}
              label={
                <>
                  Motivasi Mengikuti Pelatihan{' '}
                  <span
                    className={
                      styles.purposeRequired
                    }
                  >
                    *
                  </span>
                </>
              }
              placeholder='Ceritakan secara singkat alasan dan tujuan Anda mengikuti pelatihan...'
              value={value.motivation}
              error={Boolean(
                errors.motivation
              )}
              onChange={event =>
                handleMotivationChange(
                  event.target.value
                )
              }
              inputProps={{
                maxLength:
                MAX_MOTIVATION_LENGTH
              }}
            />

            <div
              className={
                styles.purposeMotivationMeta
              }
            >
              <div>
                {errors.motivation ? (
                  <div
                    className={
                      styles.purposeFieldError
                    }
                  >
                    <i className='tabler-alert-circle' />

                    <span>
                      {errors.motivation}
                    </span>
                  </div>
                ) : (
                  <div
                    className={
                      styles.purposeFieldHelper
                    }
                  >
                    Jelaskan alasan Anda mengikuti
                    pelatihan dan hasil yang ingin
                    dicapai.
                  </div>
                )}
              </div>

              <span
                className={
                  value.motivation.length >=
                  MAX_MOTIVATION_LENGTH
                    ? styles.purposeCounterLimit
                    : styles.purposeCounter
                }
              >
                {value.motivation.length}/
                {MAX_MOTIVATION_LENGTH}
              </span>
            </div>
          </div>
        </Grid>

        {/* =================================================
            COMPLETION NOTE
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.purposeCompletionCard
            }
          >
            <div
              className={
                styles.purposeCompletionIcon
              }
            >
              <i className='tabler-checkbox' />
            </div>

            <div>
              <Typography
                variant='body2'
                className={
                  styles.purposeCompletionTitle
                }
              >
                Hampir selesai
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Pastikan informasi yang Anda
                masukkan sudah sesuai sebelum
                menyelesaikan pendaftaran.
              </Typography>
            </div>
          </div>
        </Grid>

        {/* =================================================
            VALIDATION SUMMARY
            ================================================= */}

        {Object.keys(errors).length > 0 && (
          <Grid size={{ xs: 12 }}>
            <div
              className={
                styles.purposeValidationSummary
              }
            >
              <div
                className={
                  styles.purposeValidationIcon
                }
              >
                <i className='tabler-alert-triangle' />
              </div>

              <div>
                <Typography
                  variant='body2'
                  className={
                    styles.purposeValidationTitle
                  }
                >
                  Data belum lengkap
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Periksa kembali field yang
                  ditandai sebelum menyelesaikan
                  pendaftaran.
                </Typography>
              </div>
            </div>
          </Grid>
        )}

        {/* =================================================
            ACTIONS
            ================================================= */}

        <Grid
          size={{ xs: 12 }}
          className={
            styles.purposeStepActions
          }
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={handlePrev}
            disabled={isSubmitting}
            startIcon={
              <DirectionalIcon
                ltrIconClass='tabler-arrow-left'
                rtlIconClass='tabler-arrow-right'
              />
            }
          >
            Kembali
          </Button>

          <Button
            variant='contained'
            color='success'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={
              styles.purposeSubmitButton
            }
            endIcon={
              isSubmitting ? (
                <CircularProgress
                  size={18}
                  color='inherit'
                />
              ) : (
                <i className='tabler-check' />
              )
            }
          >
            {isSubmitting
              ? 'Memproses...'
              : 'Daftar sebagai Peserta'}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default StepPurpose

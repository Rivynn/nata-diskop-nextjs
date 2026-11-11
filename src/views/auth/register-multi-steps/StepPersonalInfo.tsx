'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Type Imports
import type { RegisterFormData } from '@/types/register'

// Style Imports
import styles from './styles.module.css'

type PersonalFormData = RegisterFormData['personal']

type StepPersonalInfoProps = {
  value: PersonalFormData
  onChange: (data: Partial<PersonalFormData>) => void
  handleNext: () => void
  handlePrev: () => void
}

const RequiredLabel = ({
                         children
                       }: {
  children: React.ReactNode
}) => (
  <span>
    {children}
    <span className={styles.personalInfoRequired}>
      *
    </span>
  </span>
)

const StepPersonalInfo = ({
                            value,
                            onChange,
                            handleNext,
                            handlePrev
                          }: StepPersonalInfoProps) => {
  // =========================================================
  // Local UI State
  // =========================================================

  /**
   * Hanya state UI yang tetap berada di component.
   *
   * Data form:
   * - nik
   * - fullName
   * - birthPlace
   * - birthDate
   * - gender
   *
   * semuanya berasal dari `value` milik RegisterMultiSteps.
   */

  const [showNik, setShowNik] =
    useState(false)

  // =========================================================
  // NIK
  // =========================================================

  const handleNikChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nik = event.target.value
      .replace(/\D/g, '')
      .slice(0, 16)

    onChange({
      nik
    })
  }

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className={styles.personalInfoWrapper}>
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className={styles.personalInfoHeader}>
        <div
          className={
            styles.personalInfoHeaderIcon
          }
        >
          <i className='tabler-id' />
        </div>

        <div
          className={
            styles.personalInfoHeaderContent
          }
        >
          <Typography
            variant='h4'
            className={
              styles.personalInfoTitle
            }
          >
            Data Pribadi
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className={
              styles.personalInfoSubtitle
            }
          >
            Data identitas peserta
          </Typography>
        </div>
      </div>

      <Typography
        color='text.secondary'
        className={
          styles.personalInfoDescription
        }
      >
        Lengkapi data pribadi Anda sesuai
        identitas resmi. Data ini digunakan
        untuk keperluan administrasi dan
        verifikasi peserta.
      </Typography>

      <Grid container spacing={5}>
        {/* ==================================================
            NIK
            ================================================== */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.personalInfoIdentityCard
            }
          >
            <div
              className={
                styles.personalInfoIdentityGlow
              }
            />

            <div
              className={
                styles.personalInfoIdentityHeader
              }
            >
              <div
                className={
                  styles.personalInfoIdentityIcon
                }
              >
                <i className='tabler-shield-lock' />
              </div>

              <div
                className={
                  styles.personalInfoIdentityInfo
                }
              >
                <div className='flex items-center gap-2'>
                  <Typography
                    variant='body1'
                    className={
                      styles.personalInfoIdentityTitle
                    }
                  >
                    Nomor Induk Kependudukan
                  </Typography>

                  <span
                    className={
                      styles.personalInfoPrivateBadge
                    }
                  >
                    <i className='tabler-lock' />
                    Privat
                  </span>
                </div>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={
                    styles.personalInfoIdentityDescription
                  }
                >
                  Digunakan untuk verifikasi
                  identitas peserta dan
                  disimpan secara aman.
                </Typography>
              </div>
            </div>

            <div
              className={
                styles.personalInfoNikWrapper
              }
            >
              <CustomTextField
                fullWidth
                label={
                  <RequiredLabel>
                    NIK
                  </RequiredLabel>
                }
                placeholder='Masukkan 16 digit NIK'
                type={
                  showNik
                    ? 'text'
                    : 'password'
                }
                value={value.nik}
                onChange={
                  handleNikChange
                }
                className={
                  styles.personalInfoField
                }
                slotProps={{
                  htmlInput: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 16
                  },

                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          className={
                            styles.personalInfoVisibilityButton
                          }
                          onClick={() =>
                            setShowNik(
                              prev => !prev
                            )
                          }
                          onMouseDown={event =>
                            event.preventDefault()
                          }
                          aria-label={
                            showNik
                              ? 'Sembunyikan NIK'
                              : 'Tampilkan NIK'
                          }
                        >
                          <i
                            className={
                              showNik
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                helperText={
                  <span
                    className={
                      styles.personalInfoHelper
                    }
                  >
                    <i className='tabler-lock' />

                    <span>
                      NIK bersifat privat dan
                      tidak digunakan sebagai
                      username atau nomor
                      peserta.
                    </span>
                  </span>
                }
              />

              <div
                className={
                  styles.personalInfoNikCounter
                }
              >
                <span
                  className={
                    value.nik.length === 16
                      ? styles.personalInfoCounterComplete
                      : undefined
                  }
                >
                  {value.nik.length}
                </span>

                <span>
                  /16 digit
                </span>
              </div>
            </div>
          </div>
        </Grid>

        {/* ==================================================
            NAMA LENGKAP
            ================================================== */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.personalInfoFieldGroup
            }
          >
            <CustomTextField
              fullWidth
              label={
                <RequiredLabel>
                  Nama Lengkap
                </RequiredLabel>
              }
              placeholder='Sesuai identitas resmi'
              value={value.fullName}
              onChange={event =>
                onChange({
                  fullName:
                  event.target.value
                })
              }
              className={
                styles.personalInfoField
              }
              helperText='Gunakan nama lengkap sesuai dokumen identitas.'
            />
          </div>
        </Grid>

        {/* ==================================================
            TEMPAT LAHIR
            ================================================== */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <div
            className={
              styles.personalInfoFieldGroup
            }
          >
            <CustomTextField
              fullWidth
              label={
                <RequiredLabel>
                  Tempat Lahir
                </RequiredLabel>
              }
              placeholder='Contoh: Banjarbaru'
              value={value.birthPlace}
              onChange={event =>
                onChange({
                  birthPlace:
                  event.target.value
                })
              }
              className={
                styles.personalInfoField
              }
            />
          </div>
        </Grid>

        {/* ==================================================
            TANGGAL LAHIR
            ================================================== */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <div
            className={
              styles.personalInfoFieldGroup
            }
          >
            <AppReactDatepicker
              selected={value.birthDate}
              placeholderText='DD/MM/YYYY'
              dateFormat='dd/MM/yyyy'
              maxDate={
                new Date(
                  new Date().setFullYear(
                    new Date().getFullYear() -
                    17
                  )
                )
              }
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              onChange={(
                date: Date | null
              ) =>
                onChange({
                  birthDate: date
                })
              }
              customInput={
                <CustomTextField
                  fullWidth
                  label={
                    <>
                      Tanggal Lahir{' '}
                      <span
                        className={
                          styles.personalInfoRequired
                        }
                      >
                        *
                      </span>
                    </>
                  }
                />
              }
            />
          </div>
        </Grid>

        {/* ==================================================
            JENIS KELAMIN
            ================================================== */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.personalInfoFieldGroup
            }
          >
            <CustomTextField
              select
              fullWidth
              label={
                <RequiredLabel>
                  Jenis Kelamin
                </RequiredLabel>
              }
              value={value.gender}
              onChange={event =>
                onChange({
                  gender:
                  event.target.value
                })
              }
              className={
                styles.personalInfoField
              }
              helperText='Pilih sesuai identitas Anda.'
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem
                value=''
                disabled
              >
                Pilih jenis kelamin
              </MenuItem>

              <MenuItem value='male'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-gender-male text-lg' />

                  <span>
                    Laki-laki
                  </span>
                </div>
              </MenuItem>

              <MenuItem value='female'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-gender-female text-lg' />

                  <span>
                    Perempuan
                  </span>
                </div>
              </MenuItem>
            </CustomTextField>
          </div>
        </Grid>

        {/* ==================================================
            ACTIONS
            ================================================== */}

        <Grid size={{ xs: 12 }}>
          <div className='flex items-center justify-between'>
            <Button
              variant='tonal'
              color='secondary'
              onClick={handlePrev}
              className={
                styles.personalInfoBackButton
              }
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
              onClick={handleNext}
              className={
                styles.personalInfoNextButton
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

export default StepPersonalInfo

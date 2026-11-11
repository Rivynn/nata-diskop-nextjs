'use client'

import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { RegisterFormData } from '@/types/register'

// Style Imports
import styles from './styles.module.css'

/* =========================================================
   TYPES
   ========================================================= */

type Region = {
  code: string
  name: string
}

type RegionResponse = {
  data: Region[]
  meta?: {
    administrative_area_level?: number
    updated_at?: string
  }
}

type ProfileFormData = RegisterFormData['profile']

type StepProfileProps = {
  value: ProfileFormData
  onChange: (data: Partial<ProfileFormData>) => void
  handleNext: () => void
  handlePrev: () => void
}

type FormErrors = Record<string, string>

/* =========================================================
   API
   ========================================================= */

const REGION_API = '/api/regions'

const fetchRegions = async (
  endpoint: string,
  signal?: AbortSignal
): Promise<Region[]> => {
  const response = await fetch(
    `${REGION_API}/${endpoint}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch region data: ${response.status}`
    )
  }

  const result =
    (await response.json()) as RegionResponse

  return result.data ?? []
}

/* =========================================================
   COMPONENT
   ========================================================= */

const StepProfile = ({
                       value,
                       onChange,
                       handleNext,
                       handlePrev
                     }: StepProfileProps) => {
  /* =======================================================
     REGION OPTIONS
     ======================================================= */

  /**
   * Ini tetap local.
   *
   * Karena provinces/regencies/districts/villages
   * merupakan hasil fetch API, bukan data form.
   */

  const [provinces, setProvinces] =
    useState<Region[]>([])

  const [regencies, setRegencies] =
    useState<Region[]>([])

  const [districts, setDistricts] =
    useState<Region[]>([])

  const [villages, setVillages] =
    useState<Region[]>([])

  /* =======================================================
     LOADING
     ======================================================= */

  const [
    loadingProvinces,
    setLoadingProvinces
  ] = useState(false)

  const [
    loadingRegencies,
    setLoadingRegencies
  ] = useState(false)

  const [
    loadingDistricts,
    setLoadingDistricts
  ] = useState(false)

  const [
    loadingVillages,
    setLoadingVillages
  ] = useState(false)

  /* =======================================================
     VALIDATION
     ======================================================= */

  const [errors, setErrors] =
    useState<FormErrors>({})

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  /* =======================================================
     REQUEST CONTROLLERS
     ======================================================= */

  const provincesControllerRef =
    useRef<AbortController | null>(null)

  const regenciesControllerRef =
    useRef<AbortController | null>(null)

  const districtsControllerRef =
    useRef<AbortController | null>(null)

  const villagesControllerRef =
    useRef<AbortController | null>(null)

  /* =======================================================
     ERROR HELPER
     ======================================================= */

  const clearError = (field: string) => {
    setErrors(prev => {
      if (!prev[field]) {
        return prev
      }

      const next = { ...prev }

      delete next[field]

      return next
    })
  }

  const setFieldError = (
    field: string,
    message: string
  ) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }))
  }

  /* =======================================================
     VALIDATION
     ======================================================= */

  const validateForm = () => {
    const newErrors: FormErrors = {}

    /* -----------------------------------------------
       ADDRESS
       ----------------------------------------------- */

    if (!value.provinceCode) {
      newErrors.provinceCode =
        'Provinsi wajib dipilih.'
    }

    if (!value.regencyCode) {
      newErrors.regencyCode =
        'Kabupaten / Kota wajib dipilih.'
    }

    if (!value.districtCode) {
      newErrors.districtCode =
        'Kecamatan wajib dipilih.'
    }

    if (!value.villageCode) {
      newErrors.villageCode =
        'Kelurahan / Desa wajib dipilih.'
    }

    if (!value.fullAddress.trim()) {
      newErrors.fullAddress =
        'Alamat lengkap wajib diisi.'
    } else if (
      value.fullAddress.trim().length < 10
    ) {
      newErrors.fullAddress =
        'Alamat lengkap terlalu singkat.'
    }

    if (!value.postalCode) {
      newErrors.postalCode =
        'Kode pos wajib diisi.'
    } else if (
      !/^\d{5}$/.test(
        value.postalCode
      )
    ) {
      newErrors.postalCode =
        'Kode pos harus terdiri dari 5 digit.'
    }

    /* -----------------------------------------------
       EDUCATION
       ----------------------------------------------- */

    if (!value.education) {
      newErrors.education =
        'Pendidikan terakhir wajib dipilih.'
    }

    if (!value.institution.trim()) {
      newErrors.institution =
        'Institusi pendidikan wajib diisi.'
    }

    if (!value.major.trim()) {
      newErrors.major =
        'Jurusan / Program Studi wajib diisi.'
    }

    if (!value.graduationYear) {
      newErrors.graduationYear =
        'Tahun lulus wajib diisi.'
    } else if (
      !/^\d{4}$/.test(
        value.graduationYear
      )
    ) {
      newErrors.graduationYear =
        'Tahun lulus harus terdiri dari 4 digit.'
    }

    /* -----------------------------------------------
       EMPLOYMENT
       ----------------------------------------------- */

    if (!value.employmentStatus) {
      newErrors.employmentStatus =
        'Status pekerjaan wajib dipilih.'
    }

    /* -----------------------------------------------
       EMPLOYEE / ASN / PPPK
       ----------------------------------------------- */

    if (
      value.employmentStatus ===
      'employee' ||
      value.employmentStatus ===
      'asn' ||
      value.employmentStatus ===
      'pppk'
    ) {
      if (!value.companyName.trim()) {
        newErrors.companyName =
          'Instansi / perusahaan wajib diisi.'
      }

      if (!value.position.trim()) {
        newErrors.position =
          'Jabatan wajib diisi.'
      }
    }

    /* -----------------------------------------------
       ENTREPRENEUR
       ----------------------------------------------- */

    if (
      value.employmentStatus ===
      'entrepreneur'
    ) {
      if (!value.businessName.trim()) {
        newErrors.businessName =
          'Nama usaha wajib diisi.'
      }

      if (!value.businessField.trim()) {
        newErrors.businessField =
          'Bidang usaha wajib diisi.'
      }
    }

    setErrors(newErrors)

    return (
      Object.keys(newErrors).length === 0
    )
  }

  /* =======================================================
     NEXT
     ======================================================= */

  const handleProfileNext = () => {
    if (isSubmitting) {
      return
    }

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    handleNext()

    setTimeout(() => {
      setIsSubmitting(false)
    }, 500)
  }

  /* =======================================================
     LOAD PROVINCES
     ======================================================= */

  useEffect(() => {
    const controller =
      new AbortController()

    provincesControllerRef.current =
      controller

    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true)

        const data =
          await fetchRegions(
            'provinces',
            controller.signal
          )

        if (!controller.signal.aborted) {
          setProvinces(data)
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'Failed to load provinces:',
          error
        )

        if (!controller.signal.aborted) {
          setProvinces([])

          setFieldError(
            'provinceCode',
            'Gagal memuat data provinsi.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProvinces(false)
        }
      }
    }

    loadProvinces()

    return () => {
      controller.abort()

      if (
        provincesControllerRef.current ===
        controller
      ) {
        provincesControllerRef.current =
          null
      }
    }
  }, [])

  /* =======================================================
     PROVINCE CHANGE
     ======================================================= */

  const handleProvinceChange = async (
    provinceCode: string
  ) => {
    onChange({
      provinceCode,
      regencyCode: '',
      districtCode: '',
      villageCode: '',
      postalCode: ''
    })

    clearError('provinceCode')
    clearError('regencyCode')
    clearError('districtCode')
    clearError('villageCode')
    clearError('postalCode')

    // Reset options
    setRegencies([])
    setDistricts([])
    setVillages([])

    // Cancel previous request
    regenciesControllerRef.current?.abort()

    if (!provinceCode) {
      setLoadingRegencies(false)

      return
    }

    const controller =
      new AbortController()

    regenciesControllerRef.current =
      controller

    try {
      setLoadingRegencies(true)

      const data =
        await fetchRegions(
          `regencies/${encodeURIComponent(
            provinceCode
          )}`,
          controller.signal
        )

      if (!controller.signal.aborted) {
        setRegencies(data)
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return
      }

      console.error(
        'Failed to load regencies:',
        error
      )

      if (!controller.signal.aborted) {
        setRegencies([])

        setFieldError(
          'regencyCode',
          'Gagal memuat kabupaten / kota.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingRegencies(false)
      }
    }
  }

  /* =======================================================
     REGENCY CHANGE
     ======================================================= */

  const handleRegencyChange = async (
    regencyCode: string
  ) => {
    onChange({
      regencyCode,
      districtCode: '',
      villageCode: '',
      postalCode: ''
    })

    clearError('regencyCode')
    clearError('districtCode')
    clearError('villageCode')
    clearError('postalCode')

    // Reset options
    setDistricts([])
    setVillages([])

    // Cancel previous request
    districtsControllerRef.current?.abort()

    if (!regencyCode) {
      setLoadingDistricts(false)

      return
    }

    const controller =
      new AbortController()

    districtsControllerRef.current =
      controller

    try {
      setLoadingDistricts(true)

      const data =
        await fetchRegions(
          `districts/${encodeURIComponent(
            regencyCode
          )}`,
          controller.signal
        )

      if (!controller.signal.aborted) {
        setDistricts(data)
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return
      }

      console.error(
        'Failed to load districts:',
        error
      )

      if (!controller.signal.aborted) {
        setDistricts([])

        setFieldError(
          'districtCode',
          'Gagal memuat kecamatan.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingDistricts(false)
      }
    }
  }

  /* =======================================================
     DISTRICT CHANGE
     ======================================================= */

  const handleDistrictChange = async (
    districtCode: string
  ) => {
    onChange({
      districtCode,
      villageCode: '',
      postalCode: ''
    })

    clearError('districtCode')
    clearError('villageCode')
    clearError('postalCode')

    setVillages([])

    villagesControllerRef.current?.abort()

    if (!districtCode) {
      setLoadingVillages(false)

      return
    }

    const controller =
      new AbortController()

    villagesControllerRef.current =
      controller

    try {
      setLoadingVillages(true)

      const data =
        await fetchRegions(
          `villages/${encodeURIComponent(
            districtCode
          )}`,
          controller.signal
        )

      if (!controller.signal.aborted) {
        setVillages(data)
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return
      }

      console.error(
        'Failed to load villages:',
        error
      )

      if (!controller.signal.aborted) {
        setVillages([])

        setFieldError(
          'villageCode',
          'Gagal memuat kelurahan / desa.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingVillages(false)
      }
    }
  }

  /* =======================================================
     VILLAGE CHANGE
     ======================================================= */

  const handleVillageChange = (
    villageCode: string
  ) => {
    onChange({
      villageCode
    })

    clearError('villageCode')
  }

  /* =======================================================
     SELECTED REGION
     ======================================================= */

  const selectedProvince =
    provinces.find(
      item =>
        item.code === value.provinceCode
    )

  const selectedRegency =
    regencies.find(
      item =>
        item.code === value.regencyCode
    )

  const selectedDistrict =
    districts.find(
      item =>
        item.code === value.districtCode
    )

  const selectedVillage =
    villages.find(
      item =>
        item.code === value.villageCode
    )

  /* =======================================================
     RENDER HELPERS
     ======================================================= */

  const RequiredMark = () => (
    <span
      className={
        styles.profileRequired
      }
      aria-hidden='true'
    >
      *
    </span>
  )

  const ErrorMessage = ({
                          message
                        }: {
    message?: string
  }) => {
    if (!message) {
      return null
    }

    return (
      <div
        className={
          styles.profileFieldError
        }
      >
        <i className='tabler-alert-circle' />

        <span>{message}</span>
      </div>
    )
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className={
        styles.profileStepWrapper
      }
    >
      {/* =================================================
          HEADER
          ================================================= */}

      <div
        className={
          styles.profileStepHeader
        }
      >
        <div
          className={
            styles.profileStepHeaderIcon
          }
        >
          <i className='tabler-user-circle' />
        </div>

        <div
          className={
            styles.profileStepHeaderContent
          }
        >
          <Typography
            variant='h4'
            className={
              styles.profileStepTitle
            }
          >
            Profil Peserta
          </Typography>

          <Typography
            color='text.secondary'
            className={
              styles.profileStepSubtitle
            }
          >
            Lengkapi informasi pendidikan,
            alamat, dan status pekerjaan Anda.
          </Typography>
        </div>
      </div>

      {/* =================================================
          INFO
          ================================================= */}

      <div
        className={
          styles.profileStepInfo
        }
      >
        <div
          className={
            styles.profileStepInfoIcon
          }
        >
          <i className='tabler-sparkles' />
        </div>

        <div>
          <Typography
            variant='body2'
            className={
              styles.profileStepInfoTitle
            }
          >
            Lengkapi profil Anda
          </Typography>

          <Typography
            variant='caption'
            color='text.secondary'
          >
            Data ini membantu DISKOP
            menyesuaikan program pelatihan
            dengan profil Anda.
          </Typography>
        </div>
      </div>

      <Grid container spacing={5}>
        {/* =================================================
            ADDRESS HEADER
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.profileSectionHeader
            }
          >
            <div
              className={
                styles.profileSectionIcon
              }
            >
              <i className='tabler-map-pin' />
            </div>

            <div>
              <Typography
                variant='h6'
                className={
                  styles.profileSectionTitle
                }
              >
                Alamat Domisili
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Pilih wilayah tempat tinggal
                Anda.
              </Typography>
            </div>
          </div>
        </Grid>

        {/* =================================================
            PROVINCE
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            label={
              <>
                Provinsi <RequiredMark />
              </>
            }
            value={value.provinceCode}
            error={Boolean(
              errors.provinceCode
            )}
            onChange={event =>
              handleProvinceChange(
                event.target.value
              )
            }
            disabled={loadingProvinces}
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              {loadingProvinces ? (
                <>
                  <CircularProgress
                    size={18}
                    sx={{ mr: 2 }}
                  />

                  Memuat provinsi...
                </>
              ) : (
                'Pilih provinsi'
              )}
            </MenuItem>

            {provinces.map(
              province => (
                <MenuItem
                  key={province.code}
                  value={province.code}
                >
                  {province.name}
                </MenuItem>
              )
            )}
          </CustomTextField>

          <ErrorMessage
            message={
              errors.provinceCode
            }
          />

          {!errors.provinceCode &&
            selectedProvince && (
              <div
                className={
                  styles.profileFieldHint
                }
              >
                <i className='tabler-circle-check' />

                {selectedProvince.name}
              </div>
            )}
        </Grid>

        {/* =================================================
            REGENCY
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            label={
              <>
                Kabupaten / Kota{' '}
                <RequiredMark />
              </>
            }
            value={value.regencyCode}
            error={Boolean(
              errors.regencyCode
            )}
            onChange={event =>
              handleRegencyChange(
                event.target.value
              )
            }
            disabled={
              !value.provinceCode ||
              loadingRegencies
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              {!value.provinceCode ? (
                'Pilih provinsi terlebih dahulu'
              ) : loadingRegencies ? (
                <>
                  <CircularProgress
                    size={18}
                    sx={{ mr: 2 }}
                  />

                  Memuat kabupaten/kota...
                </>
              ) : (
                'Pilih kabupaten/kota'
              )}
            </MenuItem>

            {regencies.map(
              regency => (
                <MenuItem
                  key={regency.code}
                  value={regency.code}
                >
                  {regency.name}
                </MenuItem>
              )
            )}
          </CustomTextField>

          <ErrorMessage
            message={
              errors.regencyCode
            }
          />

          {!errors.regencyCode &&
            selectedRegency && (
              <div
                className={
                  styles.profileFieldHint
                }
              >
                <i className='tabler-circle-check' />

                {selectedRegency.name}
              </div>
            )}
        </Grid>

        {/* =================================================
            DISTRICT
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            label={
              <>
                Kecamatan <RequiredMark />
              </>
            }
            value={value.districtCode}
            error={Boolean(
              errors.districtCode
            )}
            onChange={event =>
              handleDistrictChange(
                event.target.value
              )
            }
            disabled={
              !value.regencyCode ||
              loadingDistricts
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              {!value.regencyCode ? (
                'Pilih kabupaten/kota terlebih dahulu'
              ) : loadingDistricts ? (
                <>
                  <CircularProgress
                    size={18}
                    sx={{ mr: 2 }}
                  />

                  Memuat kecamatan...
                </>
              ) : (
                'Pilih kecamatan'
              )}
            </MenuItem>

            {districts.map(
              district => (
                <MenuItem
                  key={district.code}
                  value={district.code}
                >
                  {district.name}
                </MenuItem>
              )
            )}
          </CustomTextField>

          <ErrorMessage
            message={
              errors.districtCode
            }
          />

          {!errors.districtCode &&
            selectedDistrict && (
              <div
                className={
                  styles.profileFieldHint
                }
              >
                <i className='tabler-circle-check' />

                {selectedDistrict.name}
              </div>
            )}
        </Grid>

        {/* =================================================
            VILLAGE
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            label={
              <>
                Kelurahan / Desa{' '}
                <RequiredMark />
              </>
            }
            value={value.villageCode}
            error={Boolean(
              errors.villageCode
            )}
            onChange={event =>
              handleVillageChange(
                event.target.value
              )
            }
            disabled={
              !value.districtCode ||
              loadingVillages
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              {!value.districtCode ? (
                'Pilih kecamatan terlebih dahulu'
              ) : loadingVillages ? (
                <>
                  <CircularProgress
                    size={18}
                    sx={{ mr: 2 }}
                  />

                  Memuat kelurahan/desa...
                </>
              ) : (
                'Pilih kelurahan/desa'
              )}
            </MenuItem>

            {villages.map(
              village => (
                <MenuItem
                  key={village.code}
                  value={village.code}
                >
                  {village.name}
                </MenuItem>
              )
            )}
          </CustomTextField>

          <ErrorMessage
            message={
              errors.villageCode
            }
          />

          {!errors.villageCode &&
            selectedVillage && (
              <div
                className={
                  styles.profileFieldHint
                }
              >
                <i className='tabler-circle-check' />

                {selectedVillage.name}
              </div>
            )}
        </Grid>

        {/* =================================================
            FULL ADDRESS
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <CustomTextField
            fullWidth
            multiline
            minRows={3}
            label={
              <>
                Alamat Lengkap{' '}
                <RequiredMark />
              </>
            }
            placeholder='Contoh: Jl. Ahmad Yani No. 10, RT 01/RW 02'
            value={value.fullAddress}
            error={Boolean(
              errors.fullAddress
            )}
            onChange={event => {
              const fullAddress =
                event.target.value

              onChange({
                fullAddress
              })

              if (fullAddress.trim()) {
                clearError(
                  'fullAddress'
                )
              }
            }}
          />

          <ErrorMessage
            message={
              errors.fullAddress
            }
          />
        </Grid>

        {/* =================================================
            POSTAL CODE
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            label={
              <>
                Kode Pos <RequiredMark />
              </>
            }
            placeholder='Contoh: 70711'
            value={value.postalCode}
            error={Boolean(
              errors.postalCode
            )}
            onChange={event => {
              const postalCode =
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 5)

              onChange({
                postalCode
              })

              if (
                /^\d{5}$/.test(
                  postalCode
                )
              ) {
                clearError(
                  'postalCode'
                )
              }
            }}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                maxLength: 5
              }
            }}
          />

          <ErrorMessage
            message={
              errors.postalCode
            }
          />
        </Grid>

        {/* =================================================
            REGION SUMMARY
            ================================================= */}

        {(selectedProvince ||
          selectedRegency ||
          selectedDistrict ||
          selectedVillage) && (
          <Grid size={{ xs: 12 }}>
            <div
              className={
                styles.profileRegionSummary
              }
            >
              <div
                className={
                  styles.profileRegionSummaryIcon
                }
              >
                <i className='tabler-map-2' />
              </div>

              <div
                className={
                  styles.profileRegionSummaryContent
                }
              >
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Wilayah yang dipilih
                </Typography>

                <Typography
                  variant='body2'
                  className={
                    styles.profileRegionSummaryText
                  }
                >
                  {[
                    selectedVillage?.name,
                    selectedDistrict?.name,
                    selectedRegency?.name,
                    selectedProvince?.name
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Typography>
              </div>

              <div
                className={
                  styles.profileRegionSummaryStatus
                }
              >
                <i className='tabler-circle-check' />
              </div>
            </div>
          </Grid>
        )}

        {/* =================================================
            EDUCATION HEADER
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.profileSectionHeader
            }
          >
            <div
              className={
                styles.profileSectionIcon
              }
            >
              <i className='tabler-school' />
            </div>

            <div>
              <Typography
                variant='h6'
                className={
                  styles.profileSectionTitle
                }
              >
                Pendidikan
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Informasi pendidikan terakhir
                Anda.
              </Typography>
            </div>
          </div>
        </Grid>

        {/* =================================================
            EDUCATION
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            label={
              <>
                Pendidikan Terakhir{' '}
                <RequiredMark />
              </>
            }
            value={value.education}
            error={Boolean(
              errors.education
            )}
            onChange={event => {
              const education =
                event.target.value

              onChange({
                education
              })

              if (education) {
                clearError(
                  'education'
                )
              }
            }}
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              Pilih pendidikan terakhir
            </MenuItem>

            <MenuItem value='sd'>
              SD / Sederajat
            </MenuItem>

            <MenuItem value='smp'>
              SMP / Sederajat
            </MenuItem>

            <MenuItem value='sma'>
              SMA / SMK / Sederajat
            </MenuItem>

            <MenuItem value='d1'>
              D1
            </MenuItem>

            <MenuItem value='d2'>
              D2
            </MenuItem>

            <MenuItem value='d3'>
              D3
            </MenuItem>

            <MenuItem value='d4'>
              D4
            </MenuItem>

            <MenuItem value='s1'>
              S1
            </MenuItem>

            <MenuItem value='s2'>
              S2
            </MenuItem>

            <MenuItem value='s3'>
              S3
            </MenuItem>
          </CustomTextField>

          <ErrorMessage
            message={
              errors.education
            }
          />
        </Grid>

        {/* =================================================
            INSTITUTION
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            label={
              <>
                Institusi Pendidikan{' '}
                <RequiredMark />
              </>
            }
            placeholder='Nama sekolah / perguruan tinggi'
            value={value.institution}
            error={Boolean(
              errors.institution
            )}
            onChange={event => {
              const institution =
                event.target.value

              onChange({
                institution
              })

              if (institution.trim()) {
                clearError(
                  'institution'
                )
              }
            }}
          />

          <ErrorMessage
            message={
              errors.institution
            }
          />
        </Grid>

        {/* =================================================
            MAJOR
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            label={
              <>
                Jurusan / Program Studi{' '}
                <RequiredMark />
              </>
            }
            placeholder='Contoh: Teknik Informatika'
            value={value.major}
            error={Boolean(
              errors.major
            )}
            onChange={event => {
              const major =
                event.target.value

              onChange({
                major
              })

              if (major.trim()) {
                clearError('major')
              }
            }}
          />

          <ErrorMessage
            message={errors.major}
          />
        </Grid>

        {/* =================================================
            GRADUATION YEAR
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            fullWidth
            label={
              <>
                Tahun Lulus{' '}
                <RequiredMark />
              </>
            }
            placeholder='Contoh: 2025'
            value={value.graduationYear}
            error={Boolean(
              errors.graduationYear
            )}
            onChange={event => {
              const graduationYear =
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 4)

              onChange({
                graduationYear
              })

              if (
                /^\d{4}$/.test(
                  graduationYear
                )
              ) {
                clearError(
                  'graduationYear'
                )
              }
            }}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                maxLength: 4
              }
            }}
          />

          <ErrorMessage
            message={
              errors.graduationYear
            }
          />
        </Grid>

        {/* =================================================
            EMPLOYMENT HEADER
            ================================================= */}

        <Grid size={{ xs: 12 }}>
          <div
            className={
              styles.profileSectionHeader
            }
          >
            <div
              className={
                styles.profileSectionIcon
              }
            >
              <i className='tabler-briefcase' />
            </div>

            <div>
              <Typography
                variant='h6'
                className={
                  styles.profileSectionTitle
                }
              >
                Status Pekerjaan
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Informasi pekerjaan Anda saat
                ini.
              </Typography>
            </div>
          </div>
        </Grid>

        {/* =================================================
            EMPLOYMENT STATUS
            ================================================= */}

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            label={
              <>
                Status Pekerjaan{' '}
                <RequiredMark />
              </>
            }
            value={
              value.employmentStatus
            }
            error={Boolean(
              errors.employmentStatus
            )}
            onChange={event => {
              const employmentStatus =
                event.target.value

              onChange({
                employmentStatus,

                // Reset conditional fields
                companyName: '',
                position: '',
                businessName: '',
                businessField: ''
              })

              clearError(
                'employmentStatus'
              )

              clearError(
                'companyName'
              )

              clearError('position')

              clearError(
                'businessName'
              )

              clearError(
                'businessField'
              )
            }}
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              Pilih status pekerjaan
            </MenuItem>

            <MenuItem value='student'>
              Pelajar / Mahasiswa
            </MenuItem>

            <MenuItem value='employee'>
              Karyawan Swasta
            </MenuItem>

            <MenuItem value='asn'>
              ASN
            </MenuItem>

            <MenuItem value='pppk'>
              PPPK
            </MenuItem>

            <MenuItem value='entrepreneur'>
              Wirausaha
            </MenuItem>

            <MenuItem value='jobseeker'>
              Belum Bekerja / Pencari Kerja
            </MenuItem>

            <MenuItem value='other'>
              Lainnya
            </MenuItem>
          </CustomTextField>

          <ErrorMessage
            message={
              errors.employmentStatus
            }
          />
        </Grid>

        {/* =================================================
            EMPLOYEE / ASN / PPPK
            ================================================= */}

        {(value.employmentStatus ===
          'employee' ||
          value.employmentStatus ===
          'asn' ||
          value.employmentStatus ===
          'pppk') && (
          <>
            {/* COMPANY */}

            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <CustomTextField
                fullWidth
                label={
                  <>
                    Instansi / Perusahaan{' '}
                    <RequiredMark />
                  </>
                }
                placeholder='Nama instansi atau perusahaan'
                value={
                  value.companyName
                }
                error={Boolean(
                  errors.companyName
                )}
                onChange={event => {
                  const companyName =
                    event.target.value

                  onChange({
                    companyName
                  })

                  if (
                    companyName.trim()
                  ) {
                    clearError(
                      'companyName'
                    )
                  }
                }}
              />

              <ErrorMessage
                message={
                  errors.companyName
                }
              />
            </Grid>

            {/* POSITION */}

            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <CustomTextField
                fullWidth
                label={
                  <>
                    Jabatan{' '}
                    <RequiredMark />
                  </>
                }
                placeholder='Jabatan saat ini'
                value={
                  value.position
                }
                error={Boolean(
                  errors.position
                )}
                onChange={event => {
                  const position =
                    event.target.value

                  onChange({
                    position
                  })

                  if (
                    position.trim()
                  ) {
                    clearError(
                      'position'
                    )
                  }
                }}
              />

              <ErrorMessage
                message={
                  errors.position
                }
              />
            </Grid>
          </>
        )}

        {/* =================================================
            ENTREPRENEUR
            ================================================= */}

        {value.employmentStatus ===
          'entrepreneur' && (
            <>
              {/* BUSINESS NAME */}

              <Grid
                size={{ xs: 12, sm: 6 }}
              >
                <CustomTextField
                  fullWidth
                  label={
                    <>
                      Nama Usaha{' '}
                      <RequiredMark />
                    </>
                  }
                  placeholder='Nama usaha'
                  value={
                    value.businessName
                  }
                  error={Boolean(
                    errors.businessName
                  )}
                  onChange={event => {
                    const businessName =
                      event.target.value

                    onChange({
                      businessName
                    })

                    if (
                      businessName.trim()
                    ) {
                      clearError(
                        'businessName'
                      )
                    }
                  }}
                />

                <ErrorMessage
                  message={
                    errors.businessName
                  }
                />
              </Grid>

              {/* BUSINESS FIELD */}

              <Grid
                size={{ xs: 12, sm: 6 }}
              >
                <CustomTextField
                  fullWidth
                  label={
                    <>
                      Bidang Usaha{' '}
                      <RequiredMark />
                    </>
                  }
                  placeholder='Contoh: Kuliner'
                  value={
                    value.businessField
                  }
                  error={Boolean(
                    errors.businessField
                  )}
                  onChange={event => {
                    const businessField =
                      event.target.value

                    onChange({
                      businessField
                    })

                    if (
                      businessField.trim()
                    ) {
                      clearError(
                        'businessField'
                      )
                    }
                  }}
                />

                <ErrorMessage
                  message={
                    errors.businessField
                  }
                />
              </Grid>
            </>
          )}

        {/* =================================================
            VALIDATION SUMMARY
            ================================================= */}

        {Object.keys(errors).length >
          0 && (
            <Grid size={{ xs: 12 }}>
              <div
                className={
                  styles.profileValidationSummary
                }
              >
                <div
                  className={
                    styles.profileValidationSummaryIcon
                  }
                >
                  <i className='tabler-alert-triangle' />
                </div>

                <div>
                  <Typography
                    variant='body2'
                    className={
                      styles.profileValidationSummaryTitle
                    }
                  >
                    Masih ada data yang perlu
                    dilengkapi
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Periksa kembali field yang
                    ditandai sebelum melanjutkan.
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
            styles.profileStepActions
          }
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={handlePrev}
            disabled={isSubmitting}
            className={
              styles.profileStepBackButton
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
            onClick={
              handleProfileNext
            }
            disabled={isSubmitting}
            className={
              styles.profileStepNextButton
            }
            endIcon={
              isSubmitting ? (
                <CircularProgress
                  size={18}
                  color='inherit'
                />
              ) : (
                <DirectionalIcon
                  ltrIconClass='tabler-arrow-right'
                  rtlIconClass='tabler-arrow-left'
                />
              )
            }
          >
            {isSubmitting
              ? 'Memproses...'
              : 'Lanjutkan'}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default StepProfile

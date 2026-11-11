'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import ProfileImageCropDialog from './ProfileImageCropDialog'

// Style Imports
import styles from './Profile.module.css'

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

type ProfileData = {
  fullName: string
  username: string
  email: string
  phoneNumber: string
  nik: string
  birthPlace: string
  birthDate: Date | null
  gender: string

  // Wilayah berasal dari data registrasi
  provinceCode: string
  provinceName: string
  regencyCode: string
  regencyName: string
  districtCode: string
  districtName: string
  villageCode: string
  villageName: string

  address: string
  postalCode: string

  education: string
  institution: string
  graduationYear: string
}

/* =========================================================
   INITIAL DATA
========================================================= */

const initialData: ProfileData = {
  fullName: 'Muhammad Rizki Firdaus',
  username: 'rizkifirdaus',
  email: 'rizki@example.com',
  phoneNumber: '85136373842',
  nik: '6371011234567890',
  birthPlace: 'Banjarmasin',
  birthDate: new Date('2005-01-01'),
  gender: 'male',

  provinceCode: '63',
  regencyCode: '63.71',
  districtCode: '63.71.01',
  villageCode: '63.71.01.1001',

  address: 'Banjarmasin, Kalimantan Selatan',
  postalCode: '710011',

  education: 's1',
  institution: 'Universitas',
  graduationYear: '2027'
}
const defaultAvatar = '/images/avatars/tasya-pp.png'

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_IMAGE_SIZE = 3 * 1024 * 1024

const REGION_API = '/api/regions'

/* =========================================================
   HELPERS
========================================================= */

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')

  let normalized = digits

  if (normalized.startsWith('62')) {
    normalized = normalized.slice(2)
  } else if (normalized.startsWith('0')) {
    normalized = normalized.slice(1)
  }

  normalized = normalized
    .replace(/\D/g, '')
    .slice(0, 12)

  if (normalized && normalized[0] !== '8') {
    return ''
  }

  const groups = normalized.match(/.{1,4}/g) ?? []

  return groups.join(' ')
}

const normalizePhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')

  let normalized = digits

  if (normalized.startsWith('62')) {
    normalized = normalized.slice(2)
  } else if (normalized.startsWith('0')) {
    normalized = normalized.slice(1)
  }

  return normalized.slice(0, 12)
}

const maskNik = (nik: string) => {
  if (!nik) return ''

  if (nik.length <= 6) {
    return '•'.repeat(nik.length)
  }

  return `${nik.slice(0, 6)}${'•'.repeat(
    Math.max(0, nik.length - 6)
  )}`
}

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

const Profile = () => {
  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] =
    useState<ProfileData>(initialData)

  const [originalData, setOriginalData] =
    useState<ProfileData>(initialData)

  /* =======================================================
     PHOTO STATE
  ======================================================= */

  const [imgSrc, setImgSrc] =
    useState(defaultAvatar)

  const [originalImgSrc, setOriginalImgSrc] =
    useState(defaultAvatar)

  const [cropOpen, setCropOpen] =
    useState(false)

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  /* =======================================================
     PERSONAL STATE
  ======================================================= */

  const [showNik, setShowNik] =
    useState(false)

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [errors, setErrors] =
    useState<Record<string, string>>({})

  const [formError, setFormError] =
    useState('')

  const [saveSuccess, setSaveSuccess] =
    useState(false)

  const [isSaving, setIsSaving] =
    useState(false)

  /* =======================================================
     REGION STATE
  ======================================================= */

  const [provinces, setProvinces] =
    useState<Region[]>([])

  const [regencies, setRegencies] =
    useState<Region[]>([])

  const [districts, setDistricts] =
    useState<Region[]>([])

  const [villages, setVillages] =
    useState<Region[]>([])

  const [loadingProvinces, setLoadingProvinces] =
    useState(false)

  const [loadingRegencies, setLoadingRegencies] =
    useState(false)

  const [loadingDistricts, setLoadingDistricts] =
    useState(false)

  const [loadingVillages, setLoadingVillages] =
    useState(false)

  const provincesControllerRef =
    useRef<AbortController | null>(null)

  const regenciesControllerRef =
    useRef<AbortController | null>(null)

  const districtsControllerRef =
    useRef<AbortController | null>(null)

  const villagesControllerRef =
    useRef<AbortController | null>(null)

  /* =======================================================
     DIRTY STATE
  ======================================================= */

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(formData) !==
      JSON.stringify(originalData) ||
      imgSrc !== originalImgSrc
    )
  }, [
    formData,
    originalData,
    imgSrc,
    originalImgSrc
  ])

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleFormChange = <
    T extends keyof ProfileData
  >(
    field: T,
    value: ProfileData[T]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    setErrors(prev => ({
      ...prev,
      [field]: ''
    }))

    setFormError('')
    setSaveSuccess(false)
  }

  /* =======================================================
     PHONE
  ======================================================= */

  const handlePhoneChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const normalized =
      normalizePhoneNumber(
        event.target.value
      )

    handleFormChange(
      'phoneNumber',
      normalized
    )
  }

  /* =======================================================
     REGION: LOAD PROVINCES
  ======================================================= */

  useEffect(() => {
    const controller = new AbortController()

    provincesControllerRef.current = controller

    const loadInitialRegions = async () => {
      try {
        setLoadingProvinces(true)

        const provinceData = await fetchRegions(
          'provinces',
          controller.signal
        )

        if (controller.signal.aborted) return

        setProvinces(provinceData)
        setLoadingProvinces(false)

        if (formData.provinceCode) {
          setLoadingRegencies(true)

          const regencyData = await fetchRegions(
            `regencies/${encodeURIComponent(
              formData.provinceCode
            )}`,
            controller.signal
          )

          if (controller.signal.aborted) return

          setRegencies(regencyData)
          setLoadingRegencies(false)
        }

        if (formData.regencyCode) {
          setLoadingDistricts(true)

          const districtData = await fetchRegions(
            `districts/${encodeURIComponent(
              formData.regencyCode
            )}`,
            controller.signal
          )

          if (controller.signal.aborted) return

          setDistricts(districtData)
          setLoadingDistricts(false)
        }

        if (formData.districtCode) {
          setLoadingVillages(true)

          const villageData = await fetchRegions(
            `villages/${encodeURIComponent(
              formData.districtCode
            )}`,
            controller.signal
          )

          if (controller.signal.aborted) return

          setVillages(villageData)
          setLoadingVillages(false)
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'Failed to load initial region data:',
          error
        )

        if (!controller.signal.aborted) {
          setProvinces([])
          setRegencies([])
          setDistricts([])
          setVillages([])

          setLoadingProvinces(false)
          setLoadingRegencies(false)
          setLoadingDistricts(false)
          setLoadingVillages(false)
        }
      }
    }

    loadInitialRegions()

    return () => {
      controller.abort()

      if (
        provincesControllerRef.current === controller
      ) {
        provincesControllerRef.current = null
      }
    }

    // Initial load saja.
    // Setelah itu perubahan dropdown tetap ditangani
    // oleh handleProvinceChange / handleRegencyChange /
    // handleDistrictChange seperti kode kamu sekarang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =======================================================
     REGION: PROVINCE CHANGE
  ======================================================= */

  const handleProvinceChange = async (
    provinceCode: string
  ) => {
    handleFormChange(
      'provinceCode',
      provinceCode
    )

    setFormData(prev => ({
      ...prev,
      provinceCode,
      regencyCode: '',
      districtCode: '',
      villageCode: '',
      postalCode: ''
    }))

    setRegencies([])
    setDistricts([])
    setVillages([])

    setErrors(prev => ({
      ...prev,
      provinceCode: '',
      regencyCode: '',
      districtCode: '',
      villageCode: '',
      postalCode: ''
    }))

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
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingRegencies(false)
      }
    }
  }

  /* =======================================================
     REGION: REGENCY CHANGE
  ======================================================= */

  const handleRegencyChange = async (
    regencyCode: string
  ) => {
    setFormData(prev => ({
      ...prev,
      regencyCode,
      districtCode: '',
      villageCode: '',
      postalCode: ''
    }))

    setErrors(prev => ({
      ...prev,
      regencyCode: '',
      districtCode: '',
      villageCode: '',
      postalCode: ''
    }))

    setDistricts([])
    setVillages([])

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
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingDistricts(false)
      }
    }
  }

  /* =======================================================
     REGION: DISTRICT CHANGE
  ======================================================= */

  const handleDistrictChange = async (
    districtCode: string
  ) => {
    setFormData(prev => ({
      ...prev,
      districtCode,
      villageCode: '',
      postalCode: ''
    }))

    setErrors(prev => ({
      ...prev,
      districtCode: '',
      villageCode: '',
      postalCode: ''
    }))

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
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingVillages(false)
      }
    }
  }

  /* =======================================================
     REGION: VILLAGE CHANGE
  ======================================================= */

  const handleVillageChange = (
    villageCode: string
  ) => {
    handleFormChange(
      'villageCode',
      villageCode
    )
  }

  /* =======================================================
     REGION: SELECTED DATA
  ======================================================= */

  const selectedProvince =
    provinces.find(
      item =>
        item.code ===
        formData.provinceCode
    )

  const selectedRegency =
    regencies.find(
      item =>
        item.code ===
        formData.regencyCode
    )

  const selectedDistrict =
    districts.find(
      item =>
        item.code ===
        formData.districtCode
    )

  const selectedVillage =
    villages.find(
      item =>
        item.code ===
        formData.villageCode
    )

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const nextErrors: Record<
      string,
      string
    > = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName =
        'Nama lengkap wajib diisi.'
    }

    if (!formData.email.trim()) {
      nextErrors.email =
        'Email wajib diisi.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      nextErrors.email =
        'Format email tidak valid.'
    }

    if (
      !/^8\d{9,11}$/.test(
        formData.phoneNumber
      )
    ) {
      nextErrors.phoneNumber =
        'Nomor HP harus diawali 8 dan terdiri dari 10–12 digit.'
    }

    if (!formData.birthPlace.trim()) {
      nextErrors.birthPlace =
        'Tempat lahir wajib diisi.'
    }

    if (!formData.birthDate) {
      nextErrors.birthDate =
        'Tanggal lahir wajib diisi.'
    }

    if (!formData.gender) {
      nextErrors.gender =
        'Jenis kelamin wajib dipilih.'
    }

    /* -------------------------------------------------------
       REGION
    ------------------------------------------------------- */

    if (!formData.provinceCode) {
      nextErrors.provinceCode =
        'Provinsi wajib dipilih.'
    }

    if (!formData.regencyCode) {
      nextErrors.regencyCode =
        'Kabupaten / Kota wajib dipilih.'
    }

    if (!formData.districtCode) {
      nextErrors.districtCode =
        'Kecamatan wajib dipilih.'
    }

    if (!formData.villageCode) {
      nextErrors.villageCode =
        'Kelurahan / Desa wajib dipilih.'
    }

    if (!formData.address.trim()) {
      nextErrors.address =
        'Alamat lengkap wajib diisi.'
    } else if (
      formData.address.trim().length < 10
    ) {
      nextErrors.address =
        'Alamat lengkap terlalu singkat.'
    }

    if (!formData.postalCode) {
      nextErrors.postalCode =
        'Kode pos wajib diisi.'
    } else if (
      !/^\d{5}$/.test(
        formData.postalCode
      )
    ) {
      nextErrors.postalCode =
        'Kode pos harus terdiri dari 5 digit.'
    }

    /* -------------------------------------------------------
       GRADUATION YEAR
    ------------------------------------------------------- */

    if (formData.graduationYear) {
      const graduationYear =
        Number(
          formData.graduationYear
        )

      if (
        !/^\d{4}$/.test(
          formData.graduationYear
        ) ||
        graduationYear < 1950 ||
        graduationYear >
        new Date().getFullYear() + 10
      ) {
        nextErrors.graduationYear =
          'Masukkan tahun lulus yang valid.'
      }
    }

    setErrors(nextErrors)

    return (
      Object.keys(nextErrors).length === 0
    )
  }

  /* =======================================================
     PHOTO UPLOAD
  ======================================================= */

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) return

    setFormError('')
    setSaveSuccess(false)

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setFormError(
        'Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.'
      )

      event.target.value = ''

      return
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setFormError(
        'Ukuran foto maksimal 3 MB.'
      )

      event.target.value = ''

      return
    }

    const reader =
      new FileReader()

    reader.onload = () => {
      const result =
        reader.result as string

      setSelectedImage(result)
      setCropOpen(true)
    }

    reader.onerror = () => {
      setFormError(
        'Foto gagal dibaca. Silakan coba lagi.'
      )
    }

    reader.readAsDataURL(file)

    event.target.value = ''
  }

  /* =======================================================
     PHOTO CROP
  ======================================================= */

  const handleCropComplete = (
    croppedImage: string
  ) => {
    setImgSrc(croppedImage)
    setCropOpen(false)
    setSelectedImage(null)
    setSaveSuccess(false)
    setFormError('')
  }

  const handleCropClose = () => {
    setCropOpen(false)
    setSelectedImage(null)
  }

  const handleResetPhoto = () => {
    setImgSrc(originalImgSrc)
    setSaveSuccess(false)
    setFormError('')
  }

  /* =======================================================
     RESET FORM
  ======================================================= */

  const handleReset = () => {
    setFormData(originalData)
    setImgSrc(originalImgSrc)

    setErrors({})
    setFormError('')
    setSaveSuccess(false)

    /*
     * Reset region options juga supaya
     * tidak menampilkan data wilayah lama.
     */
    setRegencies([])
    setDistricts([])
    setVillages([])
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setSaveSuccess(false)
    setFormError('')

    if (!validate()) {
      setFormError(
        'Periksa kembali data yang masih belum sesuai.'
      )

      return
    }

    setIsSaving(true)

    try {
      /*
       * TODO:
       * Kirim formData + foto hasil crop
       * ke API / server action.
       *
       * Contoh:
       *
       * await updateProfile({
       *   ...formData,
       *   avatar: imgSrc
       * })
       */

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            900
          )
      )

      setOriginalData(formData)
      setOriginalImgSrc(imgSrc)

      setSaveSuccess(true)
    } catch {
      setFormError(
        'Perubahan profil gagal disimpan. Silakan coba lagi.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  /* =======================================================
     DISPLAY VALUES
  ======================================================= */

  const displayedPhone =
    formatPhoneNumber(
      formData.phoneNumber
    )

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <div
        className={
          styles.profileWrapper
        }
      >
        {/* =================================================
            FEEDBACK
        ================================================= */}

        {formError && (
          <Alert
            severity='error'
            variant='outlined'
            className={
              styles.profileAlert
            }
            icon={
              <i className='tabler-alert-circle' />
            }
          >
            {formError}
          </Alert>
        )}

        {saveSuccess && (
          <Alert
            severity='success'
            variant='outlined'
            className={
              styles.profileAlert
            }
            icon={
              <i className='tabler-circle-check' />
            }
          >
            Perubahan profil berhasil
            disimpan.
          </Alert>
        )}

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <Card
          className={
            styles.profileCard
          }
        >
          {/* =================================================
              FOTO PROFIL
          ================================================= */}

          <CardContent
            className={
              styles.photoSection
            }
          >
            <div
              className={
                styles.photoPreviewWrapper
              }
            >
              <div
                className={
                  styles.photoGlow
                }
              />

              <img
                src={imgSrc}
                alt='Foto profil'
                className={
                  styles.photoPreview
                }
              />

              <button
                type='button'
                className={
                  styles.photoEditButton
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
                aria-label='Ganti foto profil'
              >
                <i className='tabler-camera' />
              </button>
            </div>

            <div
              className={
                styles.photoContent
              }
            >
              <div
                className={
                  styles.photoTitleRow
                }
              >
                <Typography
                  variant='h6'
                  className={
                    styles.photoTitle
                  }
                >
                  Foto Profil
                </Typography>

                <Chip
                  size='small'
                  label='Pribadi'
                  icon={
                    <i className='tabler-lock text-sm' />
                  }
                  variant='tonal'
                  color='secondary'
                />
              </div>

              <Typography
                variant='body2'
                color='text.secondary'
                className={
                  styles.photoDescription
                }
              >
                Gunakan foto yang jelas
                dan mudah dikenali. Anda
                dapat memotong,
                memperbesar, atau memutar
                foto sebelum menyimpan.
              </Typography>

              <div
                className={
                  styles.photoActions
                }
              >
                <Button
                  variant='contained'
                  startIcon={
                    <i className='tabler-upload' />
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Ganti Foto
                </Button>

                <Button
                  variant='tonal'
                  color='secondary'
                  startIcon={
                    <i className='tabler-refresh' />
                  }
                  onClick={
                    handleResetPhoto
                  }
                  disabled={
                    imgSrc ===
                    originalImgSrc
                  }
                >
                  Reset
                </Button>

                <input
                  ref={fileInputRef}
                  hidden
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  onChange={
                    handleFileInputChange
                  }
                />
              </div>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                JPG, PNG, atau WebP ·
                Maksimal 3 MB
              </Typography>
            </div>
          </CardContent>

          <Divider />

          {/* =================================================
              FORM
          ================================================= */}

          <CardContent>
            <form
              onSubmit={
                handleSubmit
              }
              noValidate
            >
              <Grid
                container
                spacing={5}
              >
                {/* =================================================
                    INFORMASI AKUN
                ================================================= */}

                <Grid
                  size={{ xs: 12 }}
                >
                  <div
                    className={
                      styles.sectionHeader
                    }
                  >
                    <div
                      className={
                        styles.sectionIcon
                      }
                    >
                      <i className='tabler-user' />
                    </div>

                    <div>
                      <Typography
                        variant='h6'
                        className={
                          styles.sectionTitle
                        }
                      >
                        Informasi Akun
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                      >
                        Informasi dasar yang
                        digunakan untuk akun
                        Anda.
                      </Typography>
                    </div>
                  </div>
                </Grid>

                {/* =================================================
                    NAMA LENGKAP
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    required
                    label='Nama Lengkap'
                    value={
                      formData.fullName
                    }
                    placeholder='Nama lengkap'
                    error={Boolean(
                      errors.fullName
                    )}
                    helperText={
                      errors.fullName ||
                      'Gunakan nama sesuai identitas resmi.'
                    }
                    onChange={event =>
                      handleFormChange(
                        'fullName',
                        event.target.value
                      )
                    }
                  />
                </Grid>

                {/* =================================================
                    USERNAME
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    label='Username'
                    value={
                      formData.username
                    }
                    slotProps={{
                      input: {
                        readOnly: true,

                        startAdornment: (
                          <InputAdornment position='start'>
                            <span
                              className={
                                styles.usernamePrefix
                              }
                            >
                              @
                            </span>
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position='end'>
                            <Tooltip
                              title='Username tidak dapat diubah'
                            >
                              <span>
                                <i className='tabler-lock text-textSecondary' />
                              </span>
                            </Tooltip>
                          </InputAdornment>
                        )
                      }
                    }}
                    helperText={
                      <span
                        className={
                          styles.readonlyHelper
                        }
                      >
                        Username digunakan
                        sebagai identitas login
                        dan tidak dapat diubah.
                      </span>
                    }
                  />
                </Grid>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    required
                    type='email'
                    label='Email'
                    value={
                      formData.email
                    }
                    placeholder='nama@email.com'
                    error={Boolean(
                      errors.email
                    )}
                    helperText={
                      errors.email ||
                      'Gunakan email yang masih aktif.'
                    }
                    onChange={event =>
                      handleFormChange(
                        'email',
                        event.target.value
                      )
                    }
                  />
                </Grid>

                {/* =================================================
                    NOMOR HP
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    required
                    label='Nomor HP'
                    value={
                      displayedPhone
                    }
                    placeholder='8513 6373 842'
                    error={Boolean(
                      errors.phoneNumber
                    )}
                    helperText={
                      errors.phoneNumber ||
                      'Nomor akan disimpan tanpa +62.'
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <span
                              className={
                                styles.phonePrefix
                              }
                            >
                              +62
                            </span>
                          </InputAdornment>
                        )
                      },
                      htmlInput: {
                        inputMode:
                          'numeric'
                      }
                    }}
                    onChange={
                      handlePhoneChange
                    }
                  />
                </Grid>

                {/* =================================================
                    DATA PRIBADI
                ================================================= */}

                <Grid
                  size={{ xs: 12 }}
                >
                  <Divider
                    className={
                      styles.sectionDivider
                    }
                  />

                  <div
                    className={
                      styles.sectionHeader
                    }
                  >
                    <div
                      className={
                        styles.sectionIcon
                      }
                    >
                      <i className='tabler-id' />
                    </div>

                    <div>
                      <Typography
                        variant='h6'
                        className={
                          styles.sectionTitle
                        }
                      >
                        Data Pribadi
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                      >
                        Data identitas pribadi
                        peserta.
                      </Typography>
                    </div>
                  </div>
                </Grid>

                {/* =================================================
                    NIK
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    label='NIK'
                    value={
                      showNik
                        ? formData.nik
                        : maskNik(
                          formData.nik
                        )
                    }
                    slotProps={{
                      input: {
                        readOnly: true,

                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={() =>
                                setShowNik(
                                  prev =>
                                    !prev
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
                      },
                      htmlInput: {
                        inputMode:
                          'numeric'
                      }
                    }}
                    helperText={
                      <span
                        className={
                          styles.privateHelper
                        }
                      >
                        <i className='tabler-lock' />
                        NIK bersifat privat
                        dan tidak dapat diubah
                        dari halaman ini.
                      </span>
                    }
                  />
                </Grid>

                {/* =================================================
                    TEMPAT LAHIR
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    required
                    label='Tempat Lahir'
                    value={
                      formData.birthPlace
                    }
                    placeholder='Contoh: Banjarmasin'
                    error={Boolean(
                      errors.birthPlace
                    )}
                    helperText={
                      errors.birthPlace
                    }
                    onChange={event =>
                      handleFormChange(
                        'birthPlace',
                        event.target.value
                      )
                    }
                  />
                </Grid>

                {/* =================================================
                    TANGGAL LAHIR
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <AppReactDatepicker
                    selected={
                      formData.birthDate
                    }
                    onChange={(
                      date: Date | null
                    ) =>
                      handleFormChange(
                        'birthDate',
                        date
                      )
                    }
                    dateFormat='dd/MM/yyyy'
                    placeholderText='DD/MM/YYYY'
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
                    customInput={
                      <CustomTextField
                        fullWidth
                        required
                        label='Tanggal Lahir'
                        error={Boolean(
                          errors.birthDate
                        )}
                        helperText={
                          errors.birthDate
                        }
                      />
                    }
                  />
                </Grid>

                {/* =================================================
                    JENIS KELAMIN
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    select
                    fullWidth
                    required
                    label='Jenis Kelamin'
                    value={
                      formData.gender
                    }
                    error={Boolean(
                      errors.gender
                    )}
                    helperText={
                      errors.gender
                    }
                    onChange={event =>
                      handleFormChange(
                        'gender',
                        event.target.value
                      )
                    }
                  >
                    <MenuItem value=''>
                      Pilih jenis kelamin
                    </MenuItem>

                    <MenuItem value='male'>
                      Laki-laki
                    </MenuItem>

                    <MenuItem value='female'>
                      Perempuan
                    </MenuItem>
                  </CustomTextField>
                </Grid>

                {/* =================================================
                    ALAMAT DOMISILI
                ================================================= */}

                <Grid
                  size={{ xs: 12 }}
                >
                  <Divider
                    className={
                      styles.sectionDivider
                    }
                  />

                  <div
                    className={
                      styles.sectionHeader
                    }
                  >
                    <div
                      className={
                        styles.sectionIcon
                      }
                    >
                      <i className='tabler-map-pin' />
                    </div>

                    <div>
                      <Typography
                        variant='h6'
                        className={
                          styles.sectionTitle
                        }
                      >
                        Alamat Domisili
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                      >
                        Informasi wilayah dan
                        alamat tempat tinggal
                        Anda.
                      </Typography>
                    </div>
                  </div>
                </Grid>

                {/* =================================================
                    PROVINSI
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    select
                    fullWidth
                    required
                    label='Provinsi'
                    value={
                      formData.provinceCode
                    }
                    error={Boolean(
                      errors.provinceCode
                    )}
                    helperText={
                      errors.provinceCode
                    }
                    disabled={
                      loadingProvinces
                    }
                    onChange={event =>
                      handleProvinceChange(
                        event.target.value
                      )
                    }
                    slotProps={{
                      select: {
                        displayEmpty: true
                      }
                    }}
                  >
                    <MenuItem value=''>
                      {loadingProvinces
                        ? 'Memuat provinsi...'
                        : 'Pilih provinsi'}
                    </MenuItem>

                    {provinces.map(
                      province => (
                        <MenuItem
                          key={
                            province.code
                          }
                          value={
                            province.code
                          }
                        >
                          {
                            province.name
                          }
                        </MenuItem>
                      )
                    )}
                  </CustomTextField>

                  {!errors.provinceCode &&
                    selectedProvince && (
                      <div
                        className={
                          styles.profileFieldHint
                        }
                      >
                        <i className='tabler-circle-check' />
                        {
                          selectedProvince.name
                        }
                      </div>
                    )}
                </Grid>

                {/* =================================================
                    KABUPATEN / KOTA
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    select
                    fullWidth
                    required
                    label='Kabupaten / Kota'
                    value={
                      formData.regencyCode
                    }
                    error={Boolean(
                      errors.regencyCode
                    )}
                    helperText={
                      errors.regencyCode
                    }
                    disabled={
                      !formData.provinceCode ||
                      loadingRegencies
                    }
                    onChange={event =>
                      handleRegencyChange(
                        event.target.value
                      )
                    }
                    slotProps={{
                      select: {
                        displayEmpty: true
                      }
                    }}
                  >
                    <MenuItem value=''>
                      {!formData.provinceCode
                        ? 'Pilih provinsi terlebih dahulu'
                        : loadingRegencies
                          ? 'Memuat kabupaten/kota...'
                          : 'Pilih kabupaten/kota'}
                    </MenuItem>

                    {regencies.map(
                      regency => (
                        <MenuItem
                          key={
                            regency.code
                          }
                          value={
                            regency.code
                          }
                        >
                          {
                            regency.name
                          }
                        </MenuItem>
                      )
                    )}
                  </CustomTextField>

                  {!errors.regencyCode &&
                    selectedRegency && (
                      <div
                        className={
                          styles.profileFieldHint
                        }
                      >
                        <i className='tabler-circle-check' />
                        {
                          selectedRegency.name
                        }
                      </div>
                    )}
                </Grid>

                {/* =================================================
                    KECAMATAN
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    select
                    fullWidth
                    required
                    label='Kecamatan'
                    value={
                      formData.districtCode
                    }
                    error={Boolean(
                      errors.districtCode
                    )}
                    helperText={
                      errors.districtCode
                    }
                    disabled={
                      !formData.regencyCode ||
                      loadingDistricts
                    }
                    onChange={event =>
                      handleDistrictChange(
                        event.target.value
                      )
                    }
                    slotProps={{
                      select: {
                        displayEmpty: true
                      }
                    }}
                  >
                    <MenuItem value=''>
                      {!formData.regencyCode
                        ? 'Pilih kabupaten/kota terlebih dahulu'
                        : loadingDistricts
                          ? 'Memuat kecamatan...'
                          : 'Pilih kecamatan'}
                    </MenuItem>

                    {districts.map(
                      district => (
                        <MenuItem
                          key={
                            district.code
                          }
                          value={
                            district.code
                          }
                        >
                          {
                            district.name
                          }
                        </MenuItem>
                      )
                    )}
                  </CustomTextField>

                  {!errors.districtCode &&
                    selectedDistrict && (
                      <div
                        className={
                          styles.profileFieldHint
                        }
                      >
                        <i className='tabler-circle-check' />
                        {
                          selectedDistrict.name
                        }
                      </div>
                    )}
                </Grid>

                {/* =================================================
                    KELURAHAN / DESA
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    select
                    fullWidth
                    required
                    label='Kelurahan / Desa'
                    value={
                      formData.villageCode
                    }
                    error={Boolean(
                      errors.villageCode
                    )}
                    helperText={
                      errors.villageCode
                    }
                    disabled={
                      !formData.districtCode ||
                      loadingVillages
                    }
                    onChange={event =>
                      handleVillageChange(
                        event.target.value
                      )
                    }
                    slotProps={{
                      select: {
                        displayEmpty: true
                      }
                    }}
                  >
                    <MenuItem value=''>
                      {!formData.districtCode
                        ? 'Pilih kecamatan terlebih dahulu'
                        : loadingVillages
                          ? 'Memuat kelurahan/desa...'
                          : 'Pilih kelurahan/desa'}
                    </MenuItem>

                    {villages.map(
                      village => (
                        <MenuItem
                          key={
                            village.code
                          }
                          value={
                            village.code
                          }
                        >
                          {
                            village.name
                          }
                        </MenuItem>
                      )
                    )}
                  </CustomTextField>

                  {!errors.villageCode &&
                    selectedVillage && (
                      <div
                        className={
                          styles.profileFieldHint
                        }
                      >
                        <i className='tabler-circle-check' />
                        {
                          selectedVillage.name
                        }
                      </div>
                    )}
                </Grid>

                {/* =================================================
                    ALAMAT LENGKAP
                ================================================= */}

                <Grid
                  size={{ xs: 12 }}
                >
                  <CustomTextField
                    fullWidth
                    required
                    multiline
                    minRows={3}
                    label='Alamat Lengkap'
                    value={
                      formData.address
                    }
                    placeholder='Contoh: Jl. Ahmad Yani No. 10, RT 01/RW 02'
                    error={Boolean(
                      errors.address
                    )}
                    helperText={
                      errors.address ||
                      'Masukkan nama jalan, nomor rumah, RT/RW, dan detail alamat lainnya.'
                    }
                    onChange={event =>
                      handleFormChange(
                        'address',
                        event.target.value
                      )
                    }
                  />
                </Grid>

                {/* =================================================
                    KODE POS
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    required
                    label='Kode Pos'
                    value={
                      formData.postalCode
                    }
                    placeholder='Contoh: 70111'
                    error={Boolean(
                      errors.postalCode
                    )}
                    helperText={
                      errors.postalCode ||
                      'Kode pos sesuai wilayah tempat tinggal.'
                    }
                    onChange={event => {
                      const postalCode =
                        event.target.value
                          .replace(
                            /\D/g,
                            ''
                          )
                          .slice(0, 5)

                      handleFormChange(
                        'postalCode',
                        postalCode
                      )
                    }}
                    slotProps={{
                      htmlInput: {
                        inputMode:
                          'numeric',
                        maxLength: 5
                      }
                    }}
                  />
                </Grid>

                {/* =================================================
                    REGION SUMMARY
                ================================================= */}

                {(selectedProvince ||
                  selectedRegency ||
                  selectedDistrict ||
                  selectedVillage) && (
                  <Grid
                    size={{ xs: 12 }}
                  >
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
                            .filter(
                              Boolean
                            )
                            .join(
                              ', '
                            )}
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
                    PENDIDIKAN
                ================================================= */}

                <Grid
                  size={{ xs: 12 }}
                >
                  <Divider
                    className={
                      styles.sectionDivider
                    }
                  />

                  <div
                    className={
                      styles.sectionHeader
                    }
                  >
                    <div
                      className={
                        styles.sectionIcon
                      }
                    >
                      <i className='tabler-school' />
                    </div>

                    <div>
                      <Typography
                        variant='h6'
                        className={
                          styles.sectionTitle
                        }
                      >
                        Pendidikan
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                      >
                        Informasi pendidikan
                        terakhir Anda.
                      </Typography>
                    </div>
                  </div>
                </Grid>

                {/* =================================================
                    PENDIDIKAN TERAKHIR
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    select
                    fullWidth
                    label='Pendidikan Terakhir'
                    value={
                      formData.education
                    }
                    onChange={event =>
                      handleFormChange(
                        'education',
                        event.target.value
                      )
                    }
                  >
                    <MenuItem value='sd'>
                      SD / Sederajat
                    </MenuItem>

                    <MenuItem value='smp'>
                      SMP / Sederajat
                    </MenuItem>

                    <MenuItem value='sma'>
                      SMA / SMK /
                      Sederajat
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
                </Grid>

                {/* =================================================
                    INSTITUSI
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    label='Institusi Pendidikan'
                    value={
                      formData.institution
                    }
                    placeholder='Nama sekolah / universitas'
                    onChange={event =>
                      handleFormChange(
                        'institution',
                        event.target.value
                      )
                    }
                  />
                </Grid>

                {/* =================================================
                    TAHUN LULUS
                ================================================= */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}
                >
                  <CustomTextField
                    fullWidth
                    label='Tahun Lulus'
                    value={
                      formData.graduationYear
                    }
                    placeholder='Contoh: 2027'
                    error={Boolean(
                      errors.graduationYear
                    )}
                    helperText={
                      errors.graduationYear ||
                      'Masukkan tahun kelulusan, contoh 2027.'
                    }
                    slotProps={{
                      htmlInput: {
                        inputMode:
                          'numeric',
                        pattern:
                          '[0-9]*',
                        maxLength: 4
                      }
                    }}
                    onChange={event => {
                      const value =
                        event.target.value
                          .replace(
                            /\D/g,
                            ''
                          )
                          .slice(0, 4)

                      handleFormChange(
                        'graduationYear',
                        value
                      )
                    }}
                  />
                </Grid>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Grid
                  size={{ xs: 12 }}
                >
                  <Divider
                    className={
                      styles.sectionDivider
                    }
                  />

                  <div
                    className={
                      styles.formActions
                    }
                  >
                    <div>
                      {isDirty && (
                        <Typography
                          variant='caption'
                          color='text.secondary'
                        >
                          Ada perubahan yang
                          belum disimpan.
                        </Typography>
                      )}
                    </div>

                    <div
                      className={
                        styles.actionButtons
                      }
                    >
                      <Button
                        type='button'
                        variant='tonal'
                        color='secondary'
                        disabled={
                          !isDirty ||
                          isSaving
                        }
                        onClick={
                          handleReset
                        }
                      >
                        Reset
                      </Button>

                      <Button
                        type='submit'
                        variant='contained'
                        disabled={
                          !isDirty ||
                          isSaving
                        }
                        startIcon={
                          isSaving ? (
                            <CircularProgress
                              size={16}
                              color='inherit'
                            />
                          ) : (
                            <i className='tabler-device-floppy' />
                          )
                        }
                      >
                        {isSaving
                          ? 'Menyimpan...'
                          : 'Simpan Perubahan'}
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          CROP DIALOG
      ====================================================== */}

      <ProfileImageCropDialog
        open={cropOpen}
        image={selectedImage}
        onClose={
          handleCropClose
        }
        onComplete={
          handleCropComplete
        }
      />
    </>
  )
}

export default Profile

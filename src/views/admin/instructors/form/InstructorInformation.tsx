'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Datepicker
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

/* ============================================================
   TYPES
============================================================ */

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

type Expertise = {
  id: number
  name: string
}

type FormValues = {
  // Personal
  fullName: string
  nik: string
  birthPlace: string
  birthDate: Date | null
  gender: string

  // Contact
  phone: string
  address: string

  // Region
  province: string
  regency: string
  district: string
  village: string
  postalCode: string

  // Professional
  education: string
  institution: string
  major: string
  graduationYear: string
  position: string
  experienceYears: string
  specialization: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

/* ============================================================
   EXPERTISE
============================================================ */

const expertiseOptions: Expertise[] = [
  { id: 1, name: 'Programming' },
  { id: 2, name: 'Web Development' },
  { id: 3, name: 'Laravel' },
  { id: 4, name: 'PHP' },
  { id: 5, name: 'JavaScript' },
  { id: 6, name: 'TypeScript' },
  { id: 7, name: 'Digital Marketing' },
  { id: 8, name: 'Kewirausahaan' },
  { id: 9, name: 'UMKM' },
  { id: 10, name: 'Keuangan' },
  { id: 11, name: 'Administrasi Perkantoran' },
  { id: 12, name: 'Microsoft Office' },
  { id: 13, name: 'K3' },
  { id: 14, name: 'Manajemen Bisnis' },
  { id: 15, name: 'Industri & Manufaktur' },
  { id: 16, name: 'Desain Grafis' }
]

/* ============================================================
   API
============================================================ */

const REGION_API = '/api/regions'

const fetchRegions = async (
  endpoint: string,
  signal?: AbortSignal
): Promise<Region[]> => {
  const response = await fetch(`${REGION_API}/${endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch region data: ${response.status}`)
  }

  const result = (await response.json()) as RegionResponse

  return result.data ?? []
}

/* ============================================================
   COMPONENT
============================================================ */

const InstructorInformation = ({ mode }: Props) => {
  /* ==========================================================
     FORM
  ========================================================== */

  const [values, setValues] = useState<FormValues>({
    fullName: '',
    nik: '',
    birthPlace: '',
    birthDate: null,
    gender: '',

    phone: '',
    address: '',

    province: '',
    regency: '',
    district: '',
    village: '',
    postalCode: '',

    education: '',
    institution: '',
    major: '',
    graduationYear: '',
    position: '',
    experienceYears: '',
    specialization: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const [selectedExpertise, setSelectedExpertise] = useState<Expertise[]>([])

  /* ==========================================================
     REGION STATE
  ========================================================== */

  const [provinces, setProvinces] = useState<Region[]>([])
  const [regencies, setRegencies] = useState<Region[]>([])
  const [districts, setDistricts] = useState<Region[]>([])
  const [villages, setVillages] = useState<Region[]>([])

  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingRegencies, setLoadingRegencies] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  /* ==========================================================
     ABORT CONTROLLERS
  ========================================================== */

  const provincesControllerRef = useRef<AbortController | null>(null)
  const regenciesControllerRef = useRef<AbortController | null>(null)
  const districtsControllerRef = useRef<AbortController | null>(null)
  const villagesControllerRef = useRef<AbortController | null>(null)

  /* ==========================================================
     FIELD UPDATE
  ========================================================== */

  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  /* ==========================================================
     ERROR HELPERS
  ========================================================== */

  const clearError = (field: keyof FormValues) => {
    if (!errors[field]) return

    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }))
  }

  const setFieldError = (
    field: keyof FormValues,
    message: string
  ) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }))
  }

  /* ==========================================================
     PHONE
  ========================================================== */

  const normalizePhone = (value: string) => {
    let phone = value.replace(/\D/g, '')

    if (phone.startsWith('62')) {
      phone = phone.slice(2)
    } else if (phone.startsWith('0')) {
      phone = phone.slice(1)
    }

    return phone.slice(0, 12)
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim()
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateName = (value: string) => {
    if (!value.trim()) {
      return 'Nama lengkap wajib diisi.'
    }

    if (value.trim().length < 3) {
      return 'Nama lengkap minimal 3 karakter.'
    }

    if (!/^[a-zA-ZÀ-ÿ\s.'-]+$/.test(value)) {
      return 'Nama hanya boleh berisi huruf dan karakter nama yang valid.'
    }

    return ''
  }

  const validateNik = (value: string) => {
    if (!value) return ''

    if (!/^\d{16}$/.test(value)) {
      return 'NIK harus terdiri dari 16 digit.'
    }

    return ''
  }

  const validatePhone = (value: string) => {
    if (!value) return ''

    const phone = normalizePhone(value)

    if (!/^8\d{9,11}$/.test(phone)) {
      return 'Nomor HP tidak valid. Contoh: 8513 6373 842.'
    }

    return ''
  }

  const validateBirthDate = (value: Date | null) => {
    if (!value) return ''

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (value > today) {
      return 'Tanggal lahir tidak boleh melebihi hari ini.'
    }

    return ''
  }

  const validateYear = (value: string) => {
    if (!value) return ''

    if (!/^\d{4}$/.test(value)) {
      return 'Tahun harus terdiri dari 4 digit.'
    }

    const year = Number(value)
    const currentYear = new Date().getFullYear()

    if (year < 1950 || year > currentYear) {
      return `Tahun harus berada antara 1950 dan ${currentYear}.`
    }

    return ''
  }

  const validateExperience = (value: string) => {
    if (!value) return ''

    const experience = Number(value)

    if (!Number.isInteger(experience) || experience < 0) {
      return 'Pengalaman harus berupa angka 0 atau lebih.'
    }

    if (experience > 60) {
      return 'Pengalaman tidak boleh lebih dari 60 tahun.'
    }

    return ''
  }

  const validateField = (
    field: keyof FormValues,
    value: FormValues[keyof FormValues]
  ) => {
    let error = ''

    switch (field) {
      case 'fullName':
        error = validateName(value as string)
        break

      case 'nik':
        error = validateNik(value as string)
        break

      case 'phone':
        error = validatePhone(value as string)
        break

      case 'birthDate':
        error = validateBirthDate(value as Date | null)
        break

      case 'graduationYear':
        error = validateYear(value as string)
        break

      case 'experienceYears':
        error = validateExperience(value as string)
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }))
  }

  /* ==========================================================
     LOAD PROVINCES
  ========================================================== */

  useEffect(() => {
    const controller = new AbortController()

    provincesControllerRef.current = controller

    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true)

        const data = await fetchRegions(
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
            'province',
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
        provincesControllerRef.current === controller
      ) {
        provincesControllerRef.current = null
      }
    }
  }, [])

  /* ==========================================================
     PROVINCE
  ========================================================== */

  const handleProvinceChange = async (
    provinceCode: string
  ) => {
    setValues(prev => ({
      ...prev,
      province: provinceCode,
      regency: '',
      district: '',
      village: '',
      postalCode: ''
    }))

    clearError('province')
    clearError('regency')
    clearError('district')
    clearError('village')
    clearError('postalCode')

    setRegencies([])
    setDistricts([])
    setVillages([])

    regenciesControllerRef.current?.abort()

    if (!provinceCode) {
      setLoadingRegencies(false)
      return
    }

    const controller = new AbortController()

    regenciesControllerRef.current = controller

    try {
      setLoadingRegencies(true)

      const data = await fetchRegions(
        `regencies/${encodeURIComponent(provinceCode)}`,
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
          'regency',
          'Gagal memuat kabupaten / kota.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingRegencies(false)
      }
    }
  }

  /* ==========================================================
     REGENCY
  ========================================================== */

  const handleRegencyChange = async (
    regencyCode: string
  ) => {
    setValues(prev => ({
      ...prev,
      regency: regencyCode,
      district: '',
      village: '',
      postalCode: ''
    }))

    clearError('regency')
    clearError('district')
    clearError('village')
    clearError('postalCode')

    setDistricts([])
    setVillages([])

    districtsControllerRef.current?.abort()

    if (!regencyCode) {
      setLoadingDistricts(false)
      return
    }

    const controller = new AbortController()

    districtsControllerRef.current = controller

    try {
      setLoadingDistricts(true)

      const data = await fetchRegions(
        `districts/${encodeURIComponent(regencyCode)}`,
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
          'district',
          'Gagal memuat kecamatan.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingDistricts(false)
      }
    }
  }

  /* ==========================================================
     DISTRICT
  ========================================================== */

  const handleDistrictChange = async (
    districtCode: string
  ) => {
    setValues(prev => ({
      ...prev,
      district: districtCode,
      village: '',
      postalCode: ''
    }))

    clearError('district')
    clearError('village')
    clearError('postalCode')

    setVillages([])

    villagesControllerRef.current?.abort()

    if (!districtCode) {
      setLoadingVillages(false)
      return
    }

    const controller = new AbortController()

    villagesControllerRef.current = controller

    try {
      setLoadingVillages(true)

      const data = await fetchRegions(
        `villages/${encodeURIComponent(districtCode)}`,
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
          'village',
          'Gagal memuat kelurahan / desa.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingVillages(false)
      }
    }
  }

  /* ==========================================================
     VILLAGE
  ========================================================== */

  const handleVillageChange = (
    villageCode: string
  ) => {
    updateField('village', villageCode)
    clearError('village')
  }

  /* ==========================================================
     SELECTED REGIONS
  ========================================================== */

  const selectedProvince = provinces.find(
    item => item.code === values.province
  )

  const selectedRegency = regencies.find(
    item => item.code === values.regency
  )

  const selectedDistrict = districts.find(
    item => item.code === values.district
  )

  const selectedVillage = villages.find(
    item => item.code === values.village
  )

  /* ==========================================================
     LABEL HELPERS
  ========================================================== */

  const RequiredMark = () => (
    <span
      className='text-error font-semibold ms-0.5'
      aria-hidden='true'
    >
      *
    </span>
  )

  const OptionalLabel = () => (
    <span className='text-textDisabled text-xs font-normal'>
      (optional)
    </span>
  )

  /* ==========================================================
     ERROR
  ========================================================== */

  const ErrorMessage = ({
                          message
                        }: {
    message?: string
  }) => {
    if (!message) return null

    return (
      <div className='flex items-center gap-1.5 text-error text-xs mt-1.5'>
        <i className='tabler-alert-circle text-sm' />
        <span>{message}</span>
      </div>
    )
  }

  /* ==========================================================
     SECTION HEADER
  ========================================================== */

  const SectionHeader = ({
                           icon,
                           title,
                           description
                         }: {
    icon: string
    title: string
    description: string
  }) => (
    <div className='flex items-start gap-3'>
      <div className='flex items-center justify-center bs-10 is-10 rounded-lg bg-primary/10 text-primary shrink-0'>
        <i className={`${icon} text-xl`} />
      </div>

      <div className='min-is-0'>
        <Typography
          variant='subtitle1'
          className='font-semibold'
        >
          {title}
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
        >
          {description}
        </Typography>
      </div>
    </div>
  )

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <Card>
      <CardHeader
        title='Data Pelatih'
        subheader={
          mode === 'edit'
            ? 'Perbarui identitas, kontak, dan profil profesional pelatih.'
            : 'Lengkapi identitas, kontak, dan profil profesional pelatih.'
        }
      />

      <CardContent>
        <Grid container spacing={6}>

          {/* ==================================================
              IDENTITAS
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <SectionHeader
              icon='tabler-user-circle'
              title='Identitas Pribadi'
              description='Informasi dasar mengenai identitas tenaga pelatih.'
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* NAMA — REQUIRED */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Nama Lengkap <RequiredMark />
                </>
              }
              placeholder='Ahmad Fauzan'
              value={values.fullName}
              onChange={event =>
                updateField(
                  'fullName',
                  event.target.value
                )
              }
              onBlur={() =>
                validateField(
                  'fullName',
                  values.fullName
                )
              }
              error={Boolean(errors.fullName)}
              helperText={
                errors.fullName ||
                'Gunakan nama sesuai identitas resmi.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-user' />
                    </InputAdornment>
                  )
                }
              }}
            />

            <ErrorMessage
              message={errors.fullName}
            />
          </Grid>

          {/* NIK */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  NIK <OptionalLabel />
                </>
              }
              placeholder='6372011508950001'
              value={values.nik}
              onChange={event =>
                updateField(
                  'nik',
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 16)
                )
              }
              onBlur={() =>
                validateField(
                  'nik',
                  values.nik
                )
              }
              error={Boolean(errors.nik)}
              helperText={
                errors.nik ||
                'NIK terdiri dari 16 digit.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-id' />
                    </InputAdornment>
                  )
                },
                htmlInput: {
                  inputMode: 'numeric',
                  maxLength: 16
                }
              }}
            />

            <ErrorMessage
              message={errors.nik}
            />
          </Grid>

          {/* TEMPAT LAHIR */}

          <Grid
            size={{
              xs: 12,
              sm: 4
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Tempat Lahir <OptionalLabel />
                </>
              }
              placeholder='Banjarbaru'
              value={values.birthPlace}
              onChange={event =>
                updateField(
                  'birthPlace',
                  event.target.value
                )
              }
              helperText='Kota atau kabupaten tempat lahir.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-map-pin' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* TANGGAL LAHIR */}

          <Grid
            size={{
              xs: 12,
              sm: 4
            }}
          >
            <AppReactDatepicker
              selected={values.birthDate}
              onChange={(date: Date | null) =>
                updateField(
                  'birthDate',
                  date
                )
              }
              maxDate={new Date()}
              placeholderText='DD/MM/YYYY'
              dateFormat='dd/MM/yyyy'
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              customInput={
                <CustomTextField
                  fullWidth
                  label={
                    <>
                      Tanggal Lahir <OptionalLabel />
                    </>
                  }
                  placeholder='DD/MM/YYYY'
                  error={Boolean(errors.birthDate)}
                  helperText={
                    errors.birthDate ||
                    'Tanggal lahir pelatih.'
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-calendar' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              }
            />

            <ErrorMessage
              message={errors.birthDate}
            />
          </Grid>

          {/* GENDER */}

          <Grid
            size={{
              xs: 12,
              sm: 4
            }}
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Jenis Kelamin <OptionalLabel />
                </>
              }
              value={values.gender}
              onChange={event =>
                updateField(
                  'gender',
                  event.target.value
                )
              }
              helperText='Pilih jenis kelamin pelatih.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-gender-bigender' />
                    </InputAdornment>
                  )
                }
              }}
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

          {/* ==================================================
              KONTAK
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <div className='mts-2'>
              <SectionHeader
                icon='tabler-map-2'
                title='Kontak & Domisili'
                description='Informasi komunikasi dan tempat tinggal pelatih.'
              />
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* PHONE */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Nomor HP <OptionalLabel />
                </>
              }
              placeholder='8513 6373 842'
              value={formatPhone(values.phone)}
              onChange={event =>
                updateField(
                  'phone',
                  normalizePhone(
                    event.target.value
                  )
                )
              }
              onBlur={() =>
                validateField(
                  'phone',
                  values.phone
                )
              }
              error={Boolean(errors.phone)}
              helperText={
                errors.phone ||
                'Masukkan nomor tanpa 0. Contoh: 8513 6373 842.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <span className='font-semibold text-textPrimary'>
                        +62
                      </span>

                      <span className='text-divider mx-1.5'>
                        |
                      </span>

                      <i className='tabler-device-mobile' />
                    </InputAdornment>
                  )
                }
              }}
            />

            <ErrorMessage
              message={errors.phone}
            />
          </Grid>

          {/* ADDRESS */}

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              multiline
              minRows={3}
              label={
                <>
                  Alamat Lengkap <OptionalLabel />
                </>
              }
              placeholder='Jl. A. Yani No. 45, Banjarbaru...'
              value={values.address}
              onChange={event =>
                updateField(
                  'address',
                  event.target.value
                )
              }
              helperText='Masukkan alamat lengkap jika tersedia.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position='start'
                      sx={{
                        alignSelf: 'flex-start',
                        mt: 1
                      }}
                    >
                      <i className='tabler-map-pin' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* PROVINCE */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Provinsi <OptionalLabel />
                </>
              }
              value={values.province}
              onChange={event =>
                handleProvinceChange(
                  event.target.value
                )
              }
              error={Boolean(errors.province)}
              disabled={loadingProvinces}
              helperText={
                errors.province ||
                'Pilih provinsi domisili.'
              }
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-map-2' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                {loadingProvinces ? (
                  <div className='flex items-center gap-2'>
                    <CircularProgress size={16} />
                    Memuat provinsi...
                  </div>
                ) : (
                  'Pilih provinsi'
                )}
              </MenuItem>

              {provinces.map(province => (
                <MenuItem
                  key={province.code}
                  value={province.code}
                >
                  {province.name}
                </MenuItem>
              ))}
            </CustomTextField>

            <ErrorMessage
              message={errors.province}
            />
          </Grid>

          {/* REGENCY */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Kabupaten / Kota <OptionalLabel />
                </>
              }
              value={values.regency}
              onChange={event =>
                handleRegencyChange(
                  event.target.value
                )
              }
              disabled={
                !values.province ||
                loadingRegencies
              }
              error={Boolean(errors.regency)}
              helperText={
                errors.regency ||
                (!values.province
                  ? 'Pilih provinsi terlebih dahulu.'
                  : 'Pilih kabupaten atau kota.')
              }
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-building-community' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                {!values.province
                  ? 'Pilih provinsi terlebih dahulu'
                  : loadingRegencies
                    ? (
                      <div className='flex items-center gap-2'>
                        <CircularProgress size={16} />
                        Memuat kabupaten/kota...
                      </div>
                    )
                    : 'Pilih kabupaten/kota'}
              </MenuItem>

              {regencies.map(regency => (
                <MenuItem
                  key={regency.code}
                  value={regency.code}
                >
                  {regency.name}
                </MenuItem>
              ))}
            </CustomTextField>

            <ErrorMessage
              message={errors.regency}
            />
          </Grid>

          {/* DISTRICT */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Kecamatan <OptionalLabel />
                </>
              }
              value={values.district}
              onChange={event =>
                handleDistrictChange(
                  event.target.value
                )
              }
              disabled={
                !values.regency ||
                loadingDistricts
              }
              error={Boolean(errors.district)}
              helperText={
                errors.district ||
                (!values.regency
                  ? 'Pilih kabupaten/kota terlebih dahulu.'
                  : 'Pilih kecamatan.')
              }
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-map-pin' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                {!values.regency
                  ? 'Pilih kabupaten/kota terlebih dahulu'
                  : loadingDistricts
                    ? (
                      <div className='flex items-center gap-2'>
                        <CircularProgress size={16} />
                        Memuat kecamatan...
                      </div>
                    )
                    : 'Pilih kecamatan'}
              </MenuItem>

              {districts.map(district => (
                <MenuItem
                  key={district.code}
                  value={district.code}
                >
                  {district.name}
                </MenuItem>
              ))}
            </CustomTextField>

            <ErrorMessage
              message={errors.district}
            />
          </Grid>

          {/* VILLAGE */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Kelurahan / Desa <OptionalLabel />
                </>
              }
              value={values.village}
              onChange={event =>
                handleVillageChange(
                  event.target.value
                )
              }
              disabled={
                !values.district ||
                loadingVillages
              }
              error={Boolean(errors.village)}
              helperText={
                errors.village ||
                (!values.district
                  ? 'Pilih kecamatan terlebih dahulu.'
                  : 'Pilih kelurahan atau desa.')
              }
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-home-2' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                {!values.district
                  ? 'Pilih kecamatan terlebih dahulu'
                  : loadingVillages
                    ? (
                      <div className='flex items-center gap-2'>
                        <CircularProgress size={16} />
                        Memuat kelurahan/desa...
                      </div>
                    )
                    : 'Pilih kelurahan/desa'}
              </MenuItem>

              {villages.map(village => (
                <MenuItem
                  key={village.code}
                  value={village.code}
                >
                  {village.name}
                </MenuItem>
              ))}
            </CustomTextField>

            <ErrorMessage
              message={errors.village}
            />
          </Grid>

          {/* POSTAL */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Kode Pos <OptionalLabel />
                </>
              }
              placeholder='70711'
              value={values.postalCode}
              onChange={event =>
                updateField(
                  'postalCode',
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 5)
                )
              }
              helperText='Kode pos sesuai alamat domisili.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-mailbox' />
                    </InputAdornment>
                  )
                },
                htmlInput: {
                  inputMode: 'numeric',
                  maxLength: 5
                }
              }}
            />
          </Grid>

          {/* REGION SUMMARY */}

          {(selectedProvince ||
            selectedRegency ||
            selectedDistrict ||
            selectedVillage) && (
            <Grid size={{ xs: 12 }}>
              <div className='flex items-center gap-3 p-3 rounded-lg border border-primary/15 bg-primary/[0.04]'>
                <div className='flex items-center justify-center bs-10 is-10 rounded-lg bg-primary/10 text-primary shrink-0'>
                  <i className='tabler-map-2 text-lg' />
                </div>

                <div className='min-is-0 flex-1'>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Wilayah yang dipilih
                  </Typography>

                  <Typography
                    variant='body2'
                    className='font-medium'
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

                <i className='tabler-circle-check text-success text-xl' />
              </div>
            </Grid>
          )}

          {/* ==================================================
              PROFESIONAL
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <div className='mts-2'>
              <SectionHeader
                icon='tabler-briefcase'
                title='Profil Profesional'
                description='Informasi pendidikan, pengalaman, dan kompetensi profesional pelatih.'
              />
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* EDUCATION */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Pendidikan Terakhir <OptionalLabel />
                </>
              }
              value={values.education}
              onChange={event =>
                updateField(
                  'education',
                  event.target.value
                )
              }
              helperText='Pendidikan formal terakhir.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-school' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                Pilih pendidikan
              </MenuItem>

              <MenuItem value='sma'>
                SMA / Sederajat
              </MenuItem>

              <MenuItem value='d3'>
                Diploma (D3)
              </MenuItem>

              <MenuItem value='d4'>
                Diploma (D4)
              </MenuItem>

              <MenuItem value='s1'>
                Sarjana (S1)
              </MenuItem>

              <MenuItem value='s2'>
                Magister (S2)
              </MenuItem>

              <MenuItem value='s3'>
                Doktor (S3)
              </MenuItem>
            </CustomTextField>
          </Grid>

          {/* INSTITUTION */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Institusi Pendidikan <OptionalLabel />
                </>
              }
              placeholder='Universitas Lambung Mangkurat'
              value={values.institution}
              onChange={event =>
                updateField(
                  'institution',
                  event.target.value
                )
              }
              helperText='Nama sekolah, kampus, atau lembaga pendidikan.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-building-bank' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* MAJOR */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Program Studi / Jurusan <OptionalLabel />
                </>
              }
              placeholder='Teknik Informatika'
              value={values.major}
              onChange={event =>
                updateField(
                  'major',
                  event.target.value
                )
              }
              helperText='Program studi atau bidang pendidikan.'
            />
          </Grid>

          {/* GRADUATION YEAR */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Tahun Lulus <OptionalLabel />
                </>
              }
              placeholder='2020'
              value={values.graduationYear}
              onChange={event =>
                updateField(
                  'graduationYear',
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 4)
                )
              }
              onBlur={() =>
                validateField(
                  'graduationYear',
                  values.graduationYear
                )
              }
              error={Boolean(
                errors.graduationYear
              )}
              helperText={
                errors.graduationYear ||
                'Contoh: 2020.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-calendar' />
                    </InputAdornment>
                  )
                },
                htmlInput: {
                  inputMode: 'numeric',
                  maxLength: 4
                }
              }}
            />

            <ErrorMessage
              message={errors.graduationYear}
            />
          </Grid>

          {/* POSITION */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              label={
                <>
                  Jabatan / Profesi <OptionalLabel />
                </>
              }
              placeholder='Senior Web Developer'
              value={values.position}
              onChange={event =>
                updateField(
                  'position',
                  event.target.value
                )
              }
              helperText='Jabatan atau profesi utama saat ini.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-id-badge-2' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* EXPERIENCE */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <CustomTextField
              fullWidth
              type='number'
              label={
                <>
                  Pengalaman Profesional <OptionalLabel />
                </>
              }
              placeholder='5'
              value={values.experienceYears}
              onChange={event =>
                updateField(
                  'experienceYears',
                  event.target.value
                )
              }
              onBlur={() =>
                validateField(
                  'experienceYears',
                  values.experienceYears
                )
              }
              error={Boolean(
                errors.experienceYears
              )}
              helperText={
                errors.experienceYears ||
                'Lama pengalaman profesional.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-clock-hour-4' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      tahun
                    </InputAdornment>
                  )
                },
                htmlInput: {
                  min: 0,
                  max: 60,
                  inputMode: 'numeric'
                }
              }}
            />

            <ErrorMessage
              message={errors.experienceYears}
            />
          </Grid>

          {/* SPECIALIZATION */}

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              multiline
              minRows={3}
              label={
                <>
                  Spesialisasi <OptionalLabel />
                </>
              }
              placeholder='Jelaskan bidang spesialisasi atau kompetensi utama pelatih...'
              value={values.specialization}
              onChange={event =>
                updateField(
                  'specialization',
                  event.target.value
                )
              }
              helperText='Jelaskan fokus kompetensi profesional pelatih.'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position='start'
                      sx={{
                        alignSelf: 'flex-start',
                        mt: 1
                      }}
                    >
                      <i className='tabler-sparkles' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* ==================================================
              KEAHLIAN
          ================================================== */}



          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              options={expertiseOptions}
              value={selectedExpertise}
              onChange={(_, value) =>
                setSelectedExpertise(value)
              }
              getOptionLabel={option =>
                option.name
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                option.id === value.id
              }
              filterSelectedOptions
              renderTags={(
                value,
                getTagProps
              ) =>
                value.map(
                  (option, index) => (
                    <Chip
                      {...getTagProps({
                        index
                      })}
                      key={option.id}
                      label={option.name}
                      size='small'
                      color='primary'
                      variant='tonal'
                    />
                  )
                )
              }
              renderOption={(
                props,
                option
              ) => (
                <li
                  {...props}
                  key={option.id}
                >
                  <div className='flex items-center gap-2.5'>
                    <div className='flex items-center justify-center bs-8 is-8 rounded-lg bg-primary/10 text-primary'>
                      <i className='tabler-sparkles' />
                    </div>

                    <Typography variant='body2'>
                      {option.name}
                    </Typography>
                  </div>
                </li>
              )}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={
                    <>
                      Keahlian <OptionalLabel />
                    </>
                  }
                  placeholder={
                    selectedExpertise.length
                      ? ''
                      : 'Cari dan pilih keahlian'
                  }
                  helperText='Keahlian digunakan untuk klasifikasi kompetensi dan pencarian pelatih.'
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position='start'>
                            <i className='tabler-search' />
                          </InputAdornment>

                          {params.InputProps.startAdornment}
                        </>
                      )
                    }
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default InstructorInformation

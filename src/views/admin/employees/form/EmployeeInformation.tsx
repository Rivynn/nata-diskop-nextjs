'use client'

import { useEffect, useRef, useState } from 'react'

// React Dropzone
import { useDropzone } from 'react-dropzone'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Datepicker
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type Props = {
  mode: 'create' | 'edit'
  employeeId?: string
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

  // Education
  education: string
  institution: string
  major: string
  graduationYear: string

  // Assignment
  employeeType: string
  position: string

  // Optional personnel identifier
  nip: string

  // Assignment period
  startDate: Date | null
  endDate: Date | null
  autoDeactivate: boolean

  // Internship / Contract specific
  originInstitution: string
  originType: string
  supervisorName: string
  supervisorPhone: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type AttachmentKey =
  | 'ktp'
  | 'appointment'
  | 'contract'
  | 'assignment'
  | 'internship_letter'
  | 'acceptance_letter'
  | 'education'

type AttachmentFile = {
  key: AttachmentKey | 'additional'
  name: string
  size: number
  type: string
  file: File
}

type AttachmentConfig = {
  key: AttachmentKey
  title: string
  description: string
  required?: boolean
}

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
   CONSTANTS
============================================================ */

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
}

/* ============================================================
   COMPONENT
============================================================ */

const EmployeeInformation = ({ mode }: Props) => {
  /* ==========================================================
     FORM
  ========================================================== */

  const [values, setValues] = useState<FormValues>({
    // Personal
    fullName: '',
    nik: '',
    birthPlace: '',
    birthDate: null,
    gender: '',

    // Contact
    phone: '',
    address: '',

    // Region
    province: '',
    regency: '',
    district: '',
    village: '',
    postalCode: '',

    // Education
    education: '',
    institution: '',
    major: '',
    graduationYear: '',

    // Assignment
    employeeType: 'internal',
    position: '',
    nip: '',

    // Assignment period
    startDate: null,
    endDate: null,
    autoDeactivate: true,

    // Internship / contract
    originInstitution: '',
    originType: '',
    supervisorName: '',
    supervisorPhone: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

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
     ATTACHMENTS
  ========================================================== */

  const [attachments, setAttachments] = useState<
    Partial<Record<AttachmentKey, AttachmentFile>>
  >({})

  const [additionalFiles, setAdditionalFiles] = useState<AttachmentFile[]>([])

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

  const validateNip = (value: string) => {
    if (!value) return ''

    if (!/^\d{18}$/.test(value)) {
      return 'NIP harus terdiri dari 18 digit.'
    }

    return ''
  }

  const validateStartDate = (value: Date | null) => {
    if (!value) {
      return 'Tanggal mulai wajib diisi.'
    }

    return ''
  }

  const validateEndDate = (value: Date | null) => {
    if (!value) {
      return 'Tanggal berakhir wajib diisi.'
    }

    if (values.startDate && value < values.startDate) {
      return 'Tanggal berakhir tidak boleh sebelum tanggal mulai.'
    }

    return ''
  }

  const validatePosition = (value: string) => {
    if (!value) return ''

    if (value.trim().length < 2) {
      return 'Posisi atau jabatan minimal 2 karakter.'
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

      case 'nip':
        error = validateNip(value as string)
        break

      case 'position':
        error = validatePosition(value as string)
        break

      case 'startDate':
        error = validateStartDate(value as Date | null)
        break

      case 'endDate':
        if (
          values.employeeType === 'contract' ||
          values.employeeType === 'internship'
        ) {
          error = validateEndDate(value as Date | null)
        }

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
     EMPLOYEE TYPE
  ========================================================== */

  const isTemporaryEmployee =
    values.employeeType === 'contract' ||
    values.employeeType === 'internship'

  const isInternship =
    values.employeeType === 'internship'

  const isContract =
    values.employeeType === 'contract'

  /* ==========================================================
     ATTACHMENT HELPERS
  ========================================================== */

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`
    }

    if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return 'tabler-file-type-pdf'
    }

    return 'tabler-photo'
  }

  const handleAttachment = (
    key: AttachmentKey,
    file: File
  ) => {
    if (file.size > MAX_FILE_SIZE) {
      return
    }

    if (
      ![
        'application/pdf',
        'image/jpeg',
        'image/png'
      ].includes(file.type)
    ) {
      return
    }

    setAttachments(prev => ({
      ...prev,
      [key]: {
        key,
        name: file.name,
        size: file.size,
        type: file.type,
        file
      }
    }))
  }

  const removeAttachment = (
    key: AttachmentKey
  ) => {
    setAttachments(prev => {
      const next = { ...prev }

      delete next[key]

      return next
    })
  }

  const handleAdditionalFiles = (
    files: File[]
  ) => {
    const validFiles = files
      .filter(file => file.size <= MAX_FILE_SIZE)
      .filter(file =>
        [
          'application/pdf',
          'image/jpeg',
          'image/png'
        ].includes(file.type)
      )
      .map(file => ({
        key: 'additional' as const,
        name: file.name,
        size: file.size,
        type: file.type,
        file
      }))

    setAdditionalFiles(prev => [
      ...prev,
      ...validFiles
    ])
  }

  const removeAdditionalFile = (
    index: number
  ) => {
    setAdditionalFiles(prev =>
      prev.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    )
  }

  /* ==========================================================
     ATTACHMENT CONFIG
  ========================================================== */

  const getAttachmentConfig =
    (): AttachmentConfig[] => {
      if (isInternship) {
        return [
          {
            key: 'internship_letter',
            title: 'Surat Pengantar Magang',
            description:
              'Surat pengantar dari sekolah atau perguruan tinggi.',
            required: true
          },
          {
            key: 'acceptance_letter',
            title: 'Surat Penerimaan Magang',
            description:
              'Surat penerimaan atau persetujuan magang.',
            required: true
          },
          {
            key: 'education',
            title: 'Dokumen Pendidikan',
            description:
              'Ijazah, kartu pelajar, atau dokumen pendidikan pendukung.'
          }
        ]
      }

      if (isContract) {
        return [
          {
            key: 'contract',
            title: 'Dokumen Kontrak',
            description:
              'Dokumen perjanjian kerja atau kontrak penugasan.',
            required: true
          },
          {
            key: 'assignment',
            title: 'Surat Penugasan',
            description:
              'Surat yang menjadi dasar penugasan pegawai.'
          },
          {
            key: 'ktp',
            title: 'Kartu Tanda Penduduk',
            description:
              'Dokumen identitas pegawai.'
          },
          {
            key: 'education',
            title: 'Dokumen Pendidikan',
            description:
              'Ijazah atau dokumen pendidikan pendukung.'
          }
        ]
      }

      return [
        {
          key: 'ktp',
          title: 'Kartu Tanda Penduduk',
          description:
            'Dokumen identitas pegawai.'
        },
        {
          key: 'appointment',
          title: 'Dokumen Pengangkatan',
          description:
            'SK pengangkatan atau dokumen kepegawaian terkait.'
        },
        {
          key: 'education',
          title: 'Dokumen Pendidikan',
          description:
            'Ijazah atau dokumen pendidikan terakhir.'
        }
      ]
    }

  /* ==========================================================
     ATTACHMENT DROPZONE
  ========================================================== */

  const AttachmentDropzone = ({
                                item
                              }: {
    item: AttachmentConfig
  }) => {
    const {
      getRootProps,
      getInputProps,
      isDragActive
    } = useDropzone({
      multiple: false,
      maxSize: MAX_FILE_SIZE,
      accept: ACCEPTED_FILE_TYPES,
      onDrop: acceptedFiles => {
        if (acceptedFiles[0]) {
          handleAttachment(
            item.key,
            acceptedFiles[0]
          )
        }
      }
    })

    const uploadedFile =
      attachments[item.key]

    if (uploadedFile) {
      return (
        <div className='flex items-center justify-between gap-4 p-4 rounded-lg border border-success/20 bg-success/[0.04]'>
          <div className='flex items-center gap-3 min-is-0'>
            <CustomAvatar
              skin='light'
              color='success'
              variant='rounded'
              size={42}
            >
              <i
                className={`${getFileIcon(
                  uploadedFile.type
                )} text-[22px]`}
              />
            </CustomAvatar>

            <div className='min-is-0'>
              <Typography
                variant='body2'
                className='font-medium truncate'
              >
                {uploadedFile.name}
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                {formatFileSize(
                  uploadedFile.size
                )}
              </Typography>
            </div>
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            <Chip
              size='small'
              color='success'
              variant='tonal'
              label='Terpasang'
              icon={
                <i className='tabler-check text-[15px]' />
              }
            />

            <Tooltip title='Ganti dokumen'>
              <IconButton
                size='small'
                onClick={() => {
                  const input =
                    document.createElement(
                      'input'
                    )

                  input.type = 'file'
                  input.accept =
                    '.pdf,.jpg,.jpeg,.png'

                  input.onchange = event => {
                    const target =
                      event.target as HTMLInputElement

                    const file =
                      target.files?.[0]

                    if (file) {
                      handleAttachment(
                        item.key,
                        file
                      )
                    }
                  }

                  input.click()
                }}
              >
                <i className='tabler-refresh text-[18px]' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Hapus'>
              <IconButton
                size='small'
                color='error'
                onClick={() =>
                  removeAttachment(
                    item.key
                  )
                }
              >
                <i className='tabler-trash text-[18px]' />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )
    }

    return (
      <div
        {...getRootProps()}
        className={[
          'flex items-center gap-4 p-4 rounded-lg border border-dashed cursor-pointer transition-all',
          'hover:border-primary/40 hover:bg-primary/[0.025]',
          isDragActive
            ? 'border-primary bg-primary/[0.05]'
            : 'border-divider'
        ].join(' ')}
      >
        <input {...getInputProps()} />

        <CustomAvatar
          skin='light'
          color='primary'
          variant='rounded'
          size={42}
        >
          <i className='tabler-upload text-[21px]' />
        </CustomAvatar>

        <div className='min-is-0 flex-1'>
          <Typography
            variant='body2'
            className='font-medium'
          >
            {item.title}{' '}
            {item.required && (
              <RequiredMark />
            )}
          </Typography>

          <Typography
            variant='caption'
            color='text.secondary'
            className='block'
          >
            {item.description}
          </Typography>

          <Typography
            variant='caption'
            color='text.disabled'
          >
            PDF, JPG, JPEG, PNG · Maks. 5 MB
          </Typography>
        </div>

        <Button
          variant='tonal'
          size='small'
          startIcon={
            <i className='tabler-upload' />
          }
        >
          Upload
        </Button>
      </div>
    )
  }

  /* ==========================================================
     ADDITIONAL DOCUMENT DROPZONE
  ========================================================== */

  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
    isDragActive: isAdditionalDragActive
  } = useDropzone({
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_FILE_TYPES,
    onDrop: handleAdditionalFiles
  })

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <Card>
      <CardHeader
        title='Informasi Pegawai'
        subheader={
          mode === 'edit'
            ? 'Perbarui identitas, profil, penugasan, dan informasi pendukung pegawai.'
            : 'Lengkapi identitas, profil, penugasan, dan informasi pendukung pegawai.'
        }
      />

      <CardContent>
        <Grid container spacing={6}>

          {/* ==================================================
              IDENTITAS PRIBADI
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <SectionHeader
              icon='tabler-user-circle'
              title='Identitas Pribadi'
              description='Informasi dasar mengenai identitas pegawai.'
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* FULL NAME */}

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
              error={Boolean(
                errors.fullName
              )}
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
                'Opsional. Digunakan untuk kebutuhan identifikasi.'
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

          {/* BIRTH PLACE */}

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
                  Tempat Lahir{' '}
                  <OptionalLabel />
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

          {/* BIRTH DATE */}

          <Grid
            size={{
              xs: 12,
              sm: 4
            }}
          >
            <AppReactDatepicker
              selected={values.birthDate}
              onChange={(
                date: Date | null
              ) => {
                updateField(
                  'birthDate',
                  date
                )

                validateField(
                  'birthDate',
                  date
                )
              }}
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
                      Tanggal Lahir{' '}
                      <OptionalLabel />
                    </>
                  }
                  placeholder='DD/MM/YYYY'
                  error={Boolean(
                    errors.birthDate
                  )}
                  helperText={
                    errors.birthDate ||
                    'Tanggal lahir pegawai.'
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
                  Jenis Kelamin{' '}
                  <OptionalLabel />
                </>
              }
              value={values.gender}
              onChange={event =>
                updateField(
                  'gender',
                  event.target.value
                )
              }
              helperText='Pilih jenis kelamin pegawai.'
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
              KONTAK & DOMISILI
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <div className='mts-2'>
              <SectionHeader
                icon='tabler-map-2'
                title='Kontak & Domisili'
                description='Informasi komunikasi dan tempat tinggal pegawai.'
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
              value={formatPhone(
                values.phone
              )}
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
              error={Boolean(
                errors.phone
              )}
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
                  Alamat Lengkap{' '}
                  <OptionalLabel />
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
                        alignSelf:
                          'flex-start',
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
                  Provinsi{' '}
                  <OptionalLabel />
                </>
              }
              value={values.province}
              onChange={event =>
                handleProvinceChange(
                  event.target.value
                )
              }
              disabled={
                loadingProvinces
              }
              error={Boolean(
                errors.province
              )}
              helperText={
                errors.province ||
                'Pilih provinsi domisili.'
              }
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                {loadingProvinces ? (
                  <div className='flex items-center gap-2'>
                    <CircularProgress
                      size={16}
                    />
                    Memuat provinsi...
                  </div>
                ) : (
                  'Pilih provinsi'
                )}
              </MenuItem>

              {provinces.map(
                province => (
                  <MenuItem
                    key={province.code}
                    value={
                      province.code
                    }
                  >
                    {province.name}
                  </MenuItem>
                )
              )}
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
                  Kabupaten / Kota{' '}
                  <OptionalLabel />
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
              error={Boolean(
                errors.regency
              )}
              helperText={
                errors.regency ||
                (!values.province
                  ? 'Pilih provinsi terlebih dahulu.'
                  : 'Pilih kabupaten atau kota.')
              }
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                {!values.province
                  ? 'Pilih provinsi terlebih dahulu'
                  : loadingRegencies
                    ? (
                      <div className='flex items-center gap-2'>
                        <CircularProgress
                          size={16}
                        />
                        Memuat kabupaten/kota...
                      </div>
                    )
                    : 'Pilih kabupaten/kota'}
              </MenuItem>

              {regencies.map(
                regency => (
                  <MenuItem
                    key={regency.code}
                    value={
                      regency.code
                    }
                  >
                    {regency.name}
                  </MenuItem>
                )
              )}
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
                  Kecamatan{' '}
                  <OptionalLabel />
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
              error={Boolean(
                errors.district
              )}
              helperText={
                errors.district ||
                (!values.regency
                  ? 'Pilih kabupaten/kota terlebih dahulu.'
                  : 'Pilih kecamatan.')
              }
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                {!values.regency
                  ? 'Pilih kabupaten/kota terlebih dahulu'
                  : loadingDistricts
                    ? (
                      <div className='flex items-center gap-2'>
                        <CircularProgress
                          size={16}
                        />
                        Memuat kecamatan...
                      </div>
                    )
                    : 'Pilih kecamatan'}
              </MenuItem>

              {districts.map(
                district => (
                  <MenuItem
                    key={district.code}
                    value={
                      district.code
                    }
                  >
                    {district.name}
                  </MenuItem>
                )
              )}
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
                  Kelurahan / Desa{' '}
                  <OptionalLabel />
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
              error={Boolean(
                errors.village
              )}
              helperText={
                errors.village ||
                (!values.district
                  ? 'Pilih kecamatan terlebih dahulu.'
                  : 'Pilih kelurahan atau desa.')
              }
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                {!values.district
                  ? 'Pilih kecamatan terlebih dahulu'
                  : loadingVillages
                    ? (
                      <div className='flex items-center gap-2'>
                        <CircularProgress
                          size={16}
                        />
                        Memuat kelurahan/desa...
                      </div>
                    )
                    : 'Pilih kelurahan/desa'}
              </MenuItem>

              {villages.map(
                village => (
                  <MenuItem
                    key={village.code}
                    value={
                      village.code
                    }
                  >
                    {village.name}
                  </MenuItem>
                )
              )}
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
                  Kode Pos{' '}
                  <OptionalLabel />
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
                htmlInput: {
                  inputMode:
                    'numeric',
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
              PENDIDIKAN
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <div className='mts-2'>
              <SectionHeader
                icon='tabler-school'
                title='Profil Pendidikan'
                description='Informasi pendidikan dan latar belakang akademik pegawai.'
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
                  Pendidikan Terakhir{' '}
                  <OptionalLabel />
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
            >
              <MenuItem value=''>
                Pilih pendidikan
              </MenuItem>

              <MenuItem value='sma'>
                SMA / Sederajat
              </MenuItem>

              <MenuItem value='d1'>
                Diploma (D1)
              </MenuItem>

              <MenuItem value='d2'>
                Diploma (D2)
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
                  Institusi Pendidikan{' '}
                  <OptionalLabel />
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
              helperText='Sekolah, kampus, atau lembaga pendidikan terakhir.'
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
                  Program Studi / Jurusan{' '}
                  <OptionalLabel />
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
            />
          </Grid>

          {/* GRADUATION */}

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
                  Tahun Lulus{' '}
                  <OptionalLabel />
                </>
              }
              placeholder='2024'
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
                'Contoh: 2024.'
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
                  inputMode:
                    'numeric',
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

          {/* ==================================================
              PENUGASAN
          ================================================== */}

          <Grid size={{ xs: 12 }}>
            <div className='mts-2'>
              <SectionHeader
                icon='tabler-briefcase'
                title='Penugasan'
                description='Informasi mengenai posisi dan periode penugasan pegawai.'
              />
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* EMPLOYEE TYPE */}

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
              label={
                <>
                  Tipe Pegawai{' '}
                  <RequiredMark />
                </>
              }
              value={values.employeeType}
              onChange={event => {
                const type =
                  event.target.value

                updateField(
                  'employeeType',
                  type
                )

                if (
                  type === 'internal'
                ) {
                  updateField(
                    'endDate',
                    null
                  )

                  updateField(
                    'autoDeactivate',
                    false
                  )

                  updateField(
                    'originInstitution',
                    ''
                  )

                  updateField(
                    'originType',
                    ''
                  )

                  updateField(
                    'supervisorName',
                    ''
                  )

                  updateField(
                    'supervisorPhone',
                    ''
                  )
                } else {
                  updateField(
                    'autoDeactivate',
                    true
                  )
                }
              }}
              helperText='Tentukan jenis hubungan penugasan pegawai.'
            >
              <MenuItem value='internal'>
                Pegawai Internal
              </MenuItem>

              <MenuItem value='contract'>
                Pegawai Kontrak
              </MenuItem>

              <MenuItem value='internship'>
                Magang
              </MenuItem>
            </CustomTextField>
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
                  Posisi / Peran{' '}
                  <OptionalLabel />
                </>
              }
              placeholder={
                isInternship
                  ? 'Contoh: IT Support Intern'
                  : 'Contoh: Pengelola Program'
              }
              value={values.position}
              onChange={event =>
                updateField(
                  'position',
                  event.target.value
                )
              }
              onBlur={() =>
                validateField(
                  'position',
                  values.position
                )
              }
              error={Boolean(
                errors.position
              )}
              helperText={
                errors.position ||
                'Posisi atau peran selama menjalankan penugasan.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-briefcase-2' />
                    </InputAdornment>
                  )
                }
              }}
            />

            <ErrorMessage
              message={errors.position}
            />
          </Grid>

          {/* NIP ONLY NON INTERNSHIP */}

          {!isInternship && (
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
                    NIP{' '}
                    <OptionalLabel />
                  </>
                }
                placeholder='198905152014011001'
                value={values.nip}
                onChange={event =>
                  updateField(
                    'nip',
                    event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 18)
                  )
                }
                onBlur={() =>
                  validateField(
                    'nip',
                    values.nip
                  )
                }
                error={Boolean(
                  errors.nip
                )}
                helperText={
                  errors.nip ||
                  'Opsional. Isi jika pegawai memiliki NIP.'
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-id-badge' />
                      </InputAdornment>
                    )
                  },
                  htmlInput: {
                    inputMode:
                      'numeric',
                    maxLength: 18
                  }
                }}
              />

              <ErrorMessage
                message={errors.nip}
              />
            </Grid>
          )}

          {/* START DATE */}

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >
            <AppReactDatepicker
              selected={
                values.startDate
              }
              onChange={(
                date: Date | null
              ) => {
                updateField(
                  'startDate',
                  date
                )

                validateField(
                  'startDate',
                  date
                )
              }}
              placeholderText='DD/MM/YYYY'
              dateFormat='dd/MM/yyyy'
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              customInput={
                <CustomTextField
                  fullWidth
                  required
                  label={
                    <>
                      Tanggal Mulai{' '}
                      <RequiredMark />
                    </>
                  }
                  placeholder='DD/MM/YYYY'
                  error={Boolean(
                    errors.startDate
                  )}
                  helperText={
                    errors.startDate ||
                    'Tanggal mulai penugasan.'
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-calendar-plus' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              }
            />

            <ErrorMessage
              message={
                errors.startDate
              }
            />
          </Grid>

          {/* END DATE */}

          {isTemporaryEmployee && (
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}
            >
              <AppReactDatepicker
                selected={
                  values.endDate
                }
                onChange={(
                  date: Date | null
                ) => {
                  updateField(
                    'endDate',
                    date
                  )

                  validateField(
                    'endDate',
                    date
                  )
                }}
                minDate={
                  values.startDate ||
                  undefined
                }
                placeholderText='DD/MM/YYYY'
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                customInput={
                  <CustomTextField
                    fullWidth
                    required
                    label={
                      <>
                        Tanggal Berakhir{' '}
                        <RequiredMark />
                      </>
                    }
                    placeholder='DD/MM/YYYY'
                    error={Boolean(
                      errors.endDate
                    )}
                    helperText={
                      errors.endDate ||
                      'Tanggal berakhir penugasan.'
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <i className='tabler-calendar-minus' />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                }
              />

              <ErrorMessage
                message={errors.endDate}
              />
            </Grid>
          )}

          {/* AUTO DEACTIVATE */}

          {isTemporaryEmployee && (
            <Grid size={{ xs: 12 }}>
              <div className='flex items-center gap-3 p-3 rounded-lg border border-warning/20 bg-warning/[0.04]'>
                <div className='flex items-center justify-center bs-10 is-10 rounded-lg bg-warning/10 text-warning shrink-0'>
                  <i className='tabler-calendar-off text-xl' />
                </div>

                <div className='min-is-0 flex-1'>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    Nonaktifkan akun otomatis
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Akun akan otomatis dinonaktifkan ketika masa penugasan berakhir.
                  </Typography>
                </div>

                <FormControlLabel
                  sx={{
                    margin: 0
                  }}
                  control={
                    <Switch
                      checked={
                        values.autoDeactivate
                      }
                      onChange={event =>
                        updateField(
                          'autoDeactivate',
                          event.target.checked
                        )
                      }
                    />
                  }
                  label=''
                />
              </div>
            </Grid>
          )}

          {/* ==================================================
              EXTERNAL / INTERNSHIP INFORMATION
          ================================================== */}

          {isTemporaryEmployee && (
            <>
              <Grid size={{ xs: 12 }}>
                <div className='mts-2'>
                  <SectionHeader
                    icon='tabler-building-community'
                    title={
                      isInternship
                        ? 'Informasi Magang'
                        : 'Informasi Penugasan'
                    }
                    description={
                      isInternship
                        ? 'Informasi asal institusi dan pembimbing selama masa magang.'
                        : 'Informasi pihak atau institusi yang berkaitan dengan penugasan.'
                    }
                  />
                </div>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* ORIGIN TYPE */}

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
                      Asal{' '}
                      <OptionalLabel />
                    </>
                  }
                  value={
                    values.originType
                  }
                  onChange={event =>
                    updateField(
                      'originType',
                      event.target.value
                    )
                  }
                  helperText={
                    isInternship
                      ? 'Jenis institusi asal peserta magang.'
                      : 'Jenis institusi atau pihak asal.'
                  }
                >
                  <MenuItem value=''>
                    Pilih asal
                  </MenuItem>

                  <MenuItem value='university'>
                    Perguruan Tinggi
                  </MenuItem>

                  <MenuItem value='school'>
                    SMK / Sekolah
                  </MenuItem>

                  <MenuItem value='institution'>
                    Lembaga
                  </MenuItem>

                  <MenuItem value='company'>
                    Perusahaan
                  </MenuItem>

                  <MenuItem value='other'>
                    Lainnya
                  </MenuItem>
                </CustomTextField>
              </Grid>

              {/* ORIGIN INSTITUTION */}

              <Grid
                size={{
                  xs: 12,
                  sm: 8
                }}
              >
                <CustomTextField
                  fullWidth
                  label={
                    <>
                      Institusi Asal{' '}
                      <OptionalLabel />
                    </>
                  }
                  placeholder={
                    isInternship
                      ? 'Universitas Lambung Mangkurat'
                      : 'Nama institusi / perusahaan'
                  }
                  value={
                    values.originInstitution
                  }
                  onChange={event =>
                    updateField(
                      'originInstitution',
                      event.target.value
                    )
                  }
                  helperText={
                    isInternship
                      ? 'Nama kampus, sekolah, atau institusi asal.'
                      : 'Nama institusi atau pihak asal pegawai.'
                  }
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

              {/* SUPERVISOR */}

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
                      Nama Pembimbing{' '}
                      <OptionalLabel />
                    </>
                  }
                  placeholder='Budi Santoso'
                  value={
                    values.supervisorName
                  }
                  onChange={event =>
                    updateField(
                      'supervisorName',
                      event.target.value
                    )
                  }
                  helperText={
                    isInternship
                      ? 'Pembimbing dari kampus atau sekolah.'
                      : 'Pembimbing atau PIC penugasan.'
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-user-star' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* SUPERVISOR PHONE */}

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
                      Kontak Pembimbing{' '}
                      <OptionalLabel />
                    </>
                  }
                  placeholder='8513 6373 3842'
                  value={formatPhone(
                    values.supervisorPhone
                  )}
                  onChange={event =>
                    updateField(
                      'supervisorPhone',
                      normalizePhone(
                        event.target.value
                      )
                    )
                  }
                  helperText='Nomor yang dapat dihubungi untuk kebutuhan koordinasi.'
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
              </Grid>

              {/* INTERNSHIP INFO */}

              {isInternship && (
                <Grid size={{ xs: 12 }}>
                  <Alert
                    severity='info'
                    icon={
                      <i className='tabler-school' />
                    }
                  >
                    <Typography
                      variant='body2'
                      className='font-medium mbe-1'
                    >
                      Pegawai magang
                    </Typography>

                    <Typography variant='body2'>
                      Data magang dapat digunakan
                      untuk mencatat asal sekolah
                      atau perguruan tinggi,
                      pembimbing, dan periode
                      penugasan. Pegawai magang
                      tetap menggunakan role{' '}
                      <strong>Pegawai</strong> dengan
                      akses yang dapat dibatasi
                      melalui permission.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </>
          )}

          {/* ==================================================
              INTERNAL INFORMATION
          ================================================== */}

          {values.employeeType ===
            'internal' && (
              <Grid size={{ xs: 12 }}>
                <Alert
                  severity='success'
                  icon={
                    <i className='tabler-shield-check' />
                  }
                >
                  <Typography
                    variant='body2'
                    className='font-medium mbe-1'
                  >
                    Pegawai internal
                  </Typography>

                  <Typography variant='body2'>
                    Pegawai internal tidak memiliki
                    batas akhir penugasan. Akses akun
                    dikelola melalui status akun dan
                    permission.
                  </Typography>
                </Alert>
              </Grid>
            )}

          {/* ==================================================
    LAMPIRAN
================================================== */}

          <Grid size={{ xs: 12 }}>
            <div className='mts-2'>
              <SectionHeader
                icon='tabler-paperclip'
                title='Lampiran'
                description='Tambahkan dokumen pendukung yang berkaitan dengan data pegawai.'
              />
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <div className='p-4 rounded-lg border border-divider'>
              <div className='flex items-center justify-between gap-3 mbe-4'>
                <div className='flex items-start gap-3'>
                  <CustomAvatar
                    skin='light'
                    color='secondary'
                    variant='rounded'
                    size={40}
                  >
                    <i className='tabler-paperclip text-[20px]' />
                  </CustomAvatar>

                  <div>
                    <Typography
                      variant='body2'
                      className='font-semibold'
                    >
                      Dokumen Pendukung
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      Unggah dokumen yang diperlukan sebagai pendukung data pegawai.
                    </Typography>
                  </div>
                </div>

                <Chip
                  size='small'
                  color='secondary'
                  variant='tonal'
                  label='Opsional'
                />
              </div>

              <div
                {...getAdditionalRootProps()}
                className={[
                  'flex flex-col sm:flex-row items-center gap-4 p-5 rounded-lg border border-dashed cursor-pointer transition-all',
                  'hover:border-secondary/40 hover:bg-secondary/[0.025]',
                  isAdditionalDragActive
                    ? 'border-secondary bg-secondary/[0.05]'
                    : 'border-divider'
                ].join(' ')}
              >
                <input {...getAdditionalInputProps()} />

                <CustomAvatar
                  skin='light'
                  color='secondary'
                  variant='rounded'
                  size={44}
                >
                  <i className='tabler-cloud-upload text-[22px]' />
                </CustomAvatar>

                <div className='flex-1 text-center sm:text-start'>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    Tarik dokumen ke sini atau pilih dari perangkat
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Dapat mengunggah beberapa dokumen sekaligus · PDF, JPG, JPEG, PNG · Maks. 5 MB per file
                  </Typography>
                </div>

                <Button
                  variant='tonal'
                  color='secondary'
                  size='small'
                  startIcon={
                    <i className='tabler-upload' />
                  }
                >
                  Pilih File
                </Button>
              </div>

              {additionalFiles.length > 0 && (
                <div className='flex flex-col gap-2 mts-4'>
                  {additionalFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className='flex items-center justify-between gap-3 p-3 rounded-lg border border-divider'
                    >
                      <div className='flex items-center gap-3 min-is-0'>
                        <CustomAvatar
                          skin='light'
                          color='secondary'
                          variant='rounded'
                          size={38}
                        >
                          <i
                            className={`${getFileIcon(file.type)} text-[20px]`}
                          />
                        </CustomAvatar>

                        <div className='min-is-0'>
                          <Typography
                            variant='body2'
                            className='font-medium truncate'
                          >
                            {file.name}
                          </Typography>

                          <Typography
                            variant='caption'
                            color='text.secondary'
                          >
                            {formatFileSize(file.size)}
                          </Typography>
                        </div>
                      </div>

                      <Tooltip title='Hapus dokumen'>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => removeAdditionalFile(index)}
                        >
                          <i className='tabler-trash text-[18px]' />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Grid>

          {/* ATTACHMENT FOOTNOTE */}

          <Grid size={{ xs: 12 }}>
            <div className='flex items-start gap-2 text-textSecondary'>
              <i className='tabler-shield-check text-success text-[18px] mt-0.5' />

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Dokumen yang diunggah akan menjadi
                bagian dari arsip administrasi pegawai
                dan hanya dapat diakses oleh pengguna
                yang memiliki izin.
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EmployeeInformation

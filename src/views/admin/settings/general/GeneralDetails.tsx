'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import styles from './GeneralDetails.module.css'

type GeneralData = {
  applicationName: string
  institutionName: string
  email: string
  phoneNumber: string
  address: string
  description: string
}

type FormErrors = Partial<Record<keyof GeneralData, string>>

const initialData: GeneralData = {
  applicationName: 'DISKOP',
  institutionName:
    'Dinas Koperasi, Usaha Mikro, Perdagangan dan Perindustrian',
  email: 'diskop@banjarbarukota.go.id',
  phoneNumber: '0511-xxxxxxx',
  address: 'Kota Banjarbaru, Kalimantan Selatan',
  description:
    'Platform pelatihan dan pengembangan kompetensi yang dikelola oleh Pemerintah Kota Banjarbaru.'
}

const GeneralDetails = () => {
  const [formData, setFormData] = useState<GeneralData>(initialData)

  const [errors, setErrors] = useState<FormErrors>({})

  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleFormChange = (
    field: keyof GeneralData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }))

    setSaveSuccess(false)
    setSaveError('')
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.applicationName.trim()) {
      newErrors.applicationName = 'Nama aplikasi wajib diisi.'
    }

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Nama instansi wajib diisi.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email resmi wajib diisi.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Format email tidak valid.'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Nomor telepon wajib diisi.'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi.'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setSaveSuccess(false)
    setSaveError('')

    if (!validateForm()) return

    try {
      setIsSaving(true)

      // TODO: Replace with API request
      await new Promise(resolve => setTimeout(resolve, 800))

      setSaveSuccess(true)
    } catch {
      setSaveError(
        'Perubahan gagal disimpan. Silakan coba lagi.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    setSaveSuccess(false)
    setSaveError('')

    if (file.size > 800 * 1024) {
      setSaveError('Ukuran logo maksimal 800KB.')
      return
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/svg+xml'
    ]

    if (!allowedTypes.includes(file.type)) {
      setSaveError(
        'Format logo harus PNG, JPG, JPEG, atau SVG.'
      )
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setImgSrc(reader.result as string)
    }

    reader.onerror = () => {
      setSaveError(
        'Logo gagal dibaca. Silakan coba lagi.'
      )
    }

    reader.readAsDataURL(file)

    setFileInput(event.target.value)
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
    setSaveError('')
    setSaveSuccess(false)
  }

  const handleReset = () => {
    setFormData(initialData)
    setErrors({})
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
    setSaveSuccess(false)
    setSaveError('')
  }

  return (
    <Card className={styles.card}>
      {/* Header */}
      <CardContent className={styles.header}>
        <div className={styles.headerIcon}>
          <i className='tabler-adjustments-horizontal' />
        </div>

        <div className={styles.headerContent}>
          <Typography
            variant='h5'
            className={styles.headerTitle}
          >
            Pengaturan Umum
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            className={styles.headerDescription}
          >
            Kelola identitas dan informasi utama yang digunakan
            oleh platform DISKOP.
          </Typography>
        </div>

        <div className={styles.headerBadge}>
          <span className={styles.statusDot} />
          Sistem Aktif
        </div>
      </CardContent>

      <div className={styles.divider} />

      {/* Logo */}
      <CardContent className={styles.logoSection}>
        <div className={styles.sectionHeading}>
          <div>
            <Typography variant='h6'>
              Identitas Aplikasi
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Atur logo dan identitas utama platform.
            </Typography>
          </div>
        </div>

        <div className={styles.logoPanel}>
          <div className={styles.logoPreviewWrapper}>
            <div className={styles.logoGlow} />

            <div className={styles.logoPreview}>
              <img
                src={imgSrc}
                alt='Logo DISKOP'
              />
            </div>

            <span className={styles.logoStatus}>
              <i className='tabler-check' />
            </span>
          </div>

          <div className={styles.logoInfo}>
            <div>
              <Typography className={styles.logoTitle}>
                Logo Platform
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Digunakan sebagai identitas visual utama DISKOP.
              </Typography>
            </div>

            <div className={styles.logoActions}>
              <Button
                component='label'
                variant='contained'
                htmlFor='general-settings-upload-logo'
                startIcon={
                  <i className='tabler-upload' />
                }
              >
                Upload Logo

                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg, image/svg+xml'
                  onChange={handleFileInputChange}
                  id='general-settings-upload-logo'
                />
              </Button>

              <Button
                variant='tonal'
                color='secondary'
                onClick={handleFileInputReset}
                startIcon={
                  <i className='tabler-refresh' />
                }
              >
                Reset
              </Button>
            </div>

            <div className={styles.fileHint}>
              <i className='tabler-info-circle' />

              <span>
                PNG, JPG, JPEG atau SVG · Maks. 800KB
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <div className={styles.divider} />

      {/* Platform Information */}
      <CardContent className={styles.formSection}>
        <div className={styles.sectionHeading}>
          <div>
            <Typography variant='h6'>
              Informasi Platform
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Informasi berikut digunakan di berbagai bagian
              platform.
            </Typography>
          </div>

          <span className={styles.requiredHint}>
            <span className={styles.requiredAsterisk}>
              *
            </span>{' '}
            Wajib diisi
          </span>
        </div>

        {/* Success */}
        {saveSuccess && (
          <Alert
            severity='success'
            icon={
              <i className='tabler-circle-check' />
            }
            className={styles.alert}
          >
            Pengaturan umum berhasil disimpan.
          </Alert>
        )}

        {/* Error */}
        {saveError && (
          <Alert
            severity='error'
            icon={
              <i className='tabler-alert-circle' />
            }
            className={styles.alert}
          >
            {saveError}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <Grid container spacing={5}>
            {/* Nama Aplikasi */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                required
                className={styles.requiredField}
                label='Nama Aplikasi'
                value={formData.applicationName}
                placeholder='DISKOP'
                error={Boolean(
                  errors.applicationName
                )}
                helperText={
                  errors.applicationName
                }
                onChange={event =>
                  handleFormChange(
                    'applicationName',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-apps' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Nama Instansi */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                required
                className={styles.requiredField}
                label='Nama Instansi'
                value={formData.institutionName}
                placeholder='Nama instansi'
                error={Boolean(
                  errors.institutionName
                )}
                helperText={
                  errors.institutionName
                }
                onChange={event =>
                  handleFormChange(
                    'institutionName',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-building' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                required
                className={styles.requiredField}
                type='email'
                label='Email Resmi'
                value={formData.email}
                placeholder='diskop@banjarbarukota.go.id'
                error={Boolean(errors.email)}
                helperText={errors.email}
                onChange={event =>
                  handleFormChange(
                    'email',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-mail' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Nomor Telepon */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                required
                className={styles.requiredField}
                label='Nomor Telepon'
                value={formData.phoneNumber}
                placeholder='0511-xxxxxxx'
                error={Boolean(
                  errors.phoneNumber
                )}
                helperText={
                  errors.phoneNumber
                }
                onChange={event =>
                  handleFormChange(
                    'phoneNumber',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-phone' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Alamat */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                required
                className={styles.requiredField}
                label='Alamat'
                value={formData.address}
                placeholder='Alamat instansi'
                error={Boolean(errors.address)}
                helperText={errors.address}
                onChange={event =>
                  handleFormChange(
                    'address',
                    event.target.value
                  )
                }
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

            {/* Deskripsi */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                required
                className={styles.requiredField}
                multiline
                minRows={4}
                label='Deskripsi Platform'
                value={formData.description}
                placeholder='Deskripsi platform DISKOP'
                error={Boolean(
                  errors.description
                )}
                helperText={
                  errors.description ??
                  `${formData.description.length}/500 karakter`
                }
                onChange={event => {
                  if (
                    event.target.value.length <= 500
                  ) {
                    handleFormChange(
                      'description',
                      event.target.value
                    )
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position='start'
                        className='self-start mt-2'
                      >
                        <i className='tabler-align-left' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Actions */}
            <Grid
              size={{ xs: 12 }}
              className={styles.actions}
            >
              <Button
                variant='contained'
                type='submit'
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <i className='tabler-loader-2 animate-spin' />
                  ) : (
                    <i className='tabler-device-floppy' />
                  )
                }
              >
                {isSaving
                  ? 'Menyimpan...'
                  : 'Simpan Perubahan'}
              </Button>

              <Button
                variant='tonal'
                type='button'
                color='secondary'
                disabled={isSaving}
                onClick={handleReset}
                startIcon={
                  <i className='tabler-rotate' />
                }
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default GeneralDetails

'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

type FormValues = {
  nik: string
  fullName: string
  birthPlace: string
  birthDate: string
  gender: string
  nationality: string
  maritalStatus: string
  religion: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const InstructorPersonal = ({ mode }: Props) => {
  const [values, setValues] = useState<FormValues>({
    nik: '',
    fullName: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    nationality: 'Indonesia',
    maritalStatus: '',
    religion: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const updateField = (field: keyof FormValues, value: string) => {
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

  const validateNik = (value: string) => {
    const nik = value.replace(/\D/g, '')

    if (nik && nik.length !== 16) {
      return 'NIK harus terdiri dari 16 digit.'
    }

    return ''
  }

  const validateBirthDate = (value: string) => {
    if (!value) return ''

    const selectedDate = new Date(value)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (Number.isNaN(selectedDate.getTime())) {
      return 'Format tanggal lahir tidak valid.'
    }

    if (selectedDate > today) {
      return 'Tanggal lahir tidak boleh melebihi hari ini.'
    }

    return ''
  }

  const handleNikChange = (value: string) => {
    const nik = value.replace(/\D/g, '').slice(0, 16)

    updateField('nik', nik)

    const error = validateNik(nik)

    if (error) {
      setErrors(prev => ({
        ...prev,
        nik: error
      }))
    }
  }

  const handleBirthDateChange = (value: string) => {
    updateField('birthDate', value)

    const error = validateBirthDate(value)

    if (error) {
      setErrors(prev => ({
        ...prev,
        birthDate: error
      }))
    }
  }

  return (
    <Card>
      <CardHeader
        title='Data Pribadi'
        subheader={
          mode === 'edit'
            ? 'Perbarui informasi identitas dan data pribadi pelatih.'
            : 'Lengkapi informasi identitas dan data pribadi pelatih.'
        }
      />

      <CardContent>
        <Grid container spacing={6}>
          {/* NIK */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='NIK'
              placeholder='6372011508950001'
              value={values.nik}
              onChange={event => handleNikChange(event.target.value)}
              error={Boolean(errors.nik)}
              helperText={
                errors.nik ||
                'Opsional. NIK harus terdiri dari 16 digit.'
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-id' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* Nama Lengkap */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Nama Lengkap'
              placeholder='Ahmad Fauzan'
              value={values.fullName}
              onChange={event =>
                updateField('fullName', event.target.value)
              }
              error={Boolean(errors.fullName)}
              helperText={
                errors.fullName ||
                'Gunakan nama lengkap sesuai identitas resmi.'
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
          </Grid>

          {/* Tempat Lahir */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Tempat Lahir'
              placeholder='Banjarbaru'
              value={values.birthPlace}
              onChange={event =>
                updateField('birthPlace', event.target.value)
              }
              error={Boolean(errors.birthPlace)}
              helperText={errors.birthPlace}
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

          {/* Tanggal Lahir */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              type='date'
              label='Tanggal Lahir'
              value={values.birthDate}
              onChange={event =>
                handleBirthDateChange(event.target.value)
              }
              error={Boolean(errors.birthDate)}
              helperText={errors.birthDate}
              slotProps={{
                inputLabel: {
                  shrink: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-calendar' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* Jenis Kelamin */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Jenis Kelamin'
              value={values.gender}
              onChange={event =>
                updateField('gender', event.target.value)
              }
              error={Boolean(errors.gender)}
              helperText={errors.gender}
              slotProps={{
                select: {
                  displayEmpty: true
                },
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
                <span className='text-textDisabled'>
                  Pilih jenis kelamin
                </span>
              </MenuItem>

              <MenuItem value='male'>Laki-laki</MenuItem>
              <MenuItem value='female'>Perempuan</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Kewarganegaraan */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Kewarganegaraan'
              value={values.nationality}
              onChange={event =>
                updateField('nationality', event.target.value)
              }
              error={Boolean(errors.nationality)}
              helperText={errors.nationality}
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-flag' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value='Indonesia'>Indonesia</MenuItem>
              <MenuItem value='Malaysia'>Malaysia</MenuItem>
              <MenuItem value='Singapura'>Singapura</MenuItem>
              <MenuItem value='Brunei'>Brunei Darussalam</MenuItem>
              <MenuItem value='Lainnya'>Lainnya</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Status Pernikahan */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Status Pernikahan'
              value={values.maritalStatus}
              onChange={event =>
                updateField('maritalStatus', event.target.value)
              }
              error={Boolean(errors.maritalStatus)}
              helperText={errors.maritalStatus}
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-heart' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                <span className='text-textDisabled'>
                  Pilih status
                </span>
              </MenuItem>

              <MenuItem value='single'>Belum Menikah</MenuItem>
              <MenuItem value='married'>Menikah</MenuItem>
              <MenuItem value='divorced'>Cerai</MenuItem>
              <MenuItem value='widowed'>Cerai Mati</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Agama */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Agama'
              value={values.religion}
              onChange={event =>
                updateField('religion', event.target.value)
              }
              error={Boolean(errors.religion)}
              helperText={errors.religion}
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-book' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value=''>
                <span className='text-textDisabled'>
                  Pilih agama
                </span>
              </MenuItem>

              <MenuItem value='islam'>Islam</MenuItem>
              <MenuItem value='kristen'>Kristen</MenuItem>
              <MenuItem value='katolik'>Katolik</MenuItem>
              <MenuItem value='hindu'>Hindu</MenuItem>
              <MenuItem value='buddha'>Buddha</MenuItem>
              <MenuItem value='konghucu'>Konghucu</MenuItem>
            </CustomTextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default InstructorPersonal

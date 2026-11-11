'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'

// Third-party Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

type EngagementType =
  | 'permanent'
  | 'contract'
  | 'unattached'

type EngagementStatus =
  | 'active'
  | 'inactive'
  | 'ended'

type Organization = {
  id: number
  name: string
  type: string
  city: string
}

type FormValues = {
  engagementType: EngagementType
  organization: Organization | null
  startDate: Date | null
  endDate: Date | null
  status: EngagementStatus
}

type FormErrors = {
  engagementType?: string
  organization?: string
  startDate?: string
  endDate?: string
  status?: string
}

/* ============================================================
   DUMMY ORGANIZATIONS
============================================================ */

const organizationOptions: Organization[] = [
  {
    id: 1,
    name: 'Dinas Koperasi dan UKM Kota Banjarbaru',
    type: 'Instansi Pemerintah',
    city: 'Banjarbaru'
  },
  {
    id: 2,
    name: 'PT Banua Digital',
    type: 'Perusahaan',
    city: 'Banjarbaru'
  },
  {
    id: 3,
    name: 'PT Borneo Teknologi Nusantara',
    type: 'Perusahaan',
    city: 'Banjarmasin'
  },
  {
    id: 4,
    name: 'Koperasi Banjarbaru Sejahtera',
    type: 'Koperasi',
    city: 'Banjarbaru'
  },
  {
    id: 5,
    name: 'CV Kreatif Banua',
    type: 'Perusahaan',
    city: 'Banjarbaru'
  },
  {
    id: 6,
    name: 'LSP Teknologi Digital',
    type: 'Lembaga Sertifikasi',
    city: 'Banjarmasin'
  }
]

/* ============================================================
   COMPONENT
============================================================ */

const InstructorEngagement = ({ mode }: Props) => {
  const isEdit = mode === 'edit'

  const [values, setValues] = useState<FormValues>({
    engagementType: 'permanent',
    organization: null,
    startDate: null,
    endDate: null,
    status: 'active'
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const isContract =
    values.engagementType === 'contract'

  const isUnattached =
    values.engagementType === 'unattached'

  /* ==========================================================
     UPDATE FIELD
  ========================================================== */

  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))

    if (field in errors) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateField = (
    field: keyof FormValues,
    value: unknown
  ) => {
    let error = ''

    switch (field) {
      case 'engagementType':
        if (!value) {
          error = 'Jenis keterikatan wajib dipilih.'
        }
        break

      case 'organization':
        if (!isUnattached && !value) {
          error =
            'Instansi atau organisasi wajib dipilih.'
        }
        break

      case 'startDate':
        if (isContract && !value) {
          error =
            'Tanggal mulai wajib diisi untuk keterikatan kontrak.'
        }
        break

      case 'endDate':
        if (isContract && !value) {
          error =
            'Tanggal berakhir wajib diisi untuk keterikatan kontrak.'
        }

        if (
          value instanceof Date &&
          values.startDate &&
          value < values.startDate
        ) {
          error =
            'Tanggal berakhir tidak boleh sebelum tanggal mulai.'
        }
        break

      case 'status':
        if (!value) {
          error =
            'Status keterikatan wajib dipilih.'
        }
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }))
  }

  /* ==========================================================
     ENGAGEMENT TYPE
  ========================================================== */

  const handleEngagementTypeChange = (
    value: EngagementType
  ) => {
    updateField('engagementType', value)

    if (value === 'unattached') {
      setValues(prev => ({
        ...prev,
        engagementType: value,
        organization: null,
        startDate: null,
        endDate: null
      }))

      setErrors(prev => ({
        ...prev,
        organization: undefined,
        startDate: undefined,
        endDate: undefined
      }))

      return
    }

    if (value === 'permanent') {
      setValues(prev => ({
        ...prev,
        engagementType: value,
        endDate: null
      }))

      setErrors(prev => ({
        ...prev,
        endDate: undefined
      }))
    }
  }

  /* ==========================================================
     ORGANIZATION
  ========================================================== */

  const handleOrganizationChange = (
    value: Organization | null
  ) => {
    updateField('organization', value)

    if (value) {
      setErrors(prev => ({
        ...prev,
        organization: undefined
      }))
    }
  }

  /* ==========================================================
     START DATE
  ========================================================== */

  const handleStartDateChange = (
    date: Date | null
  ) => {
    updateField('startDate', date)

    if (
      date &&
      values.endDate &&
      values.endDate < date
    ) {
      setErrors(prev => ({
        ...prev,
        endDate:
          'Tanggal berakhir tidak boleh sebelum tanggal mulai.'
      }))

      return
    }

    setErrors(prev => ({
      ...prev,
      startDate: undefined,
      endDate: undefined
    }))
  }

  /* ==========================================================
     END DATE
  ========================================================== */

  const handleEndDateChange = (
    date: Date | null
  ) => {
    if (
      date &&
      values.startDate &&
      date < values.startDate
    ) {
      setErrors(prev => ({
        ...prev,
        endDate:
          'Tanggal berakhir tidak boleh sebelum tanggal mulai.'
      }))

      return
    }

    updateField('endDate', date)

    setErrors(prev => ({
      ...prev,
      endDate: undefined
    }))
  }

  return (
    <Card>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <CardHeader
        avatar={
          <div className='flex items-center justify-center bs-10 is-10 rounded-lg bg-primary/10 text-primary'>
            <i className='tabler-briefcase text-xl' />
          </div>
        }
        title='Keterikatan'
        subheader={
          isEdit
            ? 'Kelola hubungan kerja dan instansi pelatih.'
            : 'Tentukan hubungan kerja dan instansi pelatih.'
        }
      />

      <CardContent>
        <Grid container spacing={5}>

          {/* ==================================================
              JENIS KETERIKATAN
          =================================================== */}

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Jenis Keterikatan{' '}
                  <span className='text-error'>*</span>
                </>
              }
              value={values.engagementType}
              onChange={event =>
                handleEngagementTypeChange(
                  event.target.value as EngagementType
                )
              }
              onBlur={() =>
                validateField(
                  'engagementType',
                  values.engagementType
                )
              }
              error={Boolean(errors.engagementType)}
              helperText={
                errors.engagementType ||
                'Tentukan hubungan pelatih dengan instansi atau organisasi.'
              }
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-briefcase' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value='permanent'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-building text-lg' />
                  <span>Pegawai Tetap</span>
                </div>
              </MenuItem>

              <MenuItem value='contract'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-file-description text-lg' />
                  <span>Kontrak</span>
                </div>
              </MenuItem>

              <MenuItem value='unattached'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-user text-lg' />
                  <span>Tidak Terikat</span>
                </div>
              </MenuItem>
            </CustomTextField>
          </Grid>

          {/* ==================================================
              INSTANSI / ORGANISASI
          =================================================== */}

          {!isUnattached && (
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                fullWidth
                options={organizationOptions}
                value={values.organization}
                onChange={(_, value) =>
                  handleOrganizationChange(value)
                }
                onBlur={() =>
                  validateField(
                    'organization',
                    values.organization
                  )
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) => option.id === value.id}
                getOptionLabel={option =>
                  option.name
                }
                noOptionsText='Instansi atau organisasi tidak ditemukan'
                clearOnEscape
                renderOption={(
                  props,
                  option
                ) => (
                  <li
                    {...props}
                    key={option.id}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center bs-8 is-8 rounded-lg bg-primary/10 text-primary shrink-0'>
                        <i className='tabler-building-skyscraper' />
                      </div>

                      <div className='min-is-0'>
                        <Typography
                          variant='body2'
                          className='font-medium'
                        >
                          {option.name}
                        </Typography>

                        <Typography
                          variant='caption'
                          color='text.secondary'
                        >
                          {option.type} · {option.city}
                        </Typography>
                      </div>
                    </div>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label={
                      <>
                        Instansi / Organisasi{' '}
                        <span className='text-textDisabled text-xs font-normal'>
                          (optional)
                        </span>
                      </>
                    }
                    placeholder='Cari instansi atau organisasi...'
                    error={Boolean(
                      errors.organization
                    )}
                    helperText={
                      errors.organization ||
                      'Cari dan pilih instansi atau organisasi yang sudah terdaftar.'
                    }
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position='start'>
                              <i className='tabler-building-skyscraper' />
                            </InputAdornment>

                            {
                              params.InputProps
                                .startAdornment
                            }
                          </>
                        )
                      }
                    }}
                  />
                )}
              />
            </Grid>
          )}

          {/* ==================================================
              PERIODE
          =================================================== */}

          {!isUnattached && (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant='body2'
                className='font-medium mbe-2'
              >
                Periode
              </Typography>

              <Grid container spacing={3}>

                {/* TANGGAL MULAI */}

                <Grid
                  size={{
                    xs: 12,
                    sm: isContract ? 6 : 12
                  }}
                >
                  <AppReactDatepicker
                    selected={values.startDate}
                    placeholderText='DD/MM/YYYY'
                    dateFormat='dd/MM/yyyy'
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                    onChange={
                      handleStartDateChange
                    }
                    customInput={
                      <CustomTextField
                        fullWidth
                        label={
                          <>
                            Tanggal Mulai{' '}
                            {isContract && (
                              <span className='text-error'>
                                *
                              </span>
                            )}

                            {!isContract && (
                              <span className='text-textDisabled text-xs font-normal'>
                                (optional)
                              </span>
                            )}
                          </>
                        }
                        placeholder='DD/MM/YYYY'
                        error={Boolean(
                          errors.startDate
                        )}
                        helperText={
                          errors.startDate ||
                          'Tanggal mulai hubungan kerja.'
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
                </Grid>

                {/* TANGGAL BERAKHIR */}

                {isContract && (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}
                  >
                    <AppReactDatepicker
                      selected={values.endDate}
                      minDate={
                        values.startDate ||
                        undefined
                      }
                      placeholderText='DD/MM/YYYY'
                      dateFormat='dd/MM/yyyy'
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode='select'
                      onChange={
                        handleEndDateChange
                      }
                      customInput={
                        <CustomTextField
                          fullWidth
                          label={
                            <>
                              Tanggal Berakhir{' '}
                              <span className='text-error'>
                                *
                              </span>
                            </>
                          }
                          placeholder='DD/MM/YYYY'
                          error={Boolean(
                            errors.endDate
                          )}
                          helperText={
                            errors.endDate ||
                            'Tanggal berakhir kontrak.'
                          }
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <i className='tabler-calendar-event' />
                                </InputAdornment>
                              )
                            }
                          }}
                        />
                      }
                    />
                  </Grid>
                )}

              </Grid>
            </Grid>
          )}

          {/* ==================================================
              STATUS
          =================================================== */}

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  Status Keterikatan{' '}
                  <span className='text-error'>*</span>
                </>
              }
              value={values.status}
              onChange={event =>
                updateField(
                  'status',
                  event.target.value as EngagementStatus
                )
              }
              onBlur={() =>
                validateField(
                  'status',
                  values.status
                )
              }
              error={Boolean(errors.status)}
              helperText={
                errors.status ||
                'Status hubungan kerja pelatih saat ini.'
              }
              slotProps={{
                select: {
                  displayEmpty: true
                },
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-activity' />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value='active'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-check text-success' />
                  <span>Aktif</span>
                </div>
              </MenuItem>

              <MenuItem value='inactive'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-player-pause text-warning' />
                  <span>Tidak Aktif</span>
                </div>
              </MenuItem>

              <MenuItem value='ended'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-x text-error' />
                  <span>Berakhir</span>
                </div>
              </MenuItem>
            </CustomTextField>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default InstructorEngagement

'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import {
  Controller,
  useFieldArray,
  useForm
} from 'react-hook-form'

// Type Imports
import type {
  ExpertiseInstructorType,
  InstructorExpertiseType
} from './ExpertiseTable'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  open: boolean
  handleClose: () => void
  expertiseData: InstructorExpertiseType[]
  selectedExpertise?: InstructorExpertiseType | null
  mode?: 'create' | 'edit'
  setData: (
    data:
      | InstructorExpertiseType[]
      | ((
      currentData: InstructorExpertiseType[]
    ) => InstructorExpertiseType[])
  ) => void
}

type FormInstructor = {
  instructorId: number | null
}

type FormValues = {
  name: string
  slug: string
  instructors: FormInstructor[]
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const EXPERTISE_NAME_MAX_LENGTH = 100
const EXPERTISE_SLUG_MAX_LENGTH = 100

// -----------------------------------------------------------------------------
// Available Instructors
// -----------------------------------------------------------------------------
// Prototype.
// Nanti production ambil dari API / Prisma.

const availableInstructors: ExpertiseInstructorType[] = [
  {
    id: 1,
    name: 'Ahmad Fauzan',
    avatar: '/images/avatars/1.png'
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    avatar: '/images/avatars/2.png'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    avatar: '/images/avatars/3.png'
  },
  {
    id: 4,
    name: 'Dimas Saputra',
    avatar: '/images/avatars/4.png'
  },
  {
    id: 5,
    name: 'Nadia Putri',
    avatar: '/images/avatars/5.png'
  },
  {
    id: 6,
    name: 'Fajar Hidayat',
    avatar: '/images/avatars/6.png'
  },
  {
    id: 7,
    name: 'Siti Rahma',
    avatar: '/images/avatars/7.png'
  },
  {
    id: 8,
    name: 'Dewi Lestari',
    avatar: '/images/avatars/8.png'
  }
]

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const generateSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const AddExpertiseDrawer = (props: Props) => {
  const {
    open,
    handleClose,
    expertiseData,
    selectedExpertise,
    mode = 'create',
    setData
  } = props

  const isEditMode =
    mode === 'edit' &&
    !!selectedExpertise

  // ---------------------------------------------------------------------------
  // States
  // ---------------------------------------------------------------------------

  const [
    submitError,
    setSubmitError
  ] = useState('')

  const [
    isSlugManuallyEdited,
    setIsSlugManuallyEdited
  ] = useState(false)

  const slugInitializedRef =
    useRef(false)

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      slug: '',
      instructors: []
    },
    mode: 'onBlur'
  })

  // ---------------------------------------------------------------------------
  // Repeater
  // ---------------------------------------------------------------------------

  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'instructors'
  })

  const watchedName =
    watch('name')

  const watchedInstructors =
    watch('instructors')

  // ---------------------------------------------------------------------------
  // Populate Form
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) {
      return
    }

    setSubmitError('')

    if (
      isEditMode &&
      selectedExpertise
    ) {
      resetForm({
        name:
        selectedExpertise.name,

        slug:
        selectedExpertise.slug,

        instructors:
          selectedExpertise.instructors.map(
            instructor => ({
              instructorId:
              instructor.id
            })
          )
      })

      setIsSlugManuallyEdited(true)

      slugInitializedRef.current =
        true

      return
    }

    resetForm({
      name: '',
      slug: '',
      instructors: []
    })

    setIsSlugManuallyEdited(false)

    slugInitializedRef.current =
      false
  }, [
    open,
    isEditMode,
    selectedExpertise,
    resetForm
  ])

  // ---------------------------------------------------------------------------
  // Auto Generate Slug
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) {
      return
    }

    if (isEditMode) {
      return
    }

    if (isSlugManuallyEdited) {
      return
    }

    const generatedSlug =
      generateSlug(
        watchedName
      )

    setValue(
      'slug',
      generatedSlug.slice(
        0,
        EXPERTISE_SLUG_MAX_LENGTH
      ),
      {
        shouldValidate: false
      }
    )

    slugInitializedRef.current =
      true
  }, [
    watchedName,
    open,
    isEditMode,
    isSlugManuallyEdited,
    setValue
  ])

  // ---------------------------------------------------------------------------
  // Add Instructor
  // ---------------------------------------------------------------------------

  const handleAddInstructor = () => {
    const selectedIds =
      watchedInstructors
        .map(
          instructor =>
            instructor.instructorId
        )
        .filter(
          (
            id
          ): id is number =>
            typeof id ===
            'number'
        )

    const nextInstructor =
      availableInstructors.find(
        instructor =>
          !selectedIds.includes(
            instructor.id
          )
      )

    if (!nextInstructor) {
      setSubmitError(
        'Semua pelatih yang tersedia sudah dipilih.'
      )

      return
    }

    setSubmitError('')

    append({
      instructorId:
      nextInstructor.id
    })
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleFormSubmit = (
    formData: FormValues
  ) => {
    setSubmitError('')

    try {
      // -----------------------------------------------------------------------
      // Normalize
      // -----------------------------------------------------------------------

      const normalizedName =
        formData.name.trim()

      const normalizedSlug =
        generateSlug(
          formData.slug
        )

      // -----------------------------------------------------------------------
      // Duplicate Name
      // -----------------------------------------------------------------------

      const duplicateName =
        expertiseData.some(
          expertise => {
            const sameExpertise =
              isEditMode &&
              selectedExpertise &&
              expertise.id ===
              selectedExpertise.id

            if (sameExpertise) {
              return false
            }

            return (
              expertise.name
                .trim()
                .toLowerCase() ===
              normalizedName.toLowerCase()
            )
          }
        )

      if (duplicateName) {
        setSubmitError(
          'Nama keahlian sudah digunakan. Silakan gunakan nama yang berbeda.'
        )

        return
      }

      // -----------------------------------------------------------------------
      // Duplicate Slug
      // -----------------------------------------------------------------------

      const duplicateSlug =
        expertiseData.some(
          expertise => {
            const sameExpertise =
              isEditMode &&
              selectedExpertise &&
              expertise.id ===
              selectedExpertise.id

            if (sameExpertise) {
              return false
            }

            return (
              expertise.slug ===
              normalizedSlug
            )
          }
        )

      if (duplicateSlug) {
        setSubmitError(
          'Slug keahlian sudah digunakan. Silakan gunakan slug yang berbeda.'
        )

        return
      }

      // -----------------------------------------------------------------------
      // Validate Instructor IDs
      // -----------------------------------------------------------------------

      const instructorIds =
        formData.instructors
          .map(
            instructor =>
              instructor.instructorId
          )
          .filter(
            (
              id
            ): id is number =>
              typeof id ===
              'number'
          )

      // -----------------------------------------------------------------------
      // Duplicate Instructor Check
      // -----------------------------------------------------------------------

      const uniqueInstructorIds =
        new Set(
          instructorIds
        )

      if (
        instructorIds.length !==
        uniqueInstructorIds.size
      ) {
        setSubmitError(
          'Pelatih yang sama tidak dapat dipilih lebih dari satu kali.'
        )

        return
      }

      // -----------------------------------------------------------------------
      // Resolve Instructor Data
      // -----------------------------------------------------------------------

      const selectedInstructors =
        instructorIds
          .map(id =>
            availableInstructors.find(
              instructor =>
                instructor.id ===
                id
            )
          )
          .filter(
            (
              instructor
            ): instructor is ExpertiseInstructorType =>
              !!instructor
          )

      // -----------------------------------------------------------------------
      // Edit
      // -----------------------------------------------------------------------

      if (
        isEditMode &&
        selectedExpertise
      ) {
        setData(
          currentData =>
            currentData.map(
              expertise =>
                expertise.id ===
                selectedExpertise.id
                  ? {
                    ...expertise,

                    name:
                    normalizedName,

                    slug:
                    normalizedSlug,

                    instructors:
                    selectedInstructors,

                    totalInstructors:
                    selectedInstructors.length,

                    updatedAt:
                      new Date().toISOString()
                  }
                  : expertise
            )
        )

        handleReset()

        return
      }

      // -----------------------------------------------------------------------
      // Create
      // -----------------------------------------------------------------------

      const newId =
        expertiseData.length >
        0
          ? Math.max(
          ...expertiseData.map(
            expertise =>
              expertise.id
          )
        ) + 1
          : 1

      const now =
        new Date().toISOString()

      const newExpertise: InstructorExpertiseType =
        {
          id: newId,

          name:
          normalizedName,

          slug:
          normalizedSlug,

          totalInstructors:
          selectedInstructors.length,

          totalTrainings:
            0,

          instructors:
          selectedInstructors,

          createdAt:
          now,

          updatedAt:
          now
        }

      setData(
        currentData => [
          ...currentData,
          newExpertise
        ]
      )

      handleReset()
    } catch (error) {
      console.error(
        'Failed to save expertise:',
        error
      )

      setSubmitError(
        'Keahlian gagal disimpan. Silakan coba lagi.'
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const handleReset = () => {
    handleClose()

    resetForm({
      name: '',
      slug: '',
      instructors: []
    })

    setSubmitError('')

    setIsSlugManuallyEdited(
      false
    )

    slugInitializedRef.current =
      false
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: {
            xs: 320,
            sm: 480
          }
        }
      }}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header */}
      {/* ------------------------------------------------------------------- */}

      <div className='flex items-center justify-between pli-6 plb-5'>
        <div className='flex items-center gap-3 min-is-0'>
          <div className='flex items-center justify-center bs-11 is-11 rounded-xl bg-primaryLight shrink-0'>
            <i className='tabler-award text-xl text-primary' />
          </div>

          <div className='min-is-0'>
            <Typography
              variant='h5'
              className='font-semibold truncate'
            >
              {isEditMode
                ? 'Edit Keahlian'
                : 'Tambah Keahlian'}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className='truncate'
            >
              {isEditMode
                ? 'Perbarui keahlian dan pelatih terkait.'
                : 'Tambahkan bidang keahlian baru untuk pelatih.'}
            </Typography>
          </div>
        </div>

        <IconButton
          size='small'
          onClick={
            handleReset
          }
          className='shrink-0'
          aria-label='Tutup'
        >
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>

      <Divider />

      {/* ------------------------------------------------------------------- */}
      {/* Form */}
      {/* ------------------------------------------------------------------- */}

      <div className='p-6'>
        <form
          onSubmit={handleSubmit(
            handleFormSubmit
          )}
          className='flex flex-col gap-5'
        >
          {/* ----------------------------------------------------------------- */}
          {/* General Error */}
          {/* ----------------------------------------------------------------- */}

          {submitError && (
            <div className='flex items-start gap-3 rounded-xl border border-error/30 bg-errorLight p-4'>
              <div className='flex items-center justify-center bs-8 is-8 rounded-full bg-errorLight shrink-0'>
                <i className='tabler-alert-circle text-error' />
              </div>

              <div className='min-is-0'>
                <Typography
                  variant='body2'
                  className='font-medium text-error'
                >
                  Gagal menyimpan
                  keahlian
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {submitError}
                </Typography>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* Name */}
          {/* ----------------------------------------------------------------- */}

          <Controller
            name='name'
            control={control}
            rules={{
              required:
                'Nama keahlian wajib diisi.',

              minLength: {
                value: 3,
                message:
                  'Nama keahlian minimal 3 karakter.'
              },

              maxLength: {
                value:
                EXPERTISE_NAME_MAX_LENGTH,
                message:
                  `Nama keahlian maksimal ${EXPERTISE_NAME_MAX_LENGTH} karakter.`
              }
            }}
            render={({
                       field
                     }) => (
              <CustomTextField
                {...field}
                fullWidth
                label={
                  <span>
                    Nama Keahlian{' '}
                    <span
                      style={{
                        color:
                          'var(--mui-palette-error-main)'
                      }}
                    >
                      *
                    </span>
                  </span>
                }
                placeholder='Contoh: Programming'
                error={
                  !!errors.name
                }
                inputProps={{
                  maxLength:
                  EXPERTISE_NAME_MAX_LENGTH
                }}
                helperText={
                  errors.name
                    ?.message ??
                  `${field.value.length}/${EXPERTISE_NAME_MAX_LENGTH} karakter`
                }
                FormHelperTextProps={{
                  sx: {
                    color:
                      errors.name
                        ? 'error.main'
                        : 'text.secondary'
                  }
                }}
              />
            )}
          />

          {/* ----------------------------------------------------------------- */}
          {/* Slug */}
          {/* ----------------------------------------------------------------- */}

          <Controller
            name='slug'
            control={control}
            rules={{
              required:
                'Slug keahlian wajib diisi.',

              minLength: {
                value: 3,
                message:
                  'Slug minimal 3 karakter.'
              },

              maxLength: {
                value:
                EXPERTISE_SLUG_MAX_LENGTH,
                message:
                  `Slug maksimal ${EXPERTISE_SLUG_MAX_LENGTH} karakter.`
              },

              pattern: {
                value:
                  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message:
                  'Slug hanya boleh berisi huruf kecil, angka, dan tanda strip.'
              }
            }}
            render={({
                       field
                     }) => (
              <CustomTextField
                {...field}
                fullWidth
                label={
                  <span>
                    Slug{' '}
                    <span
                      style={{
                        color:
                          'var(--mui-palette-error-main)'
                      }}
                    >
                      *
                    </span>
                  </span>
                }
                placeholder='programming'
                error={
                  !!errors.slug
                }
                inputProps={{
                  maxLength:
                  EXPERTISE_SLUG_MAX_LENGTH
                }}
                onChange={event => {
                  setIsSlugManuallyEdited(
                    true
                  )

                  field.onChange(
                    event
                  )
                }}
                helperText={
                  errors.slug
                    ?.message ??
                  `${field.value.length}/${EXPERTISE_SLUG_MAX_LENGTH} karakter`
                }
                FormHelperTextProps={{
                  sx: {
                    color:
                      errors.slug
                        ? 'error.main'
                        : 'text.secondary'
                  }
                }}
              />
            )}
          />

          {/* ----------------------------------------------------------------- */}
          {/* Instructors */}
          {/* ----------------------------------------------------------------- */}

          <div className='flex flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  Pelatih
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Opsional. Tambahkan
                  satu atau beberapa
                  pelatih yang memiliki
                  keahlian ini.
                </Typography>
              </div>

              {fields.length >
                0 && (
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    className='whitespace-nowrap'
                  >
                    {fields.length}{' '}
                    dipilih
                  </Typography>
                )}
            </div>

            {/* --------------------------------------------------------------- */}
            {/* Repeater */}
            {/* --------------------------------------------------------------- */}

            {fields.length > 0 && (
              <div className='flex flex-col gap-3'>
                {fields.map(
                  (
                    field,
                    index
                  ) => {
                    const currentId =
                      watchedInstructors[
                        index
                        ]
                        ?.instructorId

                    const selectedIds =
                      watchedInstructors
                        .map(
                          item =>
                            item.instructorId
                        )
                        .filter(
                          (
                            id
                          ): id is number =>
                            typeof id ===
                            'number'
                        )

                    const selectedValue =
                      currentId
                        ? availableInstructors.find(
                          instructor =>
                            instructor.id ===
                            currentId
                        ) ??
                        null
                        : null

                    // Jangan tampilkan instructor
                    // yang sudah dipilih di repeater lain.
                    const availableOptions =
                      availableInstructors.filter(
                        instructor =>
                          instructor.id ===
                          currentId ||
                          !selectedIds.includes(
                            instructor.id
                          )
                      )

                    return (
                      <div
                        key={
                          field.id
                        }
                        className='flex items-start gap-2'
                      >
                        <Controller
                          name={`instructors.${index}.instructorId`}
                          control={
                            control
                          }
                          rules={{
                            validate:
                              value => {
                                if (
                                  !value
                                ) {
                                  return 'Pilih pelatih.'
                                }

                                const duplicateCount =
                                  selectedIds.filter(
                                    id =>
                                      id ===
                                      Number(
                                        value
                                      )
                                  ).length

                                if (
                                  duplicateCount >
                                  1
                                ) {
                                  return 'Pelatih ini sudah dipilih.'
                                }

                                return true
                              }
                          }}
                          render={({
                                     field:
                                       instructorField
                                   }) => (
                            <Autocomplete<
                                ExpertiseInstructorType,
                                false,
                                false,
                                false
                              >
                              fullWidth
                              options={
                                availableOptions
                              }
                              value={
                                selectedValue
                              }
                              isOptionEqualToValue={(
                                option,
                                value
                              ) =>
                                option.id ===
                                value.id
                              }
                              getOptionLabel={option =>
                                option.name
                              }
                              onChange={(
                                _event,
                                value
                              ) => {
                                instructorField.onChange(
                                  value?.id ??
                                  null
                                )
                              }}
                              filterOptions={(
                                options,
                                state
                              ) => {
                                const query =
                                  state.inputValue
                                    .trim()
                                    .toLowerCase()

                                if (
                                  !query
                                ) {
                                  return options
                                }

                                return options.filter(
                                  option =>
                                    option.name
                                      .toLowerCase()
                                      .includes(
                                        query
                                      )
                                )
                              }}
                              noOptionsText='Pelatih tidak ditemukan'
                              clearOnEscape
                              handleHomeEndKeys
                              renderOption={(
                                props,
                                option
                              ) => (
                                <li
                                  {...props}
                                  key={
                                    option.id
                                  }
                                >
                                  <div className='flex items-center gap-3'>
                                    <Avatar
                                      src={
                                        option.avatar
                                      }
                                      alt={
                                        option.name
                                      }
                                      sx={{
                                        width: 34,
                                        height: 34
                                      }}
                                    />

                                    <div className='flex flex-col'>
                                      <Typography
                                        variant='body2'
                                        className='font-medium'
                                      >
                                        {
                                          option.name
                                        }
                                      </Typography>

                                      <Typography
                                        variant='caption'
                                        color='text.secondary'
                                      >
                                        Tenaga Pelatih
                                      </Typography>
                                    </div>
                                  </div>
                                </li>
                              )}
                              renderInput={params => (
                                <CustomTextField
                                  {...params}
                                  label={`Pelatih ${index + 1}`}
                                  placeholder='Cari nama pelatih...'
                                  error={
                                    !!errors
                                      .instructors?.[
                                      index
                                      ]
                                      ?.instructorId
                                  }
                                  helperText={
                                    errors
                                      .instructors?.[
                                      index
                                      ]
                                      ?.instructorId
                                      ?.message
                                  }
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment:
                                      selectedValue ? (
                                        <Avatar
                                          src={
                                            selectedValue.avatar
                                          }
                                          alt={
                                            selectedValue.name
                                          }
                                          sx={{
                                            width: 28,
                                            height: 28,
                                            mr: 1
                                          }}
                                        />
                                      ) : (
                                        params
                                          .InputProps
                                          .startAdornment
                                      )
                                  }}
                                />
                              )}
                            />
                          )}
                        />

                        <IconButton
                          size='small'
                          color='error'
                          onClick={() =>
                            remove(
                              index
                            )
                          }
                          className='mt-1'
                          aria-label={`Hapus pelatih ${index + 1}`}
                        >
                          <i className='tabler-trash' />
                        </IconButton>
                      </div>
                    )
                  }
                )}
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* Add Instructor */}
            {/* --------------------------------------------------------------- */}

            <Button
              type='button'
              variant='tonal'
              color='primary'
              startIcon={
                <i className='tabler-plus' />
              }
              onClick={
                handleAddInstructor
              }
              disabled={
                fields.length >=
                availableInstructors.length
              }
              className='self-start'
            >
              Tambah Pelatih
            </Button>

            {/* --------------------------------------------------------------- */}
            {/* Empty State */}
            {/* --------------------------------------------------------------- */}

            {fields.length === 0 && (
              <div className='rounded-xl border border-dashed border-divider p-4'>
                <div className='flex items-start gap-3'>
                  <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-actionHover shrink-0'>
                    <i className='tabler-users text-textSecondary' />
                  </div>

                  <div>
                    <Typography
                      variant='body2'
                      className='font-medium mbe-1'
                    >
                      Belum ada
                      pelatih
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      Pelatih bersifat
                      opsional. Kamu
                      bisa langsung
                      menyimpan
                      keahlian tanpa
                      menetapkan
                      pelatih.
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Existing Training Relation */}
          {/* ----------------------------------------------------------------- */}

          {isEditMode &&
            selectedExpertise && (
              <div className='flex items-center justify-between rounded-xl border border-divider p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center bs-10 is-10 rounded-lg bg-primaryLight shrink-0'>
                    <i className='tabler-school text-primary' />
                  </div>

                  <div>
                    <Typography
                      variant='body2'
                      className='font-medium'
                    >
                      Pelatihan
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      Menggunakan
                      keahlian ini
                    </Typography>
                  </div>
                </div>

                <Typography
                  variant='h6'
                  className='font-semibold'
                >
                  {selectedExpertise.totalTrainings.toLocaleString(
                    'id-ID'
                  )}
                </Typography>
              </div>
            )}

          {/* ----------------------------------------------------------------- */}
          {/* Info */}
          {/* ----------------------------------------------------------------- */}

          <div className='flex items-start gap-3 rounded-xl border border-divider p-4'>
            <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-primaryLight shrink-0'>
              <i className='tabler-info-circle text-primary' />
            </div>

            <div className='min-is-0'>
              <Typography
                variant='body2'
                className='font-medium mbe-1'
              >
                Tentang keahlian
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Keahlian merupakan
                master kompetensi
                pelatih. Satu
                pelatih dapat
                memiliki beberapa
                keahlian.
              </Typography>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Actions */}
          {/* ----------------------------------------------------------------- */}

          <div className='flex items-center gap-3 mbs-2'>
            <Button
              variant='contained'
              type='submit'
              disabled={
                isSubmitting
              }
              startIcon={
                isSubmitting ? (
                  <i className='tabler-loader-2 animate-spin' />
                ) : (
                  <i
                    className={
                      isEditMode
                        ? 'tabler-check'
                        : 'tabler-plus'
                    }
                  />
                )
              }
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isEditMode
                  ? 'Simpan Perubahan'
                  : 'Tambah Keahlian'}
            </Button>

            <Button
              variant='tonal'
              color='secondary'
              type='button'
              disabled={
                isSubmitting
              }
              onClick={
                handleReset
              }
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddExpertiseDrawer

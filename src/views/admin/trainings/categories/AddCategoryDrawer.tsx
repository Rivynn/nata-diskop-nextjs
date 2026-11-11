'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Type Imports
import type { TrainingCategoryType } from './CategoryTable'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  open: boolean
  handleClose: () => void
  categoryData: TrainingCategoryType[]
  selectedCategory?: TrainingCategoryType | null
  mode?: 'create' | 'edit'
  setData: (
    data:
      | TrainingCategoryType[]
      | ((
      currentData: TrainingCategoryType[]
    ) => TrainingCategoryType[])
  ) => void
}

type FormValues = {
  name: string
  slug: string
  description: string
  status: 'active' | 'inactive'
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CATEGORY_NAME_MAX_LENGTH = 100
const CATEGORY_SLUG_MAX_LENGTH = 100
const CATEGORY_DESCRIPTION_MAX_LENGTH = 500

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

const AddCategoryDrawer = (props: Props) => {
  const {
    open,
    handleClose,
    categoryData,
    selectedCategory,
    mode = 'create',
    setData
  } = props

  const isEditMode =
    mode === 'edit' && !!selectedCategory

  // ---------------------------------------------------------------------------
  // States
  // ---------------------------------------------------------------------------

  const [submitError, setSubmitError] =
    useState('')

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
      description: '',
      status: 'active'
    },
    mode: 'onBlur'
  })

  const watchedName = watch('name')
  const watchedDescription =
    watch('description')

  // ---------------------------------------------------------------------------
  // Populate Form
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) return

    setSubmitError('')

    if (
      isEditMode &&
      selectedCategory
    ) {
      resetForm({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description:
        selectedCategory.description,
        status:
        selectedCategory.status
      })

      setIsSlugManuallyEdited(true)
      slugInitializedRef.current = true

      return
    }

    resetForm({
      name: '',
      slug: '',
      description: '',
      status: 'active'
    })

    setIsSlugManuallyEdited(false)
    slugInitializedRef.current = false
  }, [
    open,
    isEditMode,
    selectedCategory,
    resetForm
  ])

  // ---------------------------------------------------------------------------
  // Auto Generate Slug
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) return
    if (isEditMode) return
    if (isSlugManuallyEdited) return

    const generatedSlug =
      generateSlug(watchedName)

    setValue(
      'slug',
      generatedSlug,
      {
        shouldValidate: false
      }
    )

    slugInitializedRef.current = true
  }, [
    watchedName,
    open,
    isEditMode,
    isSlugManuallyEdited,
    setValue
  ])

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleFormSubmit = (
    formData: FormValues
  ) => {
    setSubmitError('')

    try {
      const normalizedName =
        formData.name.trim()

      const normalizedSlug =
        generateSlug(formData.slug)

      const normalizedDescription =
        formData.description.trim()

      // ---------------------------------------------------------------
      // Duplicate name validation
      // ---------------------------------------------------------------

      const duplicateName =
        categoryData.some(category => {
          const sameCategory =
            isEditMode &&
            selectedCategory &&
            category.id ===
            selectedCategory.id

          if (sameCategory) {
            return false
          }

          return (
            category.name
              .trim()
              .toLowerCase() ===
            normalizedName.toLowerCase()
          )
        })

      if (duplicateName) {
        setSubmitError(
          'Nama kategori sudah digunakan. Silakan gunakan nama yang berbeda.'
        )

        return
      }

      // ---------------------------------------------------------------
      // Duplicate slug validation
      // ---------------------------------------------------------------

      const duplicateSlug =
        categoryData.some(category => {
          const sameCategory =
            isEditMode &&
            selectedCategory &&
            category.id ===
            selectedCategory.id

          if (sameCategory) {
            return false
          }

          return (
            category.slug ===
            normalizedSlug
          )
        })

      if (duplicateSlug) {
        setSubmitError(
          'Slug kategori sudah digunakan. Silakan gunakan slug yang berbeda.'
        )

        return
      }

      // ---------------------------------------------------------------
      // Edit
      // ---------------------------------------------------------------

      if (
        isEditMode &&
        selectedCategory
      ) {
        setData(currentData =>
          currentData.map(category =>
            category.id ===
            selectedCategory.id
              ? {
                ...category,
                name:
                normalizedName,
                slug:
                normalizedSlug,
                description:
                normalizedDescription,
                status:
                formData.status,
                updatedAt:
                  new Date().toISOString()
              }
              : category
          )
        )

        handleReset()

        return
      }

      // ---------------------------------------------------------------
      // Create
      // ---------------------------------------------------------------

      const newId =
        categoryData.length > 0
          ? Math.max(
          ...categoryData.map(
            category =>
              category.id
          )
        ) + 1
          : 1

      const now =
        new Date().toISOString()

      const newCategory: TrainingCategoryType =
        {
          id: newId,
          name:
          normalizedName,
          slug:
          normalizedSlug,
          description:
          normalizedDescription,
          totalTrainings: 0,
          totalParticipants: 0,
          status:
          formData.status,
          createdAt: now,
          updatedAt: now
        }

      setData(currentData => [
        ...currentData,
        newCategory
      ])

      handleReset()
    } catch (error) {
      console.error(
        'Failed to save category:',
        error
      )

      setSubmitError(
        'Kategori gagal disimpan. Silakan coba lagi.'
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
      description: '',
      status: 'active'
    })

    setSubmitError('')
    setIsSlugManuallyEdited(false)
    slugInitializedRef.current = false
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
            sm: 460
          }
        }
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Header */}
      {/* ----------------------------------------------------------------- */}

      <div className='flex items-center justify-between pli-6 plb-5'>
        <div className='flex items-center gap-3 min-is-0'>
          <div className='flex items-center justify-center bs-11 is-11 rounded-xl bg-primaryLight shrink-0'>
            <i className='tabler-category-2 text-xl text-primary' />
          </div>

          <div className='min-is-0'>
            <Typography
              variant='h5'
              className='font-semibold truncate'
            >
              {isEditMode
                ? 'Edit Kategori'
                : 'Tambah Kategori'}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className='truncate'
            >
              {isEditMode
                ? 'Perbarui informasi kategori pelatihan.'
                : 'Tambahkan bidang baru ke kategori pelatihan.'}
            </Typography>
          </div>
        </div>

        <IconButton
          size='small'
          onClick={handleReset}
          className='shrink-0'
          aria-label='Tutup'
        >
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>

      <Divider />

      {/* ----------------------------------------------------------------- */}
      {/* Form */}
      {/* ----------------------------------------------------------------- */}

      <div className='p-6'>
        <form
          onSubmit={handleSubmit(
            handleFormSubmit
          )}
          className='flex flex-col gap-5'
        >
          {/* --------------------------------------------------------------- */}
          {/* General Error */}
          {/* --------------------------------------------------------------- */}

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
                  Gagal menyimpan kategori
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

          {/* --------------------------------------------------------------- */}
          {/* Name */}
          {/* --------------------------------------------------------------- */}

          <Controller
            name='name'
            control={control}
            rules={{
              required:
                'Nama kategori wajib diisi.',
              minLength: {
                value: 3,
                message:
                  'Nama kategori minimal 3 karakter.'
              },
              maxLength: {
                value:
                CATEGORY_NAME_MAX_LENGTH,
                message:
                  `Nama kategori maksimal ${CATEGORY_NAME_MAX_LENGTH} karakter.`
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label={
                  <span>
                    Nama Kategori{' '}
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
                placeholder='Contoh: Teknologi & Digital'
                error={!!errors.name}
                inputProps={{
                  maxLength:
                  CATEGORY_NAME_MAX_LENGTH
                }}
                helperText={
                  errors.name?.message ??
                  `${field.value.length}/${CATEGORY_NAME_MAX_LENGTH} karakter`
                }
                FormHelperTextProps={{
                  sx: {
                    color: errors.name
                      ? 'error.main'
                      : 'text.secondary'
                  }
                }}
              />
            )}
          />

          {/* --------------------------------------------------------------- */}
          {/* Slug */}
          {/* --------------------------------------------------------------- */}

          <Controller
            name='slug'
            control={control}
            rules={{
              required:
                'Slug kategori wajib diisi.',
              minLength: {
                value: 3,
                message:
                  'Slug minimal 3 karakter.'
              },
              maxLength: {
                value:
                CATEGORY_SLUG_MAX_LENGTH,
                message:
                  `Slug maksimal ${CATEGORY_SLUG_MAX_LENGTH} karakter.`
              },
              pattern: {
                value:
                  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message:
                  'Slug hanya boleh berisi huruf kecil, angka, dan tanda strip.'
              }
            }}
            render={({ field }) => (
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
                placeholder='teknologi-digital'
                error={!!errors.slug}
                inputProps={{
                  maxLength:
                  CATEGORY_SLUG_MAX_LENGTH
                }}
                onChange={event => {
                  setIsSlugManuallyEdited(
                    true
                  )

                  field.onChange(event)
                }}
                helperText={
                  errors.slug?.message ??
                  `${field.value.length}/${CATEGORY_SLUG_MAX_LENGTH} karakter`
                }
                FormHelperTextProps={{
                  sx: {
                    color: errors.slug
                      ? 'error.main'
                      : 'text.secondary'
                  }
                }}
              />
            )}
          />

          {/* --------------------------------------------------------------- */}
          {/* Description */}
          {/* --------------------------------------------------------------- */}

          <Controller
            name='description'
            control={control}
            rules={{
              maxLength: {
                value:
                CATEGORY_DESCRIPTION_MAX_LENGTH,
                message:
                  `Deskripsi maksimal ${CATEGORY_DESCRIPTION_MAX_LENGTH} karakter.`
              }
            }}
            render={({ field }) => (
              <div className='flex flex-col gap-1'>
                <CustomTextField
                  {...field}
                  fullWidth
                  multiline
                  rows={5}
                  label='Deskripsi'
                  placeholder='Jelaskan bidang atau jenis pelatihan yang termasuk dalam kategori ini...'
                  error={
                    !!errors.description
                  }
                  inputProps={{
                    maxLength:
                    CATEGORY_DESCRIPTION_MAX_LENGTH
                  }}
                  helperText={
                    errors.description?.message ??
                    'Opsional. Jelaskan cakupan kategori agar mudah dipahami admin.'
                  }
                  FormHelperTextProps={{
                    sx: {
                      color:
                        errors.description
                          ? 'error.main'
                          : 'text.secondary'
                    }
                  }}
                />

                <div className='flex items-center justify-end'>
                  <Typography
                    variant='caption'
                    color={
                      watchedDescription.length >=
                      CATEGORY_DESCRIPTION_MAX_LENGTH
                        ? 'error.main'
                        : 'text.secondary'
                    }
                    className='font-medium'
                  >
                    {
                      watchedDescription.length
                    }
                    /
                    {
                      CATEGORY_DESCRIPTION_MAX_LENGTH
                    }
                  </Typography>
                </div>
              </div>
            )}
          />

          {/* --------------------------------------------------------------- */}
          {/* Status */}
          {/* --------------------------------------------------------------- */}

          <Controller
            name='status'
            control={control}
            rules={{
              required:
                'Status kategori wajib dipilih.'
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                select
                fullWidth
                label={
                  <span>
                    Status Kategori{' '}
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
                error={!!errors.status}
                helperText={
                  errors.status?.message ??
                  'Kategori aktif dapat digunakan pada pelatihan baru.'
                }
                FormHelperTextProps={{
                  sx: {
                    color: errors.status
                      ? 'error.main'
                      : 'text.secondary'
                  }
                }}
              >
                <MenuItem value='active'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center bs-7 is-7 rounded-full bg-successLight'>
                      <i className='tabler-check text-sm text-success' />
                    </div>

                    <div className='flex flex-col'>
                      <Typography
                        variant='body2'
                        className='font-medium'
                      >
                        Aktif
                      </Typography>

                      <Typography
                        variant='caption'
                        color='text.secondary'
                      >
                        Dapat digunakan
                      </Typography>
                    </div>
                  </div>
                </MenuItem>

                <MenuItem value='inactive'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center bs-7 is-7 rounded-full bg-actionHover'>
                      <i className='tabler-minus text-sm text-textSecondary' />
                    </div>

                    <div className='flex flex-col'>
                      <Typography
                        variant='body2'
                        className='font-medium'
                      >
                        Nonaktif
                      </Typography>

                      <Typography
                        variant='caption'
                        color='text.secondary'
                      >
                        Tidak tersedia
                      </Typography>
                    </div>
                  </div>
                </MenuItem>
              </CustomTextField>
            )}
          />

          {/* --------------------------------------------------------------- */}
          {/* Info */}
          {/* --------------------------------------------------------------- */}

          <div className='flex items-start gap-3 rounded-xl border border-divider p-4'>
            <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-primaryLight shrink-0'>
              <i className='tabler-info-circle text-primary' />
            </div>

            <div className='min-is-0'>
              <Typography
                variant='body2'
                className='font-medium mbe-1'
              >
                Tentang kategori
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kategori digunakan untuk
                mengelompokkan program pelatihan
                dan menjadi dasar analitik minat
                peserta.
              </Typography>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Actions */}
          {/* --------------------------------------------------------------- */}

          <div className='flex items-center gap-3 mbs-2'>
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
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
                  : 'Tambah Kategori'}
            </Button>

            <Button
              variant='tonal'
              color='secondary'
              type='button'
              disabled={isSubmitting}
              onClick={handleReset}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddCategoryDrawer

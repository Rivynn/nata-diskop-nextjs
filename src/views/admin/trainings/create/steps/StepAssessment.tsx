
'use client'

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'

type StepItem = {
  title: string
  subtitle: string
  icon: string
}

type GradeRange = {
  id: string
  label: string
  min: number
  max: number
}

export type AssessmentForm = {
  enabled: boolean
  passingScore: number
  gradeRanges: GradeRange[]
  certificateEnabled: boolean
  certificateNote: string
}

type StepAssessmentProps = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: StepItem[]
  initialData?: AssessmentForm
  onDataChange?: (data: AssessmentForm) => void
}

const DEFAULT_GRADES: GradeRange[] = [
  { id: 'A', label: 'A', min: 85, max: 100 },
  { id: 'B+', label: 'B+', min: 80, max: 84 },
  { id: 'B', label: 'B', min: 75, max: 79 },
  { id: 'C+', label: 'C+', min: 70, max: 74 },
  { id: 'C', label: 'C', min: 60, max: 69 },
  { id: 'D', label: 'D', min: 50, max: 59 },
  { id: 'E', label: 'E', min: 0, max: 49 }
]

export const initialAssessment: AssessmentForm = {
  enabled: true,
  passingScore: 75,
  gradeRanges: DEFAULT_GRADES.map(grade => ({ ...grade })),
  certificateEnabled: true,
  certificateNote: ''
}

type GradeValidation = {
  valid: boolean
  errors: Record<string, string>
}

const validateGrades = (grades: GradeRange[]): GradeValidation => {
  const errors: Record<string, string> = {}

  if (grades.length === 0) {
    return {
      valid: false,
      errors: { grades: 'Minimal harus ada satu kategori nilai.' }
    }
  }

  const normalizedLabels = grades.map(grade =>
    grade.label.trim().toLowerCase()
  )

  if (normalizedLabels.some(label => !label)) {
    errors.grades = 'Semua kategori wajib memiliki label.'
  } else if (new Set(normalizedLabels).size !== normalizedLabels.length) {
    errors.grades = 'Label kategori nilai tidak boleh duplikat.'
  }

  for (const grade of grades) {
    if (
      !Number.isInteger(grade.min) ||
      !Number.isInteger(grade.max) ||
      grade.min < 0 ||
      grade.min > 100 ||
      grade.max < 0 ||
      grade.max > 100 ||
      grade.min > grade.max
    ) {
      errors[`grade-${grade.id}`] =
        'Rentang harus berupa bilangan bulat 0–100. Nilai minimum tidak boleh melebihi maksimum.'
    }
  }

  const sorted = [...grades].sort((a, b) => a.min - b.min)

  if (sorted[0]?.min !== 0) {
    errors.grades = 'Rentang nilai harus dimulai dari 0.'
  }

  if (sorted[sorted.length - 1]?.max !== 100) {
    errors.grades = 'Rentang nilai harus berakhir di 100.'
  }

  for (let index = 1; index < sorted.length; index++) {
    const previous = sorted[index - 1]
    const current = sorted[index]

    if (previous.min > previous.max || current.min > current.max) {
      continue
    }

    if (previous.max >= current.min) {
      errors[`grade-${current.id}`] =
        `Rentang bertabrakan dengan kategori ${previous.label}.`
    } else if (previous.max + 1 !== current.min) {
      errors[`grade-${current.id}`] =
        `Ada celah nilai antara ${previous.max} dan ${current.min}.`
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

const RequiredLabel = ({ children }: { children: string }) => (
  <Box component='span'>
    {children}
    <Box
      component='span'
      sx={{
        color: 'error.main',
        ml: 0.5,
        fontWeight: 700
      }}
    >
      *
    </Box>
  </Box>
)

const StepAssessment = ({
                          handleNext,
                          handlePrev,
                          initialData,
                          onDataChange
                        }: StepAssessmentProps) => {
  const [form, setForm] = useState<AssessmentForm>(() => ({
    ...initialAssessment,
    ...initialData,
    gradeRanges:
      initialData?.gradeRanges?.map(grade => ({ ...grade })) ??
      DEFAULT_GRADES.map(grade => ({ ...grade }))
  }))

  const [passingScoreInput, setPassingScoreInput] = useState(
    String(initialData?.passingScore ?? initialAssessment.passingScore)
  )

  const [rangeInputs, setRangeInputs] = useState<
    Record<string, { min: string; max: string }>
  >(() =>
    Object.fromEntries(
      (initialData?.gradeRanges ?? DEFAULT_GRADES).map(grade => [
        grade.id,
        { min: String(grade.min), max: String(grade.max) }
      ])
    )
  )

  const [formError, setFormError] = useState('')

  const gradeValidation = useMemo(
    () => validateGrades(form.gradeRanges),
    [form.gradeRanges]
  )

  const sortedGrades = useMemo(
    () => [...form.gradeRanges].sort((a, b) => b.min - a.min),
    [form.gradeRanges]
  )

  const passingScoreValid =
    Number.isInteger(form.passingScore) &&
    form.passingScore >= 0 &&
    form.passingScore <= 100

  const gradesValid = gradeValidation.valid

  const updateForm = <K extends keyof AssessmentForm>(
    field: K,
    value: AssessmentForm[K]
  ) => {
    const next = { ...form, [field]: value }

    setForm(next)
    onDataChange?.(next)
    setFormError('')
  }

  const updateGradeLabel = (id: string, label: string) => {
    const nextGrades = form.gradeRanges.map(grade =>
      grade.id === id ? { ...grade, label } : grade
    )

    updateForm('gradeRanges', nextGrades)
  }

  const updateGradeBoundary = (
    id: string,
    field: 'min' | 'max',
    rawValue: string
  ) => {
    setRangeInputs(previous => ({
      ...previous,
      [id]: {
        min: field === 'min' ? rawValue : previous[id]?.min ?? '',
        max: field === 'max' ? rawValue : previous[id]?.max ?? ''
      }
    }))

    if (rawValue.trim() === '') return

    const value = Number(rawValue)

    if (!Number.isInteger(value) || value < 0 || value > 100) return

    const ascending = [...form.gradeRanges].sort((a, b) => a.min - b.min)
    const index = ascending.findIndex(grade => grade.id === id)

    if (index < 0) return

    const proposed = ascending.map(grade => ({ ...grade }))
    const selected = proposed[index]

    if (field === 'min') {
      if (value > selected.max) return
      if (index === 0 && value !== 0) return

      selected.min = value

      if (index > 0) {
        proposed[index - 1].max = value - 1
      }
    } else {
      if (value < selected.min) return
      if (index === proposed.length - 1 && value !== 100) return

      selected.max = value

      if (index < proposed.length - 1) {
        proposed[index + 1].min = value + 1
      }
    }

    const nextGrades = proposed.map(grade => ({ ...grade }))
    const next = { ...form, gradeRanges: nextGrades }

    setForm(next)
    onDataChange?.(next)

    setRangeInputs(
      Object.fromEntries(
        nextGrades.map(grade => [
          grade.id,
          {
            min: String(grade.min),
            max: String(grade.max)
          }
        ])
      )
    )

    setFormError('')
  }

  const getGradeForScore = (score: number) =>
    form.gradeRanges.find(grade => score >= grade.min && score <= grade.max)

  const validateForm = () => {
    if (
      !Number.isInteger(form.passingScore) ||
      form.passingScore < 0 ||
      form.passingScore > 100
    ) {
      setFormError('Nilai minimal kelulusan harus berada pada rentang 0–100.')
      return false
    }

    if (form.enabled && !gradeValidation.valid) {
      setFormError(
        gradeValidation.errors.grades ??
        Object.values(gradeValidation.errors)[0] ??
        'Periksa kembali konfigurasi rentang nilai.'
      )
      return false
    }

    if (
      form.enabled &&
      form.gradeRanges.some(grade => !grade.label.trim())
    ) {
      setFormError('Semua kategori nilai wajib memiliki label.')
      return false
    }

    setFormError('')
    return true
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    onDataChange?.(form)
    handleNext()
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Stack spacing={4}>
        {/* Page header */}
        <Box>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant='h4' fontWeight={800} letterSpacing={-0.5}>
                Penilaian & Sertifikat
              </Typography>
              <Typography color='text.secondary' sx={{ mt: 1, maxWidth: 680 }}>
                Atur standar kelulusan, kategori nilai, dan kebijakan sertifikat
                untuk program pelatihan.
              </Typography>
            </Box>

            <Chip
              icon={<i className='tabler-settings-check' />}
              label='Konfigurasi Evaluasi'
              color='primary'
              variant='tonal'
            />
          </Stack>
        </Box>

        {formError && (
          <Alert severity='error' onClose={() => setFormError('')}>
            {formError}
          </Alert>
        )}

        {/* Assessment switch */}
        <Card
          variant='outlined'
          sx={{
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent='space-between'
              spacing={3}
            >
              <Stack direction='row' spacing={2} alignItems='center'>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2.5,
                    bgcolor: 'primary.lightOpacity',
                    color: 'primary.main'
                  }}
                >
                  <i className='tabler-chart-bar' style={{ fontSize: 25 }} />
                </Box>

                <Box>
                  <Typography variant='h6' fontWeight={700}>
                    Sistem Penilaian
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Tentukan apakah skor dan kategori nilai digunakan.
                  </Typography>
                </Box>
              </Stack>

              <FormControlLabel
                sx={{
                  m: 0,
                  px: 2,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
                control={
                  <Switch
                    checked={form.enabled}
                    onChange={event =>
                      updateForm('enabled', event.target.checked)
                    }
                  />
                }
                label={form.enabled ? 'Aktif' : 'Nonaktif'}
              />
            </Stack>
          </CardContent>
        </Card>

        {form.enabled && (
          <>
            {/* Passing score */}
            <Card variant='outlined' sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant='h6' fontWeight={700}>
                      Standar Kelulusan
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mt: 0.5 }}
                    >
                      Tetapkan skor minimum agar peserta dinyatakan lulus.
                    </Typography>
                  </Box>

                  <Grid container spacing={{ xs: 2.5, md: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type='number'
                        label={
                          <RequiredLabel>Nilai Minimal Kelulusan</RequiredLabel>
                        }
                        value={passingScoreInput}
                        onChange={event => {
                          const value = event.target.value
                          setPassingScoreInput(value)

                          if (value === '') {
                            updateForm('passingScore', -1)
                            return
                          }

                          const number = Number(value)

                          if (Number.isInteger(number)) {
                            updateForm('passingScore', number)
                          }
                        }}
                        error={!passingScoreValid}
                        helperText={
                          !passingScoreValid
                            ? 'Masukkan bilangan bulat dari 0 sampai 100.'
                            : 'Peserta dengan skor di bawah nilai ini dinyatakan tidak lulus.'
                        }
                        slotProps={{
                          htmlInput: { min: 0, max: 100, step: 1 }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            {/* Grade configuration */}
            <Card variant='outlined' sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Box>
                      <Typography variant='h6' fontWeight={700}>
                        Konfigurasi Rentang Nilai
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 0.5 }}
                      >
                        Setiap skor harus masuk tepat ke satu kategori, tanpa
                        tabrakan dan tanpa celah.
                      </Typography>
                    </Box>

                    <Chip
                      color={gradesValid ? 'success' : 'error'}
                      variant='tonal'
                      icon={
                        <i
                          className={
                            gradesValid
                              ? 'tabler-circle-check'
                              : 'tabler-alert-triangle'
                          }
                        />
                      }
                      label={gradesValid ? 'Rentang valid' : 'Rentang tidak valid'}
                    />
                  </Stack>

                  <Alert severity='info'>
                    Batas kategori yang bersebelahan akan disesuaikan otomatis.
                    Misalnya, jika nilai minimum A berubah menjadi 86, nilai
                    maksimum B+ menjadi 85.
                  </Alert>

                  {!gradesValid && (
                    <Alert severity='error'>
                      {gradeValidation.errors.grades ??
                        Object.values(gradeValidation.errors)[0] ??
                        'Periksa konfigurasi kategori nilai.'}
                    </Alert>
                  )}

                  <Stack spacing={2.5}>
                    {sortedGrades.map((grade, index) => {
                      const gradeError =
                        gradeValidation.errors[`grade-${grade.id}`]

                      const duplicateLabel = form.gradeRanges.some(
                        item =>
                          item.id !== grade.id &&
                          item.label.trim().toLowerCase() ===
                          grade.label.trim().toLowerCase()
                      )

                      return (
                        <Box
                          key={grade.id}
                          sx={{
                            p: { xs: 2.5, md: 3 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor:
                              gradeError || duplicateLabel
                                ? 'error.main'
                                : 'divider',
                            bgcolor:
                              gradeError || duplicateLabel
                                ? 'error.lighter'
                                : 'background.paper',
                            transition: 'border-color 160ms ease'
                          }}
                        >
                          <Stack spacing={2.5}>
                            <Stack
                              direction='row'
                              alignItems='center'
                              justifyContent='space-between'
                              spacing={2}
                            >
                              <Stack
                                direction='row'
                                spacing={1.5}
                                alignItems='center'
                              >
                                <Box
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    display: 'grid',
                                    placeItems: 'center',
                                    borderRadius: 2.5,
                                    bgcolor: 'primary.lightOpacity',
                                    color: 'primary.main',
                                    fontSize: 16,
                                    fontWeight: 800,
                                    flexShrink: 0
                                  }}
                                >
                                  {grade.label || '—'}
                                </Box>

                                <Box>
                                  <Typography fontWeight={700}>
                                    Kategori {grade.label || 'Tanpa label'}
                                  </Typography>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
                                    {grade.min}–{grade.max}
                                  </Typography>
                                </Box>
                              </Stack>

                              <Chip
                                size='small'
                                label={
                                  gradeError || duplicateLabel
                                    ? 'Perlu diperbaiki'
                                    : 'Aktif'
                                }
                                color={
                                  gradeError || duplicateLabel
                                    ? 'error'
                                    : 'success'
                                }
                                variant='tonal'
                              />
                            </Stack>

                            <Grid
                              container
                              spacing={{ xs: 2.5, md: 3 }}
                              alignItems='flex-start'
                            >
                              <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                  fullWidth
                                  required
                                  label={
                                    <RequiredLabel>Label Kategori</RequiredLabel>
                                  }
                                  value={grade.label}
                                  onChange={event =>
                                    updateGradeLabel(
                                      grade.id,
                                      event.target.value
                                    )
                                  }
                                  error={!grade.label.trim() || duplicateLabel}
                                  helperText={
                                    duplicateLabel
                                      ? 'Label tidak boleh duplikat.'
                                      : 'Contoh: A, B+, B, C, D, E.'
                                  }
                                />
                              </Grid>

                              <Grid size={{ xs: 6, md: 4 }}>
                                <TextField
                                  fullWidth
                                  required
                                  type='number'
                                  label={
                                    <RequiredLabel>Nilai Minimum</RequiredLabel>
                                  }
                                  value={
                                    rangeInputs[grade.id]?.min ??
                                    String(grade.min)
                                  }
                                  onChange={event =>
                                    updateGradeBoundary(
                                      grade.id,
                                      'min',
                                      event.target.value
                                    )
                                  }
                                  error={Boolean(gradeError)}
                                  helperText={
                                    gradeError || 'Bilangan bulat 0–100.'
                                  }
                                  slotProps={{
                                    htmlInput: {
                                      min: 0,
                                      max: 100,
                                      step: 1
                                    }
                                  }}
                                />
                              </Grid>

                              <Grid size={{ xs: 6, md: 4 }}>
                                <TextField
                                  fullWidth
                                  required
                                  type='number'
                                  label={
                                    <RequiredLabel>Nilai Maksimum</RequiredLabel>
                                  }
                                  value={
                                    rangeInputs[grade.id]?.max ??
                                    String(grade.max)
                                  }
                                  onChange={event =>
                                    updateGradeBoundary(
                                      grade.id,
                                      'max',
                                      event.target.value
                                    )
                                  }
                                  error={Boolean(gradeError)}
                                  helperText={
                                    gradeError || 'Bilangan bulat 0–100.'
                                  }
                                  slotProps={{
                                    htmlInput: {
                                      min: 0,
                                      max: 100,
                                      step: 1
                                    }
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>

                  <Divider />

                  {/* Score preview */}
                  <Box>
                    <Typography variant='subtitle1' fontWeight={700}>
                      Pratinjau Kategori Nilai
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mt: 0.5, mb: 2.5 }}
                    >
                      Simulasi kategori dan status kelulusan untuk beberapa skor.
                    </Typography>

                    <Grid container spacing={2.5}>
                      {[100, 90, 85, 80, 75, 70, 60, 50, 40, 0].map(score => {
                        const grade = getGradeForScore(score)
                        const passed = score >= form.passingScore

                        return (
                          <Grid key={score} size={{ xs: 6, sm: 4, md: 3 }}>
                            <Box
                              sx={{
                                p: 2.5,
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2.5
                              }}
                            >
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Skor
                              </Typography>
                              <Typography
                                variant='h4'
                                fontWeight={800}
                                sx={{ my: 1 }}
                              >
                                {score}
                              </Typography>
                              <Typography variant='body2' sx={{ mb: 1.5 }}>
                                Kategori: <strong>{grade?.label ?? '—'}</strong>
                              </Typography>
                              <Chip
                                size='small'
                                variant='tonal'
                                color={passed ? 'success' : 'error'}
                                label={passed ? 'Lulus' : 'Tidak lulus'}
                              />
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </>
        )}

        {/* Certificate */}
        <Card variant='outlined' sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Stack direction='row' alignItems='center' spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2.5,
                    bgcolor: 'primary.lightOpacity',
                    color: 'primary.main'
                  }}
                >
                  <i className='tabler-certificate' style={{ fontSize: 25 }} />
                </Box>

                <Box>
                  <Typography variant='h6' fontWeight={700}>
                    Sertifikat
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Atur kebijakan penerbitan sertifikat peserta.
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.certificateEnabled}
                    onChange={event =>
                      updateForm('certificateEnabled', event.target.checked)
                    }
                  />
                }
                label={
                  form.certificateEnabled
                    ? 'Program menyediakan sertifikat'
                    : 'Program tidak menyediakan sertifikat'
                }
              />

              {form.certificateEnabled && (
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label='Catatan Sertifikat'
                    placeholder='Tuliskan ketentuan khusus penerbitan sertifikat.'
                    value={form.certificateNote}
                    onChange={event =>
                      updateForm('certificateNote', event.target.value)
                    }
                    helperText='Opsional. Tidak wajib diisi.'
                  />
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Configuration summary */}
        <Card
          variant='outlined'
          sx={{
            borderRadius: 3,
            bgcolor: 'action.hover'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant='h6' fontWeight={700} sx={{ mb: 3 }}>
              Ringkasan Konfigurasi
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant='body2' color='text.secondary'>
                  Sistem penilaian
                </Typography>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                  {form.enabled ? 'Aktif' : 'Tidak digunakan'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant='body2' color='text.secondary'>
                  Nilai kelulusan
                </Typography>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                  {form.enabled
                    ? `${form.passingScore}/100`
                    : 'Tidak diterapkan'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant='body2' color='text.secondary'>
                  Sertifikat
                </Typography>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                  {form.certificateEnabled ? 'Disediakan' : 'Tidak disediakan'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Divider />

        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          justifyContent='space-between'
          spacing={2}
        >
          <Button
            type='button'
            variant='tonal'
            color='secondary'
            onClick={handlePrev}
            startIcon={<i className='tabler-arrow-left' />}
          >
            Kembali
          </Button>

          <Button
            type='submit'
            variant='contained'
            disabled={
              (form.enabled && !gradesValid) || !passingScoreValid
            }
            endIcon={<i className='tabler-arrow-right' />}
            sx={{
              minWidth: { sm: 200 },
              fontWeight: 700
            }}
          >
            Lanjut ke Ringkasan
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

export default StepAssessment

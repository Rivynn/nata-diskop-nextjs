'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import CustomTextField from '@core/components/mui/TextField'

type StepItem = {
  title: string
  subtitle: string
  icon: string
}

type StoredMedia = {
  file?: File
  name?: string
  preview?: string
  url?: string
}

type PromotionSettings = {
  bannerShortDescription: string
  promotionDescription: string
  isPublished: boolean
  isFeatured: boolean
}

export type StepMediaData = {
  cover: StoredMedia | null
  banner: StoredMedia | null
  promotion: PromotionSettings & {
    descriptionSource: 'custom' | 'training_description' | 'empty'
  }
}

type MediaFile = {
  file: File
  preview: string
}

type StepMediaProps = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: StepItem[]
  trainingDescription?: string
  initialData?: Partial<StepMediaData>
  onDataChange?: (data: StepMediaData) => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const SHORT_DESCRIPTION_LIMIT = 140
const PROMOTION_DESCRIPTION_LIMIT = 1000

const getPreview = (media?: StoredMedia | null) =>
  media?.preview || media?.url || ''

const getFileName = (media?: StoredMedia | null) =>
  media?.file?.name || media?.name || ''

const getMediaState = (media?: StoredMedia | null): MediaFile | null => {
  if (!media?.file || !getPreview(media)) return null

  return {
    file: media.file,
    preview: getPreview(media)
  }
}

const StepMedia = ({
                     activeStep,
                     handleNext,
                     handlePrev,
                     trainingDescription = '',
                     initialData,
                     onDataChange
                   }: StepMediaProps) => {
  const [cover, setCover] = useState<MediaFile | null>(
    () => getMediaState(initialData?.cover)
  )

  const [banner, setBanner] = useState<MediaFile | null>(
    () => getMediaState(initialData?.banner)
  )

  const [coverRemoved, setCoverRemoved] = useState(false)
  const [bannerRemoved, setBannerRemoved] = useState(false)

  const [promotion, setPromotion] = useState<PromotionSettings>({
    bannerShortDescription:
      initialData?.promotion?.bannerShortDescription ?? '',
    promotionDescription:
      initialData?.promotion?.promotionDescription ?? '',
    isPublished: initialData?.promotion?.isPublished ?? false,
    isFeatured: initialData?.promotion?.isFeatured ?? false
  })

  const [errors, setErrors] = useState<{
    cover?: string
    banner?: string
  }>({})

  const coverInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Penting: jangan revoke preview di cleanup effect biasa.
  // StepMedia dapat unmount saat pindah ke Review, sedangkan Review
  // masih membutuhkan URL blob tersebut untuk menampilkan gambar.

  const updatePromotion = <K extends keyof PromotionSettings>(
    field: K,
    value: PromotionSettings[K]
  ) => {
    setPromotion(previous => ({
      ...previous,
      [field]: value
    }))
  }

  const createMedia = (
    event: ChangeEvent<HTMLInputElement>,
    field: 'cover' | 'banner'
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors(previous => ({
        ...previous,
        [field]: 'Format file harus JPG, PNG, atau WebP.'
      }))
      event.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors(previous => ({
        ...previous,
        [field]: 'Ukuran file maksimal 5 MB.'
      }))
      event.target.value = ''
      return
    }

    const media: MediaFile = {
      file,
      preview: URL.createObjectURL(file)
    }

    setErrors(previous => ({
      ...previous,
      [field]: undefined
    }))

    if (field === 'cover') {
      setCover(media)
      setCoverRemoved(false)
    } else {
      setBanner(media)
      setBannerRemoved(false)
    }

    event.target.value = ''
  }

  const removeMedia = (field: 'cover' | 'banner') => {
    if (field === 'cover') {
      setCover(null)
      setCoverRemoved(true)
    } else {
      setBanner(null)
      setBannerRemoved(true)
    }

    setErrors(previous => ({
      ...previous,
      [field]: undefined
    }))
  }

  const resolvedPromotionDescription =
    promotion.promotionDescription.trim() ||
    trainingDescription.trim().slice(0, PROMOTION_DESCRIPTION_LIMIT)

  const resolvedBannerDescription =
    promotion.bannerShortDescription.trim() ||
    resolvedPromotionDescription.slice(0, SHORT_DESCRIPTION_LIMIT)

  const buildPayload = (): StepMediaData => ({
    cover: cover
      ? {
        file: cover.file,
        name: cover.file.name,
        preview: cover.preview
      }
      : coverRemoved
        ? null
        : initialData?.cover ?? null,

    banner: banner
      ? {
        file: banner.file,
        name: banner.file.name,
        preview: banner.preview
      }
      : bannerRemoved
        ? null
        : initialData?.banner ?? null,

    promotion: {
      ...promotion,
      bannerShortDescription: promotion.bannerShortDescription.trim(),
      promotionDescription: resolvedPromotionDescription,
      descriptionSource: promotion.promotionDescription.trim()
        ? 'custom'
        : trainingDescription.trim()
          ? 'training_description'
          : 'empty'
    }
  })

  // Sinkronisasi otomatis ke parent supaya Review juga mendapat
  // perubahan terbaru, tidak hanya ketika tombol Next ditekan.
  useEffect(() => {
    onDataChange?.(buildPayload())
    // buildPayload membaca state terbaru setiap kali dependensi berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cover,
    banner,
    coverRemoved,
    bannerRemoved,
    promotion,
    trainingDescription,
    onDataChange
  ])

  const handleNextStep = () => {
    onDataChange?.(buildPayload())
    handleNext()
  }

  const coverPreview = cover?.preview ||
    (coverRemoved ? '' : getPreview(initialData?.cover))

  const bannerPreview = banner?.preview ||
    (bannerRemoved ? '' : getPreview(initialData?.banner))

  const coverName = cover?.file.name ||
    (coverRemoved ? '' : getFileName(initialData?.cover))

  const bannerName = banner?.file.name ||
    (bannerRemoved ? '' : getFileName(initialData?.banner))

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant='h5' sx={{ mb: 1 }}>
          Visual & Promosi
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Atur cover, banner, dan informasi promosi program pelatihan.
        </Typography>
      </Box>

      <Alert severity='info'>
        Pengaturan visual bersifat opsional. Gambar yang dipilih akan diteruskan
        ke ringkasan program.
      </Alert>

      <Divider />

      {/* COVER */}
      <Box>
        <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
          <Typography variant='h6'>Cover Program</Typography>
          <Chip label='Opsional' size='small' variant='tonal' />
        </Stack>

        <Card variant='outlined' sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  border: '1px dashed',
                  borderColor: errors.cover ? 'error.main' : 'divider',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                {coverPreview ? (
                  <Box
                    component='img'
                    src={coverPreview}
                    alt='Cover program'
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Stack alignItems='center' spacing={1}>
                    <i className='tabler-photo' style={{ fontSize: 36 }} />
                    <Typography variant='body2' color='text.secondary'>
                      Belum ada cover
                    </Typography>
                  </Stack>
                )}
              </Box>

              {coverName && (
                <Typography variant='body2' color='text.secondary'>
                  <i className='tabler-file-image' /> {coverName}
                </Typography>
              )}

              <input
                ref={coverInputRef}
                hidden
                type='file'
                accept='image/jpeg,image/png,image/webp'
                onChange={event => createMedia(event, 'cover')}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant='contained'
                  startIcon={<i className='tabler-upload' />}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview ? 'Ganti Cover' : 'Upload Cover'}
                </Button>

                {coverPreview && (
                  <Button
                    color='error'
                    variant='tonal'
                    onClick={() => removeMedia('cover')}
                    startIcon={<i className='tabler-trash' />}
                  >
                    Hapus Cover
                  </Button>
                )}
              </Stack>

              <Typography variant='caption' color='text.secondary'>
                JPG, PNG, WebP. Maksimal 5 MB.
              </Typography>

              {errors.cover && (
                <Alert severity='error'>{errors.cover}</Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Divider />

      {/* BANNER */}
      <Box>
        <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
          <Typography variant='h6'>Banner Promosi</Typography>
          <Chip label='Opsional' size='small' variant='tonal' />
        </Stack>

        <Card variant='outlined' sx={{ overflow: 'hidden', borderRadius: 3 }}>
          <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
            <Typography variant='subtitle2'>Pratinjau Banner</Typography>
            <Typography variant='caption' color='text.secondary'>
              Tampilan banner program
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              minHeight: { xs: 230, sm: 280 },
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              p: { xs: 3, sm: 5 },
              color: '#fff',
              bgcolor: '#14243a',
              background: bannerPreview
                ? undefined
                : 'linear-gradient(125deg, #101828, #1e3a5f 55%, #0e7490)'
            }}
          >
            {bannerPreview && (
              <Box
                component='img'
                src={bannerPreview}
                alt='Banner promosi'
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: bannerPreview
                  ? 'linear-gradient(90deg, rgba(8,15,30,.85), rgba(8,15,30,.35))'
                  : 'transparent'
              }}
            />

            <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
              {promotion.isFeatured && (
                <Box>
                  <Chip
                    icon={<i className='tabler-star-filled' />}
                    label='PROGRAM UNGGULAN'
                    size='small'
                    sx={{ bgcolor: '#fbbf24', color: '#422006', fontWeight: 700 }}
                  />
                </Box>
              )}

              <Typography
                sx={{
                  fontSize: { xs: '1.6rem', sm: '2.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  overflowWrap: 'anywhere'
                }}
              >
                Program Pelatihan
              </Typography>

              <Typography
                variant='body2'
                sx={{
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,.92)',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere'
                }}
              >
                {resolvedBannerDescription ||
                  'Deskripsi singkat pelatihan akan ditampilkan di sini.'}
              </Typography>
            </Stack>
          </Box>

          <CardContent>
            <Stack spacing={2}>
              {bannerName && (
                <Typography variant='body2' color='text.secondary'>
                  <i className='tabler-file-image' /> {bannerName}
                </Typography>
              )}

              <input
                ref={bannerInputRef}
                hidden
                type='file'
                accept='image/jpeg,image/png,image/webp'
                onChange={event => createMedia(event, 'banner')}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant='contained'
                  startIcon={<i className='tabler-photo-up' />}
                  onClick={() => bannerInputRef.current?.click()}
                >
                  {bannerPreview ? 'Ganti Banner' : 'Upload Banner'}
                </Button>

                {bannerPreview && (
                  <Button
                    color='error'
                    variant='tonal'
                    startIcon={<i className='tabler-trash' />}
                    onClick={() => removeMedia('banner')}
                  >
                    Hapus Banner
                  </Button>
                )}
              </Stack>

              <Typography variant='caption' color='text.secondary'>
                JPG, PNG, WebP. Maksimal 5 MB. Rasio yang disarankan 3:1.
              </Typography>

              {errors.banner && (
                <Alert severity='error'>{errors.banner}</Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Divider />

      {/* DESKRIPSI SINGKAT */}
      <Box>
        <Typography variant='h6' sx={{ mb: 1 }}>
          Deskripsi Singkat Banner
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Teks singkat yang ditampilkan pada banner.
        </Typography>

        <CustomTextField
          fullWidth
          multiline
          minRows={2}
          label='Deskripsi Singkat'
          placeholder='Tulis deskripsi singkat promosi...'
          value={promotion.bannerShortDescription}
          onChange={event =>
            updatePromotion(
              'bannerShortDescription',
              event.target.value.slice(0, SHORT_DESCRIPTION_LIMIT)
            )
          }
          inputProps={{ maxLength: SHORT_DESCRIPTION_LIMIT }}
          helperText={`${promotion.bannerShortDescription.length}/${SHORT_DESCRIPTION_LIMIT} karakter`}
        />
      </Box>

      <Divider />

      {/* DESKRIPSI PROMOSI */}
      <Box>
        <Typography variant='h6' sx={{ mb: 1 }}>
          Deskripsi Promosi
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Deskripsi lebih lengkap tentang manfaat dan daya tarik pelatihan.
        </Typography>

        <CustomTextField
          fullWidth
          multiline
          minRows={4}
          label='Deskripsi Lengkap Promosi'
          placeholder='Jelaskan manfaat dan materi yang akan dipelajari...'
          value={promotion.promotionDescription}
          onChange={event =>
            updatePromotion(
              'promotionDescription',
              event.target.value.slice(0, PROMOTION_DESCRIPTION_LIMIT)
            )
          }
          inputProps={{ maxLength: PROMOTION_DESCRIPTION_LIMIT }}
          helperText={`${promotion.promotionDescription.length}/${PROMOTION_DESCRIPTION_LIMIT} karakter`}
        />

        {!promotion.promotionDescription.trim() && (
          <Alert severity='info' sx={{ mt: 2 }}>
            {trainingDescription.trim()
              ? `Deskripsi pelatihan akan digunakan sebagai fallback: ${trainingDescription.trim().slice(0, 200)}${trainingDescription.trim().length > 200 ? '…' : ''}`
              : 'Deskripsi pelatihan belum tersedia.'}
          </Alert>
        )}
      </Box>

      <Divider />

      {/* STATUS */}
      <Box>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Status Program
        </Typography>

        <Stack spacing={2}>
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                spacing={2}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant='subtitle1'>
                    Publikasikan Program
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Aktifkan jika program siap ditampilkan kepada publik.
                  </Typography>
                </Box>

                <Switch
                  checked={promotion.isPublished}
                  onChange={event =>
                    updatePromotion('isPublished', event.target.checked)
                  }
                />
              </Stack>
            </CardContent>
          </Card>

          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                spacing={2}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant='subtitle1'>
                    Program Unggulan
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Beri penanda khusus pada program pilihan.
                  </Typography>
                </Box>

                <Switch
                  checked={promotion.isFeatured}
                  onChange={event =>
                    updatePromotion('isFeatured', event.target.checked)
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Divider />

      {/* RINGKASAN */}
      <Box
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3
        }}
      >
        <Typography variant='subtitle1' fontWeight={700} sx={{ mb: 2 }}>
          Ringkasan Pengaturan
        </Typography>

        <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
          <Chip
            icon={<i className='tabler-photo' />}
            label={coverPreview ? 'Cover tersedia' : 'Tanpa cover'}
            color={coverPreview ? 'success' : 'default'}
            variant='tonal'
          />

          <Chip
            icon={<i className='tabler-layout-dashboard' />}
            label={bannerPreview ? 'Banner kustom' : 'Banner default'}
            color={bannerPreview ? 'success' : 'default'}
            variant='tonal'
          />

          <Chip
            label={promotion.isPublished ? 'Publikasi aktif' : 'Draft'}
            color={promotion.isPublished ? 'success' : 'default'}
            variant='tonal'
          />

          <Chip
            label={promotion.isFeatured ? 'Program unggulan' : 'Program reguler'}
            color={promotion.isFeatured ? 'warning' : 'default'}
            variant='tonal'
          />
        </Stack>
      </Box>

      <Divider />

      {/* NAVIGASI */}
      <Stack
        direction={{ xs: 'column-reverse', sm: 'row' }}
        justifyContent='space-between'
        spacing={2}
      >
        <Button
          variant='tonal'
          color='secondary'
          disabled={activeStep === 0}
          onClick={handlePrev}
          startIcon={<i className='tabler-arrow-left' />}
        >
          Kembali
        </Button>

        <Button
          variant='contained'
          onClick={handleNextStep}
          endIcon={<i className='tabler-arrow-right' />}
        >
          Simpan & Lanjut
        </Button>
      </Stack>
    </Stack>
  )
}

export default StepMedia

'use client'

import { useEffect, useMemo, useState } from 'react'

import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

// MUI
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

type Props = {
  open: boolean
  image: string | null
  onClose: () => void
  onComplete: (image: string) => void
}

type FlipState = {
  horizontal: boolean
  vertical: boolean
}

/* =========================================================
   IMAGE ROTATION
========================================================= */

const createRotatedImage = (
  imageSrc: string,
  rotation: number,
  flip: FlipState
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const radians = (rotation * Math.PI) / 180

      const sin = Math.abs(Math.sin(radians))
      const cos = Math.abs(Math.cos(radians))

      const rotatedWidth = Math.ceil(
        image.width * cos + image.height * sin
      )

      const rotatedHeight = Math.ceil(
        image.width * sin + image.height * cos
      )

      const canvas = document.createElement('canvas')

      canvas.width = rotatedWidth
      canvas.height = rotatedHeight

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(
          new Error('Canvas tidak tersedia.')
        )

        return
      }

      ctx.save()

      ctx.translate(
        rotatedWidth / 2,
        rotatedHeight / 2
      )

      ctx.rotate(radians)

      ctx.scale(
        flip.horizontal ? -1 : 1,
        flip.vertical ? -1 : 1
      )

      ctx.drawImage(
        image,
        -image.width / 2,
        -image.height / 2
      )

      ctx.restore()

      resolve(canvas)
    }

    image.onerror = () => {
      reject(
        new Error('Gagal memuat gambar.')
      )
    }

    image.src = imageSrc
  })
}

/* =========================================================
   CREATE CROPPED IMAGE
========================================================= */

const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  flip: FlipState
): Promise<string> => {
  const rotatedCanvas =
    await createRotatedImage(
      imageSrc,
      rotation,
      flip
    )

  const outputSize = Math.min(
    1200,
    Math.max(
      512,
      Math.round(
        Math.max(
          pixelCrop.width,
          pixelCrop.height
        )
      )
    )
  )

  const cropWidth = Math.max(
    1,
    Math.round(pixelCrop.width)
  )

  const cropHeight = Math.max(
    1,
    Math.round(pixelCrop.height)
  )

  // Paksa hasil menjadi square.
  const squareSize = Math.min(
    cropWidth,
    cropHeight
  )

  const sourceX =
    pixelCrop.x +
    (cropWidth - squareSize) / 2

  const sourceY =
    pixelCrop.y +
    (cropHeight - squareSize) / 2

  const canvas = document.createElement('canvas')

  canvas.width = outputSize
  canvas.height = outputSize

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error(
      'Canvas tidak tersedia.'
    )
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.clearRect(
    0,
    0,
    outputSize,
    outputSize
  )

  ctx.drawImage(
    rotatedCanvas,
    sourceX,
    sourceY,
    squareSize,
    squareSize,
    0,
    0,
    outputSize,
    outputSize
  )

  return canvas.toDataURL(
    'image/jpeg',
    0.94
  )
}

/* =========================================================
   HELPERS
========================================================= */

const normalizeRotation = (
  value: number
) => {
  return ((value % 360) + 360) % 360
}

/* =========================================================
   COMPONENT
========================================================= */

const ProfileImageCropDialog = ({
                                  open,
                                  image,
                                  onClose,
                                  onComplete
                                }: Props) => {
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0
  })

  const [zoom, setZoom] = useState(1)

  const [rotation, setRotation] = useState(0)

  const [flip, setFlip] = useState<FlipState>({
    horizontal: false,
    vertical: false
  })

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null)

  const [error, setError] = useState('')

  const [isProcessing, setIsProcessing] =
    useState(false)

  const rotationLabel = useMemo(() => {
    return `${normalizeRotation(rotation)}°`
  }, [rotation])

  /* =======================================================
     RESET WHEN OPENED
  ======================================================== */

  useEffect(() => {
    if (!open) return

    setCrop({
      x: 0,
      y: 0
    })

    setZoom(1)
    setRotation(0)

    setFlip({
      horizontal: false,
      vertical: false
    })

    setCroppedAreaPixels(null)
    setError('')
    setIsProcessing(false)
  }, [open, image])

  /* =======================================================
     RESET
  ======================================================== */

  const handleReset = () => {
    setCrop({
      x: 0,
      y: 0
    })

    setZoom(1)
    setRotation(0)

    setFlip({
      horizontal: false,
      vertical: false
    })

    setError('')
  }

  /* =======================================================
     ZOOM
  ======================================================== */

  const handleZoomIn = () => {
    setZoom(prev =>
      Math.min(
        3,
        Number((prev + 0.1).toFixed(1))
      )
    )
  }

  const handleZoomOut = () => {
    setZoom(prev =>
      Math.max(
        1,
        Number((prev - 0.1).toFixed(1))
      )
    )
  }

  /* =======================================================
     ROTATION
  ======================================================== */

  const handleRotateLeft = () => {
    setRotation(prev =>
      normalizeRotation(prev - 90)
    )
  }

  const handleRotateRight = () => {
    setRotation(prev =>
      normalizeRotation(prev + 90)
    )
  }

  /* =======================================================
     FLIP
  ======================================================== */

  const handleFlipHorizontal = () => {
    setFlip(prev => ({
      ...prev,
      horizontal: !prev.horizontal
    }))
  }

  const handleFlipVertical = () => {
    setFlip(prev => ({
      ...prev,
      vertical: !prev.vertical
    }))
  }

  /* =======================================================
     QUICK ROTATION
  ======================================================== */

  const handleQuickRotation = (
    value: number
  ) => {
    setRotation(value)
  }

  /* =======================================================
     CROP COMPLETE
  ======================================================== */

  const handleCropComplete = (
    _croppedArea: Area,
    croppedPixels: Area
  ) => {
    setCroppedAreaPixels(croppedPixels)
  }

  /* =======================================================
     GENERATE
  ======================================================== */

  const handleComplete = async () => {
    if (!image || !croppedAreaPixels) {
      setError(
        'Area foto belum siap. Silakan tunggu sebentar lalu coba lagi.'
      )

      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const croppedImage =
        await createCroppedImage(
          image,
          croppedAreaPixels,
          rotation,
          flip
        )

      onComplete(croppedImage)

      setCrop({
        x: 0,
        y: 0
      })

      setZoom(1)
      setRotation(0)

      setFlip({
        horizontal: false,
        vertical: false
      })

      setCroppedAreaPixels(null)
    } catch {
      setError(
        'Foto gagal diproses. Silakan coba lagi.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  /* =======================================================
     CLOSE
  ======================================================== */

  const handleClose = () => {
    if (isProcessing) return

    setCrop({
      x: 0,
      y: 0
    })

    setZoom(1)
    setRotation(0)

    setFlip({
      horizontal: false,
      vertical: false
    })

    setCroppedAreaPixels(null)
    setError('')

    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        sx: {
          overflow: 'hidden',
          borderRadius: 2
        }
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <DialogTitle className='pb-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <Typography
                variant='h5'
                className='font-semibold'
              >
                Sesuaikan Foto Pelatih
              </Typography>

              <Chip
                size='small'
                variant='tonal'
                color='primary'
                label='1 : 1'
              />
            </div>

            <Typography
              variant='body2'
              color='text.secondary'
              className='mt-1'
            >
              Atur posisi, ukuran, rotasi,
              dan orientasi foto sebelum
              digunakan sebagai foto profil pelatih.
            </Typography>
          </div>

          <IconButton
            onClick={handleClose}
            disabled={isProcessing}
            aria-label='Tutup'
          >
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <Divider />

      {/* =====================================================
          CROP AREA
      ====================================================== */}

      <DialogContent
        className='p-0'
        sx={{
          backgroundColor:
            'var(--mui-palette-background-default)'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: {
              xs: 300,
              sm: 400
            },
            overflow: 'hidden',
            background:
              'var(--mui-palette-background-default)'
          }}
        >
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape='round'
              showGrid
              restrictPosition
              objectFit='contain'
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={
                handleCropComplete
              }
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              left: 16,
              bottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pointerEvents: 'none'
            }}
          >
            <Chip
              size='small'
              icon={
                <i className='tabler-crop' />
              }
              label='Square 1 : 1'
              sx={{
                backgroundColor:
                  'rgba(0,0,0,.55)',
                color: '#fff',
                backdropFilter:
                  'blur(8px)'
              }}
            />
          </Box>
        </Box>

        {/* ===================================================
            CONTROLS
        ==================================================== */}

        <div className='px-6 py-5'>
          {error && (
            <Typography
              variant='body2'
              color='error'
              className='mb-4'
            >
              {error}
            </Typography>
          )}

          <div className='flex flex-col gap-6'>
            {/* ZOOM */}

            <div>
              <div className='mb-2 flex items-center justify-between'>
                <div>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    Zoom
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Perbesar atau perkecil
                    tampilan foto
                  </Typography>
                </div>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {zoom.toFixed(1)}x
                </Typography>
              </div>

              <div className='flex items-center gap-3'>
                <Tooltip title='Perkecil'>
                  <span>
                    <IconButton
                      size='small'
                      onClick={handleZoomOut}
                      disabled={zoom <= 1}
                    >
                      <i className='tabler-minus' />
                    </IconButton>
                  </span>
                </Tooltip>

                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(_, value) =>
                    setZoom(value as number)
                  }
                  aria-label='Zoom foto'
                />

                <Tooltip title='Perbesar'>
                  <span>
                    <IconButton
                      size='small'
                      onClick={handleZoomIn}
                      disabled={zoom >= 3}
                    >
                      <i className='tabler-plus' />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>

            {/* ROTATION */}

            <div>
              <div className='mb-2 flex items-center justify-between'>
                <div>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    Rotasi
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Luruskan posisi foto
                  </Typography>
                </div>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {rotationLabel}
                </Typography>
              </div>

              <Slider
                value={rotation}
                min={-180}
                max={180}
                step={1}
                onChange={(_, value) =>
                  setRotation(value as number)
                }
                aria-label='Rotasi foto'
              />

              <Stack
                direction='row'
                spacing={1}
                justifyContent='center'
                flexWrap='wrap'
                useFlexGap
                className='mt-2'
              >
                {[0, 90, 180, 270].map(
                  value => (
                    <Button
                      key={value}
                      size='small'
                      variant={
                        normalizeRotation(
                          rotation
                        ) === value
                          ? 'tonal'
                          : 'text'
                      }
                      onClick={() =>
                        handleQuickRotation(
                          value
                        )
                      }
                    >
                      {value}°
                    </Button>
                  )
                )}
              </Stack>
            </div>

            {/* TOOLS */}

            <div>
              <Typography
                variant='body2'
                className='mb-3 font-medium'
              >
                Penyesuaian
              </Typography>

              <Stack
                direction='row'
                spacing={1}
                flexWrap='wrap'
                useFlexGap
              >
                <Tooltip title='Putar kiri 90°'>
                  <Button
                    size='small'
                    variant='tonal'
                    color='secondary'
                    startIcon={
                      <i className='tabler-rotate-2' />
                    }
                    onClick={
                      handleRotateLeft
                    }
                  >
                    Putar Kiri
                  </Button>
                </Tooltip>

                <Tooltip title='Putar kanan 90°'>
                  <Button
                    size='small'
                    variant='tonal'
                    color='secondary'
                    startIcon={
                      <i className='tabler-rotate-clockwise-2' />
                    }
                    onClick={
                      handleRotateRight
                    }
                  >
                    Putar Kanan
                  </Button>
                </Tooltip>

                <Tooltip title='Balik kiri-kanan'>
                  <Button
                    size='small'
                    variant='tonal'
                    color='secondary'
                    startIcon={
                      <i className='tabler-flip-horizontal' />
                    }
                    onClick={
                      handleFlipHorizontal
                    }
                  >
                    Flip H
                  </Button>
                </Tooltip>

                <Tooltip title='Balik atas-bawah'>
                  <Button
                    size='small'
                    variant='tonal'
                    color='secondary'
                    startIcon={
                      <i className='tabler-flip-vertical' />
                    }
                    onClick={
                      handleFlipVertical
                    }
                  >
                    Flip V
                  </Button>
                </Tooltip>
              </Stack>
            </div>

            {/* STATUS */}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                padding: 2,
                borderRadius: 1.5,
                backgroundColor:
                  'var(--mui-palette-action-hover)'
              }}
            >
              <div className='flex items-center gap-2'>
                <i className='tabler-photo text-textSecondary' />

                <div>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    Foto Profil
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Rasio square 1:1
                  </Typography>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                {flip.horizontal && (
                  <Chip
                    size='small'
                    variant='tonal'
                    label='Flip H'
                  />
                )}

                {flip.vertical && (
                  <Chip
                    size='small'
                    variant='tonal'
                    label='Flip V'
                  />
                )}

                {rotation !== 0 && (
                  <Chip
                    size='small'
                    variant='tonal'
                    label={rotationLabel}
                  />
                )}
              </div>
            </Box>
          </div>
        </div>
      </DialogContent>

      <Divider />

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <DialogActions className='px-6 py-4'>
        <Button
          variant='text'
          color='secondary'
          startIcon={
            <i className='tabler-refresh' />
          }
          onClick={handleReset}
          disabled={isProcessing}
        >
          Reset
        </Button>

        <div className='flex flex-1 justify-end gap-2'>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
            disabled={isProcessing}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={handleComplete}
            disabled={
              isProcessing ||
              !image ||
              !croppedAreaPixels
            }
            startIcon={
              isProcessing ? (
                <i className='tabler-loader-2 animate-spin' />
              ) : (
                <i className='tabler-check' />
              )
            }
          >
            {isProcessing
              ? 'Memproses...'
              : 'Gunakan Foto'}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ProfileImageCropDialog

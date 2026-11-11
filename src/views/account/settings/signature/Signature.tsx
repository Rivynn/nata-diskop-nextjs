'use client'

// React Imports
import {
  useEffect,
  useRef,
  useState
} from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

/* =========================================================
   TYPES
========================================================= */

type SignatureVersion = {
  id: number
  version: number
  image: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

/* =========================================================
   CONSTANTS
========================================================= */

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 360

const DEFAULT_PEN_SIZE = 3

/* =========================================================
   HELPERS
========================================================= */

const getCurrentDate = () => {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  ).format(new Date())
}

/* =========================================================
   COMPONENT
========================================================= */

const Signature = () => {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    )

  const contextRef =
    useRef<CanvasRenderingContext2D | null>(
      null
    )

  const [isDrawing, setIsDrawing] =
    useState(false)

  const [penSize, setPenSize] =
    useState(DEFAULT_PEN_SIZE)

  const [signaturePreview, setSignaturePreview] =
    useState('')

  const [versions, setVersions] =
    useState<SignatureVersion[]>([])

  const [currentVersion, setCurrentVersion] =
    useState<number | null>(null)

  const [history, setHistory] =
    useState<string[]>([])

  const [historyIndex, setHistoryIndex] =
    useState(-1)

  /* =======================================================
     CANVAS INITIALIZATION
  ======================================================= */

  useEffect(() => {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return
    }

    const ratio =
      window.devicePixelRatio || 1

    canvas.width =
      CANVAS_WIDTH * ratio

    canvas.height =
      CANVAS_HEIGHT * ratio

    canvas.style.width =
      `${CANVAS_WIDTH}px`

    canvas.style.height =
      `${CANVAS_HEIGHT}px`

    const context =
      canvas.getContext('2d')

    if (!context) {
      return
    }

    context.scale(
      ratio,
      ratio
    )

    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle =
      '#263238'
    context.lineWidth =
      DEFAULT_PEN_SIZE

    contextRef.current =
      context

    saveCanvasState()
  }, [])

  /* =======================================================
     UPDATE PEN
  ======================================================= */

  useEffect(() => {
    if (
      contextRef.current
    ) {
      contextRef.current.lineWidth =
        penSize
    }
  }, [penSize])

  /* =======================================================
     CANVAS POSITION
  ======================================================= */

  const getCanvasPosition = (
    event:
      | React.PointerEvent<HTMLCanvasElement>
      | React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return {
        x: 0,
        y: 0
      }
    }

    const rect =
      canvas.getBoundingClientRect()

    return {
      x:
        event.clientX -
        rect.left,
      y:
        event.clientY -
        rect.top
    }
  }

  /* =======================================================
     START DRAWING
  ======================================================= */

  const startDrawing = (
    event:
    React.PointerEvent<HTMLCanvasElement>
  ) => {
    const context =
      contextRef.current

    if (!context) {
      return
    }

    const {
      x,
      y
    } =
      getCanvasPosition(event)

    context.beginPath()
    context.moveTo(x, y)

    setIsDrawing(true)

    canvasRef.current?.setPointerCapture(
      event.pointerId
    )
  }

  /* =======================================================
     DRAW
  ======================================================= */

  const draw = (
    event:
    React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) {
      return
    }

    const context =
      contextRef.current

    if (!context) {
      return
    }

    const {
      x,
      y
    } =
      getCanvasPosition(event)

    context.lineTo(x, y)
    context.stroke()
  }

  /* =======================================================
     STOP DRAWING
  ======================================================= */

  const stopDrawing = (
    event:
    React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) {
      return
    }

    const context =
      contextRef.current

    if (!context) {
      return
    }

    context.closePath()

    setIsDrawing(false)

    try {
      canvasRef.current?.releasePointerCapture(
        event.pointerId
      )
    } catch {
      // Ignore pointer capture errors
    }

    saveCanvasState()
  }

  /* =======================================================
     CANVAS STATE
  ======================================================= */

  const getCanvasData = () => {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return ''
    }

    return canvas.toDataURL(
      'image/png'
    )
  }

  /* =======================================================
     SAVE HISTORY
  ======================================================= */

  const saveCanvasState = () => {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return
    }

    const image =
      canvas.toDataURL(
        'image/png'
      )

    setHistory(prev => {
      const next =
        prev.slice(
          0,
          historyIndex + 1
        )

      next.push(image)

      return next
    })

    setHistoryIndex(
      prev => prev + 1
    )
  }

  /* =======================================================
     RESTORE CANVAS
  ======================================================= */

  const restoreCanvas = (
    image: string
  ) => {
    const canvas =
      canvasRef.current

    const context =
      contextRef.current

    if (
      !canvas ||
      !context ||
      !image
    ) {
      return
    }

    const img =
      new Image()

    img.onload = () => {
      context.clearRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      )

      context.drawImage(
        img,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      )
    }

    img.src = image
  }

  /* =======================================================
     UNDO
  ======================================================= */

  const handleUndo = () => {
    if (
      historyIndex <= 0
    ) {
      return
    }

    const newIndex =
      historyIndex - 1

    setHistoryIndex(
      newIndex
    )

    restoreCanvas(
      history[newIndex]
    )
  }

  /* =======================================================
     REDO
  ======================================================= */

  const handleRedo = () => {
    if (
      historyIndex >=
      history.length - 1
    ) {
      return
    }

    const newIndex =
      historyIndex + 1

    setHistoryIndex(
      newIndex
    )

    restoreCanvas(
      history[newIndex]
    )
  }

  /* =======================================================
     CLEAR
  ======================================================= */

  const handleClear = () => {
    const canvas =
      canvasRef.current

    const context =
      contextRef.current

    if (
      !canvas ||
      !context
    ) {
      return
    }

    context.clearRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    saveCanvasState()

    setSignaturePreview('')
  }

  /* =======================================================
     SAVE SIGNATURE
  ======================================================= */

  const handleSave = () => {
    const image =
      getCanvasData()

    if (!image) {
      return
    }

    /*
     * MOCK VERSION
     *
     * Nanti:
     *
     * POST /api/admin/signature
     *
     * image:
     * - PNG transparent
     *
     * metadata:
     * - version
     * - createdAt
     * - updatedAt
     */

    const now =
      getCurrentDate()

    const nextVersion =
      versions.length + 1

    const newVersion: SignatureVersion =
      {
        id:
          Date.now(),
        version:
        nextVersion,
        image,
        createdAt:
        now,
        updatedAt:
        now,
        isActive:
          true
      }

    setVersions(prev =>
      prev.map(item => ({
        ...item,
        isActive:
          false
      }))
    )

    setVersions(prev => [
      ...prev.map(item => ({
        ...item,
        isActive:
          false
      })),
      newVersion
    ])

    setCurrentVersion(
      nextVersion
    )

    setSignaturePreview(
      image
    )
  }

  /* =======================================================
     ACTIVATE VERSION
  ======================================================= */

  const handleUseVersion = (
    version: SignatureVersion
  ) => {
    setVersions(prev =>
      prev.map(item => ({
        ...item,
        isActive:
          item.id === version.id
      }))
    )

    setCurrentVersion(
      version.version
    )

    setSignaturePreview(
      version.image
    )

    restoreCanvas(
      version.image
    )
  }

  /* =======================================================
     DELETE VERSION
  ======================================================= */

  const handleDeleteVersion = (
    id: number
  ) => {
    setVersions(prev =>
      prev.filter(
        item => item.id !== id
      )
    )
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className='flex flex-col gap-6'>
      {/* ===================================================
          HEADER
      ==================================================== */}

      <div>
        <Typography
          variant='h4'
          className='text-textPrimary font-semibold'
        >
          Tanda Tangan Digital
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          className='mt-1'
        >
          Buat dan kelola tanda tangan digital
          administrator untuk digunakan pada
          laporan dan dokumen resmi DISKOP.
        </Typography>
      </div>

      {/* ===================================================
          MAIN EDITOR
      ==================================================== */}

      <Grid
        container
        spacing={6}
      >
        {/* =================================================
            CANVAS
        ================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 8
          }}
        >
          <Card>
            <CardHeader
              title='Signature Studio'
              subheader='Gambar tanda tangan Anda pada area di bawah ini.'
              action={
                <Chip
                  label={
                    currentVersion
                      ? `Versi ${currentVersion}`
                      : 'Belum disimpan'
                  }
                  color={
                    currentVersion
                      ? 'success'
                      : 'secondary'
                  }
                  variant='tonal'
                  size='small'
                />
              }
            />

            <CardContent>
              {/* CANVAS AREA */}

              <div className='relative overflow-hidden rounded-xl border border-divider bg-white'>
                <div className='flex min-h-[360px] items-center justify-center overflow-x-auto p-4'>
                  <canvas
                    ref={canvasRef}
                    className='block cursor-crosshair touch-none'
                    onPointerDown={
                      startDrawing
                    }
                    onPointerMove={
                      draw
                    }
                    onPointerUp={
                      stopDrawing
                    }
                    onPointerCancel={
                      stopDrawing
                    }
                    onPointerLeave={
                      stopDrawing
                    }
                  />
                </div>

                {/* BASELINE */}

                <div className='pointer-events-none absolute bottom-[78px] left-8 right-8 border-b border-dashed border-gray-300' />

                <div className='pointer-events-none absolute bottom-8 left-8 text-xs text-gray-400'>
                  Area tanda tangan
                </div>
              </div>

              {/* TOOLBAR */}

              <div className='mt-5 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                  <Tooltip title='Undo'>
                    <span>
                      <CustomIconButton
                        variant='tonal'
                        color='secondary'
                        disabled={
                          historyIndex <=
                          0
                        }
                        onClick={
                          handleUndo
                        }
                      >
                        <i className='tabler-arrow-back-up' />
                      </CustomIconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title='Redo'>
                    <span>
                      <CustomIconButton
                        variant='tonal'
                        color='secondary'
                        disabled={
                          historyIndex >=
                          history.length -
                          1
                        }
                        onClick={
                          handleRedo
                        }
                      >
                        <i className='tabler-arrow-forward-up' />
                      </CustomIconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title='Hapus tanda tangan'>
                    <CustomIconButton
                      variant='tonal'
                      color='error'
                      onClick={
                        handleClear
                      }
                    >
                      <i className='tabler-trash' />
                    </CustomIconButton>
                  </Tooltip>
                </div>

                {/* PEN SIZE */}

                <div className='flex min-w-[220px] items-center gap-3'>
                  <i className='tabler-pencil text-textSecondary' />

                  <Slider
                    value={
                      penSize
                    }
                    min={1}
                    max={8}
                    step={1}
                    onChange={(
                      _,
                      value
                    ) =>
                      setPenSize(
                        value as number
                      )
                    }
                    size='small'
                  />

                  <Typography
                    variant='body2'
                    className='min-w-[32px] text-center'
                  >
                    {penSize}px
                  </Typography>
                </div>
              </div>

              {/* ACTIONS */}

              <div className='mt-5 flex flex-wrap justify-end gap-3'>
                <Button
                  variant='tonal'
                  color='secondary'
                  onClick={
                    handleClear
                  }
                >
                  Bersihkan
                </Button>

                <Button
                  variant='contained'
                  startIcon={
                    <i className='tabler-device-floppy' />
                  }
                  onClick={
                    handleSave
                  }
                >
                  Simpan Tanda Tangan
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* =================================================
            PREVIEW
        ================================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 4
          }}
        >
          <Card className='h-full'>
            <CardHeader
              title='Preview'
              subheader='Tampilan tanda tangan pada dokumen.'
            />

            <CardContent>
              <div className='flex min-h-[240px] flex-col justify-between rounded-xl border border-divider bg-white p-6'>
                <div>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Menyetujui,
                  </Typography>
                </div>

                <div className='flex flex-col items-center'>
                  {signaturePreview ? (
                    <img
                      src={
                        signaturePreview
                      }
                      alt='Preview tanda tangan'
                      className='max-h-[100px] max-w-full object-contain'
                    />
                  ) : (
                    <div className='flex h-[100px] items-center justify-center'>
                      <Typography
                        variant='body2'
                        color='text.disabled'
                      >
                        Tanda tangan belum
                        tersedia
                      </Typography>
                    </div>
                  )}

                  <div className='mt-3 w-full border-t border-gray-300 pt-2 text-center'>
                    <Typography
                      variant='body2'
                      className='text-textPrimary font-medium'
                    >
                      Administrator DISKOP
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      Pemerintah Kota
                      Banjarbaru
                    </Typography>
                  </div>
                </div>
              </div>

              {/* STATUS */}

              <div className='mt-5 flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 p-4'>
                <i className='tabler-shield-check text-success' />

                <div>
                  <Typography className='text-textPrimary font-medium'>
                    Tanda tangan siap digunakan
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    Versi aktif akan digunakan
                    secara otomatis ketika
                    administrator membuat
                    laporan resmi.
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* =================================================
            VERSION HISTORY
        ================================================== */}

        <Grid
          size={{
            xs: 12
          }}
        >
          <Card>
            <CardHeader
              title='Riwayat Tanda Tangan'
              subheader='Setiap perubahan tanda tangan disimpan sebagai versi baru.'
              action={
                <Chip
                  label={`${versions.length} Versi`}
                  color='secondary'
                  variant='tonal'
                  size='small'
                />
              }
            />

            <CardContent>
              {versions.length ===
              0 ? (
                <div className='flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-divider'>
                  <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                    <i className='tabler-signature text-2xl text-primary' />
                  </div>

                  <Typography className='text-textPrimary font-medium'>
                    Belum ada versi
                    tanda tangan
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className='mt-1'
                  >
                    Simpan tanda tangan
                    pertama Anda untuk
                    membuat versi.
                  </Typography>
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {versions
                    .slice()
                    .reverse()
                    .map(
                      version => (
                        <div
                          key={
                            version.id
                          }
                          className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-divider p-4'
                        >
                          {/* PREVIEW */}

                          <div className='flex min-w-0 flex-1 items-center gap-4'>
                            <div className='flex h-[80px] w-[150px] shrink-0 items-center justify-center rounded-lg border border-divider bg-white p-2'>
                              <img
                                src={
                                  version.image
                                }
                                alt={`Tanda tangan versi ${version.version}`}
                                className='max-h-full max-w-full object-contain'
                              />
                            </div>

                            <div className='min-w-0'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <Typography className='text-textPrimary font-medium'>
                                  Versi{' '}
                                  {
                                    version.version
                                  }
                                </Typography>

                                {version.isActive && (
                                  <Chip
                                    label='Aktif'
                                    color='success'
                                    variant='tonal'
                                    size='small'
                                  />
                                )}
                              </div>

                              <Typography
                                variant='body2'
                                color='text.secondary'
                                className='mt-1'
                              >
                                Dibuat{' '}
                                {
                                  version.createdAt
                                }
                              </Typography>

                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Diubah{' '}
                                {
                                  version.updatedAt
                                }
                              </Typography>
                            </div>
                          </div>

                          {/* ACTIONS */}

                          <div className='flex items-center gap-2'>
                            {!version.isActive && (
                              <Button
                                variant='tonal'
                                color='primary'
                                size='small'
                                startIcon={
                                  <i className='tabler-check' />
                                }
                                onClick={() =>
                                  handleUseVersion(
                                    version
                                  )
                                }
                              >
                                Gunakan
                              </Button>
                            )}

                            <Tooltip title='Hapus versi'>
                              <span>
                                <IconButton
                                  color='error'
                                  onClick={() =>
                                    handleDeleteVersion(
                                      version.id
                                    )
                                  }
                                >
                                  <i className='tabler-trash' />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </div>
                        </div>
                      )
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Signature

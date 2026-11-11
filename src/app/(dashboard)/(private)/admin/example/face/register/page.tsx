'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import * as faceapi from 'face-api.js'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { loadFaceModels } from '@/libs/face/face-api'
import {
  clearFaceDescriptors,
  getFaceDescriptors,
  saveFaceDescriptors
} from '@/libs/face/storage'

import styles from './RegisterFace.module.css'

type RegistrationStep = {
  id: 'front' | 'left' | 'right' | 'up' | 'down'
  label: string
  description: string
}

type Pose = {
  yaw: number
  pitch: number
}

type RegisterStatus =
  | 'loading'
  | 'scanning'
  | 'analyzing'
  | 'countdown'
  | 'capturing'
  | 'captured'
  | 'complete'
  | 'error'

const STEPS: RegistrationStep[] = [
  {
    id: 'front',
    label: 'Hadap Lurus',
    description: 'Hadapkan wajah lurus ke kamera'
  },
  {
    id: 'left',
    label: 'Hadap Kiri',
    description: 'Putar kepala perlahan ke kiri'
  },
  {
    id: 'right',
    label: 'Hadap Kanan',
    description: 'Putar kepala perlahan ke kanan'
  },
  {
    id: 'up',
    label: 'Arahkan Ke Atas',
    description: 'Dongakkan kepala sedikit ke atas'
  },
  {
    id: 'down',
    label: 'Arahkan Ke Bawah',
    description: 'Tundukkan kepala sedikit ke bawah'
  }
]

const DETECTION_INTERVAL = 100

const REQUIRED_STABLE_SAMPLES = 6

const COUNTDOWN_SECONDS = 3

export default function FaceRegisterPage() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const detectionTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(null)

  const countdownTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(null)

  const detectingRef =
    useRef(false)

  const countdownRunningRef =
    useRef(false)

  const captureLockRef =
    useRef(false)

  const completedRef =
    useRef(false)

  const currentStepRef =
    useRef(0)

  const stableSamplesRef =
    useRef(0)

  const poseValidRef =
    useRef(false)

  const descriptorsRef =
    useRef<number[][]>([])

  const [status, setStatus] =
    useState<RegisterStatus>('loading')

  const [modelsLoading, setModelsLoading] =
    useState(true)

  const [cameraLoading, setCameraLoading] =
    useState(true)

  const [faceDetected, setFaceDetected] =
    useState(false)

  const [poseValid, setPoseValid] =
    useState(false)

  const [stablePercent, setStablePercent] =
    useState(0)

  const [countdown, setCountdown] =
    useState<number | null>(null)

  const [currentStep, setCurrentStep] =
    useState(0)

  const [capturedCount, setCapturedCount] =
    useState(0)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [captureFlash, setCaptureFlash] =
    useState(false)

  const [faceConfidence, setFaceConfidence] =
    useState(0)

  const currentStepData =
    STEPS[currentStep]

  const progress =
    (capturedCount / STEPS.length) * 100

  const isInitializing =
    modelsLoading || cameraLoading

  /*
   * =========================================================
   * CAMERA
   * =========================================================
   */

  const stopCamera = useCallback(() => {
    if (!streamRef.current) {
      return
    }

    streamRef.current
      .getTracks()
      .forEach(track => track.stop())

    streamRef.current = null
  }, [])

  const startCamera = useCallback(
    async () => {
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        throw new Error(
          'Browser tidak mendukung Camera API.'
        )
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: {
              ideal: 1280
            },
            height: {
              ideal: 720
            }
          },
          audio: false
        })

      streamRef.current = stream

      const video =
        videoRef.current

      if (!video) {
        throw new Error(
          'Video element tidak ditemukan.'
        )
      }

      video.srcObject = stream

      await new Promise<void>(
        resolve => {
          if (
            video.readyState >=
            HTMLMediaElement.HAVE_CURRENT_DATA
          ) {
            resolve()
            return
          }

          video.onloadedmetadata = () => {
            resolve()
          }
        }
      )

      await video.play()

      syncCanvasSize()

      setCameraLoading(false)
    },
    []
  )

  /*
   * =========================================================
   * CANVAS
   * =========================================================
   */

  const syncCanvasSize = () => {
    const video =
      videoRef.current

    const canvas =
      canvasRef.current

    if (!video || !canvas) {
      return
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return
    }

    canvas.width =
      video.videoWidth

    canvas.height =
      video.videoHeight
  }

  const clearCanvas = () => {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return
    }

    const context =
      canvas.getContext('2d')

    if (!context) {
      return
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    )
  }

  /*
   * =========================================================
   * FACE LANDMARK VISUALIZATION
   * =========================================================
   */

  const drawLandmarks = (
    result: faceapi.WithFaceLandmarks<
      faceapi.WithFaceDescriptor<
        faceapi.WithFaceDetection<{}>,
        faceapi.FaceLandmarks68
      >
    >
  ) => {
    const canvas =
      canvasRef.current

    const video =
      videoRef.current

    if (!canvas || !video) {
      return
    }

    const context =
      canvas.getContext('2d')

    if (!context) {
      return
    }

    const resized =
      faceapi.resizeResults(
        result,
        {
          width: video.videoWidth,
          height: video.videoHeight
        }
      )

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    )

    /*
     * face-api landmark coordinates mengikuti
     * video asli.
     */
    const points =
      resized.landmarks.positions

    context.save()

    context.fillStyle =
      poseValidRef.current
        ? 'rgba(16,185,129,.95)'
        : 'rgba(45,212,191,.85)'

    points.forEach(point => {
      context.beginPath()

      context.arc(
        point.x,
        point.y,
        2.1,
        0,
        Math.PI * 2
      )

      context.fill()
    })

    /*
     * Face bounding box
     */
    const box =
      resized.detection.box

    context.strokeStyle =
      poseValidRef.current
        ? 'rgba(16,185,129,.75)'
        : 'rgba(45,212,191,.55)'

    context.lineWidth = 2

    context.strokeRect(
      box.x,
      box.y,
      box.width,
      box.height
    )

    context.restore()
  }

  /*
   * =========================================================
   * POSE ANALYSIS
   * =========================================================
   */

  const averagePoint = (
    points: faceapi.Point[]
  ) => {
    if (!points.length) {
      return {
        x: 0,
        y: 0
      }
    }

    return {
      x:
        points.reduce(
          (sum, point) =>
            sum + point.x,
          0
        ) / points.length,

      y:
        points.reduce(
          (sum, point) =>
            sum + point.y,
          0
        ) / points.length
    }
  }

  const calculatePose = (
    result: faceapi.WithFaceLandmarks<any>
  ): Pose => {
    const landmarks =
      result.landmarks

    const leftEye =
      averagePoint(
        landmarks.getLeftEye()
      )

    const rightEye =
      averagePoint(
        landmarks.getRightEye()
      )

    const eyeCenter = {
      x:
        (leftEye.x +
          rightEye.x) /
        2,

      y:
        (leftEye.y +
          rightEye.y) /
        2
    }

    const eyeDistance =
      Math.max(
        Math.abs(
          rightEye.x -
          leftEye.x
        ),
        1
      )

    const nosePoints =
      landmarks.getNose()

    const nose =
      averagePoint(
        nosePoints.slice(2, 5)
      )

    const mouth =
      averagePoint(
        landmarks.getMouth()
      )

    const yaw =
      (nose.x -
        eyeCenter.x) /
      eyeDistance

    const faceHeight =
      Math.max(
        Math.abs(
          mouth.y -
          eyeCenter.y
        ),
        1
      )

    const pitch =
      (nose.y -
        eyeCenter.y) /
      faceHeight

    return {
      yaw,
      pitch
    }
  }

  const isPoseCorrect = (
    pose: Pose,
    stepIndex: number
  ) => {
    const step =
      STEPS[stepIndex]

    if (!step) {
      return false
    }

    const {
      yaw,
      pitch
    } = pose

    switch (step.id) {
      case 'front':
        return (
          Math.abs(yaw) < 0.08 &&
          pitch >= 0.40 &&
          pitch <= 0.60
        )

      case 'left':
        return (
          yaw > 0.12 &&
          pitch >= 0.32 &&
          pitch <= 0.68
        )

      case 'right':
        return (
          yaw < -0.12 &&
          pitch >= 0.32 &&
          pitch <= 0.68
        )

      case 'up':
        return (
          Math.abs(yaw) < 0.12 &&
          pitch < 0.40
        )

      case 'down':
        return (
          Math.abs(yaw) < 0.12 &&
          pitch > 0.60
        )

      default:
        return false
    }
  }

  /*
   * =========================================================
   * DETECTION CONTROL
   * =========================================================
   */

  const stopDetection = useCallback(() => {
    if (
      detectionTimerRef.current
    ) {
      clearInterval(
        detectionTimerRef.current
      )

      detectionTimerRef.current =
        null
    }

    if (
      countdownTimerRef.current
    ) {
      clearInterval(
        countdownTimerRef.current
      )

      countdownTimerRef.current =
        null
    }

    detectingRef.current =
      false

    countdownRunningRef.current =
      false
  }, [])

  const startDetection = useCallback(() => {
    stopDetection()

    detectionTimerRef.current =
      setInterval(
        () => {
          void runDetection()
        },
        DETECTION_INTERVAL
      )
  }, [stopDetection])

  /*
   * =========================================================
   * COUNTDOWN
   * =========================================================
   */

  const cancelCountdown = useCallback(() => {
    if (
      countdownTimerRef.current
    ) {
      clearInterval(
        countdownTimerRef.current
      )

      countdownTimerRef.current =
        null
    }

    countdownRunningRef.current =
      false

    setCountdown(null)

    stableSamplesRef.current =
      0

    setStablePercent(0)

    if (
      !completedRef.current
    ) {
      setStatus('scanning')
    }
  }, [])

  const startCountdown = useCallback(() => {
    if (
      countdownRunningRef.current ||
      captureLockRef.current ||
      completedRef.current
    ) {
      return
    }

    if (!poseValidRef.current) {
      return
    }

    countdownRunningRef.current =
      true

    setStatus('countdown')

    let value =
      COUNTDOWN_SECONDS

    setCountdown(value)

    countdownTimerRef.current =
      setInterval(
        () => {
          /*
           * AI berubah pikiran:
           * pose sudah tidak valid,
           * countdown langsung dibatalkan.
           */
          if (
            !poseValidRef.current
          ) {
            cancelCountdown()
            return
          }

          value -= 1

          if (value <= 0) {
            if (
              countdownTimerRef.current
            ) {
              clearInterval(
                countdownTimerRef.current
              )

              countdownTimerRef.current =
                null
            }

            countdownRunningRef.current =
              false

            setCountdown(null)

            void captureFace()

            return
          }

          setCountdown(value)
        },
        900
      )
  }, [cancelCountdown])

  /*
   * =========================================================
   * CAPTURE
   * =========================================================
   */

  const captureFace = async () => {
    if (
      captureLockRef.current ||
      completedRef.current
    ) {
      return
    }

    captureLockRef.current =
      true

    setStatus('capturing')

    try {
      const video =
        videoRef.current

      if (!video) {
        return
      }

      /*
       * Jangan percaya detection sebelumnya.
       * Scan ulang sebelum benar-benar menyimpan.
       */
      const result =
        await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 320,
                scoreThreshold: 0.5
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor()

      if (!result) {
        setStatus('scanning')

        return
      }

      const pose =
        calculatePose(result)

      const valid =
        isPoseCorrect(
          pose,
          currentStepRef.current
        )

      if (!valid) {
        poseValidRef.current =
          false

        setPoseValid(false)

        setStatus('scanning')

        return
      }

      /*
       * Ambil descriptor 128 dimensi.
       */
      const descriptor =
        Array.from(
          result.descriptor
        )

      const updatedDescriptors = [
        ...descriptorsRef.current,
        descriptor
      ]

      descriptorsRef.current =
        updatedDescriptors

      /*
       * Simpan langsung.
       */
      saveFaceDescriptors(
        updatedDescriptors
      )

      setCapturedCount(
        updatedDescriptors.length
      )

      setCaptureFlash(true)

      setStatus('captured')

      window.setTimeout(() => {
        setCaptureFlash(false)
      }, 550)

      /*
       * Semua angle selesai.
       */
      if (
        updatedDescriptors.length >=
        STEPS.length
      ) {
        completedRef.current =
          true

        stopDetection()

        setCurrentStep(
          STEPS.length - 1
        )

        setStatus('complete')

        clearCanvas()

        return
      }

      /*
       * Beri sedikit jeda sebelum pindah
       * ke pose berikutnya.
       */
      await wait(850)

      const nextStep =
        currentStepRef.current + 1

      currentStepRef.current =
        nextStep

      setCurrentStep(
        nextStep
      )

      stableSamplesRef.current =
        0

      setStablePercent(0)

      poseValidRef.current =
        false

      setPoseValid(false)

      setStatus('scanning')
    } catch (error) {
      console.error(
        'Face capture error:',
        error
      )

      setStatus('error')

      setErrorMessage(
        'Gagal mengambil biometric descriptor wajah.'
      )
    } finally {
      captureLockRef.current =
        false
    }
  }

  /*
   * =========================================================
   * AI DETECTION
   * =========================================================
   */

  const runDetection = async () => {
    if (
      detectingRef.current ||
      captureLockRef.current ||
      completedRef.current
    ) {
      return
    }

    const video =
      videoRef.current

    if (!video) {
      return
    }

    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA ||
      video.videoWidth === 0
    ) {
      return
    }

    detectingRef.current =
      true

    try {
      const result =
        await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 320,
                scoreThreshold: 0.5
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor()

      /*
       * Tidak ada wajah.
       */
      if (!result) {
        setFaceDetected(false)

        setFaceConfidence(0)

        setPoseValid(false)

        poseValidRef.current =
          false

        stableSamplesRef.current =
          0

        setStablePercent(0)

        clearCanvas()

        if (
          countdownRunningRef.current
        ) {
          cancelCountdown()
        }

        if (
          !captureLockRef.current
        ) {
          setStatus('scanning')
        }

        return
      }

      /*
       * Wajah ditemukan.
       */
      setFaceDetected(true)

      setFaceConfidence(
        result.detection.score
      )

      drawLandmarks(result)

      /*
       * AI menghitung pose.
       */
      const pose =
        calculatePose(result)

      const valid =
        isPoseCorrect(
          pose,
          currentStepRef.current
        )

      poseValidRef.current =
        valid

      setPoseValid(valid)

      /*
       * Pose salah.
       */
      if (!valid) {
        stableSamplesRef.current =
          0

        setStablePercent(0)

        if (
          countdownRunningRef.current
        ) {
          cancelCountdown()
        }

        setStatus('analyzing')

        return
      }

      /*
       * Pose benar.
       * Sekarang AI menunggu wajah stabil.
       */
      stableSamplesRef.current += 1

      const stability =
        Math.min(
          100,
          Math.round(
            (stableSamplesRef.current /
              REQUIRED_STABLE_SAMPLES) *
            100
          )
        )

      setStablePercent(
        stability
      )

      setStatus('analyzing')

      /*
       * Sudah cukup stabil ->
       * countdown otomatis.
       */
      if (
        stableSamplesRef.current >=
        REQUIRED_STABLE_SAMPLES &&
        !countdownRunningRef.current
      ) {
        startCountdown()
      }
    } catch (error) {
      console.error(
        'Face detection error:',
        error
      )
    } finally {
      detectingRef.current =
        false
    }
  }

  /*
   * =========================================================
   * INITIALIZATION
   * =========================================================
   */

  useEffect(() => {
    currentStepRef.current =
      currentStep
  }, [currentStep])

  useEffect(() => {
    const initialize =
      async () => {
        try {
          setStatus('loading')

          setModelsLoading(true)

          setCameraLoading(true)

          setErrorMessage('')

          /*
           * Resume jika sebelumnya
           * baru mengambil beberapa angle.
           */
          const storedDescriptors =
            getFaceDescriptors()

          descriptorsRef.current =
            storedDescriptors

          setCapturedCount(
            storedDescriptors.length
          )

          /*
           * Kalau sudah lengkap,
           * langsung tampilkan complete.
           */
          if (
            storedDescriptors.length >=
            STEPS.length
          ) {
            completedRef.current =
              true

            setCurrentStep(
              STEPS.length - 1
            )

            setModelsLoading(false)

            setCameraLoading(false)

            setStatus('complete')

            return
          }

          /*
           * Load Face API.
           */
          await loadFaceModels()

          setModelsLoading(false)

          /*
           * Camera.
           */
          await startCamera()

          setCameraLoading(false)

          /*
           * Resume dari angle terakhir.
           */
          const nextStep =
            Math.min(
              storedDescriptors.length,
              STEPS.length - 1
            )

          currentStepRef.current =
            nextStep

          setCurrentStep(
            nextStep
          )

          setStatus('scanning')

          startDetection()
        } catch (error) {
          console.error(
            'Face registration initialization error:',
            error
          )

          setModelsLoading(false)

          setCameraLoading(false)

          setStatus('error')

          setErrorMessage(
            'AI Face Recognition atau kamera tidak dapat diaktifkan.'
          )
        }
      }

    void initialize()

    return () => {
      stopDetection()
      stopCamera()
    }
  }, [
    startCamera,
    startDetection,
    stopCamera,
    stopDetection
  ])

  /*
   * =========================================================
   * RESIZE
   * =========================================================
   */

  useEffect(() => {
    const handleResize =
      () => {
        syncCanvasSize()
      }

    window.addEventListener(
      'resize',
      handleResize
    )

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      )
    }
  }, [])

  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const handleReset = async () => {
    stopDetection()

    clearFaceDescriptors()

    descriptorsRef.current = []

    currentStepRef.current =
      0

    stableSamplesRef.current =
      0

    poseValidRef.current =
      false

    completedRef.current =
      false

    captureLockRef.current =
      false

    setCapturedCount(0)

    setCurrentStep(0)

    setStablePercent(0)

    setCountdown(null)

    setFaceDetected(false)

    setPoseValid(false)

    setFaceConfidence(0)

    setCaptureFlash(false)

    setStatus('scanning')

    await wait(300)

    startDetection()
  }

  /*
   * =========================================================
   * RETRY
   * =========================================================
   */

  const handleRetry = async () => {
    stopDetection()

    stopCamera()

    setStatus('loading')

    setErrorMessage('')

    setModelsLoading(true)

    setCameraLoading(true)

    try {
      await loadFaceModels()

      setModelsLoading(false)

      await startCamera()

      setCameraLoading(false)

      setStatus('scanning')

      startDetection()
    } catch (error) {
      console.error(error)

      setModelsLoading(false)

      setCameraLoading(false)

      setStatus('error')

      setErrorMessage(
        'Kamera atau model AI tidak dapat dijalankan.'
      )
    }
  }

  const wait = (
    ms: number
  ) =>
    new Promise<void>(
      resolve => {
        setTimeout(
          resolve,
          ms
        )
      }
    )

  /*
   * =========================================================
   * UI STATUS
   * =========================================================
   */

  const getAIStatus = () => {
    if (modelsLoading) {
      return {
        title:
          'INITIALIZING AI ENGINE',
        description:
          'Memuat neural face recognition model...'
      }
    }

    if (cameraLoading) {
      return {
        title:
          'CONNECTING CAMERA',
        description:
          'Mengaktifkan kamera perangkat...'
      }
    }

    if (!faceDetected) {
      return {
        title:
          'SEARCHING FOR FACE',
        description:
          'Arahkan wajah ke dalam area panduan.'
      }
    }

    if (status === 'countdown') {
      return {
        title:
          'FACE POSITION LOCKED',
        description:
          'Posisi sesuai. Jangan bergerak.'
      }
    }

    if (status === 'capturing') {
      return {
        title:
          'CAPTURING BIOMETRIC',
        description:
          'AI sedang membuat face descriptor.'
      }
    }

    if (status === 'captured') {
      return {
        title:
          'BIOMETRIC CAPTURED',
        description:
          'Descriptor berhasil disimpan.'
      }
    }

    if (!poseValid) {
      return {
        title:
          'ANALYZING FACE POSE',
        description:
          currentStepData?.description ??
          'Menyesuaikan posisi wajah.'
      }
    }

    if (
      stablePercent < 100
    ) {
      return {
        title:
          'STABILIZING FACE',
        description:
          'Pertahankan posisi wajah.'
      }
    }

    return {
      title:
        'FACE POSITION READY',
      description:
        'Posisi wajah sesuai.'
    }
  }

  const aiStatus =
    getAIStatus()

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <Box className={styles.page}>
      <Box
        className={`${styles.backgroundGlow} ${styles.glowOne}`}
      />

      <Box
        className={`${styles.backgroundGlow} ${styles.glowTwo}`}
      />

      <Box className={styles.grid} />

      <Box className={styles.container}>
        {/* =================================================
            HEADER
        ================================================= */}

        <Box className={styles.header}>
          <Box className={styles.headerLeft}>
            <Typography
              component='div'
              className={styles.eyebrow}
            >
              DISKOP / BIOMETRIC
              REGISTRATION
            </Typography>

            <Typography
              component='h1'
              className={styles.title}
            >
              Register{' '}
              <span
                className={
                  styles.titleAccent
                }
              >
                Face Identity
              </span>
            </Typography>

            <Typography
              component='p'
              className={styles.subtitle}
            >
              Sistem akan menganalisis wajah
              secara otomatis dari beberapa
              sudut untuk membangun biometric
              profile yang lebih stabil.
            </Typography>
          </Box>

          <Box
            className={
              styles.headerStatus
            }
          >
            <span
              className={
                styles.statusDot
              }
            />

            {isInitializing
              ? 'AI INITIALIZING'
              : 'AI ENGINE READY'}
          </Box>
        </Box>

        {/* =================================================
            ERROR
        ================================================= */}

        {status === 'error' && (
          <Box
            className={
              styles.errorCard
            }
            sx={{ mb: 2 }}
          >
            <Typography
              className={
                styles.errorTitle
              }
            >
              BIOMETRIC SYSTEM ERROR
            </Typography>

            <Typography
              className={
                styles.errorText
              }
            >
              {errorMessage ||
                'Terjadi kesalahan pada sistem.'}
            </Typography>

            <Button
              onClick={
                handleRetry
              }
              sx={{
                mt: 2,
                minHeight: 34,
                borderRadius: 2,
                textTransform:
                  'none'
              }}
              variant='outlined'
              color='success'
            >
              Coba Lagi
            </Button>
          </Box>
        )}

        {/* =================================================
            COMPLETE
        ================================================= */}

        {status === 'complete' ? (
          <Box
            className={
              styles.completeCard
            }
          >
            <Typography
              className={
                styles.completeEyebrow
              }
            >
              BIOMETRIC PROFILE READY
            </Typography>

            <Typography
              component='h2'
              className={
                styles.completeTitle
              }
            >
              Wajah Berhasil
              Terdaftar
            </Typography>

            <Typography
              component='p'
              className={
                styles.completeText
              }
            >
              AI telah mengambil{' '}
              <strong>
                {capturedCount}
                {' '}
                biometric descriptors
              </strong>{' '}
              dari beberapa sudut wajah.
              Data tersimpan secara lokal
              dan siap digunakan untuk proses
              face recognition.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 2
              }}
            >
              <Chip
                label={`${capturedCount} ANGLES`}
                size='small'
                color='success'
                variant='outlined'
              />

              <Chip
                label='128D DESCRIPTOR'
                size='small'
                color='success'
                variant='outlined'
              />

              <Chip
                label='LOCAL STORAGE'
                size='small'
                color='success'
                variant='outlined'
              />
            </Box>

            <button
              type='button'
              className={
                styles.resetButton
              }
              onClick={
                handleReset
              }
            >
              DAFTAR ULANG WAJAH
            </button>
          </Box>
        ) : (
          <Box
            className={
              styles.layout
            }
          >
            {/* =================================================
                CAMERA
            ================================================= */}

            <Box
              className={
                styles.cameraCard
              }
            >
              <Box
                className={
                  styles.cameraHeader
                }
              >
                <Box
                  className={
                    styles.cameraHeaderLeft
                  }
                >
                  <Box
                    className={
                      styles.cameraIcon
                    }
                  >
                    AI
                  </Box>

                  <Box
                    className={
                      styles.cameraTitle
                    }
                  >
                    <strong>
                      Facial Vision
                    </strong>

                    <span>
                      REAL-TIME BIOMETRIC
                      ANALYSIS
                    </span>
                  </Box>
                </Box>

                <Box
                  className={
                    styles.cameraMeta
                  }
                >
                  <span
                    className={
                      styles.cameraMetaBadge
                    }
                  >
                    CAM_01
                  </span>

                  <span
                    className={
                      styles.cameraMetaBadge
                    }
                  >
                    1280 × 720
                  </span>
                </Box>
              </Box>

              <Box
                className={
                  styles.cameraViewport
                }
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={
                    styles.video
                  }
                />

                <canvas
                  ref={canvasRef}
                  className={
                    styles.aiCanvas
                  }
                />

                <Box
                  className={
                    styles.cameraLight
                  }
                />

                <Box
                  className={
                    styles.cameraGrid
                  }
                />

                {!isInitializing && (
                  <Box
                    className={
                      styles.scanLine
                    }
                  />
                )}

                {/* FACE GUIDE */}

                <Box
                  className={[
                    styles.faceGuide,
                    faceDetected
                      ? styles.faceGuideActive
                      : '',
                    status ===
                    'countdown'
                      ? styles.faceGuideCapturing
                      : ''
                  ].join(' ')}
                >
                  {faceDetected && (
                    <Box
                      className={
                        styles.faceLabel
                      }
                    >
                      FACE TRACKED
                    </Box>
                  )}

                  <Box
                    className={`${styles.guideCorner} ${styles.guideTopLeft}`}
                  />

                  <Box
                    className={`${styles.guideCorner} ${styles.guideTopRight}`}
                  />

                  <Box
                    className={`${styles.guideCorner} ${styles.guideBottomLeft}`}
                  />

                  <Box
                    className={`${styles.guideCorner} ${styles.guideBottomRight}`}
                  />
                </Box>

                {/* TOP CAMERA INFO */}

                <Box
                  className={
                    styles.cameraTopInfo
                  }
                >
                  <span>
                    LIVE VISION
                  </span>

                  <span>
                    FACE-API / 128D
                  </span>
                </Box>

                {/* BOTTOM CAMERA INFO */}

                <Box
                  className={
                    styles.cameraBottomInfo
                  }
                >
                  <span>
                    LOCAL PROCESSING
                  </span>

                  <span>
                    NO IMAGE UPLOAD
                  </span>

                  <span>
                    ENCRYPTED SESSION
                  </span>
                </Box>

                {/* AI STATUS */}

                {!isInitializing && (
                  <Box
                    className={
                      styles.aiStatus
                    }
                  >
                    <Typography
                      component='div'
                      className={
                        styles.aiStatusTitle
                      }
                    >
                      {aiStatus.title}
                    </Typography>

                    <Typography
                      component='div'
                      className={
                        styles.aiStatusDescription
                      }
                    >
                      {aiStatus.description}
                    </Typography>

                    {status !==
                      'countdown' &&
                      status !==
                      'capturing' && (
                        <Box
                          className={
                            styles.aiProcessing
                          }
                        >
                          <span
                            className={
                              styles.processingDot
                            }
                          />

                          <span
                            className={
                              styles.processingDot
                            }
                          />

                          <span
                            className={
                              styles.processingDot
                            }
                          />
                        </Box>
                      )}
                  </Box>
                )}

                {/* INITIALIZING */}

                {isInitializing && (
                  <Box
                    sx={{
                      position:
                        'absolute',
                      inset: 0,
                      zIndex: 30,
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      flexDirection:
                        'column',
                      gap: 2,
                      background:
                        'rgba(248,253,250,.82)',
                      backdropFilter:
                        'blur(7px)'
                    }}
                  >
                    <CircularProgress
                      size={38}
                      color='success'
                    />

                    <Typography
                      sx={{
                        fontFamily:
                          'monospace',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing:
                          1.5,
                        color:
                          '#198a68'
                      }}
                    >
                      {modelsLoading
                        ? 'LOADING AI MODEL'
                        : 'CONNECTING CAMERA'}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10,
                        color:
                          '#82978f'
                      }}
                    >
                      {modelsLoading
                        ? 'Menyiapkan neural face engine...'
                        : 'Menyiapkan kamera perangkat...'}
                    </Typography>
                  </Box>
                )}

                {/* COUNTDOWN */}

                {countdown !== null && (
                  <Box
                    className={
                      styles.countdown
                    }
                  >
                    <Box
                      className={
                        styles.countdownNumber
                      }
                    >
                      {countdown}
                    </Box>
                  </Box>
                )}

                {/* FLASH */}

                {captureFlash && (
                  <Box
                    className={
                      styles.captureFlash
                    }
                  />
                )}
              </Box>

              {/* CAMERA FOOTER */}

              <Box
                className={
                  styles.cameraFooter
                }
              >
                <Box
                  className={
                    styles.cameraFooterStatus
                  }
                >
                  <span
                    className={
                      styles.cameraFooterDot
                    }
                  />

                  AI VISION ACTIVE
                </Box>

                <span>
                  STEP{' '}
                  {String(
                    currentStep + 1
                  ).padStart(
                    2,
                    '0'
                  )}
                  {' / '}
                  {String(
                    STEPS.length
                  ).padStart(
                    2,
                    '0'
                  )}
                </span>

                <span>
                  {Math.round(
                    progress
                  )}
                  % COMPLETE
                </span>
              </Box>
            </Box>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Box
              className={
                styles.sidebar
              }
            >
              {/* STEPS */}

              <Box
                className={
                  styles.stepCard
                }
              >
                <Box
                  className={
                    styles.cardHeader
                  }
                >
                  <Box
                    className={
                      styles.cardHeaderText
                    }
                  >
                    <span
                      className={
                        styles.cardEyebrow
                      }
                    >
                      REGISTRATION
                      SEQUENCE
                    </span>

                    <Typography
                      component='h2'
                      className={
                        styles.cardTitle
                      }
                    >
                      Face Capture
                    </Typography>
                  </Box>

                  <Box
                    className={
                      styles.stepCounter
                    }
                  >
                    {String(
                      currentStep + 1
                    ).padStart(
                      2,
                      '0'
                    )}
                    {' / '}
                    {String(
                      STEPS.length
                    ).padStart(
                      2,
                      '0'
                    )}
                  </Box>
                </Box>

                <Box
                  className={
                    styles.steps
                  }
                >
                  {STEPS.map(
                    (
                      step,
                      index
                    ) => {
                      const completed =
                        index <
                        capturedCount

                      const active =
                        index ===
                        currentStep

                      return (
                        <Box
                          key={
                            step.id
                          }
                          className={[
                            styles.step,
                            active
                              ? styles.stepActive
                              : '',
                            completed
                              ? styles.stepCompleted
                              : ''
                          ].join(
                            ' '
                          )}
                        >
                          <Box
                            className={
                              styles.stepNumber
                            }
                          >
                            {completed
                              ? 'OK'
                              : String(
                                index +
                                1
                              ).padStart(
                                2,
                                '0'
                              )}
                          </Box>

                          <Box
                            className={
                              styles.stepContent
                            }
                          >
                            <span
                              className={
                                styles.stepLabel
                              }
                            >
                              {
                                step.label
                              }
                            </span>

                            <span
                              className={
                                styles.stepDescription
                              }
                            >
                              {
                                step.description
                              }
                            </span>
                          </Box>

                          <span
                            className={
                              styles.stepState
                            }
                          />
                        </Box>
                      )
                    }
                  )}
                </Box>
              </Box>

              {/* AI ANALYSIS */}

              <Box
                className={
                  styles.analysisCard
                }
              >
                <Box
                  className={
                    styles.analysisHeader
                  }
                >
                  <span
                    className={
                      styles.analysisTitle
                    }
                  >
                    AI ANALYSIS
                  </span>

                  <span
                    className={
                      styles.aiOnline
                    }
                  >
                    {isInitializing
                      ? 'BOOTING'
                      : 'ONLINE'}
                  </span>
                </Box>

                <Box
                  className={
                    styles.metrics
                  }
                >
                  <Metric
                    label='FACE'
                    value={
                      faceDetected
                        ? 'DETECTED'
                        : 'SEARCHING'
                    }
                    active={
                      faceDetected
                    }
                  />

                  <Metric
                    label='POSE'
                    value={
                      poseValid
                        ? 'CORRECT'
                        : 'ANALYZING'
                    }
                    active={
                      poseValid
                    }
                  />

                  <Metric
                    label='STABILITY'
                    value={`${stablePercent}%`}
                    active={
                      stablePercent >=
                      70
                    }
                  />

                  <Metric
                    label='CONFIDENCE'
                    value={
                      faceConfidence
                        ? `${Math.round(
                          faceConfidence *
                          100
                        )}%`
                        : '--'
                    }
                    active={
                      faceConfidence >
                      0.7
                    }
                  />
                </Box>

                <Box
                  className={
                    styles.progressWrapper
                  }
                >
                  <Box
                    className={
                      styles.progressTop
                    }
                  >
                    <span>
                      BIOMETRIC
                      PROGRESS
                    </span>

                    <span>
                      {Math.round(
                        progress
                      )}
                      %
                    </span>
                  </Box>

                  <Box
                    className={
                      styles.progressTrack
                    }
                  >
                    <Box
                      className={
                        styles.progressBar
                      }
                      style={{
                        width: `${progress}%`
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  className={
                    styles.captureStatus
                  }
                >
                  <Box
                    className={
                      styles.captureIndicator
                    }
                  >
                    {capturedCount}
                  </Box>

                  <Box
                    className={
                      styles.captureText
                    }
                  >
                    <strong>
                      Descriptor
                      Captured
                    </strong>

                    <span>
                      {capturedCount}{' '}
                      of{' '}
                      {STEPS.length}{' '}
                      biometric
                      samples
                    </span>
                  </Box>
                </Box>
              </Box>

              {/* INSTRUCTION */}

              <Box
                className={
                  styles.instructionCard
                }
              >
                <Typography
                  component='div'
                  className={
                    styles.instructionTitle
                  }
                >
                  {status ===
                  'countdown'
                    ? 'Tahan Posisi'
                    : currentStepData?.label}
                </Typography>

                <Typography
                  component='p'
                  className={
                    styles.instructionText
                  }
                >
                  {status ===
                  'countdown'
                    ? `AI sudah mengunci posisi wajah. Capture dalam ${countdown} detik. Jangan bergerak.`
                    : status ===
                    'captured'
                      ? 'Descriptor berhasil disimpan. Bersiap untuk sudut wajah berikutnya.'
                      : currentStepData?.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <Box
          className={
            styles.footer
          }
        >
          <span>
            DISKOP BIOMETRIC SYSTEM
            v1.0.0
          </span>

          <span>
            FACE-API / TINY FACE
            DETECTOR
          </span>

          <span>
            LOCAL PROCESSING
          </span>

          <span>
            {new Date().getFullYear()}
          </span>
        </Box>
      </Box>
    </Box>
  )
}

/*
 * =========================================================
 * METRIC COMPONENT
 * =========================================================
 */

function Metric({
                  label,
                  value,
                  active
                }: {
  label: string
  value: string
  active: boolean
}) {
  return (
    <Box
      className={
        styles.metric
      }
    >
      <span
        className={
          styles.metricLabel
        }
      >
        {label}
      </span>

      <span
        className={[
          styles.metricValue,
          active
            ? styles.metricValueActive
            : ''
        ].join(' ')}
      >
        {value}
      </span>
    </Box>
  )
}

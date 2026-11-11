'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import Grow from '@mui/material/Grow'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { loadFaceModels } from '@/libs/face/face-api'
import {
  getFaceDescriptors
} from '@/libs/face/storage'
import {
  getFaceProfile,
  type FaceProfile
} from '@/libs/face/profile'
import { findBestMatch } from '@/libs/face/matching'

/* =========================================================
   TYPES
========================================================= */

type AttendanceStatus =
  | 'loading'
  | 'ready'
  | 'scanning'
  | 'analyzing'
  | 'matched'
  | 'not-matched'
  | 'already-attended'
  | 'error'

type AiPhase =
  | 'booting'
  | 'searching'
  | 'detected'
  | 'analyzing'
  | 'matching'
  | 'confirmed'

type AttendanceRecord = {
  id: string
  profileId: string
  employeeId: string
  name: string
  date: string
  timestamp: string
  confidence: number
  distance: number
  status: 'present'
  verificationMethod: 'face_recognition'
}

/* =========================================================
   DEMO DATA
========================================================= */

const AVATAR_URL = '/images/avatars/tasya-pp.png'

const FALLBACK_PROFILE: FaceProfile = {
  id: 'usr_001',
  employeeId: 'DISKOP-2026-001',
  name: 'Muhammad Rizki Firdaus',
  username: 'rizki.firdaus',
  email: 'rizki.firdaus@example.com',
  department:
    'Dinas Koperasi, Usaha Mikro & Tenaga Kerja',
  position: 'Administrator Sistem',
  location: 'Banjarbaru'
}

const TRAINING = {
  title: 'Pelatihan Digitalisasi UMKM',
  category: 'Teknologi & Digitalisasi',
  batch: 'Batch 04 • 2026',
  organizer:
    'Diskop UKM Kota Banjarbaru',
  schedule:
    '08 Oktober 2026 • 09:00 WITA',
  location:
    'Laboratorium Komputer Diskop'
}

const ATTENDANCE_KEY =
  'diskop_face_attendance'

const MATCH_THRESHOLD = 0.5
const REQUIRED_MATCHES = 5
const DETECTION_INTERVAL = 150

/* =========================================================
   PAGE
========================================================= */

export default function FaceAttendancePage() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const detectionTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    )

  const preparationTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    )

  const mountedRef =
    useRef(true)

  const detectingRef =
    useRef(false)

  const lockedRef =
    useRef(false)

  const consecutiveMatchesRef =
    useRef(0)

  const profileRef =
    useRef<FaceProfile | null>(null)

  /* =========================================================
     STATE
  ========================================================= */

  const [status, setStatus] =
    useState<AttendanceStatus>('loading')

  const [aiPhase, setAiPhase] =
    useState<AiPhase>('booting')

  const [modelsLoading, setModelsLoading] =
    useState(true)

  const [cameraLoading, setCameraLoading] =
    useState(true)

  const [registered, setRegistered] =
    useState(false)

  const [faceDetected, setFaceDetected] =
    useState(false)

  const [confidence, setConfidence] =
    useState(0)

  const [distance, setDistance] =
    useState<number | null>(null)

  const [matchProgress, setMatchProgress] =
    useState(0)

  const [message, setMessage] =
    useState(
      'Menyiapkan sistem absensi...'
    )

  /*
   * Profile deliberately stays null
   * until face recognition succeeds.
   */
  const [identifiedProfile, setIdentifiedProfile] =
    useState<FaceProfile | null>(null)

  const [attendanceTime, setAttendanceTime] =
    useState<string | null>(null)

  const [captureFlash, setCaptureFlash] =
    useState(false)

  /*
   * PRE-SCAN
   */
  const [preparing, setPreparing] =
    useState(false)

  const [countdown, setCountdown] =
    useState(3)

  /* =========================================================
     CAMERA
  ========================================================= */

  const stopCamera =
    useCallback(() => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(track => {
            track.stop()
          })

        streamRef.current = null
      }

      const video =
        videoRef.current

      if (video) {
        video.pause()
        video.srcObject = null
      }
    }, [])

  const stopDetection =
    useCallback(() => {
      if (detectionTimerRef.current) {
        clearInterval(
          detectionTimerRef.current
        )

        detectionTimerRef.current =
          null
      }
    }, [])

  const stopPreparation =
    useCallback(() => {
      if (preparationTimerRef.current) {
        clearInterval(
          preparationTimerRef.current
        )

        preparationTimerRef.current =
          null
      }
    }, [])

  const waitForVideoReady =
    useCallback(async () => {
      const video =
        videoRef.current

      if (!video) {
        throw new Error(
          'Video tidak tersedia.'
        )
      }

      if (
        video.readyState >=
        HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        return
      }

      await new Promise<void>(
        (resolve, reject) => {
          let finished = false

          const cleanup = () => {
            video.removeEventListener(
              'loadedmetadata',
              handleReady
            )

            video.removeEventListener(
              'canplay',
              handleReady
            )

            video.removeEventListener(
              'playing',
              handleReady
            )
          }

          const finish = () => {
            if (finished) return

            if (
              video.videoWidth <= 0 ||
              video.videoHeight <= 0
            ) {
              return
            }

            finished = true

            cleanup()

            resolve()
          }

          const handleReady = () => {
            finish()
          }

          video.addEventListener(
            'loadedmetadata',
            handleReady
          )

          video.addEventListener(
            'canplay',
            handleReady
          )

          video.addEventListener(
            'playing',
            handleReady
          )

          window.setTimeout(() => {
            if (finished) return

            cleanup()

            reject(
              new Error(
                'Kamera belum menghasilkan gambar.'
              )
            )
          }, 10000)
        }
      )
    }, [])

  const startCamera =
    useCallback(async () => {
      const video =
        videoRef.current

      if (!video) {
        throw new Error(
          'Kamera tidak tersedia.'
        )
      }

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        throw new Error(
          'Browser tidak mendukung kamera.'
        )
      }

      stopCamera()

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: 'user',
              width: {
                ideal: 1280
              },
              height: {
                ideal: 720
              },
              frameRate: {
                ideal: 30
              }
            },
            audio: false
          }
        )

      streamRef.current =
        stream

      video.srcObject =
        stream

      video.muted = true
      video.playsInline = true

      await waitForVideoReady()

      if (video.paused) {
        try {
          await video.play()
        } catch (error) {
          console.warn(
            'Video play warning:',
            error
          )

          if (video.paused) {
            throw error
          }
        }
      }

      await waitForVideoReady()

      if (mountedRef.current) {
        setCameraLoading(false)
      }
    }, [
      stopCamera,
      waitForVideoReady
    ])

  /* =========================================================
     CANVAS
  ========================================================= */

  const clearCanvas =
    useCallback(() => {
      const canvas =
        canvasRef.current

      if (!canvas) return

      const context =
        canvas.getContext('2d')

      if (!context) return

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )
    }, [])

  const drawRoundedRect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    const r =
      Math.min(
        radius,
        width / 2,
        height / 2
      )

    context.beginPath()

    context.moveTo(
      x + r,
      y
    )

    context.lineTo(
      x + width - r,
      y
    )

    context.quadraticCurveTo(
      x + width,
      y,
      x + width,
      y + r
    )

    context.lineTo(
      x + width,
      y + height - r
    )

    context.quadraticCurveTo(
      x + width,
      y + height,
      x + width - r,
      y + height
    )

    context.lineTo(
      x + r,
      y + height
    )

    context.quadraticCurveTo(
      x,
      y + height,
      x,
      y + height - r
    )

    context.lineTo(
      x,
      y + r
    )

    context.quadraticCurveTo(
      x,
      y,
      x + r,
      y
    )

    context.closePath()
  }

  const drawFaceTracking =
    useCallback(
      (
        result: faceapi.WithFaceDescriptor<
          faceapi.WithFaceLandmarks<{
            detection: faceapi.FaceDetection
          }>
        >
      ) => {
        const video =
          videoRef.current

        const canvas =
          canvasRef.current

        if (!video || !canvas) {
          return
        }

        const width =
          video.videoWidth

        const height =
          video.videoHeight

        if (!width || !height) {
          return
        }

        canvas.width =
          width

        canvas.height =
          height

        const context =
          canvas.getContext('2d')

        if (!context) return

        context.clearRect(
          0,
          0,
          width,
          height
        )

        const box =
          result.detection.box

        /* Face box */

        context.save()

        context.strokeStyle =
          'rgba(91,255,201,.96)'

        context.lineWidth = 3

        context.shadowColor =
          'rgba(71,255,190,.9)'

        context.shadowBlur = 22

        drawRoundedRect(
          context,
          box.x,
          box.y,
          box.width,
          box.height,
          24
        )

        context.stroke()

        context.restore()

        /* Landmarks */

        context.save()

        context.fillStyle =
          'rgba(133,255,220,.96)'

        context.shadowColor =
          'rgba(71,255,190,.8)'

        context.shadowBlur = 8

        for (
          const point of
          result.landmarks.positions
          ) {
          context.beginPath()

          context.arc(
            point.x,
            point.y,
            1.7,
            0,
            Math.PI * 2
          )

          context.fill()
        }

        context.restore()

        /* Crosshair */

        const centerX =
          box.x +
          box.width / 2

        const centerY =
          box.y +
          box.height / 2

        context.save()

        context.strokeStyle =
          'rgba(125,255,215,.38)'

        context.lineWidth = 1

        context.setLineDash([
          7,
          7
        ])

        context.beginPath()

        context.moveTo(
          centerX,
          box.y - 35
        )

        context.lineTo(
          centerX,
          box.y +
          box.height +
          35
        )

        context.stroke()

        context.beginPath()

        context.moveTo(
          box.x - 35,
          centerY
        )

        context.lineTo(
          box.x +
          box.width +
          35,
          centerY
        )

        context.stroke()

        context.restore()
      },
      []
    )

  /* =========================================================
     ATTENDANCE HELPERS
  ========================================================= */

  const getTodayKey = () => {
    return new Date()
      .toLocaleDateString(
        'en-CA',
        {
          timeZone:
            'Asia/Makassar'
        }
      )
  }

  const getTodayAttendance =
    (): AttendanceRecord | null => {
      if (
        typeof window ===
        'undefined'
      ) {
        return null
      }

      const raw =
        localStorage.getItem(
          ATTENDANCE_KEY
        )

      if (!raw) return null

      try {
        const record =
          JSON.parse(
            raw
          ) as AttendanceRecord

        if (
          record.date !==
          getTodayKey()
        ) {
          return null
        }

        return record
      } catch {
        return null
      }
    }

  /* =========================================================
     SAVE ATTENDANCE
  ========================================================= */

  const saveAttendance =
    useCallback(
      (
        matchConfidence: number,
        matchDistance: number
      ) => {
        const now =
          new Date()

        const currentProfile =
          profileRef.current ??
          FALLBACK_PROFILE

        const record:
          AttendanceRecord = {
          id:
            `att_${Date.now()}`,

          profileId:
          currentProfile.id,

          employeeId:
          currentProfile.employeeId,

          name:
          currentProfile.name,

          date:
            getTodayKey(),

          timestamp:
            now.toISOString(),

          confidence:
          matchConfidence,

          distance:
          matchDistance,

          status:
            'present',

          verificationMethod:
            'face_recognition'
        }

        localStorage.setItem(
          ATTENDANCE_KEY,
          JSON.stringify(record)
        )

        /*
         * Identity only appears now.
         */

        setIdentifiedProfile(
          currentProfile
        )

        setAttendanceTime(
          now.toLocaleTimeString(
            'id-ID',
            {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }
          )
        )

        setConfidence(
          matchConfidence
        )

        setMatchProgress(
          100
        )

        setStatus(
          'matched'
        )

        setAiPhase(
          'confirmed'
        )

        setMessage(
          'Identitas berhasil dikonfirmasi.'
        )

        lockedRef.current =
          true

        stopDetection()

        setCaptureFlash(
          true
        )

        window.setTimeout(
          () => {
            if (
              mountedRef.current
            ) {
              setCaptureFlash(
                false
              )
            }
          },
          700
        )
      },
      [stopDetection]
    )

  /* =========================================================
     FACE RECOGNITION
  ========================================================= */

  const checkAttendance =
    useCallback(async () => {
      if (
        lockedRef.current ||
        detectingRef.current ||
        preparing
      ) {
        return
      }

      const video =
        videoRef.current

      if (!video) return

      if (
        video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA ||
        video.videoWidth <= 0 ||
        video.videoHeight <= 0
      ) {
        return
      }

      detectingRef.current =
        true

      try {
        const descriptors =
          getFaceDescriptors()

        if (!descriptors.length) {
          setRegistered(false)

          setStatus(
            'error'
          )

          setAiPhase(
            'booting'
          )

          setMessage(
            'Wajah Anda belum terdaftar.'
          )

          stopDetection()

          return
        }

        setRegistered(
          true
        )

        const result =
          await faceapi
            .detectSingleFace(
              video,
              new faceapi.TinyFaceDetectorOptions(
                {
                  inputSize: 320,
                  scoreThreshold:
                    0.45
                }
              )
            )
            .withFaceLandmarks()
            .withFaceDescriptor()

        /* No face */

        if (!result) {
          clearCanvas()

          setFaceDetected(
            false
          )

          setAiPhase(
            'searching'
          )

          setStatus(
            'scanning'
          )

          setMessage(
            'Arahkan wajah Anda ke kamera.'
          )

          setConfidence(
            0
          )

          setDistance(
            null
          )

          setMatchProgress(
            0
          )

          consecutiveMatchesRef.current =
            0

          return
        }

        /* Face found */

        setFaceDetected(
          true
        )

        drawFaceTracking(
          result
        )

        setAiPhase(
          'detected'
        )

        setStatus(
          'analyzing'
        )

        setMessage(
          'Wajah ditemukan. Sedang mengenali Anda...'
        )

        const match =
          findBestMatch(
            result.descriptor,
            descriptors,
            MATCH_THRESHOLD
          )

        setDistance(
          match.distance
        )

        const safeConfidence =
          Math.max(
            0,
            Math.min(
              100,
              Number(
                match.confidence
              ) || 0
            )
          )

        setConfidence(
          safeConfidence
        )

        /* Not matched */

        if (!match.matched) {
          consecutiveMatchesRef.current =
            0

          setMatchProgress(
            0
          )

          setAiPhase(
            'analyzing'
          )

          setStatus(
            'not-matched'
          )

          setMessage(
            'Wajah belum cocok. Posisikan wajah dengan jelas.'
          )

          return
        }

        /* Matched */

        setAiPhase(
          'matching'
        )

        setStatus(
          'scanning'
        )

        consecutiveMatchesRef.current +=
          1

        const progress =
          Math.min(
            100,
            (
              consecutiveMatchesRef.current /
              REQUIRED_MATCHES
            ) *
            100
          )

        setMatchProgress(
          progress
        )

        setMessage(
          'Wajah cocok. Memastikan identitas...'
        )

        if (
          consecutiveMatchesRef.current >=
          REQUIRED_MATCHES
        ) {
          saveAttendance(
            safeConfidence,
            match.distance
          )
        }
      } catch (error) {
        console.error(
          'Face recognition error:',
          error
        )

        setStatus(
          'error'
        )

        setAiPhase(
          'booting'
        )

        setMessage(
          'Terjadi masalah saat memproses kamera.'
        )
      } finally {
        detectingRef.current =
          false
      }
    }, [
      clearCanvas,
      drawFaceTracking,
      preparing,
      saveAttendance,
      stopDetection
    ])

  const startDetection =
    useCallback(() => {
      stopDetection()

      detectionTimerRef.current =
        setInterval(
          () => {
            void checkAttendance()
          },
          DETECTION_INTERVAL
        )
    }, [
      checkAttendance,
      stopDetection
    ])

  /* =========================================================
     PRE-SCAN COUNTDOWN
  ========================================================= */

  const startPreparation =
    useCallback(() => {
      stopPreparation()

      setPreparing(
        true
      )

      setCountdown(
        3
      )

      setFaceDetected(
        false
      )

      setMatchProgress(
        0
      )

      setConfidence(
        0
      )

      setDistance(
        null
      )

      setAiPhase(
        'booting'
      )

      setStatus(
        'ready'
      )

      setMessage(
        'Siapkan posisi Anda di depan kamera.'
      )

      /*
       * LOCK recognition while
       * countdown is running.
       */

      lockedRef.current =
        true

      let count = 3

      preparationTimerRef.current =
        setInterval(
          () => {
            if (
              !mountedRef.current
            ) {
              stopPreparation()
              return
            }

            count -= 1

            setCountdown(
              count
            )

            if (count <= 0) {
              stopPreparation()

              setPreparing(
                false
              )

              setStatus(
                'scanning'
              )

              setAiPhase(
                'searching'
              )

              setMessage(
                'AI aktif. Arahkan wajah Anda ke kamera.'
              )

              /*
               * Unlock only after
               * countdown is finished.
               */

              lockedRef.current =
                false

              startDetection()
            }
          },
          1000
        )
    }, [
      startDetection,
      stopPreparation
    ])

  /* =========================================================
     INITIALIZE
  ========================================================= */

  useEffect(() => {
    mountedRef.current =
      true

    let cancelled =
      false

    const initialize =
      async () => {
        try {
          setModelsLoading(
            true
          )

          setCameraLoading(
            true
          )

          setStatus(
            'loading'
          )

          setAiPhase(
            'booting'
          )

          setMessage(
            'Menyiapkan sistem absensi...'
          )

          await loadFaceModels()

          if (cancelled) return

          setModelsLoading(
            false
          )

          const storedProfile =
            getFaceProfile()

          const activeProfile =
            storedProfile ??
            FALLBACK_PROFILE

          profileRef.current =
            activeProfile

          const descriptors =
            getFaceDescriptors()

          if (!descriptors.length) {
            setRegistered(
              false
            )

            setStatus(
              'error'
            )

            setAiPhase(
              'booting'
            )

            setMessage(
              'Wajah Anda belum terdaftar. Silakan lakukan registrasi terlebih dahulu.'
            )

            setCameraLoading(
              false
            )

            return
          }

          setRegistered(
            true
          )

          const existing =
            getTodayAttendance()

          await startCamera()

          if (cancelled) return

          await waitForVideoReady()

          if (cancelled) return

          /*
           * Already attended:
           * reveal identity immediately because
           * today's identity was already verified.
           */

          if (existing) {
            setIdentifiedProfile(
              activeProfile
            )

            setConfidence(
              existing.confidence
            )

            setDistance(
              existing.distance
            )

            setMatchProgress(
              100
            )

            setAttendanceTime(
              new Date(
                existing.timestamp
              ).toLocaleTimeString(
                'id-ID',
                {
                  hour:
                    '2-digit',
                  minute:
                    '2-digit',
                  second:
                    '2-digit'
                }
              )
            )

            setStatus(
              'already-attended'
            )

            setAiPhase(
              'confirmed'
            )

            setMessage(
              'Kehadiran Anda hari ini sudah tercatat.'
            )

            lockedRef.current =
              true

            return
          }

          /*
           * IMPORTANT:
           *
           * Camera is ready first.
           * Then give user time to prepare.
           * Recognition starts ONLY after
           * countdown reaches zero.
           */

          startPreparation()
        } catch (error) {
          console.error(
            'Attendance initialization error:',
            error
          )

          if (cancelled) return

          setModelsLoading(
            false
          )

          setCameraLoading(
            false
          )

          setStatus(
            'error'
          )

          setAiPhase(
            'booting'
          )

          setMessage(
            'Kamera atau sistem AI tidak dapat diaktifkan.'
          )
        }
      }

    void initialize()

    return () => {
      cancelled =
        true

      mountedRef.current =
        false

      stopPreparation()
      stopDetection()
      stopCamera()
      clearCanvas()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =========================================================
     RESCAN
  ========================================================= */

  const handleRescan =
    useCallback(() => {
      localStorage.removeItem(
        ATTENDANCE_KEY
      )

      stopDetection()
      stopPreparation()

      lockedRef.current =
        true

      consecutiveMatchesRef.current =
        0

      setIdentifiedProfile(
        null
      )

      setAttendanceTime(
        null
      )

      setMatchProgress(
        0
      )

      setConfidence(
        0
      )

      setDistance(
        null
      )

      setFaceDetected(
        false
      )

      clearCanvas()

      /*
       * Give user the same
       * preparation time again.
       */

      startPreparation()
    }, [
      clearCanvas,
      startPreparation,
      stopDetection,
      stopPreparation
    ])

  /* =========================================================
     UI STATE
  ========================================================= */

  const completed =
    status === 'matched' ||
    status === 'already-attended'

  const aiReady =
    !modelsLoading &&
    !cameraLoading &&
    registered

  const statusText =
    completed
      ? 'Kehadiran tercatat'
      : status === 'error'
        ? 'Perlu perhatian'
        : preparing
          ? 'Menyiapkan kamera'
          : aiReady
            ? 'AI siap digunakan'
            : 'Menyiapkan...'

  const cameraMessage =
    preparing
      ? 'Siapkan posisi Anda'
      : modelsLoading
        ? 'Menyiapkan AI...'
        : cameraLoading
          ? 'Mengaktifkan kamera...'
          : completed
            ? 'Identitas berhasil dikenali'
            : !faceDetected
              ? 'Arahkan wajah Anda ke kamera'
              : aiPhase ===
              'detected'
                ? 'Wajah ditemukan'
                : aiPhase ===
                'analyzing'
                  ? 'Sedang mengenali Anda'
                  : aiPhase ===
                  'matching'
                    ? 'Memastikan identitas'
                    : 'Mencari wajah...'

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box
      sx={{
        minHeight:
          '100vh',

        width:
          '100%',

        overflowX:
          'hidden',

        background:
          'radial-gradient(circle at 10% 0%, rgba(44,210,155,.10), transparent 28%), radial-gradient(circle at 90% 20%, rgba(51,187,142,.06), transparent 25%), linear-gradient(180deg,#f9fcfb 0%,#eff7f3 100%)',

        px: {
          xs: 2,
          md: 4,
          xl: 6
        },

        py: {
          xs: 3,
          md: 5
        }
      }}
    >
      <Box
        sx={{
          maxWidth:
            1580,

          width:
            '100%',

          mx:
            'auto',

          minWidth:
            0
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Fade
          in
          timeout={650}
        >
          <Box
            sx={{
              mb: 4,

              display:
                'flex',

              alignItems: {
                xs: 'flex-start',
                lg: 'flex-end'
              },

              justifyContent:
                'space-between',

              gap: 3,

              flexDirection: {
                xs: 'column',
                lg: 'row'
              }
            }}
          >
            <Box
              sx={{
                minWidth:
                  0
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mb: 1.5
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,

                    borderRadius:
                      '50%',

                    bgcolor:
                      '#15b67b',

                    boxShadow:
                      '0 0 0 6px rgba(21,182,123,.10)'
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,

                    fontWeight:
                      900,

                    letterSpacing:
                      2,

                    color:
                      '#109a6a'
                  }}
                >
                  DISKOP • SMART ATTENDANCE
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: {
                    xs: 38,
                    sm: 46,
                    md: 56
                  },

                  lineHeight:
                    .95,

                  fontWeight:
                    950,

                  letterSpacing:
                    -2,

                  color:
                    '#17382e'
                }}
              >
                Absensi{' '}
                <Box
                  component="span"
                  sx={{
                    color:
                      '#0eaa73'
                  }}
                >
                  Kehadiran
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,

                  fontSize: {
                    xs: 15,
                    md: 17
                  },

                  color:
                    '#758b83'
                }}
              >
                Sistem akan mengenali wajah
                dan mencatat kehadiran Anda
                secara otomatis.
              </Typography>
            </Box>

            <Chip
              label={
                statusText
              }
              sx={{
                height: 42,

                px: 1.5,

                borderRadius:
                  3,

                fontSize: 13,

                fontWeight:
                  850,

                color:
                  completed
                    ? '#07875c'
                    : '#3b7562',

                bgcolor:
                  completed
                    ? '#daf8eb'
                    : preparing
                      ? '#eef8f4'
                      : '#e9f7f1',

                border:
                  '1px solid rgba(20,180,120,.14)'
              }}
            />
          </Box>
        </Fade>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <Box
          sx={{
            width:
              '100%',

            minWidth:
              0,

            display:
              'grid',

            gridTemplateColumns: {
              xs: '1fr',

              lg:
                'minmax(0, 1.65fr) minmax(300px, 0.55fr)',

              xl:
                'minmax(0, 1.75fr) minmax(320px, 0.55fr)'
            },

            gap: 3,

            alignItems:
              'start'
          }}
        >
          {/* =================================================
              CAMERA
          ================================================= */}

          <Grow
            in
            timeout={850}
          >
            <Card
              elevation={0}
              sx={{
                width:
                  '100%',

                minWidth:
                  0,

                borderRadius:
                  5,

                overflow:
                  'hidden',

                background:
                  '#fff',

                border:
                  '1px solid rgba(20,92,69,.10)',

                boxShadow:
                  '0 35px 100px rgba(27,87,65,.13)'
              }}
            >
              {/* Camera header */}

              <Box
                sx={{
                  px: {
                    xs: 2,
                    md: 3
                  },

                  py: 2.4,

                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',

                  gap: 2
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,

                      display:
                        'grid',

                      placeItems:
                        'center',

                      borderRadius:
                        3,

                      background:
                        'linear-gradient(145deg,#e0faf0,#f5fffb)',

                      color:
                        '#0b9f6b',

                      fontSize: 18,

                      fontWeight:
                        950
                    }}
                  >
                    AI
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: 18,
                          md: 21
                        },

                        fontWeight:
                          900,

                        color:
                          '#19382f'
                      }}
                    >
                      AI Face Vision
                    </Typography>

                    <Typography
                      sx={{
                        mt: .2,

                        fontSize: 13,

                        color:
                          '#84968f'
                      }}
                    >
                      Pengenalan wajah real-time
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,

                      borderRadius:
                        '50%',

                      bgcolor:
                        cameraLoading
                          ? '#b5c1bc'
                          : '#28dc99',

                      boxShadow:
                        cameraLoading
                          ? 'none'
                          : '0 0 18px rgba(40,220,153,.9)'
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 11,

                      fontWeight:
                        900,

                      color:
                        '#7c9088',

                      letterSpacing:
                        1.2
                    }}
                  >
                    LIVE
                  </Typography>
                </Stack>
              </Box>

              {/* =================================================
                  CAMERA VIEWPORT
              ================================================= */}

              <Box
                sx={{
                  position:
                    'relative',

                  mx: {
                    xs: 1,
                    md: 2
                  },

                  borderRadius:
                    4,

                  overflow:
                    'hidden',

                  background:
                    '#061c15',

                  aspectRatio:
                    '16 / 9',

                  minHeight: {
                    xs: 390,
                    sm: 500,
                    md: 570,
                    xl: 640
                  },

                  '@keyframes scanBeam': {
                    '0%': {
                      transform:
                        'translateY(-120%)',
                      opacity: 0
                    },

                    '12%': {
                      opacity: 1
                    },

                    '88%': {
                      opacity: 1
                    },

                    '100%': {
                      transform:
                        'translateY(500%)',
                      opacity: 0
                    }
                  },

                  '@keyframes orbit': {
                    from: {
                      transform:
                        'translate(-50%,-50%) rotate(0deg)'
                    },

                    to: {
                      transform:
                        'translate(-50%,-50%) rotate(360deg)'
                    }
                  },

                  '@keyframes orbitReverse': {
                    from: {
                      transform:
                        'translate(-50%,-50%) rotate(360deg)'
                    },

                    to: {
                      transform:
                        'translate(-50%,-50%) rotate(0deg)'
                    }
                  },

                  '@keyframes pulseRing': {
                    '0%,100%': {
                      transform:
                        'translate(-50%,-50%) scale(.93)',
                      opacity: .25
                    },

                    '50%': {
                      transform:
                        'translate(-50%,-50%) scale(1.04)',
                      opacity: .75
                    }
                  },

                  '@keyframes floatDot': {
                    '0%,100%': {
                      transform:
                        'translateY(0) scale(.8)',
                      opacity: .25
                    },

                    '50%': {
                      transform:
                        'translateY(-20px) scale(1)',
                      opacity: 1
                    }
                  },

                  '@keyframes successPulse': {
                    '0%': {
                      transform:
                        'translate(-50%,-50%) scale(.75)',
                      opacity: 0
                    },

                    '40%': {
                      transform:
                        'translate(-50%,-50%) scale(1)',
                      opacity: 1
                    },

                    '100%': {
                      transform:
                        'translate(-50%,-50%) scale(1.12)',
                      opacity: 0
                    }
                  },

                  '@keyframes countdownPulse': {
                    '0%': {
                      transform:
                        'scale(.82)',
                      opacity: .2
                    },

                    '50%': {
                      transform:
                        'scale(1)',
                      opacity: 1
                    },

                    '100%': {
                      transform:
                        'scale(1.05)',
                      opacity: .4
                    }
                  }
                }}
              >
                {/* VIDEO */}

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    position:
                      'absolute',

                    inset: 0,

                    width:
                      '100%',

                    height:
                      '100%',

                    objectFit:
                      'cover',

                    transform:
                      'scaleX(-1)'
                  }}
                />

                {/* CANVAS */}

                <canvas
                  ref={canvasRef}
                  style={{
                    position:
                      'absolute',

                    inset: 0,

                    width:
                      '100%',

                    height:
                      '100%',

                    pointerEvents:
                      'none',

                    transform:
                      'scaleX(-1)',

                    zIndex: 4
                  }}
                />

                {/* CINEMATIC GRADIENT */}

                <Box
                  sx={{
                    position:
                      'absolute',

                    inset: 0,

                    background:
                      'linear-gradient(180deg,rgba(2,21,15,.72) 0%,rgba(2,21,15,.08) 28%,rgba(2,21,15,.02) 60%,rgba(2,21,15,.82) 100%)',

                    pointerEvents:
                      'none',

                    zIndex: 5
                  }}
                />

                {/* DIGITAL GRID */}

                <Box
                  sx={{
                    position:
                      'absolute',

                    inset: 0,

                    opacity:
                      .15,

                    backgroundImage:
                      'linear-gradient(rgba(100,255,210,.20) 1px,transparent 1px),linear-gradient(90deg,rgba(100,255,210,.20) 1px,transparent 1px)',

                    backgroundSize:
                      '52px 52px',

                    maskImage:
                      'linear-gradient(to bottom,transparent,black 20%,black 80%,transparent)',

                    pointerEvents:
                      'none',

                    zIndex: 6
                  }}
                />

                {/* =================================================
                    PRE-SCAN COUNTDOWN
                ================================================= */}

                <Fade
                  in={
                    preparing
                  }
                  timeout={400}
                >
                  <Box
                    sx={{
                      position:
                        'absolute',

                      inset: 0,

                      display:
                        preparing
                          ? 'flex'
                          : 'none',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      background:
                        'linear-gradient(180deg,rgba(3,25,18,.84),rgba(3,30,21,.70))',

                      backdropFilter:
                        'blur(10px)',

                      zIndex: 100
                    }}
                  >
                    <Stack
                      alignItems="center"
                      spacing={2.5}
                    >
                      {/* AI READY */}

                      <Box
                        sx={{
                          px: 2,
                          py: .8,

                          borderRadius:
                            99,

                          bgcolor:
                            'rgba(91,255,201,.10)',

                          border:
                            '1px solid rgba(91,255,201,.25)'
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,

                              borderRadius:
                                '50%',

                              bgcolor:
                                '#65ffd0',

                              boxShadow:
                                '0 0 15px #65ffd0'
                            }}
                          />

                          <Typography
                            sx={{
                              color:
                                '#bffff0',

                              fontSize: 10,

                              fontWeight:
                                900,

                              letterSpacing:
                                1.5
                            }}
                          >
                            AI CAMERA READY
                          </Typography>
                        </Stack>
                      </Box>

                      {/* COUNTDOWN */}

                      <Box
                        sx={{
                          position:
                            'relative',

                          width: {
                            xs: 140,
                            md: 175
                          },

                          height: {
                            xs: 140,
                            md: 175
                          },

                          display:
                            'grid',

                          placeItems:
                            'center'
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={
                            ((4 -
                                countdown) /
                              3) *
                            100
                          }
                          size={170}
                          thickness={1.5}
                          sx={{
                            position:
                              'absolute',

                            color:
                              'rgba(102,255,207,.32)'
                          }}
                        />

                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={142}
                          thickness={.7}
                          sx={{
                            position:
                              'absolute',

                            color:
                              'rgba(102,255,207,.10)'
                          }}
                        />

                        <Box
                          sx={{
                            position:
                              'absolute',

                            inset: 16,

                            borderRadius:
                              '50%',

                            border:
                              '1px solid rgba(102,255,207,.28)',

                            animation:
                              'countdownPulse 1s ease-in-out infinite'
                          }}
                        />

                        <Typography
                          key={
                            countdown
                          }
                          sx={{
                            fontSize: {
                              xs: 62,
                              md: 78
                            },

                            lineHeight:
                              1,

                            fontWeight:
                              950,

                            color:
                              '#fff',

                            letterSpacing:
                              -5,

                            textShadow:
                              '0 0 35px rgba(103,255,210,.45)',

                            animation:
                              'countdownPulse 1s ease-in-out'
                          }}
                        >
                          {countdown}
                        </Typography>
                      </Box>

                      {/* MESSAGE */}

                      <Box
                        sx={{
                          textAlign:
                            'center'
                        }}
                      >
                        <Typography
                          sx={{
                            color:
                              '#fff',

                            fontSize: {
                              xs: 19,
                              md: 24
                            },

                            fontWeight:
                              900
                          }}
                        >
                          Siapkan posisi Anda
                        </Typography>

                        <Typography
                          sx={{
                            mt: .8,

                            color:
                              'rgba(255,255,255,.58)',

                            fontSize: {
                              xs: 12,
                              md: 13
                            }
                          }}
                        >
                          Posisikan wajah di tengah kamera
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Fade>

                {/* =================================================
                    SCAN BEAM
                ================================================= */}

                {faceDetected &&
                  !completed &&
                  !preparing && (
                    <Box
                      sx={{
                        position:
                          'absolute',

                        left: 0,
                        right: 0,
                        top: 0,

                        height:
                          '22%',

                        background:
                          'linear-gradient(180deg,transparent,rgba(75,255,195,.34),rgba(75,255,195,.08),transparent)',

                        animation:
                          'scanBeam 2.4s linear infinite',

                        pointerEvents:
                          'none',

                        zIndex: 8
                      }}
                    />
                  )}

                {/* =================================================
                    AI ORBITS
                ================================================= */}

                {faceDetected &&
                  !preparing && (
                    <>
                      <Box
                        sx={{
                          position:
                            'absolute',

                          left:
                            '50%',

                          top:
                            '50%',

                          width: {
                            xs: 290,
                            sm: 360,
                            md: 440
                          },

                          height: {
                            xs: 290,
                            sm: 360,
                            md: 440
                          },

                          borderRadius:
                            '50%',

                          border:
                            '1px solid rgba(100,255,207,.30)',

                          animation:
                            'pulseRing 2.2s ease-in-out infinite',

                          pointerEvents:
                            'none',

                          zIndex: 7
                        }}
                      />

                      <Box
                        sx={{
                          position:
                            'absolute',

                          left:
                            '50%',

                          top:
                            '50%',

                          width: {
                            xs: 330,
                            sm: 410,
                            md: 500
                          },

                          height: {
                            xs: 330,
                            sm: 410,
                            md: 500
                          },

                          borderRadius:
                            '50%',

                          border:
                            '1px dashed rgba(100,255,207,.30)',

                          animation:
                            'orbit 12s linear infinite',

                          pointerEvents:
                            'none',

                          zIndex: 7
                        }}
                      />

                      <Box
                        sx={{
                          position:
                            'absolute',

                          left:
                            '50%',

                          top:
                            '50%',

                          width: {
                            xs: 250,
                            sm: 310,
                            md: 380
                          },

                          height: {
                            xs: 250,
                            sm: 310,
                            md: 380
                          },

                          borderRadius:
                            '50%',

                          border:
                            '1px solid rgba(100,255,207,.16)',

                          animation:
                            'orbitReverse 8s linear infinite',

                          pointerEvents:
                            'none',

                          zIndex: 7
                        }}
                      />
                    </>
                  )}

                {/* =================================================
                    PARTICLES
                ================================================= */}

                {[
                  ['8%', '28%'],
                  ['13%', '63%'],
                  ['21%', '18%'],
                  ['88%', '27%'],
                  ['94%', '54%'],
                  ['82%', '76%'],
                  ['73%', '14%'],
                  ['28%', '82%'],
                  ['69%', '87%']
                ].map(
                  (
                    [left, top],
                    index
                  ) => (
                    <Box
                      key={
                        index
                      }
                      sx={{
                        position:
                          'absolute',

                        left,
                        top,

                        width:
                          index % 3 ===
                          0
                            ? 5
                            : 3,

                        height:
                          index % 3 ===
                          0
                            ? 5
                            : 3,

                        borderRadius:
                          '50%',

                        bgcolor:
                          '#70ffd0',

                        boxShadow:
                          '0 0 14px #70ffd0',

                        animation:
                          `floatDot ${2 + index * .27}s ease-in-out infinite`,

                        animationDelay:
                          `${index * .17}s`,

                        zIndex: 9,

                        pointerEvents:
                          'none'
                      }}
                    />
                  )
                )}

                {/* =================================================
                    FACE GUIDE
                ================================================= */}

                <Box
                  sx={{
                    position:
                      'absolute',

                    left:
                      '50%',

                    top:
                      '50%',

                    width: {
                      xs: 220,
                      sm: 285,
                      md: 330
                    },

                    height: {
                      xs: 280,
                      sm: 360,
                      md: 410
                    },

                    transform:
                      'translate(-50%,-50%)',

                    borderRadius:
                      '50% 50% 47% 47%',

                    border:
                      faceDetected
                        ? '2px solid rgba(100,255,207,.82)'
                        : '1px dashed rgba(255,255,255,.42)',

                    boxShadow:
                      faceDetected
                        ? '0 0 0 8px rgba(78,255,194,.06),0 0 80px rgba(78,255,194,.18),inset 0 0 40px rgba(78,255,194,.05)'
                        : 'none',

                    transition:
                      'all .5s cubic-bezier(.22,1,.36,1)',

                    zIndex: 10,

                    pointerEvents:
                      'none'
                  }}
                />

                {/* =================================================
                    TOP HUD
                ================================================= */}

                <Box
                  sx={{
                    position:
                      'absolute',

                    top: 20,
                    left: 20,
                    right: 20,

                    display:
                      'flex',

                    justifyContent:
                      'space-between',

                    alignItems:
                      'center',

                    zIndex: 20
                  }}
                >
                  <Box
                    sx={{
                      px: 1.6,
                      py: .9,

                      borderRadius:
                        2.5,

                      bgcolor:
                        'rgba(3,25,18,.65)',

                      backdropFilter:
                        'blur(15px)',

                      border:
                        '1px solid rgba(255,255,255,.11)'
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,

                          borderRadius:
                            '50%',

                          bgcolor:
                            '#6bffd0',

                          boxShadow:
                            '0 0 14px #6bffd0'
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 10,

                          fontWeight:
                            900,

                          color:
                            '#c4ffeb',

                          letterSpacing:
                            1.6
                        }}
                      >
                        AI VISION ACTIVE
                      </Typography>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      px: 1.6,
                      py: .9,

                      borderRadius:
                        2.5,

                      bgcolor:
                        'rgba(3,25,18,.65)',

                      backdropFilter:
                        'blur(15px)',

                      border:
                        '1px solid rgba(255,255,255,.11)'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,

                        fontWeight:
                          900,

                        color:
                          '#fff',

                        letterSpacing:
                          1.3
                      }}
                    >
                      LIVE
                    </Typography>
                  </Box>
                </Box>

                {/* =================================================
                    FACE DETECTED
                ================================================= */}

                <Fade
                  in={
                    faceDetected &&
                    !preparing
                  }
                  timeout={400}
                >
                  <Box
                    sx={{
                      position:
                        'absolute',

                      top: 76,

                      left:
                        '50%',

                      transform:
                        'translateX(-50%)',

                      zIndex: 22,

                      px: 2,

                      py: .9,

                      borderRadius:
                        99,

                      bgcolor:
                        'rgba(7,45,32,.72)',

                      backdropFilter:
                        'blur(14px)',

                      border:
                        '1px solid rgba(103,255,207,.30)'
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,

                          borderRadius:
                            '50%',

                          bgcolor:
                            '#69ffd0',

                          boxShadow:
                            '0 0 14px #69ffd0'
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 10,

                          fontWeight:
                            900,

                          color:
                            '#c9ffec',

                          letterSpacing:
                            1.2
                        }}
                      >
                        FACE DETECTED
                      </Typography>
                    </Stack>
                  </Box>
                </Fade>

                {/* =================================================
                    IDENTITY HUD
                ================================================= */}

                <Fade
                  in={
                    Boolean(
                      identifiedProfile
                    )
                  }
                  timeout={700}
                >
                  <Box
                    sx={{
                      position:
                        'absolute',

                      left:
                        '50%',

                      bottom: {
                        xs: 80,
                        md: 92
                      },

                      transform:
                        'translateX(-50%)',

                      zIndex: 30,

                      minWidth: {
                        xs: 260,
                        sm: 330
                      },

                      maxWidth:
                        'calc(100% - 30px)'
                    }}
                  >
                    {identifiedProfile && (
                      <Box
                        sx={{
                          px: 2,

                          py: 1.5,

                          borderRadius: 4,

                          background:
                            'linear-gradient(135deg,rgba(5,39,28,.90),rgba(9,62,44,.82))',

                          backdropFilter:
                            'blur(22px)',

                          border:
                            '1px solid rgba(113,255,211,.25)',

                          boxShadow:
                            '0 20px 60px rgba(0,0,0,.28),0 0 40px rgba(65,255,190,.10)'
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              position:
                                'relative'
                            }}
                          >
                            <Avatar
                              src={
                                AVATAR_URL
                              }
                              alt={
                                identifiedProfile.name
                              }
                              sx={{
                                width: 50,
                                height: 50,

                                border:
                                  '2px solid rgba(117,255,211,.65)',

                                boxShadow:
                                  '0 0 25px rgba(76,255,192,.22)'
                              }}
                            />

                            <Box
                              sx={{
                                position:
                                  'absolute',

                                right:
                                  -1,

                                bottom:
                                  0,

                                width: 13,
                                height: 13,

                                borderRadius:
                                  '50%',

                                bgcolor:
                                  '#54ffc5',

                                border:
                                  '2px solid #073a2a'
                              }}
                            />
                          </Box>

                          <Box
                            sx={{
                              minWidth:
                                0
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: 15,
                                  sm: 17
                                },

                                fontWeight:
                                  900,

                                color:
                                  '#fff',

                                lineHeight:
                                  1.2
                              }}
                            >
                              {
                                identifiedProfile.name
                              }
                            </Typography>

                            <Typography
                              sx={{
                                mt: .35,

                                fontSize: 11,

                                color:
                                  'rgba(205,255,235,.66)'
                              }}
                            >
                              Identitas terverifikasi
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              ml:
                                'auto !important',

                              textAlign:
                                'right'
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 17,

                                fontWeight:
                                  950,

                                color:
                                  '#72ffd2'
                              }}
                            >
                              {confidence.toFixed(
                                1
                              )}
                              %
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 8,

                                fontWeight:
                                  800,

                                color:
                                  'rgba(205,255,235,.5)',

                                letterSpacing:
                                  1
                              }}
                            >
                              MATCH
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Fade>

                {/* =================================================
                    CAMERA MESSAGE
                ================================================= */}

                <Fade
                  in
                  key={
                    cameraMessage
                  }
                  timeout={300}
                >
                  <Box
                    sx={{
                      position:
                        'absolute',

                      left:
                        '50%',

                      bottom:
                        identifiedProfile
                          ? 24
                          : 25,

                      transform:
                        'translateX(-50%)',

                      zIndex: 25,

                      width:
                        'max-content',

                      maxWidth:
                        'calc(100% - 30px)',

                      px: 2.5,

                      py: 1.25,

                      borderRadius: 3,

                      bgcolor:
                        'rgba(4,27,20,.70)',

                      backdropFilter:
                        'blur(18px)',

                      border:
                        '1px solid rgba(255,255,255,.12)',

                      textAlign:
                        'center'
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          '#fff',

                        fontSize: {
                          xs: 13,
                          md: 15
                        },

                        fontWeight:
                          850
                      }}
                    >
                      {preparing
                        ? 'Siapkan posisi Anda'
                        : completed
                          ? '✓ Kehadiran berhasil dicatat'
                          : cameraMessage}
                    </Typography>

                    {!completed &&
                      !preparing && (
                        <Typography
                          sx={{
                            mt: .3,

                            color:
                              'rgba(255,255,255,.62)',

                            fontSize: 10
                          }}
                        >
                          {message}
                        </Typography>
                      )}
                  </Box>
                </Fade>

                {/* =================================================
                    BOTTOM HUD
                ================================================= */}

                <Box
                  sx={{
                    position:
                      'absolute',

                    left: 20,
                    right: 20,
                    bottom: 20,

                    display:
                      'flex',

                    justifyContent:
                      'space-between',

                    alignItems:
                      'flex-end',

                    pointerEvents:
                      'none',

                    zIndex: 18
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 9,

                        color:
                          'rgba(255,255,255,.48)',

                        letterSpacing:
                          1.4,

                        fontWeight:
                          800
                      }}
                    >
                      FACE RECOGNITION
                    </Typography>

                    <Typography
                      sx={{
                        mt: .3,

                        fontSize: 11,

                        color:
                          '#c8ffeb',

                        fontWeight:
                          800
                      }}
                    >
                      {preparing
                        ? 'PREPARING'
                        : faceDetected
                          ? 'SIGNAL LOCKED'
                          : 'SEARCHING...'}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      textAlign:
                        'right'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 9,

                        color:
                          'rgba(255,255,255,.48)',

                        letterSpacing:
                          1.4,

                        fontWeight:
                          800
                      }}
                    >
                      SESSION
                    </Typography>

                    <Typography
                      sx={{
                        mt: .3,

                        fontSize: 11,

                        color:
                          '#c8ffeb',

                        fontWeight:
                          800
                      }}
                    >
                      {Date.now()
                        .toString(16)
                        .slice(-8)
                        .toUpperCase()}
                    </Typography>
                  </Box>
                </Box>

                {/* =================================================
                    INITIAL LOADING
                ================================================= */}

                {(modelsLoading ||
                    cameraLoading) &&
                  !preparing && (
                    <Box
                      sx={{
                        position:
                          'absolute',

                        inset: 0,

                        display:
                          'flex',

                        alignItems:
                          'center',

                        justifyContent:
                          'center',

                        bgcolor:
                          'rgba(3,24,17,.64)',

                        backdropFilter:
                          'blur(12px)',

                        zIndex: 50
                      }}
                    >
                      <Stack
                        alignItems="center"
                        spacing={2}
                      >
                        <CircularProgress
                          size={60}
                          thickness={3}
                          sx={{
                            color:
                              '#6affd0'
                          }}
                        />

                        <Typography
                          sx={{
                            color:
                              '#fff',

                            fontSize: 15,

                            fontWeight:
                              850
                          }}
                        >
                          {modelsLoading
                            ? 'Menyiapkan AI...'
                            : 'Mengaktifkan kamera...'}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              'rgba(255,255,255,.55)',

                            fontSize: 11
                          }}
                        >
                          Mohon tunggu sebentar
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {completed && (
                  <>
                    <Box
                      sx={{
                        position:
                          'absolute',

                        left:
                          '50%',

                        top:
                          '50%',

                        width: 130,
                        height: 130,

                        borderRadius:
                          '50%',

                        border:
                          '2px solid rgba(102,255,207,.65)',

                        transform:
                          'translate(-50%,-50%)',

                        animation:
                          'successPulse 1.8s ease-out infinite',

                        zIndex: 19,

                        pointerEvents:
                          'none'
                      }}
                    />

                    <Box
                      sx={{
                        position:
                          'absolute',

                        left:
                          '50%',

                        top:
                          '50%',

                        transform:
                          'translate(-50%,-50%)',

                        width: 86,
                        height: 86,

                        borderRadius:
                          '50%',

                        display:
                          'grid',

                        placeItems:
                          'center',

                        bgcolor:
                          'rgba(220,255,241,.95)',

                        color:
                          '#079b69',

                        fontSize: 40,

                        fontWeight:
                          950,

                        boxShadow:
                          '0 0 70px rgba(90,255,199,.42)',

                        zIndex: 21
                      }}
                    >
                      ✓
                    </Box>
                  </>
                )}

                {/* FLASH */}

                {captureFlash && (
                  <Box
                    sx={{
                      position:
                        'absolute',

                      inset: 0,

                      bgcolor:
                        'rgba(180,255,225,.30)',

                      zIndex: 60,

                      pointerEvents:
                        'none'
                    }}
                  />
                )}
              </Box>

              {/* =================================================
                  CAMERA FOOTER
              ================================================= */}

              <Box
                sx={{
                  px: {
                    xs: 2,
                    md: 3
                  },

                  py: 2,

                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',

                  gap: 2,

                  flexWrap:
                    'wrap'
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 9,
                      height: 9,

                      borderRadius:
                        '50%',

                      bgcolor:
                        preparing
                          ? '#d2a84a'
                          : faceDetected
                            ? '#17b77d'
                            : '#b5c1bc',

                      boxShadow:
                        preparing
                          ? '0 0 15px rgba(210,168,74,.45)'
                          : faceDetected
                            ? '0 0 15px rgba(23,183,125,.65)'
                            : 'none',

                      transition:
                        'all .35s ease'
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 13,

                      fontWeight:
                        700,

                      color:
                        '#60776e'
                    }}
                  >
                    {preparing
                      ? 'Menyiapkan kamera'
                      : faceDetected
                        ? 'Wajah terdeteksi'
                        : 'Menunggu wajah'}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: 12,

                    color:
                      '#9aa9a4'
                  }}
                >
                  {preparing
                    ? `Scan dimulai dalam ${countdown}`
                    : 'Sistem bekerja otomatis'}
                </Typography>
              </Box>
            </Card>
          </Grow>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <Stack
            spacing={2.5}
            sx={{
              minWidth:
                0,

              width:
                '100%'
            }}
          >
            {/* =================================================
                BEFORE IDENTIFICATION
            ================================================= */}

            {!identifiedProfile && (
              <Grow
                in
                timeout={1000}
              >
                <Card
                  elevation={0}
                  sx={{
                    width:
                      '100%',

                    minWidth:
                      0,

                    borderRadius:
                      5,

                    overflow:
                      'hidden',

                    border:
                      '1px solid rgba(20,92,69,.10)',

                    boxShadow:
                      '0 22px 65px rgba(27,87,65,.08)'
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3.5,

                      '&:last-child': {
                        pb: 3.5
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,

                        borderRadius:
                          '50%',

                        display:
                          'grid',

                        placeItems:
                          'center',

                        bgcolor:
                          preparing
                            ? '#fff7df'
                            : '#e7f9f1',

                        color:
                          preparing
                            ? '#c7952f'
                            : '#10a06d',

                        mb: 2.5,

                        position:
                          'relative'
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,

                          borderRadius:
                            '50%',

                          border:
                            `2px solid ${
                              preparing
                                ? '#c7952f'
                                : '#18b77c'
                            }`
                        }}
                      />

                      <Box
                        sx={{
                          position:
                            'absolute',

                          width: 8,
                          height: 8,

                          borderRadius:
                            '50%',

                          bgcolor:
                            preparing
                              ? '#c7952f'
                              : '#18b77c'
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 24,

                        fontWeight:
                          900,

                        color:
                          '#18382f'
                      }}
                    >
                      {preparing
                        ? 'Menyiapkan Kamera'
                        : 'Menunggu Identifikasi'}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1.3,

                        fontSize: 14,

                        lineHeight:
                          1.7,

                        color:
                          '#7d9189'
                      }}
                    >
                      {preparing
                        ? 'Silakan posisikan wajah Anda dengan nyaman. Sistem akan mulai mengenali setelah hitungan selesai.'
                        : 'Belum ada identitas yang ditampilkan. Arahkan wajah Anda ke kamera dan sistem akan mengenali Anda secara otomatis.'}
                    </Typography>

                    {/* PREPARATION PROGRESS */}

                    {preparing && (
                      <Box
                        sx={{
                          mt: 3
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{
                            mb: .8
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: '#7d9189'
                            }}
                          >
                            Persiapan kamera
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 900,
                              color: '#bd8b25'
                            }}
                          >
                            {countdown}s
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            height: 7,
                            borderRadius: 99,
                            overflow: 'hidden',
                            bgcolor: '#f2eee1'
                          }}
                        >
                          <Box
                            sx={{
                              width:
                                `${((3 - countdown) / 3) * 100}%`,
                              height: '100%',
                              borderRadius: 99,
                              bgcolor: '#d3a53d',
                              transition:
                                'width .8s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {!preparing && (
                      <Box
                        sx={{
                          mt: 3,

                          p: 2,

                          borderRadius:
                            3,

                          bgcolor:
                            '#f5f9f7'
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.3}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 9,
                              height: 9,

                              borderRadius:
                                '50%',

                              bgcolor:
                                aiReady
                                  ? '#19b97e'
                                  : '#b5c1bc'
                            }}
                          />

                          <Box>
                            <Typography
                              sx={{
                                fontSize: 13,

                                fontWeight:
                                  800,

                                color:
                                  '#536a62'
                              }}
                            >
                              {aiReady
                                ? 'AI siap mengenali'
                                : 'Menyiapkan AI'}
                            </Typography>

                            <Typography
                              sx={{
                                mt: .2,

                                fontSize: 11,

                                color:
                                  '#96a59f'
                              }}
                            >
                              Tidak perlu menekan
                              tombol apa pun
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {!preparing && (
                      <Stack
                        spacing={1.4}
                        sx={{
                          mt: 3
                        }}
                      >
                        <SimpleStep
                          number="01"
                          text="Hadapkan wajah ke kamera"
                          active={
                            !faceDetected
                          }
                        />

                        <SimpleStep
                          number="02"
                          text="AI mengenali wajah"
                          active={
                            faceDetected
                          }
                        />

                        <SimpleStep
                          number="03"
                          text="Identitas dikonfirmasi"
                          active={
                            aiPhase ===
                            'matching'
                          }
                        />
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            )}

            {/* =================================================
                IDENTIFIED PROFILE
            ================================================= */}

            {identifiedProfile && (
              <>
                <Grow
                  in
                  timeout={500}
                >
                  <Card
                    elevation={0}
                    sx={{
                      width:
                        '100%',

                      minWidth:
                        0,

                      borderRadius:
                        5,

                      overflow:
                        'hidden',

                      border:
                        '1px solid rgba(20,183,123,.18)',

                      background:
                        'linear-gradient(145deg,#effcf6,#ffffff)',

                      boxShadow:
                        '0 25px 70px rgba(20,183,123,.10)'
                    }}
                  >
                    <Box
                      sx={{
                        px: 3,
                        py: 2,

                        background:
                          'linear-gradient(90deg,#dff9ed,#f7fffb)',

                        borderBottom:
                          '1px solid rgba(20,183,123,.10)'
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,

                            borderRadius:
                              '50%',

                            bgcolor:
                              '#16b77b',

                            boxShadow:
                              '0 0 14px rgba(22,183,123,.8)'
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 11,

                            fontWeight:
                              900,

                            color:
                              '#0d9565',

                            letterSpacing:
                              1.4
                          }}
                        >
                          IDENTITAS TERVERIFIKASI
                        </Typography>
                      </Stack>
                    </Box>

                    <CardContent
                      sx={{
                        p: 3,

                        '&:last-child': {
                          pb: 3
                        }
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Avatar
                          src={
                            AVATAR_URL
                          }
                          alt={
                            identifiedProfile.name
                          }
                          sx={{
                            width: 82,
                            height: 82,

                            flexShrink: 0,

                            border:
                              '4px solid #fff',

                            boxShadow:
                              '0 12px 35px rgba(25,116,83,.20)'
                          }}
                        />

                        <Box
                          sx={{
                            minWidth:
                              0
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 19,
                                md: 22
                              },

                              fontWeight:
                                900,

                              color:
                                '#18382f',

                              lineHeight:
                                1.15,

                              wordBreak:
                                'break-word'
                            }}
                          >
                            {
                              identifiedProfile.name
                            }
                          </Typography>

                          <Typography
                            sx={{
                              mt: .6,

                              fontSize: 13,

                              color:
                                '#71877e',

                              wordBreak:
                                'break-word'
                            }}
                          >
                            {
                              identifiedProfile.position
                            }
                          </Typography>

                          <Chip
                            size="small"
                            label="Peserta Aktif"
                            sx={{
                              mt: 1,

                              height: 27,

                              fontSize: 10,

                              fontWeight:
                                850,

                              bgcolor:
                                '#d9f8eb',

                              color:
                                '#0a9767'
                            }}
                          />
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          mt: 3,

                          display:
                            'grid',

                          gridTemplateColumns:
                            '1fr 1fr',

                          gap: 1.5
                        }}
                      >
                        <ProfileMini
                          label="ID PESERTA"
                          value={
                            identifiedProfile.employeeId
                          }
                        />

                        <ProfileMini
                          label="MATCH"
                          value={`${confidence.toFixed(
                            1
                          )}%`}
                          highlight
                        />

                        <ProfileMini
                          label="UNIT"
                          value={
                            identifiedProfile.department
                          }
                        />

                        <ProfileMini
                          label="LOKASI"
                          value={
                            identifiedProfile.location
                          }
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>

                {/* =================================================
                    TRAINING
                ================================================= */}

                <Grow
                  in
                  timeout={750}
                >
                  <Card
                    elevation={0}
                    sx={{
                      width:
                        '100%',

                      minWidth:
                        0,

                      borderRadius:
                        5,

                      border:
                        '1px solid rgba(20,92,69,.10)',

                      boxShadow:
                        '0 20px 55px rgba(27,87,65,.07)'
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,

                        '&:last-child': {
                          pb: 3
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,

                          fontWeight:
                            900,

                          letterSpacing:
                            1.4,

                          color:
                            '#159d6e',

                          mb: 1.4
                        }}
                      >
                        PELATIHAN PESERTA
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: {
                            xs: 19,
                            md: 21
                          },

                          fontWeight:
                            900,

                          lineHeight:
                            1.25,

                          color:
                            '#19382f'
                        }}
                      >
                        {
                          TRAINING.title
                        }
                      </Typography>

                      <Chip
                        label={
                          TRAINING.category
                        }
                        size="small"
                        sx={{
                          mt: 1.2,

                          height: 28,

                          fontSize: 10,

                          fontWeight:
                            800,

                          color:
                            '#118f64',

                          bgcolor:
                            '#e7f8f1'
                        }}
                      />

                      <Stack
                        spacing={1}
                        sx={{
                          mt: 2.2
                        }}
                      >
                        <TrainingInfo
                          label="Batch"
                          value={
                            TRAINING.batch
                          }
                        />

                        <TrainingInfo
                          label="Jadwal"
                          value={
                            TRAINING.schedule
                          }
                        />

                        <TrainingInfo
                          label="Lokasi"
                          value={
                            TRAINING.location
                          }
                        />

                        <TrainingInfo
                          label="Penyelenggara"
                          value={
                            TRAINING.organizer
                          }
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>

                {/* =================================================
                    SUCCESS
                ================================================= */}

                <Grow
                  in
                  timeout={1000}
                >
                  <Card
                    elevation={0}
                    sx={{
                      width:
                        '100%',

                      minWidth:
                        0,

                      borderRadius:
                        5,

                      background:
                        'linear-gradient(145deg,#eafbf3,#ffffff)',

                      border:
                        '1px solid rgba(20,183,123,.16)'
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,

                        '&:last-child': {
                          pb: 3
                        }
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,

                            flexShrink: 0,

                            borderRadius:
                              '50%',

                            display:
                              'grid',

                            placeItems:
                              'center',

                            bgcolor:
                              '#d8f8eb',

                            color:
                              '#0b9c69',

                            fontSize: 22,

                            fontWeight:
                              950
                          }}
                        >
                          ✓
                        </Box>

                        <Box
                          sx={{
                            minWidth:
                              0
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 17,

                              fontWeight:
                                900,

                              color:
                                '#19382f'
                            }}
                          >
                            Absensi Berhasil
                          </Typography>

                          <Typography
                            sx={{
                              mt: .3,

                              fontSize: 12,

                              color:
                                '#82958d'
                            }}
                          >
                            Dicatat pukul{' '}
                            {
                              attendanceTime
                            }
                          </Typography>
                        </Box>
                      </Stack>

                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={
                          handleRescan
                        }
                        sx={{
                          mt: 2.5,

                          height: 46,

                          borderRadius:
                            3,

                          textTransform:
                            'none',

                          fontWeight:
                            850,

                          borderColor:
                            '#b9ead6',

                          color:
                            '#0b9968',

                          '&:hover':
                            {
                              bgcolor:
                                '#effbf6',

                              borderColor:
                                '#0b9968'
                            }
                        }}
                      >
                        Scan Ulang
                      </Button>
                    </CardContent>
                  </Card>
                </Grow>
              </>
            )}
          </Stack>
        </Box>

        {/* =================================================
            FOOTER
        ================================================= */}

        <Box
          sx={{
            mt: 4,

            display:
              'flex',

            justifyContent:
              'space-between',

            alignItems:
              'center',

            gap: 2,

            flexWrap:
              'wrap'
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color:
                '#9aa9a4'
            }}
          >
            DISKOP • Smart Attendance
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color:
                '#9aa9a4'
            }}
          >
            Sistem Absensi Kehadiran
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SimpleStep({
                      number,
                      text,
                      active
                    }: {
  number: string
  text: string
  active: boolean
}) {
  return (
    <Stack
      direction="row"
      spacing={1.3}
      alignItems="center"
    >
      <Box
        sx={{
          width: 30,
          height: 30,

          flexShrink: 0,

          borderRadius:
            '50%',

          display:
            'grid',

          placeItems:
            'center',

          bgcolor:
            active
              ? '#ddf9ed'
              : '#f2f5f3',

          color:
            active
              ? '#0b9c69'
              : '#9baaa5',

          fontSize: 10,

          fontWeight:
            900,

          transition:
            'all .3s ease'
        }}
      >
        {number}
      </Box>

      <Typography
        sx={{
          minWidth:
            0,

          fontSize: 13,

          fontWeight:
            active
              ? 800
              : 600,

          color:
            active
              ? '#526960'
              : '#9aa8a3'
        }}
      >
        {text}
      </Typography>
    </Stack>
  )
}

function ProfileMini({
                       label,
                       value,
                       highlight
                     }: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <Box
      sx={{
        minWidth:
          0,

        p: 1.5,

        borderRadius:
          2.5,

        bgcolor:
          highlight
            ? '#e9faf3'
            : '#f6faf8'
      }}
    >
      <Typography
        sx={{
          fontSize: 9,

          fontWeight:
            800,

          color:
            '#9aa9a4',

          letterSpacing:
            .7,

          mb: .4
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          minWidth:
            0,

          fontSize: 12,

          fontWeight:
            800,

          color:
            highlight
              ? '#0c9d6b'
              : '#435b53',

          overflow:
            'hidden',

          textOverflow:
            'ellipsis',

          whiteSpace:
            'nowrap'
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function TrainingInfo({
                        label,
                        value
                      }: {
  label: string
  value: string
}) {
  return (
    <Box
      sx={{
        minWidth:
          0,

        display:
          'flex',

        justifyContent:
          'space-between',

        alignItems:
          'flex-start',

        gap: 2,

        p: 1.3,

        borderRadius:
          2.5,

        bgcolor:
          '#f6faf8'
      }}
    >
      <Typography
        sx={{
          flexShrink:
            0,

          fontSize: 11,

          color:
            '#9aa9a4'
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          minWidth:
            0,

          fontSize: 12,

          fontWeight:
            750,

          color:
            '#455d54',

          textAlign:
            'right',

          overflowWrap:
            'anywhere'
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

// @ts-ignore
import * as faceapi from 'face-api.js'

let loaded = false

export async function loadFaceModels() {
  if (loaded) return

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
  ])

  loaded = true
}

export async function detectFace(
  video: HTMLVideoElement
) {
  return faceapi
    .detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor()
}

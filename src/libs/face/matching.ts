import * as faceapi from 'face-api.js'

export function findBestMatch(
  queryDescriptor: Float32Array,
  registeredDescriptors: number[][],
  threshold = 0.5
) {
  if (!registeredDescriptors.length) {
    return {
      matched: false,
      distance: Infinity,
      index: -1,
      confidence: 0
    }
  }

  let bestDistance = Infinity
  let bestIndex = -1

  registeredDescriptors.forEach(
    (descriptor, index) => {
      const distance =
        faceapi.euclideanDistance(
          queryDescriptor,
          new Float32Array(descriptor)
        )

      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    }
  )

  /*
   * Convert distance menjadi nilai
   * confidence untuk UI.
   *
   * Ini hanya confidence visual POC,
   * bukan probabilitas statistik.
   */
  const confidence = Math.max(
    0,
    Math.min(
      100,
      (1 - bestDistance) * 100
    )
  )

  return {
    matched:
      bestDistance <= threshold,
    distance: bestDistance,
    index: bestIndex,
    confidence
  }
}

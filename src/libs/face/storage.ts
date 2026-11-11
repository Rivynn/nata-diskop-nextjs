import type { FaceProfile } from './profile'

const STORAGE_KEY = 'diskop_face_descriptors'
const PROFILE_KEY = 'diskop_face_profile'

export function saveFaceDescriptors(
  descriptors: number[][]
) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(descriptors)
  )
}

export function getFaceDescriptors(): number[][] {
  if (typeof window === 'undefined') {
    return []
  }

  const data = localStorage.getItem(
    STORAGE_KEY
  )

  if (!data) {
    return []
  }

  try {
    return JSON.parse(data) as number[][]
  } catch {
    return []
  }
}

export function clearFaceDescriptors() {
  if (typeof window === 'undefined') return

  localStorage.removeItem(STORAGE_KEY)
}

export function saveFaceProfile(
  profile: FaceProfile
) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile)
  )
}

export function getFaceProfile():
  | FaceProfile
  | null {
  if (typeof window === 'undefined') {
    return null
  }

  const data = localStorage.getItem(
    PROFILE_KEY
  )

  if (!data) {
    return null
  }

  try {
    return JSON.parse(data) as FaceProfile
  } catch {
    return null
  }
}

export function clearFaceProfile() {
  if (typeof window === 'undefined') return

  localStorage.removeItem(PROFILE_KEY)
}

export type FaceProfile = {
  id: string
  employeeId: string
  name: string
  username: string
  email: string
  department: string
  position: string
  location: string
}

const PROFILE_STORAGE_KEY = 'diskop_face_profile'

export function saveFaceProfile(profile: FaceProfile) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile)
  )
}

export function getFaceProfile(): FaceProfile | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(
    PROFILE_STORAGE_KEY
  )

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as FaceProfile
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY)

    return null
  }
}

export function clearFaceProfile() {
  if (typeof window === 'undefined') return

  localStorage.removeItem(PROFILE_STORAGE_KEY)
}

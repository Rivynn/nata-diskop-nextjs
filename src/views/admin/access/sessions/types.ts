export type SessionStatus = 'active' | 'idle'

export type SessionDevice =
  | 'desktop'
  | 'mobile'
  | 'tablet'

export type SessionType = {
  id: number

  userId: number

  user: {
    name: string
    username: string
    avatar: string
    role: 'admin' | 'pegawai' | 'pelatih' | 'peserta' | 'mitra'
  }

  device: SessionDevice

  operatingSystem: string

  browser: string

  ipAddress: string

  location: string

  loginAt: string

  lastActivityAt: string

  status: SessionStatus

  isCurrent: boolean
}

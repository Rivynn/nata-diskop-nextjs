export type ActivityAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'verify'
  | 'change_role'
  | 'change_password'
  | 'publish'
  | 'unpublish'

export type ActivityStatus =
  | 'success'
  | 'failed'

export type ActivityRole =
  | 'admin'
  | 'pegawai'
  | 'pelatih'
  | 'peserta'
  | 'mitra'

export type ActivityType = {
  id: number

  user: {
    id: number
    name: string
    username: string
    avatar: string
    role: ActivityRole
  }

  action: ActivityAction

  activity: string

  module: string

  target: {
    type: string
    id: string
    name: string
  } | null

  description: string

  metadata?: {
    before?: string | null
    after?: string | null
  }

  ipAddress: string

  location: string

  device: string

  browser: string

  createdAt: string

  status: ActivityStatus
}

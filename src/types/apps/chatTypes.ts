
import type { ThemeColor } from '@core/types'

export type StatusType = 'busy' | 'away' | 'online' | 'offline'

export type StatusObjType = Record<StatusType, ThemeColor>

export type ChatRoleType = 'admin' | 'trainer' | 'participant' | 'employee'

export type ConversationType = 'direct' | 'group'

export type ProfileUserType = {
  id: number
  role: string
  about: string
  avatar: string
  fullName: string
  status: StatusType
  settings: {
    isNotificationsOn: boolean
    isTwoStepAuthVerificationEnabled: boolean
  }
}

export type ContactType = {
  id: number
  fullName: string
  role: string
  about: string
  avatar?: string
  avatarColor?: ThemeColor
  status: StatusType

  // Identitas pengguna dalam aplikasi pelatihan
  userRole?: ChatRoleType
  department?: string
  email?: string
}

export type UserChatType = {
  message: string
  time: string | Date
  senderId: number
  msgStatus?: Record<'isSent' | 'isDelivered' | 'isSeen', boolean>
}

export type ChatType = {
  id: number

  /**
   * Kompatibilitas dengan struktur chat personal Vuexy.
   * Untuk grup, userId dapat berisi ID pembuat atau kontak utama.
   */
  userId: number

  unseenMsgs: number
  chat: UserChatType[]

  // Jenis percakapan
  type?: ConversationType

  // Nama dan avatar khusus grup
  name?: string
  avatar?: string
  avatarColor?: ThemeColor
  description?: string

  // Anggota percakapan, termasuk admin
  participantIds?: number[]

  // Hubungan dengan program pelatihan
  trainingId?: number
  trainingName?: string

  // ID pengguna yang membuat grup
  createdBy?: number
}

export type ChatDataType = {
  profileUser: ProfileUserType
  contacts: ContactType[]
  chats: ChatType[]
  activeUser?: ContactType
  activeChat?: ChatType
}

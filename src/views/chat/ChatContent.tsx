
'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import type { RefObject } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Type Imports
import type { AppDispatch } from '@/redux-store'
import type { ChatDataType, ContactType } from '@/types/apps/chatTypes'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import AvatarWithBadge from './AvatarWithBadge'
import { statusObj } from './SidebarLeft'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'
import UserProfileRight from './UserProfileRight'

type ConversationType = 'direct' | 'group'

type ActiveConversation = {
  chatId: number
  type: ConversationType
} | null

type Conversation = ChatDataType['chats'][number]

type Props = {
  chatStore: ChatDataType
  dispatch: AppDispatch
  backdropOpen: boolean
  setBackdropOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
  isBelowMdScreen: boolean
  isBelowLgScreen: boolean
  isBelowSmScreen: boolean
  messageInputRef: RefObject<HTMLDivElement>
  activeConversation?: ActiveConversation
}

const getConversationType = (chat: Conversation): ConversationType =>
  chat.type === 'group' ? 'group' : 'direct'

const getLastMessage = (chat: Conversation) =>
  chat.chat.length ? chat.chat[chat.chat.length - 1] : null

const getGroupMembers = (
  chat: Conversation,
  chatStore: ChatDataType
): ContactType[] => {
  const participantIds = chat.participantIds ?? []

  return participantIds
    .map(id => {
      if (id === chatStore.profileUser.id) {
        return {
          id,
          fullName: chatStore.profileUser.fullName,
          role: chatStore.profileUser.role,
          avatar: chatStore.profileUser.avatar,
          status: chatStore.profileUser.status,
          about: chatStore.profileUser.about
        } as ContactType
      }

      return chatStore.contacts.find(contact => contact.id === id)
    })
    .filter((contact): contact is ContactType => Boolean(contact))
}

const getGroupSender = (senderId: number, chatStore: ChatDataType) => {
  if (senderId === chatStore.profileUser.id) {
    return chatStore.profileUser.fullName
  }

  return (
    chatStore.contacts.find(contact => contact.id === senderId)?.fullName ??
    'Anggota'
  )
}

const UserAvatar = ({
                      activeUser,
                      setUserProfileLeftOpen,
                      setBackdropOpen
                    }: {
  activeUser: ContactType
  setUserProfileLeftOpen: (open: boolean) => void
  setBackdropOpen: (open: boolean) => void
}) => (
  <div
    className='flex cursor-pointer items-center gap-4'
    onClick={() => {
      setUserProfileLeftOpen(true)
      setBackdropOpen(true)
    }}
  >
    <AvatarWithBadge
      alt={activeUser.fullName}
      src={activeUser.avatar}
      color={activeUser.avatarColor}
      badgeColor={statusObj[activeUser.status || 'offline']}
    />

    <div className='min-w-0'>
      <Typography color='text.primary' className='truncate font-medium'>
        {activeUser.fullName}
      </Typography>

      <Typography variant='body2' color='text.secondary'>
        {activeUser.role}
      </Typography>
    </div>
  </div>
)

const ChatContent = (props: Props) => {
  const {
    chatStore,
    dispatch,
    backdropOpen,
    setBackdropOpen,
    setSidebarOpen,
    isBelowMdScreen,
    isBelowSmScreen,
    isBelowLgScreen,
    messageInputRef,
    activeConversation
  } = props

  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)

  const selectedChat = useMemo(() => {
    if (activeConversation) {
      return (
        chatStore.chats.find(
          chat => chat.id === activeConversation.chatId
        ) ?? null
      )
    }

    if (chatStore.activeUser) {
      return (
        chatStore.chats.find(
          chat =>
            chat.type !== 'group' &&
            chat.userId === chatStore.activeUser?.id
        ) ?? null
      )
    }

    return null
  }, [activeConversation, chatStore.chats, chatStore.activeUser])

  const isGroup = selectedChat
    ? getConversationType(selectedChat) === 'group'
    : false

  const activeUser = useMemo(() => {
    if (!selectedChat || isGroup) return null

    return (
      chatStore.contacts.find(
        contact => contact.id === selectedChat.userId
      ) ??
      chatStore.activeUser ??
      null
    )
  }, [selectedChat, isGroup, chatStore.contacts, chatStore.activeUser])

  const groupMembers = useMemo(() => {
    if (!selectedChat || !isGroup) return []

    return getGroupMembers(selectedChat, chatStore)
  }, [selectedChat, isGroup, chatStore])

  useEffect(() => {
    if (!backdropOpen && userProfileRightOpen) {
      setUserProfileRightOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  useEffect(() => {
    setUserProfileRightOpen(false)
  }, [selectedChat?.id])

  const handleOpenSidebar = () => {
    setSidebarOpen(true)
    setBackdropOpen(true)
  }

  const handleOpenProfile = () => {
    setUserProfileRightOpen(true)
    setBackdropOpen(true)
  }

  const menuOptions = isGroup
    ? [
      {
        text: 'Lihat anggota',
        menuItemProps: {
          onClick: handleOpenProfile
        }
      },
      'Mute Notifications',
      'Clear Chat'
    ]
    : [
      {
        text: 'View Contact',
        menuItemProps: {
          onClick: handleOpenProfile
        }
      },
      'Mute Notifications',
      'Block Contact',
      'Clear Chat',
      'Block'
    ]

  if (!selectedChat) {
    return (
      <CardContent className='flex flex-auto flex-col items-center justify-center gap-[18px] bg-backgroundChat'>
        <CustomAvatar
          variant='circular'
          size={98}
          color='primary'
          skin='light'
        >
          <i className='tabler-message-2 text-[50px]' />
        </CustomAvatar>

        <Typography className='text-center'>
          Pilih kontak atau grup untuk memulai percakapan.
        </Typography>

        {isBelowMdScreen && (
          <Button
            variant='contained'
            className='rounded-full'
            onClick={handleOpenSidebar}
          >
            Pilih Percakapan
          </Button>
        )}
      </CardContent>
    )
  }

  return (
    <>
      <div className='flex min-w-0 flex-auto flex-col bs-full bg-backgroundChat'>
        {/* Conversation Header */}
        <div className='flex items-center justify-between gap-3 border-be bg-backgroundPaper px-4 py-4 sm:px-6'>
          <div className='flex min-w-0 items-center gap-3'>
            {isBelowMdScreen && (
              <IconButton
                color='secondary'
                onClick={handleOpenSidebar}
                aria-label='Buka daftar percakapan'
              >
                <i className='tabler-menu-2' />
              </IconButton>
            )}

            {isGroup ? (
              <Box
                onClick={handleOpenProfile}
                className='flex cursor-pointer items-center gap-3'
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <i className='tabler-users-group text-2xl' />
                </Avatar>

                <div className='min-w-0'>
                  <Typography
                    color='text.primary'
                    className='truncate font-semibold'
                  >
                    {selectedChat.name ||
                      selectedChat.trainingName ||
                      'Grup Pelatihan'}
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    {groupMembers.length ||
                      selectedChat.participantIds?.length ||
                      0}{' '}
                    anggota
                    {selectedChat.trainingName
                      ? ` · ${selectedChat.trainingName}`
                      : ''}
                  </Typography>
                </div>
              </Box>
            ) : activeUser ? (
              <UserAvatar
                activeUser={activeUser}
                setUserProfileLeftOpen={setUserProfileRightOpen}
                setBackdropOpen={setBackdropOpen}
              />
            ) : null}
          </div>

          <div className='flex shrink-0 items-center gap-1'>
            {!isGroup && !isBelowMdScreen && (
              <>
                <IconButton color='secondary' aria-label='Panggilan suara'>
                  <i className='tabler-phone' />
                </IconButton>

                <IconButton color='secondary' aria-label='Panggilan video'>
                  <i className='tabler-video' />
                </IconButton>

                <IconButton color='secondary' aria-label='Cari pesan'>
                  <i className='tabler-search' />
                </IconButton>
              </>
            )}

            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-secondary'
              options={menuOptions}
            />
          </div>
        </div>

        {/* Group Information */}
        {isGroup && (
          <div className='border-be bg-backgroundPaper px-5 py-3'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex min-w-0 items-center gap-2'>
                <i className='tabler-users text-lg text-textSecondary' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='truncate'
                >
                  Anggota pelatihan
                </Typography>
              </div>

              <Button
                size='small'
                onClick={handleOpenProfile}
                startIcon={<i className='tabler-users' />}
              >
                Lihat semua
              </Button>
            </div>

            <div className='mt-2 flex items-center gap-2'>
              <AvatarGroup max={6} sx={{ justifyContent: 'flex-start' }}>
                {groupMembers.map(member => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    alt={member.fullName}
                    sx={{ width: 30, height: 30, fontSize: 12 }}
                  >
                    {member.fullName?.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>

              <Typography variant='caption' color='text.secondary'>
                Admin, pelatih, dan peserta
              </Typography>
            </div>
          </div>
        )}

        {/* Conversation Messages */}
        {isGroup ? (
          <div className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
            <div className='flex flex-col gap-4 p-4 sm:p-6'>
              <div className='mx-auto max-w-md rounded-xl bg-backgroundPaper px-4 py-3 text-center'>
                <i className='tabler-users-group mb-1 text-2xl text-primary' />

                <Typography variant='body2' className='font-medium'>
                  {selectedChat.name ||
                    selectedChat.trainingName ||
                    'Grup Pelatihan'}
                </Typography>

                <Typography variant='caption' color='text.secondary'>
                  Percakapan bersama admin, pelatih, dan peserta pelatihan.
                </Typography>
              </div>

              {selectedChat.chat.map((message, index) => {
                const isOwnMessage =
                  message.senderId === chatStore.profileUser.id

                const sender = chatStore.contacts.find(
                  contact => contact.id === message.senderId
                )

                return (
                  <div
                    key={`${selectedChat.id}-${index}`}
                    className={`flex items-end gap-2 ${
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isOwnMessage && (
                      <Avatar
                        src={sender?.avatar}
                        alt={sender?.fullName || 'Anggota'}
                        sx={{ width: 30, height: 30 }}
                      >
                        {sender?.fullName?.charAt(0) || '?'}
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isOwnMessage
                          ? 'rounded-br-sm bg-primary text-white'
                          : 'rounded-bl-sm bg-backgroundPaper'
                      }`}
                    >
                      {!isOwnMessage && (
                        <Typography
                          variant='caption'
                          className='mb-1 block font-semibold'
                          color='primary'
                        >
                          {getGroupSender(message.senderId, chatStore)}
                          {sender?.role ? ` · ${sender.role}` : ''}
                        </Typography>
                      )}

                      <Typography
                        variant='body2'
                        sx={{
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {message.message}
                      </Typography>

                      <div className='mt-1 flex justify-end'>
                        <Typography
                          variant='caption'
                          sx={{
                            opacity: 0.7,
                            color: isOwnMessage ? 'white' : 'text.secondary'
                          }}
                        >
                          {new Date(message.time).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )
              })}

              {!selectedChat.chat.length && (
                <div className='py-10 text-center'>
                  <Typography variant='body2' color='text.secondary'>
                    Belum ada pesan di grup ini. Mulai percakapan bersama
                    anggota pelatihan.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ChatLog
            chatStore={chatStore}
            isBelowMdScreen={isBelowMdScreen}
            isBelowSmScreen={isBelowSmScreen}
            isBelowLgScreen={isBelowLgScreen}
          />
        )}

        {/* Composer: digunakan oleh chat personal dan grup */}
        <SendMsgForm
          dispatch={dispatch}
          activeUser={activeUser ?? undefined}
          activeConversation={
            activeConversation
              ? {
                chatId: selectedChat.id,
                type: isGroup ? 'group' : 'direct'
              }
              : {
                chatId: selectedChat.id,
                type: isGroup ? 'group' : 'direct'
              }
          }
          isBelowSmScreen={isBelowSmScreen}
          messageInputRef={messageInputRef}
        />
      </div>

      {/* Profile / Group Members Panel */}
      {isGroup ? (
        userProfileRightOpen && (
          <div className='absolute inset-y-0 right-0 z-20 flex w-full max-w-[350px] flex-col border-s bg-backgroundPaper shadow-xl'>
            <div className='flex items-center justify-between border-be p-4'>
              <Typography variant='h6'>Anggota Grup</Typography>

              <IconButton
                onClick={() => {
                  setUserProfileRightOpen(false)
                  setBackdropOpen(false)
                }}
                aria-label='Tutup anggota grup'
              >
                <i className='tabler-x' />
              </IconButton>
            </div>

            <div className='overflow-y-auto p-4'>
              <Typography
                variant='body2'
                color='text.secondary'
                className='mb-3'
              >
                {groupMembers.length} anggota · Admin, pelatih, dan peserta
              </Typography>

              <div className='flex flex-col gap-3'>
                {groupMembers.map(member => (
                  <div key={member.id} className='flex items-center gap-3'>
                    <Avatar
                      src={member.avatar}
                      alt={member.fullName}
                      sx={{ width: 40, height: 40 }}
                    >
                      {member.fullName?.charAt(0)}
                    </Avatar>

                    <div className='min-w-0 flex-1'>
                      <Typography
                        variant='body2'
                        className='truncate font-medium'
                      >
                        {member.fullName}
                      </Typography>

                      <Typography variant='caption' color='text.secondary'>
                        {member.role}
                      </Typography>
                    </div>

                    {member.id === chatStore.profileUser.id && (
                      <Chip size='small' label='Anda' variant='tonal' />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : activeUser ? (
        <UserProfileRight
          open={userProfileRightOpen}
          handleClose={() => {
            setUserProfileRightOpen(false)
            setBackdropOpen(false)
          }}
          activeUser={activeUser}
          isBelowSmScreen={isBelowSmScreen}
          isBelowLgScreen={isBelowLgScreen}
        />
      ) : null}
    </>
  )
}

export default ChatContent

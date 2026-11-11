'use client'

// React Imports
import { useMemo, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { ChatDataType, StatusObjType } from '@/types/apps/chatTypes'
import type { AppDispatch } from '@/redux-store'

// Slice Imports
import { addNewChat } from '@/redux-store/slices/chat'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import UserProfileLeft from './UserProfileLeft'
import AvatarWithBadge from './AvatarWithBadge'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { formatDateToMonthShort } from './utils'

export const statusObj: StatusObjType = {
  busy: 'error',
  away: 'warning',
  online: 'success',
  offline: 'secondary'
}

type ConversationType = 'direct' | 'group'

type Conversation = ChatDataType['chats'][number]

type Props = {
  chatStore: ChatDataType
  getActiveUserData: (id: number) => void
  dispatch: AppDispatch
  backdropOpen: boolean
  setBackdropOpen: (value: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  isBelowLgScreen: boolean
  isBelowMdScreen: boolean
  isBelowSmScreen: boolean
  messageInputRef: RefObject<HTMLDivElement>
  onSelectConversation?: (chatId: number, type: ConversationType) => void
}

type RenderChatProps = {
  chatStore: ChatDataType
  conversations: Conversation[]
  getActiveUserData: (id: number) => void
  onSelectConversation?: (chatId: number, type: ConversationType) => void
  setSidebarOpen: (value: boolean) => void
  backdropOpen: boolean
  setBackdropOpen: (value: boolean) => void
  isBelowMdScreen: boolean
  activeConversationId: number | null
  searchValue: string
}

const getConversationType = (chat: Conversation): ConversationType =>
  chat.type === 'group' ? 'group' : 'direct'

const getLastMessage = (chat: Conversation) =>
  chat.chat.length > 0 ? chat.chat[chat.chat.length - 1] : null

const getConversationName = (
  chat: Conversation,
  contacts: ChatDataType['contacts']
) => {
  if (getConversationType(chat) === 'group') {
    return chat.name || chat.trainingName || 'Grup Pelatihan'
  }

  return (
    contacts.find(contact => contact.id === chat.userId)?.fullName ||
    'Pengguna'
  )
}

const getContact = (
  chat: Conversation,
  contacts: ChatDataType['contacts']
) => contacts.find(contact => contact.id === chat.userId)

const getGroupMemberCount = (chat: Conversation) =>
  chat.participantIds?.length ?? 0

const getSenderName = (
  chat: Conversation,
  chatStore: ChatDataType
) => {
  const lastMessage = getLastMessage(chat)

  if (!lastMessage) return ''

  if (lastMessage.senderId === chatStore.profileUser.id) {
    return 'Anda'
  }

  const sender = chatStore.contacts.find(
    contact => contact.id === lastMessage.senderId
  )

  return sender?.fullName || 'Anggota'
}

const getMessagePreview = (
  chat: Conversation,
  chatStore: ChatDataType
) => {
  const lastMessage = getLastMessage(chat)

  if (!lastMessage) {
    return getConversationType(chat) === 'group'
      ? 'Mulai percakapan dengan anggota grup'
      : getContact(chat, chatStore.contacts)?.role || 'Belum ada pesan'
  }

  if (getConversationType(chat) === 'group') {
    return `${getSenderName(chat, chatStore)}: ${lastMessage.message}`
  }

  return lastMessage.message
}

const getMessageTimestamp = (chat: Conversation) => {
  const lastMessage = getLastMessage(chat)

  if (!lastMessage) return 0

  const timestamp = new Date(lastMessage.time).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

// Conversation item
const ConversationItem = ({
  chat,
  chatStore,
  active,
  onClick
}: {
  chat: Conversation
  chatStore: ChatDataType
  active: boolean
  onClick: () => void
}) => {
  const isGroup = getConversationType(chat) === 'group'
  const contact = getContact(chat, chatStore.contacts)
  const name = getConversationName(chat, chatStore.contacts)
  const lastMessage = getLastMessage(chat)
  const memberCount = getGroupMemberCount(chat)

  return (
    <li
      onClick={onClick}
      className={classnames(
        'group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200',
        {
          'bg-primary text-white shadow-lg shadow-primary/20': active,
          'hover:bg-actionHover': !active
        }
      )}
    >
      {isGroup ? (
        <Box
          className={classnames(
            'relative flex shrink-0 items-center justify-center rounded-full',
            active ? 'bg-white/20' : 'bg-primary/10'
          )}
          sx={{ width: 46, height: 46 }}
        >
          <i
            className='tabler-users-group text-2xl'
            style={{
              color: active
                ? '#fff'
                : 'var(--mui-palette-primary-main)'
            }}
          />

          {chat.unseenMsgs > 0 && (
            <Box
              className='absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-error text-white'
              sx={{
                minWidth: 19,
                height: 19,
                px: 0.5,
                fontSize: 10,
                fontWeight: 700,
                border: '2px solid var(--mui-palette-background-paper)'
              }}
            >
              {chat.unseenMsgs > 99 ? '99+' : chat.unseenMsgs}
            </Box>
          )}
        </Box>
      ) : contact ? (
        <AvatarWithBadge
          src={contact.avatar}
          isChatActive={active}
          alt={contact.fullName}
          badgeColor={statusObj[contact.status]}
          color={contact.avatarColor}
        />
      ) : (
        <CustomAvatar skin='light' color='secondary'>
          {getInitials(name)}
        </CustomAvatar>
      )}

      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <Typography
            variant='body1'
            color={active ? 'inherit' : 'text.primary'}
            className='truncate font-medium'
          >
            {name}
          </Typography>

          <Typography
            variant='caption'
            color={active ? 'inherit' : 'text.disabled'}
            className='shrink-0'
          >
            {lastMessage
              ? formatDateToMonthShort(lastMessage.time)
              : ''}
          </Typography>
        </div>

        {isGroup && (
          <div className='mt-0.5 flex min-w-0 items-center gap-1'>
            <i
              className={`tabler-users text-xs ${
  active ? 'text-white/80' : 'text-textSecondary'
}`}
            />

            <Typography
              variant='caption'
              color={active ? 'inherit' : 'text.secondary'}
              className='shrink-0'
            >
              {memberCount} anggota
            </Typography>

            {chat.trainingName && (
              <>
                <span className={active ? 'text-white/60' : 'text-textDisabled'}>
                  ·
                </span>

                <Typography
                  variant='caption'
                  color={active ? 'inherit' : 'text.secondary'}
                  className='truncate'
                >
                  {chat.trainingName}
                </Typography>
              </>
            )}
          </div>
        )}

        <Typography
          variant='body2'
          color={active ? 'inherit' : 'text.secondary'}
          className='mt-0.5 truncate'
          sx={{ opacity: active ? 0.9 : 0.85 }}
        >
          {getMessagePreview(chat, chatStore)}
        </Typography>
      </div>

      {chat.unseenMsgs > 0 && !isGroup && (
        <Box
          className='flex shrink-0 items-center justify-center rounded-full bg-error text-white'
          sx={{
            minWidth: 20,
            height: 20,
            px: 0.75,
            fontSize: 10,
            fontWeight: 700
          }}
        >
          {chat.unseenMsgs > 99 ? '99+' : chat.unseenMsgs}
        </Box>
      )}
    </li>
  )
}

// Scroll wrapper
const ScrollWrapper = ({
  children,
  isBelowLgScreen
}: {
  children: ReactNode
  isBelowLgScreen: boolean
}) => {
  if (isBelowLgScreen) {
    return (
      <div className='bs-full overflow-y-auto overflow-x-hidden'>
        {children}
      </div>
    )
  }

  return (
    <PerfectScrollbar options={{ wheelPropagation: false }}>
      {children}
    </PerfectScrollbar>
  )
}

const SidebarLeft = (props: Props) => {
  const {
    chatStore,
    getActiveUserData,
    dispatch,
    backdropOpen,
    setBackdropOpen,
    sidebarOpen,
    setSidebarOpen,
    isBelowLgScreen,
    isBelowMdScreen,
    isBelowSmScreen,
    messageInputRef,
    onSelectConversation
  } = props

  const [userSidebar, setUserSidebar] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const conversations = useMemo(
    () => chatStore.chats || [],
    [chatStore.chats]
  )

  const activeConversationId = useMemo(() => {
    const activeChat = (
      chatStore as ChatDataType & {
        activeChat?: Conversation
      }
    ).activeChat

    if (activeChat?.id != null) return activeChat.id

    const activeUserId = chatStore.activeUser?.id

    if (activeUserId == null) return null

    return (
      conversations.find(
        chat =>
          getConversationType(chat) === 'direct' &&
          chat.userId === activeUserId
      )?.id ?? null
    )
  }, [chatStore, conversations])

  const filteredConversations = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return [...conversations]
      .filter(chat => {
        const name = getConversationName(
          chat,
          chatStore.contacts
        ).toLowerCase()

        const preview = getMessagePreview(
          chat,
          chatStore
        ).toLowerCase()

        return !query || name.includes(query) || preview.includes(query)
      })
      .sort((a, b) => {
        return getMessageTimestamp(b) - getMessageTimestamp(a)
      })
  }, [conversations, chatStore, searchValue])

  const matchingContacts = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) return []

    return chatStore.contacts
      .filter(contact =>
        contact.fullName.toLowerCase().includes(query)
      )
      .slice(0, 5)
  }, [chatStore.contacts, searchValue])

  const handleSelectConversation = (chat: Conversation) => {
    const type = getConversationType(chat)

    if (onSelectConversation) {
      onSelectConversation(chat.id, type)
    } else if (type === 'direct') {
      getActiveUserData(chat.userId)
    }

    if (isBelowMdScreen) {
      setSidebarOpen(false)
    }

    if (isBelowMdScreen && backdropOpen) {
      setBackdropOpen(false)
    }
  }

  const handleSelectContact = (contactId: number) => {
    dispatch(addNewChat({ id: contactId }))
    getActiveUserData(contactId)
    setSearchValue('')

    if (isBelowMdScreen) {
      setSidebarOpen(false)
    }

    setBackdropOpen(false)

    requestAnimationFrame(() => {
      messageInputRef.current?.focus()
    })
  }

  return (
    <>
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className='bs-full'
        variant={!isBelowMdScreen ? 'permanent' : 'persistent'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true
        }}
        sx={{
          zIndex: isBelowMdScreen && sidebarOpen ? 11 : 10,
          position: !isBelowMdScreen ? 'static' : 'absolute',
          ...(isBelowSmScreen && sidebarOpen && { width: '100%' }),
          '& .MuiDrawer-paper': {
            overflow: 'hidden',
            boxShadow: 'none',
            width: isBelowSmScreen ? '100%' : '370px',
            position: !isBelowMdScreen ? 'static' : 'absolute',
            bgcolor: 'background.paper',
            borderRight: '1px solid var(--mui-palette-divider)'
          }
        }}
      >
        {/* Profile header */}
        <div className='flex items-center gap-3 border-be px-5 py-4'>
          <AvatarWithBadge
            alt={chatStore.profileUser.fullName}
            src={chatStore.profileUser.avatar}
            badgeColor={statusObj[chatStore.profileUser.status]}
            onClick={() => setUserSidebar(true)}
          />

          <div className='min-w-0 flex-1'>
            <Typography variant='subtitle1' className='truncate font-semibold'>
              Pesan
            </Typography>

            <Typography variant='caption' color='text.secondary'>
              Chat dan grup pelatihan
            </Typography>
          </div>

          <IconButton
            size='small'
            aria-label='Percakapan baru'
            onClick={() => {
              setSearchValue('')
              messageInputRef.current?.focus()
            }}
          >
            <i className='tabler-edit text-xl' />
          </IconButton>

          {isBelowMdScreen && (
            <IconButton
              size='small'
              onClick={() => {
                setSidebarOpen(false)
                setBackdropOpen(false)
              }}
            >
              <i className='tabler-x text-xl' />
            </IconButton>
          )}
        </div>

        {/* Search */}
        <div className='border-be px-4 py-3'>
          <TextField
            fullWidth
            size='small'
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)}
            placeholder='Cari kontak atau grup...'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-lg' />
                  </InputAdornment>
                ),
                endAdornment: searchValue ? (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      edge='end'
                      aria-label='Hapus pencarian'
                      onClick={() => setSearchValue('')}
                    >
                      <i className='tabler-x text-base' />
                    </IconButton>
                  </InputAdornment>
                ) : undefined
              }
            }}
          />

          {searchValue.trim() && (
            <div className='mt-2 flex flex-col gap-1'>
              {matchingContacts.map(contact => (
                <button
                  key={`contact-${contact.id}`}
                  type='button'
                  onClick={() => handleSelectContact(contact.id)}
                  className='flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-actionHover'
                >
                  {contact.avatar ? (
                    <Avatar
                      src={contact.avatar}
                      alt={contact.fullName}
                      sx={{ width: 36, height: 36 }}
                    />
                  ) : (
                    <CustomAvatar
                      skin='light'
                      color={(contact.avatarColor || 'secondary') as ThemeColor}
                      size={36}
                    >
                      {getInitials(contact.fullName)}
                    </CustomAvatar>
                  )}

                  <div className='min-w-0 flex-1'>
                    <Typography
                      variant='body2'
                      className='truncate font-medium'
                    >
                      {contact.fullName}
                    </Typography>

                    <Typography variant='caption' color='text.secondary'>
                      {contact.role}
                    </Typography>
                  </div>

                  <i className='tabler-message-plus text-lg text-textSecondary' />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unified conversation list */}
        <ScrollWrapper isBelowLgScreen={isBelowLgScreen}>
          <ul className='flex flex-col gap-1 p-3'>
            {filteredConversations.map(chat => (
              <ConversationItem
                key={`${getConversationType(chat)}-${chat.id}`}
                chat={chat}
                chatStore={chatStore}
                active={activeConversationId === chat.id}
                onClick={() => handleSelectConversation(chat)}
              />
            ))}
          </ul>

          {filteredConversations.length === 0 && (
            <div className='flex flex-col items-center px-6 py-12 text-center'>
              <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-actionHover'>
                <i className='tabler-message-circle-search text-3xl text-textSecondary' />
              </div>

              <Typography variant='subtitle1' className='font-medium'>
                {searchValue.trim()
                  ? 'Percakapan tidak ditemukan'
                  : 'Belum ada percakapan'}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='mt-1'
              >
                {searchValue.trim()
                  ? 'Coba nama kontak atau grup lainnya.'
                  : 'Percakapan dan grup pelatihan akan muncul di sini.'}
              </Typography>
            </div>
          )}
        </ScrollWrapper>
      </Drawer>

      <UserProfileLeft
        userSidebar={userSidebar}
        setUserSidebar={setUserSidebar}
        profileUserData={chatStore.profileUser}
        dispatch={dispatch}
        isBelowLgScreen={isBelowLgScreen}
        isBelowSmScreen={isBelowSmScreen}
      />
    </>
  )
}

export default SidebarLeft

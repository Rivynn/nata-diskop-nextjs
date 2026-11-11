'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Backdrop from '@mui/material/Backdrop'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

// Type Imports
import type { RootState } from '@/redux-store'

// Slice Imports
import { getActiveUserData } from '@/redux-store/slices/chat'

// Component Imports
import SidebarLeft from './SidebarLeft'
import ChatContent from './ChatContent'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

type ConversationType = 'direct' | 'group'

export type ActiveConversation = {
  chatId: number
  type: ConversationType
}

const ChatWrapper = () => {
  // States
  const [backdropOpen, setBackdropOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [activeConversation, setActiveConversation] =
    useState<ActiveConversation | null>(null)

  // Refs
  const messageInputRef = useRef<HTMLDivElement>(null)

  // Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const chatStore = useSelector((state: RootState) => state.chatReducer)

  const isBelowLgScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('lg')
  )

  const isBelowMdScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  )

  const isBelowSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  )

  // Compatibility with Vuexy direct-chat flow
  const activeUser = (id: number) => {
    dispatch(getActiveUserData(id))

    const directChat = chatStore.chats.find(
      chat => chat.type !== 'group' && chat.userId === id
    )

    if (directChat) {
      setActiveConversation({
        chatId: directChat.id,
        type: 'direct'
      })
    }
  }

  // Handle selection from the unified sidebar
  const handleSelectConversation = (
    chatId: number,
    type: ConversationType
  ) => {
    const selectedChat = chatStore.chats.find(
      chat => chat.id === chatId
    )

    if (!selectedChat) return

    setActiveConversation({ chatId, type })

    if (type === 'direct') {
      dispatch(getActiveUserData(selectedChat.userId))
    }

    if (isBelowMdScreen) {
      setSidebarOpen(false)
      setBackdropOpen(false)
    }

    requestAnimationFrame(() => {
      messageInputRef.current?.focus()
    })
  }

  // Keep the selected conversation valid when data changes
  useEffect(() => {
    if (activeConversation) {
      const exists = chatStore.chats.some(
        chat => chat.id === activeConversation.chatId
      )

      if (!exists) {
        setActiveConversation(null)
      }

      return
    }

    // Initialize from Vuexy's existing active user
    if (chatStore.activeUser?.id != null) {
      const directChat = chatStore.chats.find(
        chat =>
          chat.type !== 'group' &&
          chat.userId === chatStore.activeUser?.id
      )

      if (directChat) {
        setActiveConversation({
          chatId: directChat.id,
          type: 'direct'
        })
      }
    }
  }, [activeConversation, chatStore.activeUser, chatStore.chats])

  // Focus input when the selected conversation changes
  useEffect(() => {
    if (activeConversation && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [activeConversation])

  // Close backdrop when leaving mobile layout
  useEffect(() => {
    if (!isBelowMdScreen && backdropOpen && sidebarOpen) {
      setBackdropOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowMdScreen])

  // Open backdrop on small screens
  useEffect(() => {
    if (!isBelowSmScreen && sidebarOpen) {
      setBackdropOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowSmScreen])

  // Close sidebar when backdrop closes
  useEffect(() => {
    if (!backdropOpen && sidebarOpen) {
      setSidebarOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  return (
    <div
      className={classNames(
        commonLayoutClasses.contentHeightFixed,
        'flex is-full overflow-hidden rounded relative',
        {
          border: settings.skin === 'bordered',
          'shadow-md': settings.skin !== 'bordered'
        }
      )}
    >
      <SidebarLeft
        chatStore={chatStore}
        getActiveUserData={activeUser}
        dispatch={dispatch}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isBelowLgScreen={isBelowLgScreen}
        isBelowMdScreen={isBelowMdScreen}
        isBelowSmScreen={isBelowSmScreen}
        messageInputRef={messageInputRef}
        onSelectConversation={handleSelectConversation}
      />

      <ChatContent
        chatStore={chatStore}
        dispatch={dispatch}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        setSidebarOpen={setSidebarOpen}
        isBelowMdScreen={isBelowMdScreen}
        isBelowLgScreen={isBelowLgScreen}
        isBelowSmScreen={isBelowSmScreen}
        messageInputRef={messageInputRef}
        activeConversation={activeConversation}
      />

      <Backdrop
        open={backdropOpen}
        onClick={() => setBackdropOpen(false)}
        className='absolute z-10'
      />
    </div>
  )
}

export default ChatWrapper

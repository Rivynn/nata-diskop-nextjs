'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type {
  FormEvent,
  KeyboardEvent,
  RefObject,
  MouseEvent
} from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

// Type Imports
import type { ContactType } from '@/types/apps/chatTypes'
import type { AppDispatch } from '@/redux-store'

// Slice Imports
import { sendMsg } from '@/redux-store/slices/chat'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

type ConversationType = 'direct' | 'group'

type ActiveConversation = {
  chatId: number
  type: ConversationType
} | null

type Props = {
  dispatch: AppDispatch
  activeUser?: ContactType | null
  activeConversation?: ActiveConversation
  isBelowSmScreen: boolean
  messageInputRef: RefObject<HTMLDivElement>
}

type EmojiPickerProps = {
  onChange: (value: string) => void
  isBelowSmScreen: boolean
  openEmojiPicker: boolean
  setOpenEmojiPicker: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void
  anchorRef: RefObject<HTMLButtonElement | null>
}

const EmojiPicker = ({
  onChange,
  isBelowSmScreen,
  openEmojiPicker,
  setOpenEmojiPicker,
  anchorRef
}: EmojiPickerProps) => (
  <Popper
    open={openEmojiPicker}
    transition
    disablePortal
    placement='top-start'
    className='z-[12]'
    anchorEl={anchorRef.current}
  >
    {({ TransitionProps, placement }) => (
      <Fade
        {...TransitionProps}
        style={{
          transformOrigin:
            placement === 'top-start' ? 'right top' : 'left top'
        }}
      >
        <Paper>
          <ClickAwayListener
            onClickAway={() => setOpenEmojiPicker(false)}
          >
            <span>
              <Picker
                emojiSize={18}
                theme='light'
                data={data}
                maxFrequentRows={1}
                onEmojiSelect={(emoji: { native: string }) => {
                  onChange(emoji.native)
                  setOpenEmojiPicker(false)
                }}
                {...(isBelowSmScreen && { perLine: 8 })}
              />
            </span>
          </ClickAwayListener>
        </Paper>
      </Fade>
    )}
  </Popper>
)

const SendMsgForm = ({
  dispatch,
  activeUser,
  activeConversation,
  isBelowSmScreen,
  messageInputRef
}: Props) => {
  const [msg, setMsg] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

  const anchorRef = useRef<HTMLButtonElement>(null)

  const open = Boolean(anchorEl)

  const isGroup = activeConversation?.type === 'group'

  const conversationKey = activeConversation
    ? `${activeConversation.type}-${activeConversation.chatId}`
    : activeUser
      ? `direct-user-${activeUser.id}`
      : null

  useEffect(() => {
    setMsg('')
    setOpenEmojiPicker(false)
    setAnchorEl(null)
  }, [conversationKey])

  const handleToggleEmojiPicker = () => {
    setOpenEmojiPicker(prev => !prev)
  }

  const handleClickMenu = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(prev => (prev ? null : event.currentTarget))
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSendMsg = (
    event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    const trimmedMessage = msg.trim()

    if (!trimmedMessage || !conversationKey) return

    if (isGroup && activeConversation) {
      /*
       * Penting:
       * Reducer sendMsg harus mendukung chatId dan type.
       * Jika reducer saat ini hanya menerima { msg },
       * ubah payload dan reducer pada slices/chat.ts.
       */
      dispatch(
        sendMsg({
          msg: trimmedMessage,
          chatId: activeConversation.chatId,
          type: 'group'
        } as Parameters<typeof sendMsg>[0])
      )
    } else if (activeUser) {
      // Pertahankan perilaku chat personal yang lama.
      dispatch(sendMsg({ msg: trimmedMessage }))
    } else {
      return
    }

    setMsg('')
    setOpenEmojiPicker(false)

    requestAnimationFrame(() => {
      messageInputRef.current?.focus()
    })
  }

  const appendEmoji = (value: string) => {
    setMsg(prev => prev + value)

    requestAnimationFrame(() => {
      messageInputRef.current?.focus()
    })
  }

  const renderEmojiPicker = () => (
    <EmojiPicker
      anchorRef={anchorRef}
      openEmojiPicker={openEmojiPicker}
      setOpenEmojiPicker={setOpenEmojiPicker}
      isBelowSmScreen={isBelowSmScreen}
      onChange={appendEmoji}
    />
  )

  const renderInputActions = () => (
    <div className='flex items-center gap-1'>
      {isBelowSmScreen ? (
        <>
          <IconButton
            id='option-menu'
            aria-haspopup='true'
            aria-expanded={open || undefined}
            aria-controls={open ? 'share-menu' : undefined}
            onClick={handleClickMenu}
            ref={anchorRef}
          >
            <i className='tabler-dots-vertical text-textPrimary' />
          </IconButton>

          <Menu
            id='share-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                handleToggleEmojiPicker()
                handleCloseMenu()
              }}
            >
              <i className='tabler-mood-smile mie-2' />
              Emoji
            </MenuItem>

            <MenuItem onClick={handleCloseMenu}>
              <i className='tabler-microphone mie-2' />
              Rekam suara
            </MenuItem>

            <MenuItem
              component='label'
              htmlFor='upload-img-mobile'
              onClick={handleCloseMenu}
            >
              <i className='tabler-paperclip mie-2' />
              Lampirkan file
              <input
                hidden
                type='file'
                id='upload-img-mobile'
                onChange={event => {
                  const file = event.target.files?.[0]

                  if (file) {
                    // Upload file belum terhubung ke backend.
                    console.info('Selected attachment:', file.name)
                  }
                }}
              />
            </MenuItem>
          </Menu>

          {renderEmojiPicker()}
        </>
      ) : (
        <>
          <IconButton
            ref={anchorRef}
            onClick={handleToggleEmojiPicker}
            aria-label='Pilih emoji'
          >
            <i className='tabler-mood-smile cursor-pointer text-textPrimary' />
          </IconButton>

          {renderEmojiPicker()}

          <IconButton
            aria-label='Rekam suara'
            title='Rekam suara'
          >
            <i className='tabler-microphone text-textPrimary' />
          </IconButton>

          <IconButton
            component='label'
            aria-label='Lampirkan file'
            title='Lampirkan file'
          >
            <i className='tabler-paperclip text-textPrimary' />
            <input
              hidden
              type='file'
              onChange={event => {
                const file = event.target.files?.[0]

                if (file) {
                  // Upload file belum terhubung ke backend.
                  console.info('Selected attachment:', file.name)
                }
              }}
            />
          </IconButton>
        </>
      )}

      {isBelowSmScreen ? (
        <CustomIconButton
          variant='contained'
          color='primary'
          type='submit'
          disabled={!msg.trim()}
          aria-label='Kirim pesan'
        >
          <i className='tabler-send' />
        </CustomIconButton>
      ) : (
        <Button
          variant='contained'
          color='primary'
          type='submit'
          disabled={!msg.trim()}
          endIcon={<i className='tabler-send' />}
        >
          Kirim
        </Button>
      )}
    </div>
  )

  if (!activeConversation && !activeUser) return null

  return (
    <form
      autoComplete='off'
      onSubmit={handleSendMsg}
      className='border-bs bg-backgroundPaper'
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder={
          isGroup
            ? 'Kirim pesan ke grup pelatihan...'
            : 'Tulis pesan...'
        }
        value={msg}
        className='p-4 sm:p-6'
        onChange={event => setMsg(event.target.value)}
        sx={{
          '& fieldset': {
            border: '0'
          },
          '& .MuiOutlinedInput-root': {
            background: 'var(--mui-palette-background-paper)',
            boxShadow: 'var(--mui-customShadows-xs) !important'
          }
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            // Submit melalui form agar perilaku Enter konsisten.
            event.currentTarget
              .closest('form')
              ?.requestSubmit()
          }
        }}
        size='small'
        inputRef={messageInputRef}
        slotProps={{
          input: {
            endAdornment: renderInputActions()
          }
        }}
      />
    </form>
  )
}

export default SendMsgForm

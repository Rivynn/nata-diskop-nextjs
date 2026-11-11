
'use client'

import Fab from '@mui/material/Fab'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/navigation'

const ChatButton = () => {
  const router = useRouter()
  const unreadCount = 128

  return (
    <Tooltip title='Chat Bantuan' placement='left'>
      <Fab
        aria-label={`Buka chat, ${unreadCount} pesan belum dibaca`}
        onClick={() => router.push('/admin/chat')}
        sx={{
          position: 'fixed',
          right: { xs: 20, sm: 30 },
          bottom: { xs: 82, sm: 92 },
          zIndex: theme => theme.zIndex.speedDial,

          width: 52,
          height: 52,
          minHeight: 52,
          borderRadius: '50%',

          color: '#fff',
          bgcolor: '#229D96',

          boxShadow: '0 5px 18px rgba(34, 157, 150, 0.24)',
          transition: 'transform 180ms ease, box-shadow 180ms ease',

          '&:hover': {
            bgcolor: '#198A84',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 22px rgba(34, 157, 150, 0.32)'
          }
        }}
      >
        <Badge
          badgeContent={unreadCount}
          max={99}
          color='error'
          overlap='circular'
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            '& .MuiBadge-badge': {
              top: -7,
              right: -9,
              transform: 'none',

              minWidth: 19,
              height: 19,
              px: 0.45,

              border: '2px solid #fff',
              borderRadius: '10px',

              fontSize: '0.62rem',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.3px',

              boxShadow: '0 2px 5px rgba(0,0,0,0.12)'
            }
          }}
        >
          <i
            className='tabler-message-circle'
            style={{
              fontSize: 23,
              lineHeight: 1
            }}
          />
        </Badge>
      </Fab>
    </Tooltip>
  )
}

export default ChatButton

'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'

// Component Imports
import RoleDialog from '@components/dialogs/role-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Style Imports
import styles from './styles.module.css'

type RoleUser = {
  id: number
  name: string
  username: string
  avatar: string
  avatarColor?: string
}

type CardDataType = {
  title: string
  key: string
  icon: string
  description: string
  color: 'success' | 'info' | 'warning' | 'secondary' | 'primary'
  users: RoleUser[]
}

// Vars
const cardData: CardDataType[] = [
  {
    title: 'Administrator',
    key: 'ADMIN',
    icon: 'tabler-shield',
    description: 'Mengelola sistem dan seluruh akses pengguna.',
    color: 'success',
    users: [
      {
        id: 1,
        name: 'Ahmad Fauzan',
        username: 'ahmad.fauzan',
        avatar: '1.png'
      },
      {
        id: 31,
        name: 'Rudi Hartono',
        username: 'rudi.hartono',
        avatar: '2.png'
      },
      {
        id: 32,
        name: 'Nurul Hidayah',
        username: 'nurul.hidayah',
        avatar: '3.png'
      }
    ]
  },
  {
    title: 'Pegawai',
    key: 'PEGAWAI',
    icon: 'tabler-building',
    description: 'Mengelola operasional program dan pelatihan.',
    color: 'info',
    users: [
      {
        id: 2,
        name: 'Siti Rahma',
        username: 'siti.rahma',
        avatar: '4.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        username: 'budi.santoso',
        avatar: '5.png'
      },
      {
        id: 17,
        name: 'Rina Wulandari',
        username: 'rina.wulandari',
        avatar: '6.png'
      }
    ]
  },
  {
    title: 'Pelatih',
    key: 'PELATIH',
    icon: 'tabler-presentation',
    description: 'Menyelenggarakan dan mengelola kegiatan pelatihan.',
    color: 'warning',
    users: [
      {
        id: 8,
        name: 'Fajar Hidayat',
        username: 'fajar.hidayat',
        avatar: '7.png'
      },
      {
        id: 9,
        name: 'Maya Sari',
        username: 'maya.sari',
        avatar: '8.png'
      },
      {
        id: 10,
        name: 'Arif Setiawan',
        username: 'arif.setiawan',
        avatar: '9.png'
      }
    ]
  },
  {
    title: 'Peserta',
    key: 'PESERTA',
    icon: 'tabler-users',
    description: 'Mengikuti program dan pengembangan kompetensi.',
    color: 'secondary',
    users: [
      {
        id: 4,
        name: 'Dewi Lestari',
        username: 'dewi.lestari',
        avatar: '10.png'
      },
      {
        id: 5,
        name: 'Rizky Maulana',
        username: 'rizky.maulana',
        avatar: '11.png'
      },
      {
        id: 7,
        name: 'Nadia Putri',
        username: 'nadia.putri',
        avatar: '12.png'
      }
    ]
  },
  {
    title: 'Mitra',
    key: 'MITRA',
    icon: 'tabler-building-skyscraper',
    description: 'Mendukung kerja sama dan kebutuhan tenaga kerja.',
    color: 'primary',
    users: [
      {
        id: 11,
        name: 'PT Banua Digital',
        username: 'banua.digital',
        avatar: '13.png'
      },
      {
        id: 12,
        name: 'CV Kreatif Banua',
        username: 'kreatif.banua',
        avatar: '14.png'
      },
      {
        id: 21,
        name: 'PT Borneo Mandiri',
        username: 'borneo.mandiri',
        avatar: '15.png'
      }
    ]
  }
]

const RoleCards = () => {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>,
    roleKey: string
  ) => {
    const card = cardRefs.current[roleKey]

    if (!card) return

    const rect = card.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((centerY - y) / centerY) * 3
    const rotateY = ((x - centerX) / centerX) * 3

    card.style.setProperty('--rotate-x', `${rotateX}deg`)
    card.style.setProperty('--rotate-y', `${rotateY}deg`)
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseEnter = (roleKey: string) => {
    setHoveredRole(roleKey)
  }

  const handleMouseLeave = (roleKey: string) => {
    const card = cardRefs.current[roleKey]

    if (card) {
      card.style.setProperty('--rotate-x', '0deg')
      card.style.setProperty('--rotate-y', '0deg')
    }

    setHoveredRole(null)
  }

  const handleCopyRole = async (roleKey: string) => {
    try {
      await navigator.clipboard.writeText(roleKey)
    } catch {
      // Clipboard API may be unavailable in some environments.
    }
  }

  return (
    <Grid container spacing={6}>
      {cardData.map(item => {
        const roleKey = item.key.toLowerCase()

        return (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.key}>
            <div
              ref={element => {
                cardRefs.current[roleKey] = element
              }}
              className={`${styles.roleCardWrapper} ${
                hoveredRole === item.key
                  ? styles.roleCardWrapperHovered
                  : ''
              }`}
              onMouseMove={event => handleMouseMove(event, roleKey)}
              onMouseEnter={() => handleMouseEnter(item.key)}
              onMouseLeave={() => handleMouseLeave(roleKey)}
            >
              <Card
                className={`${styles.roleCard} ${
                  styles[`roleCard${item.key}`]
                }`}
              >
                {/* Decorative Glow */}
                <div className={styles.roleGlow} />

                {/* Mouse Light */}
                <div className={styles.mouseLight} />

                <CardContent className={styles.cardContent}>
                  {/* =========================================
                      HEADER
                  ========================================= */}
                  <div className={styles.cardHeader}>
                    <div className={styles.userCount}>
                      <Typography
                        variant='body2'
                        className={styles.userCountText}
                      >
                        Total
                      </Typography>

                      <Typography
                        variant='body2'
                        className={styles.userCountNumber}
                      >
                        {item.users.length}
                      </Typography>

                      <Typography
                        variant='body2'
                        className={styles.userCountText}
                      >
                        pengguna
                      </Typography>
                    </div>

                    <AvatarGroup
                      total={item.users.length}
                      className={styles.avatarGroup}
                    >
                      {item.users.map(user => (
                        <Tooltip
                          key={user.id}
                          arrow
                          placement='top'
                          title={
                            <div className={styles.avatarTooltip}>
                              <span className={styles.avatarTooltipName}>
                                {user.name}
                              </span>

                              <span
                                className={styles.avatarTooltipUsername}
                              >
                                @{user.username}
                              </span>
                            </div>
                          }
                        >
                          <Avatar
                            alt={user.name}
                            src={`/images/avatars/${user.avatar}`}
                            className={styles.roleAvatar}
                            sx={{
                              backgroundColor: user.avatarColor
                            }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </div>

                  {/* =========================================
                      ROLE CONTENT
                  ========================================= */}
                  <div className={styles.roleContent}>
                    <div className={styles.roleIconWrapper}>
                      <div className={styles.roleIcon}>
                        <i className={item.icon} />
                      </div>
                    </div>

                    <div className={styles.roleInfo}>
                      <div className={styles.roleTitleRow}>
                        <Typography
                          variant='h5'
                          className={styles.roleTitle}
                        >
                          {item.title}
                        </Typography>

                        <Chip
                          label={item.key}
                          size='small'
                          variant='tonal'
                          color={item.color}
                          className={styles.roleChip}
                        />
                      </div>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        className={styles.roleDescription}
                      >
                        {item.description}
                      </Typography>
                    </div>
                  </div>

                  {/* =========================================
                      FOOTER / ACTIONS
                  ========================================= */}
                  <div className={styles.cardFooter}>
                    <Typography
                      variant='caption'
                      className={styles.systemRole}
                    >
                      Role sistem
                    </Typography>

                    <div className={styles.actionButtons}>
                      {/* =====================================
                          EDIT ROLE
                      ===================================== */}
                      <Tooltip
                        title='Edit tampilan role'
                        arrow
                        placement='top'
                      >
                        <span>
                          <OpenDialogOnElementClick
                            element={IconButton}
                            elementProps={{
                              size: 'small',
                              className: styles.actionButton,
                              'aria-label': `Edit ${item.title}`,
                              children: <i className='tabler-edit' />
                            }}
                            dialog={RoleDialog}
                            dialogProps={{
                              title: item.title
                            }}
                          />
                        </span>
                      </Tooltip>

                      {/* =====================================
                          VIEW PERMISSIONS
                      ===================================== */}
                      <Tooltip
                        title='Lihat hak akses'
                        arrow
                        placement='top'
                      >
                        <IconButton
                          size='small'
                          className={styles.actionButton}
                          aria-label={`Lihat hak akses ${item.title}`}
                        >
                          <i className='tabler-shield-check' />
                        </IconButton>
                      </Tooltip>

                      {/* =====================================
                          COPY ROLE KEY
                      ===================================== */}
                      <Tooltip
                        title='Salin kode role'
                        arrow
                        placement='top'
                      >
                        <IconButton
                          size='small'
                          className={styles.actionButton}
                          aria-label={`Salin kode ${item.key}`}
                          onClick={() => handleCopyRole(item.key)}
                        >
                          <i className='tabler-copy' />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default RoleCards

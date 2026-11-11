'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Hooks Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Style Imports
import styles from './SidebarProfile.module.css'

type SidebarProfileProps = {
  name?: string
  role?: string
  avatar?: string
}

const SidebarProfile = ({
                          name = 'Admin DISKOP',
                          role = 'Administrator',
                          avatar = '/images/avatars/tasya-pp.png'
                        }: SidebarProfileProps) => {
  const { isCollapsed } = useVerticalNav()

  const profileContent = (
    <div
      className={`${styles.profile} ${
        isCollapsed ? styles.collapsed : styles.expanded
      }`}
    >
      {/* Ambient glow */}
      <div className={styles.ambientGlow} />

      {/* Profile container */}
      <div className={styles.profileInner}>
        {/* Avatar */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarGlow} />

          <CustomAvatar
            src={avatar}
            size={isCollapsed ? 46 : 52}
            className={styles.avatar}
          />

          {/* Online status */}
          <span className={styles.online}>
            <span className={styles.onlinePulse} />
          </span>
        </div>

        {/* Profile information */}
        <div className={styles.profileInfo}>
          <Typography
            className={styles.name}
            color='text.primary'
          >
            {name}
          </Typography>

          <div className={styles.roleWrapper}>
            <span className={styles.roleDot} />

            <Typography
              variant='body2'
              color='text.secondary'
              className={styles.role}
            >
              {role}
            </Typography>
          </div>
        </div>

        {/* Collapsed indicator */}
        <div className={styles.collapsedIndicator}>
          <span />
        </div>
      </div>

      {/* Bottom accent */}
      {!isCollapsed && (
        <div className={styles.accentLine}>
          <span />
        </div>
      )}
    </div>
  )

  if (isCollapsed) {
    return (
      <Tooltip
        title={
          <div className={styles.tooltipContent}>
            <strong>{name}</strong>
            <span>{role}</span>
          </div>
        }
        placement='right'
        arrow
      >
        <div>{profileContent}</div>
      </Tooltip>
    )
  }

  return profileContent
}

export default SidebarProfile

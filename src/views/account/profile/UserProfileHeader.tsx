'use client'

import { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import styles from './UserProfileHeader.module.css'

const UserProfileHeader = () => {
  const [imageError, setImageError] = useState(false)

  const profile = {
    fullName: 'Muhammad Rizki Firdaus',
    username: 'rizkifirdaus',
    role: 'Administrator',
    location: 'Banjarmasin, Kalimantan Selatan',
    joinedAt: 'Bergabung Januari 2025',
    status: 'Akun Aktif',
    verified: true,
    avatar: '/images/avatars/tasya-pp.png'
  }

  return (
    <Card className={styles.profileHero}>
      {/* =========================================================
          PREMIUM COVER
      ========================================================== */}

      <Box className={styles.profileCover}>
        {/* Ambient glow */}
        <Box className={styles.profileGlowPrimary} />

        <Box className={styles.profileGlowSecondary} />

        {/* Fine grid */}
        <Box className={styles.profileCoverGrid} />

        {/* Floating particles */}
        {[
          {
            top: '20%',
            left: '13%',
            size: 4,
            delay: '0s'
          },
          {
            top: '34%',
            left: '27%',
            size: 2,
            delay: '1.5s'
          },
          {
            top: '17%',
            right: '34%',
            size: 3,
            delay: '2.5s'
          },
          {
            top: '54%',
            right: '17%',
            size: 4,
            delay: '3.5s'
          },
          {
            top: '70%',
            right: '39%',
            size: 2,
            delay: '1s'
          },
          {
            top: '40%',
            left: '52%',
            size: 2,
            delay: '4s'
          }
        ].map((particle, index) => (
          <Box
            key={index}
            className={styles.profileParticle}
            sx={{
              top: particle.top,
              left: particle.left,
              right: particle.right,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay
            }}
          />
        ))}

        {/* Orbit decoration */}
        <Box className={styles.profileOrbit} />

        <Box className={styles.profileOrbitSecondary} />
      </Box>

      {/* =========================================================
          PROFILE BODY
      ========================================================== */}

      <Box className={styles.profileBody}>
        <Box className={styles.profileIdentity}>
          {/* =====================================================
              AVATAR
          ====================================================== */}

          <Box className={styles.profileAvatarWrapper}>
            {/* Outer halo */}
            <Box className={styles.profileAvatarHalo} />

            {/* Rotating ring */}
            <Box className={styles.profileAvatarRing} />

            <Avatar
              src={!imageError ? profile.avatar : undefined}
              onError={() => setImageError(true)}
              className={styles.profileAvatar}
            >
              {profile.fullName
                .split(' ')
                .map(name => name[0])
                .slice(0, 2)
                .join('')}
            </Avatar>

            {/* Active indicator */}
            <Box className={styles.profileAvatarStatus} />
          </Box>

          {/* =====================================================
              IDENTITY
          ====================================================== */}

          <Box className={styles.profileIdentityContent}>
            <Box className={styles.profileNameRow}>
              <Typography
                component='h1'
                className={styles.profileName}
              >
                {profile.fullName}
              </Typography>

              {profile.verified && (
                <Box
                  component='i'
                  className={`tabler-circle-check-filled ${styles.profileVerified}`}
                />
              )}
            </Box>

            <Typography
              component='span'
              className={styles.profileUsername}
            >
              @{profile.username}
            </Typography>

            {/* Meta */}
            <Box className={styles.profileMeta}>
              <ProfileMeta
                icon='tabler-shield-check'
                label={profile.role}
              />

              <ProfileMeta
                icon='tabler-map-pin'
                label={profile.location}
              />

              <ProfileMeta
                icon='tabler-calendar'
                label={profile.joinedAt}
              />
            </Box>
          </Box>

          {/* =====================================================
              STATUS
          ====================================================== */}

          <Box className={styles.profileStatus}>
            <Chip
              icon={
                <Box
                  component='i'
                  className='tabler-circle-check-filled'
                  sx={{
                    fontSize: '16px !important'
                  }}
                />
              }
              label={profile.status}
              color='success'
              variant='tonal'
              className={styles.profileStatusChip}
            />
          </Box>
        </Box>

        {/* =======================================================
            SUMMARY
        ======================================================== */}

        <Divider className={styles.profileDivider} />

        <Box className={styles.profileSummary}>
          <ProfileSummary
            icon='tabler-user'
            label='Username'
            value={`@${profile.username}`}
          />

          <ProfileSummary
            icon='tabler-shield-check'
            label='Peran'
            value={profile.role}
            bordered
          />

          <ProfileSummary
            icon='tabler-circle-check'
            label='Status Akun'
            value='Terverifikasi'
            valueColor='success'
            bordered
          />
        </Box>
      </Box>
    </Card>
  )
}

/* ============================================================
   PROFILE META
============================================================ */

type ProfileMetaProps = {
  icon: string
  label: string
}

const ProfileMeta = ({
                       icon,
                       label
                     }: ProfileMetaProps) => {
  return (
    <Box className={styles.profileMetaItem}>
      <Box
        component='i'
        className={`${icon} ${styles.profileMetaIcon}`}
      />

      <Typography
        component='span'
        sx={{
          fontSize: 'inherit',
          fontWeight: 'inherit',
          color: 'inherit',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

/* ============================================================
   PROFILE SUMMARY
============================================================ */

type ProfileSummaryProps = {
  icon: string
  label: string
  value: string
  bordered?: boolean
  valueColor?: 'success' | 'default'
}

const ProfileSummary = ({
                          icon,
                          label,
                          value,
                          bordered = false,
                          valueColor = 'default'
                        }: ProfileSummaryProps) => {
  return (
    <Box
      className={[
        styles.profileSummaryItem,
        bordered
          ? styles.profileSummaryItemBordered
          : ''
      ].join(' ')}
    >
      <Box className={styles.profileSummaryIcon}>
        <Box
          component='i'
          className={icon}
        />
      </Box>

      <Box className={styles.profileSummaryContent}>
        <Typography
          component='span'
          className={styles.profileSummaryLabel}
        >
          {label}
        </Typography>

        <Typography
          component='span'
          className={[
            styles.profileSummaryValue,
            valueColor === 'success'
              ? styles.profileSummaryValueSuccess
              : ''
          ].join(' ')}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

export default UserProfileHeader

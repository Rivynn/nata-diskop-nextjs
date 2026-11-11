'use client'

import { useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

// Types
import type { SessionType } from './types'

// Styles
import styles from './SessionDetailsDrawer.module.css'

type Props = {
  open: boolean
  session: SessionType | null
  onClose: () => void
  onTerminate: (session: SessionType) => void
}

const roleLabels = {
  admin: 'Administrator',
  pegawai: 'Pegawai',
  pelatih: 'Pelatih',
  peserta: 'Peserta',
  mitra: 'Mitra'
}

const roleIcons = {
  admin: 'tabler-shield',
  pegawai: 'tabler-building',
  pelatih: 'tabler-presentation',
  peserta: 'tabler-users',
  mitra: 'tabler-building-skyscraper'
}

const SessionDetailsDrawer = ({
                                open,
                                session,
                                onClose,
                                onTerminate
                              }: Props) => {
  const [showIp, setShowIp] = useState(false)

  if (!session) return null

  const isActive = session.status === 'active'

  const isMobile =
    session.device === 'mobile'

  const isTablet =
    session.device === 'tablet'

  const deviceIcon = isMobile
    ? 'tabler-device-mobile'
    : isTablet
      ? 'tabler-device-tablet'
      : 'tabler-device-desktop'

  const roleLabel =
    roleLabels[session.user.role]

  const roleIcon =
    roleIcons[session.user.role]

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.drawerPaper
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <i className='tabler-shield-lock' />
          </div>

          <div className={styles.headerText}>
            <Typography
              variant='h5'
              className={styles.headerTitle}
            >
              Detail Sesi
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className={styles.headerSubtitle}
            >
              Informasi keamanan sesi login
            </Typography>
          </div>
        </div>

        <IconButton
          onClick={onClose}
          className={styles.closeButton}
          aria-label='Tutup'
        >
          <i className='tabler-x' />
        </IconButton>
      </div>

      <Divider />

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className={styles.content}>

        {/* ---------------------------------------------------------------- */}
        {/* User Profile                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className={styles.profileCard}>
          <div className={styles.profileGlow} />

          <div className={styles.profileMain}>
            <div className={styles.avatarWrapper}>
              <Avatar
                src={session.user.avatar}
                alt={session.user.name}
                className={styles.avatar}
              />

              <span
                className={
                  isActive
                    ? styles.onlineIndicator
                    : styles.idleIndicator
                }
              />
            </div>

            <div className={styles.profileInfo}>
              <Typography
                variant='h6'
                className={styles.profileName}
              >
                {session.user.name}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className={styles.username}
              >
                @{session.user.username}
              </Typography>

              <div className={styles.roleBadge}>
                <i
                  className={`${roleIcon} ${styles.roleIcon}`}
                />

                <span>{roleLabel}</span>
              </div>
            </div>
          </div>

          {/* Session status */}
          <div
            className={
              isActive
                ? styles.sessionActive
                : styles.sessionIdle
            }
          >
            <span
              className={
                isActive
                  ? styles.statusDotActive
                  : styles.statusDotIdle
              }
            />

            <span>
              {isActive
                ? 'Sesi Aktif'
                : 'Tidak Aktif / Idle'}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Current Session                                                   */}
        {/* ---------------------------------------------------------------- */}

        {session.isCurrent && (
          <div className={styles.currentSession}>
            <div className={styles.currentSessionIcon}>
              <i className='tabler-device-desktop' />
            </div>

            <div className={styles.currentSessionContent}>
              <Typography
                variant='body2'
                className={styles.currentSessionTitle}
              >
                Sesi saat ini
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Perangkat yang sedang digunakan
                untuk mengakses akun ini.
              </Typography>
            </div>

            <Chip
              label='Anda'
              size='small'
              color='success'
              variant='tonal'
            />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Device Information                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className='tabler-device-desktop-analytics' />
            </div>

            <div>
              <Typography
                variant='subtitle1'
                className={styles.sectionTitle}
              >
                Perangkat & Akses
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Informasi perangkat yang digunakan
              </Typography>
            </div>
          </div>

          <div className={styles.detailsCard}>
            {/* Device */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className={deviceIcon} />
                <span>Perangkat</span>
              </div>

              <div className={styles.detailValue}>
                {session.operatingSystem}
              </div>
            </div>

            <Divider />

            {/* Browser */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-world-www' />
                <span>Browser</span>
              </div>

              <div className={styles.detailValue}>
                {session.browser}
              </div>
            </div>

            <Divider />

            {/* IP */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-network' />
                <span>IP Address</span>
              </div>

              <div className={styles.ipValue}>
                <Typography
                  component='span'
                  className={styles.ipAddress}
                >
                  {showIp
                    ? session.ipAddress
                    : '•••.•••.•••.•••'}
                </Typography>

                <Tooltip
                  title={
                    showIp
                      ? 'Sembunyikan IP'
                      : 'Tampilkan IP'
                  }
                  arrow
                >
                  <IconButton
                    size='small'
                    onClick={() =>
                      setShowIp(prev => !prev)
                    }
                    className={
                      styles.ipToggle
                    }
                    aria-label={
                      showIp
                        ? 'Sembunyikan IP'
                        : 'Tampilkan IP'
                    }
                  >
                    <i
                      className={
                        showIp
                          ? 'tabler-eye-off'
                          : 'tabler-eye'
                      }
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <Divider />

            {/* Location */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-map-pin' />
                <span>Lokasi</span>
              </div>

              <Typography
                className={
                  styles.detailValueLong
                }
              >
                {session.location}
              </Typography>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Activity                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className='tabler-history' />
            </div>

            <div>
              <Typography
                variant='subtitle1'
                className={styles.sectionTitle}
              >
                Aktivitas Sesi
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Riwayat waktu akses sesi
              </Typography>
            </div>
          </div>

          <div className={styles.timeline}>
            {/* Login */}
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <i className='tabler-login-2' />
              </div>

              <div className={styles.timelineContent}>
                <Typography
                  variant='body2'
                  className={styles.timelineTitle}
                >
                  Login
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  {session.loginAt}
                </Typography>
              </div>
            </div>

            {/* Connector */}
            <div
              className={
                styles.timelineConnector
              }
            />

            {/* Activity */}
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <i className='tabler-activity' />
              </div>

              <div className={styles.timelineContent}>
                <Typography
                  variant='body2'
                  className={styles.timelineTitle}
                >
                  Aktivitas terakhir
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  {session.lastActivityAt}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Security Notice                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className={styles.securityNotice}>
          <div className={styles.securityNoticeIcon}>
            <i className='tabler-shield-check' />
          </div>

          <div>
            <Typography
              variant='body2'
              className={styles.securityNoticeTitle}
            >
              Sesi terlindungi
            </Typography>

            <Typography
              variant='caption'
              color='text.secondary'
            >
              Informasi sensitif seperti token
              sesi dan kredensial tidak ditampilkan
              di halaman ini.
            </Typography>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ---------------------------------------------------------------- */}

        {!session.isCurrent && (
          <div className={styles.actionSection}>
            <Button
              color='error'
              variant='tonal'
              fullWidth
              startIcon={
                <i className='tabler-logout' />
              }
              onClick={() =>
                onTerminate(session)
              }
              className={styles.terminateButton}
            >
              Putuskan Sesi
            </Button>

            <Typography
              variant='caption'
              color='text.secondary'
              className={styles.actionHint}
            >
              Sesi akan segera dihentikan dan
              pengguna perlu login kembali pada
              perangkat tersebut.
            </Typography>
          </div>
        )}

        {session.isCurrent && (
          <div className={styles.currentNotice}>
            <i className='tabler-info-circle' />

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Sesi ini sedang digunakan oleh akun
              yang sedang aktif dan tidak dapat
              diputuskan dari perangkat ini.
            </Typography>
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default SessionDetailsDrawer

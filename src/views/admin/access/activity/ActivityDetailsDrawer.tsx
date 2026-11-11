'use client'

import { useState } from 'react'

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import type {
  ActivityAction,
  ActivityType
} from './types'

import styles from './ActivityDetailsDrawer.module.css'

type Props = {
  open: boolean
  activity: ActivityType | null
  onClose: () => void
}

const actionLabels: Record<
  ActivityAction,
  string
> = {
  login: 'Login',
  logout: 'Logout',
  login_failed: 'Login Gagal',
  create: 'Membuat Data',
  update: 'Mengubah Data',
  delete: 'Menghapus Data',
  approve: 'Menyetujui',
  reject: 'Menolak',
  verify: 'Verifikasi',
  change_role: 'Mengubah Role',
  change_password: 'Mengubah Password',
  publish: 'Publikasi',
  unpublish: 'Batalkan Publikasi'
}

const roleLabels = {
  admin: 'Administrator',
  pegawai: 'Pegawai',
  pelatih: 'Pelatih',
  peserta: 'Peserta',
  mitra: 'Mitra'
}

const ActivityDetailsDrawer = ({
                                 open,
                                 activity,
                                 onClose
                               }: Props) => {
  const [showIp, setShowIp] =
    useState(false)

  if (!activity) return null

  const isSuccess =
    activity.status === 'success'

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.drawer
      }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <i className='tabler-history' />
          </div>

          <div>
            <Typography
              variant='h5'
              className={styles.title}
            >
              Detail Aktivitas
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Riwayat aktivitas pengguna
            </Typography>
          </div>
        </div>

        <IconButton
          onClick={onClose}
          className={styles.closeButton}
        >
          <i className='tabler-x' />
        </IconButton>
      </div>

      <Divider />

      <div className={styles.content}>
        {/* Activity Summary */}
        <div className={styles.activitySummary}>
          <div
            className={
              isSuccess
                ? styles.summaryIconSuccess
                : styles.summaryIconFailed
            }
          >
            <i
              className={
                activity.action ===
                'delete'
                  ? 'tabler-trash'
                  : activity.action ===
                  'login_failed'
                    ? 'tabler-alert-circle'
                    : 'tabler-activity'
              }
            />
          </div>

          <div className={styles.summaryInfo}>
            <Typography
              variant='h6'
              className={styles.activityTitle}
            >
              {activity.activity}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              {activity.module}
              {activity.target
                ? ` · ${activity.target.name}`
                : ''}
            </Typography>

            <div className={styles.summaryBadges}>
              <Chip
                size='small'
                variant='tonal'
                color='primary'
                label={
                  actionLabels[
                    activity.action
                    ]
                }
              />

              <Chip
                size='small'
                variant='tonal'
                color={
                  isSuccess
                    ? 'success'
                    : 'error'
                }
                label={
                  isSuccess
                    ? 'Berhasil'
                    : 'Gagal'
                }
              />
            </div>
          </div>
        </div>

        {/* User */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className='tabler-user' />
            </div>

            <div>
              <Typography
                variant='subtitle1'
                className={styles.sectionTitle}
              >
                Pengguna
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Akun yang melakukan aktivitas
              </Typography>
            </div>
          </div>

          <div className={styles.userCard}>
            <Avatar
              src={activity.user.avatar}
              alt={activity.user.name}
              className={styles.avatar}
            />

            <div className={styles.userInfo}>
              <Typography
                className={styles.userName}
              >
                {activity.user.name}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                @{activity.user.username}
              </Typography>

              <span className={styles.role}>
                {roleLabels[
                  activity.user.role
                  ]}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.descriptionBox}>
          <div className={styles.descriptionIcon}>
            <i className='tabler-align-left' />
          </div>

          <div>
            <Typography
              variant='body2'
              className={styles.descriptionTitle}
            >
              Deskripsi
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              {activity.description}
            </Typography>
          </div>
        </div>

        {/* Target */}
        {activity.target && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <i className='tabler-target' />
              </div>

              <div>
                <Typography
                  variant='subtitle1'
                  className={styles.sectionTitle}
                >
                  Objek Aktivitas
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Data yang terpengaruh
                </Typography>
              </div>
            </div>

            <div className={styles.targetCard}>
              <div>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {activity.target.type.toUpperCase()}
                </Typography>

                <Typography
                  className={
                    styles.targetName
                  }
                >
                  {activity.target.name}
                </Typography>
              </div>

              <span
                className={
                  styles.targetId
                }
              >
                #{activity.target.id}
              </span>
            </div>
          </div>
        )}

        {/* Changes */}
        {activity.metadata && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <i className='tabler-arrows-diff' />
              </div>

              <div>
                <Typography
                  variant='subtitle1'
                  className={styles.sectionTitle}
                >
                  Perubahan
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Nilai sebelum dan sesudah
                </Typography>
              </div>
            </div>

            <div className={styles.changeCard}>
              <div className={styles.changeRow}>
                <span className={styles.changeLabel}>
                  Sebelum
                </span>

                <span className={styles.beforeValue}>
                  {activity.metadata.before ??
                    '—'}
                </span>
              </div>

              <div className={styles.changeArrow}>
                <i className='tabler-arrow-down' />
              </div>

              <div className={styles.changeRow}>
                <span className={styles.changeLabel}>
                  Sesudah
                </span>

                <span className={styles.afterValue}>
                  {activity.metadata.after ??
                    '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Request Information */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className='tabler-network' />
            </div>

            <div>
              <Typography
                variant='subtitle1'
                className={styles.sectionTitle}
              >
                Informasi Akses
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Detail koneksi saat aktivitas
              </Typography>
            </div>
          </div>

          <div className={styles.detailsCard}>
            {/* IP */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-world' />
                IP Address
              </div>

              <div className={styles.ipValue}>
                <Typography
                  className={styles.ip}
                >
                  {showIp
                    ? activity.ipAddress
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
                      styles.ipButton
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
                Lokasi
              </div>

              <Typography
                className={
                  styles.detailValue
                }
              >
                {activity.location}
              </Typography>
            </div>

            <Divider />

            {/* Device */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-device-desktop' />
                Perangkat
              </div>

              <Typography
                className={
                  styles.detailValue
                }
              >
                {activity.device}
              </Typography>
            </div>

            <Divider />

            {/* Browser */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-browser' />
                Browser
              </div>

              <Typography
                className={
                  styles.detailValue
                }
              >
                {activity.browser}
              </Typography>
            </div>

            <Divider />

            {/* Time */}
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <i className='tabler-clock' />
                Waktu
              </div>

              <Typography
                className={
                  styles.detailValue
                }
              >
                {activity.createdAt}
              </Typography>
            </div>
          </div>
        </div>

        {/* Audit Notice */}
        <div className={styles.auditNotice}>
          <div className={styles.auditIcon}>
            <i className='tabler-shield-check' />
          </div>

          <div>
            <Typography
              variant='body2'
              className={styles.auditTitle}
            >
              Catatan audit
            </Typography>

            <Typography
              variant='caption'
              color='text.secondary'
            >
              Log aktivitas bersifat read-only dan
              digunakan sebagai rekam jejak keamanan
              sistem.
            </Typography>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default ActivityDetailsDrawer
